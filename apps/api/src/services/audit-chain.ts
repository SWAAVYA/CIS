/**
 * CIS Audit Chain — ported from DEL (dss_demo_2) audit/hash.ts and audit/merkle-tree.ts
 *
 * Provides:
 *  - Deterministic stable serialization (sort keys, recursive)
 *  - SHA-256 hash chain (prevHash → currentHash)
 *  - Binary Merkle tree over sealed admission records
 *  - sealAdmission — writes a chained sealed record inside a Prisma transaction
 */

import crypto from 'crypto';
import type { Prisma } from '@prisma/client';
import { computeLogicDigest } from './admission-decision.js';

// ─── Stable serialization ─────────────────────────────────────────────────
// Matches DEL core/stable-json.ts exactly so any cross-system hash comparison
// produces identical output for identical payloads.

export function stableSerialize(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) {
    return `[${(value as unknown[]).map(stableSerialize).join(',')}]`;
  }
  const rec = value as Record<string, unknown>;
  const parts = Object.keys(rec)
    .sort()
    .map(k => rec[k] === undefined ? null : `${JSON.stringify(k)}:${stableSerialize(rec[k])}`)
    .filter((p): p is string => p !== null);
  return `{${parts.join(',')}}`;
}

// ─── Hash chain ───────────────────────────────────────────────────────────

export const GENESIS_PREV_HASH = 'GENESIS';

/** SHA-256 of stable_serialize(payload) + prevHash — matches DEL pattern */
export function computeSealHash(payload: object, prevHash: string): string {
  const serialized = stableSerialize(payload);
  return crypto.createHash('sha256').update(`${serialized}${prevHash}`).digest('hex');
}

/** SHA-256 of stable_serialize(input) — frozen snapshot of what was scored */
export function computeInputHash(input: {
  signal_content: string;
  si_rate: number;
  si_direction: number;
  si_relationship: number;
  si_configuration: number;
  si_threshold: number;
  sig_threshold: number;
  dim_threshold: number;
}): string {
  return crypto.createHash('sha256').update(stableSerialize(input)).digest('hex');
}

// ─── Merkle tree ──────────────────────────────────────────────────────────

export interface MerkleProofStep {
  readonly siblingHex: string;
  readonly siblingIsLeft: boolean;
}

function hashMerklePair(left: string, right: string): string {
  return crypto
    .createHash('sha256')
    .update(Buffer.concat([Buffer.from(left, 'hex'), Buffer.from(right, 'hex')]))
    .digest('hex');
}

function nextMerkleLevel(level: string[]): string[] {
  const next: string[] = [];
  for (let i = 0; i < level.length; i += 2) {
    const left = level[i]!;
    const right = i + 1 < level.length ? level[i + 1]! : left;
    next.push(hashMerklePair(left, right));
  }
  return next;
}

export function emptyMerkleRoot(): string {
  return crypto.createHash('sha256').update('CIS_ADMISSION_MERKLE_EMPTY:v1', 'utf8').digest('hex');
}

export function merkleRootFromLeaves(leaves: readonly string[]): string {
  if (leaves.length === 0) return emptyMerkleRoot();
  let level = [...leaves];
  while (level.length > 1) level = nextMerkleLevel(level);
  return level[0]!;
}

export function buildMerkleProof(leaves: readonly string[], leafIndex: number): MerkleProofStep[] {
  if (leafIndex < 0 || leafIndex >= leaves.length) throw new Error('MERKLE_LEAF_INDEX_OUT_OF_RANGE');
  const steps: MerkleProofStep[] = [];
  let level = [...leaves];
  let idx = leafIndex;
  while (level.length > 1) {
    const pairStart = idx % 2 === 0 ? idx : idx - 1;
    const left = level[pairStart]!;
    const right = pairStart + 1 < level.length ? level[pairStart + 1]! : left;
    steps.push({ siblingHex: idx === pairStart ? right : left, siblingIsLeft: idx !== pairStart });
    level = nextMerkleLevel(level);
    idx = Math.floor(pairStart / 2);
  }
  return steps;
}

export function verifyMerkleInclusion(
  leafHex: string,
  proof: readonly MerkleProofStep[],
  expectedRoot: string
): boolean {
  let acc = leafHex;
  for (const s of proof) {
    acc = s.siblingIsLeft ? hashMerklePair(s.siblingHex, acc) : hashMerklePair(acc, s.siblingHex);
  }
  return acc === expectedRoot;
}

/** Leaf hash for a sealed admission record */
export function admissionLeafHash(currentHash: string): string {
  return crypto
    .createHash('sha256')
    .update(`CIS_ADMISSION_MERKLE_LEAF:v1\0${currentHash}`, 'utf8')
    .digest('hex');
}

// ─── Decision trace ───────────────────────────────────────────────────────

export interface DecisionTraceEntry {
  constraint: string;
  result: 'PASS' | 'FAIL';
  value: number;
  threshold: number;
  constraintVersion: string;
}

export function buildDecisionTrace(params: {
  siScore: number;
  siThreshold: number;
  siMaxDimension: number;
  dimThreshold: number;
  significance: number;
  sigThreshold: number;
  constraintVersion: string;
}): DecisionTraceEntry[] {
  return [
    {
      constraint: 'SI_WEIGHTED',
      result: params.siScore >= params.siThreshold ? 'PASS' : 'FAIL',
      value: params.siScore,
      threshold: params.siThreshold,
      constraintVersion: params.constraintVersion,
    },
    {
      constraint: 'SI_MAX_DIMENSION',
      result: params.siMaxDimension >= params.dimThreshold ? 'PASS' : 'FAIL',
      value: params.siMaxDimension,
      threshold: params.dimThreshold,
      constraintVersion: params.constraintVersion,
    },
    {
      constraint: 'SIGNIFICANCE',
      result: params.significance >= params.sigThreshold ? 'PASS' : 'FAIL',
      value: params.significance,
      threshold: params.sigThreshold,
      constraintVersion: params.constraintVersion,
    },
  ];
}

// ─── Chain linkage ────────────────────────────────────────────────────────

/** Within a transaction: lock the last sealed record and return its hash. */
async function getPrevHash(tx: Prisma.TransactionClient): Promise<string> {
  const rows = await tx.$queryRaw<Array<{ current_hash: string }>>`
    SELECT current_hash
    FROM admission_audit_sealed
    ORDER BY seq DESC
    LIMIT 1
    FOR UPDATE
  `;
  return rows.length > 0 ? rows[0]!.current_hash : GENESIS_PREV_HASH;
}

// ─── Seal ─────────────────────────────────────────────────────────────────

export interface SealAdmissionParams {
  signalId: string;
  caseId: string;
  signalContent: string;
  siRate: number;
  siDirection: number;
  siRelationship: number;
  siConfiguration: number;
  siScore: number;
  siMaxDimension: number;
  significance: number;
  decision: string;
  /** From constraint-registry: the active constraint set version (threshold audit trail) */
  constraintVersion: string;
  /** From constraint-registry: the RTT theoretical framework version (ontological audit trail) */
  rttTheoryVersion: string;
  siThreshold: number;
  sigThreshold: number;
  dimThreshold: number;
}

export interface SealResult {
  sealedRecordId: string;
  currentHash: string;
  prevHash: string;
  inputHash: string;
  decisionTrace: DecisionTraceEntry[];
}

/**
 * Create a hash-chained sealed admission record inside an existing Prisma transaction.
 *
 * Locks the last record (FOR UPDATE) before computing prevHash so concurrent
 * admissions cannot produce an invalid chain fork.
 */
export async function sealAdmission(
  tx: Prisma.TransactionClient,
  params: SealAdmissionParams
): Promise<SealResult> {
  const prevHash = await getPrevHash(tx);

  const inputHash = computeInputHash({
    signal_content: params.signalContent,
    si_rate: params.siRate,
    si_direction: params.siDirection,
    si_relationship: params.siRelationship,
    si_configuration: params.siConfiguration,
    si_threshold: params.siThreshold,
    sig_threshold: params.sigThreshold,
    dim_threshold: params.dimThreshold,
  });

  const decisionTrace = buildDecisionTrace({
    siScore: params.siScore,
    siThreshold: params.siThreshold,
    siMaxDimension: params.siMaxDimension,
    dimThreshold: params.dimThreshold,
    significance: params.significance,
    sigThreshold: params.sigThreshold,
    constraintVersion: params.constraintVersion,
  });

  const logicDigest = computeLogicDigest();

  // The payload that gets hashed — everything that constitutes the sealed decision.
  // logic_digest is included so replay can verify the decision semantics in force.
  // NOTE: once this field set is in production, the keys and their order are frozen.
  const sealPayload = {
    signal_id:          params.signalId,
    case_id:            params.caseId,
    decision:           params.decision,
    si_score:           params.siScore,
    si_threshold:       params.siThreshold,
    significance:       params.significance,
    sig_threshold:      params.sigThreshold,
    dim_threshold:      params.dimThreshold,
    constraint_version: params.constraintVersion,
    input_hash:         inputHash,
    decision_trace:     decisionTrace,
    logic_digest:       logicDigest,
  };

  const currentHash = computeSealHash(sealPayload, prevHash);

  const inserted = await tx.$queryRaw<Array<{ id: string }>>`
    INSERT INTO admission_audit_sealed (
      signal_id, case_id, decision,
      si_score, si_threshold, significance, sig_threshold, dim_threshold,
      constraint_version, rtt_theory_version,
      signal_content, si_rate, si_direction, si_relationship, si_configuration,
      input_hash, decision_trace, logic_digest,
      prev_hash, current_hash
    ) VALUES (
      ${params.signalId}::uuid,
      ${params.caseId}::uuid,
      ${params.decision},
      ${params.siScore},
      ${params.siThreshold},
      ${params.significance},
      ${params.sigThreshold},
      ${params.dimThreshold},
      ${params.constraintVersion},
      ${params.rttTheoryVersion},
      ${params.signalContent},
      ${params.siRate},
      ${params.siDirection},
      ${params.siRelationship},
      ${params.siConfiguration},
      ${inputHash},
      ${JSON.stringify(decisionTrace)}::jsonb,
      ${logicDigest},
      ${prevHash},
      ${currentHash}
    )
    RETURNING id
  `;

  const sealedRecordId = inserted[0]!.id;
  return { sealedRecordId, currentHash, prevHash, inputHash, decisionTrace };
}
