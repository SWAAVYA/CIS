-- Add case_id to frame_entity for direct case-level queries.
-- case:* identity rows are backfilled from the identity column.
-- The column is nullable because the CIS singleton frame entity has no case.

ALTER TABLE frame_entity
  ADD COLUMN IF NOT EXISTS case_id UUID REFERENCES cases(id);

CREATE INDEX IF NOT EXISTS idx_fe_case_id ON frame_entity (case_id);

-- Backfill: extract UUID from identity = 'case:<uuid>'
UPDATE frame_entity
SET case_id = (
  SUBSTRING(identity FROM 6)::uuid
)
WHERE identity LIKE 'case:%'
  AND case_id IS NULL;
