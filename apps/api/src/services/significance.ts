import prisma from '../prisma.js';

const SIG_THRESHOLD = parseFloat(process.env.SIG_THRESHOLD ?? '0.55');

export interface SignificanceResult {
  sig_si: number;
  sig_persistence: number;
  sig_corroboration: number;
  sig_proximity: number;
  sig_rarity: number;
  sig_relevance: number;
  significance: number;
}

export async function scoreSignificance(
  signalId: string,
  siScore: number
): Promise<SignificanceResult> {
  const signal = await prisma.signals.findUniqueOrThrow({ where: { id: signalId } });

  // sig_si: the signal's SI score directly
  const sig_si = round3(siScore);

  // sig_persistence: min(signal_event_count / 5, 1.0) — AMENDED
  const eventCount = await prisma.signal_events.count({ where: { signal_id: signalId } });
  const sig_persistence = round3(Math.min(eventCount / 5, 1.0));

  // sig_corroboration: other signals from different domains with same mismatch_type
  // within ±1 observation period
  let sig_corroboration = 0.0;
  if (signal.mismatch_type && signal.observation_period !== null) {
    const corroborating = await prisma.signals.count({
      where: {
        case_id: signal.case_id,
        id: { not: signalId },
        domain_id: { not: signal.domain_id ?? undefined },
        mismatch_type: signal.mismatch_type,
        observation_period: {
          gte: signal.observation_period - 1,
          lte: signal.observation_period + 1,
        },
        lifecycle_status: { in: ['ADMITTED', 'RETAINED', 'ASSESSED'] },
      },
    });
    sig_corroboration = round3(Math.min(corroborating / 3, 1.0));
  }

  // sig_proximity: signal's si_configuration score (proxy for constraint boundary proximity)
  const sig_proximity = round3(Number(signal.si_configuration ?? siScore));

  // sig_rarity: signal's SI score (proxy)
  const sig_rarity = round3(siScore);

  // sig_relevance: min(count of ACTIVE hypotheses where signal is evidence / 3, 0.20) — AMENDED, capped at 0.20
  const activeEvidenceCount = await prisma.hypothesis_evidence.count({
    where: {
      signal_id: signalId,
      hypothesis: { status: 'ACTIVE' },
    },
  });
  const sig_relevance = round3(Math.min(activeEvidenceCount / 3, 0.20));

  const significance = round3(
    (sig_si + sig_persistence + sig_corroboration + sig_proximity + sig_rarity + sig_relevance) / 6
  );

  return { sig_si, sig_persistence, sig_corroboration, sig_proximity, sig_rarity, sig_relevance, significance };
}

export async function applySignificanceToSignal(
  signalId: string,
  result: SignificanceResult
): Promise<void> {
  await prisma.signals.update({
    where: { id: signalId },
    data: {
      sig_si:           result.sig_si,
      sig_persistence:  result.sig_persistence,
      sig_corroboration: result.sig_corroboration,
      sig_proximity:    result.sig_proximity,
      sig_rarity:       result.sig_rarity,
      sig_relevance:    result.sig_relevance,
      significance:     result.significance,
    },
  });
}

export function meetsSignificanceThreshold(significance: number): boolean {
  return significance >= SIG_THRESHOLD;
}

function round3(v: number): number { return Math.round(v * 1000) / 1000; }
