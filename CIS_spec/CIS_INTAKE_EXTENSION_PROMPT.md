# Claude Code Prompt — CIS Intake Extension

You are extending the CIS frontend and backend with an enhanced intake pipeline. The existing system is complete and running. Do not modify any existing routes, services, or components. Add only what is described here.

## Reference

Read `CIS_INTAKE_EXTENSION_SPEC.md` completely before writing any code. It contains the full architecture, all three AI prompts, the new API endpoints, and the UI component descriptions.

## What exists

- `apps/api/src/routes/signals.ts` — existing signal submission route, do not modify
- `apps/web/src/pages/SignalIntake.tsx` — existing manual intake page
- All other existing files — do not modify

## What to build

### Backend — three new endpoints

Create `apps/api/src/routes/intake.ts`

Mount it in `apps/api/src/index.ts` at `/api/cases/:id/intake`

**POST /api/cases/:id/intake/document**

```typescript
// 1. Validate case exists
// 2. Extract text from body.content
// 3. Call Anthropic API with Prompt 1 (document extraction) from the spec
// 4. Parse JSON response into SignalCandidate[]
// 5. Return candidates
// If no API key: return 503 { error: 'Document processing requires ANTHROPIC_API_KEY', code: 'AI_UNAVAILABLE' }
```

**POST /api/cases/:id/intake/data**

```typescript
// 1. Validate case exists
// 2. Parse body.csv into a structured table
// 3. Format table + body.column_definitions into a prompt
// 4. Call Anthropic API with Prompt 2 (data analysis) from the spec
// 5. Parse JSON response into SignalCandidate[]
// 6. Return candidates
```

**POST /api/cases/:id/intake/synthesize**

```typescript
// 1. Validate case exists
// 2. Verify both domain_ids exist in case
// 3. Extract observations from domain_a.content using Prompt 1
// 4. Extract observations from domain_b.content using Prompt 1  
// 5. Run structural correspondence using Prompt 3 on the two extraction results
// 6. Return { candidates_a, candidates_b, correspondences }
```

**POST /api/cases/:id/intake/confirm**

```typescript
// Takes the confirmed candidates from the review UI
// For each confirmed candidate, call the existing admitSignal flow
// This is essentially a batch signal submission
// Returns { signals, connections, hypotheses } — same shape as POST /api/cases/:id/signals
```

The AI prompts are in `CIS_INTAKE_EXTENSION_SPEC.md`. Use them exactly as written. Parse the response with JSON.parse() — if it fails, return 422 with the raw response for debugging.

### Frontend — enhanced Signal Intake page

Rewrite `apps/web/src/pages/SignalIntake.tsx` to support three modes.

**Mode picker** — shown at top of page, three cards:

```
MANUAL ENTRY | DOCUMENT | CROSS-FIELD SYNTHESIS
```

Current manual entry form is Mode 1. Add Modes 2 and 3.

**Mode 2 — Document**

```
Textarea: "Paste document text, paper abstract, or report content"
OR file upload button (reads file as text, puts in textarea)

[EXTRACT SIGNALS] button
  → calls POST /api/cases/:id/intake/document
  → shows CandidateReviewPanel with results
```

**Mode 3 — Cross-Field Synthesis**

```
Two columns side by side:

Domain A                    Domain B
[Domain selector]          [Domain selector]
[Text area]                [Text area]

Both domain selectors show the case's existing domains.
Neither can select the same domain as the other.

[FIND STRUCTURAL CORRESPONDENCE] button
  → calls POST /api/cases/:id/intake/synthesize
  → shows CandidateReviewPanel with results from both domains
  → shows CorrespondencePanel below
```

**CandidateReviewPanel component**

```typescript
// Props: candidates, onConfirm

// For each candidate, show:
// - Extracted text (editable textarea — investigator can refine)
// - SI dimension badge (selectable: RATE | DIRECTION | RELATIONSHIP | CONFIGURATION)
// - Deviation direction badge (selectable: UP | DOWN | DIVERGING | CONVERGING | STABLE)
// - Domain selector (required — must be assigned before confirming)
// - Observation period input (number, required)
// - INCLUDE toggle (default: on)

// Bottom: "X of Y selected" + [CONFIRM SELECTED] button
// On confirm: calls POST /api/cases/:id/intake/confirm with selected candidates
// Shows result: signals admitted, connections detected, hypotheses generated
```

**CorrespondencePanel component** (only shown in Mode 3)

```typescript
// Shows structural correspondences found between Domain A and Domain B
// For each correspondence:
//   - Domain A observation text
//   - ↔ correspondence type badge
//   - Domain B observation text  
//   - Correspondence strength bar
//   - Candidate shared cause (in italic, clearly labeled as hypothesis)
//   - [INCLUDE BOTH SIGNALS] button — adds both to the candidate review
```

**When no API key is configured:**

Modes 2 and 3 show a disabled state with message:
"Document processing and cross-field synthesis require an Anthropic API key. Manual entry is always available."

**Loading state:**

AI extraction can take 5-15 seconds. Show a loading state with:
- Mode 2: "Extracting observations from document..."
- Mode 3: "Analyzing structural correspondence across domains..."

Do not show a spinner alone — show the text so the investigator knows what's happening.

### Add API client functions

In `apps/web/src/api/client.ts`, add:

```typescript
extractFromDocument(caseId: string, content: string): Promise<SignalCandidate[]>
analyzeData(caseId: string, csv: string, columnDefs: ColumnDef[]): Promise<SignalCandidate[]>
synthesizeFields(caseId: string, domainA: DomainInput, domainB: DomainInput): Promise<SynthesisResult>
confirmCandidates(caseId: string, candidates: ConfirmedCandidate[]): Promise<SignalSubmissionResult>
```

### Add types

In `apps/web/src/types/index.ts`, add:

```typescript
interface SignalCandidate {
  id: string  // temporary client-side ID for review
  text: string
  si_dimension: 'RATE' | 'DIRECTION' | 'RELATIONSHIP' | 'CONFIGURATION' | null
  deviation_direction: 'UP' | 'DOWN' | 'DIVERGING' | 'CONVERGING' | 'STABLE' | null
  observation_period: number | null
  domain_id: string | null
  source_section?: string
  structural_note?: string
  included: boolean
}

interface Correspondence {
  observation_a: string
  observation_b: string
  correspondence_type: string
  correspondence_strength: number
  structural_note: string
  candidate_shared_cause: string
  observation_period_match: boolean
}

interface SynthesisResult {
  candidates_a: SignalCandidate[]
  candidates_b: SignalCandidate[]
  correspondences: Correspondence[]
}

interface ColumnDef {
  column_name: string
  type: 'TIME' | 'MEASUREMENT' | 'IGNORE'
  label?: string
  expected_range?: { min: number, max: number }
}

interface ConfirmedCandidate {
  text: string
  si_dimension: string
  deviation_direction: string
  observation_period: number
  domain_id: string
  mismatch_type: string
}
```

## Critical requirements

**Human confirmation is required.** AI extraction returns candidates. Candidates are not signals. Nothing enters the Signal Pool without the investigator clicking CONFIRM SELECTED. This is architectural — do not add any auto-confirm behavior.

**JSON parsing must be robust.** The Anthropic API sometimes wraps JSON in markdown code blocks. Strip ```json and ``` before parsing. If parsing fails after stripping, return 422 with the raw text.

**Editable candidates.** Everything the AI extracts is editable before confirmation. The text, the SI dimension, the direction — all can be changed by the investigator. The AI suggestion is a starting point.

**Mode picker state is local.** Which mode is selected doesn't need to survive page refresh. useState is sufficient.

**The existing manual intake form must still work.** Mode 1 is the current form unchanged. Switching to Mode 2 or 3 hides the manual form. Switching back restores it.

## Verification

When complete:

1. Paste this text in Document mode and confirm at least 2 signal candidates are extracted:
   "Nitrogen levels in the study area showed accelerating accumulation across four consecutive measurement periods, reaching 847 ppm — significantly above the historical baseline of 280-340 ppm. The rate of increase was monotonically positive with no reversal. Concurrent measurements of soil pH showed unexpected decoupling from nitrogen levels, diverging from the normally strong inverse correlation observed in prior seasons."

2. In Cross-Field Synthesis mode, paste the same text in Domain A and this in Domain B:
   "Atmospheric deposition measurements recorded a 340% increase in nitrogen compounds over the same four-period window. The pattern was directionally consistent across all monitoring stations, suggesting a common upstream source rather than local variation. Ozone levels showed no corresponding change, ruling out photochemical explanations."
   
   Confirm that at least one structural correspondence is detected and a candidate shared cause is proposed.

3. Confirm that no signals appear in the Signal Pool until CONFIRM SELECTED is clicked.

4. Confirm that when no ANTHROPIC_API_KEY is set, Modes 2 and 3 show the disabled state message.
