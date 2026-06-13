/**
 * Residual Graph v1.3 routes
 * POST /api/residual-types
 * GET  /api/residual-types
 * POST /api/cases/:id/residuals
 * GET  /api/cases/:id/residuals
 * POST /api/residuals/:id/resolve
 * POST /api/residuals/:id/persist
 * POST /api/residuals/:id/transform
 * POST /api/residuals/:id/interventions
 * GET  /api/residuals/:id/recommendation
 * GET  /api/residual-clusters
 * POST /api/residual-clusters
 */
import { Router } from 'express';
import {
  createResidualType,
  listResidualTypes,
  getResidualType,
  openResidualInstance,
  getCaseResiduals,
  resolveLineage,
  persistLineage,
  transformLineage,
  recordIntervention,
  getInterventionRecommendation,
  classifyOutcome,
} from '../services/residual-graph.js';
import prisma from '../prisma.js';

const router = Router();

// ── Residual Types ───────────────────────────────────────────────────────────

router.post('/residual-types', async (req, res, next) => {
  try {
    const { code, name, description, weight, domain } = req.body;
    if (!code || !name) return res.status(400).json({ error: 'code and name required', code: 'MISSING_FIELD', status: 400 });
    const rt = await createResidualType({ code, name, description, weight, domain });
    res.status(201).json(rt);
  } catch (err) { next(err); }
});

router.get('/residual-types', async (req, res, next) => {
  try {
    const types = await listResidualTypes(req.query.domain as string | undefined);
    res.json(types);
  } catch (err) { next(err); }
});

router.get('/residual-types/:id', async (req, res, next) => {
  try {
    const rt = await getResidualType(req.params.id);
    if (!rt) return res.status(404).json({ error: 'residual type not found', status: 404 });
    res.json(rt);
  } catch (err) { next(err); }
});

// ── Case Residuals ───────────────────────────────────────────────────────────

router.post('/cases/:id/residuals', async (req, res, next) => {
  try {
    const { residual_type_id, signal_id, description, weight } = req.body;
    if (!residual_type_id) return res.status(400).json({ error: 'residual_type_id required', code: 'MISSING_FIELD', status: 400 });
    const instance = await openResidualInstance({
      case_id: req.params.id,
      residual_type_id,
      signal_id,
      description,
      weight,
    });
    res.status(201).json(instance);
  } catch (err) { next(err); }
});

router.get('/cases/:id/residuals', async (req, res, next) => {
  try {
    const residuals = await getCaseResiduals(req.params.id, req.query.status as string | undefined);
    res.json(residuals);
  } catch (err) { next(err); }
});

// ── Lineage Resolution ───────────────────────────────────────────────────────

// Resolve the active lineage for a residual instance
router.post('/residuals/:id/resolve', async (req, res, next) => {
  try {
    const lineage = await _getActiveLineage(req.params.id);
    if (!lineage) return res.status(404).json({ error: 'no active lineage found', status: 404 });
    const closed = await resolveLineage(lineage.id, req.body.note);
    res.json({ ...closed, outcome_class: classifyOutcome('resolved', null) });
  } catch (err) { next(err); }
});

router.post('/residuals/:id/persist', async (req, res, next) => {
  try {
    const lineage = await _getActiveLineage(req.params.id);
    if (!lineage) return res.status(404).json({ error: 'no active lineage found', status: 404 });
    const closed = await persistLineage(lineage.id, req.body.note);
    res.json({ ...closed, outcome_class: classifyOutcome('persistent', null) });
  } catch (err) { next(err); }
});

// Transform: requires products array and optionally creates successor instances inline
router.post('/residuals/:id/transform', async (req, res, next) => {
  try {
    const lineage = await _getActiveLineage(req.params.id);
    if (!lineage) return res.status(404).json({ error: 'no active lineage found', status: 404 });

    const { products, note } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'products array required for transformation', code: 'MISSING_FIELD', status: 400 });
    }

    // Each product must have residual_instance_id OR {residual_type_id, case_id} to create inline
    const resolvedProducts = [];
    for (const p of products) {
      if (p.residual_instance_id) {
        resolvedProducts.push(p);
      } else if (p.residual_type_id) {
        // Create successor instance inline
        const newInst = await openResidualInstance({
          case_id: lineage.case_id,
          residual_type_id: p.residual_type_id,
          description: p.description,
          weight: p.weight,
        });
        resolvedProducts.push({
          residual_instance_id: newInst.id,
          residual_type_id: p.residual_type_id,
          causal_mechanism: p.causal_mechanism ?? 'inline creation via transform endpoint',
        });
      } else {
        return res.status(400).json({ error: 'each product needs residual_instance_id or residual_type_id', code: 'INVALID_PRODUCT', status: 400 });
      }
    }

    const result = await transformLineage(lineage.id, resolvedProducts, note);

    // Compute net_debt_delta for outcome classification
    const sourceInst = await prisma.residual_instance.findUniqueOrThrow({
      where: { id: req.params.id },
      include: { residual_type: true },
    });
    const sourceWeight = Number(sourceInst.weight ?? sourceInst.residual_type.weight);
    const netDebtDelta = sourceWeight > 0
      ? (Number((result.lineage as any).transformation_weight ?? 0) / sourceWeight) - 1.0
      : 0;

    res.json({ ...result, outcome_class: classifyOutcome('transformed', netDebtDelta) });
  } catch (err) { next(err); }
});

// ── Interventions ────────────────────────────────────────────────────────────

router.post('/residuals/:id/interventions', async (req, res, next) => {
  try {
    const lineage = await _getActiveLineage(req.params.id);
    if (!lineage) return res.status(404).json({ error: 'no active lineage found', status: 404 });

    const { intervention_type, intervention_note, outcome_terminal_state } = req.body;
    if (!intervention_type) return res.status(400).json({ error: 'intervention_type required', code: 'MISSING_FIELD', status: 400 });

    const intervention = await recordIntervention({
      lineage_id: lineage.id,
      residual_instance_id: req.params.id,
      case_id: lineage.case_id,
      intervention_type,
      intervention_note,
      outcome_terminal_state,
    });
    res.status(201).json(intervention);
  } catch (err) { next(err); }
});

// ── Recommendation ───────────────────────────────────────────────────────────

router.get('/residuals/:id/recommendation', async (req, res, next) => {
  try {
    const rec = await getInterventionRecommendation(req.params.id);
    res.json(rec);
  } catch (err) { next(err); }
});

// ── Clusters ─────────────────────────────────────────────────────────────────

router.get('/residual-clusters', async (req, res, next) => {
  try {
    const { source_type_id, cluster_type } = req.query as Record<string, string>;
    const clusters = await prisma.$queryRaw`
      SELECT
        rc.*,
        rc.net_debt_delta::float,
        st.code AS source_code,
        st.name AS source_name,
        tt.code AS target_code,
        tt.name AS target_name
      FROM residual_cluster rc
      JOIN residual_type st ON st.id = rc.source_type_id
      JOIN residual_type tt ON tt.id = rc.target_type_id
      WHERE (${source_type_id ?? null}::uuid IS NULL OR rc.source_type_id = ${source_type_id ?? null}::uuid)
        AND (${cluster_type ?? null}::text IS NULL OR rc.cluster_type = ${cluster_type ?? null}::text)
      ORDER BY rc.net_debt_delta ASC NULLS LAST
    `;
    res.json(clusters);
  } catch (err) { next(err); }
});

router.post('/residual-clusters', async (req, res, next) => {
  try {
    const {
      cluster_type, source_type_id, target_type_id,
      co_occurrence_probability, transformation_probability, transformation_weight_expected,
    } = req.body;

    if (!cluster_type || !source_type_id || !target_type_id) {
      return res.status(400).json({ error: 'cluster_type, source_type_id, target_type_id required', code: 'MISSING_FIELD', status: 400 });
    }

    const cluster = await prisma.residual_cluster.upsert({
      where: { cluster_type_source_type_id_target_type_id: { cluster_type, source_type_id, target_type_id } },
      create: { cluster_type, source_type_id, target_type_id, co_occurrence_probability, transformation_probability, transformation_weight_expected },
      update: { co_occurrence_probability, transformation_probability, transformation_weight_expected, last_updated: new Date() },
    });
    res.status(201).json(cluster);
  } catch (err) { next(err); }
});

// ── Helper ───────────────────────────────────────────────────────────────────

async function _getActiveLineage(instanceId: string) {
  return prisma.residual_lineage.findFirst({
    where: { residual_instance_id: instanceId, terminal_state: 'ongoing' },
    orderBy: { opened_at: 'desc' },
  });
}

export default router;
