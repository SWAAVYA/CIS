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
    await prisma.$executeRaw`SELECT refresh_analytics()`;
    await completeJobRun(job.id, 1);
  } catch (err) {
    await failJobRun(job.id, String(err));
  }
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
