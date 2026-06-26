/**
 * INV-ACT-1, 3, 4 (pure), 5 — Constraint Activation Unit Tests
 *
 * Pure logic tests that run without a database connection.
 * DB-dependent tests (INV-ACT-2 and INV-ACT-4 startup validation)
 * are in invariants-activation-db.test.ts.
 *
 * INV-ACT-1: No admission route serves unless the latest sealed activation verifies.
 * INV-ACT-3: Replay through decideAdmission reproduces the stored decision bit-for-bit.
 * INV-ACT-4: An env threshold change without a sealed activation causes validation failure.
 * INV-ACT-5: Activation chain verification fails if any historical activation row is mutated.
 */

import { describe, test, expect } from 'vitest';
import crypto from 'crypto';
import {
  _setGateStateForTesting,
  requireValidActivation,
} from '../src/services/admission-gate.js';
import {
  decideAdmission,
  computeLogicDigest,
  ADMISSION_LOGIC_SPEC,
  CIS_ADMISSION_PROTOCOL_VERSION,
  type AdmissionDecisionInput,
  type AdmissionConstraints,
} from '../src/services/admission-decision.js';
import {
  computeActivationHash,
  verifyActivationSignature,
  buildActivationPayload,
  ACTIVATION_GENESIS_PREV_HASH,
} from '../src/services/constraint-activation.js';
import { stableSerialize } from '../src/services/audit-chain.js';
import { computeSealHash } from '../src/services/audit-chain.js';

const CONSTRAINTS: AdmissionConstraints = {
  SI_MIN_THRESHOLD: 0.25,
  SIG_THRESHOLD:    0.55,
  SI_DIM_THRESHOLD: 0.35,
};

// ─── INV-ACT-1: Gate blocks admission routes when not VALID ──────────────────

describe('INV-ACT-1: Admission gate blocks routes when activation is not VALID', () => {
  function callGate(): Promise<{ blocked: boolean; statusCode?: number; body?: Record<string, unknown> }> {
    return new Promise((resolve) => {
      let statusCode: number | undefined;
      let body: Record<string, unknown> | undefined;
      const fakeRes = {
        status(code: number) {
          statusCode = code;
          return { json(b: Record<string, unknown>) { body = b; resolve({ blocked: true, statusCode, body }); } };
        },
      };
      requireValidActivation({} as any, fakeRes as any, () => resolve({ blocked: false }));
    });
  }

  test('VALIDATING blocks with 503', async () => {
    _setGateStateForTesting({ status: 'VALIDATING' });
    const result = await callGate();
    expect(result.blocked).toBe(true);
    expect(result.statusCode).toBe(503);
    expect(result.body?.code).toBe('CONSTRAINT_ACTIVATION_INVALID');
    expect(result.body?.state).toBe('VALIDATING');
  });

  test('NO_ACTIVATION blocks with 503', async () => {
    _setGateStateForTesting({ status: 'NO_ACTIVATION', reason: 'No genesis activation sealed' });
    const result = await callGate();
    expect(result.blocked).toBe(true);
    expect(result.statusCode).toBe(503);
    expect(result.body?.state).toBe('NO_ACTIVATION');
    expect(result.body?.reason).toBeTruthy();
  });

  test('INVALID blocks with 503', async () => {
    _setGateStateForTesting({ status: 'INVALID', reason: 'Digest mismatch' });
    const result = await callGate();
    expect(result.blocked).toBe(true);
    expect(result.statusCode).toBe(503);
    expect(result.body?.state).toBe('INVALID');
    expect(result.body?.reason).toBe('Digest mismatch');
  });

  test('VALID passes through to next()', async () => {
    _setGateStateForTesting({ status: 'VALID' });
    const result = await callGate();
    expect(result.blocked).toBe(false);
  });

  test('response always includes code, state, and reason for blocked states', async () => {
    for (const status of ['VALIDATING', 'NO_ACTIVATION', 'INVALID'] as const) {
      _setGateStateForTesting({ status, reason: `reason-${status}` });
      const result = await callGate();
      expect(result.body?.code).toBe('CONSTRAINT_ACTIVATION_INVALID');
      expect(result.body?.state).toBe(status);
      expect(result.body?.reason).toBeTruthy();
    }
  });
});

// ─── INV-ACT-3: Replay through decideAdmission reproduces decision bit-for-bit

describe('INV-ACT-3: Replay through decideAdmission reproduces decision bit-for-bit', () => {
  type Case = { label: string; input: AdmissionDecisionInput; expected: string };

  const cases: Case[] = [
    {
      label:    'REJECTED: both SI score and dimension below threshold',
      input:    { siScore: 0.10, siMaxDimension: 0.20, significance: 0.80 },
      expected: 'REJECTED',
    },
    {
      label:    'REJECTED: both just below threshold boundaries',
      input:    { siScore: 0.2499, siMaxDimension: 0.3499, significance: 0.99 },
      expected: 'REJECTED',
    },
    {
      label:    'ADMITTED: SI score exactly at threshold (inclusive), significance above',
      input:    { siScore: 0.25, siMaxDimension: 0.10, significance: 0.55 },
      expected: 'ADMITTED',
    },
    {
      label:    'ADMITTED: dimension exactly at threshold (inclusive), significance above',
      input:    { siScore: 0.10, siMaxDimension: 0.35, significance: 0.60 },
      expected: 'ADMITTED',
    },
    {
      label:    'ADMITTED: both score and dimension above, significance above',
      input:    { siScore: 0.80, siMaxDimension: 0.80, significance: 0.80 },
      expected: 'ADMITTED',
    },
    {
      label:    'SUB_THRESHOLD_RETAINED: score above, significance below',
      input:    { siScore: 0.80, siMaxDimension: 0.80, significance: 0.30 },
      expected: 'SUB_THRESHOLD_RETAINED',
    },
    {
      label:    'SUB_THRESHOLD_RETAINED: dimension above (score below), significance below',
      input:    { siScore: 0.10, siMaxDimension: 0.50, significance: 0.40 },
      expected: 'SUB_THRESHOLD_RETAINED',
    },
    {
      label:    'ADMITTED: significance exactly at threshold (inclusive)',
      input:    { siScore: 0.50, siMaxDimension: 0.50, significance: 0.55 },
      expected: 'ADMITTED',
    },
  ];

  for (const c of cases) {
    test(c.label, () => {
      const result = decideAdmission(c.input, CONSTRAINTS);
      expect(result.decision).toBe(c.expected);
    });
  }

  test('determinism: 1000 identical calls produce identical results', () => {
    const input: AdmissionDecisionInput = { siScore: 0.60, siMaxDimension: 0.50, significance: 0.70 };
    const first = decideAdmission(input, CONSTRAINTS);
    for (let i = 0; i < 1000; i++) {
      const r = decideAdmission(input, CONSTRAINTS);
      expect(r.decision).toBe(first.decision);
      expect(r.passesWeighted).toBe(first.passesWeighted);
      expect(r.passesDimension).toBe(first.passesDimension);
      expect(r.meetsSignificance).toBe(first.meetsSignificance);
    }
  });

  test('result fields are self-consistent with decision', () => {
    const rejected = decideAdmission({ siScore: 0.10, siMaxDimension: 0.10, significance: 0.99 }, CONSTRAINTS);
    expect(rejected.decision).toBe('REJECTED');
    expect(rejected.passesWeighted).toBe(false);
    expect(rejected.passesDimension).toBe(false);

    const admitted = decideAdmission({ siScore: 0.80, siMaxDimension: 0.80, significance: 0.80 }, CONSTRAINTS);
    expect(admitted.decision).toBe('ADMITTED');
    expect(admitted.passesWeighted || admitted.passesDimension).toBe(true);
    expect(admitted.meetsSignificance).toBe(true);

    const sub = decideAdmission({ siScore: 0.80, siMaxDimension: 0.80, significance: 0.20 }, CONSTRAINTS);
    expect(sub.decision).toBe('SUB_THRESHOLD_RETAINED');
    expect(sub.passesWeighted || sub.passesDimension).toBe(true);
    expect(sub.meetsSignificance).toBe(false);
  });

  test('replay with frozen constraint values produces same decision', () => {
    // Simulate what the /replay endpoint does: use frozen thresholds from sealed record
    const frozen = { SI_MIN_THRESHOLD: 0.25, SIG_THRESHOLD: 0.55, SI_DIM_THRESHOLD: 0.35 };
    const input: AdmissionDecisionInput = { siScore: 0.60, siMaxDimension: 0.50, significance: 0.70 };

    const live   = decideAdmission(input, CONSTRAINTS);
    const replay = decideAdmission(input, frozen);

    expect(replay.decision).toBe(live.decision);
    expect(replay.passesWeighted).toBe(live.passesWeighted);
    expect(replay.passesDimension).toBe(live.passesDimension);
    expect(replay.meetsSignificance).toBe(live.meetsSignificance);
  });
});

// ─── INV-ACT-4: Digest arithmetic (pure — no DB) ─────────────────────────────

describe('INV-ACT-4: Threshold digest is unique per configuration', () => {
  test('two different threshold configurations produce different digests', () => {
    const digestA = crypto.createHash('sha256').update(stableSerialize({
      SI_MIN_THRESHOLD: 0.25, SIG_THRESHOLD: 0.55, SI_DIM_THRESHOLD: 0.35,
      SHG_CORR_THRESHOLD: 0.35, SHG_INDEPENDENCE_THRESHOLD: 0.15,
    })).digest('hex');
    const digestB = crypto.createHash('sha256').update(stableSerialize({
      SI_MIN_THRESHOLD: 0.30, SIG_THRESHOLD: 0.55, SI_DIM_THRESHOLD: 0.35,
      SHG_CORR_THRESHOLD: 0.35, SHG_INDEPENDENCE_THRESHOLD: 0.15,
    })).digest('hex');
    expect(digestA).not.toBe(digestB);
  });

  test('digest is sensitive to each of the five threshold fields', () => {
    const base = {
      SI_MIN_THRESHOLD: 0.25, SIG_THRESHOLD: 0.55, SI_DIM_THRESHOLD: 0.35,
      SHG_CORR_THRESHOLD: 0.35, SHG_INDEPENDENCE_THRESHOLD: 0.15,
    };
    const baseDigest = crypto.createHash('sha256').update(stableSerialize(base)).digest('hex');
    const fields = Object.keys(base) as Array<keyof typeof base>;
    for (const field of fields) {
      const altered = { ...base, [field]: base[field] + 0.01 };
      const alteredDigest = crypto.createHash('sha256').update(stableSerialize(altered)).digest('hex');
      expect(alteredDigest).not.toBe(baseDigest);
    }
  });

  test('computeLogicDigest is deterministic', () => {
    const d1 = computeLogicDigest();
    const d2 = computeLogicDigest();
    expect(d1).toBe(d2);
    expect(d1).toMatch(/^[0-9a-f]{64}$/);
  });

  test('ADMISSION_LOGIC_SPEC embeds the protocol version constant', () => {
    expect(ADMISSION_LOGIC_SPEC.protocol).toBe(CIS_ADMISSION_PROTOCOL_VERSION);
    expect(CIS_ADMISSION_PROTOCOL_VERSION).toMatch(/^cis-admission\//);
  });

  test('logic digest changes if ADMISSION_LOGIC_SPEC content changes', () => {
    const altered = { ...ADMISSION_LOGIC_SPEC, reject: 'si_score < SI_MIN_THRESHOLD' };
    const alteredDigest = crypto.createHash('sha256').update(stableSerialize(altered)).digest('hex');
    expect(alteredDigest).not.toBe(computeLogicDigest());
  });

  test('logic_digest is included in sealAdmission hash payload (seal hash changes if logic_digest changes)', () => {
    const base = {
      signal_id: 'sig-a', case_id: 'case-a', decision: 'ADMITTED',
      si_score: 0.72, si_threshold: 0.25, significance: 0.68,
      sig_threshold: 0.55, dim_threshold: 0.35,
      constraint_version: 'cv-test', input_hash: 'a'.repeat(64),
      decision_trace: [],
      logic_digest: computeLogicDigest(),
    };
    const altered = { ...base, logic_digest: 'b'.repeat(64) };
    const hashA = computeSealHash(base, 'GENESIS');
    const hashB = computeSealHash(altered, 'GENESIS');
    expect(hashA).not.toBe(hashB);
  });
});

// ─── INV-ACT-5: Activation chain verification fails on row mutation ────────────

describe('INV-ACT-5: Activation chain verification fails on any row mutation', () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
    publicKeyEncoding:  { type: 'spki',  format: 'der' },
    privateKeyEncoding: { type: 'pkcs8', format: 'der' },
  });
  const pubHex     = publicKey.toString('hex');
  const privKeyObj = crypto.createPrivateKey({ key: privateKey, format: 'der', type: 'pkcs8' });

  function sign(payload: object): string {
    return crypto.sign(null, Buffer.from(stableSerialize(payload), 'utf8'), privKeyObj).toString('base64url');
  }

  test('tampering any payload field changes current_hash', () => {
    const payload = buildActivationPayload();
    const original = computeActivationHash(payload, ACTIVATION_GENESIS_PREV_HASH);
    const mutations: object[] = [
      { ...payload, constraint_version: 'cv-tampered' },
      { ...payload, digest: 'x'.repeat(64) },
      { ...payload, logic_digest: 'y'.repeat(64) },
      { ...payload, activated_at: '2000-01-01T00:00:00.000Z' },
      { ...payload, values: { ...payload.values, SI_MIN_THRESHOLD: 0.99 } },
    ];
    for (const mutated of mutations) {
      expect(computeActivationHash(mutated, ACTIVATION_GENESIS_PREV_HASH)).not.toBe(original);
    }
  });

  test('tampering prev_hash changes current_hash', () => {
    const payload = buildActivationPayload();
    const h1 = computeActivationHash(payload, ACTIVATION_GENESIS_PREV_HASH);
    const h2 = computeActivationHash(payload, 'DIFFERENT_PREV');
    expect(h1).not.toBe(h2);
  });

  test('chain verification: recomputed hash matches stored hash (positive case)', () => {
    const payload    = buildActivationPayload();
    const prevHash   = ACTIVATION_GENESIS_PREV_HASH;
    const stored     = computeActivationHash(payload, prevHash);
    const recomputed = computeActivationHash(payload, prevHash);
    expect(recomputed).toBe(stored);
  });

  test('governance signature fails on any payload field mutation', () => {
    const payload = buildActivationPayload();
    const sig = sign(payload);
    expect(verifyActivationSignature(payload, sig, pubHex)).toBe(true);

    const mutations: object[] = [
      { ...payload, constraint_version: 'mutated' },
      { ...payload, digest: 'x'.repeat(64) },
      { ...payload, logic_digest: 'y'.repeat(64) },
      { ...payload, activated_at: '2001-01-01T00:00:00.000Z' },
      { ...payload, values: { ...payload.values, SI_MIN_THRESHOLD: 0.99 } },
    ];
    for (const mutated of mutations) {
      expect(verifyActivationSignature(mutated, sig, pubHex)).toBe(false);
    }
  });

  test('valid signature fails against a different public key', () => {
    const payload = buildActivationPayload();
    const sig = sign(payload);
    const { publicKey: otherPub } = crypto.generateKeyPairSync('ed25519', {
      publicKeyEncoding: { type: 'spki', format: 'der' },
    });
    expect(verifyActivationSignature(payload, sig, pubHex)).toBe(true);
    expect(verifyActivationSignature(payload, sig, otherPub.toString('hex'))).toBe(false);
  });

  test('malformed or empty signature is rejected without throwing', () => {
    const payload = buildActivationPayload();
    expect(verifyActivationSignature(payload, 'not-valid-base64url!!!', pubHex)).toBe(false);
    expect(verifyActivationSignature(payload, '', pubHex)).toBe(false);
    expect(verifyActivationSignature(payload, 'aaaa', pubHex)).toBe(false);
  });

  test('hash is a hex SHA-256 (64 chars)', () => {
    const payload = buildActivationPayload();
    const hash = computeActivationHash(payload, ACTIVATION_GENESIS_PREV_HASH);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });
});
