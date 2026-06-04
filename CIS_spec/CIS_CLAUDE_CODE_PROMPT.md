# Claude Code Prompt — CIS Cognitive Intelligence System v2

Read all reference documents before writing code. This prompt supersedes CIS_CLAUDE_CODE_PROMPT.md.

**Specification documents (read in this order):**
1. `CIS_PRODUCT_SPEC.md` — what the system does
2. `CIS_SYSTEM_ARCHITECTURE.md` — services and structure
3. `CIS_DATABASE_SCHEMA_v2.sql` — authoritative schema (use this, not v1)
4. `CIS_API_SPEC.md` — endpoints
5. `CIS_UI_SPEC.md` — all pages and components
6. `CIS_SPEC_AMENDMENTS.md` — all amendments to the above (read last, apply throughout)
7. `DEPLOYMENT_CONFIG.md` — Railway, Vercel, GitHub Actions

Where CIS_SPEC_AMENDMENTS.md conflicts with other documents, amendments take precedence.

---

## What You Are Building

CIS — a Cognitive Intelligence System for structured investigation. It manages observations through a defined lifecycle, detects structural patterns across independent information domains, generates hypotheses about shared causes, and produces auditable cognitive briefings. The audit trail is the product. Every input, every state change, every reasoning update is timestamped and stored.

---

## Phase 1 — Repository and Configuration

Create the monorepo structure from CIS_SYSTEM_ARCHITECTURE.md. All config files, Dockerfile, railway.json, GitHub Actions workflows, .env.example. No code yet.

Environment variables to add (amendments):
```
SHG_MODE=AI           # AI | RULE_BASED
WSP_MIN_PERIODS=2     # minimum observation periods before expiry permitted
SHG_CORR_THRESHOLD=0.5
SHG_INDEPENDENCE_THRESHOLD=0.15
DORMANCY_DAYS=30      # days before dormancy flag
DORMANCY_SIGNIFICANCE_DROP=0.05
```

---

## Phase 2 — Database

Use `CIS_DATABASE_SCHEMA_v2.sql` as the authoritative schema. Do not use v1. Run initial migration, generate Prisma client.

Key schema differences from v1 (applied in v2):
- `lifecycle_status` replaces `status` on signals (enum no longer includes QUARANTINED or ELEVATED)
- Three governance flag columns on signals: `is_quarantined`, `is_connected`, `is_wsp_protected`
- SHG tagging columns on signals: `mismatch_type`, `deviation_direction`, `shg_mode`
- `UNIQUE(connection_id)` on hypotheses (deduplication)
- `UNIQUE(hypothesis_id, signal_id)` on hypothesis_evidence (no double-counting)
- `score_change_audit` table (new)
- `domain_independence_history` table (new)
- `job_runs` table (new)
- `last_briefing_at` on cases (LP session definition)
- `governance_change` field on signal_events
- Counter columns REMOVED from cases
- competition_sets: no auto-normalisation (display only)

---

## Phase 3 — Core Services

### 3a. SI Scorer (services/si-scorer.ts)

Score on 4 dimensions (0.0–1.0 each). Composite = weighted mean: rate 0.20, direction 0.20, relationship 0.25, configuration 0.35.

**AI path** (SHG_MODE=AI, ANTHROPIC_API_KEY set): Call Claude to score dimensions from signal content. Parse response as `{rate, direction, relationship, configuration, mismatch_type, deviation_direction}`.

**Rule-based path** (SHG_MODE=RULE_BASED or no API key):
Build a keyword scoring table. Apply to signal content:

Rate incongruence indicators → HIGH (0.7–1.0): "accelerating", "rapid increase", "rate of change", "faster than", "slowing significantly"
Direction indicators → HIGH: "monotonically", "consistently increasing", "only moving in one direction", "no reversal", "unidirectional"
Relationship indicators → HIGH: "diverging from", "no longer tracking", "decoupled", "disconnected from", "moved independently"
Configuration indicators → HIGH: "simultaneously approaching", "multiple dimensions", "concurrent boundary", "all measures", "combined pressure"

Stability indicators → LOW (0.0–0.2): "stable", "within normal range", "as expected", "nominal", "unchanged", "within tolerance"

Score each dimension: count high-indicator words, subtract low-indicator words, normalise to 0.0–1.0.

Also extract `mismatch_type` (highest-scoring dimension type) and `deviation_direction` from content:
- "increase", "above", "high", "elevated" → UP
- "decrease", "below", "low", "declining" → DOWN
- "diverging", "spreading" → DIVERGING
- "converging", "narrowing" → CONVERGING

Store extracted tags on the signal: `mismatch_type`, `deviation_direction`, `shg_mode = 'AI_SCORED' | 'RULE_TAGGED'`.

### 3b. NL4-B Significance Scorer (services/significance.ts)

6 criteria (0.0–1.0 each). Composite = mean.

**AMENDED sig_persistence:** `min(signal_event_count / 5, 1.0)` — query COUNT(*) from signal_events for this signal_id.

**AMENDED sig_relevance:** `min(count of ACTIVE hypotheses where this signal is referenced in hypothesis_evidence / 3, 0.20)` — cap at 0.20 maximum. Query hypothesis_evidence for this signal_id joining hypotheses status = 'ACTIVE'.

sig_si = signal's si_score.
sig_corroboration = min(count of other signals from different domains with same mismatch_type in ±1 observation period / 3, 1.0).
sig_proximity = signal's si_configuration score.
sig_rarity = signal's si_score (proxy).

### 3c. Signal Lifecycle (services/sls.ts)

State machine on `lifecycle_status`. Valid transitions:
```
CANDIDATE → ADMITTED | EXPIRED
ADMITTED  → RETAINED | EXPIRED
RETAINED  → ASSESSED | RESOLVED | EXPIRED
ASSESSED  → RESOLVED | RETAINED
RESOLVED  → ARCHIVED
ARCHIVED  → CANDIDATE (recurrence only)
EXPIRED   → (terminal — no transitions)
```

Governance flag enforcement (checked before any transition):
- `is_wsp_protected = TRUE` → BLOCK EXPIRED from ADMITTED or RETAINED
  - Check: has signal been through ≥ WSP_MIN_PERIODS observation periods since admission?
  - If not: return LP-2 error (not just a flag — a rejected transition)
  - If yes: clear is_wsp_protected, permit transition
- `is_quarantined = TRUE` → BLOCK RESOLVED and EXPIRED
  - Return error: "Signal is quarantined — resolve contradiction first"
  - Do not flag LP — this is enforcement, not observation

Every transition: create signal_events record with from_status, to_status, reason, lp_flag (if any), job_run_id (if called from a job).

Governance flag changes also create signal_events records with `governance_change` text: e.g., `"is_quarantined: FALSE → TRUE"`.

### 3d. SHG Service (services/shg.ts)

After each signal admission, check for cross-domain connections. For each other RETAINED or ADMITTED signal from a different domain in the same case:

1. Check domain_independence: are these domains declared independent? If not found in table, assume independent (default). If is_independent = FALSE, skip.

2. Compute correspondence strength:
   - AI mode: send both signal content strings to Claude for correspondence analysis. Return structured JSON: `{mismatch_type_match, dimension_match, temporal_match, direction_match, correspondence_strength, hypothesis_candidate}`.
   - Rule-based mode: compare tags — mismatch_type match (0.375), direction match (0.375), temporal match (`|obs_period_a - obs_period_b| <= 1`, 0.25). Sum matching criteria.

3. If correspondence_strength ≥ SHG_CORR_THRESHOLD (0.5):
   - Create signal_connections record (UNIQUE on signal_a_id/signal_b_id — handle conflict gracefully with ON CONFLICT DO NOTHING + re-fetch)
   - Set `is_connected = TRUE` on both signals + create governance signal_events records
   - Set `shg_triggered = FALSE` on the connection initially

4. **Deduplication lock (critical):** Before generating a hypothesis, acquire an advisory lock or use a transaction with SELECT FOR UPDATE on the connection record. Set `shg_triggered = TRUE` WITHIN THE SAME TRANSACTION before calling hypothesis generation. If `shg_triggered` is already TRUE, abort without generating. This prevents double trigger from the background job.

5. If P(independent co-occurrence) < SHG_INDEPENDENCE_THRESHOLD: generate hypothesis.
   - AI: prompt Claude for hypothesis title, description, type, initial_plausibility, evidence_required
   - Rule-based: generate template hypothesis: "Signals from [domain_a] and [domain_b] exhibit [mismatch_type] correspondence in the same observation period. A shared structural source may explain the concurrent deviation."
   - Insert hypothesis with `UNIQUE(connection_id)` — if conflict (duplicate from race), silently ignore.

### 3e. Reasoning (services/reasoning.ts)

`updatePlausibility(hypothesisId, evidenceType, weight)`:
- SUPPORTING: `new_p = current_p + (weight × (1.0 - current_p))`
- CONTRADICTING: `new_p = current_p × (1.0 - weight)`
- CONTEXTUAL: no change
- Clamp to [0.0, 1.0]
- Record in plausibility_history

**No automatic competition set normalisation.** Remove `normaliseCompetitionSet()` from auto-trigger. The normalisation function exists only as a manual endpoint (`POST /api/competition-sets/:id/normalise`) — it is never called automatically.

`checkResolutionConditions(hypothesisId)`: if plausibility ≥ 0.85 or ≤ 0.10, set a flag on the hypothesis (`needs_resolution_review = TRUE` — add this boolean column) and return the flag to the caller. Never auto-resolve.

### 3f. Briefing (services/briefing.ts)

Same as before but with two amendments:
1. Pool status counts: count signals by `lifecycle_status`, PLUS count `is_quarantined = TRUE` and `is_connected = TRUE` as separate counts (governance flags independent of lifecycle status).
2. LP flags since last briefing: use `cases.last_briefing_at` as the cutoff. After generating the briefing, update `cases.last_briefing_at = NOW()`.

### 3g. LP Monitor (services/lp-monitor.ts)

LP-2 is now ENFORCEMENT not observation:
- Before any EXPIRED transition from ADMITTED or RETAINED: check `is_wsp_protected`. If true, return `{permitted: false, lp: 'LP-2', reason: '...'}`. Caller must handle this as a rejected operation.

All other LPs remain observational (flag recorded, transition permitted).

### 3h. Dormancy Check Job (jobs/dormancy-check.ts)

**REPLACES significance-decay.ts** — run WEEKLY (not hourly).

```typescript
// Pseudocode
async function runDormancyCheck() {
  const jobRun = await createJobRun('dormancy-check');
  
  const dormancyDate = new Date(Date.now() - DORMANCY_DAYS * 24 * 60 * 60 * 1000);
  
  // Find signals: RETAINED for > DORMANCY_DAYS, no signal_events since dormancyDate,
  // significance >= 0.40 (still above LP-6 threshold)
  const dormantSignals = await findDormantSignals(dormancyDate);
  
  for (const signal of dormantSignals) {
    const newSig = Math.max(signal.significance - DORMANCY_SIGNIFICANCE_DROP, 0.0);
    await updateSignalSignificance(signal.id, newSig);
    await createSignalEvent(signal.id, {
      from_status: 'RETAINED', to_status: 'RETAINED',
      reason: `Dormancy flag: no activity in ${DORMANCY_DAYS} days`,
      lp_flag: newSig < 0.40 ? 'LP-6' : null,
      job_run_id: jobRun.id
    });
  }
  
  await completeJobRun(jobRun.id, dormantSignals.length);
}
```

---

## Phase 4 — API Routes

Build all routes from CIS_API_SPEC.md PLUS the following new endpoints from CIS_SPEC_AMENDMENTS.md:

**`GET /api/signals/:id`** — full signal with all scores, governance flags, signal_events, connections, contradiction references.

**`GET /api/cases/:id/events`** — paginated signal_events. Params: `signal_id`, `lp_flag`, `from`, `to`, `page=1`, `limit=50`.

**`GET /api/hypotheses/:id/plausibility-history`** — ordered plausibility_history for the hypothesis.

**`GET /api/cases/:id/lp-flags`** — all signal_events with lp_flag IS NOT NULL. Param: `since` (defaults to cases.last_briefing_at).

**`POST /api/competition-sets/:id/normalise`** — investigator-controlled normalisation. Requires `reason` field. Records each change in plausibility_history with reason = `COMPETITION_SET_NORMALISATION: ${reason}`. Returns updated hypotheses in the set.

**`PATCH /api/released-options/:id`** — update `is_active` or clear `flagged_at`. Requires `reason` field. Stores reason in `unflag_reason`.

**`PATCH /api/signals/:id/scores`** — (existing endpoint) MUST now read current scores, write score_change_audit record with before/after values, then update signal. Require `reason` field.

**Score override endpoint changes:**
```typescript
// Before updating scores:
await prisma.scoreChangeAudit.create({
  data: {
    signal_id: signalId,
    case_id: signal.case_id,
    before_si_score: signal.si_score,
    after_si_score: body.si_score,
    // ... all before/after fields
    reason: body.reason  // required
  }
});
```

**Contradiction registration must normalise signal pair ordering:**
```typescript
// Before inserting contradiction:
const [a, b] = [signalAId, signalBId].sort();  // UUID sort
// Always insert with a < b
```

**`GET /api/cases/:id` response** — replace counter fields with computed stats:
```json
{
  "stats": {
    "by_status": {
      "candidate": 12, "admitted": 8, "retained": 45,
      "assessed": 6, "resolved": 11, "archived": 3, "expired": 2
    },
    "quarantined": 3,
    "connected": 7,
    "wsp_protected": 15
  }
}
```

### Transaction requirements

Signal submission (`POST /api/cases/:id/signals`) must be fully transactional:
```typescript
await prisma.$transaction(async (tx) => {
  const signal = await tx.signals.create(...);
  await tx.signalEvents.create(...);  // CANDIDATE created
  const admission = evaluateAdmission(signal);
  await tx.admissionAudit.create(...);
  if (admission.admitted) {
    await tx.signals.update({ lifecycle_status: 'ADMITTED', is_wsp_protected: true, ... });
    await tx.signalEvents.create(...);  // ADMITTED transition
    if (admission.retained) {
      await tx.signals.update({ lifecycle_status: 'RETAINED', ... });
      await tx.signalEvents.create(...);  // RETAINED transition
    }
  }
  return { signal, admission };
});
// SHG runs AFTER the transaction commits (outside the tx)
await shgService.checkConnections(signal.id);
```

---

## Phase 5 — Background Jobs

Three jobs:

**analytics-refresh.ts:** Hourly. Calls `refresh_analytics()` SQL function. Job uses the updated function which records in job_runs.

**shg-trigger.ts:** Every 5 minutes. Checks `signal_connections WHERE shg_triggered = FALSE`. For each, attempts hypothesis generation with advisory lock pattern. Records in job_runs.

**dormancy-check.ts:** Weekly (replaces significance-decay.ts). Logic as specified in Phase 3h above.

Remove: `significance-decay.ts` — do not build this.

All jobs: create job_runs record at start, update at completion or failure.

---

## Phase 6 — Frontend

Build all pages from CIS_UI_SPEC.md with these amendments from CIS_SPEC_AMENDMENTS.md:

**Signal Intake page:**
- When `SHG_MODE !== 'AI'` (or no API key detected): show tag selector fields:
  - Mismatch Type: RATE | DIRECTION | RELATIONSHIP | CONFIGURATION (optional select)
  - Deviation Direction: UP | DOWN | DIVERGING | CONVERGING | STABLE (optional select)
  - Show helper text: "Tag signals to enable cross-domain synthesis."
- When AI mode: show same selectors with label "AI will infer — override if needed."
- Remove the "live SI preview as you type" — this causes excessive API calls. Replace with: "PREVIEW SI SCORE" button that triggers one call on demand.

**Hypothesis Board:**
- Remove automatic normalisation from UI
- Add competition set warning banner: if `competition_set_sum > 1.0`, show amber banner: "These competing hypotheses sum to X% — they are assumed mutually exclusive. Submit evidence or [NORMALISE MANUALLY] when ready."
- NORMALISE button opens a modal explaining what normalisation does ("This will scale all hypothesis plausibilities proportionally so they sum to 100%. This action is recorded. Only do this when you are confident these hypotheses are mutually exclusive."), requires confirmation.

**Plausibility history chart:**
- Data source: `GET /api/hypotheses/:id/plausibility-history`
- Render as a simple line chart (use recharts or similar)
- X-axis: recorded_at timestamps
- Y-axis: plausibility 0.0–1.0
- Threshold lines at 0.10 (falsification) and 0.85 (confirmation)
- Tooltip on each point: plausibility value + reason text

**Dashboard — case setup checklist:**
```
If domain_count < 2 OR independence_declarations < 1:
  Show checklist ABOVE dashboard panels:
  □ Step 1: Add domains          [GO →]
  □ Step 2: Declare independence [GO →]
  □ Step 3: Submit first signal  [GO →]
  "SHG cross-domain synthesis will not run until two domains with an independence 
   declaration exist."
  Checklist disappears automatically when all three complete. Cannot be dismissed manually.
```

**LP flags on Dashboard:**
- Label: "LP flags since last briefing" with timestamp of last briefing
- Query: `GET /api/cases/:id/lp-flags` with `since = cases.last_briefing_at`
- If no briefing yet: "LP flags since case creation"

**Signal Pool:**
- Governance flags visible on each signal card: show is_quarantined (red 🔒), is_connected (amber 🔗), is_wsp_protected (blue 🛡) badges
- These are independent of the lifecycle status badge

**Competition set visualisation:**
- Horizontal bars per hypothesis, labeled with title and plausibility %
- Warning banner if sum > 1.0
- NORMALISE button if investigator is on this view

---

## Phase 7 — Production Hardening

Standard requirements plus:
- All background jobs: catch exceptions, update job_runs.status = 'FAILED' on error, do not rethrow (jobs run independently, failures should not crash the process)
- Contradiction normalisation: always sort signal IDs before inserting (a < b UUID ordering) — enforce this in the service layer, not just documentation
- SHG hypothesis generation: wrap entire flow in try/catch; if AI call fails, generate rule-based hypothesis if in AI mode (graceful degradation)
- Score override: `reason` field is required — return 400 if absent

---

## Phase 8 — README

Include:
- What CIS is and what it's for
- The four AP-v1 constructs implemented: SI, HCL, CR, WSP
- How to run locally
- How to deploy
- Two operating modes: AI mode (with API key) and Rule-based mode (with signal tagging)
- What data is collected (anonymous aggregate) and what is not (no personal data)
- Link to /analytics

---

## Critical Requirements

**Governance flag enforcement is not optional.** `is_wsp_protected = TRUE` means the EXPIRED transition FAILS, not just gets flagged. `is_quarantined = TRUE` means RESOLVED and EXPIRED transitions FAIL. The sls.ts service returns a typed error for these cases that the route handler surfaces to the API caller.

**SHG deduplication is mandatory.** The advisory lock pattern or SELECT FOR UPDATE must prevent duplicate hypotheses for the same connection. Never generate two hypotheses for the same `connection_id`.

**No automatic competition set normalisation.** Under no circumstances should a plausibility update on Hypothesis A cause an automatic plausibility change on Hypothesis B. Competition sets are display relationships only.

**Every score change is audited.** `PATCH /api/signals/:id/scores` creates a score_change_audit record with before/after values. This cannot be skipped.

**Dormancy check, not decay.** Do not build a continuous significance decay job. Build the weekly dormancy-check job as specified. Any significance change must be recorded in a signal_events record with the job_run_id.

**LP-2 is enforcement.** The WSP minimum retention check in sls.ts returns a rejected-transition response, not just a flag. The API surfaces this as a 409 with code `WSP_PROTECTION_ACTIVE`.

---

## Success Definition

An investigator opens the tool. They add two domains and declare them independent. They submit a signal from Domain A — it scores SI 0.72, significance 0.68, status RETAINED, is_wsp_protected = TRUE. They submit a signal from Domain B with the same mismatch type and observation period — the system detects correspondence (strength 0.75), marks both is_connected = TRUE, generates an HCL hypothesis. The investigator submits supporting evidence — plausibility rises to 0.72. They try to expire the Domain A signal — the system rejects with WSP_PROTECTION_ACTIVE. They generate a briefing — it shows: 2 retained signals (both connected), 1 active HCL hypothesis at 0.72 plausibility, 0 quarantined, 0 LP flags. The audit trail records every step. That is the system working correctly.
