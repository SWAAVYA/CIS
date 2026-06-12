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
 */

import { Router } from 'express';
import prisma from '../prisma.js';
import {
  computeInputHash, computeSealHash, stableSerialize,
  admissionLeafHash, merkleRootFromLeaves, buildMerkleProof, verifyMerkleInclusion,
  GENESIS_PREV_HASH, buildDecisionTrace,
} from '../services/audit-chain.js';
import { ACTIVE_CONSTRAINTS, verifyConstraintDigest } from '../services/constraint-registry.js';

const router = Router();

// ── GET /api/audit/constraints/active ─────────────────────────────────────
router.get('/constraints/active', (_req, res) => {
  res.json({
    version:         ACTIVE_CONSTRAINTS.version,
    digest:          ACTIVE_CONSTRAINTS.digest,
    activated_at:    ACTIVE_CONSTRAINTS.activatedAt,
    SI_MIN_THRESHOLD: ACTIVE_CONSTRAINTS.SI_MIN_THRESHOLD,
    SIG_THRESHOLD:    ACTIVE_CONSTRAINTS.SIG_THRESHOLD,
    SI_DIM_THRESHOLD: ACTIVE_CONSTRAINTS.SI_DIM_THRESHOLD,
    SHG_CORR_THRESHOLD: ACTIVE_CONSTRAINTS.SHG_CORR_THRESHOLD,
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
router.get('/chain/verify', async (_req, res, next) => {
  try {
    const rows = await prisma.$queryRaw<Array<{
      seq: number; signal_id: string; case_id: string; decision: string;
      si_score: number; si_threshold: number; significance: number;
      sig_threshold: number; dim_threshold: number; constraint_version: string;
      input_hash: string; decision_trace: unknown;
      prev_hash: string; current_hash: string; sealed_at: Date;
    }>>`
      SELECT seq, signal_id, case_id, decision,
             si_score, si_threshold, significance, sig_threshold, dim_threshold,
             constraint_version, input_hash, decision_trace,
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

      // Recompute current_hash from payload
      const sealPayload = {
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
      const recomputed = computeSealHash(sealPayload, row.prev_hash);
      if (recomputed !== row.current_hash) {
        errors.push(`seq ${row.seq}: current_hash tampered — stored ${row.current_hash}, recomputed ${recomputed}`);
      }

      expectedPrevHash = row.current_hash;
    }

    res.json({
      valid:        errors.length === 0,
      records_checked: rows.length,
      errors,
    });
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

    // 2. Re-run admission logic from frozen state
    const siScore    = Number(sealed.si_score);
    const siThreshold = Number(sealed.si_threshold);
    const sigThreshold = Number(sealed.sig_threshold);
    const dimThreshold = Number(sealed.dim_threshold);
    const significance = Number(sealed.significance);
    const siMaxDim = Math.max(
      Number(sealed.si_rate), Number(sealed.si_direction),
      Number(sealed.si_relationship), Number(sealed.si_configuration)
    );

    const passesWeighted  = siScore >= siThreshold;
    const passesDimension = siMaxDim >= dimThreshold;
    let replayDecision: string;
    if (!passesWeighted && !passesDimension) {
      replayDecision = 'REJECTED';
    } else {
      replayDecision = significance >= sigThreshold ? 'ADMITTED' : 'SUB_THRESHOLD_RETAINED';
    }

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

export default router;
