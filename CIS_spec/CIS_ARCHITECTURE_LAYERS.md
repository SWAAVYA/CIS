# CIS Architecture — Three Layers

**Document type:** Architectural reference  
**Status:** Operative  
**Date:** 2026-06-02  
**Location:** `docs/CIS_ARCHITECTURE_LAYERS.md`

---

## What CIS Claims to Do

Most investigation systems are built to answer one question: *what happened?*

CIS is built to answer two: *what happened* and *how did we reason about it?*

The second question is only answerable because of the telemetry layer. The telemetry layer is only trustworthy because of specific design choices made in the operational layer — choices that were made for operational governance reasons, not for telemetry reasons. That is what makes the architecture healthy. The telemetry is a byproduct of good operational design, not an instrumented afterthought.

---

## Layer 1 — Operational

**Purpose:** Help the system reason about reality.

**Constructs:** SI, HCL, CR, WSP, SLS, SHG, Reasoning, Briefing

**The question this layer answers:** What happened? What does the evidence mean?

**Outputs:** Signal Pool, Hypotheses, Contradiction Ledger, Cognitive Briefings

**Version:** v1 — build and validate now

**What each construct does:**

| Construct | Function |
|-----------|----------|
| SI | Scores structural incongruence of observations at admission, prior-independent |
| HCL | Detects hidden common causes across independent domains |
| CR | Governs contradiction — quarantine, retention, typed resolution |
| WSP | Preserves sub-threshold signals through minimum retention periods |
| SLS | Manages signal lifecycle state transitions with hard enforcement |
| SHG | Generates structural hypotheses from cross-domain signal correspondence |
| Reasoning | Updates hypothesis plausibility from evidence; manages competition sets |
| Briefing | Assembles epistemic state of the investigation at a point in time |

**What this layer does not do:** It does not monitor whether the system's own reasoning behavior is changing over time. That is Layer 3's function.

---

## Layer 2 — Telemetry

**Purpose:** Preserve evidence of how the system reasoned.

**Records:**

| Record | Table | What it captures |
|--------|-------|-----------------|
| Admission Audit | `admission_audit` | Every admission decision: SI score, significance score, thresholds at time of decision |
| Plausibility History | `plausibility_history` | Every plausibility update: before, after, evidence reference, reason |
| Signal Events | `signal_events` | Every lifecycle transition: from state, to state, reason, LP flag, governance change |
| Contradiction History | `contradictions` | Every contradiction: registered, quarantined, resolved, RC type, resolution basis |
| Score Change Audit | `score_change_audit` | Every investigator score override: before and after values, reason |
| Resolution Pathways | `contradictions.resolution_type` | RC-1 / RC-2 / RC-3 distribution over investigation lifetime |
| Job Runs | `job_runs` | Every background job execution: records affected, status, attribution |

**The question this layer answers:** How did we handle what we found?

**Output:** The telemetry corpus — a record of investigative cognition across cases at scale.

**Version:** v1 byproduct. Emerges from operational layer design. Not instrumented separately. Not optional.

### Critical properties of the telemetry layer

These properties are what make Layer 3 possible. They were not designed for Layer 3.

**Admission scores are prior-independent.** SI scores and significance scores are computed from signal content at submission, before the hypothesis structure has seen the signal. The `admission_audit` record captures these scores at decision time. This means the weight-at-admission measure cannot be contaminated by hypothesis context — it reflects structural signal properties only.

**Plausibility history is append-only.** No plausibility record is modified after creation. Hypothesis evolution is fully reconstructable from the ordered history. Post-hoc revision is architecturally impossible.

**Resolution type is mechanically typed.** Every contradiction resolution carries an RC-1, RC-2, or RC-3 type. The type is stored. This makes contradiction closure mechanically distinguishable — not just that a contradiction was resolved, but on what structural basis.

**Signal events capture governance changes separately from lifecycle transitions.** The `governance_change` field records flag toggles (quarantine set/cleared, WSP cleared) independently of lifecycle status changes. Governance history and lifecycle history are independently reconstructable.

Without these four properties, the Layer 3 measurements described below would be corrupted at the source.

---

## Layer 3 — Meta-Governance

**Purpose:** Help the system reason about itself.

**The question this layer answers:** Is the system's reasoning behavior changing? Is confidence becoming causally dominant over evidence in contradiction processing?

**Version:** v2+ — requires Layer 2 corpus to calibrate. Do not implement in v1.

**Candidates:**

| Candidate | What it monitors |
|-----------|-----------------|
| PDI (Prior Dominance Index) | Whether contradiction influence decreases as hypothesis confidence rises |
| Epistemic Capture Detection | Whether the system has entered a regime where confidence drives contradiction resolution |
| Competition Collapse Monitoring | Whether competition sets are losing vitality as dominant hypothesis plausibility rises |
| Contradiction Influence Analysis | Distribution of plausibility movement per contradiction, controlled for evidence weight |
| Investigation State Monitoring | Longitudinal tracking of all five metrics across case lifetime |

### The key distinction

Layer 1 inspects evidence.  
Layer 2 records decisions.  
Layer 3 inspects the pattern of decisions over time — within investigations and across them.

This is a different architectural layer, not a stronger version of Layer 1. HCL, SI, and CR ask: *what happened to the evidence?* Layer 3 asks: *what happened to the system processing the evidence?*

### The failure mode Layer 3 is designed to detect

**Prior Dominance:** A condition in which hypothesis confidence becomes a stronger determinant of contradiction resolution than contradiction evidence itself.

This is distinct from healthy convergence. A mature investigation should become harder to move as evidence accumulates — that is correct Bayesian behavior. Prior Dominance is not rapid contradiction resolution. It is contradiction resolution that is *faster than the evidence warrants*, where the shortfall is explained by confidence level rather than evidence quality.

**Why process metrics alone cannot detect this:**

```
100 contradicting signals admitted     ← looks healthy
99 rapidly resolved                    ← may not be healthy
 1 retained

vs.

100 contradicting signals admitted
40 rapidly resolved (weak evidence)    ← correct
59 slowly resolved (strong evidence)   ← correct
 1 retained (strongest evidence)       ← correct
```

These produce identical process metrics. The difference is only visible when resolution speed is compared against independent evidence weight. Layer 2 preserves the independent evidence weight (admission-time SI and significance scores). Layer 3 uses that baseline to make the comparison.

### The PDI measurement approach

**Relative PDI** (computable within a single case, no cross-case calibration required):

```
relative_discount(contradiction_t) = 
  [plausibility_delta(t) / significance(t)]
  ─────────────────────────────────────────────────────
  mean([plausibility_delta / significance] for all prior
  contradictions in this case)
```

If `relative_discount` falls as dominant hypothesis plausibility rises, within the same investigation, the capture signature is present without requiring cross-case calibration.

**Calibrated PDI** (requires 50+ completed cases):

```
discount_ratio = actual_plausibility_delta / expected_plausibility_delta(SI, significance)
```

Where `expected_plausibility_delta` is learned from the empirical distribution of contradiction influence across the case corpus, stratified by evidence weight and hypothesis confidence at time of contradiction.

### Validation requirement

Layer 3 candidates must demonstrate:

1. **Predictive value beyond process metrics alone.** PDI must identify capture conditions that contradiction counts, retention times, and RC-type distributions do not.

2. **Distinction between capture and convergence.** The metric must correctly classify healthy convergence (evidence-driven plausibility increase) as distinct from Prior Dominance (confidence-driven contradiction suppression). False positives on healthy convergence make the construct operationally useless.

3. **Failures missed by Layers 1 and 2.** If SI, HCL, and CR functioning correctly are sufficient to prevent the failure mode, Layer 3 adds governance overhead without value. It must catch cases where all three are functioning and the investigation still becomes progressively resistant to evidence.

### Precondition (non-negotiable)

Layer 1 operational governance must be functioning correctly before Layer 3 measurements are valid. Specifically:

- SI scoring must be prior-independent. If the scorer incorporates hypothesis context, admission-time weight is corrupted.
- Admission audit must be complete. Selective admission of convenient signals corrupts the evidence weight baseline.
- Plausibility history must be append-only. Post-hoc revision makes the trajectory unreconstructable.

These are properties CIS enforces by design. They are the precondition, not the byproduct, of Layer 3 capability.

---

## The Three-Layer Dependency

```
LAYER 1 — OPERATIONAL
Signal Pool, SI, HCL, CR, WSP, SLS, SHG, Reasoning, Briefing
↓
generates
↓
LAYER 2 — TELEMETRY
Admission Audit, Plausibility History, Contradiction History,
Resolution Pathways, Signal Events, Score Change Audit
↓
enables
↓
LAYER 3 — META-GOVERNANCE
PDI, Epistemic Capture Detection, Investigation State Monitoring,
Competition Collapse Monitoring, Contradiction Influence Analysis
```

The mistake most systems make is attempting to build Layer 3 before Layer 2 has produced enough data to calibrate it. This produces speculative scoring, invented thresholds, and synthetic confidence. The result is a meta-governance layer that appears to function but cannot be validated.

CIS does the opposite: collect evidence faithfully, generate telemetry as a byproduct of correct operational design, learn distributions from observed behavior, build monitoring from empirical baselines.

---

## The Hard-Won Discipline

**v1 does not implement PDI.**  
**v1 generates the data that makes PDI calibratable.**

Layer 3 stays off the critical path until Layer 2 has produced enough evidence — across enough real investigations — to distinguish signal from noise in investigation-state monitoring.

That is not a limitation. That is the architecture working correctly.

---

## Roadmap

| Layer | Status | Next decision point |
|-------|--------|---------------------|
| Layer 1 — Operational | Build and validate — v1 | 28/28 invariant tests passing |
| Layer 2 — Telemetry | Active — v1 byproduct | Continuous |
| Layer 3 — Meta-Governance | Research candidate | After 50 completed investigations with full telemetry records |

**Layer 3 classification:** Architecturally serious. Empirically premature.

**Layer 3 entry condition:** 50+ completed investigations with complete admission audit records, plausibility histories, and contradiction resolution records. At that point, calibrate the expected_delta model empirically, test whether relative PDI behaves as predicted under high-confidence conditions, and determine whether the construct catches failures that Layers 1 and 2 miss.

If it does: implement.  
If it does not: the telemetry corpus still exists and will likely surface other derivable constructs that were not anticipated at design time.

---

## The Asset

If CIS succeeds operationally, the most valuable long-term asset may not be the constructs.

It may be the telemetry corpus.

After 50, 100, 500 investigations, the system will have preserved:

- Evidence weight at admission, prior-independent
- Hypothesis evolution, fully reconstructable
- Contradiction handling, mechanically typed
- Closure decisions, auditable
- Reopening events, timestamped

Most investigation systems preserve: evidence existed, decision made.

CIS preserves: evidence entered, weight at admission, hypothesis state at admission, plausibility trajectory, resolution path.

That is an unusually rich dataset for studying how evidence-processing systems actually behave under real investigative conditions. PDI is one thing derivable from it. There will be others that are not yet visible.

The telemetry corpus is the asset. Everything else follows from it.

---

*CIS_ARCHITECTURE_LAYERS.md | 2026-06-02 | docs/ folder*

---

## Addendum — Assumption Vulnerability Analysis (AVA)

**Date added:** 2026-06-02  
**Status:** Layer 3 candidate — architecturally specifiable, empirically premature

---

### The problem with PDI alone

PDI produces a rate signal: contradiction influence is declining relative to evidence weight. This is correct but generates a weak alert:

> *Warning: you may be overconfident.*

Investigators will immediately ask: why? And if the answer is "contradiction influence is declining," that is interesting but not actionable. It tells the investigator that something is wrong with the investigation's behavior. It does not tell them where the hypothesis is vulnerable or why the declining influence matters structurally.

The alert is abstract. Abstract alerts do not change investigator behavior.

---

### The stronger version

The actionable alert is not about the investigation's behavior in aggregate. It is about the intersection of two specific conditions:

1. **Where the dominant hypothesis is structurally vulnerable** — which of its supporting assumptions, if challenged, would most reduce plausibility, and which of those are weakly corroborated
2. **Whether dismissed contradictions are targeting those specific vulnerable points** — not contradictions in general, but contradictions aimed at the load-bearing, weakly-supported parts

The combined alert:

```
STATE CAPTURE RISK
─────────────────────────────────────────────────────────────

Dominant hypothesis:     H-03
Current plausibility:    0.87
Contradiction influence: Down 62% relative to earlier case phase

STRUCTURAL VULNERABILITY

H-03 currently depends on three supporting evidence items.
Two of them account for 68% of total plausibility movement.
Both are single-domain — no independent corroboration exists.

  Evidence E-07  [SUPPORTING, weight 0.82, delta +0.31]
    Domain: Alpha | Mismatch type: RATE
    Corroboration: 1 source

  Evidence E-12  [SUPPORTING, weight 0.75, delta +0.24]
    Domain: Alpha | Mismatch type: DIRECTION
    Corroboration: 1 source

CONTRADICTION TARGETING

Recent contradictions resolved via RC-3:

  Contradiction C-04 — Signal from Domain Beta, mismatch type RATE
    Shares structural territory with E-07 (load-bearing, single-source)
    Resolved: 3.2 hours after admission
    Resolution basis: investigator judgment

  Contradiction C-06 — Signal from Domain Gamma, mismatch type RATE
    Shares structural territory with E-07 (load-bearing, single-source)
    Resolved: 1.8 hours after admission
    Resolution basis: investigator judgment

ASSESSMENT

H-03's plausibility rests heavily on two weakly-corroborated
assumptions. Both are being challenged by contradictions from
independent domains. Both contradictions were resolved by
investigator judgment without structural evidence.

The hypothesis may be more fragile than current plausibility
suggests.
```

This alert is actionable. The investigator knows specifically where to look, what is weakly supported, and which contradictions to re-examine.

---

### How AVA is derived from existing v1 data

AVA does not require new data collection. It requires new queries against tables that v1 already populates.

**Step 1 — Identify load-bearing evidence:**

Each piece of supporting evidence has a `plausibility_delta` recorded in `plausibility_history` at the time it was submitted. Evidence that produced large plausibility movement is load-bearing — removing it would most reduce current plausibility.

```sql
SELECT 
    he.id,
    he.signal_id,
    he.weight,
    ph.plausibility_delta,
    s.domain_id,
    s.mismatch_type
FROM hypothesis_evidence he
JOIN plausibility_history ph ON ph.evidence_id = he.id
JOIN signals s ON s.id = he.signal_id
WHERE he.hypothesis_id = $1
  AND he.evidence_type = 'SUPPORTING'
ORDER BY ABS(ph.plausibility_delta) DESC;
```

High `plausibility_delta` = load-bearing. This is already stored. No new columns required.

**Step 2 — Score corroboration:**

For each load-bearing evidence item, count independent corroborating evidence — supporting evidence from a *different* domain with the same `mismatch_type`. Single-domain support with no corroboration = vulnerable assumption.

```sql
SELECT COUNT(DISTINCT s2.domain_id) as corroborating_domains
FROM hypothesis_evidence he2
JOIN signals s2 ON s2.id = he2.signal_id
WHERE he2.hypothesis_id = $1
  AND he2.evidence_type = 'SUPPORTING'
  AND s2.mismatch_type = $2          -- same mismatch type as load-bearing evidence
  AND s2.domain_id != $3;            -- different domain
```

**Step 3 — Match contradictions to vulnerable assumptions:**

For each recent contradiction resolved via RC-3, check whether its signal shares `mismatch_type` with any load-bearing, low-corroboration evidence item.

```sql
SELECT 
    c.id,
    c.resolution_type,
    c.resolved_at - c.created_at as retention_time,
    s.mismatch_type,
    s.domain_id
FROM contradictions c
JOIN signals s ON s.id = c.signal_a_id OR s.id = c.signal_b_id
WHERE c.case_id = $1
  AND c.status = 'RESOLVED'
  AND c.resolution_type = 'RC-3'
  AND c.created_at > $2              -- since last briefing
ORDER BY c.resolved_at DESC;
```

If a contradiction's `mismatch_type` matches a load-bearing evidence item's `mismatch_type` and its source domain is independent of the load-bearing evidence's domain — it is targeting a vulnerable assumption.

**Step 4 — Generate the vulnerability score:**

```
vulnerability_score = 
  sum(plausibility_delta for load-bearing items with corroboration < 2)
  ─────────────────────────────────────────────────────────────────────
  total plausibility (1.0)

targeting_score = 
  count(RC-3 contradictions targeting vulnerable assumptions)
  ─────────────────────────────────────────────────────────
  count(all recent RC-3 contradictions)

ava_score = vulnerability_score × targeting_score
```

High `ava_score`: the dominant hypothesis depends heavily on weakly-corroborated assumptions, and those specific assumptions are being challenged by dismissed contradictions.

---

### The architectural implication

PDI and AVA are complementary, not competing.

| | PDI | AVA |
|--|-----|-----|
| Object of analysis | Investigation behavior | Hypothesis internal structure |
| Signal | Rate of contradiction influence | Load-bearing assumption targeting |
| Alert type | Rate anomaly | Structural vulnerability |
| Question answered | Is processing changing? | Where is the hypothesis fragile? |
| Data required | Plausibility history + resolution types | Plausibility history + evidence structure + contradiction matching |

PDI detects that something is wrong with contradiction processing. AVA identifies specifically where that wrong processing is concentrating — the points where the hypothesis is most dependent and least corroborated.

Together they produce an alert that has three components:
1. **The rate signal** (PDI): contradiction influence is declining
2. **The structural signal** (AVA): the declining influence is concentrated at the hypothesis's load-bearing, weakly-supported assumptions
3. **The targeting signal** (AVA): the contradictions being dismissed share structural properties with those vulnerable assumptions

An investigator who receives all three components does not receive a warning about overconfidence. They receive a specific, structural, actionable description of where their hypothesis is exposed.

---

### Layer 3 candidates — updated

| Candidate | What it monitors | Data required |
|-----------|-----------------|---------------|
| Relative PDI | Within-case contradiction influence trend | Plausibility history + admission audit |
| Calibrated PDI | Cross-case Prior Dominance detection | 50+ cases + calibrated expected_delta model |
| AVA | Load-bearing assumption vulnerability + contradiction targeting | Plausibility history + evidence structure + contradiction matching |
| Competition Collapse | Competition set vitality as plausibility rises | Hypothesis table + competition sets |
| Investigation State | Longitudinal composite of all five metrics | All of the above |

AVA shares the same validation requirement as PDI: must demonstrate predictive value beyond process metrics, must catch failures that Layers 1 and 2 miss, and must not produce false positives on healthy convergence.

AVA has one additional validation requirement: the load-bearing assumption identification must be empirically tested against ground truth. In retrospective cases where the investigation was later found to be wrong, AVA should have flagged the specific vulnerable assumption that turned out to be the point of failure. If AVA flags assumptions that are not the actual points of failure, the structural analysis is noise.

---

### What a good investigator actually does

A skilled investigator does not say: *we received contradictory evidence.*

They say: *this evidence attacks one of the load-bearing assumptions of our explanation.*

AVA is an attempt to institutionalize that reasoning — to make the structure of the hypothesis visible in terms of its dependencies, identify where those dependencies are weakly supported, and surface when dismissed contradictions are targeting those specific weaknesses.

The goal is not to warn investigators about overconfidence in the abstract. It is to show them, specifically and structurally, why their current confidence level may not be warranted given the evidence they have dismissed and where they dismissed it.

---

*Addendum: Assumption Vulnerability Analysis | 2026-06-02*

---

## Layer 3 Freeze

**Date:** 2026-06-02  
**Status:** LOCKED

Layer 3 is frozen. No production implementation of any Layer 3 candidate — PDI, AVA, Competition Collapse Monitoring, Contradiction Influence Analysis, or Investigation State Monitoring — before the entry condition is met.

**Entry condition:** 50 completed investigations with full telemetry records.

Full telemetry means: complete admission audit, complete plausibility history, complete contradiction resolution records, complete signal event log. Partial records do not count toward the 50.

---

### Why this lock exists

The architecture document warns against premature Layer 3 implementation. The lock makes that warning binding.

AVA is the specific temptation. It is derivable from existing v1 data, the SQL queries are already written, and the alert format is compelling. These properties make it feel ready. It is not ready. The queries can be written. The analysis cannot be validated until the telemetry corpus exists to validate it against.

A system that implements AVA before the corpus exists will produce AVA alerts. Those alerts will look meaningful. They will be unvalidated. Investigators who act on unvalidated alerts are being misled by the architecture, not helped by it.

The same applies to PDI. The relative PDI formula is computable from the first case with three or more contradictions. Computable is not the same as validated. An unvalidated PDI is a number that looks authoritative and is not.

---

### What Layer 2 integrity requires

Layer 3 measurements are only trustworthy if Layer 2 records are trustworthy. Layer 2 records are only trustworthy if Layer 1 enforcement is functioning correctly.

The specific failure modes that corrupt Layer 3 at the source:

**Contaminated admission scores.** If SI scoring incorporates hypothesis context — if the scorer is influenced by what the current dominant hypothesis is — then admission-time evidence weight is not prior-independent. PDI's baseline is corrupted. AVA's load-bearing assumption identification is corrupted. Both become noise presented as signal.

**Mutable plausibility history.** If any plausibility record can be modified after creation, hypothesis evolution is not reconstructable. The trajectory that PDI and AVA analyze does not reflect what actually happened.

**Inconsistent contradiction typing.** If RC-1, RC-2, and RC-3 are applied inconsistently — if investigators choose the type post-hoc to match a preferred narrative rather than the actual resolution basis — the resolution distribution that PDI monitors means nothing.

These are not hypothetical risks. They are the specific conditions that make Layer 3 meaningless while making it appear to function. The 28/28 invariant tests exist to prove these conditions do not occur. Running and maintaining those tests is the precondition for trusting Layer 2, which is the precondition for trusting Layer 3.

---

### The sequence that cannot be shortened

```
1. Build Layer 1
   ↓
2. Prove Layer 2 invariants (28/28 tests passing)
   ↓
3. Populate real telemetry across real investigations
   ↓
4. Reach entry condition (50 completed investigations)
   ↓
5. Calibrate expected_delta model empirically
   ↓
6. Test whether PDI and AVA behave as predicted
   ↓
7. Decide whether to implement
```

No step can be skipped. Steps 5 through 7 require step 4. Step 4 requires step 3. Step 3 requires step 2. Step 2 requires step 1.

The architecture's strongest idea is not PDI. It is not AVA. It is the discipline that refuses to implement either until the telemetry corpus exists to validate them. That discipline is what this lock protects.

---

### What to do when the entry condition is met

When 50 completed investigations with full telemetry records exist, run the following before implementing anything:

1. Test whether `relative_discount` falls as dominant hypothesis plausibility rises, controlling for evidence weight, within the same investigation. If it does not, PDI's core assumption is wrong — do not implement.

2. Test whether high-`plausibility_delta`, low-corroboration evidence items are retrospectively identifiable as the points of failure in investigations that were later found to be wrong. If they are not, AVA's load-bearing assumption identification is not predictive — do not implement.

3. Test whether PDI and AVA flag conditions that SI, HCL, and CR functioning correctly would not catch. If they do not, Layer 3 adds governance overhead without value — do not implement.

All three tests must pass before any Layer 3 candidate moves to production implementation.

---

*Layer 3 Freeze | 2026-06-02 | Entry condition: 50 completed investigations with full telemetry*
