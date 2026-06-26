-- CIS Constraint Activation Sealed Migration
-- Run once against the production database before deploying the activation chain.
-- Safe to run multiple times (uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS).

-- 1. Add logic_digest to existing sealed admission records.
--    Nullable so existing rows remain valid. New rows (post-activation) always populate it.
ALTER TABLE admission_audit_sealed ADD COLUMN IF NOT EXISTS logic_digest CHAR(64);

-- 2. Sequence for the activation chain.
CREATE SEQUENCE IF NOT EXISTS constraint_activation_sealed_seq START 1;

-- 3. Hash-chained activation table.
--    Each row records a governance act: a signed change to the active constraint surface.
--    Chain integrity mirrors admission_audit_sealed — prev_hash → current_hash.
--    prev_hash is TEXT (not CHAR(64)) because the genesis row has prev_hash = 'GENESIS_ACTIVATION'.
CREATE TABLE IF NOT EXISTS constraint_activation_sealed (
  id                 UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seq                INT          NOT NULL DEFAULT nextval('constraint_activation_sealed_seq'),
  constraint_version TEXT         NOT NULL,
  digest             CHAR(64)     NOT NULL,
  values             JSONB        NOT NULL,
  logic_digest       CHAR(64)     NOT NULL,
  signer_key_version TEXT         NOT NULL,
  signature          TEXT         NOT NULL,
  activated_at       TIMESTAMPTZ  NOT NULL,
  prev_hash          TEXT         NOT NULL,
  current_hash       CHAR(64)     NOT NULL UNIQUE,
  created_at         TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS constraint_activation_sealed_seq_unique
  ON constraint_activation_sealed(seq);

CREATE INDEX IF NOT EXISTS constraint_activation_sealed_version
  ON constraint_activation_sealed(constraint_version);
