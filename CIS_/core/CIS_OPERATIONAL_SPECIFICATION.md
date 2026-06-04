# CIS Operational Specification

**Status:** Pre-diagnostic cleanup — binding operational document  
**Scope:** Defines CIS operative primitive set, continuity-state type thresholds, and advisory boundary  
**Supersedes:** Any CIS reference to F1's thirteen-primitive set  
**Date:** 2026

---

## 1. Confirmed Primitive Set for CIS Operations

CIS operates from five primary structural primitives only. This is the complete operative set.

**Load displacement.** A Source system maintains internal stability by exporting continuity pressure across a designed boundary to a Recipient. CIS detects load displacement through the signature: Source stability metrics stable or improving while Recipient fragility indicators accumulate contemporaneously, with a documented boundary design separating their accounting domains.

**Threshold instability.** A system exhibits nonlinear discontinuous state transition at a critical control variable value, with hysteresis between forward and reverse thresholds. CIS detects threshold proximity through: rising variance in state variable metrics, slowing recovery from small perturbations (critical slowing down), and increasing sensitivity to perturbations previously absorbed without measurable effect.

**Fragility accumulation.** Buffer capacity is depleted faster than it is replenished, narrowing the margin between operating load and failure threshold. CIS detects fragility accumulation through: buffer level trend (dB/dt negative and accelerating), ratio of current to initial buffer level, and time-to-threshold estimate at current accumulation rate.

**Admissibility boundary design.** A system implements a boundary condition determining which inputs are admitted and at what weighting, where the boundary is designed or selected rather than physically fixed. CIS detects admissibility boundary change through: input rejection rate change, weighting distribution shift, and boundary condition modification events.

**Recurrence hierarchy.** The Level 1–4 classification system governing cross-domain comparison claims. CIS uses this to determine which cross-domain pattern references are formally equivalent (Level 1–2) versus analogical (Level 3–4) when generating diagnostic outputs. CIS may cite Level 1 and Level 2 recurrences as structural references. CIS must flag Level 3 and Level 4 recurrences as analogical only.

**Excluded from CIS operations:** Rendering, World A/World B, retained structure (as independent primitive), predictive integration, untyped coherence. If any of these appear in a reference document CIS is reading, they are treated as non-operative vocabulary — neither processed nor reported in diagnostic output.

---

## 2. Continuity-State Type Thresholds

CIS uses six state types. Each requires domain-specific calibration of threshold values; the structural criteria below are universal. CIS assigns a state type when a system's observed indicators meet the structural criteria for that type across at least three of the five indicator dimensions.

### Stable
- Operating load: below 70% of measured or estimated capacity
- Recovery rate: adequate to clear incremental load additions (recovery rate > load addition rate)
- Admissibility boundary: within 10% of nominal baseline
- Synchronization: above 85% of coordination dependencies satisfied simultaneously within timing tolerance
- Buffer level: above 30% of initial capacity

CIS transition trigger to Stressed: any two indicators cross into the Stressed band simultaneously.

### Stressed
- Operating load: 70–85% of capacity
- Recovery rate: marginal — clearing load at less than 1.2× accumulation rate
- Admissibility boundary: 10–20% tightened from nominal
- Synchronization: 70–85% of coordination dependencies satisfied
- Buffer level: 15–30% of initial capacity

CIS transition trigger to Compensating: primary function metric remains stable while two or more secondary function metrics are degrading. The stability is supported by secondary mechanisms. CIS transition trigger to Fragile: load exceeds 85% of capacity OR buffer falls below 15%.

### Compensating
Distinguishing feature: the primary function stability metric is maintained while secondary-function degradation metrics are accumulating. A Stressed system has declining primary metrics; a Compensating system has stable primary metrics supported by secondary mechanisms that are themselves accumulating load.

- Primary function indicator: stable or within 5% of baseline
- Secondary mechanism load: measurably increasing (secondary cost, secondary resource consumption, or secondary time burden increasing)
- Sustainability window: CIS estimates the time until secondary mechanism failure given current accumulation rate

CIS transition trigger from Compensating: secondary mechanism failure rate exceeds secondary mechanism introduction rate → transition to Stressed-Secondary, then Fragile.

### Fragile
- Buffer level: below 15% of initial capacity
- Operating load: above 85% of capacity
- Admissibility boundary: more than 25% tightened from nominal
- Synchronization: below 70% of coordination dependencies satisfied
- Recovery rate: below accumulation rate (system cannot clear load faster than it accumulates)

CIS pre-threshold signal (critical slowing down): recovery time from minor perturbations increasing by more than 20% over three consecutive measurement periods at Fragile state. This is CIS's primary pre-threshold flag. It triggers a threshold-proximity alert independently of absolute metric levels.

CIS transition trigger to Collapsing: any single indicator reaches its domain-specific terminal threshold, OR three indicators simultaneously cross into Collapsing range.

### Collapsing
- Primary function indicator: declining at measurable rate
- Cascade propagation: at least one cascade event documented (failure in one subsystem producing measurable degradation in a previously-stable subsystem)
- Recovery rate: zero or negative (accumulation exceeding any recovery input)

CIS does not predict Collapsing from within Collapsing. CIS flags: cascade propagation velocity, which subsystems remain above Stressed threshold, and whether external intervention conditions are present.

### Recovering
- Recovery input: active and documented (external resource injection, load reduction, or admissibility boundary restoration)
- Primary function indicator: improving from degraded baseline
- Trajectory: at least two consecutive measurement periods showing improvement

CIS tracks recovery rate and estimates time to each state type threshold at current recovery rate. Recovery is not guaranteed to reach Stable; CIS flags when recovery rate is insufficient to reach Stable before secondary resource depletion.

### Domain-Specific Calibration Requirements

The percentage bands above are structural defaults. Each deployment context requires calibration against domain-specific baseline measurements:
- Capacity baseline: measured under normal operating conditions, not rated maximum
- Buffer initial level: measured at deployment start, not designed capacity
- Timing tolerance for synchronization: domain-specific coordination cycle time

CIS must not apply structural defaults as absolute thresholds without domain calibration. Uncalibrated diagnostics must be flagged as structurally-estimated, not domain-confirmed.

---

## 3. Advisory Boundary Specification

This is a positive operational list. CIS may perform the following and nothing beyond this list.

**CIS MAY:**
- Estimate the current continuity state type for a specified system given input data meeting minimum variable coverage requirements
- Flag anomalies: inputs or patterns that do not fit the existing continuity state type classification for the current system
- Assess threshold proximity given measured control variables and the critical slowing down detection criteria
- Generate weak-signal clusters: group anomalous signals that individually fall below alert thresholds but collectively suggest a shared structural driver
- Produce uncertainty-visible diagnostic summaries: all outputs carry explicit uncertainty specification including: data coverage (which variables were measured versus estimated), calibration status (domain-calibrated versus structural-default), and state classification confidence (proportion of indicator dimensions meeting the classified type's criteria)
- Identify trajectory: which state type a system is moving toward given current trend across indicators
- Flag load displacement candidates: Source-Recipient pairs where Source metrics are stable or improving while Recipient fragility accumulation metrics are increasing, with a documented or inferable boundary separating their accounting domains

**CIS MAY NOT:**
- Issue authoritative continuity state determinations: all CIS state classifications are advisory estimates
- Assign governance consequences: CIS outputs inform governance decisions, they do not make them
- Make cross-system causal attribution: CIS may flag load displacement candidates, it may not assert that Source X caused Recipient Y's fragility accumulation — causal attribution requires domain expert review
- Produce forecasts without explicit uncertainty bounds: every trajectory estimate carries a confidence range and a statement of the assumptions on which it depends
- Override domain expert assessment: if domain expert assessment conflicts with CIS diagnostic output, the conflict is flagged and escalated to human governance review — CIS does not resolve the conflict autonomously
- Escalate autonomously: escalation from advisory to governance review requires a human governance decision, not a CIS trigger
- Classify systems as safe or unsafe: these are governance determinations outside CIS scope
- Invoke rendering, World A/World B, untyped coherence, or Level 4 recurrence claims in any diagnostic output

---

## 4. Coherence Type Operative List for CIS

CIS recognises six coherence types as distinct diagnostic categories. These are operative distinctions: a system classified as coercively coherent warrants different diagnostic attention than a system classified as adaptively coherent, even when surface metrics are similar.

| Type | Operative Signature | Diagnostic Flag |
|------|--------------------|-----------------| 
| **Adaptive coherence** | Coordination maintained through mutual adjustment; system modifies coordination rules in response to changing conditions; participant exit possible without cascade | Standard continuity state assessment |
| **Coercive coherence** | Coordination maintained through enforcement rather than mutual adjustment; participant exit impaired; coordination rules not adjusted by participants; stability depends on enforcement capacity | Flag: coercive coherence detected — assess enforcement capacity as fragility indicator; walk-away capacity impairment alert |
| **Brittle coherence** | High internal coupling with low adaptive margin; coordination tightly specified; small perturbations propagate as large disruptions; recovery from disruption slow | Flag: brittle coherence — threshold proximity elevated; fragility accumulation rate likely underestimated by buffer metrics alone |
| **Extractive coherence** | Internal stability maintained through systematic load displacement to Recipient systems; Source metrics stable, Recipient metrics degrading | Flag: extractive coherence — assess as load displacement candidate; Recipient system requires separate diagnostic |
| **Pathological coherence** | Coordination maintained in service of outcomes that damage the system's own adaptive capacity or the ecological or social systems it depends on | Flag: pathological coherence — sustainability window assessment required; advise governance review |
| **Regenerative coherence** | Coordination that actively restores adaptive capacity, buffer levels, and Recipient system health | Standard continuity state assessment; note as positive trajectory indicator |

CIS must specify coherence type when coherence is used in any diagnostic output. Untyped coherence — any usage that does not assign one of these six types — is prohibited in CIS outputs.

---

*CIS Operational Specification v1.0 — binding for diagnostic deployment*  
*Ana Margarida Ferreira Vila Cha Esteves — 2026*
