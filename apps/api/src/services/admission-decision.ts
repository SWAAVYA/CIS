/**
 * CIS Admission Decision — the single authoritative decision function.
 *
 * Both the live admission path (admission.ts) and the replay path
 * (routes/audit.ts) MUST call decideAdmission. No other code may
 * implement admission threshold semantics.
 *
 * The decision semantics are committed by ADMISSION_LOGIC_SPEC and its
 * digest (computeLogicDigest). Every sealed constraint activation binds
 * the logic digest that was in force; replay verifies against it.
 *
 * CONTRACT-PINNED: once a constraint activation has been sealed under a
 * given protocol version, ADMISSION_LOGIC_SPEC for that version is frozen.
 * Any semantic change to decideAdmission requires bumping
 * CIS_ADMISSION_PROTOCOL_VERSION and sealing a new activation — never an
 * in-place edit (same rule as DEL frozen preimages, dss-proof.ts:51).
 */

import crypto from 'crypto';
import { stableSerialize } from './audit-chain.js';

export const CIS_ADMISSION_PROTOCOL_VERSION = 'cis-admission/1';

/**
 * Frozen, serializable statement of the admission semantics implemented by
 * decideAdmission. This — not source-file bytes — is what the logic digest
 * commits, so the digest is identical under tsx (dev) and compiled dist
 * (production); the digestable artifact must be runtime-form independent.
 */
export const ADMISSION_LOGIC_SPEC = {
  protocol: CIS_ADMISSION_PROTOCOL_VERSION,
  reject: 'si_score < SI_MIN_THRESHOLD AND si_max_dimension < SI_DIM_THRESHOLD',
  admit: 'si_score >= SI_MIN_THRESHOLD OR si_max_dimension >= SI_DIM_THRESHOLD',
  retained: 'admit AND significance >= SIG_THRESHOLD -> ADMITTED (then RETAINED)',
  sub_threshold: 'admit AND significance < SIG_THRESHOLD -> SUB_THRESHOLD_RETAINED (WSP preservation)',
  comparisons: 'all threshold comparisons are >= (inclusive) on IEEE-754 doubles',
} as const;

export function computeLogicDigest(): string {
  return crypto.createHash('sha256').update(stableSerialize(ADMISSION_LOGIC_SPEC)).digest('hex');
}

export type AdmissionDecision = 'REJECTED' | 'ADMITTED' | 'SUB_THRESHOLD_RETAINED';

export interface AdmissionDecisionInput {
  siScore: number;
  siMaxDimension: number;
  significance: number;
}

export interface AdmissionConstraints {
  SI_MIN_THRESHOLD: number;
  SIG_THRESHOLD: number;
  SI_DIM_THRESHOLD: number;
}

export interface AdmissionDecisionResult {
  decision: AdmissionDecision;
  passesWeighted: boolean;
  passesDimension: boolean;
  meetsSignificance: boolean;
}

export function decideAdmission(
  input: AdmissionDecisionInput,
  constraints: AdmissionConstraints
): AdmissionDecisionResult {
  const passesWeighted = input.siScore >= constraints.SI_MIN_THRESHOLD;
  const passesDimension = input.siMaxDimension >= constraints.SI_DIM_THRESHOLD;
  const meetsSignificance = input.significance >= constraints.SIG_THRESHOLD;

  if (!passesWeighted && !passesDimension) {
    return { decision: 'REJECTED', passesWeighted, passesDimension, meetsSignificance };
  }
  return {
    decision: meetsSignificance ? 'ADMITTED' : 'SUB_THRESHOLD_RETAINED',
    passesWeighted,
    passesDimension,
    meetsSignificance,
  };
}
