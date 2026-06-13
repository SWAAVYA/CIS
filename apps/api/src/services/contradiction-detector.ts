import prisma from '../prisma.js';

/**
 * After a signal is admitted, compare it against all other admitted signals
 * in the same case. Use AI to detect structural contradictions.
 * Writes contradiction records automatically — investigators review, not create.
 */
export async function detectContradictions(
  signalId: string,
  caseId: string
): Promise<void> {
  console.log(`[contradiction-detector] starting for signal ${signalId}`);
  const newSignal = await prisma.signals.findUnique({
    where: { id: signalId },
    select: { id: true, content: true, mismatch_type: true, domain_id: true },
  });
  if (!newSignal) return;

  // Get all other admitted/retained signals in this case
  const existing = await prisma.signals.findMany({
    where: {
      case_id: caseId,
      id: { not: signalId },
      lifecycle_status: { in: ['ADMITTED', 'RETAINED', 'ASSESSED'] },
    },
    select: { id: true, content: true, mismatch_type: true, domain_id: true },
  });

  if (existing.length === 0) return;

  // Check each pair — skip if contradiction already exists
  for (const other of existing) {
    const [aId, bId] = [signalId, other.id].sort() as [string, string];

    const alreadyExists = await prisma.contradictions.findUnique({
      where: { signal_a_id_signal_b_id: { signal_a_id: aId, signal_b_id: bId } },
    });
    if (alreadyExists) continue;

    const result = await checkContradiction(newSignal.content, other.content);
    if (!result.contradicts) continue;

    // Write the contradiction
    await prisma.$transaction(async (tx) => {
      await tx.contradictions.create({
        data: {
          case_id: caseId,
          signal_a_id: aId,
          signal_b_id: bId,
          description: result.description,
          status: 'ACTIVE',
        },
      });

      // Quarantine both signals
      for (const sid of [aId, bId]) {
        const sig = await tx.signals.findUniqueOrThrow({ where: { id: sid } });
        await tx.signals.update({ where: { id: sid }, data: { is_quarantined: true } });
        await tx.signal_events.create({
          data: {
            signal_id: sid,
            case_id: sig.case_id,
            from_status: sig.lifecycle_status,
            to_status: sig.lifecycle_status,
            governance_change: 'is_quarantined: FALSE → TRUE',
            reason: `Auto-detected contradiction: ${result.description}`,
          },
        });
      }
    });
  }
}

async function checkContradiction(
  contentA: string,
  contentB: string
): Promise<{ contradicts: boolean; description: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { contradicts: false, description: '' };

  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: process.env.AI_MODEL ?? 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    messages: [{
      role: 'user',
      content: `You are detecting STRUCTURAL CONTRADICTIONS between two observation signals in an investigation.

A structural contradiction exists ONLY when:
1. Both signals describe THE SAME specific variable, metric, fact, or state, AND
2. They assign values or conditions to it that CANNOT both be accurate at the same time.

Do NOT flag as contradictions:
- Signals describing different aspects, domains, or timeframes of the same situation
- Signals where one provides context or elaboration for the other
- Signals that are merely related or thematically similar
- Signals describing sequential change (one could follow from the other)
- Signals with different emphasis or framing but no factual conflict
- Signals that are both plausibly true simultaneously

Signal A: "${contentA}"

Signal B: "${contentB}"

Do these signals contain a direct factual contradiction where the same specific thing cannot be in both states simultaneously? Respond with JSON only:
{
  "contradicts": true or false,
  "description": "One precise sentence naming the specific variable that is contradicted and how, or empty string if no genuine contradiction."
}`
    }]
  });

  const text = response.content[0]?.type === 'text' ? response.content[0].text : '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return { contradicts: false, description: '' };

  const r = JSON.parse(match[0]);
  return {
    contradicts: r.contradicts === true,
    description: r.description ?? '',
  };
}
