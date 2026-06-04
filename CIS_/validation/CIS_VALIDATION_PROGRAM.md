# CIS Validation Program

**Date:** 2026-05-30
**Version:** 1.0
**Status:** DRAFT — Pre-validation

---

## Objective

Determine whether CIS provides measurable diagnostic value beyond conventional observation.

This is a validation program.

Not an implementation phase.
Not a theory expansion.
Not a product roadmap.

The goal is to test whether CIS identifies meaningful weak signals earlier, more accurately, or more coherently than baseline approaches — and to produce evidence that either supports or refutes that claim.

---

## Section 1 — Validation Philosophy

### 1.1 Necessary and Insufficient Conditions

CIS succeeds only if it demonstrates practical diagnostic advantage.

Passing internal tests, specification compliance, and theoretical consistency are necessary but not sufficient. The diagnostics engine produces 709 validated assertions across 50 test cases. That establishes internal correctness. It does not establish external value.

The gap between internal consistency and external value is precisely what this program addresses.

### 1.2 Comparison Requirement

Validation must compare CIS against existing approaches. A finding that CIS detects a signal is only meaningful if one of the following can also be established:

- The signal was not detected by the baseline method at the same time
- The signal was detected later by the baseline method
- The signal was detected at higher false-positive cost by the baseline method
- The signal was detected but not integrated into a coherent diagnostic picture by the baseline method

Without comparison, CIS findings are pattern-matching exercises, not validation.

### 1.3 Independence Requirement

Validation must be independent of implementation. Personnel who designed or implemented CIS must not evaluate whether CIS outputs are meaningful. Where expert-rated usefulness is a metric, experts must be domain specialists with no knowledge of CIS design.

### 1.4 Honest Failure

If CIS does not outperform baselines, that finding is a valid and important result. The validation program is designed to produce a true answer, not a favorable one.

---

## Section 2 — Validation Tracks

Four independent validation tracks are defined. Each track addresses a different system type, data environment, and domain expertise requirement. Tracks are designed to be independent — a failure in one track does not preclude validation in another, and a success in one track does not establish general validity.

| Track | Domain | Data Type | Validation Mode |
|-------|--------|-----------|----------------|
| A | Historical Investigations | Archival, case records | Retrospective blind |
| B | Hospitals and Clinical Systems | Clinical, operational | Prospective or retrospective |
| C | Cities and Infrastructure | Operational, sensor | Retrospective or live |
| D | Disaster and Fire Prevention | Environmental, incident | Retrospective |

---

## Section 3 — Track A: Historical Investigations

### 3.1 Objective

Determine whether CIS, applied to chronologically ordered information available before case resolution, produces signals that would have been structurally relevant to earlier detection or intervention.

### 3.2 Target Systems

Historical investigations in which:

- A temporal record exists (events, reports, observations with known dates)
- The outcome is known and publicly documented
- Intermediate-state information (what was known at each point in time) can be reconstructed separately from outcome information
- Resolution was either delayed or required significant resource investment, suggesting early signals were missed or underweighted

**Candidate case categories:**

| Category | Rationale |
|----------|-----------|
| Kidnappings | High temporal pressure; continuity degradation model applies to victim state, investigative capacity, and coordination coherence simultaneously |
| Missing persons | Long-duration cases with identifiable early-period signal windows; fragility accumulation relevant to investigative resource allocation |
| Organized crime investigations | Network continuity patterns; load displacement between enforcement capacity and criminal network adaptation; weak-signal clustering across distributed observations |
| Major fraud cases | Slow-accumulation fragility patterns; early signals frequently present in financial records before collapse; threshold instability detectable in reporting anomalies |
| Corruption investigations | Boundary condition modification events; admissibility changes in institutional processes; coherence classification (extractive, coercive) potentially recognizable from observable institutional behavior |

### 3.3 Available Data

Archival and public-record sources. Required data types:

- Timestamped event logs, reports, or observations
- Organizational or operational structure at each time period (where known)
- Resource allocation records (investigative hours, personnel, equipment)
- Known coordination or communication failures
- Available outcome timeline

Data must be separable into two partitions: **pre-outcome record** (used for CIS analysis) and **outcome record** (used only for scoring after analysis is complete).

### 3.4 Observable Outcomes

- Whether CIS identified a structurally relevant signal before the signal appeared in conventional investigative records
- Whether the CIS continuity state trajectory correlated with subsequent investigative events (escalation, breakthrough, collapse)
- Whether weak-signal clusters identified by CIS corresponded to clusters that retrospective analysis later recognized as meaningful
- Whether fragility indicators identified periods of genuine investigative capacity decline

### 3.5 Validation Objective

For each case:

1. Build a timeline using only information available at each point before resolution.
2. Strip all outcome information from the working record.
3. Apply CIS analysis chronologically — each analysis window sees only data available up to that date.
4. Record, at each window:
   - Continuity state classification
   - Anomaly detections (category, severity, dimension)
   - Weak-signal clusters (structural driver inferred, confidence)
   - Trajectory assessments (projected state, confidence range)
   - Fragility indicators (dB/dt, time-to-threshold if applicable)
   - Load displacement candidates (where multi-subsystem records permit)
5. Seal the CIS record.
6. Reveal outcome record.
7. Score against outcome: did CIS identify structurally relevant signals before conventional recognition?

### 3.6 Baseline Comparisons for Track A

| Baseline | Description |
|----------|-------------|
| Conventional investigative timeline | Points at which the investigation formally recognized a new signal, escalated, or changed approach |
| Expert review | Experienced investigators or analysts review the same pre-outcome record and produce their own signal timeline independently |
| Statistical baseline | Simple threshold flags on any metric exceeding two standard deviations from its own prior mean |

### 3.7 Success Metric (Track A)

CIS demonstrates Track A value if:

- In at least 60% of evaluated cases, CIS identifies a structurally relevant signal at least one analysis window earlier than the conventional investigative record reflects formal recognition
- Weak-signal clusters identified by CIS correspond to retrospectively confirmed signal clusters in at least 50% of cases
- The false-positive rate (CIS flags a signal that retrospective analysis finds structurally irrelevant) does not exceed twice the false-positive rate of the expert baseline

---

## Section 4 — Track B: Hospitals and Clinical Systems

### 4.1 Objective

Determine whether CIS provides earlier or more coherent warning of system-level deterioration events in clinical and hospital settings, compared to existing monitoring systems, NEWS/MEWS scoring, and expert assessment.

### 4.2 Target Systems

| System | CIS Diagnostic Relevance |
|--------|------------------------|
| Emergency departments | Surge capacity continuity; load displacement from inpatient to ED; staffing fragility; coherence type classification under sustained overload |
| ICU operations | Buffer capacity monitoring; fragility accumulation in ventilator/bed availability; trajectory toward threshold; weak-signal clustering of deterioration precursors |
| Patient deterioration monitoring | Continuity state classification for individual patients or patient cohorts; fragility trend from vital sign and lab observation histories; anomaly detection against expected trajectory |
| Staffing systems | Secondary mechanism load accumulation (staff overtime, agency usage as compensating mechanism); load displacement from permanent to contingent workforce |

### 4.3 Available Data

Retrospective: de-identified EHR records, staffing logs, bed availability records, incident reports, existing scoring system outputs (NEWS2, SOFA, APACHE, etc.).

Prospective (where data sharing agreement permits): real-time feeds from operational monitoring systems with CIS operating as a parallel shadow analyzer.

### 4.4 Comparison Systems

| Comparison | Description |
|------------|-------------|
| NEWS2 / MEWS | Existing early warning scoring in emergency and acute care |
| SOFA / APACHE | Severity scoring for ICU and critical care |
| Expert nursing/medical assessment | Documented escalation decisions at the time of care |
| Statistical baseline | Moving-average deviation on the same input metrics CIS uses |

### 4.5 Measurement

| Metric | Operationalization |
|--------|--------------------|
| Lead time | Hours or analysis periods by which CIS fragility/trajectory signal preceded: (a) clinical escalation event, (b) adverse outcome, (c) formal rapid response call |
| False positives | CIS fragility or trajectory signals not followed by adverse outcome within the defined outcome window |
| False negatives | Adverse outcomes not preceded by a CIS fragility or trajectory signal within the detection window |
| Signal usefulness | Clinician or analyst rating (5-point scale) of whether the CIS diagnostic output would have been actionable if provided in real time |

### 4.6 Validation Objective

For patient deterioration: evaluate CIS against at least 200 patient episodes (100 deterioration, 100 non-deterioration controls) in each site.

For system-level (ED, ICU, staffing): evaluate against at least 12 months of operational data at each site, with at least 20 identified overload or capacity breach events.

### 4.7 Blind Evaluation Protocol (Track B)

For retrospective: CIS analysis completed and sealed before outcome records are provided to the scoring team.

For prospective: CIS outputs are logged with timestamps before outcome is known. Scoring occurs after the outcome window closes.

Clinician evaluators rate CIS outputs without access to the outcome information at the time of rating.

---

## Section 5 — Track C: Cities and Infrastructure

### 5.1 Objective

Determine whether CIS detects continuity degradation in urban infrastructure systems earlier or more coherently than existing monitoring and operational review processes.

### 5.2 Target Systems

| System | CIS Diagnostic Relevance |
|--------|------------------------|
| Water systems | Pressure continuity; fragility accumulation in pipe network; admissibility boundary shifts (contamination risk zones); load displacement from primary to backup supply |
| Transport networks | Capacity continuity under demand variation; threshold instability during peak demand periods; fragility accumulation in aging infrastructure segments |
| Energy systems | Supply buffer monitoring; load displacement between generation sources; trajectory toward capacity breach; CSD detection in frequency stability metrics |
| Emergency services | Response capacity continuity; staffing fragility; load displacement from planned response to unplanned demand; coherence type classification under sustained overload |

### 5.3 Available Data

Public and regulatory datasets: utility reliability reports, SCADA incident logs, infrastructure inspection records, emergency services call volume and response time records, publicly available outage and failure event databases.

Where data-sharing agreements with operators are established: operational sensor data, maintenance logs, capital investment records.

### 5.4 Observable Outcomes

- Documented infrastructure failures, service disruptions, or capacity breach events
- Regulatory or operational reports identifying the point at which degradation became apparent to operators
- Maintenance event logs

### 5.5 Evaluation Criteria

| CIS Capability | Infrastructure Equivalent |
|----------------|--------------------------|
| Continuity degradation detection | Progressive capacity decline before discrete failure event |
| Load displacement | Transfer of demand burden between infrastructure segments as one component degrades |
| Fragility accumulation | Increasing rate of minor fault events; decreasing mean time between failures |
| Recovery behavior | Post-event restoration trajectory; whether recovery reaches prior baseline |

### 5.6 Measurement

| Metric | Operationalization |
|--------|--------------------|
| Detection lead time | Time between first CIS fragility or trajectory signal and: (a) operator formal recognition, (b) discrete failure event |
| Detection accuracy | Proportion of CIS flags followed by a documented degradation event within the outcome window |
| Operational usefulness | Operator or asset manager rating of whether the CIS output would have changed operational decisions |

### 5.7 Baseline Comparisons for Track C

| Baseline | Description |
|----------|-------------|
| Existing SCADA / monitoring thresholds | Operational alarm points as configured at the time of evaluation |
| Asset management risk scores | Existing capital planning risk ratings for infrastructure segments |
| Statistical baseline | Simple exponential smoothing of the primary continuity metric, with alarm at two-sigma deviation |

---

## Section 6 — Track D: Disaster and Fire Prevention

### 6.1 Objective

Determine whether CIS produces earlier or more structured pre-event warning signals in disaster and fire risk domains compared to existing operational warning systems.

### 6.2 Target Systems

| System | CIS Diagnostic Relevance |
|--------|------------------------|
| Wildfire risk regions | Vegetation moisture as continuity buffer; atmospheric conditions as load metrics; fragility accumulation across dry periods; trajectory toward ignition threshold |
| Flood-prone regions | Catchment saturation as buffer; precipitation rate as load; admissibility boundary modification by prior land use change; fragility accumulation in levee and channel capacity |
| Disaster response systems | Response capacity continuity; fragility accumulation in resource pre-positioning; load displacement from proactive to reactive posture; coherence classification |

### 6.3 Available Data

Historical event datasets with pre-event conditions:

- Wildfire: fuel moisture records, Fire Weather Watch/Warning histories, burn area records, fire incident databases (NIFC, EFFIS)
- Flood: river gauge records, precipitation records, flood event databases, hydrological model outputs
- Disaster response: FEMA after-action reports, state emergency management records, resource deployment logs

### 6.4 Evaluation Design

For each identified major event:

1. Reconstruct the pre-event observation record (conditions available to analysts before event onset).
2. Apply CIS chronologically across the pre-event window.
3. Seal CIS outputs before event record is provided.
4. Score: did CIS fragility, trajectory, or threshold-proximity signals precede the event, and at what lead time relative to existing operational warnings?

### 6.5 Measurement

| Metric | Operationalization |
|--------|--------------------|
| Warning lead time | Time between first CIS threshold-proximity or trajectory-to-threshold signal and: (a) first official warning issued, (b) event onset |
| Warning precision | Proportion of CIS signals followed by an event within the specified outcome window |
| Warning recall | Proportion of events that were preceded by a CIS signal within the detection window |

### 6.6 Baseline Comparisons for Track D

| Baseline | Description |
|----------|-------------|
| Existing operational warnings | NWS Fire Weather Watch/Warning, hydrological watch/warning, official pre-disaster declarations |
| Statistical baseline | Moving average of primary risk index, alarm at threshold crossing |
| Expert retrospective review | Domain specialists (fire behavior analysts, hydrologists) review same pre-event data and identify signal timing |

---

## Section 7 — Baseline Comparisons

### 7.1 Three Required Baselines Per Track

Every validation track compares CIS against three baseline types. No track result is accepted without all three comparisons.

| Baseline Type | Rationale |
|---------------|-----------|
| **Existing operational methods** | The system CIS would supplement or replace in practice. If CIS cannot outperform the operational baseline, it has no deployment case regardless of its theoretical properties. |
| **Expert judgment** | Human domain expertise is the legitimate standard CIS must exceed in structured ways. Expert judgment sets the ceiling of unaided human performance on the same information. |
| **Simple statistical baselines** | The minimum bar. If CIS cannot outperform a moving average or threshold rule on the same inputs, CIS is not adding diagnostic value — it is adding complexity without benefit. |

### 7.2 Comparison Documentation

For each track, the final comparison report must document:

**Where CIS performs better:**
- Specify which metric showed improvement
- Quantify the magnitude of improvement with confidence intervals
- Specify whether the improvement was consistent across cases or driven by a subset

**Where CIS performs worse:**
- Specify which metric showed degradation relative to baseline
- Assess whether the degradation is operationally material
- Identify whether the underperformance is systematic or case-specific

**Where results are equivalent:**
- Document equivalence explicitly — equivalence is a valid finding
- Assess whether equivalent performance at potentially higher complexity constitutes a practical cost

### 7.3 No Aggregation Across Tracks

Track results are reported independently. A strong Track B result does not offset a Track D failure. The validation outcome for each track is determined by that track's evidence alone.

---

## Section 8 — Blind Evaluation Protocol

### 8.1 Core Requirements

- Evaluators do not know outcomes at the time of evaluation.
- CIS outputs are recorded before outcome reveal.
- Scoring is performed after outcome reveal.
- CIS design and implementation team members do not participate in scoring.

These requirements are not optional. Retrospective fitting is the primary threat to the validity of any advisory diagnostic validation. Knowing the outcome makes structurally ambiguous signals appear retrospectively obvious. Blind evaluation is the only control.

### 8.2 Protocol Steps

1. **Data partition:** Pre-outcome record and outcome record are separated before analysis begins. The outcome record is held by a data custodian not involved in the analysis.

2. **CIS analysis:** Analyst or automated system runs CIS over the pre-outcome record chronologically. All outputs are timestamped and sealed.

3. **Evaluator pre-registration:** Before outcome reveal, evaluators record which CIS outputs they consider structurally significant and why. This prevents post-hoc reinterpretation of the CIS record.

4. **Expert blind evaluation:** Domain experts review the pre-outcome record (without CIS outputs) and produce their own signal timeline. This is the expert baseline. They do not have access to the outcome at this stage.

5. **Outcome reveal:** The data custodian releases the outcome record to the scoring team.

6. **Scoring:** The scoring team evaluates CIS outputs and expert baseline against the outcome record. The scoring team has the outcome record but not the CIS outputs or expert assessments until they are simultaneously revealed.

7. **Blinding verification:** The protocol must be documented sufficiently for an independent reviewer to confirm that blinding was maintained at each step.

### 8.3 Deviation Documentation

Any deviation from the blind evaluation protocol must be documented, the reason recorded, and the affected case excluded from the primary analysis. Deviated cases may be reported separately as a sensitivity analysis but cannot contribute to the primary validation finding.

---

## Section 9 — Metrics

### 9.1 Minimum Required Metrics

The following metrics are required for all tracks. No track result is considered complete without all seven.

| Metric | Definition | Unit |
|--------|------------|------|
| **Lead-time advantage** | Time between first CIS signal of a given type and baseline signal of the same event. Positive = CIS earlier. | Periods or hours (track-appropriate) |
| **Precision** | True positives / (True positives + False positives). Proportion of CIS signals that correspond to a real adverse event within the outcome window. | 0–1 |
| **Recall** | True positives / (True positives + False negatives). Proportion of real adverse events that were preceded by a CIS signal within the detection window. | 0–1 |
| **False positive rate** | False positives / (False positives + True negatives). Rate at which CIS signals false alarms. | 0–1 |
| **False negative rate** | False negatives / (False negatives + True positives). Rate at which CIS misses real events. | 0–1 |
| **Calibration quality** | Whether CIS confidence ranges are empirically calibrated: 70% confidence ranges should contain the true outcome approximately 70% of the time. Assessed via reliability diagram. | Coverage deviation |
| **Analyst usefulness rating** | Domain expert or analyst rating of whether the CIS output, as presented, would have been actionable without requiring post-hoc interpretation. | 1–5 scale (1 = not useful, 5 = clearly actionable) |

### 9.2 Supplementary Metrics

The following supplementary metrics are recorded where data permits but are not required for a complete track finding:

| Metric | Description |
|--------|-------------|
| **Signal-to-noise ratio** | Ratio of structurally relevant signals to total signals flagged over the evaluation period |
| **Cluster coherence rate** | Proportion of weak-signal clusters that correspond to a single identifiable structural driver in retrospective review |
| **Continuity-state correlation** | Correlation between CIS state classification at each window and subsequent observable outcome severity |
| **Trajectory accuracy** | Proportion of trajectory estimates that correctly projected the subsequent state transition |
| **Assumption accuracy** | Post-hoc review of CIS assumption statements: proportion that were empirically supported |

### 9.3 Metric Reporting Standards

All metrics are reported with:

- Point estimate
- 95% confidence interval (bootstrap or exact, as appropriate)
- Sample size
- Description of the outcome window used
- Any case exclusions and reasons

---

## Section 10 — Failure Conditions

CIS fails validation in a given track if any of the following conditions are met. A single failure condition is sufficient.

| Failure Condition | Threshold | Rationale |
|-------------------|-----------|-----------|
| **No measurable lead-time advantage** | Lead-time advantage not significantly positive at p < 0.05 across the evaluated case set | If CIS does not detect signals earlier than baselines, it provides no practical advance warning |
| **Outputs do not outperform simple baselines** | Precision and recall are not superior to the statistical baseline on both metrics simultaneously | A moving average with threshold crossing is available at near-zero cost; CIS must justify its complexity |
| **Analysts find outputs non-actionable** | Mean analyst usefulness rating < 3.0 on the 5-point scale, or > 50% of analysts rate the output at 1 or 2 | Diagnostic outputs that practitioners cannot use are not diagnostically useful, regardless of their formal properties |
| **Weak-signal clusters do not correspond to meaningful structure** | < 40% of flagged clusters correspond to a single identifiable structural driver in retrospective review | If clusters reflect noise rather than shared structural sources, the clustering capability has no diagnostic value |

### 10.1 Track-Level Failure vs. Global Failure

A single track failure does not constitute global validation failure. CIS may be valid for some system types and not others. Track-level failures are documented independently.

Global validation failure is declared if CIS fails on three or more of the four tracks, or if the simple statistical baseline outperforms CIS on both precision and recall in every evaluated track.

---

## Section 11 — Success Conditions

CIS demonstrates diagnostic value in a given track if all four of the following conditions are met.

| Success Condition | Threshold | Rationale |
|-------------------|-----------|-----------|
| **Meaningful signals emerge earlier** | Lead-time advantage is significantly positive (p < 0.05) and operationally meaningful (at least one analysis period or one hour, whichever is track-appropriate) | Earlier detection is the primary claimed value of CIS weak-signal analysis |
| **Continuity-state assessments correlate with later outcomes** | Pearson correlation between CIS state fragility score and subsequent outcome severity ≥ 0.40, or equivalent non-parametric measure | State classifications must track the underlying system condition, not merely the immediate input values |
| **Weak-signal clusters provide useful diagnostic information** | ≥ 60% of flagged clusters correspond to a retrospectively confirmed structural driver, AND mean analyst usefulness rating for cluster outputs ≥ 3.5 | Clusters must identify real shared-driver structure, not noise patterns, and must be presented in a form practitioners can interpret |
| **Analysts consistently rate outputs as helpful** | Mean analyst usefulness rating ≥ 3.5 across all evaluator assessments, with < 20% of ratings at 1 or 2 | Consistent usefulness across evaluators indicates the value is in the diagnostic content, not the preferences of individual evaluators |

### 11.1 Partial Success

A track may be classified as PARTIALLY VALIDATED if two or three of the four success conditions are met and none of the failure conditions are triggered. See Section 12 for outcome classification.

---

## Section 12 — Validation Outcome Categories

### 12.1 Outcome Definitions

| Category | Definition |
|----------|------------|
| **VALIDATED** | All four success conditions met. No failure conditions triggered. CIS demonstrates measurable diagnostic value in this domain. The finding supports deployment consideration in this system type. |
| **PARTIALLY VALIDATED** | Two or three success conditions met. No failure conditions triggered. CIS demonstrates value in some diagnostic dimensions but not all. The specific successful dimensions are identified and the gaps are documented. Further development or evaluation is warranted in the gap areas before deployment recommendation. |
| **INCONCLUSIVE** | Fewer than two success conditions met, and fewer than one failure condition triggered. Evidence is insufficient to determine whether CIS provides value. Primary causes: insufficient sample size, data quality issues, or metric variability too large to distinguish CIS from baseline. The appropriate response is not a revised method — it is additional data. |
| **NOT VALIDATED** | One or more failure conditions triggered. CIS does not demonstrate measurable diagnostic value in this domain. The finding must document which specific failure condition was met. The finding does not preclude validation in other domains or tracks. |

### 12.2 No Upward Reclassification

Outcome categories are determined by the pre-specified conditions in Sections 10 and 11. An INCONCLUSIVE finding may not be reclassified as PARTIALLY VALIDATED on the basis of post-hoc metric adjustment. A NOT VALIDATED finding may not be reclassified on any basis. Reclassification requires a new evaluation round with a pre-specified protocol.

### 12.3 Track-Level Reporting

Each track produces an independent outcome classification. The global summary reports the distribution across tracks. No weighted aggregation is applied. Four independent track outcomes are the final product of this program.

### 12.4 Outcome Reporting Format

Each track report documents:

- The outcome classification
- The specific metrics that drove the classification
- The failure condition or success condition thresholds that were and were not met
- The baseline comparisons that informed the classification
- The sample size and evaluation period
- Known limitations of the evaluation (data gaps, protocol deviations, evaluator sample constraints)

---

## Section 13 — Protocol Integrity

### 13.1 Pre-Registration Requirement

Before data collection or analysis begins in any track, the following must be documented and locked:

- The specific case set or data set to be evaluated
- The outcome window (the time period after a CIS signal within which an adverse event must occur for the signal to be counted as a true positive)
- The baseline systems to be compared
- The evaluators and their qualifications
- The scoring rules

Changes after data analysis begins are protocol violations and must be reported.

### 13.2 Sample Size Requirements

No track result is reportable with fewer than the following:

| Track | Minimum Sample |
|-------|---------------|
| A — Historical Investigations | 20 cases across at least 3 case categories |
| B — Hospitals and Clinical Systems | 200 patient episodes (for patient deterioration) OR 12 months of system-level operational data with ≥ 20 adverse events (for system-level) |
| C — Cities and Infrastructure | 12 months of operational data at ≥ 2 sites with ≥ 10 documented degradation events per site |
| D — Disaster and Fire Prevention | 15 events of each event type evaluated (wildfire OR flood OR disaster response), each with reconstructed pre-event record |

Evaluations not meeting minimum sample size are reported as INCONCLUSIVE regardless of observed metric values.

### 13.3 Data Quality Documentation

Each track report documents the data quality for its primary inputs:

- Completeness (proportion of expected observations actually available)
- Consistency (whether the same metric is recorded using the same definition across the evaluation period)
- Timeliness (whether timestamps are reliable)
- Independence (whether the data was generated independently of the outcome, or whether outcome knowledge may have influenced how the data was recorded)

Known data quality issues are reported and their potential effect on findings is assessed.

---

## Section 14 — Relationship to CIS Implementation

This validation program is independent of the CIS implementation program. It does not propose changes to `CIS_OPERATIONAL_SPECIFICATION.md`, to the diagnostics engine, or to any module. It does not introduce new CIS primitives or modify existing ones.

The diagnostics engine produces outputs. This program evaluates whether those outputs are useful in practice.

If validation finds that CIS outputs are not useful in a given domain, the response is not to revise CIS until the outputs look more favorable. The response is to document the failure, understand its cause, and determine whether a genuine diagnostic limitation exists or whether the application domain was a poor match for CIS primitives.

Retroactive adjustment of CIS to improve validation metrics on already-evaluated cases is a methodological failure equivalent to p-hacking. Any revision to CIS following a NOT VALIDATED finding requires a new evaluation round on a new data set.

---

## Appendix A — CIS Indicator Mapping by Track

To apply CIS in each domain, the five CIS indicator dimensions must be mapped to domain-observable quantities. These mappings are starting points and must be refined by domain experts before validation begins.

### Track A — Investigations

| CIS Dimension | Investigation Equivalent |
|--------------|------------------------|
| Operational load | Active case demands relative to investigative capacity |
| Recovery time | Time to re-establish investigative momentum following lead failure or resource disruption |
| Admissibility boundary | Evidentiary threshold modifications; jurisdictional or procedural constraint changes |
| Synchronization | Coordination coherence across investigation units or jurisdictions |
| Buffer | Reserve capacity (personnel, analytical resources, intelligence access) above current commitment |

### Track B — Hospitals and Clinical Systems

| CIS Dimension | Clinical Equivalent (Patient-Level) | Clinical Equivalent (System-Level) |
|--------------|-------------------------------------|-------------------------------------|
| Operational load | Physiological demand on primary organ system or function | ED/ICU occupancy rate relative to capacity |
| Recovery time | Time for vital signs to return to stable range after perturbation | Time for system to recover to baseline occupancy after surge |
| Admissibility boundary | Change in treatment eligibility criteria or triage threshold | Change in admission criteria, diversion policy, or bypass activation |
| Synchronization | Consistency of physiological regulatory responses | Staff-to-patient ratio stability; interdepartmental transfer coherence |
| Buffer | Reserve physiological capacity (cardiopulmonary, renal) | Surge capacity, staffing reserve above scheduled coverage |

### Track C — Infrastructure

| CIS Dimension | Infrastructure Equivalent |
|--------------|--------------------------|
| Operational load | Demand on network or system relative to rated capacity |
| Recovery time | Mean time to restore service following fault event |
| Admissibility boundary | Threshold changes in load acceptance policy, supply source switching |
| Synchronization | Coordination between infrastructure segments; phase or timing stability in energy networks |
| Buffer | Reserve capacity above current operational commitment |

### Track D — Disaster and Fire Prevention

| CIS Dimension | Wildfire Equivalent | Flood Equivalent |
|--------------|---------------------|-----------------|
| Operational load | Fire weather severity index relative to suppression capacity | Precipitation rate relative to catchment drainage capacity |
| Recovery time | Vegetation recovery rate after prior burn events | Recession time of prior flood events |
| Admissibility boundary | Fuel moisture threshold defining high-risk zone boundaries | Levee certification status; land use change in catchment |
| Synchronization | Spatial coherence of weather conditions across risk region | Spatial coherence of saturation levels across catchment |
| Buffer | Suppression resource pre-positioning relative to current risk | Reservoir and detention capacity relative to current inflow |

---

## Appendix B — Analyst Usefulness Rating Scale

Used in all tracks for the **analyst usefulness rating** metric. Evaluators are provided this scale and rating criteria before they review any CIS outputs.

| Rating | Label | Criteria |
|--------|-------|----------|
| 1 | Not useful | The output does not identify anything actionable. The signal, if present, is not distinguishable from noise or is stated at too high an uncertainty to act on. |
| 2 | Marginally useful | The output identifies something potentially relevant, but the framing or uncertainty level makes it impractical to act on without substantial additional interpretation. |
| 3 | Moderately useful | The output identifies a relevant signal that I would note and monitor. I would not act on it immediately without corroboration, but it changes my attention allocation. |
| 4 | Useful | The output identifies a signal that I would act on — either by increasing monitoring, initiating a review, or alerting relevant stakeholders. The uncertainty is appropriately characterized. |
| 5 | Clearly actionable | The output identifies a specific, well-characterized signal that directly informs a decision or action. The diagnostic framing reduces ambiguity rather than adding it. |

Evaluators record ratings before outcome reveal. Ratings recorded after outcome reveal are excluded from the primary analysis.

---

## Appendix C — Validation Timeline and Sequencing

No sequencing is mandated between tracks. Tracks may be initiated in any order based on data availability, partner access, and evaluation team capacity. Each track is a self-contained evaluation.

Within each track, the following sequence is mandatory:

1. Protocol pre-registration (case set, outcome window, baselines, evaluators, scoring rules)
2. Data quality assessment and documentation
3. Data partition (pre-outcome record separated from outcome record)
4. CIS analysis and output sealing
5. Expert blind evaluation and baseline computation
6. Analyst usefulness pre-registration (evaluators document which outputs they consider significant before outcome reveal)
7. Outcome reveal
8. Scoring
9. Track report production

Steps 4 and 5 may be conducted in parallel. Steps 6 and 7 must be completed before Step 7 begins. Steps 7 onward are sequential.

---

*CIS Validation Program v1.0 — 2026-05-30*
*This document defines the external validation framework. It does not constitute a validation finding. Findings are produced only upon completion of each track.*
