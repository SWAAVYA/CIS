# CIS Enhanced Intake Pipeline — Specification

**Status:** v1 extension  
**Date:** 2026-06-02  
**Addresses:** Current intake accepts text descriptions only. This extension adds document processing, structured data analysis, and cross-field synthesis.

---

## The Problem

v1 intake requires investigators to write observations in natural language. This works for qualitative field notes. It fails for:

- Scientific papers (need to extract relevant observations from dense text)
- Lab reports and data tables (need numerical anomaly detection, not keyword matching)
- Cross-field synthesis (need to find structural correspondence between papers from unrelated fields)

The architecture handles all three correctly once signals exist. The gap is getting signals out of these source types.

---

## Architecture

Nothing changes downstream. Signal Pool, SLS, SHG, Reasoning, Briefing — all unchanged. What changes is a new extraction layer that sits before the pool:

```
Source (any format)
↓
EXTRACTION LAYER (new)
  Document processor
  Data analyzer  
  Cross-field synthesizer
↓
Signal candidates (human review)
↓
Confirmed signals → Signal Pool (unchanged)
```

Every path through the extraction layer produces signal candidates. The investigator reviews and confirms which candidates become actual signals. Nothing enters the pool without human confirmation.

---

## Three Intake Modes

### Mode 1 — Document Intake

**Input:** PDF upload, text paste, or URL  
**Use case:** Research papers, investigation reports, lab reports, case studies, field notes, news articles

**Process:**
1. Extract text from document
2. AI identifies structurally relevant observations (see AI prompt below)
3. Return list of signal candidates with: extracted text, suggested domain, SI dimension, deviation direction
4. Investigator reviews candidates, selects which to admit, assigns final domain
5. Confirmed candidates submitted to Signal Pool

**What counts as a relevant observation:**
Not every sentence in a paper is a signal. The extraction AI looks specifically for observations that show:
- Rate of change inconsistent with baseline or expected dynamics
- Directional movement where bidirectional is expected (monotonic trends)
- Decoupling between variables that normally track together
- Multiple variables simultaneously approaching boundaries
- Results that contradict prior findings or model predictions
- Anomalies the paper itself flags as unexplained

The paper's conclusions, literature reviews, and methodology sections are less relevant than its results, anomalies, and discussion of unexpected findings.

---

### Mode 2 — Structured Data Intake

**Input:** CSV upload or paste a table  
**Use case:** Time-series measurements, sensor readings, lab outputs, monitoring data

**Process:**
1. User uploads CSV or pastes table
2. User labels columns: which is time, which are measurements, what each represents
3. AI analyzes the numerical data for structural anomalies (see AI prompt below)
4. Returns signal candidates: specific patterns found, time windows, affected variables
5. Investigator reviews, assigns domains, confirms
6. Confirmed candidates submitted to Signal Pool

**What numerical anomaly detection looks for:**
- Acceleration: rate of change increasing over consecutive periods
- Monotonic movement: consistent direction without reversal over N periods
- Threshold proximity: values approaching historical or specified limits
- Cross-variable decoupling: two variables that normally correlate are diverging
- Simultaneous multi-variable anomaly: multiple columns showing anomalies in the same time window
- Step changes: sudden discontinuous shifts inconsistent with gradual dynamics

SI dimensions map directly to numerical patterns:
- RATE → acceleration, rate of change
- DIRECTION → monotonic movement, directional consistency
- RELATIONSHIP → cross-variable correlation breakdown
- CONFIGURATION → multi-variable simultaneous boundary approach

---

### Mode 3 — Cross-Field Synthesis

**Input:** Two or more documents from different fields  
**Use case:** "I have a paper from soil science and a paper from atmospheric chemistry — do they see the same thing?"

**Process:**
1. User uploads two documents, assigns each to a domain
2. AI extracts observations from each document independently
3. AI performs structural correspondence analysis across the two extractions
4. Returns: pairs of observations that correspond structurally, correspondence type, candidate shared cause
5. Investigator reviews — each correspondence pair can become:
   - Two signals (one per domain) submitted to the pool
   - With a pre-populated connection that triggers SHG review
6. If domains are declared independent, SHG evaluates whether a hypothesis should be generated

**The key distinction:**
Cross-field synthesis looks for structural correspondence, not semantic similarity. Two papers can discuss completely different phenomena (soil nitrogen and atmospheric ozone) and still show structural correspondence if both exhibit the same type of rate anomaly in the same observation window. The shared cause might be something neither field has named.

---

## AI System Prompts

### Prompt 1 — Document Signal Extraction

```
You are an observation extractor for a cognitive intelligence system that 
studies structural anomalies across independent information domains.

Your task: read the provided document and identify observations that 
show structural incongruence — meaning the observation reports something 
that deviates structurally from what its context would predict.

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
Do not invent observations. Only extract what is actually in the document.
```

---

### Prompt 2 — Structured Data Analysis

```
You are a structural anomaly detector for a cognitive intelligence system.

You will receive tabular data with labeled columns. Your task is to identify
patterns in the numerical data that show structural incongruence.

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
If the data shows no structural anomalies, return an empty array with a note explaining why.
```

---

### Prompt 3 — Cross-Field Structural Correspondence

```
You are a structural correspondence analyst for a cognitive intelligence system.
Your task is to identify structural similarities between observations from two
independent domains, where those similarities may indicate a shared underlying cause.

You will receive:
- Domain A: a set of extracted observations from one field or source
- Domain B: a set of extracted observations from a different, independent field or source

Important: you are NOT looking for semantic similarity (same topic, same phenomenon).
You are looking for STRUCTURAL similarity:
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

Do not force correspondences. A genuine absence of structural correspondence 
is a valid and useful finding.
```

---

## New API Endpoints

```
POST /api/cases/:id/intake/document
  Body: { content: string, filename?: string }
  Returns: { candidates: SignalCandidate[] }

POST /api/cases/:id/intake/data  
  Body: { csv: string, column_definitions: ColumnDef[] }
  Returns: { candidates: SignalCandidate[] }

POST /api/cases/:id/intake/synthesize
  Body: { domain_a: { domain_id: string, content: string }, 
           domain_b: { domain_id: string, content: string } }
  Returns: { candidates_a: SignalCandidate[], candidates_b: SignalCandidate[], 
             correspondences: Correspondence[] }

POST /api/cases/:id/intake/confirm
  Body: { candidates: ConfirmedCandidate[] }
  Returns: { signals: Signal[], connections: Connection[], hypotheses: Hypothesis[] }
```

---

## New UI Components

### IntakeModePicker

On the Signal Intake page, before the current form, show three mode cards:

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  MANUAL ENTRY   │  │   DOCUMENT      │  │  CROSS-FIELD    │
│                 │  │                 │  │  SYNTHESIS      │
│ Describe an     │  │ Upload a paper, │  │                 │
│ observation     │  │ report, or      │  │ Compare two     │
│ directly        │  │ paste text      │  │ documents from  │
│                 │  │                 │  │ different fields│
│ [current form]  │  │ AI extracts     │  │                 │
│                 │  │ relevant signals│  │ AI finds shared │
│                 │  │                 │  │ structure       │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### CandidateReviewPanel

After AI extraction, show candidates in a review list before any enter the pool:

For each candidate:
- Extracted observation text (editable)
- Suggested SI dimension (changeable)
- Suggested deviation direction (changeable)  
- Domain assignment (required — user must assign)
- Observation period (required — user must assign)
- INCLUDE / EXCLUDE toggle

CONFIRM SELECTED button submits only included candidates.

This panel is the human-in-the-loop gate. Nothing enters the pool without explicit confirmation.

### DataUploadForm

For structured data mode:
- CSV paste area or file upload
- Column labeler: for each column, user selects: TIME | MEASUREMENT | IGNORE
- For MEASUREMENT columns: what does this measure? (text label)
- What is the expected baseline/normal range? (optional — helps AI identify anomalies)
- ANALYZE button triggers the data prompt

---

## Design Notes

**Requiring human confirmation is non-negotiable.** AI extraction produces candidates. Candidates are not signals. The investigator decides what enters the pool. This protects the audit trail — every signal in the pool was explicitly confirmed by a human, regardless of how it was extracted.

**The AI prompts return structured JSON.** The backend parses this directly into SignalCandidate objects. No free-text parsing. If the AI returns malformed JSON, the endpoint returns a 422 with the raw AI output for debugging.

**Fallback when no API key:** Document and data modes are disabled. Manual entry only. The UI should explain this clearly: "Document processing requires an Anthropic API key. Configure one in settings to enable this mode."

**Cross-field synthesis requires two domain declarations.** Before running synthesis, the system should verify that both domains exist in the case and are declared independent. If not, prompt the user to complete domain setup first.
