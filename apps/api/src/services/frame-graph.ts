/**
 * CIS Frame Graph Service
 *
 * Manages frame_entity (nodes) and frame_relationship (edges) in the Frame Graph.
 * Called after sealAdmission — audit chain write always precedes Frame Graph write.
 *
 * Classification event flow (EE_CIS_AUDIT_CHAIN_v1.0 Section 2.2):
 *   Step 3: sealAdmission → admission_audit_sealed (returns sealedRecordId)
 *   Step 4: createClassifiesEdge → frame_relationship (audit_record_id = sealedRecordId)
 *   Step 5: updateCaseFrameEntity → frame_entity (c_value, r_state if changed)
 */

import type { Prisma } from '@prisma/client';
import { RTT_THEORY_VERSION } from './constraint-registry.js';
import prisma from '../prisma.js';

// The CIS node is a singleton — one frame_entity record representing CIS itself.
// Level: implementation. R-state: R2 (operators recognise the gap between
// CIS v1 implementation and RTT v1.9 theory requirements).
const CIS_IDENTITY = 'CIS v1 — RTT-based frame classification system';

/**
 * Get or create the singleton CIS frame entity.
 * CIS is the source node of every classifies edge.
 */
export async function getOrCreateCisFrameEntity(
  tx: Prisma.TransactionClient
): Promise<string> {
  const existing = await tx.$queryRaw<Array<{ id: string }>>`
    SELECT id FROM frame_entity WHERE identity = ${CIS_IDENTITY} LIMIT 1
  `;
  if (existing.length > 0) return existing[0]!.id;

  const created = await tx.$queryRaw<Array<{ id: string }>>`
    INSERT INTO frame_entity (identity, level, r_state, r_confidence, rtt_theory_version)
    VALUES (
      ${CIS_IDENTITY},
      'implementation',
      'R2',
      0.65,
      ${RTT_THEORY_VERSION}
    )
    ON CONFLICT DO NOTHING
    RETURNING id
  `;
  if (created.length > 0) return created[0]!.id;

  // Race condition: concurrent insert won — re-fetch
  const refetch = await tx.$queryRaw<Array<{ id: string }>>`
    SELECT id FROM frame_entity WHERE identity = ${CIS_IDENTITY} LIMIT 1
  `;
  return refetch[0]!.id;
}

/**
 * Get or create the frame entity for a CIS case.
 * Each case maps to one frame_entity node (the domain frame under investigation).
 * Identity: 'case:<caseId>' — stable, queryable, does not depend on case title.
 * Level defaults to 'organization' — the most common CIS investigation domain.
 */
export async function getOrCreateCaseFrameEntity(
  tx: Prisma.TransactionClient,
  caseId: string
): Promise<string> {
  const identity = `case:${caseId}`;

  const existing = await tx.$queryRaw<Array<{ id: string }>>`
    SELECT id FROM frame_entity WHERE identity = ${identity} LIMIT 1
  `;
  if (existing.length > 0) return existing[0]!.id;

  const created = await tx.$queryRaw<Array<{ id: string }>>`
    INSERT INTO frame_entity (identity, level, rtt_theory_version)
    VALUES (
      ${identity},
      'organization',
      ${RTT_THEORY_VERSION}
    )
    ON CONFLICT DO NOTHING
    RETURNING id
  `;
  if (created.length > 0) return created[0]!.id;

  const refetch = await tx.$queryRaw<Array<{ id: string }>>`
    SELECT id FROM frame_entity WHERE identity = ${identity} LIMIT 1
  `;
  return refetch[0]!.id;
}

// ─── Signature classification ─────────────────────────────────────────────

/**
 * Map the dominant SI dimension to a transition signature type.
 * Rejected signals register as exception_proliferation — the frame encountered
 * an observation it could not absorb above threshold.
 */
function dominantSignature(params: {
  siRate: number;
  siDirection: number;
  siRelationship: number;
  siConfiguration: number;
  decision: string;
}): 'contradiction_density' | 'reinterpretation' | 'authority_drift' | 'category_instability' | 'exception_proliferation' {
  if (params.decision === 'REJECTED') return 'exception_proliferation';

  const dims = [
    { sig: 'contradiction_density' as const, score: params.siRate },
    { sig: 'reinterpretation'      as const, score: params.siDirection },
    { sig: 'authority_drift'       as const, score: params.siRelationship },
    { sig: 'category_instability'  as const, score: params.siConfiguration },
  ];
  return dims.reduce((a, b) => a.score >= b.score ? a : b).sig;
}

/**
 * Update the case frame entity's state after a classification:
 *   - Increment the dominant transition signature count
 *   - Accumulate c_value (si_score × 0.2 for admitted, 0.05 for rejected, cap 5.0)
 */
export async function updateCaseFrameEntityState(
  tx: Prisma.TransactionClient,
  caseFrameId: string,
  params: {
    siScore: number;
    siRate: number;
    siDirection: number;
    siRelationship: number;
    siConfiguration: number;
    decision: string;
  }
): Promise<void> {
  const sig = dominantSignature(params);
  const cDelta = params.decision !== 'REJECTED'
    ? Math.min(params.siScore * 0.2, 0.2)
    : 0.05;

  // Each sig_* column updated via CASE — column names cannot be parameterized
  await tx.$executeRaw`
    UPDATE frame_entity SET
      sig_contradiction_density = sig_contradiction_density +
        CASE WHEN ${sig} = 'contradiction_density' THEN 1 ELSE 0 END,
      sig_exception_proliferation = sig_exception_proliferation +
        CASE WHEN ${sig} = 'exception_proliferation' THEN 1 ELSE 0 END,
      sig_reinterpretation = sig_reinterpretation +
        CASE WHEN ${sig} = 'reinterpretation' THEN 1 ELSE 0 END,
      sig_authority_drift = sig_authority_drift +
        CASE WHEN ${sig} = 'authority_drift' THEN 1 ELSE 0 END,
      sig_category_instability = sig_category_instability +
        CASE WHEN ${sig} = 'category_instability' THEN 1 ELSE 0 END,
      c_value = LEAST(5.0, COALESCE(c_value, 0.0) + ${cDelta}),
      last_updated = NOW()
    WHERE id = ${caseFrameId}::uuid
  `;
}

// ─── CTOP orientation ─────────────────────────────────────────────────────

export type CisOrientation = 'DETECTION' | 'PRESERVATION_PLANNING';

/**
 * CTOP switching criterion (EE_RTT_THEORY_v1.9):
 * Below R5 → Detection. R5 confirmed → Preservation Planning.
 * Null r_state (frame not yet assessed) → Detection.
 */
export function ctopOrientation(rState: string | null): CisOrientation {
  if (rState === 'R5' || rState === 'R6' || rState === 'R7' || rState === 'R8') {
    return 'PRESERVATION_PLANNING';
  }
  return 'DETECTION';
}

/**
 * Get the current Frame Entity state for a case, including CTOP orientation.
 */
export async function getCaseFrameState(
  caseId: string
): Promise<{
  frameEntityId: string;
  identity: string;
  level: string;
  cValue: number | null;
  rState: string | null;
  rConfidence: number | null;
  topologyType: string | null;
  sigCounts: Record<string, number>;
  orientation: CisOrientation;
  rttTheoryVersion: string;
} | null> {
  // Use raw query — frame_entity is not in Prisma schema
  const rows = await prisma.$queryRaw<Array<{
    id: string; identity: string; level: string;
    c_value: number | null; r_state: string | null;
    r_confidence: number | null; topology_type: string | null;
    sig_contradiction_density: number;
    sig_exception_proliferation: number;
    sig_ontology_patch: number;
    sig_category_instability: number;
    sig_authority_drift: number;
    sig_reinterpretation: number;
    sig_recurrent_loop: number;
    rtt_theory_version: string;
  }>>`
    SELECT id, identity, level, c_value, r_state, r_confidence, topology_type,
           sig_contradiction_density, sig_exception_proliferation, sig_ontology_patch,
           sig_category_instability, sig_authority_drift, sig_reinterpretation,
           sig_recurrent_loop, rtt_theory_version
    FROM frame_entity
    WHERE identity = ${'case:' + caseId}
    LIMIT 1
  `;

  if (rows.length === 0) return null;
  const fe = rows[0]!;

  return {
    frameEntityId: fe.id,
    identity: fe.identity,
    level: fe.level,
    cValue: fe.c_value,
    rState: fe.r_state,
    rConfidence: fe.r_confidence,
    topologyType: fe.topology_type,
    sigCounts: {
      contradiction_density:  fe.sig_contradiction_density,
      exception_proliferation: fe.sig_exception_proliferation,
      ontology_patch:         fe.sig_ontology_patch,
      category_instability:   fe.sig_category_instability,
      authority_drift:        fe.sig_authority_drift,
      reinterpretation:       fe.sig_reinterpretation,
      recurrent_loop:         fe.sig_recurrent_loop,
    },
    orientation: ctopOrientation(fe.r_state),
    rttTheoryVersion: fe.rtt_theory_version,
  };
}

/**
 * Create a classifies edge from the CIS node to the case frame entity.
 * audit_record_id is the FK to admission_audit_sealed — signal payload stays
 * in the hash chain, the edge is the bridge.
 */
export async function createClassifiesEdge(
  tx: Prisma.TransactionClient,
  params: {
    cisFrameId: string;
    caseFrameId: string;
    auditRecordId: string;
  }
): Promise<void> {
  await tx.$executeRaw`
    INSERT INTO frame_relationship (
      source_frame_id,
      target_frame_id,
      relationship_type,
      direction,
      audit_record_id,
      rtt_theory_version
    ) VALUES (
      ${params.cisFrameId}::uuid,
      ${params.caseFrameId}::uuid,
      'classifies',
      'source_to_target',
      ${params.auditRecordId}::uuid,
      ${RTT_THEORY_VERSION}
    )
  `;
}
