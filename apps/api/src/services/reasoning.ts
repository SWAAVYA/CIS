import prisma from '../prisma.js';

type EvidenceType = 'SUPPORTING' | 'CONTRADICTING' | 'CONTEXTUAL';

export async function updatePlausibility(
  hypothesisId: string,
  evidenceType: EvidenceType,
  weight: number,
  evidenceId?: string
): Promise<{ before: number; after: number }> {
  const hypothesis = await prisma.hypotheses.findUniqueOrThrow({ where: { id: hypothesisId } });
  const before = Number(hypothesis.plausibility);
  let after = before;

  if (evidenceType === 'SUPPORTING') {
    after = before + weight * (1.0 - before);
  } else if (evidenceType === 'CONTRADICTING') {
    after = before * (1.0 - weight);
  }
  // CONTEXTUAL: no change

  // Clamp to [0.0, 1.0]
  after = Math.min(1.0, Math.max(0.0, after));
  // Round to 3dp to match NUMERIC(4,3)
  after = Math.round(after * 1000) / 1000;

  await prisma.$transaction(async (tx) => {
    await tx.hypotheses.update({
      where: { id: hypothesisId },
      data: { plausibility: after, updated_at: new Date() },
    });

    await tx.plausibility_history.create({
      data: {
        hypothesis_id: hypothesisId,
        plausibility: after,
        reason: `${evidenceType} evidence (weight ${weight}): ${before} → ${after}`,
        evidence_id: evidenceId && /^[0-9a-f-]{36}$/i.test(evidenceId) ? evidenceId : null,
      },
    });
  });

  return { before, after };
}

export async function checkResolutionConditions(
  hypothesisId: string
): Promise<{ needs_review: boolean; plausibility: number }> {
  const hypothesis = await prisma.hypotheses.findUniqueOrThrow({ where: { id: hypothesisId } });
  const plausibility = Number(hypothesis.plausibility);
  const needs_review = plausibility >= 0.85 || plausibility <= 0.10;

  if (needs_review && !hypothesis.needs_resolution_review) {
    await prisma.hypotheses.update({
      where: { id: hypothesisId },
      data: { needs_resolution_review: true },
    });
  }

  return { needs_review, plausibility };
}
