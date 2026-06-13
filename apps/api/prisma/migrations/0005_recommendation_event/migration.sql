-- Migration 0005: recommendation_event
-- EE_CIS_MIGRATION_0005 (2026-06-12)
-- Must run before: first call to GET /api/residuals/:id/recommendation
-- Depends on: 0004 (residual_instance)
--
-- Turns the recommendation engine from a calculator into a learner.
-- Every recommendation is persisted. Outcome fields are backfilled when
-- the lineage closes, producing a training signal for prediction_error.

CREATE TABLE IF NOT EXISTS recommendation_event (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  residual_instance_id    UUID NOT NULL REFERENCES residual_instance(id),
  generated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- What the system recommended (ordered by expected benefit)
  -- Each element: {action, expected_debt_delta, rationale, cluster_evidence_count}
  candidate_actions       JSONB NOT NULL DEFAULT '[]',
  recommended_action      TEXT,
  expected_debt_delta     NUMERIC(4,2),

  -- What actually happened (backfilled when lineage closes)
  chosen_action           TEXT,
  followed_recommendation BOOLEAN,
  actual_terminal_state   TEXT CHECK (actual_terminal_state IN (
                            'resolved', 'persistent', 'transformed'
                          )),
  actual_debt_delta       NUMERIC(4,2),

  -- Accuracy: |expected - actual| / max(|expected|, |actual|, 0.01)
  -- Backfilled on lineage close
  prediction_error        NUMERIC(4,3),

  rtt_theory_version      TEXT NOT NULL DEFAULT 'v1.9',
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rec_event_residual
  ON recommendation_event (residual_instance_id);

CREATE INDEX IF NOT EXISTS idx_rec_event_followed
  ON recommendation_event (followed_recommendation, actual_terminal_state)
  WHERE actual_terminal_state IS NOT NULL;
