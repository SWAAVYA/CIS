-- Migration 0006: Residual Population Layer (EE_CIS_POPULATION_v1.0)
-- Adds propagation event capture, ecology classification, and population stats view.
-- Does NOT modify any v1.3 lineage structures. Additive only.

-- ── Propagation Event ─────────────────────────────────────────────────────────
-- Causal edges between residual instances via amplification channels.
-- A propagation event does NOT close the source lineage.
-- attribution_confidence weights the contribution to reproduction rate estimates.

CREATE TABLE IF NOT EXISTS residual_propagation_event (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_instance_id      UUID NOT NULL REFERENCES residual_instance(id),
  target_instance_id      UUID NOT NULL REFERENCES residual_instance(id),
  propagation_channel     TEXT NOT NULL
    CHECK (propagation_channel IN (
      'publication', 'documentary', 'lecture', 'citation',
      'derivative_work', 'social_media', 'other'
    )),
  attribution_confidence  NUMERIC(3,2) NOT NULL
    CHECK (attribution_confidence BETWEEN 0 AND 1),
  attribution_category    TEXT NOT NULL
    CHECK (attribution_category IN ('direct', 'indirect', 'independent')),
  occurred_at             TIMESTAMPTZ,
  detected_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  recorded_by             TEXT,
  notes                   TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_no_self_propagation CHECK (source_instance_id <> target_instance_id)
);

CREATE INDEX IF NOT EXISTS idx_rpe_source ON residual_propagation_event (source_instance_id);
CREATE INDEX IF NOT EXISTS idx_rpe_target ON residual_propagation_event (target_instance_id);
CREATE INDEX IF NOT EXISTS idx_rpe_channel_conf
  ON residual_propagation_event (attribution_category, attribution_confidence);
CREATE INDEX IF NOT EXISTS idx_rpe_occurred
  ON residual_propagation_event (occurred_at)
  WHERE occurred_at IS NOT NULL;

-- ── Ecology Class on Intervention ─────────────────────────────────────────────
-- Required to control for ecology effects before attributing trajectory
-- divergence to residual type structure (speciation condition, Section 5).

ALTER TABLE residual_intervention
  ADD COLUMN IF NOT EXISTS ecology_class TEXT
  CHECK (ecology_class IN ('compelled', 'incentivized', 'voluntary', 'none'));

-- ── Population Stats View ─────────────────────────────────────────────────────
-- The coupling surface between the two models. Computes population size,
-- birth/death rates, and mean challenge lag per residual type.
-- Births and deaths windowed to 30 days; challenge lag across all time.

CREATE OR REPLACE VIEW residual_population_stats AS
SELECT
  rt.id                   AS type_id,
  rt.code,
  rt.name,
  rt.weight               AS type_weight,

  -- Population size: open instances
  COUNT(ri.id) FILTER (WHERE ri.status = 'open')       AS population_size,

  -- Birth rate (last 30d): propagation births only (direct + indirect)
  COUNT(rpe.id) FILTER (
    WHERE rpe.occurred_at >= now() - INTERVAL '30 days'
    AND   rpe.attribution_category IN ('direct', 'indirect')
  )                                                     AS births_30d,

  -- Death rate (last 30d): instance status became terminal
  COUNT(DISTINCT ri2.id) FILTER (
    WHERE ri2.status = 'terminal'
    AND   ri2.updated_at >= now() - INTERVAL '30 days'
  )                                                     AS deaths_30d,

  -- Weighted reproduction rate (30d): confidence-weighted births
  COALESCE(SUM(rpe.attribution_confidence) FILTER (
    WHERE rpe.occurred_at >= now() - INTERVAL '30 days'
    AND   rpe.attribution_confidence >= 0.50
  ), 0)                                                 AS weighted_births_30d,

  -- Mean debt per open instance
  AVG(ri.weight) FILTER (WHERE ri.status = 'open')     AS mean_instance_weight,

  -- Total debt for this type (open instances only)
  SUM(ri.weight) FILTER (WHERE ri.status = 'open')     AS total_open_debt,

  -- Observation counts
  COUNT(ri.id) FILTER (WHERE ri.status = 'open')  +
  COUNT(ri2.id) FILTER (WHERE ri2.status = 'terminal') AS total_instances_ever

FROM residual_type rt
LEFT JOIN residual_instance ri  ON ri.residual_type_id  = rt.id
LEFT JOIN residual_instance ri2 ON ri2.residual_type_id = rt.id
LEFT JOIN residual_propagation_event rpe ON rpe.target_instance_id = ri.id

GROUP BY rt.id, rt.code, rt.name, rt.weight;
