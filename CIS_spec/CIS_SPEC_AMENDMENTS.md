# CIS Specification Amendments v1.0

**Date:** 2026-06-02  
**Authority:** CIS_FULL_SPEC_AUDIT.md  
**Applies to:** All CIS specification documents  
**Status:** OPERATIVE — supersedes conflicting content in base specifications

These amendments address all six blocking issues and eight significant findings from the audit. Each amendment references the spec file it modifies and states precisely what changes.

---

## BLOCKING ISSUE 1 — Significance Decay Redesign

**Audit finding:** The 0.02/hour decay formula causes every retained signal to fall below the LP-6 threshold within ~60 hours of admission. This generates unmanageable reassessment demand and causes investigator abandonment within days of adoption.

**Affects:** CIS_SYSTEM_ARCHITECTURE.md (services/significance-decay.ts, jobs/), CIS_CLAUDE_CODE_PROMPT.md (Phase 3, Phase 5 — background jobs)

### Amendment

**Remove:** The `significance-decay.ts` cron job as specified (hourly decay of 0.02 on all retained signals older than 48 hours).

**Replace with two mechanisms:**

**Mechanism A — Evidence-triggered significance update:**  
Called within the evidence submission pipeline (when evidence is submitted to a hypothesis that references this signal, or when a signal in the same domain is submitted that competes with or corroborates this one). Significance is recomputed from the six NL4-B criteria using current values. This is not decay — it is a recalculation triggered by new information.

**Mechanism B — Dormancy maintenance job (weekly, not hourly):**  
Job name: `dormancy-check.ts`  
Schedule: Weekly (every 7 days)  
Condition: Signal has been in RETAINED state for > 30 days AND no evidence referencing this signal has been submitted AND no new signals from the same domain in the same observation window have been submitted  
Action: Reduce significance by 0.05 (one-time, not accumulating per run) AND create a signal_event with to_state = 'RETAINED', reason = 'DORMANCY_FLAG', lp_flag = 'LP-6'  
This flags genuinely dormant signals without imposing continuous reassessment pressure.

**LP-6 threshold:** Flag when significance falls below 0.40 (revised from 0.30) after the dormancy condition is met.

**NL4-B persistence scoring revision:**  
Replace: `sig_persistence = (observation_period / 10).clamp(0,1)`  
With: `sig_persistence = min(signal_event_count / 5, 1.0)` — where signal_event_count is the count of signal_events records for this signal. More lifecycle events = more persistent engagement = higher persistence score. This is dynamic and reflects actual investigation activity.

---

## BLOCKING ISSUE 2 — SHG Architecture Clarification

**Audit finding:** SHG correspondence detection ("do both signals indicate the same type of structural incongruence?") is not computable without AI and has no specified rule-based fallback.

**Affects:** CIS_SYSTEM_ARCHITECTURE.md (services/shg.ts), CIS_DATABASE_SCHEMA.sql (signals table), CIS_API_SPEC.md (signal submission), CIS_UI_SPEC.md (Signal Intake), CIS_CLAUDE_CODE_PROMPT.md

### Amendment

**Declare two explicit SHG operating modes:**

**AI mode** (ANTHROPIC_API_KEY present):  
SHG calls Claude to analyse two signal content strings and determine:
1. mismatch_type correspondence (RATE | DIRECTION | RELATIONSHIP | CONFIGURATION | NONE)
2. dimension correspondence (same SI dimension affected)
3. temporal correspondence (same observation period ±1)
4. direction correspondence (same deviation direction)

Claude returns a structured JSON response with correspondence_strength (0.0–1.0) and a hypothesis candidate if strength ≥ 0.5.

**Rule-based mode** (no ANTHROPIC_API_KEY):  
Investigators explicitly tag signals at submission. SHG uses these tags for correspondence detection.

**Add to signals table (database amendment):**
```sql
ALTER TABLE signals ADD COLUMN mismatch_type TEXT 
    CHECK (mismatch_type IN ('RATE','DIRECTION','RELATIONSHIP','CONFIGURATION') OR mismatch_type IS NULL);
ALTER TABLE signals ADD COLUMN deviation_direction TEXT 
    CHECK (deviation_direction IN ('UP','DOWN','DIVERGING','CONVERGING','STABLE') OR deviation_direction IS NULL);
ALTER TABLE signals ADD COLUMN shg_mode TEXT NOT NULL DEFAULT 'PENDING'
    CHECK (shg_mode IN ('PENDING','AI_SCORED','RULE_TAGGED','EXCLUDED'));
```

**Add to signal submission API (optional fields):**
```json
{
  "content": "...",
  "domain_id": "uuid",
  "observation_period": 2,
  "mismatch_type": "RATE",          // optional — required in rule-based mode
  "deviation_direction": "UP"       // optional — required in rule-based mode
}
```

**Rule-based SHG correspondence detection:**  
Two signals correspond if ALL of the following that are present match:
- `mismatch_type` matches (if both tagged)
- `deviation_direction` matches (if both tagged)
- `observation_period` within ±1

Correspondence_strength in rule-based mode:
- Both mismatch_type and direction match: 0.75
- Only mismatch_type matches: 0.50
- Only direction matches: 0.25
- Neither (or untagged): 0.0 (signal excluded from rule-based SHG)

**Add to Signal Intake UI:**  
When ANTHROPIC_API_KEY is NOT set, show tag selectors:
- Mismatch type: RATE | DIRECTION | RELATIONSHIP | CONFIGURATION (optional but encouraged)
- Deviation direction: UP | DOWN | DIVERGING | CONVERGING | STABLE (optional)
- Display: "AI mode is disabled. Tag signals to enable cross-domain synthesis."

When ANTHROPIC_API_KEY IS set, these selectors are shown as "AI will infer — override if needed."

**SHG deduplication fix:**  
Add to hypotheses table: `UNIQUE(connection_id)` where connection_id IS NOT NULL.  
In shg.ts: Before generating a hypothesis, check if one already exists for this connection_id. If yes, skip generation. Set `shg_triggered = true` on the connection BEFORE calling the generation function, within the same transaction, so the background job cannot trigger for the same connection concurrently.

---

## BLOCKING ISSUE 3 — Evidence Integrity

**Audit finding:** No UNIQUE constraint on `(hypothesis_id, signal_id)` in hypothesis_evidence enables a single signal to be submitted as evidence multiple times, generating manufactured certainty. Score overrides leave no audit trail.

**Affects:** CIS_DATABASE_SCHEMA.sql, CIS_API_SPEC.md

### Amendment

**Add to hypothesis_evidence:**
```sql
ALTER TABLE hypothesis_evidence 
    ADD CONSTRAINT uq_hypothesis_signal UNIQUE (hypothesis_id, signal_id);
```

**Note:** This allows a signal to be used as evidence in multiple hypotheses (different hypothesis_id) but prevents the same signal from being submitted twice for the same hypothesis.

**Add score_change_audit table:**
```sql
CREATE TABLE score_change_audit (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    signal_id       UUID NOT NULL REFERENCES signals(id),
    case_id         UUID NOT NULL REFERENCES cases(id),
    changed_by      TEXT NOT NULL DEFAULT 'INVESTIGATOR',
    before_si_score        NUMERIC(4,3),
    after_si_score         NUMERIC(4,3),
    before_si_rate         NUMERIC(4,3),
    after_si_rate          NUMERIC(4,3),
    before_si_direction    NUMERIC(4,3),
    after_si_direction     NUMERIC(4,3),
    before_si_relationship NUMERIC(4,3),
    after_si_relationship  NUMERIC(4,3),
    before_si_configuration NUMERIC(4,3),
    after_si_configuration  NUMERIC(4,3),
    before_significance    NUMERIC(4,3),
    after_significance     NUMERIC(4,3),
    reason          TEXT NOT NULL,
    changed_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_score_audit_signal ON score_change_audit(signal_id);
CREATE INDEX idx_score_audit_case ON score_change_audit(case_id);
```

**`PATCH /api/signals/:id/scores` amendment:**  
Before updating: read current scores, insert record into score_change_audit with before/after values. Require `reason` field in request body.

**Add evidence uniqueness error to API spec:**  
`POST /api/hypotheses/:id/evidence` — if signal_id is already used as evidence for this hypothesis, return 409 CONFLICT with code `EVIDENCE_ALREADY_SUBMITTED`.

---

## BLOCKING ISSUE 4 — State Machine Concurrent States

**Audit finding:** QUARANTINED is a lifecycle state that prevents CONNECTED. Signals that need both CR quarantine governance and HCL cross-domain synthesis simultaneously are blocked. The state machine cannot represent multiple concurrent governance constraints.

**Affects:** CIS_DATABASE_SCHEMA.sql (signals table), CIS_SYSTEM_ARCHITECTURE.md (sls.ts), CIS_CLAUDE_CODE_PROMPT.md

### Amendment

**Remove QUARANTINED from the lifecycle status enum.** Quarantine is a governance constraint, not a lifecycle position.

**Remove ELEVATED from the lifecycle status enum.** Elevation is handled by is_connected flag below.

**Revised lifecycle status enum:**
```
CANDIDATE | ADMITTED | RETAINED | ASSESSED | RESOLVED | ARCHIVED | EXPIRED
```

**Add three governance flag columns to signals:**
```sql
ALTER TABLE signals ADD COLUMN is_quarantined BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE signals ADD COLUMN is_connected    BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE signals ADD COLUMN is_wsp_protected BOOLEAN NOT NULL DEFAULT FALSE;
```

**Governance flag rules (enforced in sls.ts):**

`is_quarantined = TRUE` blocks:
- RETAINED → RESOLVED transition
- RETAINED → EXPIRED transition
- ADMITTED → EXPIRED transition
Quarantine is set when a contradiction is registered. Quarantine is cleared when the contradiction is resolved via RC-1, RC-2, or RC-3.

`is_connected = TRUE` indicates:
- Signal has a cross-domain connection and is eligible for SHG
- Does not block any transitions
- Cleared if all connections for this signal are resolved/archived

`is_wsp_protected = TRUE` blocks:
- ADMITTED → EXPIRED transition (minimum retention — 2 observation periods)
- RETAINED → EXPIRED transition (minimum retention)
Set at admission. Cleared after minimum retention period has passed.

**LP-2 enforcement (previously observational only):**  
sls.ts checks `is_wsp_protected` before permitting any EXPIRED transition. If TRUE, the transition is REJECTED (returns an error), not merely flagged. LP-2 can no longer fire silently.

**Update signal_events to reflect flag changes:**  
Add `governance_change TEXT` field to signal_events — records when a governance flag is toggled: `"is_quarantined: FALSE → TRUE"`, etc.

**Database migration:**  
Update all existing QUARANTINED signals: set `lifecycle_status = 'RETAINED'`, `is_quarantined = TRUE`.
Update all existing CONNECTED signals: set `lifecycle_status = 'RETAINED'`, `is_connected = TRUE`.
Update all existing ELEVATED signals: set `lifecycle_status = 'ASSESSED'`.

---

## BLOCKING ISSUE 5 — LD and FA Scope

**Audit finding:** LD and FA are promised in the product spec as AP-v1 constructs but have no implementation anywhere in the system.

**Affects:** CIS_PRODUCT_SPEC.md

### Amendment

**Replace in CIS_PRODUCT_SPEC.md, Section "Core Concepts" / AP-v1 constructs listing:**

Remove: LD and FA from the list of implemented AP-v1 constructs.

**Add to "What It Does Not Do":**

> CIS v1 implements four of the seven AP-v1 analytical constructs: SI (Structural Incongruence detection and scoring), HCL (Hidden Common Link hypothesis generation), CR (Contradiction Retention governance), and WSP (Weak Signal Preservation). The remaining three constructs — LD (Load Displacement), FA (Fragility Accumulation), and CDA (Cross-Domain Admission governance) — are defined in the theoretical framework and will be incorporated in subsequent versions. The domain independence and signal connection machinery in CIS v1 supports detection of conditions that CDA would formally govern, but CDA audit records are not produced in this version.

---

## BLOCKING ISSUE 6 — Competition Set Normalisation

**Audit finding:** The normalisation formula (proportionally scale plausibilities when sum > 1.0) mechanically reduces competing hypothesis plausibility based on peer evidence, not on direct evidence. This falsifies hypotheses without RC-1/2/3 — violating the CR governance principle embedded in the same system.

**Affects:** CIS_SYSTEM_ARCHITECTURE.md (services/reasoning.ts), CIS_API_SPEC.md, CIS_UI_SPEC.md

### Amendment

**Remove:** Automatic normalisation on every plausibility update.

**Remove:** The `normaliseCompetitionSet()` function from the reasoning engine auto-trigger.

**Replace with:**

**1. Display-only competition awareness:**  
When retrieving a competition set or any hypothesis within one, include `competition_set_sum` in the response — the sum of all active hypothesis plausibilities in the set. No automatic modification.

**2. Visual warning in UI:**  
When `competition_set_sum > 1.0`, display a warning banner on the Hypothesis Board: "Competing hypotheses sum to [X]% — these hypotheses are considered mutually exclusive. Submit evidence or normalise manually."

**3. Investigator-controlled normalisation (new endpoint):**
```
POST /api/competition-sets/:id/normalise
```
Body: `{ "reason": "Confirmed these hypotheses are mutually exclusive based on [evidence]." }`

This endpoint:
- Computes the current sum of active hypothesis plausibilities in the set
- If sum > 1.0: scales all proportionally so sum = 1.0
- Records each change in plausibility_history with reason = "COMPETITION_SET_NORMALISATION" + the provided reason
- Returns updated hypotheses

Investigators confirm what normalisation means before triggering it.

**4. Plausibility updates are evidence-only:**  
No hypothesis's plausibility changes except through direct evidence submission on THAT hypothesis (`POST /api/hypotheses/:id/evidence`) or investigator-controlled normalisation. No implicit changes from peer hypothesis updates.

---

## SIGNIFICANT FINDING A — Counter Column Concurrency

**Audit finding:** `cases.signal_count`, `hypothesis_count`, `briefing_count` will drift under concurrent writes.

**Affects:** CIS_DATABASE_SCHEMA.sql

### Amendment

**Remove counter columns from cases table:**
```sql
ALTER TABLE cases DROP COLUMN signal_count;
ALTER TABLE cases DROP COLUMN hypothesis_count;
ALTER TABLE cases DROP COLUMN briefing_count;
```

**Replace with computed counts in the API layer.** The Dashboard stats endpoint queries:
```sql
SELECT 
    COUNT(*) FILTER (WHERE status NOT IN ('CANDIDATE','EXPIRED')) as signal_count,
    COUNT(*) FROM hypotheses WHERE case_id = $1 as hypothesis_count
FROM signals WHERE case_id = $1
```

Add to `GET /api/cases/:id` response: computed `stats` object with signal counts by status. With indexes on `(case_id, status)` and `(case_id, lifecycle_status)`, these queries are fast at operational scale (< 100K signals per case).

---

## SIGNIFICANT FINDING B — Missing API Endpoints

**Affects:** CIS_API_SPEC.md

### Add the following endpoints:

**`GET /api/signals/:id`**  
Returns: full signal object with all scores, all governance flags, full signal_events log, any connections, any contradiction references.

**`GET /api/cases/:id/events`**  
Returns: paginated signal_events for all signals in the case. Query params: `signal_id`, `lp_flag`, `from`, `to`, `page`, `limit`.

**`GET /api/hypotheses/:id/plausibility-history`**  
Returns: ordered array of plausibility_history records for the hypothesis. Used to populate the plausibility history chart.

**`GET /api/cases/:id/lp-flags`**  
Returns: all signal_events where `lp_flag IS NOT NULL`, ordered by created_at desc. Query params: `since` (ISO timestamp), `lp_code` (LP-1 through LP-7).

**`POST /api/competition-sets/:id/normalise`**  
See Amendment 6 above.

**`PATCH /api/released-options/:id`**  
Body: `{ "is_active": false, "unflag_reason": "..." }` — allows deactivating a released option or removing a match flag that was incorrect. Reason is required and stored.

---

## SIGNIFICANT FINDING C — Independence Matrix and Background Job Auditing

**Affects:** CIS_DATABASE_SCHEMA.sql

### Amendment

**Add domain_independence_history table:**
```sql
CREATE TABLE domain_independence_history (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_a_id         UUID NOT NULL REFERENCES domains(id),
    domain_b_id         UUID NOT NULL REFERENCES domains(id),
    before_independent  BOOLEAN,
    after_independent   BOOLEAN NOT NULL,
    change_reason       TEXT,
    changed_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Every change to domain_independence creates a history record. When independence changes after hypotheses have been generated, a flag is added to any existing hypotheses that used this domain pair: `ADD COLUMN independence_basis_changed BOOLEAN NOT NULL DEFAULT FALSE` on hypotheses.

**Add job_runs table:**
```sql
CREATE TABLE job_runs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_name        TEXT NOT NULL,
    started_at      TIMESTAMPTZ NOT NULL,
    completed_at    TIMESTAMPTZ,
    records_affected INT,
    status          TEXT NOT NULL DEFAULT 'RUNNING',
    error_message   TEXT,
    CHECK (status IN ('RUNNING','COMPLETED','FAILED'))
);
CREATE INDEX idx_job_runs_name ON job_runs(job_name, started_at DESC);
```

Every background job creates a job_runs record at start and updates it at completion. This provides attribution for background-generated state changes.

---

## SIGNIFICANT FINDING D — Missing Database Constraints

**Affects:** CIS_DATABASE_SCHEMA.sql

### Amendments

```sql
-- Contradictions: prevent self-contradiction and duplicate pairs
ALTER TABLE contradictions 
    ADD CONSTRAINT no_self_contradiction CHECK (signal_a_id != signal_b_id);

-- Normalize contradiction pairs: always store with a < b (UUID ordering)
-- Enforce via trigger or application logic — add comment to schema

-- Released options: prevent duplicate text within a case
ALTER TABLE released_options 
    ADD CONSTRAINT uq_released_text UNIQUE (case_id, text);
-- Note: case-insensitive uniqueness requires expression index:
CREATE UNIQUE INDEX uq_released_text_ci ON released_options (case_id, LOWER(text));
DROP CONSTRAINT uq_released_text; -- remove the case-sensitive one

-- Hypotheses: one hypothesis per connection
ALTER TABLE hypotheses 
    ADD CONSTRAINT uq_hypothesis_connection UNIQUE (connection_id);
-- Note: connection_id is nullable; UNIQUE allows multiple NULLs in PostgreSQL

-- Signals: score range enforcement
ALTER TABLE signals 
    ADD CONSTRAINT si_score_range CHECK (si_score IS NULL OR si_score BETWEEN 0.0 AND 1.0),
    ADD CONSTRAINT significance_range CHECK (significance IS NULL OR significance BETWEEN 0.0 AND 1.0);

-- Add unflag_reason to released_options
ALTER TABLE released_options ADD COLUMN unflag_reason TEXT;
```

---

## SIGNIFICANT FINDING E — sig_relevance Feedback Loop Dampening

**Affects:** CIS_SYSTEM_ARCHITECTURE.md (services/significance.ts), CIS_CLAUDE_CODE_PROMPT.md

### Amendment

**Revise sig_relevance calculation:**  
Replace: `sig_relevance = count of active hypotheses this signal could connect to / 5`  
With: `sig_relevance = min(count of ACTIVE hypotheses where this signal is directly referenced as evidence / 3, 0.20)`

This change:
1. Caps sig_relevance contribution at 0.20 (vs. current maximum 1.0) — dampens the feedback loop
2. Counts only hypotheses where the signal is explicitly used as evidence (not just "could connect to") — requires investigator action to raise relevance
3. Prevents investigator-created hypotheses from automatically inflating all connected signal scores

---

## SIGNIFICANT FINDING F — Guided Workflow for New Cases

**Affects:** CIS_UI_SPEC.md (Dashboard), CIS_CLAUDE_CODE_PROMPT.md

### Amendment

**Add case setup checklist to Dashboard:**  
For cases with `domain_count < 2` OR `independence_declarations < 1`, show a setup checklist above the main dashboard panels:

```
CASE SETUP
□ Step 1: Add at least two domains   [GO TO DOMAIN MANAGER]
□ Step 2: Declare domain independence  [GO TO DOMAIN MANAGER]
□ Step 3: Submit your first signal   [GO TO SIGNAL INTAKE]

SHG cross-domain synthesis will not run until at least two domains 
with an independence declaration exist.
```

Checklist is dismissed automatically when all three steps are complete. It cannot be manually dismissed.

---

## SIGNIFICANT FINDING G — LP "Session" Definition

**Affects:** CIS_UI_SPEC.md (Dashboard), CIS_API_SPEC.md

### Amendment

**Define "session" as: since the last generated briefing.**

Add to cases table: `last_briefing_at TIMESTAMPTZ` — updated each time a briefing is generated.

Dashboard "LP flags from this session" = LP flags from `signal_events` where `created_at > cases.last_briefing_at`. If `last_briefing_at IS NULL`: since case creation.

`GET /api/cases/:id/lp-flags` accepts `since` parameter defaulting to `cases.last_briefing_at`.

Display on Dashboard: "LP flags since last briefing [timestamp]" with the briefing timestamp visible.

---

## Amendment Summary — What Changes Where

| Document | Sections changed |
|----------|-----------------|
| CIS_PRODUCT_SPEC.md | Remove LD/FA from AP-v1 list; add scope statement (Finding 5) |
| CIS_SYSTEM_ARCHITECTURE.md | Replace significance-decay job; revise shg.ts deduplication; revise reasoning.ts normalisation; add dormancy-check.ts; add job_runs logging |
| CIS_DATABASE_SCHEMA.sql | All schema changes — see CIS_DATABASE_SCHEMA_v2.sql |
| CIS_API_SPEC.md | 6 new endpoints; evidence 409 error; score override audit requirement; normalise endpoint |
| CIS_UI_SPEC.md | Signal Intake tags in rule-based mode; competition set display-only warning; case setup checklist; LP session definition |
| CIS_CLAUDE_CODE_PROMPT.md | All phases updated — see CIS_CLAUDE_CODE_PROMPT_v2.md |

---

*CIS Specification Amendments v1.0 | 2026-06-02 | All six blocking issues resolved | Eight significant findings addressed*
