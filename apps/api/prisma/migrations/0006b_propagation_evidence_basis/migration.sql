-- Migration 0006b: add evidence_basis to residual_propagation_event
-- Required because migration 0006 ran before this field was added.
-- evidence_basis stores the observable facts grounding each propagation edge,
-- separate from attribution_confidence (the probability estimate).

ALTER TABLE residual_propagation_event
  ADD COLUMN IF NOT EXISTS evidence_basis TEXT[] NOT NULL DEFAULT '{}';
