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

---

## Epistemic Provenance

**Date added:** 2026-06-02

The most precise characterization of what CIS preserves that most investigation systems do not is **epistemic provenance** — the origin and chain of custody of a belief, not just the belief itself.

Provenance in information systems means: where did this datum come from, who handled it, and what happened to it. Epistemic provenance extends this to beliefs: where did this belief come from, what was the evidence at the time the belief was formed, what challenged it, how were those challenges handled, and when and why did the belief change.

Most systems preserve: *what happened.*

CIS preserves: *what happened, why we believed it, when we changed our minds, what we ignored, what contradicted us, and how we resolved it.*

This is not a property of AI versus non-AI systems. It is a property of systems designed for retention versus systems designed for compression. A CIS investigation can be AI-powered throughout — AI scoring signals, AI generating hypotheses, AI classifying evidence — and still produce complete epistemic provenance records, because those records come from the design intention, not from whether AI is involved.

### Institutional memory of disagreement

The specific capability that is rarest in operational investigation systems is not the preservation of conclusions. It is the preservation of disagreement.

Most organizations remember what they concluded. They do not remember what they dismissed, what they quarantined, how contradictions were handled, or what the evidence looked like before the dominant hypothesis existed. CIS's contradiction table, resolution history, and plausibility trajectory are specifically institutional memory of disagreement — not just what the investigation decided, but what it decided against, and on what basis.

### The predictive implication

PDI and AVA are descriptive — they monitor current epistemic behavior against a baseline. The telemetry corpus enables a different capability: predictive identification of investigative failure signatures.

After enough completed investigations with full epistemic provenance records, the corpus contains the behavioral histories of both investigations that reached correct conclusions and investigations that failed. The early epistemic behavior of those two populations — how quickly plausibility moved, how contradictions were handled, how competition sets evolved, how quickly RC-3 became dominant — may be distinguishable before the outcome is known.

A model trained on this corpus would not predict the correct answer. It would predict whether the *investigation's epistemic behavior* matches historical patterns associated with failure — before the investigation concludes.

This is architecturally different from PDI. PDI asks: is contradiction influence declining relative to earlier in this investigation? The predictive capability would ask: does this investigation's epistemic trajectory match trajectories that historically preceded wrong conclusions?

The predictive capability requires the corpus. It cannot be built before the corpus exists. This is a further reason the Layer 3 freeze is correct — the most powerful Layer 3 capability is not the one that can be implemented earliest but the one that requires the most accumulated telemetry.

**Roadmap note:** Predictive investigation failure detection is a Layer 3 candidate requiring substantially more than 50 cases. It is the long-horizon item in the telemetry program. The entry condition for PDI and AVA (50 cases) is not the entry condition for predictive modeling. That threshold is determined empirically once the corpus begins to accumulate.

---

*Epistemic Provenance addendum | 2026-06-02*

---

## The Core Architectural Claim — Structured Residual Management

**Date added:** 2026-06-02

### The reframe

CIS's distinctive capability is not weak signal detection. Frontier AI systems can find weak signals. The stronger and more precise claim is:

**CIS treats unexplained structure as a first-class object. Most systems treat it as something to be minimized.**

Most investigation and reasoning systems operate on this loop:

```
Observation
↓
Generate explanation
↓
Residual shrinks
↓
Done
```

The objective function is coherence maximization. The residual — what the explanation does not account for — gets smaller over time. This is correct behavior most of the time.

CIS operates on a different loop:

```
Observation
↓
Explanation
↓
Residual
↓
Preserve residual
↓
Track residual
↓
Connect residuals across domains
↓
Generate hypotheses from residuals
```

The objective function is not coherence maximization. It is residual management — preserving what is insufficiently explained, connecting preserved residuals, and generating hypotheses from their shared structure.

These are different objective functions. They produce different systems.

---

### What the core constructs are actually doing

**HCL** is not "find hidden common causes." That is the outcome. The mechanism is: three residuals from independent domains share structure → possible common source. The hypothesis emerges from the residuals, not from the dominant explanation. The common cause is the missing variable that explains why three otherwise unconnected observations remained unexplained.

**CR** is not "contradiction governance." It is residual management made explicit. Most systems process a contradiction and discard it once an alternative explanation is found. CR preserves the contradiction, its resolution pathway, its closure type, and the possibility of future reopening. The contradiction is a residual — an observation that the dominant explanation does not cleanly absorb. CR keeps it.

**WSP** is residual preservation under temporal pressure. A sub-threshold signal is a weak residual — not sufficiently unexplained to be obviously important, but not sufficiently explained to be safely discarded. WSP holds it through the minimum retention period so that subsequent observations have the opportunity to connect with it.

**SI scoring** is the measurement of residualness. The SI score is not a measure of importance in general. It is a measure of how much an observation does not fit what its classified context predicts. High SI means the observation is structurally unexplained. The Signal Pool admits observations based on SI score because SI score is the proxy for "this is worth preserving for future connection."

**PDI and AVA** are not overconfidence monitors. They are asking: are we becoming too successful at eliminating residuals? If contradiction influence is declining as confidence rises, the system is explaining away observations faster than the evidence warrants. The residuals are shrinking not because the explanation got better but because the prior got stronger.

---

### The Signal Pool is a residual pool

This is the implication the original spec never stated clearly.

Signals are admitted to the Signal Pool not because they are important in general but because they are structurally unexplained relative to their classified context. The admission criterion is: *is this observation sufficiently unexplained that it should be preserved for future connection?*

This is different from "is this observation significant?" An observation can be significant without being unexplained. An observation can be unexplained without being obviously significant. The Signal Pool is for the second category — observations whose significance is not yet clear because their explanation is not yet available.

The admission audit records the SI score at the moment of admission, before hypothesis context exists. This is the prior-independent measure of residualness — how unexplained was this observation at the moment it entered the pool, before the investigation's own reasoning could contaminate the assessment. That record is what makes Layer 3 analysis possible. It is the baseline against which subsequent explanation can be measured.

---

### The missing variable discovery structure

The most powerful application of residual management is missing variable discovery.

Missing variables typically appear first as residuals. Residual A, Residual B, Residual C exist in independent domains. Each is locally explained, inadequately. The local explanations suppress the residuals individually. The shared structure across them goes unrecognized.

Then the missing variable is identified. It explains all three residuals simultaneously. The local explanations were wrong, or incomplete, or were actively preventing the recognition of the shared cause.

This is the structure of:
- Scientific paradigm shifts (anomalies accumulate until a new framework explains them)
- Intelligence failures (independent signals each explained away, shared source missed)
- Fraud detection (inconsistencies in separate accounts, shared cause: a single actor)
- Medical misdiagnosis (symptoms attributed to separate causes, shared cause: a single condition)
- HCL in the Track A validation program

Therac-25 is the cleanest empirical example from Track A. Six facilities each held an unexplained observation — patients injured by a machine certified as safe. Each residual was locally explained as operator error or transient malfunction. The shared structure (the software race condition) was invisible from within any single facility's investigation. The residuals connected across four independent organizational domains in two countries. The missing variable emerged.

This is not a philosophical claim about what CIS could do. It is an empirical result that appeared in the Track A validation data and was confirmed across six incidents.

---

### The strongest version of the CIS claim

Frontier systems are optimized to explain observations.

CIS is optimized to preserve, connect, and revisit observations that remain insufficiently explained.

Those are different objective functions. They search different spaces.

Compression-based systems systematically shrink the unexplained. This is correct most of the time. It fails specifically when the explanation that maximizes local coherence is wrong, and the evidence of its wrongness is distributed across domains that do not communicate, or is sub-threshold in ways that individually justify dismissal but collectively constitute a pattern.

CIS is designed for exactly that failure mode — not as a general alternative to compression-based reasoning, but as a system for the specific class of problems where the correct explanation is hidden in the structure of what has not yet been explained.

Whether this produces discoveries that compression-based reasoning misses is an empirical question. The Track A program has been quietly testing it. The HCL and SI validation results are early evidence. The telemetry corpus that v1 generates is how that question gets answered at scale.

---

*Structured Residual Management | 2026-06-02*

---

## The Competitive Claim — Explanatory Gap as Primary Object

**Date added:** 2026-06-02

### The precise formulation

CIS and frontier AI systems are not competing on the same objective function. They optimize for different things. Different objective functions produce different discoveries even when both systems are highly capable.

**Frontier AI** is rewarded for explanatory efficiency: compress reality into the smallest coherent representation that predicts well. The architecture is structurally incentivized to shrink residual uncertainty. Smaller residuals mean better models. This is correct behavior for most problems.

**CIS** is rewarded for explanatory incompleteness: preserve what remains unexplained, connect preserved residuals, generate hypotheses from shared residual structure. The architecture is structurally incentivized to investigate residuals rather than minimize them.

These produce different search spaces. AI searches the model. CIS searches what the model leaves behind.

---

### The Signal Pool, the Reasoning Layer, and the Residual

These are three distinct things. Conflating them produces a claim the architecture cannot support.

**Signal Pool** — an observation store. Every admitted signal lives here. Signals enter the pool when their SI score exceeds SI_min. At the moment of admission, hypotheses may not exist. The pool holds observations, not residuals. A signal is an observation. Whether it is a residual depends on what the Reasoning Layer contains at any given moment.

**Reasoning Layer** — an explanation store. Hypotheses, evidence, plausibility scores. This is the system's current account of what the observations mean.

**Residual** — a relationship, not a property. A signal becomes a residual when it is in the pool and not covered by any active hypothesis. The residual is the difference between observation structure and explanatory coverage. It is not baked into the signal. It emerges from the comparison between the two stores.

This distinction matters for the architecture. SI is assigned at admission-time, before hypotheses exist. SI cannot be "distance from the current explanation" — there may be no current explanation. SI is distance from the classified baseline of the signal's context — a structural property of the observation, prior-independent by design.

The competitive claim is therefore not: "the Signal Pool holds residuals." The claim is: "the architecture preserves all observations, and the Reasoning Layer is specifically designed to leave some of them uncovered — preserving the residual relationship — rather than forcing every observation into the nearest available explanation."

This is architecturally different from:
- Anomaly detection (which asks: what is unusual?)
- Significance testing (which asks: is this statistically unlikely?)
- Evidence management (which asks: what supports or contradicts the hypothesis?)

The architecture asks: after the best available explanation is applied, which observations remain outside its coverage? That remainder is the residual. The pool preserves the observations. The reasoning layer defines which are currently residuals. The system is specifically designed to not eliminate that remainder by stretching explanations to cover it.

---

### What CIS can discover that compression-based systems systematically miss

**1. Missing variables**

Frontier AI is extremely capable when the important variables already exist in the representation. It excels at finding relationships between represented variables.

CIS may be better at identifying that a missing variable *exists* — before it is named, before it is represented, before it appears in any single investigation's evidence.

Missing variables typically appear first as residuals. Residual A in Domain A, Residual B in Domain B, Residual C in Domain C — each locally attributed to something else. The missing variable is not absent from the data. It manifests repeatedly. But it is absent from the representation because each instance has been locally closed.

The missing variable is only visible from the shared structure of the residuals. HCL is specifically the mechanism for finding that shared structure.

**2. Patterns before they are statistically dominant**

Frontier models are strongest after a pattern is established in the training distribution. CIS may detect the pattern before it is dominant — because it preserves weak signals that accumulate before they become statistically obvious. The pattern is visible in the residual structure before it reaches the threshold that compression-based systems treat as signal.

**3. Resistance to paradigm lock-in**

As a model becomes more accurate, it becomes more committed to its current explanatory framework. Success increases lock-in. The model's priors become stronger. New observations are increasingly interpreted through the existing framework.

A system that preserves contradictory residuals structurally resists this. The residual record is prior-independent — it was scored before the hypothesis existed. It does not change as confidence rises. This is why the admission-time SI score matters: it is a permanent record of how unexplained the observation was before the investigation's reasoning contaminated the assessment.

**4. Systematic search of the residual space**

Most intelligence systems ask: what explains the data?

CIS asks: what remains unexplained after explanation?

These are not the same operation. One searches the model. The other searches what the model leaves behind. The residual space contains things that the model is structurally incentivized to minimize. It is the space that compression-based systems are optimized to shrink. It is also the space where missing variables, emerging patterns, and paradigm-shifting anomalies appear first.

---

### The historical structure

This is the structure of how anomalies become discoveries:

Mercury's perihelion precession: measured, known, locally attributed to measurement error or undiscovered planets. Every local attribution closed the residual within its own framework. The actual cause was only identifiable as the shared structure of a residual that resisted all local closures across repeated measurement attempts.

Therac-25: six patient injuries across four independent facilities. Each locally attributed to operator error. The software defect was not absent from the data — it manifested six times. But each manifestation was locally explained, and the defect was only identifiable from the shared structure of residuals that had each been locally closed. At incident 2, the local explanation was available and plausible. At incident 3. At incident 4. The missing variable existed only as shared residual structure until the pattern was examined across all four domains simultaneously.

The anomaly is valuable precisely because it resists local closure. A reasoning system optimized for explanatory convergence will tend to accept the local closure and move on. A system designed to preserve and connect observations that resist closure will not.

---

### The attribution — not AI specifically

The limitation does not belong specifically to AI. It belongs to any reasoning system optimized for explanatory convergence. That includes:

- Human investigators who accept plausible local explanations
- Organizational review processes that close incidents case by case
- Expert panels that evaluate each anomaly independently
- AI systems that compress toward coherent representations

AI happens to be a particularly capable and consistent example of explanatory convergence. But the architectural claim is not "CIS beats AI." The architectural claim is:

**CIS is not competing to produce better explanations. CIS is competing to preserve and connect explanatory failures long enough for missing variables to become visible.**

That is a much narrower claim. It is also more defensible and more testable.

---

### The boundary condition

The competitive claim is strongest under one specific condition: the missing variable is inferable only from the shared structure of residuals that have each been locally attributed to other causes.

If the missing variable is directly represented in the available data, a capable reasoning system — human or AI — will likely find it without residual management. CIS's structural advantage is clearest when:

- The missing variable leaves no single instance that is individually diagnostic
- Each instance of the variable's effect has been locally explained away by a plausible local cause
- The shared structure is only visible across residuals from independent domains

This is not a rare condition. It is the structure of most intelligence failures, most diagnostic errors that are caught late, most fraud cases discovered after damage is done, and most scientific anomalies that precede paradigm shifts.

---

### The empirical test

The test is not: can frontier AI identify the shared cause given the completed case history? It can. Given the full Therac-25 record, a capable model will identify the software defect immediately.

The test is sequential: at incident 2, with one other facility's locally-attributed injury as the only available cross-domain evidence, does the system connect the residuals? At incident 3? At incident 4?

Apply frontier AI to Track A cases — not to the completed record, but to the sequential evidence state at each incident, before the pattern is visible. Ask it to generate hypotheses about shared causes. Compare those hypotheses to what HCL generates from the same sequential evidence.

If frontier AI generates the HCL hypothesis at the same evidence state, the architectural claim weakens. If divergence appears specifically in the HCL-heavy cases — Therac-25, MCO, Ariane 5 — and specifically at the sequential evidence states where residuals exist but the pattern is not yet visible, the claim is supported.

The Track A validation program was not designed to run this test. The test can be run now against the existing 18-case corpus. It does not require new cases. It requires applying a capable reasoning system to the same sequential evidence states that Track A coded, and comparing the hypotheses it generates to the HCL findings.

That comparison is the most direct available test of whether CIS identifies something that explanatory convergence misses, rather than just preserving it longer.

---

*The Competitive Claim | 2026-06-02*
