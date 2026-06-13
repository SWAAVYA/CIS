-- Migration 0007: first_observed_at on residual_instance
--
-- Separates birth time (when the instance entered the ecology) from
-- admission time (when CIS learned about it). Population dynamics care
-- about birth time; debt dynamics care about admission time. Mixing them
-- distorts every lag and interval metric.
--
-- NULL = birth time equals admission time (contemporary observation).
-- Non-null = historical case where the instance predates CIS admission.
-- Reproduction interval and challenge lag must use:
--   COALESCE(first_observed_at, created_at)

ALTER TABLE residual_instance
  ADD COLUMN IF NOT EXISTS first_observed_at TIMESTAMPTZ;

COMMENT ON COLUMN residual_instance.first_observed_at IS
  'When this instance entered the ecology (may predate CIS admission for historical corpora). NULL = contemporary observation.';
