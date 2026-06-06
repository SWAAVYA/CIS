import { Router } from 'express';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import prisma from '../prisma.js';
import { scoreSignal } from '../services/si-scorer.js';
import { transitionSignal, updateSignalScores } from '../services/sls.js';
import { checkConnections, generateHypothesis } from '../services/shg.js';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const submitSchema = z.object({
  content: z.string().min(1).max(10000),
  domain_id: z.string().regex(uuidRegex).optional(),
  observation_period: z.number().int().positive().optional(),
  mismatch_type: z.enum(['RATE','DIRECTION','RELATIONSHIP','CONFIGURATION']).optional(),
  deviation_direction: z.enum(['UP','DOWN','DIVERGING','CONVERGING','STABLE']).optional(),
});

const scoreSchema = z.object({
  reason: z.string().min(1),
  si_score: z.number().min(0).max(1).optional(),
  significance: z.number().min(0).max(1).optional(),
});

const SI_MIN_THRESHOLD = parseFloat(process.env.SI_MIN_THRESHOLD ?? '0.25');
const SIG_THRESHOLD = parseFloat(process.env.SIG_THRESHOLD ?? '0.55');
const router = Router();

// Inline admission logic using whichever Prisma client is passed (supports tx)
async function runAdmission(
  tx: Prisma.TransactionClient,
  signalId: string,
  caseId: string,
  siScore: number,
  significance: number,
  siMaxDimension = 0
): Promise<{ decision: string; reason: string }> {
  const SI_DIM_THRESHOLD = 0.35;
  const passesWeighted = siScore >= SI_MIN_THRESHOLD;
  const passesDimension = siMaxDimension >= SI_DIM_THRESHOLD;
  if (!passesWeighted && !passesDimension) {
    const reason = `SI score ${siScore} below SI_min ${SI_MIN_THRESHOLD} and max dimension ${siMaxDimension} below ${SI_DIM_THRESHOLD}`;
    await tx.signals.update({
      where: { id: signalId },
      data: { lifecycle_status: 'EXPIRED', rejection_reason: reason, rejection_lp: 'LP-1' },
    });
    await tx.admission_audit.create({
      data: { signal_id: signalId, case_id: caseId, decision: 'REJECTED', si_score: siScore, significance, si_threshold: SI_MIN_THRESHOLD, sig_threshold: SIG_THRESHOLD, rejection_reason: reason },
    });
    await tx.signal_events.create({
      data: { signal_id: signalId, case_id: caseId, from_status: 'CANDIDATE', to_status: 'EXPIRED', reason, lp_flag: 'LP-1' },
    });
    return { decision: 'REJECTED', reason };
  }

  const meetsSignificance = significance >= SIG_THRESHOLD;
  const decision = meetsSignificance ? 'ADMITTED' : 'SUB_THRESHOLD_RETAINED';
  const reason = meetsSignificance
    ? `SI score ${siScore} above SI_min ${SI_MIN_THRESHOLD}. Significance ${significance} above threshold ${SIG_THRESHOLD}.`
    : `SI score ${siScore} above SI_min ${SI_MIN_THRESHOLD}. Significance ${significance} below threshold ${SIG_THRESHOLD} â€” admitted per WSP sub-threshold preservation.`;

  await tx.signals.update({
    where: { id: signalId },
    data: { lifecycle_status: 'ADMITTED', is_wsp_protected: true, admitted_at: new Date(), admission_reason: reason },
  });
  await tx.admission_audit.create({
    data: { signal_id: signalId, case_id: caseId, decision, si_score: siScore, significance, si_threshold: SI_MIN_THRESHOLD, sig_threshold: SIG_THRESHOLD },
  });
  await tx.signal_events.create({
    data: { signal_id: signalId, case_id: caseId, from_status: 'CANDIDATE', to_status: 'ADMITTED', reason },
  });

  if (meetsSignificance) {
    await tx.signals.update({ where: { id: signalId }, data: { lifecycle_status: 'RETAINED' } });
    await tx.signal_events.create({
      data: { signal_id: signalId, case_id: caseId, from_status: 'ADMITTED', to_status: 'RETAINED', reason: `Significance ${significance} meets threshold ${SIG_THRESHOLD}` },
    });
  }

  return { decision, reason };
}

// POST /api/cases/:id/signals
router.post('/:id/signals', async (req, res, next) => {
  try {
    const parsed = submitSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message, code: 'VALIDATION_ERROR', status: 400 });
    }
    const { content, domain_id, observation_period, mismatch_type, deviation_direction } = parsed.data;

    // Score SI â€” pure, no DB
    const siResult = await scoreSignal(content);
    if (mismatch_type)      siResult.mismatch_type = mismatch_type;
    if (deviation_direction) siResult.deviation_direction = deviation_direction;

    // Compute significance from available data (new signal: persistence=0, corroboration=0, relevance=0)
    // sig_proximity = si_configuration, sig_rarity = si_score, sig_si = si_score
    const sig_si          = round3(siResult.si_score);
    const sig_persistence = 0; // no events yet
    const sig_corroboration = 0; // needs DB scan â€” computed post-transaction
    const sig_proximity   = round3(Number(siResult.si_configuration));
    const sig_rarity      = round3(siResult.si_score);
    const sig_relevance   = 0; // no evidence yet
    const significance    = round3((sig_si + sig_persistence + sig_corroboration + sig_proximity + sig_rarity + sig_relevance) / 6);

    const { signal, admission } = await prisma.$transaction(async (tx) => {
      const signal = await tx.signals.create({
        data: {
          case_id: req.params.id,
          domain_id: domain_id ?? null,
          content,
          observation_period: observation_period ?? null,
          lifecycle_status: 'CANDIDATE',
          is_quarantined: false, is_connected: false, is_wsp_protected: false,
          shg_mode: siResult.shg_mode,
          mismatch_type: siResult.mismatch_type,
          deviation_direction: siResult.deviation_direction,
          si_rate: siResult.si_rate, si_direction: siResult.si_direction,
          si_relationship: siResult.si_relationship, si_configuration: siResult.si_configuration,
          si_score: siResult.si_score,
          sig_si, sig_persistence, sig_corroboration, sig_proximity, sig_rarity, sig_relevance,
          significance,
        },
      });

      await tx.signal_events.create({
        data: { signal_id: signal.id, case_id: req.params.id, to_status: 'CANDIDATE', reason: 'Signal submitted' },
      });

      const siMaxDim = Math.max(siResult.si_rate, siResult.si_direction, siResult.si_relationship, siResult.si_configuration);
      const admission = await runAdmission(tx, signal.id, req.params.id, siResult.si_score, significance, siMaxDim);
      const updated = await tx.signals.findUniqueOrThrow({ where: { id: signal.id } });
      return { signal: updated, admission };
    });

    // SHG runs AFTER transaction commits
    const connections: unknown[] = [];
    const hypotheses: unknown[] = [];
    if (signal.lifecycle_status !== 'EXPIRED') {
      await checkConnections(signal.id);
      // Trigger hypothesis generation for any new unprocessed connections
      const pendingConns = await prisma.signal_connections.findMany({
        where: {
          OR: [{ signal_a_id: signal.id }, { signal_b_id: signal.id }],
          shg_triggered: false,
        },
      });
      await Promise.allSettled(pendingConns.map(c => generateHypothesis(c.id)));
      const newConns = await prisma.signal_connections.findMany({
        where: { OR: [{ signal_a_id: signal.id }, { signal_b_id: signal.id }] },
        include: { hypothesis: true },
      });
      connections.push(...newConns);
      hypotheses.push(...newConns.map(c => c.hypothesis).filter(Boolean));
    }

    const lpFlags = await prisma.signal_events.findMany({
      where: { signal_id: signal.id, lp_flag: { not: null } },
      select: { lp_flag: true },
    });

    res.status(201).json({
      signal,
      admission: { decision: admission.decision, si_threshold: SI_MIN_THRESHOLD, sig_threshold: SIG_THRESHOLD },
      connections,
      hypotheses,
      lp_flags: lpFlags.map(e => e.lp_flag),
    });
  } catch (err) { next(err); }
});

// GET /api/cases/:id/signals
router.get('/:id/signals', async (req, res, next) => {
  try {
    const { status, domain_id, min_si, min_significance, sort = 'significance' } = req.query as Record<string, string>;
    const signals = await prisma.signals.findMany({
      where: {
        case_id: req.params.id,
        ...(status ? { lifecycle_status: status } : {}),
        ...(domain_id ? { domain_id } : {}),
        ...(min_si ? { si_score: { gte: parseFloat(min_si) } } : {}),
        ...(min_significance ? { significance: { gte: parseFloat(min_significance) } } : {}),
      },
      orderBy: sort === 'significance' ? { significance: 'desc' } : { submitted_at: 'desc' },
    });
    res.json(signals);
  } catch (err) { next(err); }
});

// GET /api/signals/:id
router.get('/:id', async (req, res, next) => {
  try {
    const signal = await prisma.signals.findUniqueOrThrow({ where: { id: req.params.id } });
    const [events, connections, contradictions] = await Promise.all([
      prisma.signal_events.findMany({ where: { signal_id: signal.id }, orderBy: { created_at: 'asc' } }),
      prisma.signal_connections.findMany({ where: { OR: [{ signal_a_id: signal.id }, { signal_b_id: signal.id }] } }),
      prisma.contradictions.findMany({ where: { OR: [{ signal_a_id: signal.id }, { signal_b_id: signal.id }] } }),
    ]);
    res.json({ ...signal, events, connections, contradictions });
  } catch (err) { next(err); }
});

// PATCH /api/signals/:id/status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { to_status, reason } = req.body;
    if (!to_status || !reason) {
      return res.status(400).json({ error: 'to_status and reason required', code: 'MISSING_FIELD', status: 400 });
    }
    const result = await transitionSignal(req.params.id, to_status, reason);
    if (!result.permitted) {
      const statusCode = result.code === 'WSP_PROTECTION_ACTIVE' ? 409 : 422;
      return res.status(statusCode).json({ error: result.reason, code: result.code, status: statusCode });
    }
    res.json(await prisma.signals.findUniqueOrThrow({ where: { id: req.params.id } }));
  } catch (err) { next(err); }
});

// PATCH /api/signals/:id/scores
router.patch('/:id/scores', async (req, res, next) => {
  try {
    const parsed = scoreSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message, code: 'VALIDATION_ERROR', status: 400 });
    }
    const { reason, ...scores } = parsed.data;
    await updateSignalScores(req.params.id, { ...scores, reason });
    res.json(await prisma.signals.findUniqueOrThrow({ where: { id: req.params.id } }));
  } catch (err) { next(err); }
});

function round3(v: number): number { return Math.round(v * 1000) / 1000; }

export default router;

