-- CIS v2 Frame Graph — idempotent migration
-- Tables were created manually via migration_frame_graph.sql.
-- This migration registers them in Prisma's migration history so the
-- schema model definitions generate correctly without re-creating tables.

CREATE TABLE IF NOT EXISTS frame_entity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identity TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN (
    'person','family','organization','paradigm','civilizational',
    'implementation','programme','theoretical_framework'
  )),
  c_value NUMERIC(3,1) CHECK (c_value BETWEEN 0 AND 5),
  r_state TEXT CHECK (r_state IN ('R1','R2','R3','R4','R5','R6','R7','R8')),
  r_confidence NUMERIC(3,2) CHECK (r_confidence BETWEEN 0 AND 1),
  topology_type TEXT CHECK (topology_type IN ('A','B','C','D','E')),
  sig_contradiction_density INTEGER DEFAULT 0,
  sig_exception_proliferation INTEGER DEFAULT 0,
  sig_ontology_patch INTEGER DEFAULT 0,
  sig_category_instability INTEGER DEFAULT 0,
  sig_authority_drift INTEGER DEFAULT 0,
  sig_reinterpretation INTEGER DEFAULT 0,
  sig_recurrent_loop INTEGER DEFAULT 0,
  rtt_theory_version TEXT NOT NULL DEFAULT 'pre-versioning' CHECK (
    rtt_theory_version = 'pre-versioning'
    OR rtt_theory_version ~ '^v[0-9]+\.[0-9]+$'
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fe_level       ON frame_entity (level);
CREATE INDEX IF NOT EXISTS idx_fe_r_state     ON frame_entity (r_state);
CREATE INDEX IF NOT EXISTS idx_fe_topology    ON frame_entity (topology_type);
CREATE INDEX IF NOT EXISTS idx_fe_rtt_version ON frame_entity (rtt_theory_version);

CREATE TABLE IF NOT EXISTS frame_relationship (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_frame_id UUID NOT NULL REFERENCES frame_entity(id),
  target_frame_id UUID NOT NULL REFERENCES frame_entity(id),
  relationship_type TEXT NOT NULL CHECK (relationship_type IN (
    'competes_with','reorganizes_into','absorbs','generates_for',
    'generates_requirements_for','implements','classifies',
    'governs','instantiates','depends_on'
  )),
  direction TEXT NOT NULL CHECK (direction IN ('source_to_target','bidirectional')),
  strength NUMERIC(3,2) CHECK (strength BETWEEN 0 AND 1),
  activated_at_r TEXT CHECK (activated_at_r IN ('R1','R2','R3','R4','R5','R6','R7','R8')),
  audit_record_id UUID REFERENCES admission_audit_sealed(id),
  rtt_theory_version TEXT NOT NULL DEFAULT 'pre-versioning' CHECK (
    rtt_theory_version = 'pre-versioning'
    OR rtt_theory_version ~ '^v[0-9]+\.[0-9]+$'
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fr_source      ON frame_relationship (source_frame_id);
CREATE INDEX IF NOT EXISTS idx_fr_target      ON frame_relationship (target_frame_id);
CREATE INDEX IF NOT EXISTS idx_fr_type        ON frame_relationship (relationship_type);
CREATE INDEX IF NOT EXISTS idx_fr_audit       ON frame_relationship (audit_record_id);
CREATE INDEX IF NOT EXISTS idx_fr_rtt_version ON frame_relationship (rtt_theory_version);
