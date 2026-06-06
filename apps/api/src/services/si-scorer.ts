import prisma from '../prisma.js';

// Weights per spec: rate 0.20, direction 0.20, relationship 0.25, configuration 0.35
const WEIGHTS = { rate: 0.20, direction: 0.20, relationship: 0.25, configuration: 0.35 };

const HIGH_INDICATORS = {
  rate: [
    // Technical / scientific
    'accelerating', 'rapid increase', 'rate of change', 'faster than', 'slowing significantly',
    'deviation', 'deviated', 'deviates', 'off by', 'wrong by', 'discrepancy', 'mismatch',
    'inconsistent', 'anomalous', 'anomaly', 'abnormal', 'unexpected result', 'unexplained',
    'residual', 'residuals', '% deviation', '% off', '% above', '% below',
    'exceeded', 'below expected', 'above expected', 'outside expected', 'outside normal',
    'fault', 'malfunction', 'failed', 'failure', 'error', 'wrong altitude', 'wrong trajectory',
    'overdose', 'excess dose', 'excessive', 'extreme dose', 'massive dose',
    // Everyday investigation language — something is out of place
    'never seen', 'never seen before', 'had not seen', 'never noticed', 'first time',
    'out of character', 'unusual', 'not normal', 'not typical', 'unlike', 'unexpected',
    'no record', 'no entry', 'no card scan', 'no log', 'no trace', 'no sign',
    'did not arrive', 'never arrived', 'marked absent', 'absent', 'missing',
    'unregistered', 'not registered', 'prepaid', 'anonymous', 'unknown number',
    'largest', 'highest ever', 'biggest', 'in 90 days', 'in 30 days', 'in weeks', 'in months',
    'not seen before', 'had never', 'without explanation', 'cannot explain', 'unexplained',
    'wrong location', 'different location', 'not where', 'placed him', 'placed her',
    'cell tower', 'tower ping', 'did not ping', 'phone located', 'phone was at',
    'cash withdrawal', 'withdrew', 'withdrawal',
  ],
  direction: [
    // Technical
    'monotonically', 'monotonic', 'consistently increasing', 'only moving in one direction', 'no reversal', 'unidirectional',
    'accumulating', 'accumulation', 'building up', 'progressive', 'growing over', 'escalating',
    'compounding', 'systematic', 'persistent', 'continued', 'recurring', 'repeated occurrences',
    'worsening', 'deteriorating', 'increasing over', 'across periods', 'over time',
    'multiple instances', 'multiple occurrences', 'each period', 'every period',
    'pattern of', 'consistent pattern', 'directional', 'trend of',
    // Everyday — accumulation over time
    'three separate', 'four separate', 'multiple transfers', 'multiple calls', 'multiple times',
    'in the days before', 'in the weeks before', 'over the past', 'leading up to',
    '11 calls', '10 calls', 'repeated calls', 'called back', 'called again',
    'each from different', 'different accounts', 'separate accounts',
    'several times', 'again and again', 'more than once', 'on multiple occasions',
    'over 4 days', 'over 10 days', 'over several days', 'in the 4 days', 'in the 10 days',
    'totalling', 'total of', 'combined total',
  ],
  relationship: [
    // Technical
    'diverging from', 'no longer tracking', 'decoupled', 'disconnected from', 'moved independently',
    'inconsistent with', 'contradicts', 'conflicts with', 'at odds with', 'incompatible with',
    'despite', 'contrary to', 'yet the', 'but the', 'however the', 'although the',
    'shows nominal', 'shows normal', 'reported normal', 'indicated normal', 'reads nominal',
    'while actual', 'versus expected', 'vs expected', 'actual vs', 'vs actual',
    'found it inconsistent', 'not match', 'does not match', 'did not match',
    'no fault flag', 'no fault', 'no error flag',
    // Everyday — two things that should agree but do not
    'says he was', 'claims he was', 'stated he was', 'says she was', 'claimed to be',
    'but phone', 'but records show', 'but records indicate', 'but camera shows',
    'phone shows', 'phone records show', 'records contradict', 'records place',
    'inconsistent with his', 'inconsistent with her', 'inconsistent with stated',
    'not where he said', 'not where she said', 'different from what',
    'alibi', 'false alibi', 'impossible', 'physically impossible', 'could not have been',
    'store was closed', 'closed that day', 'not open', 'was not there',
    'confirmed he was not', 'confirmed she was not', 'was not present',
    '3km', 'kilometres away', 'miles away', 'km north', 'km south', 'km away',
    'independent source', 'two sources', 'separate sources confirm',
  ],
  configuration: [
    // Technical
    'simultaneously approaching', 'multiple dimensions', 'concurrent boundary', 'all measures', 'combined pressure',
    'multiple systems', 'multiple domains', 'multiple sites', 'multiple hospitals', 'multiple units',
    'across all', 'across both', 'system-wide', 'compound', 'combined', 'simultaneous', 'concurrent',
    'shared cause', 'common cause', 'same pattern', 'identical across', 'same codebase',
    // Everyday — multiple things pointing the same direction
    'same time', 'same morning', 'same window', 'same day', 'that morning',
    'minutes before', 'hours before', '17 minutes', 'just before',
    'same car', 'matching description', 'man matching', 'woman matching', 'person matching',
    'both domains', 'phone and financial', 'money and calls', 'location and finance',
    'at the same time', 'at the same location', 'at the same place',
    'converging on', 'all pointing to', 'all pointing toward',
    'two independent', 'three independent', 'independent witnesses',
    'same number', 'same account', 'same location', 'same period',
  ],
};

const LOW_INDICATORS = ['stable', 'within normal range', 'as expected', 'nominal', 'unchanged', 'within tolerance', 'seemed completely normal', 'seemed normal', 'nothing unusual'];

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
      content: `You are scoring an investigation signal for Structural Incongruence (SI). Score each dimension 0.0–1.0. Respond with JSON only — no explanation.

Signal: "${content}"

DIMENSIONS — score how strongly the signal shows each pattern, regardless of domain (space, crime, finance, medicine, etc.):

rate (0.0–1.0): Something is at a level, speed, or magnitude that does not match what would be expected. Examples: a reading is wrong, a person was somewhere unexpected, a value deviates from normal, something is absent when it should be present, an amount is unusually large or small.

direction (0.0–1.0): Something has been consistently moving in one direction over multiple periods, or a pattern keeps repeating. Examples: repeated calls to the same number, accumulating residuals, transfers arriving multiple times, a problem growing over time.

relationship (0.0–1.0): Two sources or records that should agree are contradicting each other. Examples: what someone said vs what records show, a person's stated location vs their phone location, a self-report vs an objective log, a verbal alibi vs physical evidence.

configuration (0.0–1.0): Multiple independent things are pointing to the same anomaly at the same time. Examples: phone records AND financial records both anomalous in the same window, two witnesses independently reporting the same strange car, several signals converging on the same person or location.

Also extract:
- mismatch_type: RATE | DIRECTION | RELATIONSHIP | CONFIGURATION (the highest-scoring dimension)
- deviation_direction: UP | DOWN | DIVERGING | CONVERGING | STABLE (overall direction of the anomaly, or null)

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
