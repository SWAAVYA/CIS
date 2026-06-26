/**
 * CIS Constraint Registry
 *
 * Replaces raw env-var threshold access with signed, versioned constraint objects.
 * Every admission decision records which constraint version was active at that moment —
 * enabling lineage reconstruction and replay.
 *
 * DEL equivalent: threshold-signed constraint activations.
 */

import crypto from 'crypto';
import { stableSerialize } from './audit-chain.js';

export interface ConstraintSet {
  /** Stable identifier for this exact configuration */
  readonly version: string;
  /** SHA-256 of the stable-serialized constraint values — the "seal" */
  readonly digest: string;
  /** When this constraint set became active */
  readonly activatedAt: string;

  // Admission thresholds
  readonly SI_MIN_THRESHOLD: number;
  readonly SIG_THRESHOLD: number;
  readonly SI_DIM_THRESHOLD: number;

  // SHG connection thresholds
  readonly SHG_CORR_THRESHOLD: number;
  readonly SHG_INDEPENDENCE_THRESHOLD: number;
}

function digestConstraints(values: {
  SI_MIN_THRESHOLD: number;
  SIG_THRESHOLD: number;
  SI_DIM_THRESHOLD: number;
  SHG_CORR_THRESHOLD: number;
  SHG_INDEPENDENCE_THRESHOLD: number;
}): string {
  return crypto.createHash('sha256').update(stableSerialize(values)).digest('hex');
}

function buildConstraintSet(values: {
  SI_MIN_THRESHOLD: number;
  SIG_THRESHOLD: number;
  SI_DIM_THRESHOLD: number;
  SHG_CORR_THRESHOLD: number;
  SHG_INDEPENDENCE_THRESHOLD: number;
}): ConstraintSet {
  const digest = digestConstraints(values);
  // Version = first 12 chars of digest — short enough to embed in audit records,
  // long enough to be collision-resistant for this use case.
  const version = `cv-${digest.slice(0, 12)}`;
  return {
    version,
    digest,
    activatedAt: new Date().toISOString(),
    ...values,
  };
}

/**
 * The active constraint set for this process.
 * Computed once at startup from environment variables.
 * If an env var is changed, the process must restart — the new digest
 * will differ, recording that a different constraint version was active.
 */
export const ACTIVE_CONSTRAINTS: ConstraintSet = buildConstraintSet({
  SI_MIN_THRESHOLD:          parseFloat(process.env.SI_MIN_THRESHOLD          ?? '0.25'),
  SIG_THRESHOLD:             parseFloat(process.env.SIG_THRESHOLD             ?? '0.55'),
  SI_DIM_THRESHOLD:          parseFloat(process.env.SI_DIM_THRESHOLD          ?? '0.35'),
  SHG_CORR_THRESHOLD:        parseFloat(process.env.SHG_CORR_THRESHOLD        ?? '0.35'),
  SHG_INDEPENDENCE_THRESHOLD: parseFloat(process.env.SHG_INDEPENDENCE_THRESHOLD ?? '0.15'),
});

/**
 * The RTT theoretical framework version in force for this process.
 * Read from config at startup — not hardcoded.
 * When RTT advances, update RTT_THEORY_VERSION in environment config.
 * No code change required. Records the ontological framework against which
 * all signal classifications are made (distinct from constraint_version,
 * which records the threshold values in force).
 */
export const RTT_THEORY_VERSION: string =
  process.env.RTT_THEORY_VERSION ?? 'v1.9';

/**
 * Reconstruct a constraint set from a stored digest + values.
 * Used during replay: verify the digest still matches the stored values.
 */
export function verifyConstraintDigest(stored: {
  digest: string;
  SI_MIN_THRESHOLD: number;
  SIG_THRESHOLD: number;
  SI_DIM_THRESHOLD: number;
  SHG_CORR_THRESHOLD: number;
  SHG_INDEPENDENCE_THRESHOLD: number;
}): boolean {
  const expected = digestConstraints({
    SI_MIN_THRESHOLD:           stored.SI_MIN_THRESHOLD,
    SIG_THRESHOLD:              stored.SIG_THRESHOLD,
    SI_DIM_THRESHOLD:           stored.SI_DIM_THRESHOLD,
    SHG_CORR_THRESHOLD:         stored.SHG_CORR_THRESHOLD,
    SHG_INDEPENDENCE_THRESHOLD: stored.SHG_INDEPENDENCE_THRESHOLD,
  });
  return expected === stored.digest;
}
