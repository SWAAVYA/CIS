-- Migration: Add rtt_theory_version to admission_audit_sealed
-- Follows: EE_CIS_SCHEMA_RTT_VERSION_v1.0 / EE_CIS_ARCHITECTURE_v1.1 Principle 1
-- Category: (b) Schema Migration — Ontology-as-Data Doctrine
--
-- Adds ontological provenance alongside the existing constraint_version field.
-- constraint_version tracks which threshold was in force (per-constraint audit trail).
-- rtt_theory_version tracks which theoretical framework was in force (ontological audit trail).
-- Both are required; neither substitutes for the other.
--
-- Existing records receive 'pre-versioning' — a queryable sentinel identifying records
-- that predate the ontological audit mechanism. New records receive the value from
-- RTT_THEORY_VERSION application config (currently 'v1.9').

ALTER TABLE admission_audit_sealed
  ADD COLUMN IF NOT EXISTS rtt_theory_version VARCHAR(20)
    NOT NULL
    DEFAULT 'pre-versioning'
    CHECK (
      rtt_theory_version = 'pre-versioning'
      OR rtt_theory_version ~ '^v[0-9]+\.[0-9]+$'
    );

COMMENT ON COLUMN admission_audit_sealed.rtt_theory_version IS
  'RTT theoretical framework version in force at time of classification. '
  'Distinct from constraint_version which tracks threshold values. '
  'Records the ontological framework: which foundational statements, principles, '
  'and Frame Entity schema were in use. '
  'Format: v1.9, v2.0, etc. or pre-versioning for historical records. '
  'Immutable after record creation.';

-- Verify: existing records should all have 'pre-versioning'
-- New records should have the version from RTT_THEORY_VERSION config.
-- SELECT rtt_theory_version, COUNT(*) FROM admission_audit_sealed GROUP BY rtt_theory_version;
