import { describe, test, expect } from 'vitest';
import { prisma, createTestCase, createTestDomain } from './setup';

describe('PIPE-3: Transaction Rollback Guarantees', () => {
  test('PIPE-3: Failed admission leaves no partial audit records', async () => {
    const { id: caseId } = await createTestCase();
    const { id: domainId } = await createTestDomain(caseId);

    let threw = false;
    try {
      await prisma.$transaction(async (tx) => {
        const signal = await tx.signals.create({
          data: {
            case_id: caseId,
            domain_id: domainId,
            content: 'test',
            lifecycle_status: 'CANDIDATE',
            is_quarantined: false,
            is_connected: false,
            is_wsp_protected: false,
            shg_mode: 'PENDING'
          }
        });

        await tx.admission_audit.create({
          data: {
            signal_id: signal.id,
            case_id: caseId,
            decision: 'ADMITTED',
            si_threshold: 0.25,
            sig_threshold: 0.55
          }
        });

        throw new Error('Simulated failure after audit write');
      });
    } catch {
      threw = true;
    }

    expect(threw).toBe(true);

    const audits = await prisma.admission_audit.findMany({ where: { case_id: caseId } });
    expect(audits).toHaveLength(0);

    const signals = await prisma.signals.findMany({ where: { case_id: caseId } });
    expect(signals).toHaveLength(0);
  });
});
