# CIS UI Specification

## Design Direction

Scientific instrument aesthetic. This is not an app — it is a cognitive system interface. Dark, precise, information-dense without being cluttered. The typography distinguishes data types: monospace for signals and technical content, serif for hypotheses and narrative briefings, sans-serif for labels and navigation.

Primary: DM Mono (signals, scores, technical data)  
Secondary: Instrument Serif (hypotheses, briefing narrative)  
Labels/Nav: IBM Plex Sans

Colour palette:
```css
--bg: #080810
--surface: #0f0f1a
--surface2: #141422
--border: #1a1a2e
--border2: #252540
--signal-candidate: #4a4a6a
--signal-admitted: #4f7fc9
--signal-retained: #4f9e6f
--signal-connected: #9e7f4f
--signal-quarantined: #c94f4f
--signal-elevated: #9f4fc9
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
```

Every signal status has its own colour. The colour system is the primary navigation aid for a complex pool.

---

## Pages

### / — Start
Minimal. Large input for case title. Access code field below. Brief description (2 sentences). Link to /analytics.

Nothing else. The complexity lives inside.

---

### /cases/:id — Dashboard (default view)

Six-panel layout:

**Top bar:** Case title | Access code (click to copy) | GENERATE BRIEFING button | Export | Settings

**Pool Status row (full width):** Signal counts by status, each in its status colour. Candidate / Admitted / Retained / Connected / Quarantined / Elevated / Assessed / Resolved / Archived / Expired. Click any status to jump to Signal Pool filtered by that status.

**Main grid (2 × 3 below the pool row):**

1. **Active Hypotheses** (top left, 2/3 width): Top 3 active hypotheses. Hypothesis title, type badge, plausibility bar (0–1.0), evidence count. Click → Hypothesis Board.

2. **Quarantine Alert** (top right, 1/3): Count of quarantined contradictions. List of first 3 with description preview. Button: RESOLVE. Red/amber treatment.

3. **High-Significance Signals** (middle left): Top 5 retained signals by significance score. Signal content preview, SI score, significance score, domain tag.

4. **LP Flags** (middle right): Any loss points flagged in this session. LP code, signal reference, brief description. Empty state: "No loss points detected."

5. **Open Questions** (bottom left): Signals with SI ≥ 0.5 and no assigned hypothesis. These are the structurally important observations that haven't been explained. "What is producing this signal?"

6. **Last Briefing** (bottom right): Time of last briefing, briefing summary preview. GENERATE NEW button.

---

### /cases/:id/signals — Signal Pool

**Full signal list with lifecycle filter tabs:** ALL | CANDIDATE | ADMITTED | RETAINED | CONNECTED | QUARANTINED | ELEVATED | ASSESSED | RESOLVED | ARCHIVED | EXPIRED

**Filter bar:** Domain | Min SI | Min Significance | Sort (significance desc, created desc)

**Signal row:**
- Status dot (status colour)
- Domain tag
- Signal content (truncated, expandable)
- SI score bar (0–1.0, coloured by score)
- Significance score
- Observation period
- Action buttons: ELEVATE | QUARANTINE | RESOLVE | VIEW DETAIL

**Signal Detail drawer (slide in from right):**
- Full content
- Full SI scoring: 4 dimension bars + composite
- Full NL4-B: 6 criterion bars + composite
- Lifecycle event log (all state transitions with timestamps and reasons)
- Connected signals (if any)
- Contradictions (if any)
- Evidence (if this signal is referenced in hypothesis evidence)

---

### /cases/:id/intake — Signal Intake

Primary workflow page. Clean, focused.

**Domain selector:** Dropdown of registered domains. + ADD DOMAIN link.

**Observation period:** Number input or "auto (current period)".

**Content textarea:** Large. "Describe the observation precisely. Include what you measured, what the reading was, and what structural context this observation exists within."

**SUBMIT SIGNAL button.**

**Right panel — live SI preview:** As user types, show:
- Preliminary SI score breakdown (4 dimensions)
- Expected admission decision
- Similar active signals in pool (by semantic similarity — AI-assisted)

**After submission:** Show signal card with full scores, admission decision, any connections detected, any hypotheses triggered. SUBMIT ANOTHER button.

---

### /cases/:id/hypotheses — Hypothesis Board

**Active hypotheses:** Card grid. Each card:
- Title + type badge (HCL | SI_CLUSTER | PATTERN | INVESTIGATOR)
- Plausibility bar (prominent — this is the key number)
- Generation source (SHG auto-generated vs investigator)
- Connected signals count
- Evidence count (supporting | contradicting | contextual)
- Last updated timestamp
- EXPAND | ADD EVIDENCE | RESOLVE buttons

**Expanded hypothesis card:**
- Full description
- Plausibility history chart (line chart — how plausibility changed over time)
- Evidence list (each evidence item with type badge, content, weight, plausibility delta)
- Connected signals list
- Competition set (if any) — shows competing hypotheses and their plausibilities

**Competition set visualisation:** Horizontal bar showing how plausibility is distributed across competing hypotheses. Zero-sum within the set is visible.

**ADD EVIDENCE modal:**
- Evidence type selector (SUPPORTING | CONTRADICTING | CONTEXTUAL) — large, clear buttons
- Weight slider (0.0 – 1.0)
- Content textarea
- Link to signal (optional)
- Preview: expected plausibility delta before confirming

---

### /cases/:id/contradictions — Contradiction Ledger

**Table of all contradictions:**
- Status badge: QUARANTINED (red) | RESOLVED (green)
- Signal A preview (first 80 chars)
- Signal B preview (first 80 chars)
- Description (what they contradict)
- Time in quarantine
- Resolution basis (if resolved)

**Quarantined row actions:**
- RESOLVE button → opens Resolution modal

**Resolution modal:**
- Show both signals in full
- Resolution type selector: RC-1 | RC-2 | RC-3 — with description of each
- Resolution basis textarea
- Which signal is accepted (if applicable)
- CONFIRM RESOLUTION

**RC definitions (shown in modal):**
- RC-1: Calibration invalidation — the source of one signal is confirmed unreliable
- RC-2: Falsification — one signal predicts an observable condition that is demonstrably absent
- RC-3: Domain resolution — someone with direct observational access confirms which condition is present

---

### /cases/:id/briefing — Cognitive Briefing

Most recent briefing rendered in full. GENERATE NEW at top.

**Briefing layout (document-style, not dashboard):**

```
COGNITIVE BRIEFING
[Case title] · [Generated at]
─────────────────────────────

POOL STATUS
[Status counts with colour-coded numbers]

AI SUMMARY
[Narrative paragraph — serif font]

ACTIVE SIGNALS (highest significance)
[Signal list with scores]

ACTIVE HYPOTHESES
[Hypothesis list with plausibility]

QUARANTINE
[Contradiction descriptions]

LOSS POINTS FLAGGED
[LP descriptions]

OPEN QUESTIONS
[High-SI unassigned signals]

RESOLVED THIS SESSION
[What was resolved]
```

Exportable as PDF (print-to-PDF) or plain text.

---

### /cases/:id/domains — Domain Manager

**Domain list:** Name, description, signal count, independence relationships.

**ADD DOMAIN form:** Name + description.

**Independence matrix:** Grid showing all domain pairs. Each cell: INDEPENDENT | DEPENDENT | UNSET. Click to set. Unset = system cannot run cross-domain analysis for this pair.

---

### /analytics — Aggregate Dashboard (public)

**Headline metrics (large):**
- Total investigations run
- Signal admission rate
- HCL hypothesis confirmation rate
- Assumption closure rate (from CR data)

**Loss point distribution:** Bar chart of LP-1 through LP-7 counts. This shows WHERE signals are systematically lost across all investigations.

**Signal lifecycle funnel:** Submitted → Admitted → Retained → Connected → Assessed → Resolved. Drop-off at each stage visible.

**Hypothesis type breakdown:** HCL vs SI_CLUSTER vs PATTERN vs Investigator. Confirmation rate by type.

**Explanatory text (one paragraph per metric):** What this measures, why it matters for investigation quality. Not academic — plain language for someone who has never heard of CIS.

---

## Component Standards

**Status badges:** Pill shape, background is status colour at 20% opacity, text is status colour at 100%.

**SI score bar:** Horizontal bar 0–1.0. Colour gradient: below 0.25 (grey) / 0.25–0.55 (amber) / above 0.55 (blue-green). Threshold markers at 0.25 and 0.55.

**Plausibility bar:** 0–1.0. Colour: below 0.3 (red) / 0.3–0.7 (amber) / above 0.7 (green). Threshold markers at 0.1 and 0.85 (resolution thresholds).

**Domain tag:** Small pill. Each domain gets a unique colour (deterministic from domain name hash).

**LP flag:** Amber pill with LP code (LP-1 through LP-7). Hover shows LP description.
