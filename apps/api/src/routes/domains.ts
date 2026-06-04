import { Router } from 'express';
import prisma from '../prisma.js';

const router = Router();

// POST /api/cases/:id/domains
router.post('/:id/domains', async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'name required', code: 'MISSING_FIELD', status: 400 });

    const domain = await prisma.domains.create({
      data: { case_id: req.params.id, name, description },
    });
    res.status(201).json(domain);
  } catch (err) { next(err); }
});

// GET /api/cases/:id/domains
router.get('/:id/domains', async (req, res, next) => {
  try {
    const domains = await prisma.domains.findMany({
      where: { case_id: req.params.id },
      orderBy: { created_at: 'asc' },
    });

    // Attach signal counts and independence relationships
    const enriched = await Promise.all(domains.map(async (d) => {
      const [signalCount, independenceRows] = await Promise.all([
        prisma.signals.count({ where: { domain_id: d.id } }),
        prisma.domain_independence.findMany({
          where: { OR: [{ domain_a_id: d.id }, { domain_b_id: d.id }] },
        }),
      ]);
      return { ...d, signal_count: signalCount, independence: independenceRows };
    }));

    res.json(enriched);
  } catch (err) { next(err); }
});

// POST /api/cases/:id/domains/independence
router.post('/:id/domains/independence', async (req, res, next) => {
  try {
    const { domain_a_id, domain_b_id, is_independent, independence_basis } = req.body;
    if (!domain_a_id || !domain_b_id) {
      return res.status(400).json({ error: 'domain_a_id and domain_b_id required', code: 'MISSING_FIELD', status: 400 });
    }

    // Enforce ordering: a < b
    const [aId, bId] = [domain_a_id, domain_b_id].sort() as [string, string];

    await prisma.$transaction(async (tx) => {
      // Read existing before upsert (for history)
      const existing = await tx.domain_independence.findUnique({
        where: { domain_a_id_domain_b_id: { domain_a_id: aId, domain_b_id: bId } },
      });

      await tx.domain_independence.upsert({
        where: { domain_a_id_domain_b_id: { domain_a_id: aId, domain_b_id: bId } },
        create: { domain_a_id: aId, domain_b_id: bId, is_independent: is_independent ?? true, independence_basis },
        update: { is_independent: is_independent ?? true, independence_basis, updated_at: new Date() },
      });

      // Record history
      await tx.domain_independence_history.create({
        data: {
          domain_a_id: aId,
          domain_b_id: bId,
          before_independent: existing?.is_independent ?? null,
          after_independent: is_independent ?? true,
          change_reason: independence_basis,
        },
      });

      // If independence changed, flag any hypotheses using this domain pair
      if (existing && existing.is_independent !== (is_independent ?? true)) {
        await tx.hypotheses.updateMany({
          where: {
            connection: {
              OR: [
                { domain_a_id: aId, domain_b_id: bId },
                { domain_a_id: bId, domain_b_id: aId },
              ],
            },
            status: 'ACTIVE',
          },
          data: { independence_basis_changed: true },
        });
      }
    });

    const result = await prisma.domain_independence.findUniqueOrThrow({
      where: { domain_a_id_domain_b_id: { domain_a_id: aId, domain_b_id: bId } },
    });
    res.status(201).json(result);
  } catch (err) { next(err); }
});

export default router;
