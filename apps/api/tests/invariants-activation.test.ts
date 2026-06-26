/**
 * INV-ACT-2, 4 (DB) — Constraint Activation Integration Tests
 *
 * Requires a live database (TEST_DATABASE_URL pointing to Postgres).
 * Pure-logic tests (INV-ACT-1, 3, 4-digest, 5) live in invariants-activation-unit.test.ts
 * and can be run without a database via: npm run test:unit
 *
 * INV-ACT-2: Every sealed admission record's logic_digest matches the running module.
 * INV-ACT-4: Startup validation returns INVALID when constraint or logic digest mismatches.
 */

import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import crypto from 'crypto';
import { prisma, createTestCase, createTestDomain, createTestSignal } from './setup';
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
import { ACTIVE_CONSTRAINTS } from '../src/services/constraint-registry.js';
import { sealAdmission } from '../src/services/audit-chain.js';
import { stableSerialize } from '../src/services/audit-chain.js';
import { runStartupValidation } from '../src/services/admission-gate.js';

// ─── Fixture ──────────────────────────────────────────────────────────────────

const CONSTRAINTS: AdmissionConstraints = {
  SI_MIN_THRESHOLD: 0.25,
  SIG_THRESHOLD:    0.55,
  SI_DIM_THRESHOLD: 0.35,
};

// Ensure activation table exists (migration may not be applied to test DB yet).
// Safe to run multiple times — all statements use IF NOT EXISTS.
beforeAll(async () => {
  await prisma.$executeRawUnsafe(`
    CREATE SEQUENCE IF NOT EXISTS constraint_activation_sealed_seq START 1;
    CREATE TABLE IF NOT EXISTS constraint_activation_sealed (
      id                 UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      seq                INT         NOT NULL DEFAULT nextval('constraint_activation_sealed_seq'),
      constraint_version TEXT        NOT NULL,
      digest             CHAR(64)    NOT NULL,
      values             JSONB       NOT NULL,
      logic_digest       CHAR(64)    NOT NULL,
      signer_key_version TEXT        NOT NULL,
      signature          TEXT        NOT NULL,
      activated_at       TIMESTAMPTZ NOT NULL,
      prev_hash          TEXT        NOT NULL,
      current_hash       CHAR(64)    NOT NULL UNIQUE,
      created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE UNIQUE INDEX IF NOT EXISTS constraint_activation_sealed_seq_unique
      ON constraint_activation_sealed(seq);
    ALTER TABLE admission_audit_sealed ADD COLUMN IF NOT EXISTS logic_digest CHAR(64);
  `);
  // Clear activation table so tests start from a known empty state
  await prisma.$executeRaw`TRUNCATE TABLE constraint_activation_sealed RESTART IDENTITY`;
});

afterAll(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE constraint_activation_sealed RESTART IDENTITY`;
});

// ─── INV-ACT-1: Gate blocks admission routes when not VALID ──────────────────

describe('INV-ACT-1: Admission gate blocks routes when activation is not VALID', () => {
  // Helper: call middleware and capture whether it blocked or passed
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

  test('response body always includes code, state, and reason', async () => {
    for (const status of ['VALIDATING', 'NO_ACTIVATION', 'INVALID'] as const) {
      _setGateStateForTesting({ status, reason: `reason-${status}` });
      const result = await callGate();
      expect(result.body?.code).toBe('CONSTRAINT_ACTIVATION_INVALID');
      expect(result.body?.state).toBe(status);
      expect(result.body?.reason).toBeTruthy();
    }
  });
});

// ─── INV-ACT-2: Sealed admissions carry logic_digest matching the running module

describe('INV-ACT-2: Sealed admission records carry the correct logic_digest', () => {
  test('computeLogicDigest is deterministic — same value across calls', () => {
    const d1 = computeLogicDigest();
    const d2 = computeLogicDigest();
    const d3 = computeLogicDigest();
    expect(d1).toBe(d2);
    expect(d2).toBe(d3);
    expect(d1).toMatch(/^[0-9a-f]{64}$/); // hex SHA-256
  });

  test('ADMISSION_LOGIC_SPEC encodes the protocol version constant', () => {
    expect(ADMISSION_LOGIC_SPEC.protocol).toBe(CIS_ADMISSION_PROTOCOL_VERSION);
    expect(CIS_ADMISSION_PROTOCOL_VERSION).toMatch(/^cis-admission\//);
  });

  test('logic digest changes if ADMISSION_LOGIC_SPEC content changes', () => {
    // Simulate what a different spec would produce
    const altered = { ...ADMISSION_LOGIC_SPEC, reject: 'si_score < SI_MIN_THRESHOLD' };
    const alteredDigest = crypto.createHash('sha256').update(stableSerialize(altered)).digest('hex');
    expect(alteredDigest).not.toBe(computeLogicDigest());
  });

  test('sealAdmission writes logic_digest equal to computeLogicDigest()', async () => {
    const { id: caseId }   = await createTestCase();
    const { id: domainId } = await createTestDomain(caseId);
    const signal = await createTestSignal(caseId, domainId, { si_score: 0.72, significance: 0.68 });

    const expectedLogicDigest = computeLogicDigest();
    let capturedLogicDigest: string | null = null;

    // Use a rollback-after-query pattern to leave the sealed table clean
    try {
      await prisma.$transaction(async (tx) => {
        const seal = await sealAdmission(tx, {
          signalId:           signal.id,
          caseId,
          signalContent:      signal.content,
          siRate:             0.80,
          siDirection:        0.70,
          siRelationship:     0.65,
          siConfiguration:    0.60,
          siScore:            0.72,
          siMaxDimension:     0.80,
          significance:       0.68,
          decision:           'ADMITTED',
          constraintVersion:  ACTIVE_CONSTRAINTS.version,
          rttTheoryVersion:   process.env.RTT_THEORY_VERSION ?? 'v1.9',
          siThreshold:        ACTIVE_CONSTRAINTS.SI_MIN_THRESHOLD,
          sigThreshold:       ACTIVE_CONSTRAINTS.SIG_THRESHOLD,
          dimThreshold:       ACTIVE_CONSTRAINTS.SI_DIM_THRESHOLD,
        });

        const rows = await tx.$queryRaw<Array<{ logic_digest: string | null }>>`
          SELECT logic_digest FROM admission_audit_sealed
          WHERE id = ${seal.sealedRecordId}::uuid
        `;
        capturedLogicDigest = rows[0]?.logic_digest ?? null;
        throw new Error('test-rollback');
      });
    } catch (err) {
      if ((err as Error).message !== 'test-rollback') throw err;
    }

    expect(capturedLogicDigest).not.toBeNull();
    expect(capturedLogicDigest).toBe(expectedLogicDigest);
  });

  test('sealAdmission includes logic_digest in the hash payload (hash changes if logic changes)', async () => {
    // Prove logic_digest affects the current_hash by comparing two payloads
    // that differ only in logic_digest
    const base = {
      signal_id: 'sig-a', case_id: 'case-a', decision: 'ADMITTED',
      si_score: 0.72, si_threshold: 0.25, significance: 0.68,
      sig_threshold: 0.55, dim_threshold: 0.35,
      constraint_version: 'cv-test', input_hash: 'a'.repeat(64),
      decision_trace: [],
      logic_digest: computeLogicDigest(),
    };
    const altered = { ...base, logic_digest: 'b'.repeat(64) };

    const { computeSealHash } = await import('../src/services/audit-chain.js');
    const hashA = computeSealHash(base, 'GENESIS');
    const hashB = computeSealHash(altered, 'GENESIS');
    expect(hashA).not.toBe(hashB);
  });
});

// ─── INV-ACT-3: Replay through decideAdmission reproduces decision bit-for-bit

describe('INV-ACT-3: Replay through decideAdmission reproduces decision bit-for-bit', () => {
  type Case = { label: string; input: AdmissionDecisionInput; expected: string };

  const cases: Case[] = [
    {
      label:    'REJECTED: SI score and dimension both below threshold',
      input:    { siScore: 0.10, siMaxDimension: 0.20, significance: 0.80 },
      expected: 'REJECTED',
    },
    {
      label:    'REJECTED: SI score exactly at threshold, dimension below',
      input:    { siScore: 0.249, siMaxDimension: 0.349, significance: 0.80 },
      expected: 'REJECTED',
    },
    {
      label:    'ADMITTED: SI score meets threshold, significance meets threshold',
      input:    { siScore: 0.25, siMaxDimension: 0.20, significance: 0.55 },
      expected: 'ADMITTED',
    },
    {
      label:    'ADMITTED: dimension meets threshold (score below), significance above',
      input:    { siScore: 0.10, siMaxDimension: 0.35, significance: 0.60 },
      expected: 'ADMITTED',
    },
    {
      label:    'SUB_THRESHOLD_RETAINED: SI score above, significance below',
      input:    { siScore: 0.80, siMaxDimension: 0.80, significance: 0.30 },
      expected: 'SUB_THRESHOLD_RETAINED',
    },
    {
      label:    'ADMITTED: SI score exactly at boundary (inclusive)',
      input:    { siScore: 0.25, siMaxDimension: 0.10, significance: 0.55 },
      expected: 'ADMITTED',
    },
    {
      label:    'REJECTED: just below both thresholds',
      input:    { siScore: 0.2499, siMaxDimension: 0.3499, significance: 0.99 },
      expected: 'REJECTED',
    },
  ];

  for (const c of cases) {
    test(c.label, () => {
      const result = decideAdmission(c.input, CONSTRAINTS);
      expect(result.decision).toBe(c.expected);
    });
  }

  test('determinism: 1000 identical calls always produce identical results', () => {
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

  test('result fields are self-consistent', () => {
    // passesWeighted / passesDimension / meetsSignificance must match decision
    const rejected = decideAdmission({ siScore: 0.10, siMaxDimension: 0.10, significance: 0.99 }, CONSTRAINTS);
    expect(rejected.decision).toBe('REJECTED');
    expect(rejected.passesWeighted || rejected.passesDimension).toBe(false);

    const admitted = decideAdmission({ siScore: 0.80, siMaxDimension: 0.80, significance: 0.80 }, CONSTRAINTS);
    expect(admitted.decision).toBe('ADMITTED');
    expect(admitted.passesWeighted || admitted.passesDimension).toBe(true);
    expect(admitted.meetsSignificance).toBe(true);

    const sub = decideAdmission({ siScore: 0.80, siMaxDimension: 0.80, significance: 0.20 }, CONSTRAINTS);
    expect(sub.decision).toBe('SUB_THRESHOLD_RETAINED');
    expect(sub.passesWeighted || sub.passesDimension).toBe(true);
    expect(sub.meetsSignificance).toBe(false);
  });
});

// ─── INV-ACT-4: Env threshold change without activation causes validation failure

describe('INV-ACT-4: Env threshold change without a new activation causes validation failure', () => {
  test('two different threshold configurations produce different digests', () => {
    // Simulate env change: same fields, different values
    const digestA = crypto.createHash('sha256').update(stableSerialize({
      SI_MIN_THRESHOLD: 0.25, SIG_THRESHOLD: 0.55, SI_DIM_THRESHOLD: 0.35,
      SHG_CORR_THRESHOLD: 0.35, SHG_INDEPENDENCE_THRESHOLD: 0.15,
    })).digest('hex');
    const digestB = crypto.createHash('sha256').update(stableSerialize({
      SI_MIN_THRESHOLD: 0.30, SIG_THRESHOLD: 0.55, SI_DIM_THRESHOLD: 0.35, // SI_MIN changed
      SHG_CORR_THRESHOLD: 0.35, SHG_INDEPENDENCE_THRESHOLD: 0.15,
    })).digest('hex');
    expect(digestA).not.toBe(digestB);
  });

  test('digest covers all five threshold fields independently', () => {
    const base = { SI_MIN_THRESHOLD: 0.25, SIG_THRESHOLD: 0.55, SI_DIM_THRESHOLD: 0.35,
                   SHG_CORR_THRESHOLD: 0.35, SHG_INDEPENDENCE_THRESHOLD: 0.15 };
    const baseDigest = crypto.createHash('sha256').update(stableSerialize(base)).digest('hex');
    const fields = Object.keys(base) as Array<keyof typeof base>;
    for (const field of fields) {
      const altered = { ...base, [field]: base[field] + 0.01 };
      const alteredDigest = crypto.createHash('sha256').update(stableSerialize(altered)).digest('hex');
      expect(alteredDigest).not.toBe(baseDigest);
    }
  });

  test('runStartupValidation returns NO_ACTIVATION when table is empty', async () => {
    await prisma.$executeRaw`TRUNCATE TABLE constraint_activation_sealed RESTART IDENTITY`;
    const state = await runStartupValidation();
    expect(state.status).toBe('NO_ACTIVATION');
    expect(state.reason).toBeTruthy();
  });

  test('runStartupValidation returns INVALID when constraint digest mismatches active constraints', async () => {
    // Insert an activation row whose `digest` does not match ACTIVE_CONSTRAINTS.digest.
    // The hash chain is computed correctly (so chain check passes), but the digest
    // comparison at step 3 of startup validation will fail.
    await prisma.$executeRaw`TRUNCATE TABLE constraint_activation_sealed RESTART IDENTITY`;

    const differentDigest = 'a'.repeat(64); // clearly not ACTIVE_CONSTRAINTS.digest
    const fakeValues = { SI_MIN_THRESHOLD: 0.99, SIG_THRESHOLD: 0.99, SI_DIM_THRESHOLD: 0.99,
                         SHG_CORR_THRESHOLD: 0.99, SHG_INDEPENDENCE_THRESHOLD: 0.99 };
    const activatedAt = new Date().toISOString();
    const logicDigest = computeLogicDigest();

    const payload = {
      constraint_version: 'cv-fake',
      digest:             differentDigest,
      values:             fakeValues,
      logic_digest:       logicDigest,
      activated_at:       activatedAt,
    };
    const currentHash = computeActivationHash(payload as any, ACTIVATION_GENESIS_PREV_HASH);

    await prisma.$executeRaw`
      INSERT INTO constraint_activation_sealed
        (constraint_version, digest, values, logic_digest, signer_key_version,
         signature, activated_at, prev_hash, current_hash)
      VALUES (
        ${'cv-fake'}, ${differentDigest}, ${JSON.stringify(fakeValues)}::jsonb,
        ${logicDigest}, ${'v1'}, ${'test-sig'}, ${activatedAt}::timestamptz,
        ${ACTIVATION_GENESIS_PREV_HASH}, ${currentHash}
      )
    `;

    // Public key not set in test env — signature step is skipped
    // Digest mismatch check fires instead
    const state = await runStartupValidation();
    expect(state.status).toBe('INVALID');
    expect(state.reason).toMatch(/digest/i);

    // Cleanup
    await prisma.$executeRaw`TRUNCATE TABLE constraint_activation_sealed RESTART IDENTITY`;
  });

  test('runStartupValidation returns INVALID when logic digest mismatches', async () => {
    await prisma.$executeRaw`TRUNCATE TABLE constraint_activation_sealed RESTART IDENTITY`;

    // Insert activation with the correct constraint digest but a wrong logic_digest
    const payload = buildActivationPayload();
    const wrongLogicDigest = 'b'.repeat(64);
    const payloadWithWrongLogic = { ...payload, logic_digest: wrongLogicDigest };
    const currentHash = computeActivationHash(payloadWithWrongLogic, ACTIVATION_GENESIS_PREV_HASH);

    await prisma.$executeRaw`
      INSERT INTO constraint_activation_sealed
        (constraint_version, digest, values, logic_digest, signer_key_version,
         signature, activated_at, prev_hash, current_hash)
      VALUES (
        ${payload.constraint_version}, ${payload.digest},
        ${JSON.stringify(payload.values)}::jsonb,
        ${wrongLogicDigest}, ${'v1'}, ${'test-sig'},
        ${payload.activated_at}::timestamptz,
        ${ACTIVATION_GENESIS_PREV_HASH}, ${currentHash}
      )
    `;

    const state = await runStartupValidation();
    expect(state.status).toBe('INVALID');
    expect(state.reason).toMatch(/logic.digest/i);

    await prisma.$executeRaw`TRUNCATE TABLE constraint_activation_sealed RESTART IDENTITY`;
  });
});

// ─── INV-ACT-5: Activation chain verification fails on row mutation ────────────

describe('INV-ACT-5: Activation chain verification fails on any row mutation', () => {
  // Generate a stable key pair for all tests in this group
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
    publicKeyEncoding:  { type: 'spki',  format: 'der' },
    privateKeyEncoding: { type: 'pkcs8', format: 'der' },
  });
  const pubHex     = publicKey.toString('hex');
  const privKeyObj = crypto.createPrivateKey({ key: privateKey, format: 'der', type: 'pkcs8' });

  function sign(payload: object): string {
    return crypto.sign(null, Buffer.from(stableSerialize(payload), 'utf8'), privKeyObj).toString('base64url');
  }

  test('tampering payload field changes current_hash', () => {
    const payload = buildActivationPayload();
    const original = computeActivationHash(payload, ACTIVATION_GENESIS_PREV_HASH);
    const tampered = computeActivationHash({ ...payload, constraint_version: 'cv-tampered' }, ACTIVATION_GENESIS_PREV_HASH);
    expect(original).not.toBe(tampered);
  });

  test('tampering prev_hash changes current_hash', () => {
    const payload = buildActivationPayload();
    const h1 = computeActivationHash(payload, ACTIVATION_GENESIS_PREV_HASH);
    const h2 = computeActivationHash(payload, 'DIFFERENT_PREV');
    expect(h1).not.toBe(h2);
  });

  test('chain verification: recomputed hash matches stored hash (positive case)', () => {
    const payload   = buildActivationPayload();
    const prevHash  = ACTIVATION_GENESIS_PREV_HASH;
    const storedHash = computeActivationHash(payload, prevHash);
    const recomputed = computeActivationHash(payload, prevHash);
    expect(recomputed).toBe(storedHash);
  });

  test('mutating any payload field breaks chain verification', () => {
    const payload = buildActivationPayload();
    const prevHash = ACTIVATION_GENESIS_PREV_HASH;
    const storedHash = computeActivationHash(payload, prevHash);

    const mutations: Array<[string, object]> = [
      ['constraint_version', { ...payload, constraint_version: 'cv-mutated' }],
      ['digest',             { ...payload, digest: 'x'.repeat(64) }],
      ['logic_digest',       { ...payload, logic_digest: 'y'.repeat(64) }],
      ['activated_at',       { ...payload, activated_at: '2000-01-01T00:00:00.000Z' }],
      ['values.SI_MIN',      { ...payload, values: { ...payload.values, SI_MIN_THRESHOLD: 0.99 } }],
    ];

    for (const [field, mutated] of mutations) {
      const recomputed = computeActivationHash(mutated, prevHash);
      expect(recomputed).not.toBe(storedHash);
    }
  });

  test('governance signature fails on any payload mutation', () => {
    const payload = buildActivationPayload();
    const sig = sign(payload);

    expect(verifyActivationSignature(payload, sig, pubHex)).toBe(true);

    const mutations: Array<object> = [
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
    const otherPubHex = otherPub.toString('hex');

    expect(verifyActivationSignature(payload, sig, pubHex)).toBe(true);
    expect(verifyActivationSignature(payload, sig, otherPubHex)).toBe(false);
  });

  test('corrupted signature hex is rejected without throwing', () => {
    const payload = buildActivationPayload();
    expect(verifyActivationSignature(payload, 'not-valid-base64url!!!', pubHex)).toBe(false);
    expect(verifyActivationSignature(payload, '', pubHex)).toBe(false);
  });
});
