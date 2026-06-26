/**
 * CIS Admission Gate
 *
 * Module-level state tracking the result of startup activation validation.
 * Admission and intake routes check this gate before processing.
 *
 * Gate states:
 *   VALIDATING    — startup check not yet complete
 *   VALID         — latest sealed activation verified; admissions may proceed
 *   NO_ACTIVATION — no genesis activation sealed yet; admissions blocked
 *   INVALID       — activation exists but verification failed; admissions blocked
 *
 * Only VALID passes through. All other states return 503 CONSTRAINT_ACTIVATION_INVALID.
 * Audit and read routes are unaffected — the gate is wired only on mutation paths
 * that call runAdmission().
 */

import type { Request, Response, NextFunction } from 'express';
import prisma from '../prisma.js';
import { computeLogicDigest } from './admission-decision.js';
import { ACTIVE_CONSTRAINTS } from './constraint-registry.js';
import {
  computeActivationHash,
  verifyActivationSignature,
  ACTIVATION_GENESIS_PREV_HASH,
  type SealedActivationRecord,
} from './constraint-activation.js';

// ─── Gate state ───────────────────────────────────────────────────────────────

export type GateStatus = 'VALIDATING' | 'VALID' | 'NO_ACTIVATION' | 'INVALID';

interface GateState {
  status:      GateStatus;
  reason?:     string;
  activation?: Pick<SealedActivationRecord, 'seq' | 'constraint_version' | 'digest' | 'logic_digest' | 'activated_at'>;
  checked_at?: string;
}

let _state: GateState = { status: 'VALIDATING' };

export function getGateState(): Readonly<GateState> { return _state; }

/** For test environments only — lets tests set gate state without a real DB. */
export function _setGateStateForTesting(s: GateState): void {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('_setGateStateForTesting must not be called outside NODE_ENV=test');
  }
  _state = s;
}

// ─── Startup validation ───────────────────────────────────────────────────────

export async function runStartupValidation(): Promise<GateState> {
  try {
    const allRows = await prisma.$queryRaw<Array<{
      seq: number; constraint_version: string; digest: string;
      values: string; logic_digest: string; signer_key_version: string;
      signature: string; activated_at: string; prev_hash: string;
      current_hash: string;
    }>>`
      SELECT seq, constraint_version, digest,
             values::text AS values,
             logic_digest, signer_key_version, signature,
             activated_at::text, prev_hash, current_hash
      FROM constraint_activation_sealed
      ORDER BY seq ASC
    `;

    if (allRows.length === 0) {
      _state = {
        status: 'NO_ACTIVATION',
        reason: 'No constraint activation has been sealed. Generate a key pair, run scripts/sign-activation.ts, and POST to /api/audit/constraints/activate.',
      };
      console.warn('[admission-gate] NO_ACTIVATION — admissions blocked until genesis activation is sealed');
      return _state;
    }

    // 1. Walk the full chain — every row, not just the latest.
    //    Verifies both hash self-consistency and prev_hash linkage.
    //    This catches an attacker who inserts a row with a fake prev_hash:
    //    the inserted row's prev_hash won't equal the preceding row's current_hash.
    let expectedPrevHash: string = ACTIVATION_GENESIS_PREV_HASH;
    for (const row of allRows) {
      const values: SealedActivationRecord['values'] =
        typeof row.values === 'string' ? JSON.parse(row.values) : row.values;
      const payload = {
        constraint_version: row.constraint_version,
        digest:             row.digest,
        values,
        logic_digest:       row.logic_digest,
        activated_at:       row.activated_at,
      };
      // a. Linkage: prev_hash must equal the previous row's current_hash
      if (row.prev_hash !== expectedPrevHash) {
        _state = {
          status: 'INVALID',
          reason: `Activation chain broken at seq ${row.seq}: prev_hash ${row.prev_hash.slice(0, 12)}... does not link to expected ${expectedPrevHash.slice(0, 12)}...`,
        };
        console.error('[admission-gate] INVALID — activation chain broken; admissions blocked');
        return _state;
      }
      // b. Self-consistency: current_hash was correctly computed from payload + prev_hash
      const recomputed = computeActivationHash(payload, row.prev_hash);
      if (recomputed !== row.current_hash) {
        _state = {
          status: 'INVALID',
          reason: `Activation seq ${row.seq}: hash tampered — recomputed ${recomputed.slice(0, 12)}... stored ${row.current_hash.slice(0, 12)}...`,
        };
        console.error('[admission-gate] INVALID — hash chain tampered; admissions blocked');
        return _state;
      }
      expectedPrevHash = row.current_hash;
    }

    // 2. Governance signature on the latest activation (tip of the chain)
    const row = allRows[allRows.length - 1]!;
    const values: SealedActivationRecord['values'] =
      typeof row.values === 'string' ? JSON.parse(row.values) : row.values;
    const payload = {
      constraint_version: row.constraint_version,
      digest:             row.digest,
      values,
      logic_digest:       row.logic_digest,
      activated_at:       row.activated_at,
    };

    const publicKeyHex = process.env.CIS_GOVERNANCE_PUBLIC_KEY;
    if (!publicKeyHex) {
      // Key absent but sealed activations exist — cannot verify governance signature.
      // Fail closed: a missing key is indistinguishable from a misconfiguration or
      // env-var wipe that would let an attacker bypass signature checks entirely.
      _state = {
        status: 'INVALID',
        reason: 'CIS_GOVERNANCE_PUBLIC_KEY is not configured but sealed activations exist — cannot verify governance signature; set the key to resume admissions',
      };
      console.error('[admission-gate] INVALID — CIS_GOVERNANCE_PUBLIC_KEY absent with sealed activations; admissions blocked');
      return _state;
    }
    if (!verifyActivationSignature(payload, row.signature, publicKeyHex)) {
      _state = {
        status: 'INVALID',
        reason: `Activation seq ${row.seq}: governance signature invalid`,
      };
      console.error('[admission-gate] INVALID — governance signature failed; admissions blocked');
      return _state;
    }

    // 3. Constraint digest must match the running env
    if (row.digest !== ACTIVE_CONSTRAINTS.digest) {
      _state = {
        status: 'INVALID',
        reason: `Env constraint digest ${ACTIVE_CONSTRAINTS.digest.slice(0, 12)}... does not match sealed digest ${row.digest.slice(0, 12)}... — threshold changed without a new activation`,
      };
      console.error('[admission-gate] INVALID — constraint digest mismatch (env changed without activation); admissions blocked');
      return _state;
    }

    // 4. Logic digest must match the running decision module
    const currentLogicDigest = computeLogicDigest();
    if (row.logic_digest !== currentLogicDigest) {
      _state = {
        status: 'INVALID',
        reason: `Running logic digest ${currentLogicDigest.slice(0, 12)}... does not match sealed ${row.logic_digest.slice(0, 12)}... — decision logic changed without a new activation`,
      };
      console.error('[admission-gate] INVALID — logic digest mismatch (code changed without activation); admissions blocked');
      return _state;
    }

    _state = {
      status:      'VALID',
      activation:  { seq: row.seq, constraint_version: row.constraint_version, digest: row.digest, logic_digest: row.logic_digest, activated_at: row.activated_at },
      checked_at:  new Date().toISOString(),
    };
    console.log(`[admission-gate] VALID — ${allRows.length} activation(s) in chain; latest version ${row.constraint_version} (seq ${row.seq})`);
    return _state;

  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    _state = { status: 'INVALID', reason: `Startup validation error: ${reason}` };
    console.error('[admission-gate] INVALID — startup validation threw:', reason);
    return _state;
  }
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export function requireValidActivation(req: Request, res: Response, next: NextFunction): void {
  if (_state.status === 'VALID') { next(); return; }
  res.status(503).json({
    error:  'Admission service unavailable — constraint activation invalid',
    code:   'CONSTRAINT_ACTIVATION_INVALID',
    state:  _state.status,
    reason: _state.reason ?? 'Startup validation did not pass',
  });
}
