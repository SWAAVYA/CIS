import { describe, test, expect } from 'vitest';
import { prisma, createTestCase, createTestDomain, createTestSignal } from './setup';

// ─── GROUP 1: Signal Lifecycle State Machine ──────────────────────────────────

describe('INV-1: Signal Lifecycle State Machine', () => {
  test('INV-1.1: Signal rejects invalid lifecycle_status', async () => {
    const { id: caseId } = await createTestCase();
    const { id: domainId } = await createTestDomain(caseId);

    await expect(
      prisma.signals.create({
        data: {
          case_id: caseId,
          domain_id: domainId,
          content: 'test',
          lifecycle_status: 'QUARANTINED', // removed from valid enum
          is_quarantined: false,
          is_connected: false,
          is_wsp_protected: false,
          shg_mode: 'PENDING'
        }
      })
    ).rejects.toThrow();

    await expect(
      prisma.signals.create({
        data: {
          case_id: caseId,
          domain_id: domainId,
          content: 'test',
          lifecycle_status: 'ELEVATED', // also removed
          is_quarantined: false,
          is_connected: false,
          is_wsp_protected: false,
          shg_mode: 'PENDING'
        }
      })
    ).rejects.toThrow();
  });

  test('INV-1.2: Governance flags are independent of lifecycle_status', async () => {
    const { id: caseId } = await createTestCase();
    const { id: domainId } = await createTestDomain(caseId);

    const signal = await createTestSignal(caseId, domainId, {
      lifecycle_status: 'RETAINED',
      is_quarantined: true,
      is_connected: true,
      is_wsp_protected: true
    });

    expect(signal.lifecycle_status).toBe('RETAINED');
    expect(signal.is_quarantined).toBe(true);
    expect(signal.is_connected).toBe(true);
    expect(signal.is_wsp_protected).toBe(true);

    const retrieved = await prisma.signals.findUnique({ where: { id: signal.id } });
    expect(retrieved!.lifecycle_status).toBe('RETAINED');
    expect(retrieved!.is_quarantined).toBe(true);
    expect(retrieved!.is_connected).toBe(true);
  });

  test('INV-1.3: Terminal state enforcement is service responsibility, not DB constraint', async () => {
    const { id: caseId } = await createTestCase();
    const { id: domainId } = await createTestDomain(caseId);

    const signal = await createTestSignal(caseId, domainId, {
      lifecycle_status: 'EXPIRED'
    });

    // DB alone does NOT block this — the SLS service must
    const event = await prisma.signal_events.create({
      data: {
        signal_id: signal.id,
        case_id: caseId,
        from_status: 'EXPIRED',
        to_status: 'RETAINED',
        reason: 'Attempted reactivation of expired signal'
      }
    });

    expect(event).toBeDefined();
    // SLS service tests (INV-2.x) prove the service blocks this
  });

  test('INV-1.4: Every lifecycle transition creates a signal_events record', async () => {
    const { id: caseId } = await createTestCase();
    const { id: domainId } = await createTestDomain(caseId);
    const signal = await createTestSignal(caseId, domainId);

    const transitions = [
      { from: 'CANDIDATE', to: 'ADMITTED',  reason: 'SI score above threshold' },
      { from: 'ADMITTED',  to: 'RETAINED',  reason: 'Significance above threshold' },
      { from: 'RETAINED',  to: 'ASSESSED',  reason: 'Investigator assessment' },
      { from: 'ASSESSED',  to: 'RESOLVED',  reason: 'Resolution confirmed' },
      { from: 'RESOLVED',  to: 'ARCHIVED',  reason: 'Case archived' }
    ];

    for (const t of transitions) {
      await prisma.signal_events.create({
        data: {
          signal_id: signal.id,
          case_id: caseId,
          from_status: t.from,
          to_status: t.to,
          reason: t.reason
        }
      });
      await prisma.signals.update({
        where: { id: signal.id },
        data: { lifecycle_status: t.to }
      });
    }

    const events = await prisma.signal_events.findMany({
      where: { signal_id: signal.id },
      orderBy: { created_at: 'asc' }
    });

    expect(events).toHaveLength(5);
    expect(events[0].to_status).toBe('ADMITTED');
    expect(events[4].to_status).toBe('ARCHIVED');

    const archived = await prisma.signals.findUnique({ where: { id: signal.id } });
    expect(archived!.lifecycle_status).toBe('ARCHIVED');
  });
});

// ─── GROUP 2: WSP Protection ──────────────────────────────────────────────────

describe('INV-2: WSP Protection (LP-2 Hard Rejection)', () => {
  test('INV-2.1: WSP-protected signal cannot be expired (service enforcement)', async () => {
    const { id: caseId } = await createTestCase();
    const { id: domainId } = await createTestDomain(caseId);

    const signal = await createTestSignal(caseId, domainId, {
      lifecycle_status: 'ADMITTED',
      is_wsp_protected: true
    });

    const { transitionSignal } = await import('../src/services/sls.js');

    const result = await transitionSignal(signal.id, 'EXPIRED', 'Attempted expiry');

    expect(result.permitted).toBe(false);
    if (!result.permitted) {
      expect(result.code).toBe('WSP_PROTECTION_ACTIVE');
      expect(result.lp).toBe('LP-2');
    }

    const retrieved = await prisma.signals.findUnique({ where: { id: signal.id } });
    expect(retrieved!.lifecycle_status).toBe('ADMITTED');
    expect(retrieved!.is_wsp_protected).toBe(true);

    const events = await prisma.signal_events.findMany({
      where: { signal_id: signal.id, to_status: 'EXPIRED' }
    });
    expect(events).toHaveLength(0);
  });

  test('INV-2.2: WSP protection clears when minimum retention is met', async () => {
    const { transitionSignal } = await import('../src/services/sls.js');

    const { id: caseId } = await createTestCase();
    const { id: domainId } = await createTestDomain(caseId);

    const signal = await createTestSignal(caseId, domainId, {
      lifecycle_status: 'RETAINED',
      is_wsp_protected: true,
      observation_period: 5
    });

    // 2 events represent 2 observation periods — meets WSP_MIN_PERIODS
    await prisma.signal_events.createMany({
      data: [
        { signal_id: signal.id, case_id: caseId, from_status: 'CANDIDATE', to_status: 'ADMITTED', reason: 'Period 1' },
        { signal_id: signal.id, case_id: caseId, from_status: 'ADMITTED',  to_status: 'RETAINED', reason: 'Period 2' }
      ]
    });

    const result = await transitionSignal(signal.id, 'EXPIRED', 'Expiry after WSP period met');

    expect(result.permitted).toBe(true);

    const retrieved = await prisma.signals.findUnique({ where: { id: signal.id } });
    expect(retrieved!.lifecycle_status).toBe('EXPIRED');
    expect(retrieved!.is_wsp_protected).toBe(false);
  });
});

// ─── GROUP 3: Contradiction Governance ───────────────────────────────────────

describe('INV-3: Contradiction Governance', () => {
  test('INV-3.1: Quarantined signal cannot transition to EXPIRED', async () => {
    const { transitionSignal } = await import('../src/services/sls.js');

    const { id: caseId } = await createTestCase();
    const { id: domainId } = await createTestDomain(caseId);

    const signal = await createTestSignal(caseId, domainId, {
      lifecycle_status: 'RETAINED',
      is_quarantined: true
    });

    const result = await transitionSignal(signal.id, 'EXPIRED', 'Attempted expiry of quarantined signal');

    expect(result.permitted).toBe(false);
    if (!result.permitted) expect(result.code).toBe('QUARANTINE_ACTIVE');

    const retrieved = await prisma.signals.findUnique({ where: { id: signal.id } });
    expect(retrieved!.lifecycle_status).toBe('RETAINED');
  });

  test('INV-3.2: Quarantined signal cannot transition to RESOLVED', async () => {
    const { transitionSignal } = await import('../src/services/sls.js');

    const { id: caseId } = await createTestCase();
    const { id: domainId } = await createTestDomain(caseId);

    const signal = await createTestSignal(caseId, domainId, {
      lifecycle_status: 'RETAINED',
      is_quarantined: true
    });

    const result = await transitionSignal(signal.id, 'RESOLVED', 'Direct resolution attempt');

    expect(result.permitted).toBe(false);
    if (!result.permitted) expect(result.code).toBe('QUARANTINE_ACTIVE');
  });

  test('INV-3.3: Contradiction cannot be resolved without RC-1, RC-2, or RC-3', async () => {
    const { resolveContradiction } = await import('../src/services/sls.js');

    const { id: caseId } = await createTestCase();
    const { id: domainId } = await createTestDomain(caseId);

    const signalA = await createTestSignal(caseId, domainId, { lifecycle_status: 'RETAINED', is_quarantined: true });
    const signalB = await createTestSignal(caseId, domainId, { lifecycle_status: 'RETAINED', is_quarantined: true });

    const [ordA, ordB] = signalA.id < signalB.id ? [signalA, signalB] : [signalB, signalA];
    const contradiction = await prisma.contradictions.create({
      data: {
        case_id: caseId,
        signal_a_id: ordA.id,
        signal_b_id: ordB.id,
        description: 'Signal A asserts high pressure; Signal B asserts nominal pressure',
        status: 'ACTIVE'
      }
    });

    await expect(
      resolveContradiction(contradiction.id, {
        resolution_type: null,
        resolution_basis: 'It just seemed right',
        resolved_signal_id: signalA.id
      })
    ).rejects.toThrow(/RC-1.*RC-2.*RC-3|resolution_type required/i);

    const retrieved = await prisma.contradictions.findUnique({ where: { id: contradiction.id } });
    expect(retrieved!.status).toBe('ACTIVE');
    expect(retrieved!.resolution_type).toBeNull();
  });

  test('INV-3.4: Contradiction resolution clears is_quarantined on both signals', async () => {
    const { resolveContradiction } = await import('../src/services/sls.js');

    const { id: caseId } = await createTestCase();
    const { id: domainId } = await createTestDomain(caseId);

    const signalA = await createTestSignal(caseId, domainId, { lifecycle_status: 'RETAINED', is_quarantined: true });
    const signalB = await createTestSignal(caseId, domainId, { lifecycle_status: 'RETAINED', is_quarantined: true });

    const [ordA, ordB] = signalA.id < signalB.id ? [signalA, signalB] : [signalB, signalA];
    const contradiction = await prisma.contradictions.create({
      data: {
        case_id: caseId,
        signal_a_id: ordA.id,
        signal_b_id: ordB.id,
        description: 'Test contradiction',
        status: 'ACTIVE'
      }
    });

    await resolveContradiction(contradiction.id, {
      resolution_type: 'RC-3',
      resolution_basis: 'Domain expert confirmed Signal A describes actual condition',
      resolved_signal_id: signalA.id
    });

    const updatedA = await prisma.signals.findUnique({ where: { id: signalA.id } });
    const updatedB = await prisma.signals.findUnique({ where: { id: signalB.id } });
    const resolved = await prisma.contradictions.findUnique({ where: { id: contradiction.id } });

    expect(updatedA!.is_quarantined).toBe(false);
    expect(updatedB!.is_quarantined).toBe(false);
    expect(resolved!.status).toBe('RESOLVED');
    expect(resolved!.resolution_type).toBe('RC-3');
  });

  test('INV-3.5: A signal cannot contradict itself', async () => {
    const { id: caseId } = await createTestCase();
    const { id: domainId } = await createTestDomain(caseId);
    const signal = await createTestSignal(caseId, domainId);

    await expect(
      prisma.contradictions.create({
        data: {
          case_id: caseId,
          signal_a_id: signal.id,
          signal_b_id: signal.id, // same signal
          description: 'Self contradiction',
          status: 'ACTIVE'
        }
      })
    ).rejects.toThrow(); // CHECK (signal_a_id != signal_b_id)
  });

  test('INV-3.6: The same signal pair cannot have two contradiction records', async () => {
    const { id: caseId } = await createTestCase();
    const { id: domainId } = await createTestDomain(caseId);

    const signalA = await createTestSignal(caseId, domainId);
    const signalB = await createTestSignal(caseId, domainId);
    const [a, b] = signalA.id < signalB.id ? [signalA.id, signalB.id] : [signalB.id, signalA.id];

    await prisma.contradictions.create({
      data: { case_id: caseId, signal_a_id: a, signal_b_id: b, description: 'First', status: 'ACTIVE' }
    });

    await expect(
      prisma.contradictions.create({
        data: { case_id: caseId, signal_a_id: a, signal_b_id: b, description: 'Duplicate', status: 'ACTIVE' }
      })
    ).rejects.toThrow(); // UNIQUE(signal_a_id, signal_b_id)
  });
});

// ─── GROUP 4: Score Change Audit ──────────────────────────────────────────────

describe('INV-4: Score Change Audit', () => {
  test('INV-4.1: updateSignalScores creates a score_change_audit record', async () => {
    const { updateSignalScores } = await import('../src/services/sls.js');

    const { id: caseId } = await createTestCase();
    const { id: domainId } = await createTestDomain(caseId);

    const signal = await createTestSignal(caseId, domainId, {
      si_score: 0.45,
      significance: 0.52
    });

    await updateSignalScores(signal.id, {
      si_score: 0.72,
      significance: 0.68,
      reason: 'Investigator revised SI score after additional analysis'
    });

    const auditRecords = await prisma.score_change_audit.findMany({
      where: { signal_id: signal.id }
    });

    expect(auditRecords).toHaveLength(1);
    expect(Number(auditRecords[0].before_si_score)).toBeCloseTo(0.45);
    expect(Number(auditRecords[0].after_si_score)).toBeCloseTo(0.72);
    expect(Number(auditRecords[0].before_significance)).toBeCloseTo(0.52);
    expect(Number(auditRecords[0].after_significance)).toBeCloseTo(0.68);
    expect(auditRecords[0].reason).toBe('Investigator revised SI score after additional analysis');
  });

  test('INV-4.2: updateSignalScores rejects missing reason', async () => {
    const { updateSignalScores } = await import('../src/services/sls.js');

    const { id: caseId } = await createTestCase();
    const { id: domainId } = await createTestDomain(caseId);
    const signal = await createTestSignal(caseId, domainId, { si_score: 0.45 });

    await expect(
      updateSignalScores(signal.id, {
        si_score: 0.72,
        reason: '' // empty reason
      })
    ).rejects.toThrow(/reason required|reason cannot be empty/i);
  });
});

// ─── GROUP 5: SHG Deduplication ──────────────────────────────────────────────

describe('INV-5: SHG Deduplication', () => {
  test('INV-5.1: Concurrent SHG execution produces exactly one hypothesis per connection', async () => {
    const { generateHypothesis } = await import('../src/services/shg.js');

    const { id: caseId } = await createTestCase();
    const domainA = await createTestDomain(caseId, 'Domain A');
    const domainB = await createTestDomain(caseId, 'Domain B');

    const [dA, dB] = domainA.id < domainB.id ? [domainA, domainB] : [domainB, domainA];
    await prisma.domain_independence.create({
      data: {
        domain_a_id: dA.id,
        domain_b_id: dB.id,
        is_independent: true,
        independence_basis: 'Separate organisational units'
      }
    });

    const signalA = await createTestSignal(caseId, domainA.id, {
      lifecycle_status: 'RETAINED',
      mismatch_type: 'RATE',
      deviation_direction: 'UP',
      observation_period: 3,
      shg_mode: 'RULE_TAGGED'
    });

    const signalB = await createTestSignal(caseId, domainB.id, {
      lifecycle_status: 'RETAINED',
      mismatch_type: 'RATE',
      deviation_direction: 'UP',
      observation_period: 3,
      shg_mode: 'RULE_TAGGED'
    });

    const [ordA, ordB] = signalA.id < signalB.id ? [signalA, signalB] : [signalB, signalA];
    const connection = await prisma.signal_connections.create({
      data: {
        case_id: caseId,
        signal_a_id: ordA.id,
        signal_b_id: ordB.id,
        domain_a_id: domainA.id,
        domain_b_id: domainB.id,
        mismatch_type_match: true,
        direction_match: true,
        temporal_match: true,
        dimension_match: false,
        correspondence_strength: 0.90,
        domains_independent: true,
        shg_triggered: false
      }
    });

    // Fire concurrently — prove the race condition produces exactly 1 hypothesis
    await Promise.allSettled([
      generateHypothesis(connection.id),
      generateHypothesis(connection.id),
      generateHypothesis(connection.id)
    ]);

    const hypotheses = await prisma.hypotheses.findMany({
      where: { connection_id: connection.id }
    });

    expect(hypotheses).toHaveLength(1);

    const conn = await prisma.signal_connections.findUnique({ where: { id: connection.id } });
    expect(conn!.shg_triggered).toBe(true);
  });

  test('INV-5.1b: SELECT FOR UPDATE holds against a simulated race', async () => {
    const { PrismaClient } = await import('@prisma/client');
    const client1 = new PrismaClient({ datasources: { db: { url: process.env.TEST_DATABASE_URL } } });
    const client2 = new PrismaClient({ datasources: { db: { url: process.env.TEST_DATABASE_URL } } });

    try {
      const { id: caseId } = await createTestCase();
      const domainA = await createTestDomain(caseId, 'Domain A');
      const domainB = await createTestDomain(caseId, 'Domain B');

      const [dA, dB] = domainA.id < domainB.id ? [domainA, domainB] : [domainB, domainA];
      await prisma.domain_independence.create({
        data: { domain_a_id: dA.id, domain_b_id: dB.id, is_independent: true }
      });

      const signalA = await createTestSignal(caseId, domainA.id, {
        lifecycle_status: 'RETAINED', mismatch_type: 'RATE',
        deviation_direction: 'UP', observation_period: 3, shg_mode: 'RULE_TAGGED'
      });
      const signalB = await createTestSignal(caseId, domainB.id, {
        lifecycle_status: 'RETAINED', mismatch_type: 'RATE',
        deviation_direction: 'UP', observation_period: 3, shg_mode: 'RULE_TAGGED'
      });

      const [ordA, ordB] = signalA.id < signalB.id ? [signalA, signalB] : [signalB, signalA];
      const connection = await prisma.signal_connections.create({
        data: {
          case_id: caseId,
          signal_a_id: ordA.id, signal_b_id: ordB.id,
          domain_a_id: domainA.id, domain_b_id: domainB.id,
          mismatch_type_match: true, direction_match: true,
          temporal_match: true, dimension_match: false,
          correspondence_strength: 0.75, domains_independent: true,
          shg_triggered: false
        }
      });

      const hypothesisData = {
        case_id: caseId,
        title: 'Race test hypothesis',
        description: 'Generated under concurrent load',
        hypothesis_type: 'HCL' as const,
        plausibility: 0.50,
        status: 'ACTIVE',
        generated_by: 'SHG',
      };

      // tx1: acquires FOR UPDATE lock, holds 200ms, then inserts hypothesis
      const tx1 = client1.$transaction(async (tx) => {
        await tx.$executeRaw`
          SELECT id FROM signal_connections WHERE id = ${connection.id}::uuid FOR UPDATE
        `;
        await new Promise(resolve => setTimeout(resolve, 200));
        await tx.hypotheses.create({ data: { ...hypothesisData, connection_id: connection.id } });
        await tx.$executeRaw`
          UPDATE signal_connections SET shg_triggered = TRUE WHERE id = ${connection.id}::uuid
        `;
      }, { timeout: 10000 });

      // tx2: starts immediately but blocks on FOR UPDATE until tx1 commits,
      // then reads shg_triggered = TRUE and aborts without inserting
      const tx2 = client2.$transaction(async (tx) => {
        await tx.$executeRaw`
          SELECT id FROM signal_connections WHERE id = ${connection.id}::uuid FOR UPDATE
        `;
        const rows = await tx.$queryRaw<Array<{ shg_triggered: boolean }>>`
          SELECT shg_triggered FROM signal_connections WHERE id = ${connection.id}::uuid
        `;
        if (rows[0].shg_triggered) return null; // correct — tx1 already handled it
        await tx.hypotheses.create({ data: { ...hypothesisData, connection_id: connection.id } });
      }, { timeout: 10000 });

      await Promise.allSettled([tx1, tx2]);

      const hypotheses = await prisma.hypotheses.findMany({
        where: { connection_id: connection.id }
      });
      expect(hypotheses).toHaveLength(1);
    } finally {
      await client1.$disconnect();
      await client2.$disconnect();
    }
  });

  test('INV-5.2: The same signal pair cannot have two connection records', async () => {
    const { id: caseId } = await createTestCase();
    const domainA = await createTestDomain(caseId, 'Domain A');
    const domainB = await createTestDomain(caseId, 'Domain B');

    const signalA = await createTestSignal(caseId, domainA.id);
    const signalB = await createTestSignal(caseId, domainB.id);
    const [a, b] = signalA.id < signalB.id ? [signalA, signalB] : [signalB, signalA];

    await prisma.signal_connections.create({
      data: {
        case_id: caseId, signal_a_id: a.id, signal_b_id: b.id,
        domain_a_id: domainA.id, domain_b_id: domainB.id,
        correspondence_strength: 0.75, domains_independent: true,
        mismatch_type_match: true, dimension_match: false,
        temporal_match: true, direction_match: true, shg_triggered: false
      }
    });

    await expect(
      prisma.signal_connections.create({
        data: {
          case_id: caseId, signal_a_id: a.id, signal_b_id: b.id,
          domain_a_id: domainA.id, domain_b_id: domainB.id,
          correspondence_strength: 0.60, domains_independent: true,
          mismatch_type_match: false, dimension_match: true,
          temporal_match: true, direction_match: false, shg_triggered: false
        }
      })
    ).rejects.toThrow(); // UNIQUE(signal_a_id, signal_b_id)
  });
});

// ─── GROUP 6: Reasoning and Evidence Integrity ────────────────────────────────

describe('INV-6: Reasoning and Evidence Integrity', () => {
  test('INV-6.1: Duplicate evidence submission is rejected', async () => {
    const { id: caseId } = await createTestCase();
    const { id: domainId } = await createTestDomain(caseId);
    const signal = await createTestSignal(caseId, domainId);

    const hypothesis = await prisma.hypotheses.create({
      data: {
        case_id: caseId,
        title: 'Test hypothesis',
        description: 'A test hypothesis',
        hypothesis_type: 'INVESTIGATOR',
        plausibility: 0.50,
        status: 'ACTIVE',
        generated_by: 'INVESTIGATOR'
      }
    });

    await prisma.hypothesis_evidence.create({
      data: {
        hypothesis_id: hypothesis.id,
        case_id: caseId,
        signal_id: signal.id,
        content: 'First submission',
        evidence_type: 'SUPPORTING',
        weight: 0.70
      }
    });

    await expect(
      prisma.hypothesis_evidence.create({
        data: {
          hypothesis_id: hypothesis.id,
          case_id: caseId,
          signal_id: signal.id, // same signal
          content: 'Second submission — should fail',
          evidence_type: 'SUPPORTING',
          weight: 0.70
        }
      })
    ).rejects.toThrow(); // UNIQUE(hypothesis_id, signal_id)
  });

  test('INV-6.2: Plausibility stays within [0.0, 1.0] under extreme evidence', async () => {
    const { updatePlausibility } = await import('../src/services/reasoning.js');

    const { id: caseId } = await createTestCase();

    const hypothesis = await prisma.hypotheses.create({
      data: {
        case_id: caseId, title: 'Test', description: 'Test',
        hypothesis_type: 'INVESTIGATOR', plausibility: 0.50,
        status: 'ACTIVE', generated_by: 'INVESTIGATOR'
      }
    });

    await updatePlausibility(hypothesis.id, 'SUPPORTING', 1.0);
    let h = await prisma.hypotheses.findUnique({ where: { id: hypothesis.id } });
    expect(Number(h!.plausibility)).toBeLessThanOrEqual(1.0);
    expect(Number(h!.plausibility)).toBeGreaterThan(0.9);

    await prisma.hypotheses.update({ where: { id: hypothesis.id }, data: { plausibility: 0.50 } });

    await updatePlausibility(hypothesis.id, 'CONTRADICTING', 1.0);
    h = await prisma.hypotheses.findUnique({ where: { id: hypothesis.id } });
    expect(Number(h!.plausibility)).toBeGreaterThanOrEqual(0.0);
    expect(Number(h!.plausibility)).toBeLessThan(0.1);
  });

  test('INV-6.3: CONTEXTUAL evidence leaves plausibility unchanged', async () => {
    const { updatePlausibility } = await import('../src/services/reasoning.js');

    const { id: caseId } = await createTestCase();
    const initialPlausibility = 0.63;

    const hypothesis = await prisma.hypotheses.create({
      data: {
        case_id: caseId, title: 'Test', description: 'Test',
        hypothesis_type: 'INVESTIGATOR', plausibility: initialPlausibility,
        status: 'ACTIVE', generated_by: 'INVESTIGATOR'
      }
    });

    await updatePlausibility(hypothesis.id, 'CONTEXTUAL', 0.90);

    const h = await prisma.hypotheses.findUnique({ where: { id: hypothesis.id } });
    expect(Number(h!.plausibility)).toBeCloseTo(initialPlausibility, 2);
  });

  test('INV-6.4: Updating hypothesis A plausibility does not change hypothesis B plausibility', async () => {
    const { updatePlausibility } = await import('../src/services/reasoning.js');

    const { id: caseId } = await createTestCase();

    const set = await prisma.competition_sets.create({
      data: { case_id: caseId, description: 'Competing explanations' }
    });

    const hypothesisA = await prisma.hypotheses.create({
      data: {
        case_id: caseId, title: 'Hypothesis A', description: 'A',
        hypothesis_type: 'INVESTIGATOR', plausibility: 0.50,
        status: 'ACTIVE', generated_by: 'INVESTIGATOR',
        competition_set_id: set.id
      }
    });

    const hypothesisB = await prisma.hypotheses.create({
      data: {
        case_id: caseId, title: 'Hypothesis B', description: 'B',
        hypothesis_type: 'INVESTIGATOR', plausibility: 0.50,
        status: 'ACTIVE', generated_by: 'INVESTIGATOR',
        competition_set_id: set.id
      }
    });

    await updatePlausibility(hypothesisA.id, 'SUPPORTING', 0.85);

    const [a, b] = await Promise.all([
      prisma.hypotheses.findUnique({ where: { id: hypothesisA.id } }),
      prisma.hypotheses.findUnique({ where: { id: hypothesisB.id } })
    ]);

    expect(Number(a!.plausibility)).toBeGreaterThan(0.50);
    expect(Number(b!.plausibility)).toBeCloseTo(0.50, 2); // B is UNCHANGED
    expect(Number(a!.plausibility) + Number(b!.plausibility)).toBeGreaterThan(1.0); // sum > 1.0 is correct
  });

  test('INV-6.5: updatePlausibility always creates a history record', async () => {
    const { updatePlausibility } = await import('../src/services/reasoning.js');

    const { id: caseId } = await createTestCase();
    const hypothesis = await prisma.hypotheses.create({
      data: {
        case_id: caseId, title: 'Test', description: 'Test',
        hypothesis_type: 'INVESTIGATOR', plausibility: 0.50,
        status: 'ACTIVE', generated_by: 'INVESTIGATOR'
      }
    });

    await updatePlausibility(hypothesis.id, 'SUPPORTING', 0.70, 'uuid-of-evidence');
    await updatePlausibility(hypothesis.id, 'CONTRADICTING', 0.30);
    await updatePlausibility(hypothesis.id, 'CONTEXTUAL', 0.90);

    const history = await prisma.plausibility_history.findMany({
      where: { hypothesis_id: hypothesis.id },
      orderBy: { recorded_at: 'asc' }
    });

    expect(history).toHaveLength(3);
    expect(history[0].reason).toContain('SUPPORTING');
    expect(history[1].reason).toContain('CONTRADICTING');
    expect(history[2].reason).toContain('CONTEXTUAL');
  });
});

// ─── GROUP 7: Admission Audit Completeness ────────────────────────────────────

describe('INV-7: Admission Audit Completeness', () => {
  test('INV-7.1: Admission audit record exists for every admitted signal', async () => {
    const { admitSignal } = await import('../src/services/sls.js');

    const { id: caseId } = await createTestCase();
    const { id: domainId } = await createTestDomain(caseId);
    const signal = await createTestSignal(caseId, domainId);

    await admitSignal(signal.id, {
      si_score: 0.72,
      significance: 0.68,
      si_threshold: 0.25,
      sig_threshold: 0.55
    });

    const audit = await prisma.admission_audit.findFirst({
      where: { signal_id: signal.id }
    });

    expect(audit).not.toBeNull();
    expect(audit!.decision).toBe('ADMITTED');
    expect(Number(audit!.si_threshold)).toBe(0.25);
    expect(Number(audit!.sig_threshold)).toBe(0.55);
  });

  test('INV-7.2: Rejected signals have a REJECTED admission audit record', async () => {
    const { admitSignal } = await import('../src/services/sls.js');

    const { id: caseId } = await createTestCase();
    const { id: domainId } = await createTestDomain(caseId);
    const signal = await createTestSignal(caseId, domainId);

    await admitSignal(signal.id, {
      si_score: 0.15, // below SI_min of 0.25
      significance: 0.30,
      si_threshold: 0.25,
      sig_threshold: 0.55
    });

    const audit = await prisma.admission_audit.findFirst({
      where: { signal_id: signal.id }
    });

    expect(audit!.decision).toBe('REJECTED');
    expect(audit!.rejection_reason).toBeTruthy();

    const s = await prisma.signals.findUnique({ where: { id: signal.id } });
    expect(s!.lifecycle_status).toBe('EXPIRED');
    expect(s!.rejection_lp).toBe('LP-1');
  });
});

// ─── GROUP 8: Recurrence and Archival ────────────────────────────────────────

describe('INV-8: Recurrence and Archival', () => {
  test('INV-8.1: Recurrence creates new Candidate linked to archived signal', async () => {
    const { id: caseId } = await createTestCase();
    const { id: domainId } = await createTestDomain(caseId);

    const original = await createTestSignal(caseId, domainId, {
      lifecycle_status: 'ARCHIVED'
    });

    const recurrence = await prisma.signals.create({
      data: {
        case_id: caseId,
        domain_id: domainId,
        content: 'Recurrence of original signal — same structural pattern observed in period 7',
        lifecycle_status: 'CANDIDATE',
        original_signal_id: original.id,
        is_quarantined: false,
        is_connected: false,
        is_wsp_protected: false,
        shg_mode: 'PENDING'
      }
    });

    expect(recurrence.original_signal_id).toBe(original.id);
    expect(recurrence.lifecycle_status).toBe('CANDIDATE');

    const orig = await prisma.signals.findUnique({ where: { id: original.id } });
    expect(orig!.lifecycle_status).toBe('ARCHIVED');
  });
});
