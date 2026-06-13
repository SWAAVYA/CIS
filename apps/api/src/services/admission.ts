/**
 * CIS Admission Service
 *
 * Single authoritative implementation of signal admission logic.
 * Previously duplicated in signals.ts and intake.ts — now extracted here
 * so both routes use identical logic and both produce sealed audit records.
 *
 * Every admission decision:
 *  1. Evaluates signal against the active ConstraintSet (not raw env vars)
 *  2. Writes to admission_audit (existing mutable record for queries)
 *  3. Writes to admission_audit_sealed (hash-chained, tamper-evident)
 *  4. Returns the seal result so routes can include it in their response
 */

import type { Prisma } from '@prisma/client';
import { sealAdmission, type SealResult } from './audit-chain.js';
import { ACTIVE_CONSTRAINTS, RTT_THEORY_VERSION } from './constraint-registry.js';
import {
  getOrCreateCisFrameEntity,
  getOrCreateCaseFrameEntity,
  createClassifiesEdge,
  updateCaseFrameEntityState,
} from './frame-graph.js';

export interface AdmissionResult {
  decision: string;
  reason: string;
  seal: SealResult;
}

export interface AdmissionParams {
  tx: Prisma.TransactionClient;
  signalId: string;
  caseId: string;
  /** Original signal text — frozen into the seal */
  signalContent: string;
  siScore: number;
  siRate: number;
  siDirection: number;
  siRelationship: number;
  siConfiguration: number;
  siMaxDimension: number;
  significance: number;
}

export async function runAdmission(params: AdmissionParams): Promise<AdmissionResult> {
  const {
    tx, signalId, caseId, signalContent,
    siScore, siRate, siDirection, siRelationship, siConfiguration,
    siMaxDimension, significance,
  } = params;

  const {
    SI_MIN_THRESHOLD, SIG_THRESHOLD, SI_DIM_THRESHOLD,
    version: constraintVersion,
  } = ACTIVE_CONSTRAINTS;

  const passesWeighted  = siScore >= SI_MIN_THRESHOLD;
  const passesDimension = siMaxDimension >= SI_DIM_THRESHOLD;

  // ── Reject ──────────────────────────────────────────────────────────────
  if (!passesWeighted && !passesDimension) {
    const reason =
      `SI score ${siScore} below SI_min ${SI_MIN_THRESHOLD} ` +
      `and max dimension ${siMaxDimension} below ${SI_DIM_THRESHOLD}`;

    await tx.signals.update({
      where: { id: signalId },
      data: { lifecycle_status: 'EXPIRED', rejection_reason: reason, rejection_lp: 'LP-1' },
    });
    await tx.admission_audit.create({
      data: {
        signal_id: signalId, case_id: caseId, decision: 'REJECTED',
        si_score: siScore, significance,
        si_threshold: SI_MIN_THRESHOLD, sig_threshold: SIG_THRESHOLD,
        rejection_reason: reason,
      },
    });
    await tx.signal_events.create({
      data: {
        signal_id: signalId, case_id: caseId,
        from_status: 'CANDIDATE', to_status: 'EXPIRED',
        reason, lp_flag: 'LP-1',
      },
    });

    const seal = await sealAdmission(tx, {
      signalId, caseId, signalContent,
      siRate, siDirection, siRelationship, siConfiguration,
      siScore, siMaxDimension, significance,
      decision: 'REJECTED',
      constraintVersion,
      rttTheoryVersion: RTT_THEORY_VERSION,
      siThreshold: SI_MIN_THRESHOLD,
      sigThreshold: SIG_THRESHOLD,
      dimThreshold: SI_DIM_THRESHOLD,
    });

    await writeClassifiesEdge(tx, caseId, seal.sealedRecordId, {
      siScore, siRate, siDirection, siRelationship, siConfiguration, decision: 'REJECTED',
    });
    return { decision: 'REJECTED', reason, seal };
  }

  // ── Admit ────────────────────────────────────────────────────────────────
  const meetsSignificance = significance >= SIG_THRESHOLD;
  const decision = meetsSignificance ? 'ADMITTED' : 'SUB_THRESHOLD_RETAINED';
  const reason = meetsSignificance
    ? `SI score ${siScore} above SI_min ${SI_MIN_THRESHOLD}. ` +
      `Significance ${significance} above threshold ${SIG_THRESHOLD}.`
    : `SI score ${siScore} above SI_min ${SI_MIN_THRESHOLD}. ` +
      `Significance ${significance} below threshold ${SIG_THRESHOLD} — admitted per WSP sub-threshold preservation.`;

  await tx.signals.update({
    where: { id: signalId },
    data: {
      lifecycle_status: 'ADMITTED',
      is_wsp_protected: true,
      admitted_at: new Date(),
      admission_reason: reason,
    },
  });
  await tx.admission_audit.create({
    data: {
      signal_id: signalId, case_id: caseId, decision,
      si_score: siScore, significance,
      si_threshold: SI_MIN_THRESHOLD, sig_threshold: SIG_THRESHOLD,
    },
  });
  await tx.signal_events.create({
    data: {
      signal_id: signalId, case_id: caseId,
      from_status: 'CANDIDATE', to_status: 'ADMITTED', reason,
    },
  });

  if (meetsSignificance) {
    await tx.signals.update({ where: { id: signalId }, data: { lifecycle_status: 'RETAINED' } });
    await tx.signal_events.create({
      data: {
        signal_id: signalId, case_id: caseId,
        from_status: 'ADMITTED', to_status: 'RETAINED',
        reason: `Significance ${significance} meets threshold ${SIG_THRESHOLD}`,
      },
    });
  }

  const seal = await sealAdmission(tx, {
    signalId, caseId, signalContent,
    siRate, siDirection, siRelationship, siConfiguration,
    siScore, siMaxDimension, significance,
    decision,
    constraintVersion,
    rttTheoryVersion: RTT_THEORY_VERSION,
    siThreshold: SI_MIN_THRESHOLD,
    sigThreshold: SIG_THRESHOLD,
    dimThreshold: SI_DIM_THRESHOLD,
  });

  await writeClassifiesEdge(tx, caseId, seal.sealedRecordId, {
    siScore, siRate, siDirection, siRelationship, siConfiguration, decision,
  });
  return { decision, reason, seal };
}

/**
 * Step 4 of the classification event flow (EE_CIS_AUDIT_CHAIN_v1.0 Section 2.2):
 * After audit chain is written, create the classifies edge in the Frame Graph.
 * Audit chain write always precedes Frame Graph write — sealedRecordId guarantees
 * the FK target exists before the edge is created.
 */
async function writeClassifiesEdge(
  tx: Prisma.TransactionClient,
  caseId: string,
  sealedRecordId: string,
  signalParams: {
    siScore: number;
    siRate: number;
    siDirection: number;
    siRelationship: number;
    siConfiguration: number;
    decision: string;
  }
): Promise<void> {
  const [cisFrameId, caseFrameId] = await Promise.all([
    getOrCreateCisFrameEntity(tx),
    getOrCreateCaseFrameEntity(tx, caseId),
  ]);
  await createClassifiesEdge(tx, { cisFrameId, caseFrameId, auditRecordId: sealedRecordId });
  await updateCaseFrameEntityState(tx, caseFrameId, signalParams);
}
