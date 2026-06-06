import prisma from '../prisma.js';

// Weights per spec: rate 0.20, direction 0.20, relationship 0.25, configuration 0.35
const WEIGHTS = { rate: 0.20, direction: 0.20, relationship: 0.25, configuration: 0.35 };

const HIGH_INDICATORS = {
  rate: [
    // Original technical terms
    'accelerating', 'rapid increase', 'rate of change', 'faster than', 'slowing significantly',
    // Investigation language — quantity mismatches
    'deviation', 'deviated', 'deviates', 'off by', 'wrong by', 'discrepancy', 'mismatch',
    'inconsistent', 'anomalous', 'anomaly', 'abnormal', 'unexpected result', 'unexplained',
    'residual', 'residuals', 'percent off', '% deviation', '% off', '% above', '% below',
    'exceeded', 'below expected', 'above expected', 'outside expected', 'outside normal',
    'fault', 'malfunction', 'failed', 'failure', 'error', 'wrong altitude', 'wrong trajectory',
    'overdose', 'excess dose', 'excessive', 'extreme dose', 'massive dose',
  ],
  direction: [
    // Original technical terms
    'monotonically', 'monotonic', 'consistently increasing', 'only moving in one direction', 'no reversal', 'unidirectional',
    // Investigation language — accumulation and trend
    'accumulating', 'accumulation', 'building up', 'progressive', 'growing over', 'escalating',
    'compounding', 'systematic', 'persistent', 'continued', 'recurring', 'repeated occurrences',
    'worsening', 'deteriorating', 'increasing over', 'across periods', 'over time',
    'multiple instances', 'multiple occurrences', 'each period', 'every period',
    'pattern of', 'consistent pattern', 'directional', 'trend of',
  ],
  relationship: [
    // Original technical terms
    'diverging from', 'no longer tracking', 'decoupled', 'disconnected from', 'moved independently',
    // Investigation language — structural contrast between sources
    'inconsistent with', 'contradicts', 'conflicts with', 'at odds with', 'incompatible with',
    'despite', 'contrary to', 'yet the', 'but the', 'however the', 'although the',
    'shows nominal', 'shows normal', 'reported normal', 'indicated normal', 'reads nominal',
    'while actual', 'versus expected', 'vs expected', 'actual vs', 'vs actual',
    'console showed', 'console shows', 'display showed', 'display shows', 'reported as nominal',
    'self-diagnostic', 'self diagnostic', 'unit reports nominal', 'sensor reports nominal',
    'found it inconsistent', 'not match', 'does not match', 'did not match',
    'independent of', 'independent from', 'no shared', 'separate from',
    'operator console', 'no fault flag', 'no fault', 'no error flag',
  ],
  configuration: [
    // Original technical terms
    'simultaneously approaching', 'multiple dimensions', 'concurrent boundary', 'all measures', 'combined pressure',
    // Investigation language — multi-source or multi-system patterns
    'multiple systems', 'multiple domains', 'multiple sites', 'multiple hospitals', 'multiple units',
    'across all', 'across both', 'across four', 'across three', 'in both', 'in all', 'throughout',
    'system-wide', 'both units', 'both domains', 'all four', 'all three', 'all hospitals',
    'compound', 'combined', 'simultaneous', 'concurrent',
    'shared cause', 'common cause', 'common to both', 'common across', 'same pattern',
    'all deployed', 'identical across', 'same codebase', 'same software',
  ],
};

const LOW_INDICATORS = ['stable', 'within normal range', 'as expected', 'nominal', 'unchanged', 'within tolerance'];

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

export interface SIResult {
  si_rate: number;
  si_direction: number;
  si_relationship: number;
  si_configuration: number;
  si_score: number;
  mismatch_type: string | null;
  deviation_direction: string | null;
  shg_mode: 'AI_SCORED' | 'RULE_TAGGED';
}

export async function scoreSignal(content: string): Promise<SIResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (apiKey && process.env.SHG_MODE !== 'RULE_BASED') {
    try {
      return await scoreWithAI(content);
    } catch {
      // Graceful degradation to rule-based
    }
  }
  return scoreRuleBased(content);
}

function scoreRuleBased(content: string): SIResult {
  const lower = content.toLowerCase();
  // Word-boundary match for low indicators so "stable-state" doesn't penalise "stable"
  const lowPenalty = LOW_INDICATORS.filter(w => {
    const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(?<![\\w-])${escaped}(?![\\w-])`).test(lower);
  }).length;

  const scoreDimension = (indicators: string[]): number => {
    const hits = indicators.filter(w => lower.includes(w)).length;
    // Only apply low penalty when there are no high hits — a signal that says
    // "nominal BUT inconsistent" is a structural contrast, not a low-SI signal.
    const effectivePenalty = hits > 0 ? 0 : lowPenalty;
    const raw = hits - effectivePenalty;
    // Scale: 1 hit → ~0.40, 2 hits → ~0.72, 3+ hits → 1.0
    // This ensures a single relevant keyword clears the SI_min threshold of 0.25.
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

  // Extract mismatch_type: highest-scoring dimension
  const dims = { RATE: si_rate, DIRECTION: si_direction, RELATIONSHIP: si_relationship, CONFIGURATION: si_configuration };
  const topDim = (Object.entries(dims) as [string, number][]).reduce((a, b) => b[1] > a[1] ? b : a);
  const mismatch_type = topDim[1] > 0 ? topDim[0] : inferMismatchType(lower);

  // Extract deviation_direction
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

async function scoreWithAI(content: string): Promise<SIResult> {
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const client = new Anthropic();

  const response = await client.messages.create({
    model: process.env.AI_MODEL ?? 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: `Score this signal on four SI dimensions (0.0–1.0 each). Respond with JSON only.

Signal: "${content}"

Dimensions:
- rate: rate of change inconsistent with classified state dynamics
- direction: monotonic movement where bidirectional expected
- relationship: decoupled from indicators it should track
- configuration: multiple dimensions simultaneously approaching boundaries

Also extract:
- mismatch_type: RATE | DIRECTION | RELATIONSHIP | CONFIGURATION (highest-scoring)
- deviation_direction: UP | DOWN | DIVERGING | CONVERGING | STABLE

{"rate":0.0,"direction":0.0,"relationship":0.0,"configuration":0.0,"mismatch_type":null,"deviation_direction":null}`
    }]
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON in AI response');

  const r = JSON.parse(jsonMatch[0]);
  const si_rate          = clamp(r.rate ?? 0);
  const si_direction     = clamp(r.direction ?? 0);
  const si_relationship  = clamp(r.relationship ?? 0);
  const si_configuration = clamp(r.configuration ?? 0);
  const si_score = round3(
    si_rate * WEIGHTS.rate + si_direction * WEIGHTS.direction +
    si_relationship * WEIGHTS.relationship + si_configuration * WEIGHTS.configuration
  );

  return {
    si_rate, si_direction, si_relationship, si_configuration, si_score,
    mismatch_type: r.mismatch_type ?? null,
    deviation_direction: r.deviation_direction ?? null,
    shg_mode: 'AI_SCORED',
  };
}

export async function applyScoresToSignal(signalId: string, result: SIResult): Promise<void> {
  await prisma.signals.update({
    where: { id: signalId },
    data: {
      si_rate:           result.si_rate,
      si_direction:      result.si_direction,
      si_relationship:   result.si_relationship,
      si_configuration:  result.si_configuration,
      si_score:          result.si_score,
      mismatch_type:     result.mismatch_type,
      deviation_direction: result.deviation_direction,
      shg_mode:          result.shg_mode,
    },
  });
}

function clamp(v: number): number { return Math.min(1.0, Math.max(0.0, v)); }
function round3(v: number): number { return Math.round(v * 1000) / 1000; }
