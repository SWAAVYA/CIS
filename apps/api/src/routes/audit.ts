/**
 * CIS Audit API
 *
 * Exposes the hash-chained admission audit chain for verification and replay.
 *
 * GET  /api/audit/chain                  — paginated list of sealed records
 * GET  /api/audit/chain/verify           — verify full chain integrity
 * GET  /api/audit/signal/:signalId       — sealed record for a specific signal
 * POST /api/audit/signal/:signalId/replay — re-run admission from frozen state, verify match
 * GET  /api/audit/constraints/active     — the currently active constraint set
 * POST /api/audit/checkpoint             — compute and store a Merkle checkpoint
 * GET  /api/audit/checkpoints            — list all Merkle checkpoints
 * GET  /api/audit/frame/:caseId          — Frame Entity state + CTOP orientation for a case
 */

import { Router } from 'express';
import prisma from '../prisma.js';
import {
  computeInputHash, computeSealHash, stableSerialize,
  admissionLeafHash, merkleRootFromLeaves, buildMerkleProof, verifyMerkleInclusion,
  GENESIS_PREV_HASH, buildDecisionTrace,
} from '../services/audit-chain.js';
import { ACTIVE_CONSTRAINTS, verifyConstraintDigest } from '../services/constraint-registry.js';
import { decideAdmission } from '../services/admission-decision.js';
import {
  sealConstraintActivation,
  listActivations,
  buildActivationPayload,
  type SignedActivation,
} from '../services/constraint-activation.js';
import { getGateState } from '../services/admission-gate.js';
import { getCaseFrameState, assessRState, recomputeCaseFrameState } from '../services/frame-graph.js';
import { anchorActivationInDEL, fetchDELAnchorForHash } from '../services/del-anchor.js';

const router = Router();

// ── GET /api/audit/constraints/active ─────────────────────────────────────
router.get('/constraints/active', (_req, res) => {
  const gate = getGateState();
  res.json({
    version:                    ACTIVE_CONSTRAINTS.version,
    digest:                     ACTIVE_CONSTRAINTS.digest,
    activated_at:               ACTIVE_CONSTRAINTS.activatedAt,
    SI_MIN_THRESHOLD:           ACTIVE_CONSTRAINTS.SI_MIN_THRESHOLD,
    SIG_THRESHOLD:              ACTIVE_CONSTRAINTS.SIG_THRESHOLD,
    SI_DIM_THRESHOLD:           ACTIVE_CONSTRAINTS.SI_DIM_THRESHOLD,
    SHG_CORR_THRESHOLD:         ACTIVE_CONSTRAINTS.SHG_CORR_THRESHOLD,
    SHG_INDEPENDENCE_THRESHOLD: ACTIVE_CONSTRAINTS.SHG_INDEPENDENCE_THRESHOLD,
    admission_gate:             gate.status,
    ...(gate.reason     ? { admission_gate_reason:   gate.reason }          : {}),
    ...(gate.activation ? { sealed_activation_seq:   gate.activation.seq }  : {}),
  });
});

// ── GET /api/audit/chain ──────────────────────────────────────────────────
router.get('/chain', async (req, res, next) => {
  try {
    const limit  = Math.min(parseInt(String(req.query.limit  ?? '50'),  10), 200);
    const offset = parseInt(String(req.query.offset ?? '0'), 10);

    const rows = await prisma.$queryRaw<Array<Record<string, unknown>>>`
      SELECT id, seq, signal_id, case_id, decision,
             si_score, si_threshold, significance, sig_threshold, dim_threshold,
             constraint_version, input_hash, decision_trace,
             prev_hash, current_hash, sealed_at
      FROM admission_audit_sealed
      ORDER BY seq ASC
      LIMIT ${limit} OFFSET ${offset}
    `;
    const total = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count FROM admission_audit_sealed
    `;
    res.json({ records: rows, total: Number(total[0]!.count), limit, offset });
  } catch (err) { next(err); }
});

// ── GET /api/audit/chain/verify ───────────────────────────────────────────
// Walks every sealed record in seq order and verifies the hash chain.
// Query params:
//   ?del=1   — also cross-verify each activation hash against the DEL chronology anchor.
//              Requires DEL_SERVICE_URL to be configured. Missing anchors are reported
//              as warnings (not errors) — the CIS chain is the primary authority.
router.get('/chain/verify', async (req, res, next) => {
  try {
    const rows = await prisma.$queryRaw<Array<{
      seq: number; signal_id: string; case_id: string; decision: string;
      si_score: number; si_threshold: number; significance: number;
      sig_threshold: number; dim_threshold: number; constraint_version: string;
      input_hash: string; decision_trace: unknown; logic_digest: string | null;
      prev_hash: string; current_hash: string; sealed_at: Date;
    }>>`
      SELECT seq, signal_id, case_id, decision,
             si_score, si_threshold, significance, sig_threshold, dim_threshold,
             constraint_version, input_hash, decision_trace, logic_digest,
             prev_hash, current_hash, sealed_at
      FROM admission_audit_sealed
      ORDER BY seq ASC
    `;

    const errors: string[] = [];
    let expectedPrevHash = GENESIS_PREV_HASH;

    for (const row of rows) {
      // Verify prev_hash linkage
      if (row.prev_hash !== expectedPrevHash) {
        errors.push(`seq ${row.seq}: prev_hash mismatch — expected ${expectedPrevHash}, got ${row.prev_hash}`);
      }

      // Recompute current_hash from payload.
      // logic_digest is included only for records sealed after migration_constraint_activation.sql
      // was applied (non-null). Pre-migration records omit it — their hashes remain valid.
      const sealPayload: Record<string, unknown> = {
        signal_id:          row.signal_id,
        case_id:            row.case_id,
        decision:           row.decision,
        si_score:           Number(row.si_score),
        si_threshold:       Number(row.si_threshold),
        significance:       Number(row.significance),
        sig_threshold:      Number(row.sig_threshold),
        dim_threshold:      Number(row.dim_threshold),
        constraint_version: row.constraint_version,
        input_hash:         row.input_hash,
        decision_trace:     row.decision_trace,
      };
      if (row.logic_digest) sealPayload['logic_digest'] = row.logic_digest;

      const recomputed = computeSealHash(sealPayload, row.prev_hash);
      if (recomputed !== row.current_hash) {
        errors.push(`seq ${row.seq}: current_hash tampered — stored ${row.current_hash}, recomputed ${recomputed}`);
      }

      expectedPrevHash = row.current_hash;
    }

    const chainValid = errors.length === 0;
    const response: Record<string, unknown> = {
      valid:           chainValid,
      records_checked: rows.length,
      errors,
    };

    // DEL cross-verification: check each constraint activation hash is anchored in DEL.
    if (req.query['del'] === '1') {
      const activationRows = await prisma.$queryRaw<Array<{
        seq: number; current_hash: string; constraint_version: string; activated_at: string;
      }>>`
        SELECT seq, current_hash, constraint_version, activated_at::text
        FROM constraint_activation_sealed
        ORDER BY seq ASC
      `;

      // Parallelise: all N DEL lookups in flight simultaneously.
      // Each has its own timeout (DEL_ANCHOR_TIMEOUT_MS, default 5 s) so
      // the worst-case for the whole batch is one timeout, not N × timeout.
      const delChecks = await Promise.all(activationRows.map(async (act) => {
        const anchor = await fetchDELAnchorForHash(act.current_hash);
        if (anchor) {
          return {
            cis_seq:             act.seq,
            cis_activation_hash: act.current_hash,
            constraint_version:  act.constraint_version,
            del_status:          'anchored' as const,
            del_entry_id:        anchor.del_entry_id,
            del_chronology_hash: anchor.del_chronology_hash,
            anchored_at:         anchor.anchored_at,
          };
        }
        return {
          cis_seq:             act.seq,
          cis_activation_hash: act.current_hash,
          constraint_version:  act.constraint_version,
          del_status:          (process.env.DEL_SERVICE_URL ? 'missing' : 'error') as 'missing' | 'error',
        };
      }));

      const unanchored = delChecks.filter((c) => c.del_status !== 'anchored');
      response['del_verification'] = {
        checked:       delChecks.length,
        all_anchored:  unanchored.length === 0,
        unanchored:    unanchored.length,
        del_configured: !!process.env.DEL_SERVICE_URL,
        activations:   delChecks,
      };
    }

    res.json(response);
  } catch (err) { next(err); }
});

// ── GET /api/audit/signal/:signalId ──────────────────────────────────────
router.get('/signal/:signalId', async (req, res, next) => {
  try {
    const rows = await prisma.$queryRaw<Array<Record<string, unknown>>>`
      SELECT id, seq, signal_id, case_id, decision,
             si_score, si_threshold, significance, sig_threshold, dim_threshold,
             constraint_version, signal_content, si_rate, si_direction,
             si_relationship, si_configuration, input_hash, decision_trace,
             prev_hash, current_hash, sealed_at
      FROM admission_audit_sealed
      WHERE signal_id = ${req.params.signalId}::uuid
      ORDER BY seq DESC
      LIMIT 1
    `;
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No sealed record for this signal', code: 'NOT_FOUND', status: 404 });
    }
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// ── POST /api/audit/signal/:signalId/replay ───────────────────────────────
// Re-run admission against the frozen state captured in the sealed record.
// Verifies the recomputed decision matches the stored decision.
router.post('/signal/:signalId/replay', async (req, res, next) => {
  try {
    const rows = await prisma.$queryRaw<Array<{
      seq: number; decision: string;
      si_score: number; si_threshold: number; significance: number;
      sig_threshold: number; dim_threshold: number; constraint_version: string;
      signal_content: string;
      si_rate: number; si_direction: number; si_relationship: number; si_configuration: number;
      input_hash: string; decision_trace: unknown; prev_hash: string; current_hash: string;
    }>>`
      SELECT seq, decision,
             si_score, si_threshold, significance, sig_threshold, dim_threshold,
             constraint_version,
             signal_content, si_rate, si_direction, si_relationship, si_configuration,
             input_hash, decision_trace, prev_hash, current_hash
      FROM admission_audit_sealed
      WHERE signal_id = ${req.params.signalId}::uuid
      ORDER BY seq DESC LIMIT 1
    `;
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No sealed record for this signal', code: 'NOT_FOUND', status: 404 });
    }
    const sealed = rows[0]!;

    // 1. Verify input_hash matches frozen snapshot
    const recomputedInputHash = computeInputHash({
      signal_content: sealed.signal_content,
      si_rate:        Number(sealed.si_rate),
      si_direction:   Number(sealed.si_direction),
      si_relationship: Number(sealed.si_relationship),
      si_configuration: Number(sealed.si_configuration),
      si_threshold:   Number(sealed.si_threshold),
      sig_threshold:  Number(sealed.sig_threshold),
      dim_threshold:  Number(sealed.dim_threshold),
    });
    const inputHashOk = recomputedInputHash === sealed.input_hash;

    // 2. Re-run admission from frozen state — must call decideAdmission, never re-implement
    const siScore     = Number(sealed.si_score);
    const siThreshold  = Number(sealed.si_threshold);
    const sigThreshold = Number(sealed.sig_threshold);
    const dimThreshold = Number(sealed.dim_threshold);
    const significance = Number(sealed.significance);
    const siMaxDim = Math.max(
      Number(sealed.si_rate), Number(sealed.si_direction),
      Number(sealed.si_relationship), Number(sealed.si_configuration)
    );

    const { decision: replayDecision } = decideAdmission(
      { siScore, siMaxDimension: siMaxDim, significance },
      { SI_MIN_THRESHOLD: siThreshold, SIG_THRESHOLD: sigThreshold, SI_DIM_THRESHOLD: dimThreshold },
    );

    // 3. Re-run decision trace
    const replayTrace = buildDecisionTrace({
      siScore, siThreshold, siMaxDimension: siMaxDim, dimThreshold,
      significance, sigThreshold,
      constraintVersion: sealed.constraint_version,
    });

    // 4. Verify decision match
    const decisionMatch = replayDecision === sealed.decision;

    res.json({
      replay_valid:   inputHashOk && decisionMatch,
      input_hash_ok:  inputHashOk,
      decision_match: decisionMatch,
      sealed_decision: sealed.decision,
      replay_decision: replayDecision,
      constraint_version: sealed.constraint_version,
      replay_trace:   replayTrace,
      frozen_input: {
        signal_content:  sealed.signal_content,
        si_rate:         Number(sealed.si_rate),
        si_direction:    Number(sealed.si_direction),
        si_relationship: Number(sealed.si_relationship),
        si_configuration: Number(sealed.si_configuration),
        si_score:        siScore,
        significance,
      },
    });
  } catch (err) { next(err); }
});

// ── POST /api/audit/checkpoint ────────────────────────────────────────────
// Compute a Merkle root over all sealed records since the last checkpoint
// and store it. Provides tamper-evidence for batch verification.
router.post('/checkpoint', async (_req, res, next) => {
  try {
    // Find the last checkpoint to get the seq boundary
    const lastCheckpoint = await prisma.$queryRaw<Array<{ seq_to: number }>>`
      SELECT seq_to FROM admission_audit_checkpoint ORDER BY seq_to DESC LIMIT 1
    `;
    const seqFrom = lastCheckpoint.length > 0 ? lastCheckpoint[0]!.seq_to + 1 : 1;

    const records = await prisma.$queryRaw<Array<{ seq: number; current_hash: string }>>`
      SELECT seq, current_hash FROM admission_audit_sealed WHERE seq >= ${seqFrom} ORDER BY seq ASC
    `;

    if (records.length === 0) {
      return res.json({ message: 'No new records since last checkpoint', records: 0 });
    }

    const leaves     = records.map(r => admissionLeafHash(r.current_hash));
    const merkleRoot = merkleRootFromLeaves(leaves);
    const seqTo      = records[records.length - 1]!.seq;

    await prisma.$executeRaw`
      INSERT INTO admission_audit_checkpoint (seq_from, seq_to, record_count, merkle_root)
      VALUES (${seqFrom}, ${seqTo}, ${records.length}, ${merkleRoot})
    `;

    res.status(201).json({
      seq_from:    seqFrom,
      seq_to:      seqTo,
      record_count: records.length,
      merkle_root: merkleRoot,
    });
  } catch (err) { next(err); }
});

// ── GET /api/audit/checkpoints ────────────────────────────────────────────
router.get('/checkpoints', async (_req, res, next) => {
  try {
    const rows = await prisma.$queryRaw<Array<Record<string, unknown>>>`
      SELECT id, seq_from, seq_to, record_count, merkle_root, created_at
      FROM admission_audit_checkpoint
      ORDER BY seq_to DESC
    `;
    res.json(rows);
  } catch (err) { next(err); }
});

// ── POST /api/audit/checkpoints/:id/verify ───────────────────────────────
// Given a checkpoint and a signal_id, return the Merkle proof for that signal's
// sealed record within the checkpoint's batch.
router.post('/checkpoints/:checkpointId/verify', async (req, res, next) => {
  try {
    const { signal_id } = req.body as { signal_id: string };
    if (!signal_id) {
      return res.status(400).json({ error: 'signal_id required', code: 'MISSING_FIELD', status: 400 });
    }

    const checkpointRows = await prisma.$queryRaw<Array<{
      seq_from: number; seq_to: number; merkle_root: string;
    }>>`
      SELECT seq_from, seq_to, merkle_root
      FROM admission_audit_checkpoint
      WHERE id = ${req.params.checkpointId}::uuid
    `;
    if (checkpointRows.length === 0) {
      return res.status(404).json({ error: 'Checkpoint not found', code: 'NOT_FOUND', status: 404 });
    }
    const checkpoint = checkpointRows[0]!;

    const batchRecords = await prisma.$queryRaw<Array<{ seq: number; current_hash: string; signal_id: string }>>`
      SELECT seq, current_hash, signal_id::text
      FROM admission_audit_sealed
      WHERE seq >= ${checkpoint.seq_from} AND seq <= ${checkpoint.seq_to}
      ORDER BY seq ASC
    `;

    const leafIndex = batchRecords.findIndex(r => r.signal_id === signal_id);
    if (leafIndex === -1) {
      return res.status(404).json({ error: 'Signal not in this checkpoint batch', code: 'NOT_IN_BATCH', status: 404 });
    }

    const leaves = batchRecords.map(r => admissionLeafHash(r.current_hash));
    const proof  = buildMerkleProof(leaves, leafIndex);
    const leafHex = leaves[leafIndex]!;
    const valid  = verifyMerkleInclusion(leafHex, proof, checkpoint.merkle_root);

    res.json({
      valid,
      signal_id,
      merkle_root: checkpoint.merkle_root,
      leaf_hash:   leafHex,
      proof,
    });
  } catch (err) { next(err); }
});

// ── GET /api/audit/frame/:caseId ──────────────────────────────────────────
// Frame Entity state for a case + CTOP orientation (Detection / Preservation Planning)
router.get('/frame/:caseId', async (req, res) => {
  try {
    const state = await getCaseFrameState(req.params.caseId!);
    if (!state) {
      return res.status(404).json({ error: 'No frame entity found for this case. Submit a signal first.' });
    }
    res.json(state);
  } catch (err) {
    console.error('Frame state error:', err);
    res.status(500).json({ error: 'Failed to retrieve frame state' });
  }
});

// ── POST /api/audit/frame/backfill-r-state ────────────────────────────────
// One-time backfill: assess r_state for all frame entities that have c_value
// but r_state = null. Safe to run multiple times (skips already-assessed rows).
router.post('/frame/backfill-r-state', async (_req, res, next) => {
  try {
    const rows = await prisma.$queryRaw<Array<{ id: string; identity: string; c_value: number | null }>>`
      SELECT id, identity, c_value
      FROM frame_entity
      WHERE c_value IS NOT NULL AND r_state IS NULL
    `;

    if (rows.length === 0) {
      return res.json({ message: 'No frame entities need backfill', assessed: 0 });
    }

    const results = [];
    for (const row of rows) {
      const result = await prisma.$transaction(async (tx) => assessRState(tx, row.id));
      results.push({ id: row.id, identity: row.identity, c_value: row.c_value, ...result });
    }

    res.json({ assessed: results.length, results });
  } catch (err) { next(err); }
});

// ── POST /api/audit/frame/recompute/:caseId ───────────────────────────────
// Recompute case frame state from scratch using all sealed audit records.
// Corrects stale sig_counts and reapplies current topology/c_value algorithm.
router.post('/frame/recompute/:caseId', async (req, res, next) => {
  try {
    const result = await recomputeCaseFrameState(req.params.caseId!);
    if (!result) {
      return res.status(404).json({ error: 'No frame entity for this case', code: 'NOT_FOUND', status: 404 });
    }
    res.json({ recomputed: true, case_id: req.params.caseId, ...result });
  } catch (err) { next(err); }
});

// ── GET /api/audit/constraints/history ───────────────────────────────────────
// Full activation lineage — answers "what constraint set was active at time T"
// from sealed state, not from decisions.
router.get('/constraints/history', async (_req, res, next) => {
  try {
    const activations = await listActivations();
    res.json({ activations, total: activations.length });
  } catch (err) { next(err); }
});

// ── POST /api/audit/constraints/activate ─────────────────────────────────────
// Accept a signed activation payload (from scripts/sign-activation.ts),
// verify it, and seal it into the activation chain.
//
// Body: { payload: ActivationPayload, signature: string, signer_key_version: string }
//
// Errors:
//   400 MISSING_FIELDS           — payload, signature, or signer_key_version absent
//   400 ACTIVATION_*             — specific verification failure (see constraint-activation.ts)
//   500                          — unexpected error
router.post('/constraints/activate', async (req, res, next) => {
  try {
    const body = req.body as Partial<SignedActivation>;
    if (!body?.payload || !body?.signature || !body?.signer_key_version) {
      return res.status(400).json({
        error: 'payload, signature, and signer_key_version are required',
        code: 'MISSING_FIELDS',
        status: 400,
      });
    }

    const signed: SignedActivation = {
      payload:            body.payload,
      signature:          body.signature,
      signer_key_version: body.signer_key_version,
    };

    const record = await sealConstraintActivation(signed);

    // Anchor in DEL chronology — non-blocking best-effort (failure does not roll back the activation).
    const delAnchor = await anchorActivationInDEL({
      cis_activation_hash: record.current_hash,
      cis_seq:             record.seq,
      constraint_version:  record.constraint_version,
      logic_digest:        record.logic_digest,
      activated_at:        record.activated_at,
    });

    return res.status(201).json({ sealed: true, activation: record, del_anchor: delAnchor });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.startsWith('ACTIVATION_') || msg === 'CIS_GOVERNANCE_PUBLIC_KEY not configured — cannot verify activation') {
      return res.status(400).json({ error: msg, code: msg, status: 400 });
    }
    next(err);
  }
});

// ── GET /api/audit/constraints/payload ───────────────────────────────────────
// Returns the unsigned activation payload for the current constraint set.
// Operators can inspect this before piping it to sign-activation.ts.
router.get('/constraints/payload', (_req, res) => {
  res.json(buildActivationPayload());
});

export default router;
