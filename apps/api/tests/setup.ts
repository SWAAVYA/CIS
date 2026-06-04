import { PrismaClient } from '@prisma/client';
import { beforeEach, afterAll } from 'vitest';

export const prisma = new PrismaClient({
  datasources: { db: { url: process.env.TEST_DATABASE_URL } }
});

export async function createTestCase() {
  return prisma.cases.create({
    data: {
      title: 'Test Case',
      access_code: `TC-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      status: 'ACTIVE'
    }
  });
}

export async function createTestDomain(caseId: string, name = 'Domain A') {
  return prisma.domains.create({
    data: { case_id: caseId, name }
  });
}

export async function createTestSignal(
  caseId: string,
  domainId: string,
  overrides: Record<string, unknown> = {}
) {
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
