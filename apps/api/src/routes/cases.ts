import { Router } from 'express';
import prisma from '../prisma.js';

const router = Router();

// POST /api/cases
router.post('/', async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: 'title required', code: 'MISSING_FIELD', status: 400 });

    const accessCode = `CIS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const c = await prisma.cases.create({ data: { title, description, access_code: accessCode } });
    res.status(201).json({ id: c.id, title: c.title, access_code: c.access_code, created_at: c.created_at });
  } catch (err) { next(err); }
});

// GET /api/cases/:id
router.get('/:id', async (req, res, next) => {
  try {
    const c = await prisma.cases.findUniqueOrThrow({ where: { id: req.params.id } });

    const [byStatus, quarantined, connected, wsp] = await Promise.all([
      prisma.signals.groupBy({ by: ['lifecycle_status'], where: { case_id: c.id }, _count: true }),
      prisma.signals.count({ where: { case_id: c.id, is_quarantined: true } }),
      prisma.signals.count({ where: { case_id: c.id, is_connected: true } }),
      prisma.signals.count({ where: { case_id: c.id, is_wsp_protected: true } }),
    ]);

    const byStatusMap: Record<string, number> = {};
    for (const row of byStatus) byStatusMap[row.lifecycle_status.toLowerCase()] = row._count;

    res.json({
      ...c,
      stats: {
        by_status: byStatusMap,
        quarantined,
        connected,
        wsp_protected: wsp,
      },
    });
  } catch (err) { next(err); }
});

// GET /api/cases/by-code/:code
router.get('/by-code/:code', async (req, res, next) => {
  try {
    const c = await prisma.cases.findUniqueOrThrow({ where: { access_code: req.params.code } });
    res.json(c);
  } catch (err) { next(err); }
});

// PATCH /api/cases/:id/close
router.patch('/:id/close', async (req, res, next) => {
  try {
    const c = await prisma.cases.update({
      where: { id: req.params.id },
      data: { status: 'CLOSED', closed_at: new Date() },
    });
    res.json(c);
  } catch (err) { next(err); }
});

// GET /api/cases/:id/events
router.get('/:id/events', async (req, res, next) => {
  try {
    const { signal_id, lp_flag, from, to, page = '1', limit = '50' } = req.query as Record<string, string>;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const events = await prisma.signal_events.findMany({
      where: {
        case_id: req.params.id,
        ...(signal_id ? { signal_id } : {}),
        ...(lp_flag ? { lp_flag } : {}),
        ...(from || to ? { created_at: { ...(from ? { gte: new Date(from) } : {}), ...(to ? { lte: new Date(to) } : {}) } } : {}),
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: parseInt(limit),
    });
    res.json({ events, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) { next(err); }
});

// GET /api/cases/:id/lp-flags
router.get('/:id/lp-flags', async (req, res, next) => {
  try {
    const { since } = req.query as Record<string, string>;
    const c = await prisma.cases.findUniqueOrThrow({ where: { id: req.params.id } });
    const cutoff = since ? new Date(since) : c.last_briefing_at ?? c.created_at;

    const flags = await prisma.signal_events.findMany({
      where: { case_id: req.params.id, lp_flag: { not: null }, created_at: { gte: cutoff } },
      orderBy: { created_at: 'desc' },
    });
    res.json({ flags, since: cutoff });
  } catch (err) { next(err); }
});

export default router;
