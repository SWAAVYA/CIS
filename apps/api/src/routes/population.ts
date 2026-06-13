/**
 * Residual Population Layer routes (EE_CIS_POPULATION_v1.0)
 *
 * POST /api/propagation-events
 * GET  /api/propagation-events?source_instance_id=&target_instance_id=&min_confidence=&category=
 * GET  /api/population-stats
 * GET  /api/population-stats/:typeId
 * PATCH /api/interventions/:id/ecology
 */
import { Router } from 'express';
import {
  recordPropagationEvent,
  listPropagationEvents,
  getPopulationStats,
  setInterventionEcologyClass,
  type PropagationChannel,
  type AttributionCategory,
  type EcologyClass,
} from '../services/residual-population.js';

const router = Router();

const VALID_CHANNELS: PropagationChannel[] = [
  'publication', 'documentary', 'lecture', 'citation',
  'derivative_work', 'social_media', 'other',
];
const VALID_CATEGORIES: AttributionCategory[] = ['direct', 'indirect', 'independent'];
const VALID_ECOLOGY: EcologyClass[] = ['compelled', 'incentivized', 'voluntary', 'none'];

// ── Propagation Events ───────────────────────────────────────────────────────

router.post('/propagation-events', async (req, res, next) => {
  try {
    const {
      source_instance_id, target_instance_id,
      propagation_channel, attribution_confidence, attribution_category,
      evidence_basis, occurred_at, recorded_by, notes,
    } = req.body;

    if (!source_instance_id || !target_instance_id)
      return res.status(400).json({ error: 'source_instance_id and target_instance_id required', status: 400 });
    if (!VALID_CHANNELS.includes(propagation_channel))
      return res.status(400).json({ error: `propagation_channel must be one of: ${VALID_CHANNELS.join(', ')}`, status: 400 });
    if (attribution_confidence === undefined || attribution_confidence < 0 || attribution_confidence > 1)
      return res.status(400).json({ error: 'attribution_confidence must be in [0, 1]', status: 400 });
    if (!VALID_CATEGORIES.includes(attribution_category))
      return res.status(400).json({ error: `attribution_category must be one of: ${VALID_CATEGORIES.join(', ')}`, status: 400 });

    const event = await recordPropagationEvent({
      source_instance_id,
      target_instance_id,
      propagation_channel,
      attribution_confidence: Number(attribution_confidence),
      attribution_category,
      evidence_basis: Array.isArray(evidence_basis) ? evidence_basis : undefined,
      occurred_at: occurred_at ? new Date(occurred_at) : undefined,
      recorded_by,
      notes,
    });
    res.status(201).json(event);
  } catch (err) { next(err); }
});

router.get('/propagation-events', async (req, res, next) => {
  try {
    const events = await listPropagationEvents({
      source_instance_id: req.query.source_instance_id as string | undefined,
      target_instance_id: req.query.target_instance_id as string | undefined,
      min_confidence: req.query.min_confidence ? Number(req.query.min_confidence) : undefined,
      category: req.query.category as AttributionCategory | undefined,
    });
    res.json(events);
  } catch (err) { next(err); }
});

// ── Population Stats ─────────────────────────────────────────────────────────

router.get('/population-stats', async (req, res, next) => {
  try {
    const stats = await getPopulationStats();
    res.json(stats);
  } catch (err) { next(err); }
});

router.get('/population-stats/:typeId', async (req, res, next) => {
  try {
    const stats = await getPopulationStats(req.params.typeId);
    if (!stats.length) return res.status(404).json({ error: 'residual type not found', status: 404 });
    res.json(stats[0]);
  } catch (err) { next(err); }
});

// ── Ecology Class ────────────────────────────────────────────────────────────

router.patch('/interventions/:id/ecology', async (req, res, next) => {
  try {
    const { ecology_class } = req.body;
    if (!VALID_ECOLOGY.includes(ecology_class))
      return res.status(400).json({ error: `ecology_class must be one of: ${VALID_ECOLOGY.join(', ')}`, status: 400 });
    const updated = await setInterventionEcologyClass(req.params.id, ecology_class);
    res.json(updated);
  } catch (err) { next(err); }
});

export default router;
