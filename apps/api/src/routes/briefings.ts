import { Router } from 'express';
import prisma from '../prisma.js';
import { generateBriefing } from '../services/briefing.js';

const router = Router();

// POST /api/cases/:id/briefings
router.post('/:id/briefings', async (req, res, next) => {
  try {
    const briefing = await generateBriefing(req.params.id);
    res.status(201).json(briefing);
  } catch (err) { next(err); }
});

// GET /api/cases/:id/briefings
router.get('/:id/briefings', async (req, res, next) => {
  try {
    const briefings = await prisma.briefings.findMany({
      where: { case_id: req.params.id },
      orderBy: { generated_at: 'desc' },
    });
    res.json(briefings);
  } catch (err) { next(err); }
});

// GET /api/briefings/:id
router.get('/briefings/:id', async (req, res, next) => {
  try {
    const briefing = await prisma.briefings.findUniqueOrThrow({ where: { id: req.params.id } });
    res.json(briefing);
  } catch (err) { next(err); }
});

export default router;
