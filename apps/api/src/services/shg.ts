import prisma from '../prisma.js';

const SHG_CORR_THRESHOLD = parseFloat(process.env.SHG_CORR_THRESHOLD ?? '0.5');
const SHG_INDEPENDENCE_THRESHOLD = parseFloat(process.env.SHG_INDEPENDENCE_THRESHOLD ?? '0.15');

export async function generateHypothesis(
  connectionId: string
): Promise<{ hypothesis_id: string } | null> {
  // Deduplication lock (INV-5.1):
  // Use a transaction with raw SELECT FOR UPDATE to atomically claim the connection.
  // If shg_triggered is already TRUE when we acquire the lock, abort — another
  // concurrent call already generated the hypothesis.
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Lock this connection row exclusively
      const rows = await tx.$queryRaw<Array<{ id: string; shg_triggered: boolean }>>`
        SELECT id, shg_triggered
        FROM signal_connections
        WHERE id = ${connectionId}::uuid
        FOR UPDATE
      `;

      if (rows.length === 0) throw new Error(`Connection ${connectionId} not found`);
      const conn = rows[0];

      if (conn.shg_triggered) return null; // another call already handled it

      // Mark triggered BEFORE generating — prevents the background job from
      // firing a second time for the same connection
      await tx.$executeRaw`
        UPDATE signal_connections
        SET shg_triggered = TRUE, shg_triggered_at = NOW()
        WHERE id = ${connectionId}::uuid
      `;

      return 'proceed';
    });

    if (result === null) return null; // already triggered

    // Load connection data outside the lock transaction
    const connection = await prisma.signal_connections.findUniqueOrThrow({
      where: { id: connectionId },
      include: {
        signal_a: true,
        signal_b: true,
      },
    });

    // Check independence threshold — P(independent co-occurrence).
    // For rule-based mode: multiply per-criterion coincidence probabilities.
    //   mismatch_type match by chance: 1/4 = 0.25 (4 types)
    //   direction match by chance:     1/5 = 0.20 (5 directions)
    //   temporal match by chance:      1/N  (treated as given if observation_period matched)
    // For AI mode: Claude returns correspondence_strength directly as P(shared cause),
    // so P(independent) = 1 - correspondence_strength.
    let pIndependent: number;
    if (process.env.SHG_MODE === 'RULE_BASED' || !process.env.ANTHROPIC_API_KEY) {
      pIndependent = 1.0;
      if (connection.mismatch_type_match) pIndependent *= 0.25;
      if (connection.direction_match)     pIndependent *= 0.20;
      if (connection.temporal_match)      pIndependent *= 0.50;
    } else {
      pIndependent = 1.0 - Number(connection.correspondence_strength);
    }

    if (pIndependent >= SHG_INDEPENDENCE_THRESHOLD) {
      return null;
    }

    // Try AI hypothesis generation if available, fall back to rule-based
    let title: string;
    let description: string;
    let hypothesisType = 'HCL';
    let initialPlausibility = 0.50;

    const aiKey = process.env.ANTHROPIC_API_KEY;
    if (aiKey && process.env.SHG_MODE !== 'RULE_BASED') {
      try {
        const aiResult = await generateHypothesisWithAI(connection.signal_a.content, connection.signal_b.content);
        title = aiResult.title;
        description = aiResult.description;
        hypothesisType = aiResult.hypothesis_type ?? 'HCL';
        initialPlausibility = aiResult.initial_plausibility ?? 0.50;
      } catch {
        // Graceful degradation — fall through to rule-based
        ({ title, description } = ruleBasedHypothesis(connection));
      }
    } else {
      ({ title, description } = ruleBasedHypothesis(connection));
    }

    // Insert hypothesis — UNIQUE(connection_id) silently handles any remaining race
    try {
      const hypothesis = await prisma.hypotheses.create({
        data: {
          case_id: connection.case_id,
          title,
          description,
          hypothesis_type: hypothesisType,
          plausibility: initialPlausibility,
          status: 'ACTIVE',
          generated_by: 'SHG',
          connection_id: connectionId,
        },
      });

      // Link hypothesis back to connection
      await prisma.signal_connections.update({
        where: { id: connectionId },
        data: { hypothesis_id: hypothesis.id },
      });

      // Mark both signals as connected
      for (const sigId of [connection.signal_a_id, connection.signal_b_id]) {
        const sig = await prisma.signals.findUniqueOrThrow({ where: { id: sigId } });
        if (!sig.is_connected) {
          await prisma.signals.update({ where: { id: sigId }, data: { is_connected: true } });
          await prisma.signal_events.create({
            data: {
              signal_id: sigId,
              case_id: sig.case_id,
              from_status: sig.lifecycle_status,
              to_status: sig.lifecycle_status,
              governance_change: 'is_connected: FALSE → TRUE',
              reason: `SHG detected cross-domain correspondence (strength ${connection.correspondence_strength})`,
            },
          });
        }
      }

      return { hypothesis_id: hypothesis.id };
    } catch (err: unknown) {
      // Unique constraint violation on connection_id — race was caught by DB
      if (isUniqueViolation(err)) return null;
      throw err;
    }
  } catch (err: unknown) {
    // Graceful — log but don't rethrow so background job doesn't crash
    console.error(`SHG generateHypothesis error for connection ${connectionId}:`, err);
    return null;
  }
}

export async function checkConnections(signalId: string): Promise<void> {
  const signal = await prisma.signals.findUniqueOrThrow({
    where: { id: signalId },
    include: { domain: true },
  });

  if (!signal.domain_id) return;

  // Find candidate signals from other domains in this case
  const candidates = await prisma.signals.findMany({
    where: {
      case_id: signal.case_id,
      id: { not: signalId },
      lifecycle_status: { in: ['RETAINED', 'ADMITTED'] },
      domain_id: { not: signal.domain_id },
    },
    include: { domain: true },
  });

  for (const candidate of candidates) {
    if (!candidate.domain_id) continue;

    // Check domain independence
    const [dA, dB] = signal.domain_id < candidate.domain_id
      ? [signal.domain_id, candidate.domain_id]
      : [candidate.domain_id, signal.domain_id];

    const independence = await prisma.domain_independence.findUnique({
      where: { domain_a_id_domain_b_id: { domain_a_id: dA, domain_b_id: dB } },
    });

    // Default: assume independent if not declared
    if (independence && !independence.is_independent) continue;

    // Compute correspondence strength
    const strength = computeCorrespondenceStrength(signal, candidate);
    if (strength < SHG_CORR_THRESHOLD) continue;

    // Ensure ordering (signal_a_id < signal_b_id)
    const [ordA, ordB] = signal.id < candidate.id
      ? [signal, candidate]
      : [candidate, signal];

    // Create connection (ON CONFLICT DO NOTHING semantics via upsert)
    try {
      const mismatchMatch = !!(signal.mismatch_type && candidate.mismatch_type && signal.mismatch_type === candidate.mismatch_type);
      const directionMatch = !!(signal.deviation_direction && candidate.deviation_direction && signal.deviation_direction === candidate.deviation_direction);
      const temporalMatch = signal.observation_period !== null && candidate.observation_period !== null
        && Math.abs(signal.observation_period - candidate.observation_period) <= 1;

      await prisma.signal_connections.create({
        data: {
          case_id: signal.case_id,
          signal_a_id: ordA.id,
          signal_b_id: ordB.id,
          domain_a_id: ordA.domain_id!,
          domain_b_id: ordB.domain_id!,
          mismatch_type_match: mismatchMatch,
          direction_match: directionMatch,
          temporal_match: temporalMatch,
          dimension_match: false,
          correspondence_strength: strength,
          domains_independent: true,
          shg_triggered: false,
        },
      });
    } catch (err: unknown) {
      if (!isUniqueViolation(err)) throw err;
      // Connection already exists — skip
    }
  }
}

function computeCorrespondenceStrength(
  a: { mismatch_type: string | null; deviation_direction: string | null; observation_period: number | null },
  b: { mismatch_type: string | null; deviation_direction: string | null; observation_period: number | null }
): number {
  const mismatchMatch = a.mismatch_type && b.mismatch_type && a.mismatch_type === b.mismatch_type;
  const directionMatch = a.deviation_direction && b.deviation_direction && a.deviation_direction === b.deviation_direction;

  if (mismatchMatch && directionMatch) return 0.75;
  if (mismatchMatch) return 0.50;
  if (directionMatch) return 0.25;
  return 0.0;
}

function ruleBasedHypothesis(connection: {
  signal_a: { domain_id: string | null; mismatch_type: string | null };
  signal_b: { domain_id: string | null; mismatch_type: string | null };
  domain_a_id: string;
  domain_b_id: string;
}): { title: string; description: string } {
  const mismatchType = connection.signal_a.mismatch_type ?? connection.signal_b.mismatch_type ?? 'structural';
  return {
    title: `Shared ${mismatchType} incongruence across independent domains`,
    description: `Signals from domain ${connection.domain_a_id} and domain ${connection.domain_b_id} exhibit ${mismatchType} correspondence in the same observation period. A shared structural source may explain the concurrent deviation.`,
  };
}

async function generateHypothesisWithAI(
  contentA: string,
  contentB: string
): Promise<{
  title: string;
  description: string;
  hypothesis_type?: string;
  initial_plausibility?: number;
  evidence_required?: string;
}> {
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const client = new Anthropic();

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Two signals from independent domains show structural correspondence. Generate a structural hypothesis about their shared cause.

Signal A: ${contentA}

Signal B: ${contentB}

Respond with JSON only:
{
  "title": "short hypothesis title",
  "description": "detailed hypothesis description",
  "hypothesis_type": "HCL|SI_CLUSTER|PATTERN",
  "initial_plausibility": 0.0-1.0,
  "evidence_required": "what evidence would confirm this hypothesis"
}`
    }]
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('AI response did not contain valid JSON');
  return JSON.parse(jsonMatch[0]);
}

function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: string }).code === 'P2002'
  );
}
