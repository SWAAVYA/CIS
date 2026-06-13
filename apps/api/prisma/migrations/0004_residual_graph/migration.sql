-- Residual Graph v1.3
-- EE_CIS_RESIDUAL_v1.3 (2026-06-12)
-- Greenfield: no prior residual tables exist. CREATE IF NOT EXISTS throughout.

-- ── residual_type ─────────────────────────────────────────────────────────────
-- The canonical catalogue of residual pattern types. One row per named residual
-- pattern (e.g. RT-17: wrongly-claimed asymmetric underestimation).
CREATE TABLE IF NOT EXISTS residual_type (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT NOT NULL UNIQUE,           -- e.g. 'RT-17'
  name        TEXT NOT NULL,
  description TEXT,
  weight      NUMERIC(4,2) NOT NULL DEFAULT 1.0,  -- baseline difficulty
  domain      TEXT,                           -- optional domain tag
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rt_code ON residual_type (code);

-- ── residual_instance ─────────────────────────────────────────────────────────
-- A specific occurrence of a residual type within an investigation case.
CREATE TABLE IF NOT EXISTS residual_instance (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id         UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  residual_type_id UUID NOT NULL REFERENCES residual_type(id),
  signal_id       UUID REFERENCES signals(id),
  description     TEXT,
  weight          NUMERIC(4,2),        -- instance-specific weight; NULL = use type default
  status          TEXT NOT NULL DEFAULT 'open'
                    CHECK (status IN ('open', 'in_progress', 'terminal')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ri_case ON residual_instance (case_id);
CREATE INDEX IF NOT EXISTS idx_ri_type ON residual_instance (residual_type_id);
CREATE INDEX IF NOT EXISTS idx_ri_status ON residual_instance (case_id, status);

-- ── residual_lineage ──────────────────────────────────────────────────────────
-- Tracks the full lifecycle of one residual instance from open to terminal state.
-- terminal_state = 'transformed' when local resolution generated successor residuals.
CREATE TABLE IF NOT EXISTS residual_lineage (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  residual_instance_id   UUID NOT NULL REFERENCES residual_instance(id) ON DELETE CASCADE,
  case_id                UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  terminal_state         TEXT NOT NULL DEFAULT 'ongoing'
                           CHECK (terminal_state IN (
                             'ongoing',      -- active, not yet terminal
                             'resolved',     -- genuine elimination, no successor residuals
                             'persistent',   -- all approaches exhausted
                             'transformed'   -- local resolution succeeded, successors created
                           )),
  -- TRANSFORMED metadata (null when terminal_state != 'transformed')
  transformation_products JSONB NOT NULL DEFAULT '[]',
  -- [{residual_instance_id, residual_type_id, causal_mechanism}]
  transformation_weight   NUMERIC(4,2),    -- total successor weight at transformation time
  -- audit
  opened_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at              TIMESTAMPTZ,
  closure_note           TEXT
);

CREATE INDEX IF NOT EXISTS idx_rl_instance ON residual_lineage (residual_instance_id);
CREATE INDEX IF NOT EXISTS idx_rl_case ON residual_lineage (case_id);
CREATE INDEX IF NOT EXISTS idx_rl_state ON residual_lineage (terminal_state);

-- ── residual_trajectory ───────────────────────────────────────────────────────
-- Population-level statistics for each residual type: how lineages tend to end,
-- at what position in an investigation sequence, and what they transform into.
CREATE TABLE IF NOT EXISTS residual_trajectory (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  residual_type_id      UUID NOT NULL REFERENCES residual_type(id),
  subtype_tag           TEXT,            -- speciation tag (v1.2 concept, carried forward)
  observation_count     INTEGER NOT NULL DEFAULT 0,
  resolved_count        INTEGER NOT NULL DEFAULT 0,
  persistent_count      INTEGER NOT NULL DEFAULT 0,
  transformed_count     INTEGER NOT NULL DEFAULT 0,
  -- endpoint_predictions: {position: {resolved: p, persistent: p, transformed: p,
  --                                    transformation_targets: {type_id: probability}}}
  endpoint_predictions  JSONB NOT NULL DEFAULT '{}',
  -- transformation_targets: aggregated type_id → probability across all transformed cases
  transformation_targets JSONB NOT NULL DEFAULT '{}',
  last_updated          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_rtraj_type_sub ON residual_trajectory (residual_type_id, subtype_tag)
  WHERE subtype_tag IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_rtraj_type_nosub ON residual_trajectory (residual_type_id)
  WHERE subtype_tag IS NULL;

-- ── residual_cluster ──────────────────────────────────────────────────────────
-- Co-occurrence and transformation relationships between residual types.
-- In v1.3, 'cascade' is explicitly renamed transformation: resolving source_type
-- generates target_type with the given probability and weight ratio.
CREATE TABLE IF NOT EXISTS residual_cluster (
  id                           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_type                 TEXT NOT NULL
                                 CHECK (cluster_type IN (
                                   'co_occurrence',   -- types appear together
                                   'transformation',  -- resolving source generates target
                                   'mutual_exclusion' -- types do not co-occur
                                 )),
  source_type_id               UUID NOT NULL REFERENCES residual_type(id),
  target_type_id               UUID NOT NULL REFERENCES residual_type(id),
  observation_count            INTEGER NOT NULL DEFAULT 0,
  co_occurrence_probability    NUMERIC(3,2),   -- P(target | source present)
  transformation_probability   NUMERIC(3,2),   -- P(target generated | source resolved)
  -- transformation_weight_expected: expected weight of successor relative to source
  --   > 1.0: transformation creates harder problem
  --   < 1.0: transformation creates easier successor
  --   = 0:   resolution without transformation
  transformation_weight_expected NUMERIC(4,2),
  -- net_debt_delta = transformation_weight_expected - 1.0
  --   positive: debt increases on transformation
  --   negative: debt decreases on transformation
  net_debt_delta               NUMERIC(4,2)
                                 GENERATED ALWAYS AS (transformation_weight_expected - 1.0)
                                 STORED,
  last_updated                 TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rc_source ON residual_cluster (source_type_id);
CREATE INDEX IF NOT EXISTS idx_rc_target ON residual_cluster (target_type_id);
CREATE INDEX IF NOT EXISTS idx_rc_type ON residual_cluster (cluster_type);
CREATE UNIQUE INDEX IF NOT EXISTS idx_rc_pair ON residual_cluster (cluster_type, source_type_id, target_type_id);

-- ── residual_intervention ─────────────────────────────────────────────────────
-- Records what intervention was attempted on a lineage and what it produced.
-- Used to build trajectory and cluster statistics over time.
CREATE TABLE IF NOT EXISTS residual_intervention (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lineage_id           UUID NOT NULL REFERENCES residual_lineage(id) ON DELETE CASCADE,
  residual_instance_id UUID NOT NULL REFERENCES residual_instance(id),
  case_id              UUID NOT NULL REFERENCES cases(id),
  intervention_type    TEXT NOT NULL,   -- e.g. 'alternative_explanation', 'vocabulary_extension'
  intervention_note    TEXT,
  outcome_terminal_state TEXT,          -- what terminal state this attempt produced (or null if ongoing)
  attempted_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ri_lineage ON residual_intervention (lineage_id);
CREATE INDEX IF NOT EXISTS idx_ri_case2 ON residual_intervention (case_id);
