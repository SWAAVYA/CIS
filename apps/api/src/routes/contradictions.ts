import { Router } from 'express';
import { z } from 'zod';
import prisma from '../prisma.js';
import { resolveContradiction } from '../services/sls.js';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const contradictionSchema = z.object({
  signal_a_id: z.string().regex(uuidRegex),
  signal_b_id: z.string().regex(uuidRegex),
  description: z.string().min(1),
}).refine(d => d.signal_a_id !== d.signal_b_id, { message: 'signal_a_id and signal_b_id must be different' });

const router = Router();

// POST /api/cases/:id/contradictions
router.post('/:id/contradictions', async (req, res, next) => {
  try {
    const parsed = contradictionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message, code: 'VALIDATION_ERROR', status: 400 });
    }
    const { signal_a_id, signal_b_id, description } = parsed.data;

    // Normalise ordering: always a < b
    const [aId, bId] = [signal_a_id, signal_b_id].sort() as [string, string];

    const contradiction = await prisma.$transaction(async (tx) => {
      const contradiction = await tx.contradictions.create({
        data: { case_id: req.params.id, signal_a_id: aId, signal_b_id: bId, description, status: 'ACTIVE' },
      });

      // Quarantine both signals and record governance events
      for (const sigId of [aId, bId]) {
        const sig = await tx.signals.findUniqueOrThrow({ where: { id: sigId } });
        await tx.signals.update({ where: { id: sigId }, data: { is_quarantined: true } });
        await tx.signal_events.create({
          data: {
            signal_id: sigId,
            case_id: sig.case_id,
            from_status: sig.lifecycle_status,
            to_status: sig.lifecycle_status,
            governance_change: 'is_quarantined: FALSE â†’ TRUE',
            reason: `Contradiction registered: ${description}`,
          },
        });
      }

      return contradiction;
    });

    const signals = await prisma.signals.findMany({
      where: { id: { in: [aId, bId] } },
      select: { id: true, lifecycle_status: true, is_quarantined: true },
    });
    res.status(201).json({ ...contradiction, signals });
  } catch (err) { next(err); }
});

// GET /api/cases/:id/contradictions
router.get('/:id/contradictions', async (req, res, next) => {
  try {
    const { status } = req.query as Record<string, string>;
    const contradictions = await prisma.contradictions.findMany({
      where: { case_id: req.params.id, ...(status ? { status } : {}) },
      orderBy: { created_at: 'desc' },
      include: {
        signal_a: { select: { id: true, content: true, domain_id: true, si_score: true } },
        signal_b: { select: { id: true, content: true, domain_id: true, si_score: true } },
      },
    });
    res.json(contradictions);
  } catch (err) { next(err); }
});

// POST /api/contradictions/:id/resolve
router.post('/:id/resolve', async (req, res, next) => {
  try {
    const { resolution_type, resolution_basis, resolved_signal_id } = req.body;
    await resolveContradiction(req.params.id, { resolution_type, resolution_basis, resolved_signal_id });
    const contradiction = await prisma.contradictions.findUniqueOrThrow({ where: { id: req.params.id } });
    res.json(contradiction);
  } catch (err: unknown) {
    if (err instanceof Error && /resolution_type required/i.test(err.message)) {
      return res.status(400).json({ error: err.message, code: 'INVALID_RC_TYPE', status: 400 });
    }
    next(err);
  }
});

// POST /api/cases/:id/released-options
router.post('/:id/released-options', async (req, res, next) => {
  try {
    const { text, signal_id, contradiction_id } = req.body;
    if (!text) return res.status(400).json({ error: 'text required', code: 'MISSING_FIELD', status: 400 });

    const opt = await prisma.released_options.create({
      data: { case_id: req.params.id, text, signal_id, contradiction_id },
    });
    res.status(201).json(opt);
  } catch (err) { next(err); }
});

// GET /api/cases/:id/released-options
router.get('/:id/released-options', async (req, res, next) => {
  try {
    const opts = await prisma.released_options.findMany({
      where: { case_id: req.params.id, is_active: true },
      orderBy: { created_at: 'desc' },
    });
    res.json(opts);
  } catch (err) { next(err); }
});

// PATCH /api/released-options/:id/flag
router.patch('/released-options/:id/flag', async (req, res, next) => {
  try {
    const opt = await prisma.released_options.update({
      where: { id: req.params.id },
      data: { flagged_at: new Date() },
    });
    res.json(opt);
  } catch (err) { next(err); }
});

// PATCH /api/released-options/:id
router.patch('/released-options/:id', async (req, res, next) => {
  try {
    const { is_active, unflag_reason } = req.body;
    if (unflag_reason === undefined && is_active === undefined) {
      return res.status(400).json({ error: 'is_active or unflag_reason required', code: 'MISSING_FIELD', status: 400 });
    }
    if (is_active === false && !unflag_reason) {
      return res.status(400).json({ error: 'reason required when deactivating', code: 'MISSING_FIELD', status: 400 });
    }

    const opt = await prisma.released_options.update({
      where: { id: req.params.id },
      data: {
        ...(is_active !== undefined ? { is_active } : {}),
        ...(unflag_reason ? { unflag_reason, flagged_at: null } : {}),
      },
    });
    res.json(opt);
  } catch (err) { next(err); }
});

export default router;

