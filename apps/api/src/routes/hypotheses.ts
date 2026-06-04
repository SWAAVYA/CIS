import { Router } from 'express';
import { z } from 'zod';
import prisma from '../prisma.js';
import { updatePlausibility } from '../services/reasoning.js';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const hypothesisSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  hypothesis_type: z.enum(['HCL','SI_CLUSTER','PATTERN','INVESTIGATOR']),
  connection_id: z.string().regex(uuidRegex).optional(),
});

const evidenceSchema = z.object({
  content: z.string().min(1),
  evidence_type: z.enum(['SUPPORTING','CONTRADICTING','CONTEXTUAL']),
  weight: z.number().min(0).max(1).default(0.5),
  signal_id: z.string().regex(uuidRegex).optional(),
});

const router = Router();

// POST /api/cases/:id/hypotheses
router.post('/:id/hypotheses', async (req, res, next) => {
  try {
    const parsed = hypothesisSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message, code: 'VALIDATION_ERROR', status: 400 });
    }
    const { title, description, hypothesis_type, connection_id } = parsed.data;

    const hypothesis = await prisma.hypotheses.create({
      data: {
        case_id: req.params.id,
        title,
        description,
        hypothesis_type,
        connection_id: connection_id ?? null,
        generated_by: 'INVESTIGATOR',
      },
    });
    res.status(201).json(hypothesis);
  } catch (err) { next(err); }
});

// GET /api/cases/:id/hypotheses
router.get('/:id/hypotheses', async (req, res, next) => {
  try {
    const { status, type } = req.query as Record<string, string>;
    const hypotheses = await prisma.hypotheses.findMany({
      where: {
        case_id: req.params.id,
        ...(status ? { status } : {}),
        ...(type ? { hypothesis_type: type } : {}),
      },
      include: { evidence: true },
      orderBy: { plausibility: 'desc' },
    });

    // Compute competition_set_sum for each hypothesis in a set
    const withSums = await Promise.all(hypotheses.map(async (h) => {
      if (!h.competition_set_id) return { ...h, competition_set_sum: null };
      const peers = await prisma.hypotheses.findMany({
        where: { competition_set_id: h.competition_set_id, status: 'ACTIVE' },
        select: { plausibility: true },
      });
      const sum = peers.reduce((acc, p) => acc + Number(p.plausibility), 0);
      return { ...h, competition_set_sum: Math.round(sum * 1000) / 1000 };
    }));

    res.json(withSums);
  } catch (err) { next(err); }
});

// POST /api/hypotheses/:id/evidence
router.post('/:id/evidence', async (req, res, next) => {
  try {
    const parsed = evidenceSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message, code: 'VALIDATION_ERROR', status: 400 });
    }
    const { content, evidence_type, weight, signal_id } = parsed.data;

    const hypothesis = await prisma.hypotheses.findUniqueOrThrow({ where: { id: req.params.id } });
    const plausibilityBefore = Number(hypothesis.plausibility);

    let evidence;
    try {
      evidence = await prisma.hypothesis_evidence.create({
        data: { hypothesis_id: req.params.id, case_id: hypothesis.case_id, content, evidence_type, weight, signal_id: signal_id ?? null },
      });
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'code' in err && (err as { code: string }).code === 'P2002') {
        return res.status(409).json({ error: 'Signal already submitted as evidence for this hypothesis', code: 'EVIDENCE_ALREADY_SUBMITTED', status: 409 });
      }
      throw err;
    }

    const { after: plausibilityAfter } = await updatePlausibility(req.params.id, evidence_type, weight, evidence.id);
    const delta = Math.round((plausibilityAfter - plausibilityBefore) * 10000) / 10000;

    await prisma.hypothesis_evidence.update({
      where: { id: evidence.id },
      data: { plausibility_delta: delta },
    });

    res.status(201).json({
      evidence: { ...evidence, plausibility_delta: delta },
      plausibility_before: plausibilityBefore,
      plausibility_after: plausibilityAfter,
      delta,
    });
  } catch (err) { next(err); }
});

// GET /api/hypotheses/:id/plausibility-history
router.get('/:id/plausibility-history', async (req, res, next) => {
  try {
    const history = await prisma.plausibility_history.findMany({
      where: { hypothesis_id: req.params.id },
      orderBy: { recorded_at: 'asc' },
    });
    res.json(history);
  } catch (err) { next(err); }
});

// PATCH /api/hypotheses/:id/resolve
router.patch('/:id/resolve', async (req, res, next) => {
  try {
    const { status, resolution_basis } = req.body;
    if (!status || !['CONFIRMED', 'FALSIFIED', 'ARCHIVED'].includes(status)) {
      return res.status(400).json({ error: 'status must be CONFIRMED, FALSIFIED, or ARCHIVED', code: 'INVALID_STATUS', status: 400 });
    }

    const hypothesis = await prisma.hypotheses.update({
      where: { id: req.params.id },
      data: { status, resolution_basis, resolved_at: new Date(), updated_at: new Date() },
    });
    res.json(hypothesis);
  } catch (err) { next(err); }
});

// POST /api/cases/:id/competition-sets
router.post('/:id/competition-sets', async (req, res, next) => {
  try {
    const { hypothesis_ids, description } = req.body;
    if (!hypothesis_ids?.length) {
      return res.status(400).json({ error: 'hypothesis_ids required', code: 'MISSING_FIELD', status: 400 });
    }

    const set = await prisma.$transaction(async (tx) => {
      const set = await tx.competition_sets.create({ data: { case_id: req.params.id, description } });
      await tx.hypotheses.updateMany({
        where: { id: { in: hypothesis_ids }, case_id: req.params.id },
        data: { competition_set_id: set.id, updated_at: new Date() },
      });
      return set;
    });

    const hypotheses = await prisma.hypotheses.findMany({ where: { competition_set_id: set.id } });
    res.status(201).json({ ...set, hypotheses });
  } catch (err) { next(err); }
});

// POST /api/competition-sets/:id/normalise
router.post('/competition-sets/:id/normalise', async (req, res, next) => {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ error: 'reason required', code: 'MISSING_FIELD', status: 400 });

    const active = await prisma.hypotheses.findMany({
      where: { competition_set_id: req.params.id, status: 'ACTIVE' },
    });

    const sum = active.reduce((acc, h) => acc + Number(h.plausibility), 0);
    if (sum <= 1.0) return res.json({ message: 'Sum is already â‰¤ 1.0, normalisation not needed', hypotheses: active });

    const updated = await prisma.$transaction(async (tx) => {
      return Promise.all(active.map(async (h) => {
        const newP = Math.round((Number(h.plausibility) / sum) * 1000) / 1000;
        await tx.hypotheses.update({ where: { id: h.id }, data: { plausibility: newP, updated_at: new Date() } });
        await tx.plausibility_history.create({
          data: {
            hypothesis_id: h.id,
            plausibility: newP,
            reason: `COMPETITION_SET_NORMALISATION: ${reason}`,
          },
        });
        return { ...h, plausibility: newP };
      }));
    });

    res.json({ updated, previous_sum: Math.round(sum * 1000) / 1000 });
  } catch (err) { next(err); }
});

export default router;

