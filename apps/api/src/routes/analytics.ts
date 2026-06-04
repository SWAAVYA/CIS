import { Router } from 'express';
import prisma from '../prisma.js';

const router = Router();

// GET /api/analytics
router.get('/', async (_req, res, next) => {
  try {
    // Refresh if no snapshot in the last hour
    const latest = await prisma.analytics_snapshots.findFirst({ orderBy: { snapshot_at: 'desc' } });
    const stale = !latest || (Date.now() - latest.snapshot_at.getTime()) > 60 * 60 * 1000;

    if (stale) {
      await prisma.$executeRaw`SELECT refresh_analytics()`;
    }

    const snapshot = await prisma.analytics_snapshots.findFirst({ orderBy: { snapshot_at: 'desc' } });
    if (!snapshot) return res.json({ message: 'No data yet' });

    res.json({
      snapshot_at: snapshot.snapshot_at,
      total_cases: snapshot.total_cases,
      total_signals_submitted: snapshot.total_signals_submitted,
      total_signals_admitted: snapshot.total_signals_admitted,
      admission_rate: snapshot.admission_rate,
      total_hypotheses: snapshot.total_hypotheses,
      total_hypotheses_confirmed: snapshot.total_hypotheses_confirmed,
      hcl_confirmation_rate: snapshot.hcl_confirmation_rate,
      total_contradictions: snapshot.total_contradictions,
      total_contradictions_resolved: snapshot.total_contradictions_resolved,
      shg_trigger_rate: snapshot.shg_trigger_rate,
      lp_distribution: {
        'LP-1': snapshot.lp1_count, 'LP-2': snapshot.lp2_count, 'LP-3': snapshot.lp3_count,
        'LP-4': snapshot.lp4_count, 'LP-5': snapshot.lp5_count, 'LP-6': snapshot.lp6_count,
        'LP-7': snapshot.lp7_count,
      },
      avg_si_score: snapshot.avg_si_score,
      avg_significance: snapshot.avg_significance,
    });
  } catch (err) { next(err); }
});

export default router;
