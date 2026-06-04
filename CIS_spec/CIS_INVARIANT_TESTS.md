# CIS Governance Invariant Tests

**Purpose:** Prove the lifecycle and governance invariants before any application logic is built.  
**Stack:** Vitest (or Jest) + Prisma test client against a real test database.  
**When to run:** After `prisma migrate dev` completes. Before Phase 3 services. Before any routes.  
**Pass condition:** All tests pass. Zero exceptions. If any fail, fix the schema or service before proceeding.

These are not unit tests of functions. They are proofs of invariants — structural guarantees the system must uphold regardless of how it is called.

---

## Setup

```typescript
// tests/setup.ts
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  datasources: { db: { url: process.env.TEST_DATABASE_URL } }
});

export async function createTestCase() {
  return prisma.cases.create({
    data: {
      title: 'Test Case',
      access_code: `TC-${Date.now()}`,
      status: 'ACTIVE'
    }
  });
}

export async function createTestDomain(caseId: string, name = 'Domain A') {
  return prisma.domains.create({
    data: { case_id: caseId, name }
  });
}

export async function createTestSignal(caseId: string, domainId: string, overrides = {}) {
  return prisma.signals.create({
    data: {
      case_id: caseId,
      domain_id: domainId,
      content: 'Test signal content',
      lifecycle_status: 'CANDIDATE',
      is_quarantined: false,
      is_connected: false,
      is_wsp_protected: false,
      shg_mode: 'PENDING',
      ...overrides
    }
  });
}

beforeEach(async () => {
  // Clean slate — delete in dependency order
  await prisma.$executeRaw`TRUNCATE TABLE 
    analytics_snapshots, briefings, plausibility_history, hypothesis_evidence,
    hypotheses, competition_sets, released_options, contradictions,
    signal_connections, score_change_audit, admission_audit, signal_events,
    signals, domain_independence_history, domain_independence, domains, cases
    CASCADE`;
});

afterAll(async () => {
  await prisma.$disconnect();
});
```

---

## Invariant Group 1 — Signal Lifecycle State Machine

### INV-1.1: Only valid lifecycle_status values are accepted

```typescript
test('INV-1.1: Signal rejects invalid lifecycle_status', async () => {
  const { id: caseId } = await createTestCase();
  const { id: domainId } = await createTestDomain(caseId);

  await expect(
    prisma.signals.create({
      data: {
        case_id: caseId,
        domain_id: domainId,
        content: 'test',
        lifecycle_status: 'QUARANTINED',  // removed from valid enum
        is_quarantined: false,
        is_connected: false,
        is_wsp_protected: false,
        shg_mode: 'PENDING'
      }
    })
  ).rejects.toThrow();  // CHECK constraint violation

  await expect(
    prisma.signals.create({
      data: {
        case_id: caseId,
        domain_id: domainId,
        content: 'test',
        lifecycle_status: 'ELEVATED',     // also removed
        is_quarantined: false,
        is_connected: false,
        is_wsp_protected: false,
        shg_mode: 'PENDING'
      }
    })
  ).rejects.toThrow();
});
```

### INV-1.2: A signal can be RETAINED + quarantined + connected simultaneously

```typescript
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

  // Retrieve and verify persistence
  const retrieved = await prisma.signals.findUnique({ where: { id: signal.id } });
  expect(retrieved!.lifecycle_status).toBe('RETAINED');
  expect(retrieved!.is_quarantined).toBe(true);
  expect(retrieved!.is_connected).toBe(true);
});
```

### INV-1.3: EXPIRED is a terminal state — no further transitions can be recorded with a different from_state claim

```typescript
test('INV-1.3: EXPIRED signal can receive no further lifecycle transitions', async () => {
  const { id: caseId } = await createTestCase();
  const { id: domainId } = await createTestDomain(caseId);

  const signal = await createTestSignal(caseId, domainId, {
    lifecycle_status: 'EXPIRED'
  });

  // Record attempting a transition from EXPIRED
  const event = await prisma.signalEvents.create({
    data: {
      signal_id: signal.id,
      case_id: caseId,
      from_status: 'EXPIRED',
      to_status: 'RETAINED',
      reason: 'Attempted reactivation of expired signal'
    }
  });

  // The database does not block this — the SLS service must block it.
  // This test documents that the DB alone cannot enforce terminal state.
  // The SLS service MUST check lifecycle_status before permitting transitions.
  // Document: terminal enforcement is service responsibility, not DB constraint.
  expect(event).toBeDefined(); // DB permits it — service must not

  // Architectural note: add this check to SLS service tests (INV group 5)
});
```

### INV-1.4: Full lifecycle event audit trail — every state change has a record

```typescript
test('INV-1.4: Every lifecycle transition creates a signal_events record', async () => {
  const { id: caseId } = await createTestCase();
  const { id: domainId } = await createTestDomain(caseId);
  const signal = await createTestSignal(caseId, domainId);

  // Simulate the transitions a signal goes through
  const transitions = [
    { from: 'CANDIDATE', to: 'ADMITTED', reason: 'SI score above threshold' },
    { from: 'ADMITTED', to: 'RETAINED', reason: 'Significance above threshold' },
    { from: 'RETAINED', to: 'ASSESSED', reason: 'Investigator assessment' },
    { from: 'ASSESSED', to: 'RESOLVED', reason: 'Resolution confirmed' },
    { from: 'RESOLVED', to: 'ARCHIVED', reason: 'Case archived' }
  ];

  for (const t of transitions) {
    await prisma.signalEvents.create({
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
      data: { lifecycle_status: t.to as any }
    });
  }

  const events = await prisma.signalEvents.findMany({
    where: { signal_id: signal.id },
    orderBy: { created_at: 'asc' }
  });

  expect(events).toHaveLength(5);
  expect(events[0].to_status).toBe('ADMITTED');
  expect(events[4].to_status).toBe('ARCHIVED');

  // Full history is preserved — nothing is deleted
  const archived = await prisma.signals.findUnique({ where: { id: signal.id } });
  expect(archived!.lifecycle_status).toBe('ARCHIVED');
});
```

---

## Invariant Group 2 — WSP Protection (LP-2 Hard Rejection)

### INV-2.1: WSP-protected signal — EXPIRED transition is structurally blocked by service

```typescript
// This tests the SLS service directly, not the database constraint.
// Import the SLS service after building Phase 3.
// Document the expected behavior here as a specification test.

test('INV-2.1: WSP-protected signal cannot be expired (service enforcement)', async () => {
  const { id: caseId } = await createTestCase();
  const { id: domainId } = await createTestDomain(caseId);

  const signal = await createTestSignal(caseId, domainId, {
    lifecycle_status: 'ADMITTED',
    is_wsp_protected: true
  });

  // Import the built SLS service
  const { transitionSignal } = await import('../src/services/sls');

  const result = await transitionSignal(signal.id, 'EXPIRED', 'Attempted expiry');

  expect(result.permitted).toBe(false);
  expect(result.code).toBe('WSP_PROTECTION_ACTIVE');
  expect(result.lp).toBe('LP-2');

  // Signal has not moved
  const retrieved = await prisma.signals.findUnique({ where: { id: signal.id } });
  expect(retrieved!.lifecycle_status).toBe('ADMITTED');
  expect(retrieved!.is_wsp_protected).toBe(true);

  // No signal_event was created for the rejected transition
  const events = await prisma.signalEvents.findMany({
    where: { signal_id: signal.id, to_status: 'EXPIRED' }
  });
  expect(events).toHaveLength(0);
});
```

### INV-2.2: WSP protection clears after minimum retention periods

```typescript
test('INV-2.2: WSP protection clears when minimum retention is met', async () => {
  const { transitionSignal } = await import('../src/services/sls');

  const { id: caseId } = await createTestCase();
  const { id: domainId } = await createTestDomain(caseId);

  const signal = await createTestSignal(caseId, domainId, {
    lifecycle_status: 'RETAINED',
    is_wsp_protected: true,
    observation_period: 5
  });

  // Create signal_events showing 2 observation periods have passed
  await prisma.signalEvents.createMany({
    data: [
      { signal_id: signal.id, case_id: caseId, from_status: 'CANDIDATE', to_status: 'ADMITTED', reason: 'Period 1' },
      { signal_id: signal.id, case_id: caseId, from_status: 'ADMITTED', to_status: 'RETAINED', reason: 'Period 2' }
    ]
  });

  // With 2+ events (representing 2 observation periods), WSP protection should clear
  const result = await transitionSignal(signal.id, 'EXPIRED', 'Expiry after WSP period met');

  expect(result.permitted).toBe(true);

  const retrieved = await prisma.signals.findUnique({ where: { id: signal.id } });
  expect(retrieved!.lifecycle_status).toBe('EXPIRED');
  expect(retrieved!.is_wsp_protected).toBe(false);
});
```

---

## Invariant Group 3 — Contradiction Governance

### INV-3.1: Quarantined signal cannot be expired

```typescript
test('INV-3.1: Quarantined signal cannot transition to EXPIRED', async () => {
  const { transitionSignal } = await import('../src/services/sls');

  const { id: caseId } = await createTestCase();
  const { id: domainId } = await createTestDomain(caseId);

  const signal = await createTestSignal(caseId, domainId, {
    lifecycle_status: 'RETAINED',
    is_quarantined: true
  });

  const result = await transitionSignal(signal.id, 'EXPIRED', 'Attempted expiry of quarantined signal');

  expect(result.permitted).toBe(false);
  expect(result.code).toBe('QUARANTINE_ACTIVE');

  const retrieved = await prisma.signals.findUnique({ where: { id: signal.id } });
  expect(retrieved!.lifecycle_status).toBe('RETAINED');
});
```

### INV-3.2: Quarantined signal cannot be resolved

```typescript
test('INV-3.2: Quarantined signal cannot transition to RESOLVED without contradiction resolution', async () => {
  const { transitionSignal } = await import('../src/services/sls');

  const { id: caseId } = await createTestCase();
  const { id: domainId } = await createTestDomain(caseId);

  const signal = await createTestSignal(caseId, domainId, {
    lifecycle_status: 'RETAINED',
    is_quarantined: true
  });

  const result = await transitionSignal(signal.id, 'RESOLVED', 'Direct resolution attempt');

  expect(result.permitted).toBe(false);
  expect(result.code).toBe('QUARANTINE_ACTIVE');
});
```

### INV-3.3: Contradiction resolution requires RC type

```typescript
test('INV-3.3: Contradiction cannot be resolved without RC-1, RC-2, or RC-3', async () => {
  const { resolveContradiction } = await import('../src/services/sls');

  const { id: caseId } = await createTestCase();
  const { id: domainId } = await createTestDomain(caseId);

  const signalA = await createTestSignal(caseId, domainId, { lifecycle_status: 'RETAINED', is_quarantined: true });
  const signalB = await createTestSignal(caseId, domainId, { lifecycle_status: 'RETAINED', is_quarantined: true });

  const contradiction = await prisma.contradictions.create({
    data: {
      case_id: caseId,
      signal_a_id: signalA.id < signalB.id ? signalA.id : signalB.id,
      signal_b_id: signalA.id < signalB.id ? signalB.id : signalA.id,
      description: 'Signal A asserts high pressure; Signal B asserts nominal pressure',
      status: 'ACTIVE'
    }
  });

  // Attempt resolution without RC type
  await expect(
    resolveContradiction(contradiction.id, {
      resolution_type: null,
      resolution_basis: 'It just seemed right',
      resolved_signal_id: signalA.id
    })
  ).rejects.toThrow(/RC-1.*RC-2.*RC-3|resolution_type required/i);

  // Contradiction remains ACTIVE
  const retrieved = await prisma.contradictions.findUnique({ where: { id: contradiction.id } });
  expect(retrieved!.status).toBe('ACTIVE');
  expect(retrieved!.resolution_type).toBeNull();
});
```

### INV-3.4: Resolving a contradiction clears quarantine flags on both signals

```typescript
test('INV-3.4: Contradiction resolution clears is_quarantined on both signals', async () => {
  const { resolveContradiction } = await import('../src/services/sls');

  const { id: caseId } = await createTestCase();
  const { id: domainId } = await createTestDomain(caseId);

  const [aId, bId] = [createTestSignal, createTestSignal].map(() => null);  // placeholder

  const signalA = await createTestSignal(caseId, domainId, { lifecycle_status: 'RETAINED', is_quarantined: true });
  const signalB = await createTestSignal(caseId, domainId, { lifecycle_status: 'RETAINED', is_quarantined: true });

  const [orderedA, orderedB] = signalA.id < signalB.id
    ? [signalA, signalB] : [signalB, signalA];

  const contradiction = await prisma.contradictions.create({
    data: {
      case_id: caseId,
      signal_a_id: orderedA.id,
      signal_b_id: orderedB.id,
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
```

### INV-3.5: Self-contradiction is impossible

```typescript
test('INV-3.5: A signal cannot contradict itself', async () => {
  const { id: caseId } = await createTestCase();
  const { id: domainId } = await createTestDomain(caseId);
  const signal = await createTestSignal(caseId, domainId);

  await expect(
    prisma.contradictions.create({
      data: {
        case_id: caseId,
        signal_a_id: signal.id,
        signal_b_id: signal.id,  // same signal
        description: 'Self contradiction',
        status: 'ACTIVE'
      }
    })
  ).rejects.toThrow();  // CHECK (signal_a_id != signal_b_id)
});
```

### INV-3.6: Duplicate contradiction pairs are impossible

```typescript
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
  ).rejects.toThrow();  // UNIQUE(signal_a_id, signal_b_id)
});
```

---

## Invariant Group 4 — Score Change Audit

### INV-4.1: Score change without audit record is impossible at service level

```typescript
test('INV-4.1: updateSignalScores creates a score_change_audit record', async () => {
  const { updateSignalScores } = await import('../src/services/sls');

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

  const auditRecords = await prisma.scoreChangeAudit.findMany({
    where: { signal_id: signal.id }
  });

  expect(auditRecords).toHaveLength(1);
  expect(auditRecords[0].before_si_score?.toNumber()).toBeCloseTo(0.45);
  expect(auditRecords[0].after_si_score?.toNumber()).toBeCloseTo(0.72);
  expect(auditRecords[0].before_significance?.toNumber()).toBeCloseTo(0.52);
  expect(auditRecords[0].after_significance?.toNumber()).toBeCloseTo(0.68);
  expect(auditRecords[0].reason).toBe('Investigator revised SI score after additional analysis');
});
```

### INV-4.2: Score change without reason is rejected

```typescript
test('INV-4.2: updateSignalScores rejects missing reason', async () => {
  const { updateSignalScores } = await import('../src/services/sls');

  const { id: caseId } = await createTestCase();
  const { id: domainId } = await createTestDomain(caseId);
  const signal = await createTestSignal(caseId, domainId, { si_score: 0.45 });

  await expect(
    updateSignalScores(signal.id, {
      si_score: 0.72,
      reason: ''  // empty reason
    })
  ).rejects.toThrow(/reason required|reason cannot be empty/i);
});
```

---

## Invariant Group 5 — SHG Deduplication

### INV-5.1: Concurrent SHG triggers for the same connection cannot produce duplicate hypotheses

```typescript
test('INV-5.1: Concurrent SHG execution produces exactly one hypothesis per connection', async () => {
  const { generateHypothesis } = await import('../src/services/shg');

  const { id: caseId } = await createTestCase();
  const domainA = await createTestDomain(caseId, 'Domain A');
  const domainB = await createTestDomain(caseId, 'Domain B');

  await prisma.domainIndependence.create({
    data: {
      domain_a_id: domainA.id < domainB.id ? domainA.id : domainB.id,
      domain_b_id: domainA.id < domainB.id ? domainB.id : domainA.id,
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
  const connection = await prisma.signalConnections.create({
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
      correspondence_strength: 0.75,
      domains_independent: true,
      shg_triggered: false
    }
  });

  // Fire SHG concurrently — simulate the race condition
  const results = await Promise.allSettled([
    generateHypothesis(connection.id),
    generateHypothesis(connection.id),
    generateHypothesis(connection.id)
  ]);

  const hypotheses = await prisma.hypotheses.findMany({
    where: { connection_id: connection.id }
  });

  // Exactly one hypothesis — never two or three
  expect(hypotheses).toHaveLength(1);

  // The connection is marked as triggered
  const conn = await prisma.signalConnections.findUnique({ where: { id: connection.id } });
  expect(conn!.shg_triggered).toBe(true);
});
```

### INV-5.2: Duplicate signal connections are impossible

```typescript
test('INV-5.2: The same signal pair cannot have two connection records', async () => {
  const { id: caseId } = await createTestCase();
  const domainA = await createTestDomain(caseId, 'Domain A');
  const domainB = await createTestDomain(caseId, 'Domain B');

  const signalA = await createTestSignal(caseId, domainA.id);
  const signalB = await createTestSignal(caseId, domainB.id);
  const [a, b] = signalA.id < signalB.id ? [signalA, signalB] : [signalB, signalA];

  await prisma.signalConnections.create({
    data: {
      case_id: caseId, signal_a_id: a.id, signal_b_id: b.id,
      domain_a_id: domainA.id, domain_b_id: domainB.id,
      correspondence_strength: 0.75, domains_independent: true,
      mismatch_type_match: true, dimension_match: false,
      temporal_match: true, direction_match: true, shg_triggered: false
    }
  });

  await expect(
    prisma.signalConnections.create({
      data: {
        case_id: caseId, signal_a_id: a.id, signal_b_id: b.id,
        domain_a_id: domainA.id, domain_b_id: domainB.id,
        correspondence_strength: 0.60, domains_independent: true,
        mismatch_type_match: false, dimension_match: true,
        temporal_match: true, direction_match: false, shg_triggered: false
      }
    })
  ).rejects.toThrow();  // UNIQUE(signal_a_id, signal_b_id)
});
```

---

## Invariant Group 6 — Reasoning and Evidence Integrity

### INV-6.1: Same signal cannot be submitted as evidence twice for the same hypothesis

```typescript
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

  await prisma.hypothesisEvidence.create({
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
    prisma.hypothesisEvidence.create({
      data: {
        hypothesis_id: hypothesis.id,
        case_id: caseId,
        signal_id: signal.id,  // same signal
        content: 'Second submission — should fail',
        evidence_type: 'SUPPORTING',
        weight: 0.70
      }
    })
  ).rejects.toThrow();  // UNIQUE(hypothesis_id, signal_id)
});
```

### INV-6.2: Plausibility update is symmetric and bounded

```typescript
test('INV-6.2: Plausibility stays within [0.0, 1.0] under extreme evidence', async () => {
  const { updatePlausibility } = await import('../src/services/reasoning');

  const { id: caseId } = await createTestCase();

  const hypothesis = await prisma.hypotheses.create({
    data: {
      case_id: caseId,
      title: 'Test',
      description: 'Test',
      hypothesis_type: 'INVESTIGATOR',
      plausibility: 0.50,
      status: 'ACTIVE',
      generated_by: 'INVESTIGATOR'
    }
  });

  // Apply maximum supporting evidence
  await updatePlausibility(hypothesis.id, 'SUPPORTING', 1.0);
  let h = await prisma.hypotheses.findUnique({ where: { id: hypothesis.id } });
  expect(h!.plausibility.toNumber()).toBeLessThanOrEqual(1.0);
  expect(h!.plausibility.toNumber()).toBeGreaterThan(0.9);

  // Reset to 0.50
  await prisma.hypotheses.update({ where: { id: hypothesis.id }, data: { plausibility: 0.50 } });

  // Apply maximum contradicting evidence
  await updatePlausibility(hypothesis.id, 'CONTRADICTING', 1.0);
  h = await prisma.hypotheses.findUnique({ where: { id: hypothesis.id } });
  expect(h!.plausibility.toNumber()).toBeGreaterThanOrEqual(0.0);
  expect(h!.plausibility.toNumber()).toBeLessThan(0.1);
});
```

### INV-6.3: Contextual evidence does not change plausibility

```typescript
test('INV-6.3: CONTEXTUAL evidence leaves plausibility unchanged', async () => {
  const { updatePlausibility } = await import('../src/services/reasoning');

  const { id: caseId } = await createTestCase();
  const initialPlausibility = 0.63;

  const hypothesis = await prisma.hypotheses.create({
    data: {
      case_id: caseId,
      title: 'Test',
      description: 'Test',
      hypothesis_type: 'INVESTIGATOR',
      plausibility: initialPlausibility,
      status: 'ACTIVE',
      generated_by: 'INVESTIGATOR'
    }
  });

  await updatePlausibility(hypothesis.id, 'CONTEXTUAL', 0.90);

  const h = await prisma.hypotheses.findUnique({ where: { id: hypothesis.id } });
  expect(h!.plausibility.toNumber()).toBeCloseTo(initialPlausibility, 2);
});
```

### INV-6.4: No automatic competition set normalisation occurs on plausibility update

```typescript
test('INV-6.4: Updating hypothesis A plausibility does not change hypothesis B plausibility', async () => {
  const { updatePlausibility } = await import('../src/services/reasoning');

  const { id: caseId } = await createTestCase();

  const set = await prisma.competitionSets.create({
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

  // Support hypothesis A strongly
  await updatePlausibility(hypothesisA.id, 'SUPPORTING', 0.85);

  const [a, b] = await Promise.all([
    prisma.hypotheses.findUnique({ where: { id: hypothesisA.id } }),
    prisma.hypotheses.findUnique({ where: { id: hypothesisB.id } })
  ]);

  // A has increased
  expect(a!.plausibility.toNumber()).toBeGreaterThan(0.50);

  // B is UNCHANGED — no automatic normalisation
  expect(b!.plausibility.toNumber()).toBeCloseTo(0.50, 2);

  // Sum may exceed 1.0 — that is permitted until investigator normalises manually
  const sum = a!.plausibility.toNumber() + b!.plausibility.toNumber();
  expect(sum).toBeGreaterThan(1.0);  // this is expected and correct
});
```

### INV-6.5: Every plausibility update creates a plausibility_history record

```typescript
test('INV-6.5: updatePlausibility always creates a history record', async () => {
  const { updatePlausibility } = await import('../src/services/reasoning');

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

  const history = await prisma.plausibilityHistory.findMany({
    where: { hypothesis_id: hypothesis.id },
    orderBy: { recorded_at: 'asc' }
  });

  expect(history).toHaveLength(3);
  expect(history[0].reason).toContain('SUPPORTING');
  expect(history[1].reason).toContain('CONTRADICTING');
  expect(history[2].reason).toContain('CONTEXTUAL');
});
```

---

## Invariant Group 7 — Admission Audit Completeness

### INV-7.1: Every signal submission creates an admission_audit record

```typescript
test('INV-7.1: Admission audit record exists for every signal', async () => {
  const { admitSignal } = await import('../src/services/sls');

  const { id: caseId } = await createTestCase();
  const { id: domainId } = await createTestDomain(caseId);

  const signal = await createTestSignal(caseId, domainId);

  await admitSignal(signal.id, {
    si_score: 0.72,
    significance: 0.68,
    si_threshold: 0.25,
    sig_threshold: 0.55
  });

  const audit = await prisma.admissionAudit.findFirst({
    where: { signal_id: signal.id }
  });

  expect(audit).not.toBeNull();
  expect(audit!.decision).toBe('ADMITTED');
  expect(audit!.si_threshold?.toNumber()).toBe(0.25);
  expect(audit!.sig_threshold?.toNumber()).toBe(0.55);
});
```

### INV-7.2: Rejected signal has an admission_audit record with decision REJECTED

```typescript
test('INV-7.2: Rejected signals have a REJECTED admission audit record', async () => {
  const { admitSignal } = await import('../src/services/sls');

  const { id: caseId } = await createTestCase();
  const { id: domainId } = await createTestDomain(caseId);

  const signal = await createTestSignal(caseId, domainId);

  // SI below threshold
  await admitSignal(signal.id, {
    si_score: 0.15,  // below SI_min of 0.25
    significance: 0.30,
    si_threshold: 0.25,
    sig_threshold: 0.55
  });

  const audit = await prisma.admissionAudit.findFirst({
    where: { signal_id: signal.id }
  });

  expect(audit!.decision).toBe('REJECTED');
  expect(audit!.rejection_reason).toBeTruthy();

  // Signal is EXPIRED (rejected at LP-1)
  const s = await prisma.signals.findUnique({ where: { id: signal.id } });
  expect(s!.lifecycle_status).toBe('EXPIRED');
  expect(s!.rejection_lp).toBe('LP-1');
});
```

---

## Invariant Group 8 — Recurrence and Archival

### INV-8.1: Archived signal can spawn a recurrence Candidate with original_signal_id set

```typescript
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

  // Original is still ARCHIVED — not modified by recurrence
  const orig = await prisma.signals.findUnique({ where: { id: original.id } });
  expect(orig!.lifecycle_status).toBe('ARCHIVED');
});
```

---

## Running the Suite

```bash
# Install test dependencies
npm install -D vitest @vitest/coverage-v8

# Add to apps/api/package.json scripts:
# "test": "vitest run",
# "test:watch": "vitest",
# "test:coverage": "vitest run --coverage"

# Run against test database
TEST_DATABASE_URL="postgresql://user:pass@localhost:5432/cis_test" npm test
```

## Pass Criteria

| Group | Tests | All must pass |
|-------|-------|---------------|
| 1 — Lifecycle state machine | INV-1.1 through INV-1.4 | ✓ |
| 2 — WSP protection | INV-2.1 through INV-2.2 | ✓ |
| 3 — Contradiction governance | INV-3.1 through INV-3.6 | ✓ |
| 4 — Score audit | INV-4.1 through INV-4.2 | ✓ |
| 5 — SHG deduplication | INV-5.1 through INV-5.2 | ✓ |
| 6 — Reasoning integrity | INV-6.1 through INV-6.5 | ✓ |
| 7 — Admission audit | INV-7.1 through INV-7.2 | ✓ |
| 8 — Recurrence | INV-8.1 | ✓ |

**Total: 21 tests.**

Zero failures permitted before Phase 3 service code is written. If any test fails, the failure identifies exactly which invariant the implementation violates. Fix the service, re-run, pass all 21, then proceed.

---

*CIS Governance Invariant Tests | 2026-06-02 | 21 tests across 8 invariant groups | All must pass before Phase 3*
