import prisma from '../prisma.js';

// Weights per spec: rate 0.20, direction 0.20, relationship 0.25, configuration 0.35
const WEIGHTS = { rate: 0.20, direction: 0.20, relationship: 0.25, configuration: 0.35 };

export interface SIResult {
  si_rate: number;
  si_direction: number;
  si_relationship: number;
  si_configuration: number;
  si_score: number;
  mismatch_type: string | null;
  deviation_direction: string | null;
  shg_mode: 'AI_SCORED' | 'RULE_TAGGED';
  ai_reasoning?: string;
}

/**
 * Score a signal for Structural Incongruence.
 * AI scoring is the primary path. Keyword scoring is the fallback only when
 * the AI call fails (network error, missing key, etc.).
 */
export async function scoreSignal(content: string): Promise<SIResult> {
  try {
    return await scoreWithAI(content);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('[si-scorer] AI scoring failed, falling back to rule-based:', msg);
    return scoreRuleBased(content);
  }
}

// ─── AI scorer ────────────────────────────────────────────────────────────

async function scoreWithAI(content: string): Promise<SIResult> {
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const client = new Anthropic();

  const response = await client.messages.create({
    model: process.env.AI_MODEL ?? 'claude-haiku-4-5-20251001',
    max_tokens: 800,
    messages: [{
      role: 'user',
      content: `You are scoring an observation signal for Structural Incongruence (SI) — the degree to which the signal reveals that two things that should be consistent are not, or that something is moving in a direction inconsistent with its governing frame.

Score each of the four dimensions from 0.0 to 1.0. Apply this to any domain: organizational transitions, scientific paradigm shifts, institutional decisions, criminal investigations, medical anomalies, financial irregularities, strategic failures, geopolitical shifts.

Signal: "${content}"

DIMENSIONS:

rate (0.0–1.0): The signal shows something at a level, speed, frequency, or magnitude that does not match what would be expected given the governing frame. Something is wrong in quantity or degree. High score: a reading deviates from normal, a decision commits resources inconsistently with known information, an absence where presence is required, an amount or frequency that is anomalous. Low score: everything is within expected parameters.

direction (0.0–1.0): The signal shows a persistent one-directional movement or accumulating pattern over time. The trend keeps going the same way across multiple periods. High score: repeated instances of the same phenomenon, a metric consistently declining while commitments remain unchanged, accumulating evidence in one direction, a pattern that compounds over time. Low score: a single event, no temporal pattern visible.

relationship (0.0–1.0): Two sources, records, or claims that should be consistent are contradicting each other. What one source says and what another shows do not align. High score: stated position vs actual behaviour, official data vs internal reports, public commitment vs private knowledge, formal classification vs observed reality, what was said vs what records confirm. Low score: all sources agree, no contradiction between accounts.

configuration (0.0–1.0): Multiple independent signals are simultaneously pointing to the same anomaly, converging on the same conclusion from different directions. High score: phone AND financial records both anomalous in the same window, market data AND internal memos AND public statements all pointing to the same structural problem, several independent indicators converging. Low score: single data source, no convergence.

Respond with JSON only:
{
  "rate": 0.0,
  "direction": 0.0,
  "relationship": 0.0,
  "configuration": 0.0,
  "mismatch_type": "RATE|DIRECTION|RELATIONSHIP|CONFIGURATION|null",
  "deviation_direction": "UP|DOWN|DIVERGING|CONVERGING|null",
  "reasoning": "One sentence explaining the dominant structural incongruence in this signal, or why it scores low."
}`
    }]
  });

  const text = response.content[0]?.type === 'text' ? response.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON in AI response');

  const r = JSON.parse(jsonMatch[0]);
  const si_rate          = clamp(r.rate          ?? 0);
  const si_direction     = clamp(r.direction      ?? 0);
  const si_relationship  = clamp(r.relationship   ?? 0);
  const si_configuration = clamp(r.configuration  ?? 0);
  const si_score = round3(
    si_rate          * WEIGHTS.rate +
    si_direction     * WEIGHTS.direction +
    si_relationship  * WEIGHTS.relationship +
    si_configuration * WEIGHTS.configuration
  );

  return {
    si_rate, si_direction, si_relationship, si_configuration, si_score,
    mismatch_type:       r.mismatch_type       ?? null,
    deviation_direction: r.deviation_direction ?? null,
    shg_mode:            'AI_SCORED',
    ai_reasoning:        r.reasoning           ?? null,
  };
}

// ─── Keyword fallback ─────────────────────────────────────────────────────

const HIGH_INDICATORS = {
  rate: [
    'accelerating', 'rapid increase', 'rate of change', 'faster than', 'slowing significantly',
    'deviation', 'deviated', 'deviates', 'off by', 'wrong by', 'discrepancy', 'mismatch',
    'inconsistent', 'anomalous', 'anomaly', 'abnormal', 'unexpected result', 'unexplained',
    'residual', 'residuals', '% deviation', '% off', '% above', '% below',
    'exceeded', 'below expected', 'above expected', 'outside expected', 'outside normal',
    'fault', 'malfunction', 'failed', 'failure', 'error',
    'never seen', 'never seen before', 'first time', 'out of character', 'unusual',
    'no record', 'no entry', 'no log', 'no trace', 'no sign', 'missing',
    'largest', 'highest ever', 'biggest', 'without explanation', 'cannot explain',
  ],
  direction: [
    'monotonically', 'consistently increasing', 'only moving in one direction', 'unidirectional',
    'accumulating', 'accumulation', 'building up', 'progressive', 'growing over', 'escalating',
    'compounding', 'systematic', 'persistent', 'continued', 'recurring', 'repeated occurrences',
    'worsening', 'deteriorating', 'increasing over', 'across periods', 'over time',
    'multiple instances', 'multiple occurrences', 'each period', 'every period',
    'pattern of', 'consistent pattern', 'trend of',
    'three separate', 'four separate', 'multiple transfers', 'multiple times',
    'in the weeks before', 'over the past', 'leading up to',
    'several times', 'again and again', 'more than once', 'on multiple occasions',
  ],
  relationship: [
    'diverging from', 'no longer tracking', 'decoupled', 'disconnected from',
    'inconsistent with', 'contradicts', 'conflicts with', 'at odds with', 'incompatible with',
    'despite', 'contrary to', 'yet the', 'but the', 'however the', 'although the',
    'while actual', 'versus expected', 'vs expected', 'actual vs', 'vs actual',
    'does not match', 'did not match', 'not match',
    'but records show', 'but records indicate', 'records contradict',
    'inconsistent with stated', 'different from what',
    'alibi', 'impossible', 'physically impossible', 'could not have been',
    'independent source', 'two sources', 'separate sources confirm',
  ],
  configuration: [
    'simultaneously', 'multiple dimensions', 'concurrent', 'all measures', 'combined pressure',
    'multiple systems', 'multiple domains', 'across all', 'across both', 'system-wide',
    'compound', 'combined', 'shared cause', 'common cause', 'same pattern', 'identical across',
    'converging on', 'all pointing to', 'all pointing toward',
    'two independent', 'three independent', 'independent witnesses',
    'same time', 'same window', 'same day', 'phone and financial', 'both domains',
  ],
};

const LOW_INDICATORS = [
  'stable', 'within normal range', 'as expected', 'nominal', 'unchanged',
  'within tolerance', 'seemed completely normal', 'seemed normal', 'nothing unusual',
];

const MISMATCH_TYPE_KEYWORDS: Record<string, string[]> = {
  RATE:          ['accelerat', 'rate of change', 'faster than', 'slowing'],
  DIRECTION:     ['monoton', 'unidirection', 'no reversal', 'consistently increasing'],
  RELATIONSHIP:  ['diverging', 'decoupled', 'disconnected', 'no longer tracking'],
  CONFIGURATION: ['simultaneously', 'concurrent', 'multiple dimensions', 'combined pressure'],
};

const DIRECTION_KEYWORDS: Record<string, string[]> = {
  UP:         ['increase', 'above', 'high', 'elevated', 'accelerat'],
  DOWN:       ['decrease', 'below', 'low', 'declining'],
  DIVERGING:  ['diverging', 'spreading'],
  CONVERGING: ['converging', 'narrowing'],
};

function scoreRuleBased(content: string): SIResult {
  const lower = content.toLowerCase();
  const lowPenalty = LOW_INDICATORS.filter(w => {
    const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(?<![\\w-])${escaped}(?![\\w-])`).test(lower);
  }).length;

  const scoreDimension = (indicators: string[]): number => {
    const hits = indicators.filter(w => lower.includes(w)).length;
    const effectivePenalty = hits > 0 ? 0 : lowPenalty;
    const raw = hits - effectivePenalty;
    return Math.min(1.0, Math.max(0.0, raw / 2.5));
  };

  const si_rate          = scoreDimension(HIGH_INDICATORS.rate);
  const si_direction     = scoreDimension(HIGH_INDICATORS.direction);
  const si_relationship  = scoreDimension(HIGH_INDICATORS.relationship);
  const si_configuration = scoreDimension(HIGH_INDICATORS.configuration);

  const si_score = round3(
    si_rate          * WEIGHTS.rate +
    si_direction     * WEIGHTS.direction +
    si_relationship  * WEIGHTS.relationship +
    si_configuration * WEIGHTS.configuration
  );

  const dims = { RATE: si_rate, DIRECTION: si_direction, RELATIONSHIP: si_relationship, CONFIGURATION: si_configuration };
  const topDim = (Object.entries(dims) as [string, number][]).reduce((a, b) => b[1] > a[1] ? b : a);
  const mismatch_type = topDim[1] > 0 ? topDim[0] : inferMismatchType(lower);
  const deviation_direction = inferDeviationDirection(lower);

  return { si_rate, si_direction, si_relationship, si_configuration, si_score, mismatch_type, deviation_direction, shg_mode: 'RULE_TAGGED' };
}

function inferMismatchType(lower: string): string | null {
  for (const [type, keywords] of Object.entries(MISMATCH_TYPE_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) return type;
  }
  return null;
}

function inferDeviationDirection(lower: string): string | null {
  for (const [dir, keywords] of Object.entries(DIRECTION_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) return dir;
  }
  return null;
}

// ─── Persist scores ───────────────────────────────────────────────────────

export async function applyScoresToSignal(signalId: string, result: SIResult): Promise<void> {
  await prisma.signals.update({
    where: { id: signalId },
    data: {
      si_rate:             result.si_rate,
      si_direction:        result.si_direction,
      si_relationship:     result.si_relationship,
      si_configuration:    result.si_configuration,
      si_score:            result.si_score,
      mismatch_type:       result.mismatch_type,
      deviation_direction: result.deviation_direction,
      shg_mode:            result.shg_mode,
      ai_reasoning:        result.ai_reasoning ?? null,
    },
  });
}

function clamp(v: number): number { return Math.min(1.0, Math.max(0.0, v)); }
function round3(v: number): number { return Math.round(v * 1000) / 1000; }
