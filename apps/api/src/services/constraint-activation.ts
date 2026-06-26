/**
 * CIS Constraint Activation Chain
 *
 * Hash-chained sealed activation records for the constraint governance surface.
 * Each activation is signed by an offline governance key (Ed25519, Node.js crypto).
 * The chain anchors what constraint set and decision logic were in force,
 * independently of runtime env vars.
 *
 * Pattern mirrors admission_audit_sealed / audit-chain.ts exactly.
 *
 * CONTRACT-PINNED: once the genesis activation is sealed, the ActivationPayload
 * field set and stableSerialize output are committed. Any semantic change requires
 * a new CIS_ADMISSION_PROTOCOL_VERSION — never an in-place edit of the payload
 * structure. Same rule as DEL frozen preimages (dss-proof.ts:51).
 */

import crypto from 'crypto';
import prisma from '../prisma.js';
import { stableSerialize } from './audit-chain.js';
import { computeLogicDigest } from './admission-decision.js';
import { ACTIVE_CONSTRAINTS } from './constraint-registry.js';

export const ACTIVATION_GENESIS_PREV_HASH = 'GENESIS_ACTIVATION';

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * The payload that gets signed and sealed.
 * Field set is CONTRACT-PINNED on first genesis activation.
 */
export interface ActivationPayload {
  constraint_version: string;
  digest: string;
  values: {
    SI_MIN_THRESHOLD: number;
    SIG_THRESHOLD: number;
    SI_DIM_THRESHOLD: number;
    SHG_CORR_THRESHOLD: number;
    SHG_INDEPENDENCE_THRESHOLD: number;
  };
  logic_digest: string;
  activated_at: string; // ISO-8601
}

export interface SignedActivation {
  payload: ActivationPayload;
  signature: string;         // base64url Ed25519 over stableSerialize(payload)
  signer_key_version: string;
}

export interface SealedActivationRecord {
  id: string;
  seq: number;
  constraint_version: string;
  digest: string;
  values: ActivationPayload['values'];
  logic_digest: string;
  signer_key_version: string;
  signature: string;
  activated_at: string;
  prev_hash: string;
  current_hash: string;
  created_at: string;
}

// ─── Payload construction ─────────────────────────────────────────────────────

/** Build an ActivationPayload from the currently active constraints. */
export function buildActivationPayload(
  activated_at: string = new Date().toISOString(),
): ActivationPayload {
  return {
    constraint_version: ACTIVE_CONSTRAINTS.version,
    digest:             ACTIVE_CONSTRAINTS.digest,
    values: {
      SI_MIN_THRESHOLD:           ACTIVE_CONSTRAINTS.SI_MIN_THRESHOLD,
      SIG_THRESHOLD:              ACTIVE_CONSTRAINTS.SIG_THRESHOLD,
      SI_DIM_THRESHOLD:           ACTIVE_CONSTRAINTS.SI_DIM_THRESHOLD,
      SHG_CORR_THRESHOLD:         ACTIVE_CONSTRAINTS.SHG_CORR_THRESHOLD,
      SHG_INDEPENDENCE_THRESHOLD: ACTIVE_CONSTRAINTS.SHG_INDEPENDENCE_THRESHOLD,
    },
    logic_digest: computeLogicDigest(),
    activated_at,
  };
}

// ─── Hashing ──────────────────────────────────────────────────────────────────

/** SHA-256 of stableSerialize(payload) + prevHash — same pattern as computeSealHash. */
export function computeActivationHash(payload: ActivationPayload, prevHash: string): string {
  return crypto
    .createHash('sha256')
    .update(`${stableSerialize(payload)}${prevHash}`)
    .digest('hex');
}

// ─── Signature verification ───────────────────────────────────────────────────

/**
 * Verify an Ed25519 signature over stableSerialize(payload).
 * publicKeyHex: hex-encoded DER SubjectPublicKeyInfo (from generate-activation-key script).
 * Returns false on any error — never throws.
 */
export function verifyActivationSignature(
  payload: ActivationPayload,
  signatureBase64url: string,
  publicKeyHex: string,
): boolean {
  try {
    const publicKey = crypto.createPublicKey({
      key:    Buffer.from(publicKeyHex, 'hex'),
      format: 'der',
      type:   'spki',
    });
    const message = Buffer.from(stableSerialize(payload), 'utf8');
    const sig     = Buffer.from(signatureBase64url, 'base64url');
    return crypto.verify(null, message, publicKey, sig);
  } catch {
    return false;
  }
}

// ─── Chain operations ─────────────────────────────────────────────────────────

/**
 * Verify a SignedActivation and seal it into the activation chain.
 *
 * Throws a structured error string on any verification failure so the route
 * can return a precise 400 without exposing internals.
 */
export async function sealConstraintActivation(
  signed: SignedActivation,
): Promise<SealedActivationRecord> {
  const { payload, signature, signer_key_version } = signed;

  // 1. Governance signature
  const publicKeyHex = process.env.CIS_GOVERNANCE_PUBLIC_KEY;
  if (!publicKeyHex) {
    throw new Error('CIS_GOVERNANCE_PUBLIC_KEY not configured — cannot verify activation');
  }
  if (!verifyActivationSignature(payload, signature, publicKeyHex)) {
    throw new Error('ACTIVATION_SIGNATURE_INVALID');
  }

  // 2. Constraint digest self-consistency
  const expectedDigest = crypto
    .createHash('sha256')
    .update(stableSerialize(payload.values))
    .digest('hex');
  if (expectedDigest !== payload.digest) {
    throw new Error('ACTIVATION_DIGEST_MISMATCH');
  }

  // 3. Logic digest must match the running admission-decision module
  const currentLogicDigest = computeLogicDigest();
  if (currentLogicDigest !== payload.logic_digest) {
    throw new Error('ACTIVATION_LOGIC_DIGEST_MISMATCH');
  }

  // 4. Write under a transaction with an advisory lock.
  //
  //    FOR UPDATE (row-level) only locks rows that exist. When the table is empty
  //    (genesis state) it acquires NO lock — two concurrent genesis activations both
  //    see 0 rows, both use GENESIS_ACTIVATION as prevHash, and both INSERT, breaking
  //    the chain permanently (C-3).
  //
  //    pg_advisory_xact_lock(N) acquires a process-wide exclusive lock that holds for
  //    the duration of the transaction, regardless of row count. It serializes all
  //    activation writes including the genesis case. The magic constant identifies
  //    the "constraint_activation_chain" lock class and must never change.
  const ACTIVATION_CHAIN_LOCK = BigInt('3141592653589793');

  const record = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(${ACTIVATION_CHAIN_LOCK})`;

    const tipRows = await tx.$queryRaw<Array<{ current_hash: string }>>`
      SELECT current_hash
      FROM constraint_activation_sealed
      ORDER BY seq DESC
      LIMIT 1
      FOR UPDATE
    `;
    const prevHash    = tipRows.length > 0 ? tipRows[0]!.current_hash : ACTIVATION_GENESIS_PREV_HASH;
    const currentHash = computeActivationHash(payload, prevHash);

    const inserted = await tx.$queryRaw<Array<{
      id: string; seq: number; constraint_version: string; digest: string;
      values: string; logic_digest: string; signer_key_version: string;
      signature: string; activated_at: string; prev_hash: string;
      current_hash: string; created_at: string;
    }>>`
      INSERT INTO constraint_activation_sealed (
        constraint_version, digest, values, logic_digest,
        signer_key_version, signature, activated_at,
        prev_hash, current_hash
      ) VALUES (
        ${payload.constraint_version},
        ${payload.digest},
        ${JSON.stringify(payload.values)}::jsonb,
        ${payload.logic_digest},
        ${signer_key_version},
        ${signature},
        ${payload.activated_at}::timestamptz,
        ${prevHash},
        ${currentHash}
      )
      RETURNING id, seq, constraint_version, digest,
                values::text AS values,
                logic_digest, signer_key_version, signature,
                activated_at::text, prev_hash, current_hash, created_at::text
    `;
    return inserted[0]!;
  });

  return {
    ...record,
    values: typeof record.values === 'string'
      ? JSON.parse(record.values)
      : record.values,
  };
}

/** Return the most recently sealed activation, or null if none exists. */
export async function getLatestActivation(): Promise<SealedActivationRecord | null> {
  const rows = await prisma.$queryRaw<Array<{
    id: string; seq: number; constraint_version: string; digest: string;
    values: string; logic_digest: string; signer_key_version: string;
    signature: string; activated_at: string; prev_hash: string;
    current_hash: string; created_at: string;
  }>>`
    SELECT id, seq, constraint_version, digest,
           values::text AS values,
           logic_digest, signer_key_version, signature,
           activated_at::text, prev_hash, current_hash, created_at::text
    FROM constraint_activation_sealed
    ORDER BY seq DESC
    LIMIT 1
  `;
  if (rows.length === 0) return null;
  const r = rows[0]!;
  return {
    ...r,
    values: typeof r.values === 'string' ? JSON.parse(r.values) : r.values,
  };
}

/** Return all sealed activations in chain order (oldest first). */
export async function listActivations(): Promise<SealedActivationRecord[]> {
  const rows = await prisma.$queryRaw<Array<{
    id: string; seq: number; constraint_version: string; digest: string;
    values: string; logic_digest: string; signer_key_version: string;
    signature: string; activated_at: string; prev_hash: string;
    current_hash: string; created_at: string;
  }>>`
    SELECT id, seq, constraint_version, digest,
           values::text AS values,
           logic_digest, signer_key_version, signature,
           activated_at::text, prev_hash, current_hash, created_at::text
    FROM constraint_activation_sealed
    ORDER BY seq ASC
  `;
  return rows.map(r => ({
    ...r,
    values: typeof r.values === 'string' ? JSON.parse(r.values) : r.values,
  }));
}
