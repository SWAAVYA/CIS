# Phase 6 — Frontend Build Prompt

You are building the CIS frontend. The backend is complete and running. 28/28 invariant tests pass. The API works end-to-end. Your job is to build the React application that sits on top of it.

## Reference documents

Read these before writing code:

- `CIS_UI_SPEC.md` — all pages, components, design direction, color palette, fonts
- `CIS_API_SPEC.md` — all endpoints and response shapes
- `CIS_SPEC_AMENDMENTS.md` — amendments that supersede the base UI spec where they conflict

Where the amendment conflicts with the UI spec, the amendment wins.

## What exists

```
apps/api/     — complete, running on port 3000
apps/web/     — scaffold only: package.json, vite.config.ts, tailwind.config.ts, index.html, src/main.tsx
```

The web scaffold has React, TypeScript, Vite, and Tailwind installed. Nothing else.

## Build sequence — follow this exactly

### Step 1 — API client

Build `src/api/client.ts` first. Every component depends on it.

All API calls as typed async functions. Base URL from `import.meta.env.VITE_API_URL`. Each function returns a typed response matching the API spec exactly.

Functions to implement:

```typescript
// Cases
createCase(title: string, description?: string): Promise<Case>
getCaseById(id: string): Promise<CaseDetail>
getCaseByCode(code: string): Promise<CaseDetail>
closeCase(id: string): Promise<void>

// Domains
createDomain(caseId: string, name: string, description?: string): Promise<Domain>
getDomains(caseId: string): Promise<Domain[]>
declareIndependence(caseId: string, domainAId: string, domainBId: string, isIndependent: boolean, basis: string): Promise<void>

// Signals
submitSignal(caseId: string, payload: SignalSubmission): Promise<SignalSubmissionResult>
getSignals(caseId: string, params?: SignalQueryParams): Promise<SignalListResult>
getSignalById(id: string): Promise<SignalDetail>
transitionSignal(id: string, toStatus: string, reason: string): Promise<TransitionResult>
updateSignalScores(id: string, scores: ScoreUpdate): Promise<Signal>

// Contradictions
registerContradiction(caseId: string, signalAId: string, signalBId: string, description: string): Promise<Contradiction>
getContradictions(caseId: string, status?: string): Promise<Contradiction[]>
resolveContradiction(id: string, payload: ResolutionPayload): Promise<Contradiction>
createReleasedOption(caseId: string, text: string, signalId?: string): Promise<ReleasedOption>
getReleasedOptions(caseId: string): Promise<ReleasedOption[]>
updateReleasedOption(id: string, payload: ReleasedOptionUpdate): Promise<ReleasedOption>

// Hypotheses
createHypothesis(caseId: string, payload: HypothesisPayload): Promise<Hypothesis>
getHypotheses(caseId: string, params?: HypothesisQueryParams): Promise<Hypothesis[]>
submitEvidence(hypothesisId: string, payload: EvidencePayload): Promise<EvidenceResult>
getPlausibilityHistory(hypothesisId: string): Promise<PlausibilityHistory[]>
resolveHypothesis(id: string, status: string, basis: string): Promise<Hypothesis>
createCompetitionSet(caseId: string, hypothesisIds: string[], description: string): Promise<CompetitionSet>
normaliseCompetitionSet(setId: string, reason: string): Promise<Hypothesis[]>

// Briefings
generateBriefing(caseId: string): Promise<Briefing>
getBriefings(caseId: string): Promise<Briefing[]>
getBriefingById(id: string): Promise<Briefing>

// Analytics
getAnalytics(): Promise<AnalyticsSnapshot>

// Events and LP flags
getCaseEvents(caseId: string, params?: EventQueryParams): Promise<SignalEvent[]>
getLPFlags(caseId: string, since?: string): Promise<LPFlag[]>
```

### Step 2 — Types

Build `src/types/index.ts`. All TypeScript interfaces. Match exactly what the API returns — run against the curl sequence results to verify. Include:

```typescript
type LifecycleStatus = 'CANDIDATE' | 'ADMITTED' | 'RETAINED' | 'ASSESSED' | 'RESOLVED' | 'ARCHIVED' | 'EXPIRED'
type EvidenceType = 'SUPPORTING' | 'CONTRADICTING' | 'CONTEXTUAL'
type ResolutionType = 'RC-1' | 'RC-2' | 'RC-3'
type HypothesisType = 'HCL' | 'SI_CLUSTER' | 'PATTERN' | 'INVESTIGATOR'
type HypothesisStatus = 'ACTIVE' | 'CONFIRMED' | 'FALSIFIED' | 'ARCHIVED'
type MatchStrength = 'STRONG' | 'MODERATE' | 'WEAK'
type LPCode = 'LP-1' | 'LP-2' | 'LP-3' | 'LP-4' | 'LP-5' | 'LP-6' | 'LP-7'
```

### Step 3 — React Query hooks

Build `src/hooks/`:

```
useCase.ts          — useCase(id), useCaseByCode(code), useCaseStats(id)
useSignals.ts       — useSignals(caseId, params), useSignal(id)
useHypotheses.ts    — useHypotheses(caseId), usePlausibilityHistory(hypothesisId)
useContradictions.ts — useContradictions(caseId)
useAnalytics.ts     — useAnalytics()
```

Poll interval: 30 seconds on case, signals, hypotheses, contradictions. Analytics: 5 minutes.

### Step 4 — Shared components (build atoms before pages)

**StatusBadge.tsx**

Renders lifecycle_status as a colored pill. Colors from the design system:

```
CANDIDATE  → --signal-candidate  (#4a4a6a)
ADMITTED   → --signal-admitted   (#4f7fc9)
RETAINED   → --signal-retained   (#4f9e6f)
ASSESSED   → --signal-assessed   (#4f9faf)
RESOLVED   → --signal-resolved   (#3a3a5a)
ARCHIVED   → --signal-archived   (#2a2a3a)
EXPIRED    → --signal-expired    (#2a2a2a)
```

**GovernanceBadges.tsx**

Three independent boolean badges displayed alongside lifecycle status. Never replacing it.

```
is_quarantined = true  → 🔒 red pill "QUARANTINED"
is_connected = true    → 🔗 amber pill "CONNECTED"  
is_wsp_protected = true → 🛡 blue pill "WSP"
```

**SIScoreBar.tsx**

Horizontal bar 0–1.0. Color gradient:
- Below 0.25: grey (below SI_min)
- 0.25–0.55: amber
- Above 0.55: blue-green

Threshold marker lines at 0.25 and 0.55. Show numeric score beside bar.

**PlausibilityBar.tsx**

Horizontal bar 0–1.0.
- Below 0.10: red (falsification threshold)
- 0.10–0.85: amber
- Above 0.85: green (confirmation threshold)

Threshold marker lines at 0.10 and 0.85.

**DomainTag.tsx**

Small pill. Color determined by hashing domain name to one of 8 predefined colors. Same domain name always produces same color. Display domain name truncated to 20 chars.

**LPFlag.tsx**

Amber pill showing LP code (LP-1 through LP-7). Tooltip on hover shows:
- LP-1: Signal rejected before candidate creation
- LP-2: Signal expired before minimum retention period
- LP-3: Cross-domain signal not connected
- LP-4: High-SI signal resolved by explanation
- LP-5: Signal cluster not aggregated before expiry
- LP-6: Significant signal score decayed without reassessment
- LP-7: Contradiction closed without RC evidence

### Step 5 — Pages

Build in this order. Do not skip ahead.

---

**Start.tsx** (`/`)

Large centered layout. DM Mono throughout.

- Eyebrow: "cognitive intelligence system" in small serif italic
- Title: "CIS" in large serif
- Case name input + BEGIN INVESTIGATION button
- Access code input + RETRIEVE CASE button below
- Link to /analytics
- One-sentence description: "Submit observations. Preserve what remains unexplained. Connect residuals across domains."

---

**SignalIntake.tsx** (`/cases/:id/intake`)

Clean, focused. This is the primary workflow entry point.

Left: intake form
- Domain selector (dropdown of case domains) — required
- Observation period (number input)
- Content textarea — large, placeholder: "Describe the observation precisely. Include the structural context."
- Mismatch type selector (RATE | DIRECTION | RELATIONSHIP | CONFIGURATION) — optional
- Deviation direction selector (UP | DOWN | DIVERGING | CONVERGING | STABLE) — optional
- When no ANTHROPIC_API_KEY is detected by the backend (check via a health endpoint field), show: "Tag signals to enable cross-domain synthesis."
- SUBMIT SIGNAL button

Right: after submission, show the signal result card:
- SI score with SIScoreBar
- Significance score
- Admission decision badge (ADMITTED | REJECTED | SUB_THRESHOLD_RETAINED)
- Any connections detected
- Any hypotheses generated
- SUBMIT ANOTHER button

---

**SignalPool.tsx** (`/cases/:id/signals`)

Full signal list with lifecycle filter tabs.

Tabs: ALL | CANDIDATE | ADMITTED | RETAINED | ASSESSED | RESOLVED | ARCHIVED | EXPIRED

Filter bar: domain selector, min SI slider, sort (significance desc / created desc)

Each signal row:
- StatusBadge (lifecycle_status)
- GovernanceBadges (is_quarantined, is_connected, is_wsp_protected)
- DomainTag
- Content (truncated to 120 chars)
- SIScoreBar (compact)
- Significance score
- Observation period
- Actions: VIEW DETAIL

Signal Detail — slide-in drawer from right:
- Full content
- Full SI breakdown: 4 dimension bars + composite
- Full significance breakdown: 6 criterion bars + composite
- Lifecycle event log (ordered list of all signal_events)
- Governance flag history (governance_change events)
- Connected signals (if is_connected)
- Contradiction references (if is_quarantined)

---

**Dashboard.tsx** (`/cases/:id`)

Default landing page for a case.

**Case setup checklist** — show ABOVE dashboard panels when domain_count < 2 OR independence_declarations < 1:

```
CASE SETUP
□ Step 1: Add domains          [GO →]
□ Step 2: Declare independence  [GO →]  
□ Step 3: Submit first signal  [GO →]

SHG cross-domain synthesis will not run until two domains 
with an independence declaration exist.
```

Disappears automatically when complete. Cannot be dismissed manually.

**Pool status row** (full width): signal counts by lifecycle_status in status colors. Plus quarantined count and connected count as separate governance indicators. Click any count → Signal Pool filtered to that status.

**Six panels** (2×3 grid):

1. Active Hypotheses — top 3 by plausibility, PlausibilityBar, type badge, [GO →]
2. Quarantine Alert — count + first 3 descriptions, red treatment, [RESOLVE →]
3. High-Significance Signals — top 5 by significance, SIScoreBar, domain tag
4. LP Flags — since last briefing, LPFlag components, [VIEW ALL →]
5. Open Questions — RETAINED signals with SI ≥ 0.50 and no hypothesis
6. Last Briefing — timestamp, summary preview, [GENERATE NEW] button

LP flags label: "LP flags since last briefing [timestamp]". If no briefing: "LP flags since case creation".

---

**HypothesisBoard.tsx** (`/cases/:id/hypotheses`)

Card grid. Each card:

- Title + HypothesisType badge (HCL | SI_CLUSTER | PATTERN | INVESTIGATOR)
- PlausibilityBar (prominent)
- Generated by (SHG | INVESTIGATOR)
- Evidence counts: N supporting | N contradicting | N contextual
- Last updated
- Buttons: EXPAND | ADD EVIDENCE | RESOLVE

Expanded card:
- Full description
- Plausibility history chart (line chart, recharts)
  - X axis: timestamps
  - Y axis: 0.0–1.0
  - Threshold lines at 0.10 and 0.85
  - Each point tooltip: plausibility value + reason
  - Data from GET /api/hypotheses/:id/plausibility-history
- Evidence list (type badge, content, weight, plausibility delta)
- Connected signals list
- Competition set section (if competition_set_id exists):
  - List of competing hypotheses with their current plausibilities
  - Warning banner if sum > 1.0: "Combined plausibility exceeds 100%. [NORMALISE MANUALLY →]"
  - NORMALISE button opens modal: explains what normalisation does, requires confirmation

ADD EVIDENCE modal:
- Evidence type: three large buttons SUPPORTING | CONTRADICTING | CONTEXTUAL
  - Show what each means below the button
- Weight slider 0.0–1.0
- Content textarea
- Signal link (optional signal selector)
- Preview: expected plausibility delta
- SUBMIT

---

**ContradictionLedger.tsx** (`/cases/:id/contradictions`)

Table of all contradictions.

Each row:
- Status badge: ACTIVE (red) | RESOLVED (green)
- Signal A content preview
- Signal B content preview
- Description
- Time in quarantine (if active) or resolution time (if resolved)
- Resolution type if resolved
- RESOLVE button if active

Resolution modal — show both signals in full, then:

Resolution type selector — three large cards:

```
RC-1 — Calibration Invalidation
The source of one signal is confirmed unreliable.
The signal's basis is invalid, not the claim it made.

RC-2 — Falsification  
One signal predicts an observable condition that is 
demonstrably absent. Direct evidence rules it out.

RC-3 — Domain Resolution
Someone with direct observational access confirms 
which condition is actually present.
```

User selects a card, enters resolution basis (required), selects which signal is accepted (if applicable), CONFIRM.

---

**CognitiveBriefing.tsx** (`/cases/:id/briefing`)

Document-style, not dashboard-style. Serif font for narrative content.

GENERATE NEW button at top.

Most recent briefing rendered as a structured document:

```
COGNITIVE BRIEFING
[Case title] · [Generated at]
─────────────────────────────────

POOL STATUS
[Status counts with governance flags]

SUMMARY
[AI narrative if available, or structured summary]

ACTIVE SIGNALS
[Top 5 by significance — signal card rows]

ACTIVE HYPOTHESES  
[List with plausibility bars]

QUARANTINE
[Active contradictions]

LOSS POINTS
[LP flags with descriptions]

OPEN QUESTIONS
[High-SI signals without hypotheses]

RESOLVED THIS SESSION
[What changed since last briefing]
```

Export button: downloads plain text in the format from the UI spec.

Previous briefings: dropdown to view older briefings.

---

**DomainManager.tsx** (`/cases/:id/domains`)

Domain list with ADD DOMAIN form.

Independence matrix: grid showing all domain pairs.

Each cell: INDEPENDENT | DEPENDENT | UNSET (click to set)
- INDEPENDENT: green
- DEPENDENT: red  
- UNSET: grey — SHG cannot run for this pair

Warn when pairs are UNSET: "SHG will not evaluate [Domain A] × [Domain B] until independence is declared."

---

**Analytics.tsx** (`/analytics`)

Public page. No authentication.

Headline metrics (large numbers):
- Total investigations run
- Signal admission rate (admitted / submitted)
- HCL hypothesis confirmation rate
- Average SI score

LP distribution bar chart: LP-1 through LP-7 counts

Signal lifecycle funnel: Submitted → Admitted → Retained → Assessed → Resolved (show drop-off at each stage)

Hypothesis type breakdown: HCL | SI_CLUSTER | PATTERN | INVESTIGATOR with confirmation rates per type

Explanatory text per metric — one paragraph each in plain language. Not academic. Written for someone who has never heard of CIS.

Empty state: all metrics show 0, explanatory text still renders, the page explains what will appear as cases accumulate.

---

### Step 6 — App shell and routing

`App.tsx` with react-router-dom:

```
/                         → Start
/cases/:id                → Dashboard
/cases/:id/intake         → SignalIntake
/cases/:id/signals        → SignalPool
/cases/:id/hypotheses     → HypothesisBoard
/cases/:id/contradictions → ContradictionLedger
/cases/:id/briefing       → CognitiveBriefing
/cases/:id/domains        → DomainManager
/analytics                → Analytics
```

Navigation: persistent left sidebar on case pages. Shows case title, access code, and links to all case pages. Highlights current page.

---

## Design constraints

**Fonts** — loaded from Google Fonts in index.html:

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Instrument+Serif:ital@0;1&family=IBM+Plex+Sans:wght@300;400;500&display=swap" rel="stylesheet">
```

- DM Mono: signal content, scores, technical data, all monospace
- Instrument Serif: hypothesis titles, briefing narrative, committed explanations
- IBM Plex Sans: labels, navigation, buttons

**Color palette** — define as Tailwind custom theme AND CSS variables (both needed):

```css
--bg: #080810
--surface: #0f0f1a
--surface2: #141422
--border: #1a1a2e
--border2: #252540
--signal-candidate: #4a4a6a
--signal-admitted: #4f7fc9
--signal-retained: #4f9e6f
--signal-assessed: #4f9faf
--signal-resolved: #3a3a5a
--signal-archived: #2a2a3a
--signal-expired: #2a2a2a
--hypothesis-active: #9e7f4f
--hypothesis-confirmed: #4f9e6f
--hypothesis-falsified: #c94f4f
--lp-flag: #e8a030
--accent: #c8b87a
--text: #d0d0e8
--text-muted: #606078
--text-dim: #303048
--red: #c94f4f
--red-dim: #7a3030
--green: #4f9e6f
--green-dim: #2a5a40
--blue: #4f7fc9
--flag: #e8a030
--flag-bg: #1e1408
```

**No rounded corners on investigation elements.** Signals, hypotheses, contradiction cards — sharp edges. Rounded only on buttons and input fields.

**Live SI preview on Signal Intake** — do NOT implement as-you-type. Implement as a PREVIEW button that triggers one API call on demand. Real-time per-keystroke AI calls are too expensive.

---

## Critical requirements

**The plausibility history chart requires data from `GET /api/hypotheses/:id/plausibility-history`.** Verify this endpoint returns data before building the chart component. Use the case from the curl sequence — it has one plausibility history record.

**The competition set normalisation modal must explain what normalisation does** before allowing confirmation. Investigators must understand they are proportionally scaling all hypothesis plausibilities in the set. This is irreversible.

**The contradiction resolution modal must show full RC-1/2/3 descriptions** — not just labels. Investigators who don't know what RC-3 means must understand it from reading the card.

**The case setup checklist cannot be dismissed manually.** It disappears only when domain_count ≥ 2 AND at least one independence declaration exists.

**Empty states everywhere.** No blank boxes. Every list has an empty state with text explaining what will appear.

**Error boundaries on every page.** Display user-friendly messages, not stack traces.

---

## Verification

When complete, verify:

1. Start page → create a case → lands on Dashboard with setup checklist
2. Domain Manager → add two domains → declare independence → checklist completes
3. Signal Intake → submit signal → admission result shown with SI score
4. Submit second signal from different domain → connections and hypothesis appear in result
5. Hypothesis Board → hypothesis visible → add evidence → plausibility history chart shows the update
6. Contradiction Ledger → empty state renders correctly
7. Cognitive Briefing → GENERATE NEW → briefing renders with pool status
8. Signal Pool → filter by ADMITTED → governance badges visible
9. Analytics → loads with data from the curl sequence case
10. Access code → retrieve case from Start page

That is the frontend working.
