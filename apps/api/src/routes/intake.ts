import { Router, Request } from 'express';
import { z } from 'zod';
import prisma from '../prisma.js';
import { scoreSignal } from '../services/si-scorer.js';
import { checkConnections, generateHypothesis } from '../services/shg.js';
import { runAdmission } from '../services/admission.js';

type WithCaseId = Request<{ id: string }>

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const documentSchema = z.object({ content: z.string().min(1) });

const synthesizeSchema = z.object({
  domain_a: z.object({ domain_id: z.string().regex(uuidRegex), content: z.string().min(1) }),
  domain_b: z.object({ domain_id: z.string().regex(uuidRegex), content: z.string().min(1) }),
});

const confirmSchema = z.object({
  candidates: z.array(z.object({
    text: z.string().min(1),
    si_dimension: z.string(),
    deviation_direction: z.string(),
    observation_period: z.number().int().positive(),
    domain_id: z.string().regex(uuidRegex),
    mismatch_type: z.string().optional(),
  })).min(1),
});

const router = Router({ mergeParams: true });


function round3(v: number): number { return Math.round(v * 1000) / 1000; }

function parseAIJson(text: string): unknown {
  // Strip markdown code fences
  const stripped = text.replace(/```json\n?|\n?```/g, '').trim();

  // Try parsing the whole string first
  try {
    return JSON.parse(stripped);
  } catch {
    // Model sometimes adds a preamble sentence before the JSON array/object.
    // Find the first [ or { and parse from there.
    const arrayStart = stripped.indexOf('[');
    const objectStart = stripped.indexOf('{');
    const start = arrayStart === -1 ? objectStart
      : objectStart === -1 ? arrayStart
      : Math.min(arrayStart, objectStart);

    if (start === -1) throw new Error('No JSON found in response');

    const closer = stripped[start] === '[' ? ']' : '}';
    const end = stripped.lastIndexOf(closer);
    if (end === -1) throw new Error('Unclosed JSON in response');

    return JSON.parse(stripped.slice(start, end + 1));
  }
}

const PROMPT_1_SYSTEM = `You are an observation extractor for a cognitive intelligence system that studies structural anomalies across independent information domains.

Your task: read the provided document and identify observations that show structural incongruence — meaning the observation reports something that deviates structurally from what its context would predict.

For each relevant observation you find, return:

{
  "text": "exact quote or close paraphrase of the observation",
  "si_dimension": "RATE" | "DIRECTION" | "RELATIONSHIP" | "CONFIGURATION",
  "deviation_direction": "UP" | "DOWN" | "DIVERGING" | "CONVERGING" | "STABLE",
  "observation_period": "time period if mentioned, or null",
  "structural_note": "one sentence: what makes this structurally anomalous",
  "source_section": "Results" | "Discussion" | "Methods" | "Conclusion" | "Other"
}

SI dimensions:
- RATE: the rate of change is inconsistent with expected dynamics
- DIRECTION: movement is monotonic where bidirectional is expected
- RELATIONSHIP: variables that should track together are decoupling
- CONFIGURATION: multiple variables simultaneously approaching limits

What to extract:
- Measurements that deviate from baseline or model predictions
- Trends the authors flag as unexpected or unexplained
- Results that contradict prior findings
- Anomalies in the data the authors note but do not fully explain
- Any observation that the authors treat as a residual (something their framework doesn't account for)

What to ignore:
- Literature review summaries
- Methodological descriptions
- Conclusions that are fully explained by the paper's own model
- Statistical significance statements without accompanying anomalous observation

Return a JSON array. If no relevant observations exist, return an empty array.
Do not invent observations. Only extract what is actually in the document.`;

const PROMPT_2_SYSTEM = `You are a structural anomaly detector for a cognitive intelligence system.

You will receive tabular data with labeled columns. Your task is to identify patterns in the numerical data that show structural incongruence.

For each anomalous pattern found, return:

{
  "description": "plain language description of the pattern",
  "affected_columns": ["column names involved"],
  "time_window": "which rows/periods show this pattern",
  "si_dimension": "RATE" | "DIRECTION" | "RELATIONSHIP" | "CONFIGURATION",
  "deviation_direction": "UP" | "DOWN" | "DIVERGING" | "CONVERGING",
  "severity": "HIGH" | "MODERATE" | "LOW",
  "structural_note": "why this pattern is structurally anomalous"
}

Patterns to detect:

RATE anomalies:
- Acceleration: consecutive period-over-period increases in rate of change
- Deceleration when acceleration expected, or vice versa
- Rate of change exceeding 2x the mean rate over the observation window

DIRECTION anomalies:
- Monotonic movement over 3+ consecutive periods (consistent direction, no reversal)
- Trend reversal that is abrupt rather than gradual

RELATIONSHIP anomalies:
- Two columns that correlate historically (r > 0.7) showing correlation breakdown
- Variables that should move together moving in opposite directions
- Leading/lagging relationship changing

CONFIGURATION anomalies:
- Two or more columns simultaneously showing anomalies in the same time window
- Multiple variables simultaneously approaching their historical maximum or minimum
- Cross-variable pattern that does not fit any single-cause explanation

Return a JSON array ordered by severity (HIGH first).
If the data shows no structural anomalies, return an empty array with a note explaining why.`;

const PROMPT_3_SYSTEM = `You are a structural correspondence analyst for a cognitive intelligence system.
Your task is to identify structural similarities between observations from two independent domains, where those similarities may indicate a shared underlying cause.

You will receive:
- Domain A: a set of extracted observations from one field or source
- Domain B: a set of extracted observations from a different, independent field or source

Important: you are NOT looking for semantic similarity (same topic, same phenomenon). You are looking for STRUCTURAL similarity:
- Same type of anomaly (same SI dimension)
- Same deviation direction
- Similar temporal pattern (same observation period or adjacent periods)
- Similar relationship pattern (both show decoupling, both show boundary approach)

For each structural correspondence you find, return:

{
  "observation_a": "text of the Domain A observation",
  "observation_b": "text of the Domain B observation",
  "correspondence_type": "MISMATCH_TYPE" | "DIRECTION" | "TEMPORAL" | "CONFIGURATION",
  "correspondence_strength": 0.0-1.0,
  "structural_note": "why these observations are structurally similar despite being from different fields",
  "candidate_shared_cause": "one sentence: what type of missing variable could explain both observations simultaneously. Use tentative language — this is a hypothesis, not a conclusion.",
  "observation_period_match": true | false
}

Correspondence scoring:
- 1.0: same SI dimension + same direction + same observation period + similar severity
- 0.75: same SI dimension + same direction + adjacent observation periods
- 0.50: same SI dimension + different direction but same relationship type
- 0.25: different SI dimension but similar temporal pattern

Return correspondences with strength >= 0.25, ordered by strength descending.
If no correspondences exist, return an empty array with a note.

Do not force correspondences. A genuine absence of structural correspondence is a valid and useful finding.`;

const AI_MODEL = process.env.AI_MODEL ?? 'claude-sonnet-4-6';

async function callAI(systemPrompt: string, userMessage: string): Promise<string> {
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const client = new Anthropic();
  const response = await client.messages.create({
    model: AI_MODEL,
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });
  return response.content[0].type === 'text' ? response.content[0].text : '';
}


// POST /document
router.post('/document', async (req: WithCaseId, res, next) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'Document processing requires an AI API key configured on the server', code: 'AI_UNAVAILABLE', status: 503 });
    }
    const caseId = req.params.id;
    await prisma.cases.findUniqueOrThrow({ where: { id: caseId } });

    const docParsed = documentSchema.safeParse(req.body);
    if (!docParsed.success) {
      return res.status(400).json({ error: docParsed.error.issues[0].message, code: 'VALIDATION_ERROR', status: 400 });
    }
    const { content } = docParsed.data;

    const text = await callAI(PROMPT_1_SYSTEM, content);
    let candidates: unknown;
    try {
      candidates = parseAIJson(text);
    } catch {
      return res.status(422).json({ error: 'AI response parsing failed', raw: text, status: 422 });
    }

    res.json({ candidates });
  } catch (err) { next(err); }
});

// POST /data
router.post('/data', async (req: WithCaseId, res, next) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'Document processing requires an AI API key configured on the server', code: 'AI_UNAVAILABLE', status: 503 });
    }
    const caseId = req.params.id;
    await prisma.cases.findUniqueOrThrow({ where: { id: caseId } });

    const { csv, column_definitions } = req.body as { csv: string; column_definitions: unknown[] };
    if (!csv) return res.status(400).json({ error: 'csv required', code: 'MISSING_FIELD', status: 400 });

    const userMessage = `Column definitions:\n${JSON.stringify(column_definitions, null, 2)}\n\nData:\n${csv}`;
    const text = await callAI(PROMPT_2_SYSTEM, userMessage);
    let candidates: unknown;
    try {
      candidates = parseAIJson(text);
    } catch {
      return res.status(422).json({ error: 'AI response parsing failed', raw: text, status: 422 });
    }

    res.json({ candidates });
  } catch (err) { next(err); }
});

// POST /synthesize
router.post('/synthesize', async (req: WithCaseId, res, next) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'Document processing requires an AI API key configured on the server', code: 'AI_UNAVAILABLE', status: 503 });
    }
    const caseId = req.params.id;
    await prisma.cases.findUniqueOrThrow({ where: { id: caseId } });

    const synthParsed = synthesizeSchema.safeParse(req.body);
    if (!synthParsed.success) {
      return res.status(400).json({ error: synthParsed.error.issues[0].message, code: 'VALIDATION_ERROR', status: 400 });
    }
    const { domain_a, domain_b } = synthParsed.data;

    await prisma.domains.findUniqueOrThrow({ where: { id: domain_a.domain_id } });
    await prisma.domains.findUniqueOrThrow({ where: { id: domain_b.domain_id } });

    const [textA, textB] = await Promise.all([
      callAI(PROMPT_1_SYSTEM, domain_a.content),
      callAI(PROMPT_1_SYSTEM, domain_b.content),
    ]);

    let candidates_a: unknown, candidates_b: unknown;
    try { candidates_a = parseAIJson(textA); } catch {
      return res.status(422).json({ error: 'AI response parsing failed for domain_a', raw: textA, status: 422 });
    }
    try { candidates_b = parseAIJson(textB); } catch {
      return res.status(422).json({ error: 'AI response parsing failed for domain_b', raw: textB, status: 422 });
    }

    const synthMessage = `Domain A observations:\n${JSON.stringify(candidates_a)}\n\nDomain B observations:\n${JSON.stringify(candidates_b)}`;
    const textCorr = await callAI(PROMPT_3_SYSTEM, synthMessage);
    let correspondences: unknown;
    try { correspondences = parseAIJson(textCorr); } catch {
      return res.status(422).json({ error: 'AI response parsing failed for correspondences', raw: textCorr, status: 422 });
    }

    res.json({ candidates_a, candidates_b, correspondences });
  } catch (err) { next(err); }
});

// POST /confirm
router.post('/confirm', async (req: WithCaseId, res, next) => {
  try {
    const caseId = req.params.id;
    await prisma.cases.findUniqueOrThrow({ where: { id: caseId } });

    const confirmParsed = confirmSchema.safeParse(req.body);
    if (!confirmParsed.success) {
      return res.status(400).json({ error: confirmParsed.error.issues[0].message, code: 'VALIDATION_ERROR', status: 400 });
    }
    const { candidates } = confirmParsed.data;

    const results: unknown[] = [];
    const allLpFlags: string[][] = [];

    for (const candidate of candidates) {
      const siResult = await scoreSignal(candidate.text);
      if (candidate.mismatch_type) siResult.mismatch_type = candidate.mismatch_type;
      if (candidate.deviation_direction) siResult.deviation_direction = candidate.deviation_direction;

      const sig_si = round3(siResult.si_score);
      const sig_persistence = 0;
      const sig_corroboration = 0;
      const sig_proximity = round3(Number(siResult.si_configuration));
      const sig_rarity = round3(siResult.si_score);
      const sig_relevance = 0;
      const significance = round3((sig_si + sig_persistence + sig_corroboration + sig_proximity + sig_rarity + sig_relevance) / 6);

      const { signal, admission } = await prisma.$transaction(async (tx) => {
        const signal = await tx.signals.create({
          data: {
            case_id: caseId,
            domain_id: candidate.domain_id ?? null,
            content: candidate.text,
            observation_period: candidate.observation_period ?? null,
            lifecycle_status: 'CANDIDATE',
            is_quarantined: false, is_connected: false, is_wsp_protected: false,
            shg_mode: siResult.shg_mode,
            mismatch_type: siResult.mismatch_type,
            deviation_direction: siResult.deviation_direction,
            si_rate: siResult.si_rate, si_direction: siResult.si_direction,
            si_relationship: siResult.si_relationship, si_configuration: siResult.si_configuration,
            si_score: siResult.si_score,
            sig_si, sig_persistence, sig_corroboration, sig_proximity, sig_rarity, sig_relevance,
            significance,
          },
        });

        await tx.signal_events.create({
          data: { signal_id: signal.id, case_id: caseId, to_status: 'CANDIDATE', reason: 'Signal submitted via intake pipeline' },
        });

        const siMaxDim = Math.max(siResult.si_rate, siResult.si_direction, siResult.si_relationship, siResult.si_configuration);
        const admission = await runAdmission({
          tx, signalId: signal.id, caseId,
          signalContent: candidate.text,
          siScore: siResult.si_score,
          siRate: siResult.si_rate, siDirection: siResult.si_direction,
          siRelationship: siResult.si_relationship, siConfiguration: siResult.si_configuration,
          siMaxDimension: siMaxDim,
          significance,
        });
        const updated = await tx.signals.findUniqueOrThrow({ where: { id: signal.id } });
        return { signal: updated, admission };
      });

      if (signal.lifecycle_status !== 'EXPIRED') {
        await checkConnections(signal.id);
        const pendingConns = await prisma.signal_connections.findMany({
          where: {
            OR: [{ signal_a_id: signal.id }, { signal_b_id: signal.id }],
            shg_triggered: false,
          },
        });
        await Promise.allSettled(pendingConns.map(c => generateHypothesis(c.id)));
      }

      const lpFlags = await prisma.signal_events.findMany({
        where: { signal_id: signal.id, lp_flag: { not: null } },
        select: { lp_flag: true },
      });

      results.push(signal);
      allLpFlags.push(lpFlags.map(e => e.lp_flag as string));
      void admission;
    }

    res.status(201).json({
      submitted: results.length,
      signals: results,
      lp_flags: allLpFlags,
    });
  } catch (err) { next(err); }
});

export default router;

