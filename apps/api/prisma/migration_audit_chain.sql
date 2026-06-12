-- CIS Audit Chain Migration
-- Run once against the production database before deploying the new API.
-- Safe to run multiple times (uses IF NOT EXISTS).

CREATE SEQUENCE IF NOT EXISTS admission_audit_sealed_seq START 1;

CREATE TABLE IF NOT EXISTS admission_audit_sealed (
  id                 UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seq                INT         NOT NULL DEFAULT nextval('admission_audit_sealed_seq'),
  signal_id          UUID        NOT NULL REFERENCES signals(id),
  case_id            UUID        NOT NULL REFERENCES cases(id),
  decision           TEXT        NOT NULL,
  si_score           NUMERIC(5,4) NOT NULL,
  si_threshold       NUMERIC(5,4) NOT NULL,
  significance       NUMERIC(5,4) NOT NULL,
  sig_threshold      NUMERIC(5,4) NOT NULL,
  dim_threshold      NUMERIC(5,4) NOT NULL,
  constraint_version TEXT        NOT NULL,
  signal_content     TEXT        NOT NULL,
  si_rate            NUMERIC(5,4) NOT NULL,
  si_direction       NUMERIC(5,4) NOT NULL,
  si_relationship    NUMERIC(5,4) NOT NULL,
  si_configuration   NUMERIC(5,4) NOT NULL,
  input_hash         CHAR(64)    NOT NULL,
  decision_trace     JSONB       NOT NULL,
  prev_hash          CHAR(64)    NOT NULL,
  current_hash       CHAR(64)    NOT NULL UNIQUE,
  sealed_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS admission_audit_sealed_seq_unique ON admission_audit_sealed(seq);
CREATE INDEX IF NOT EXISTS admission_audit_sealed_case_id  ON admission_audit_sealed(case_id);
CREATE INDEX IF NOT EXISTS admission_audit_sealed_signal_id ON admission_audit_sealed(signal_id);

CREATE TABLE IF NOT EXISTS admission_audit_checkpoint (
  id           UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seq_from     INT         NOT NULL,
  seq_to       INT         NOT NULL,
  record_count INT         NOT NULL,
  merkle_root  CHAR(64)    NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admission_audit_checkpoint_created_at ON admission_audit_checkpoint(created_at DESC);
