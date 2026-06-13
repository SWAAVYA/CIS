import cron from 'node-cron';
import prisma from '../prisma.js';

const DORMANCY_DAYS = parseInt(process.env.DORMANCY_DAYS ?? '30', 10);
const DORMANCY_SIGNIFICANCE_DROP = parseFloat(process.env.DORMANCY_SIGNIFICANCE_DROP ?? '0.05');

async function createJobRun(jobName: string) {
  return prisma.job_runs.create({ data: { job_name: jobName } });
}

async function completeJobRun(id: string, recordsAffected: number) {
  return prisma.job_runs.update({
    where: { id },
    data: { status: 'COMPLETED', completed_at: new Date(), records_affected: recordsAffected },
  });
}

async function failJobRun(id: string, error: string) {
  return prisma.job_runs.update({
    where: { id },
    data: { status: 'FAILED', completed_at: new Date(), error_message: error },
  });
}

// Analytics refresh — hourly
async function runAnalyticsRefresh() {
  const job = await createJobRun('analytics-refresh');
  try {
    await refreshAnalytics();
    await completeJobRun(job.id, 1);
  } catch (err) {
    await failJobRun(job.id, String(err));
  }
}

export async function refreshAnalytics(): Promise<void> {
  // Cap analytics queries so a slow scan never starves the connection pool.
  await prisma.$executeRaw`SET LOCAL statement_timeout = '30s'`.catch(() => {});
  const [
    totalCases,
    totalDomains,
    totalSignals,
    admittedSignals,
    totalHypotheses,
    confirmedHypotheses,
    totalContradictions,
    resolvedContradictions,
    totalBriefings,
    lpCounts,
    siAvg,
    totalConnections,
    triggeredConnections,
  ] = await Promise.all([
    prisma.cases.count(),
    prisma.domains.count(),
    prisma.signals.count(),
    prisma.signals.count({ where: { lifecycle_status: { in: ['ADMITTED', 'RETAINED', 'ASSESSED', 'RESOLVED', 'ARCHIVED'] } } }),
    prisma.hypotheses.count(),
    prisma.hypotheses.count({ where: { status: 'CONFIRMED' } }),
    prisma.contradictions.count(),
    prisma.contradictions.count({ where: { status: 'RESOLVED' } }),
    prisma.briefings.count(),
    prisma.signal_events.groupBy({ by: ['lp_flag'], where: { lp_flag: { not: null } }, _count: true }),
    prisma.signals.aggregate({ _avg: { si_score: true, significance: true } }),
    prisma.signal_connections.count(),
    prisma.signal_connections.count({ where: { shg_triggered: true } }),
  ]);

  const lpMap: Record<string, number> = {};
  for (const row of lpCounts) if (row.lp_flag) lpMap[row.lp_flag] = row._count;

  const admissionRate = totalSignals > 0 ? admittedSignals / totalSignals : null;
  const hclRate = totalHypotheses > 0 ? confirmedHypotheses / totalHypotheses : null;
  const shgRate = totalConnections > 0 ? triggeredConnections / totalConnections : null;

  await prisma.analytics_snapshots.create({
    data: {
      total_cases: totalCases,
      total_domains: totalDomains,
      total_signals_submitted: totalSignals,
      total_signals_admitted: admittedSignals,
      total_hypotheses: totalHypotheses,
      total_hypotheses_confirmed: confirmedHypotheses,
      total_contradictions: totalContradictions,
      total_contradictions_resolved: resolvedContradictions,
      total_briefings: totalBriefings,
      lp1_count: lpMap['LP-1'] ?? 0,
      lp2_count: lpMap['LP-2'] ?? 0,
      lp3_count: lpMap['LP-3'] ?? 0,
      lp4_count: lpMap['LP-4'] ?? 0,
      lp5_count: lpMap['LP-5'] ?? 0,
      lp6_count: lpMap['LP-6'] ?? 0,
      lp7_count: lpMap['LP-7'] ?? 0,
      admission_rate: admissionRate !== null ? admissionRate : null,
      hcl_confirmation_rate: hclRate !== null ? hclRate : null,
      shg_trigger_rate: shgRate !== null ? shgRate : null,
      avg_si_score: siAvg._avg.si_score ?? null,
      avg_significance: siAvg._avg.significance ?? null,
    },
  });
}

// Dormancy check — weekly
async function runDormancyCheck() {
  const job = await createJobRun('dormancy-check');
  try {
    const dormancyDate = new Date(Date.now() - DORMANCY_DAYS * 24 * 60 * 60 * 1000);

    // Signals RETAINED > DORMANCY_DAYS with no activity and significance >= 0.40
    const dormantSignals = await prisma.signals.findMany({
      where: {
        lifecycle_status: 'RETAINED',
        significance: { gte: 0.40 },
        submitted_at: { lte: dormancyDate },
      },
    });

    // Filter: no signal_events since dormancyDate
    const truly_dormant = (await Promise.all(
      dormantSignals.map(async (s) => {
        const recentEvent = await prisma.signal_events.findFirst({
          where: { signal_id: s.id, created_at: { gte: dormancyDate } },
        });
        return recentEvent ? null : s;
      })
    )).filter(Boolean) as typeof dormantSignals;

    for (const signal of truly_dormant) {
      const newSig = Math.max(Number(signal.significance) - DORMANCY_SIGNIFICANCE_DROP, 0.0);
      const rounded = Math.round(newSig * 1000) / 1000;

      await prisma.signals.update({ where: { id: signal.id }, data: { significance: rounded } });
      await prisma.signal_events.create({
        data: {
          signal_id: signal.id,
          case_id: signal.case_id,
          from_status: 'RETAINED',
          to_status: 'RETAINED',
          reason: `Dormancy flag: no activity in ${DORMANCY_DAYS} days`,
          lp_flag: rounded < 0.40 ? 'LP-6' : null,
          job_run_id: job.id,
        },
      });
    }

    await completeJobRun(job.id, truly_dormant.length);
  } catch (err) {
    await failJobRun(job.id, String(err));
  }
}

// SHG trigger — every 5 minutes
async function runSHGTrigger() {
  const job = await createJobRun('shg-trigger');
  try {
    const { generateHypothesis } = await import('../services/shg.js');
    const pending = await prisma.signal_connections.findMany({
      where: { shg_triggered: false },
    });

    let triggered = 0;
    for (const conn of pending) {
      const result = await generateHypothesis(conn.id);
      if (result) triggered++;
    }

    await completeJobRun(job.id, triggered);
  } catch (err) {
    await failJobRun(job.id, String(err));
  }
}

export function startJobs() {
  cron.schedule('0 * * * *', runAnalyticsRefresh);          // hourly
  cron.schedule('*/5 * * * *', runSHGTrigger);              // every 5 min
  cron.schedule('0 2 * * 0', runDormancyCheck);             // weekly, Sunday 02:00

  console.log('Background jobs scheduled: analytics-refresh (hourly), shg-trigger (5min), dormancy-check (weekly)');
}
