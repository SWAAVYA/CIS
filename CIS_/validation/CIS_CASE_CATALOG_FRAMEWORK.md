# CIS Case Catalog Framework

**Date:** 2026-05-30
**Version:** 1.0
**Status:** FRAMEWORK — No cases evaluated

**Authority document:** CIS_VALIDATION_PROGRAM.md
**Scope:** Case selection, management, and blinding infrastructure for all four validation tracks

---

## Purpose of This Document

This document converts the validation program into an executable case-selection and management framework. It defines the structures, criteria, schemas, workflows, and governance rules that validation studies will use.

It does not evaluate cases.
It does not score CIS.
It does not modify CIS.

Nothing in this document constitutes a validation finding. A populated catalog is a precondition for validation, not evidence of it.

---

## Section 1 — Purpose of the Catalog

The case catalog serves four distinct functions. Each function has distinct access and governance requirements. Conflating them produces either blinding failures or administrative paralysis.

### 1.1 Source of Validation Candidates

The catalog is the primary record of cases under consideration for CIS evaluation. A case does not exist as a validation candidate unless it appears in the catalog with a documented readiness status. Informal identification of interesting cases outside the catalog does not constitute case selection.

This function ensures that case selection is documented before evaluation begins, preventing post-hoc selection of cases favorable to CIS.

### 1.2 Provenance Record

For each case, the catalog records:

- Where the case data came from
- What the data contained at the time of case registration
- What was known about the outcome at the time of registration
- What sources were identified as independent

Provenance records are immutable after the case reaches **Ready For Blind Evaluation** status. Changes to a case record after that point are logged as amendments, not replacements, and require governance approval.

This function ensures that the data a CIS evaluation actually used can be reconstructed and audited by any future reviewer who wishes to assess whether the evaluation was conducted as described.

### 1.3 Blinding Control Record

The catalog tracks the blinding status of every case at every stage:

- Who holds the outcome data
- Who has been exposed to the outcome
- Which evaluators are cleared to work on the case
- Whether any blinding breach has been recorded

This function ensures that the blind evaluation protocol specified in `CIS_VALIDATION_PROGRAM.md` Section 8 is operationally maintained, not merely stated as a requirement.

### 1.4 Evaluation Inventory

The catalog provides a complete accounting of where every case stands in the validation lifecycle. At any point, the catalog can answer:

- How many cases are ready for evaluation?
- How many are in progress?
- How many are complete?
- What is the current evidence coverage across tracks?
- What is the readiness gap before the minimum sample size for any track is reached?

This function enables planning and prevents premature reporting. No validation claim is made until the inventory shows sufficient completed cases.

---

## Section 2 — Case Inclusion Criteria

A case must satisfy all five mandatory criteria to be admitted to the catalog. Partial satisfaction does not result in provisional admission — it results in exclusion with a documented reason and an invitation to resubmit when the criterion can be met.

### Criterion I — Known Outcome

**Rationale:** Validation requires a ground truth. Without a known outcome, CIS signals cannot be classified as true positives or false positives. Validation against an unknown or disputed outcome produces no usable finding.

**Pass condition:** The adverse event, system failure, or resolution that defines the case outcome is publicly documented, or documented in a source to which the evaluation team has confirmed access. The outcome date is known to within the precision required by the case's outcome window (see Section 4, track-specific templates).

**Exclusion condition:** The outcome is ongoing, disputed, unresolved, or known only to parties who cannot provide documented access. Cases where the outcome is known but the outcome date cannot be established with sufficient precision to define an outcome window are excluded.

---

### Criterion II — Reconstructable Timeline

**Rationale:** CIS analysis is applied chronologically. Each analysis window may only use data available up to that date. A case whose pre-outcome record cannot be partitioned into reliable chronological windows cannot be evaluated without violating the blind protocol.

**Pass condition:** The pre-outcome record can be partitioned into discrete observation windows with reliable timestamps. Each observation window contains only information that was available at that time — not information that was later recorded retroactively. The number and spacing of windows is sufficient to apply CIS analysis meaningfully (see Criterion III).

**Exclusion condition:** The primary data sources do not carry reliable timestamps, or timestamps cannot be independently verified. Cases where the record was constructed after the outcome (e.g., retrospective narratives without primary source documentation) are excluded unless primary sources with timestamps are available alongside the retrospective record.

---

### Criterion III — Sufficient Pre-Outcome Observations

**Rationale:** CIS trajectory and fragility analysis requires multi-period observation histories. A case with only one or two pre-outcome observation windows produces only snapshot-level CIS outputs, which the validation program (`CIS_VALIDATION_PROGRAM.md` Section 3.5) treats as insufficient evidence for fragility and trend claims. Such cases cannot validate the OLS-based trend analysis capabilities of the diagnostics engine.

**Pass condition:** The pre-outcome record contains at least four chronologically distinct observation windows before the outcome event, with a time span sufficient for the system under study to exhibit meaningful variation in continuity indicators. The minimum observation span is domain-specific and defined in the track-specific templates (Section 4).

**Exclusion condition:** Fewer than four usable pre-outcome observation windows exist, or the observation windows are so densely clustered relative to the system's natural variation rate that they do not provide independent information. Cases where all observations occur within a single acute event window are excluded from trend analysis validation (they may be retained for anomaly detection validation only if this scope is explicitly documented).

---

### Criterion IV — Independent Source Availability

**Rationale:** Baseline comparison requires that the conventional detection timeline can be established from sources independent of the CIS analysis. If the only record of when a signal was recognized is the same document used for CIS analysis, the comparison is circular.

**Pass condition:** At least two independent sources document the state of the system at each observation window. The conventional baseline detection timeline can be established from at least one source that is fully independent of the primary CIS data source (e.g., an operational log, a published report, a court record, a regulatory filing, or a contemporaneous expert assessment).

**Exclusion condition:** Only a single source documents the pre-outcome system state, or all available sources derive from the same originating record. Cases where the only available documentation was produced by the entity most likely to have recognized and acted on signals (creating a documented-recognition circularity) are excluded unless a second independent source can be established.

---

### Criterion V — Ability to Blind Evaluators

**Rationale:** Evaluators must not know the outcome when assessing CIS outputs. If evaluators cannot be reliably blinded — because the outcome is widely known, because evaluators have prior direct knowledge of the case, or because the case materials contain embedded outcome references that cannot be removed — the evaluation is invalid regardless of its other properties.

**Pass condition:** Evaluators with no prior direct knowledge of the case can be identified. The pre-outcome record can be prepared in a form that does not contain direct outcome references. A data custodian can hold the outcome record separately and release it only at the scoring stage.

**Exclusion condition:** The case involves an event so publicly prominent that evaluators in the relevant domain cannot reasonably be found without prior knowledge. Pre-outcome documents contain outcome-disclosing embedded references (e.g., retrospective annotations, post-event corrections, or forward-looking statements) that cannot be cleanly removed without altering the informational content of the record. The data custodian arrangement cannot be maintained for operational or legal reasons.

---

## Section 3 — Case Exclusion Criteria

Cases that satisfy all five inclusion criteria are admitted. Cases that fail any inclusion criterion are excluded. The following list names the primary exclusion categories and their most common triggers. Every exclusion is documented in the case record with the specific criterion failed.

| Exclusion Category | Primary Trigger | Inclusion Criterion Failed |
|--------------------|----------------|---------------------------|
| **Insufficient chronology** | Fewer than four usable pre-outcome observation windows | Criterion III |
| **Unresolved outcome** | Case is ongoing or outcome is disputed | Criterion I |
| **Outcome leakage** | Pre-outcome documents contain outcome-disclosing content that cannot be removed | Criterion V |
| **Inadequate source quality** | Single-source record; no independent baseline source available | Criterion IV |
| **Non-reconstructable timeline** | Timestamps absent or unreliable; retrospective narrative without primary sources | Criterion II |
| **Evaluator exposure** | No qualified evaluator can be identified without prior case knowledge | Criterion V |
| **Outcome date ambiguity** | Outcome is known but cannot be dated within the required precision | Criterion I |
| **Observation window collapse** | All observations clustered within a single acute event; no inter-event variation | Criterion III |

### 3.1 Exclusion Is Not Permanent

An excluded case may be resubmitted if the exclusion criterion is resolved — for example, if an unresolved outcome later resolves, or if an additional independent source is identified. The resubmission is treated as a new catalog entry with a reference to the prior exclusion record.

### 3.2 Track-Specific Exclusions

Track-specific exclusion conditions are defined in the track-specific templates (Section 4). These are additions to, not replacements for, the five mandatory inclusion criteria.

---

## Section 4 — Track-Specific Candidate Templates

Each track has a standard template that operationalizes the general inclusion criteria for that domain. When a case is registered in the catalog, it is assessed against both the mandatory inclusion criteria (Section 2) and the applicable track template.

---

### Track A — Investigations

**Track objective:** Determine whether CIS identifies structurally relevant signals in investigative timelines earlier than conventional investigative recognition.

---

#### A1 — System Under Study

The investigative system: the organization, unit, or set of actors conducting the investigation, and the target system: the criminal, financial, or institutional activity under investigation. Both are distinct systems. CIS is applied to the investigative system as the primary subject (its continuity, capacity, coherence, and fragility are the diagnostic targets) and to the target system where observable indicators permit.

Candidate system types:
- Law enforcement investigation (kidnapping, missing persons, organized crime)
- Financial regulatory investigation (major fraud, market manipulation)
- Institutional integrity investigation (corruption, money laundering)
- Multi-agency joint investigation (cross-jurisdictional organized crime)

#### A2 — Outcome Event

The outcome event must be a discrete, datable occurrence that resolves the investigation or substantially changes its state. Examples:

| Outcome Type | Datable Criterion |
|-------------|------------------|
| Arrest or apprehension | Formal arrest record with date |
| Resolution (victim located) | Official report date |
| Prosecution commenced | Indictment filing date |
| Investigation formally closed | Official closure documentation |
| Major evidentiary breakthrough | Court or agency record establishing the date |

**Note:** Partial resolutions (e.g., one suspect arrested out of several) may define an outcome event if the event is discrete and documentable. The outcome event must be documented in a source independent of the primary investigation record.

#### A3 — Timeline Boundaries

| Boundary | Definition |
|----------|-----------|
| **Observation start** | The earliest date at which the investigative system came into existence or took a formal action on the case |
| **Observation end** | The date of the outcome event (exclusive — this date is in the blinded outcome record) |
| **Minimum pre-outcome span** | 30 days for acute investigations (kidnapping); 6 months for long-duration investigations (fraud, corruption) |
| **Minimum observation windows** | 4 discrete chronological windows across the pre-outcome span |
| **Window spacing** | At least 7 days between consecutive windows (to allow for meaningful system state change) |

#### A4 — Observation Sources

Required (at least two independent sources for each observation window):

| Source Type | Examples |
|------------|---------|
| Official investigative records | Case files, progress reports, inter-agency communications (where accessible) |
| Court and legal records | Warrants, subpoenas, court filings with dates |
| Media reporting | Contemporaneous news coverage with publication dates (not retrospective accounts) |
| Witness or informant records | Documented contact logs, interview records with dates |
| Financial records | Bank records, audit reports with filing dates (fraud/corruption cases) |

Track A-specific exclusion: Sources consisting entirely of retrospective journalistic reconstructions (written after the outcome was known) are excluded as primary chronological evidence. They may be used to identify primary sources but do not constitute observation windows themselves.

#### A5 — Blinding Requirements

- The outcome date and all post-outcome documents are held by the data custodian.
- Case materials provided to the CIS analyst are redacted to remove forward references, retrospective annotations, and any document dated after the observation end.
- Evaluators are selected from investigators, analysts, or criminologists with no documented prior direct knowledge of the specific case.
- Media coverage used as a source must be reviewed for outcome-revealing content. Articles published after the outcome event date are excluded from the pre-outcome record even if they contain contemporaneous factual claims.

#### A6 — Evaluation Notes

- The investigative system often lacks direct quantitative indicators (load values, buffer levels). CIS indicator mapping requires expert-assisted translation from qualitative records to quantitative proxies. This mapping must be documented before analysis and held constant across observation windows.
- Multi-agency cases require a decision about system boundary: is the system the lead agency only, the full investigative consortium, or each agency separately? This decision is made at case registration and cannot be changed after analysis begins.
- Organized crime cases may involve adversarial adaptation — the target system changes its own continuity in response to investigative pressure. Both the investigative system and the target system may be CIS subjects simultaneously. This must be explicitly noted in the evaluation design.

---

### Track B — Hospitals and Clinical Systems

**Track objective:** Determine whether CIS provides earlier or more coherent warning of clinical deterioration events and system-level capacity failures compared to existing monitoring systems, NEWS/MEWS scoring, and expert assessment.

---

#### B1 — System Under Study

Two levels of analysis are distinguished:

| Level | System | CIS Subject |
|-------|--------|------------|
| **Patient-level** | Individual patient or patient cohort | Physiological continuity of the patient |
| **System-level** | ED, ICU, ward, or staffing unit | Operational continuity of the clinical system |

Each case must specify which level is being evaluated. Mixed-level cases are not admitted in a single evaluation run.

#### B2 — Outcome Event

| Level | Outcome Event | Datable Criterion |
|-------|--------------|------------------|
| Patient-level | Rapid Response Team call, ICU admission, cardiac arrest, death, clinical deterioration triggering escalation | Clinical record timestamp |
| System-level | ED diversion activation, ICU saturation event, staffing crisis (mandatory overtime threshold breach), declared surge event | Operational record, incident report, or administrative log with date and time |

#### B3 — Timeline Boundaries

| Boundary | Patient-Level | System-Level |
|----------|--------------|-------------|
| **Observation start** | Hospital admission or first available vital sign record | Start of the operational data period (minimum 12 months before first evaluated event) |
| **Observation end** | Outcome event time (exclusive) | End of the evaluation period |
| **Minimum pre-outcome span** | 12 hours for acute deterioration; 72 hours preferred | 12 months of continuous operational data |
| **Minimum observation windows** | 4 discrete vital sign or assessment records | 4 distinct time periods across the operational data span |
| **Window spacing** | Per clinical assessment cycle (minimum 2 hours for acute cases) | Monthly operational summaries or weekly if sufficient events exist |

#### B4 — Observation Sources

| Source Type | Description |
|------------|-------------|
| EHR vital signs | Timestamped automated or manually recorded vital sign observations |
| Laboratory results | Timestamped lab values with reference ranges |
| Clinical assessment records | Nursing assessments, physician notes with timestamps |
| NEWS2 / MEWS scores | Computed scores at each assessment point |
| Staffing logs | Scheduled vs. actual staffing, agency usage, overtime records |
| Bed occupancy records | Timestamped occupancy counts by unit |
| Transfer records | Inter-unit or inter-facility transfer logs with timestamps |
| Incident reports | Formal incident documentation with timestamps |

Track B-specific exclusion: Cases where the outcome was recorded retroactively without contemporaneous documentation of the deterioration process are excluded. Patient cases where fewer than four independent vital sign assessments are available before the outcome event are excluded.

**Ethics and data governance:** All patient-level data requires institutional ethics approval and appropriate de-identification before registration in the catalog. No patient-identifiable data is admitted. The catalog records only de-identified case identifiers, data set references, and metadata.

#### B5 — Blinding Requirements

- Patient-level: The CIS analyst receives only the pre-outcome vital sign and assessment record. The outcome event type, time, and documentation are held by the data custodian.
- System-level: The CIS analyst receives the operational data record without the incident log identifying the adverse events being evaluated. The incident log is held by the data custodian.
- Clinician evaluators perform their own signal assessment on the same pre-outcome data independently of CIS outputs, before outcome reveal.
- CIS indicator mappings (physiological quantities to CIS dimensions) are defined and locked before analysis begins at the case type level, not the individual case level.

#### B6 — Evaluation Notes

- NEWS2 / MEWS scores are the primary operational baseline. The comparison must use the actual score computed at each assessment time, not a score computed retrospectively with the benefit of additional knowledge.
- Staffing system cases may exhibit strong day-of-week and seasonal patterns. The statistical baseline (Section 7 of the validation program) must account for these patterns explicitly.

---

### Track C — Cities and Infrastructure

**Track objective:** Determine whether CIS detects continuity degradation in urban infrastructure systems earlier or more coherently than existing monitoring and operational review.

---

#### C1 — System Under Study

| System Type | CIS Diagnostic Focus |
|------------|---------------------|
| Water distribution network | Pressure continuity; service interruption fragility; supply buffer |
| Transport network | Throughput continuity; load displacement between routes; recovery after disruption |
| Energy network | Supply buffer; frequency stability; load displacement between generation sources |
| Emergency services | Response capacity continuity; staffing fragility; load displacement to contingent resources |

#### C2 — Outcome Event

| System | Outcome Event | Datable Criterion |
|--------|--------------|------------------|
| Water | Service interruption affecting ≥500 connections, boil-water advisory, main failure | Utility incident record, regulatory report |
| Transport | Network segment failure, bridge/tunnel closure, sustained >50% capacity degradation | Operational record, incident report |
| Energy | Unplanned outage ≥1MW, grid emergency event, load shedding activation | Operator log, regulatory filing |
| Emergency services | Declared capacity crisis, mutual aid request, mass casualty event activation | Official declaration record |

#### C3 — Timeline Boundaries

| Boundary | Definition |
|----------|-----------|
| **Observation start** | At least 24 months before the earliest outcome event in the evaluation set |
| **Observation end** | The outcome event date (exclusive) |
| **Minimum pre-outcome span** | 12 months of continuous operational data before the outcome event |
| **Minimum observation windows** | 4 distinct temporal windows across the pre-outcome span |
| **Minimum events per site** | 10 documented degradation events within the evaluation period (per validation program Section 13.2) |

#### C4 — Observation Sources

| Source Type | Description |
|------------|-------------|
| SCADA / operational monitoring logs | Sensor readings with timestamps; alarm logs with timestamps |
| Maintenance records | Scheduled and unscheduled maintenance events with dates |
| Asset inspection records | Condition assessments with inspection dates |
| Regulatory reliability reports | Filed reports with reporting period start and end dates |
| Incident and outage databases | Published outage event records with start, end, and magnitude |
| Capital investment records | Infrastructure investment logs (for admissibility boundary tracking) |

Track C-specific exclusion: Sites where SCADA or operational monitoring data has been retroactively edited or imputed (common after major outage events) require documentation of the extent and method of imputation. Cases where > 20% of the pre-outcome monitoring record is imputed are excluded.

#### C5 — Blinding Requirements

- The incident database identifying outcome events is held by the data custodian. The operational monitoring data is provided to the CIS analyst without the incident event identifiers.
- Infrastructure operators reviewing CIS outputs for the analyst usefulness rating may not have participated in or have direct knowledge of the post-incident review for the specific events being evaluated.

#### C6 — Evaluation Notes

- Infrastructure systems exhibit strong seasonality and planned maintenance cycles. CIS baseline calibration must account for these. Planned maintenance events are not continuity failures — they are scheduled admissibility boundary modifications and must be coded accordingly.
- Multi-system load displacement cases (e.g., a water network degradation causing increased load on emergency services) require pre-defined inter-system boundaries to be registered at case admission.

---

### Track D — Disaster and Fire Prevention

**Track objective:** Determine whether CIS produces earlier or more structured pre-event warning signals compared to existing operational warning systems.

---

#### D1 — System Under Study

| System | CIS Diagnostic Focus |
|--------|---------------------|
| Wildfire risk region | Fuel moisture buffer; fire weather load; admissibility boundary at risk zone edges; fragility accumulation during drought |
| Flood-prone catchment | Catchment saturation buffer; precipitation load; levee/channel admissibility boundary condition; fragility accumulation across wet season |
| Disaster response system | Pre-positioning buffer; demand load; coordination synchronization; trajectory toward response capacity breach |

#### D2 — Outcome Event

| System | Outcome Event | Datable Criterion |
|--------|--------------|------------------|
| Wildfire | Fire ignition resulting in ≥500 acres burned, OR official emergency declaration | Incident date in NIFC/EFFIS database, official declaration date |
| Flood | Flood event exceeding minor flood stage at reference gauge, OR official flood warning issued | Gauge record, NWS archive |
| Disaster response | Mutual aid activation, Presidential disaster declaration, or resource depletion requiring external resupply | Official declaration or request record |

#### D3 — Timeline Boundaries

| Boundary | Wildfire | Flood | Disaster Response |
|----------|---------|-------|------------------|
| **Observation start** | Beginning of the relevant dry/fire season (minimum 90 days before event) | Beginning of the relevant wet season (minimum 60 days before event) | Beginning of the threat period (minimum 30 days before event) |
| **Observation end** | Event ignition date (exclusive) | Flood onset date (exclusive) | Activation date (exclusive) |
| **Minimum pre-outcome span** | 90 days | 60 days | 30 days |
| **Minimum observation windows** | 6 (bi-weekly minimum) | 4 (weekly minimum) | 4 |

#### D4 — Observation Sources

| System | Source |
|--------|--------|
| Wildfire | RAWS fuel moisture and weather records; NDVI/ERC fire danger indices; spot weather forecasts with issue dates; historical burn perimeter records |
| Flood | River gauge records; precipitation records (NOAA); soil moisture records; reservoir level records; prior-season snowpack (where applicable) |
| Disaster response | Resource pre-positioning records; personnel availability logs; prior-incident after-action reports; mutual aid agreement activation records |

Track D-specific exclusion: Events for which no pre-event environmental monitoring record exists with reliable timestamps are excluded. Events classified only as retrospective reconstructions without primary source data from the pre-event period are excluded.

#### D5 — Blinding Requirements

- The event database (ignition dates, flood stage exceedance dates, declaration dates) is held by the data custodian.
- Pre-event monitoring records are provided to the CIS analyst without event outcome identifiers.
- Fire behavior analysts, hydrologists, or emergency management specialists reviewing CIS outputs must not have directly participated in the specific event's operational response.
- Official warnings issued before the event (Watch, Warning, Advisory) are part of the pre-outcome record. They constitute the primary operational baseline and must be preserved exactly as issued, with original timestamps.

#### D6 — Evaluation Notes

- Official warnings (NWS Fire Weather Watch, Flood Watch, etc.) define the primary operational baseline. The comparison is between when CIS signals fragility/trajectory-to-threshold and when the first official advisory level was issued.
- Environmental systems exhibit strong seasonal patterns. The statistical baseline must use climatological norms as the comparison reference, not a naive moving average.
- Spatial extent matters: a wildfire risk region or flood catchment is a geographic system, not a point. CIS indicator values must be spatially aggregated at a defined geographic unit before analysis. The aggregation method is defined at case admission and held constant.

---

## Section 5 — Case Metadata Schema

Every case in the catalog carries a complete metadata record. The schema is mandatory. No case is admitted with partial metadata. If a field value is unknown at admission, it is recorded as `null` with a required explanation note.

```
CaseRecord {

  // Identity
  caseId              : string          // Unique identifier. Format: [TRACK]-[YYYY]-[SEQ]
                                        // Example: A-2026-001, B-2026-003, D-2026-002
  track               : enum            // "A" | "B" | "C" | "D"
  title               : string          // Short descriptive title. Does not contain outcome information.
  caseType            : string          // Track-specific system type (see Section 4 templates)

  // Chronology
  observationStart    : ISO8601 date    // First available pre-outcome observation date
  observationEnd      : ISO8601 date    // Last date of pre-outcome record (day before outcome event)
  outcomeDate         : ISO8601 date    // Date of outcome event. HELD BY DATA CUSTODIAN.
                                        // Not stored in the working catalog record.
                                        // Stored separately in the blinded outcome record.
  observationWindowCount : integer      // Number of discrete chronological observation windows
                                        // available in the pre-outcome record

  // Outcome
  outcomeKnown        : boolean         // true if outcome is confirmed known and documented
  outcomeType         : string          // Brief description of outcome category (no specific details)
                                        // Example: "capacity breach event", "adverse clinical event"
                                        // Must not disclose outcome details to non-cleared personnel

  // Source Inventory
  sourceInventory     : SourceRecord[]  // Array; see SourceRecord schema below

  // Evidence Quality
  evidenceQuality     : enum            // "High" | "Medium" | "Low" | "Insufficient"
                                        // Assigned per Section 8 criteria
  evidenceQualityNotes : string         // Required rationale for the assigned quality level

  // Blinding
  blinded             : boolean         // true if outcome record is held separately by custodian
  dataCustodian       : string          // Role identifier of the data custodian (not personal name)
  blindingBreaches    : BlindingBreach[] // Array; empty if no breach recorded; see schema below
  evaluatorClearance  : string[]        // List of evaluator role identifiers cleared for this case
                                        // Evaluators who have seen outcome data must not appear here

  // Inclusion Assessment
  criterionI_met      : boolean         // Known outcome
  criterionII_met     : boolean         // Reconstructable timeline
  criterionIII_met    : boolean         // Sufficient pre-outcome observations
  criterionIV_met     : boolean         // Independent source availability
  criterionV_met      : boolean         // Ability to blind evaluators
  inclusionNotes      : string          // Required if any criterion assessment was non-trivial

  // Baseline Comparisons
  baseline_operational : string         // Description of the existing operational method baseline
  baseline_expert      : string         // Description of the expert judgment baseline
  baseline_statistical : string         // Description of the statistical baseline to be applied
  baselineNotes        : string         // Any constraints or limitations on baseline availability

  // CIS Indicator Mapping
  indicatorMapping    : IndicatorMap    // Mapping of CIS five dimensions to domain observables
                                        // Must be defined before analysis begins
  indicatorMappingApproved : boolean    // true when a domain expert has reviewed and approved
  indicatorMappingApprovedBy : string   // Role identifier of approving domain expert

  // Lifecycle
  readinessStatus     : enum            // "Candidate" | "Collecting Data" | "Ready For Blind Evaluation"
                                        //  | "Evaluation In Progress" | "Completed" | "Excluded"
  readinessHistory    : StatusChange[]  // Ordered log of all status transitions; see schema below
  exclusionReason     : string | null   // Required if readinessStatus is "Excluded"
  exclusionCriterion  : string | null   // Criterion failed (e.g., "Criterion III") if excluded

  // Assignment
  evaluatorAssigned   : string | null   // Role identifier of assigned evaluator; null until assigned
  caseManagerAssigned : string          // Role identifier of case manager responsible for this record

  // Results (populated only after Completed status)
  evaluationSealDate  : ISO8601 date | null   // Date CIS outputs were sealed (before outcome reveal)
  outcomRevealDate    : ISO8601 date | null   // Date outcome was revealed to scoring team
  scoringCompleteDate : ISO8601 date | null   // Date scoring was completed
  trackOutcome        : enum | null           // null until complete; see Section 12

  // Administrative
  registrationDate    : ISO8601 date    // Date the case was first entered in the catalog
  lastModifiedDate    : ISO8601 date    // Date of most recent modification to this record
  version             : integer         // Incremented on each modification; starts at 1
  notes               : string          // Free text for any additional relevant information
}
```

```
SourceRecord {
  sourceId            : string          // Unique within the case record
  sourceType          : string          // E.g., "court record", "SCADA log", "EHR", "news archive"
  description         : string          // What this source contains
  dateRange           : string          // Date range covered by this source
  accessMethod        : string          // How this source was or will be accessed
  isIndependent       : boolean         // Whether this source is independent of the primary record
  isPreOutcome        : boolean         // Whether all content is dateable to before the outcome event
  qualityNotes        : string          // Any known quality issues (gaps, imputation, retroactive edits)
}
```

```
BlindingBreach {
  breachDate          : ISO8601 date    // Date the breach was identified
  affectedPersonnel   : string[]        // Role identifiers of personnel affected
  breachDescription   : string          // What outcome information was exposed
  breachCause         : string          // How the breach occurred
  remediation         : string          // Action taken (e.g., "evaluator removed from case")
  caseExcluded        : boolean         // Whether the case was excluded from primary analysis
}
```

```
StatusChange {
  fromStatus          : string          // Previous readiness status
  toStatus            : string          // New readiness status
  changeDate          : ISO8601 date    // Date of the transition
  authorizedBy        : string          // Role identifier of the governance actor who approved
  reason              : string          // Reason for the transition
}
```

```
IndicatorMap {
  operationalLoad     : string          // What observable quantity maps to the load dimension
  recoveryTime        : string          // What observable quantity maps to the recovery dimension
  admissibilityBoundary : string        // What observable quantity maps to the boundary dimension
  synchronization     : string          // What observable quantity maps to the sync dimension
  buffer              : string          // What observable quantity maps to the buffer dimension
  mappingRationale    : string          // Why these mappings are appropriate for this system type
}
```

---

## Section 6 — Readiness Classification

Every case has exactly one readiness status at any given time. Status transitions are logged in `readinessHistory` and require governance authorization (see Section 11).

---

### Status: CANDIDATE

**Definition:** The case has been identified as potentially suitable for validation. Metadata registration is incomplete or inclusion criteria assessment is pending.

**Entry criteria:** A case is a Candidate when it is first entered in the catalog with at least a `caseId`, `track`, `title`, `registrationDate`, and a partially completed metadata record.

**Exit criteria (forward):** All five inclusion criteria are assessed as met, the source inventory is complete, the evidence quality assessment is complete, and the indicator mapping is defined. Moves to **Collecting Data**.

**Exit criteria (exclusion):** Any inclusion criterion is assessed as not met. Moves to **Excluded** with documented reason.

**Required actions in this status:**
- Complete source inventory
- Assess all five inclusion criteria
- Document preliminary outcome type (no details)
- Assign a case manager

---

### Status: COLLECTING DATA

**Definition:** The case meets all inclusion criteria. Data collection and preparation are in progress — organizing the pre-outcome record, verifying source independence, preparing the data partition.

**Entry criteria:** All five inclusion criteria met. Evidence quality assessed. Source inventory complete.

**Exit criteria (forward):** Pre-outcome record is complete, partitioned, and reviewed. Outcome record is transferred to data custodian and confirmed held separately. Indicator mapping is approved by a domain expert. Evaluator is assigned. Moves to **Ready For Blind Evaluation**.

**Exit criteria (exclusion):** A data quality problem is identified during collection that fails an inclusion criterion. Moves to **Excluded** with documented reason.

**Required actions in this status:**
- Construct the pre-outcome record partition (chronological windows assembled)
- Transfer outcome record to data custodian; obtain custodian confirmation
- Obtain domain expert approval of indicator mapping
- Assign cleared evaluator
- Document all baseline sources

---

### Status: READY FOR BLIND EVALUATION

**Definition:** The case is fully prepared. The pre-outcome record is assembled and verified. The outcome record is with the data custodian. An evaluator is assigned. CIS analysis has not yet begun.

**Entry criteria:** Pre-outcome record complete and partitioned. Outcome with custodian. Indicator mapping approved. Evaluator assigned and cleared. Expert baseline evaluator identified.

**Exit criteria (forward):** CIS analysis begins. Moves immediately to **Evaluation In Progress**.

**Exit criteria (exclusion):** A blinding breach is discovered before analysis begins. Moves to **Excluded**.

**Required actions before this status transition:**
- Governance review and approval (see Section 11)
- Confirm evaluator has no prior knowledge of the case
- Record the evaluation start date

---

### Status: EVALUATION IN PROGRESS

**Definition:** CIS analysis is active. The evaluator is working through the pre-outcome record chronologically. CIS outputs are being produced and timestamped but not yet sealed.

**Entry criteria:** Governance authorization received. Evaluator has begun analysis.

**Exit criteria (forward):** CIS analysis is complete across all observation windows. CIS outputs are sealed (timestamped and submitted to a second data custodian). Expert blind evaluation is complete. Analyst usefulness pre-registration is complete. Outcome reveal is requested from the data custodian. Moves to **Completed** once scoring is finished.

**Exit criteria (exclusion):** A blinding breach occurs during evaluation. Moves to **Excluded** from primary analysis; breach is documented.

**Required actions in this status:**
- CIS outputs produced for each observation window in chronological order
- CIS output sealing: outputs submitted to a second data custodian before outcome reveal
- Expert blind evaluation conducted independently
- Analyst usefulness ratings recorded before outcome reveal
- Scoring team constituted (separate from analysis team)

---

### Status: COMPLETED

**Definition:** CIS analysis is sealed. Outcome has been revealed. Scoring is complete. A track report has been produced for this case.

**Entry criteria:** CIS outputs sealed. Outcome revealed. Scoring complete. Case-level report produced.

**Exit criteria:** Completed cases do not exit this status. They are permanent records.

**Required artifacts at completion:**
- Sealed CIS output record (timestamped, version-controlled)
- Expert blind evaluation record
- Analyst usefulness rating records
- Baseline comparison results
- Scoring results with metric values
- Case-level track report

---

### Status: EXCLUDED

**Definition:** The case does not meet inclusion criteria, or a protocol violation made the case unusable for primary analysis.

**Entry criteria:** Any inclusion criterion assessment is negative, OR a blinding breach is documented.

**Exit criteria:** Excluded cases may be resubmitted as new catalog entries if the exclusion condition resolves. The prior exclusion record is retained and referenced.

**Required documentation at exclusion:**
- The specific criterion failed or violation documented
- Evidence supporting the exclusion decision
- Whether the case may be resubmitted (and under what conditions)

---

## Section 7 — Blinding Protocol

The blinding protocol operationalizes the requirements of `CIS_VALIDATION_PROGRAM.md` Section 8 at the case level. Every case in the catalog must implement all four components.

---

### 7.1 Outcome Concealment

**What must be concealed:** The outcome event type, date, magnitude, and all documents dated after the outcome event.

**Mechanism:** At the point of transition from **Collecting Data** to **Ready For Blind Evaluation**, all outcome-disclosing materials are transferred to a designated data custodian. The data custodian role is defined in Section 11. The transfer is confirmed in writing (email, secure messaging, or formal receipt record). The confirmation is stored in the case record.

**The working catalog record does not contain the outcome date.** The `outcomeDate` field exists in the schema definition but is populated only in the custodian's held record, not in the catalog record accessible to evaluators or case managers.

**Release condition:** The data custodian releases outcome materials only upon receiving written authorization from the Outcome Authorization authority (see Section 11), after receiving confirmation that CIS outputs have been sealed.

---

### 7.2 Timeline Partitioning

**What must be partitioned:** The full case record is divided into exactly two partitions before analysis begins:

| Partition | Contents | Access |
|-----------|---------|--------|
| **Pre-outcome record** | All observations, documents, and sources dated before the outcome event | CIS analyst, expert blind evaluator |
| **Outcome record** | Outcome event documentation and all subsequent materials | Data custodian only |

**Partition verification:** Before CIS analysis begins, the case manager certifies that the pre-outcome record has been reviewed for forward references, retrospective annotations, and post-outcome embedded content. Any removed content is logged (type and date of the removed material, reason for removal). The original unpartitioned record is archived with the data custodian.

**Chronological ordering:** The pre-outcome record is organized into numbered observation windows in chronological order. The CIS analyst accesses windows sequentially. The analyst does not have access to later windows while analyzing earlier ones.

---

### 7.3 Evaluator Isolation

**Evaluator types and isolation requirements:**

| Role | Isolation Requirement |
|------|-----------------------|
| CIS analyst | Has access only to the pre-outcome record, partitioned and windowed. No access to the expert evaluation or analyst usefulness ratings until after scoring. |
| Expert blind evaluator | Has access only to the pre-outcome record. Conducts assessment without access to CIS outputs. No access to outcome at time of assessment. |
| Analyst usefulness rater | Receives CIS outputs for the case without outcome information. Rates outputs before outcome reveal. |
| Scoring team | Receives sealed CIS outputs, expert evaluation, and analyst ratings simultaneously with the outcome record. Has not participated in analysis or evaluation. |
| Data custodian | Holds outcome record. Has no role in analysis or scoring assessment. |

**Evaluator conflict check:** Before assigning any evaluator role, the case manager must confirm:
- The evaluator has no prior direct knowledge of the specific case
- The evaluator has not been involved in CIS design or implementation
- The evaluator has no professional relationship with parties involved in the case outcome that would create a conflict of interest

The conflict check is documented in the case record.

---

### 7.4 Audit Trail

The following events must be recorded in the case record with date, time, and responsible role identifier. The audit trail is a permanent, append-only record.

| Event | Required Record |
|-------|----------------|
| Case registration | Registration date; case manager role |
| Source inventory completion | Date completed; case manager confirmation |
| Inclusion criteria assessment | Date, outcome (pass/fail), notes for each criterion |
| Evidence quality assessment | Date; assigned level; rationale |
| Outcome record transfer to custodian | Transfer date; custodian confirmation reference |
| Indicator mapping approval | Approval date; approving domain expert role |
| Evaluator assignment | Assignment date; evaluator role; conflict check confirmed |
| Readiness status transition | Each transition: date, authorization reference, reason |
| CIS analysis start | Date; evaluator role |
| CIS outputs sealed | Seal date; sealing custodian reference |
| Expert evaluation submitted | Date; expert role |
| Analyst usefulness ratings submitted | Date; rater role |
| Outcome reveal authorized | Authorization date; authorizing role |
| Outcome revealed | Date; to whom; custodian confirmation |
| Scoring completed | Date; scoring team role |
| Case report finalized | Date; report version |
| Any blinding breach | Date; description; affected personnel; remediation; case exclusion decision |

The audit trail is reviewed by the Catalog Administrator at the point of transition to **Ready For Blind Evaluation** and again at **Completed**.

---

## Section 8 — Evidence Quality Assessment

Evidence quality is assessed at the case level at admission and may be revised during data collection if new quality information emerges. The assessment uses four levels with explicit criteria. Every criterion in the applicable level must be met; meeting some criteria but not others produces the lower level.

---

### HIGH Evidence Quality

All of the following must be true:

1. The pre-outcome record contains six or more discrete chronological observation windows.
2. At least three independent sources are available for the primary observation windows.
3. All sources carry verified timestamps with precision to the day or better.
4. No source is retroactively generated (all sources were produced before the outcome was known).
5. The indicator mapping to CIS dimensions is unambiguous — each dimension maps to a directly observed quantitative variable, not a proxy requiring a chain of inference.
6. The baseline comparison data (operational method, expert assessment) is available from the same time period as the CIS analysis.
7. The outcome is documented in at least two independent sources with consistent date and description.

---

### MEDIUM Evidence Quality

All of the following must be true (and at least one HIGH criterion is not met):

1. The pre-outcome record contains four or more discrete chronological observation windows.
2. At least two independent sources are available.
3. All primary sources carry timestamps with precision to the week or better.
4. No more than one source required minor retroactive correction (documented and explained).
5. At least four of the five CIS indicator dimensions can be mapped to directly or closely proxied observables. At most one dimension requires a multi-step proxy inference.
6. The primary operational baseline is available. Expert assessment may be unavailable or from a later period; the statistical baseline can be constructed from available data.

---

### LOW Evidence Quality

All of the following must be true (and at least one MEDIUM criterion is not met):

1. The pre-outcome record contains at least four discrete chronological observation windows.
2. At least one independent source is available in addition to the primary record.
3. At least the primary source carries timestamps, even if secondary sources do not.
4. Three or more CIS indicator dimensions can be mapped. Two dimensions may require proxy inference with documented rationale.
5. At least the statistical baseline can be constructed. Operational and expert baselines may be unavailable.

**Cases with LOW evidence quality are included in the catalog and may proceed to evaluation, but results from LOW quality cases are reported separately and do not contribute to the primary validation finding. They may be included in sensitivity analyses.**

---

### INSUFFICIENT Evidence Quality

Any of the following is true:

- Fewer than four discrete chronological observation windows exist in the pre-outcome record.
- Only one source is available and no independent source can be identified.
- Primary sources lack timestamps or timestamps cannot be verified.
- Fewer than three CIS indicator dimensions can be mapped to any observable quantity.
- No baseline comparison is constructible.

**Insufficient evidence quality is an exclusion condition.** The case is excluded with the specific deficiency documented. It may be resubmitted if the deficiency is resolved (e.g., an additional source is identified).

---

### Quality Assessment Record

The evidence quality assessment is documented using this record structure:

```
EvidenceQualityAssessment {
  caseId            : string
  assessmentDate    : ISO8601 date
  assessedBy        : string          // Role identifier
  assignedLevel     : enum            // "High" | "Medium" | "Low" | "Insufficient"
  criteriaEvaluated : CriterionResult[]
  overallRationale  : string          // Summary justification for the assigned level
  revisedLevel      : enum | null     // If revised during data collection; null otherwise
  revisionDate      : ISO8601 date | null
  revisionReason    : string | null
}

CriterionResult {
  criterion         : string          // Description of the criterion evaluated
  met               : boolean
  notes             : string          // Required if not met, or if met with qualification
}
```

---

## Section 9 — Initial Candidate Inventory

No real cases are evaluated here. The following examples demonstrate how the catalog is intended to be used. All examples are illustrative constructions — not evaluations, not findings, not claims.

---

### Example Placeholder: Track A

```
CaseRecord {
  caseId              : "A-2026-001"
  track               : "A"
  title               : "Long-duration fraud investigation — financial sector"
  caseType            : "Major fraud — financial institution"

  observationStart    : "2019-01-01"
  observationEnd      : "2022-08-31"
  outcomeDate         : [HELD BY CUSTODIAN]
  observationWindowCount : 14    // Quarterly windows across 3.5 years

  outcomeKnown        : true
  outcomeType         : "Prosecution commenced"

  sourceInventory     : [
    {
      sourceId          : "A-2026-001-S01"
      sourceType        : "Regulatory filing archive"
      description       : "Quarterly financial disclosures filed with regulatory authority"
      dateRange         : "2019-Q1 through 2022-Q2"
      accessMethod      : "Public regulatory archive"
      isIndependent     : true
      isPreOutcome      : true
      qualityNotes      : "One quarter (2020-Q2) delayed filing; delay itself is an observation"
    },
    {
      sourceId          : "A-2026-001-S02"
      sourceType        : "Contemporary news archive"
      description       : "Contemporaneous reporting on firm and sector, publication dates verified"
      dateRange         : "2019-01 through 2022-07"
      accessMethod      : "Licensed news archive with date-verified access"
      isIndependent     : true
      isPreOutcome      : true
      qualityNotes      : "Three articles post-outcome date identified and excluded"
    },
    {
      sourceId          : "A-2026-001-S03"
      sourceType        : "Court records (pre-indictment)"
      description       : "Warrant applications and court filings with filing dates"
      dateRange         : "2020-06 through 2022-08"
      accessMethod      : "Public court record access"
      isIndependent     : true
      isPreOutcome      : true
      qualityNotes      : "Some warrant application details redacted per court order"
    }
  ]

  evidenceQuality     : "High"
  evidenceQualityNotes : "Six or more windows; three independent sources; all timestamped;
                          no retroactive records; indicator mapping unambiguous for four of
                          five dimensions; admissibility boundary (regulatory constraint
                          changes) requires one proxy inference step."

  blinded             : true
  dataCustodian       : "CUSTODIAN-ROLE-01"
  blindingBreaches    : []
  evaluatorClearance  : ["EVALUATOR-ROLE-A1"]

  criterionI_met      : true
  criterionII_met     : true
  criterionIII_met    : true
  criterionIV_met     : true
  criterionV_met      : true
  inclusionNotes      : "Case well-known in the relevant professional community but not
                          publicly prominent at the level of household recognition. Evaluator
                          from outside the domestic jurisdiction satisfies Criterion V."

  baseline_operational : "Regulatory examination schedule and formal inquiry trigger dates
                           as documented in official regulatory correspondence"
  baseline_expert      : "Three forensic accountants review same pre-outcome record
                           independently and document their signal recognition timeline"
  baseline_statistical : "Two-sigma deviation rule on quarterly financial ratio composite;
                           window-by-window rolling calculation"

  indicatorMapping    : {
    operationalLoad     : "Revenue maintenance cost ratio relative to prior-year baseline"
    recoveryTime        : "Time from reported anomaly to regulatory response or firm
                           correction, where documentable"
    admissibilityBoundary : "Regulatory perimeter changes: new reporting requirements,
                              scope of examination orders, exemption modifications"
    synchronization     : "Cross-entity filing consistency: agreement across subsidiary,
                            parent, and auditor disclosures on the same reporting period"
    buffer              : "Liquid reserve ratio relative to regulatory minimum requirement"
    mappingRationale    : "All five dimensions map to standard financial and regulatory
                            observables. Recovery time requires proxy (regulatory response
                            time as proxy for system recovery capacity). Rationale reviewed
                            and approved by forensic accountant domain expert."
  }
  indicatorMappingApproved : true
  indicatorMappingApprovedBy : "DOMAIN-EXPERT-A1"

  readinessStatus     : "Ready For Blind Evaluation"
  readinessHistory    : [
    { fromStatus: null,              toStatus: "Candidate",
      changeDate: "2026-06-15", authorizedBy: "CASE-MGR-01",
      reason: "Initial registration" },
    { fromStatus: "Candidate",       toStatus: "Collecting Data",
      changeDate: "2026-07-01", authorizedBy: "CATALOG-ADMIN-01",
      reason: "All inclusion criteria met; evidence quality assessment complete" },
    { fromStatus: "Collecting Data", toStatus: "Ready For Blind Evaluation",
      changeDate: "2026-08-20", authorizedBy: "CATALOG-ADMIN-01",
      reason: "Outcome transferred to custodian; indicator mapping approved;
               evaluator assigned and cleared" }
  ]
  exclusionReason     : null
  exclusionCriterion  : null

  evaluatorAssigned   : "EVALUATOR-ROLE-A1"
  caseManagerAssigned : "CASE-MGR-01"

  evaluationSealDate  : null
  outcomeRevealDate   : null
  scoringCompleteDate : null
  trackOutcome        : null

  registrationDate    : "2026-06-15"
  lastModifiedDate    : "2026-08-20"
  version             : 4
  notes               : "Indicator mapping for recovery time was the primary discussion
                          point during domain expert review. Final mapping documented in
                          source A-2026-001-S04 (domain expert review memo, 2026-08-15)."
}
```

---

### Example Placeholder: Track B

```
CaseRecord {
  caseId              : "B-2026-001"
  track               : "B"
  title               : "ED surge capacity — regional hospital, winter period"
  caseType            : "Emergency department — system-level"

  observationStart    : "2023-10-01"
  observationEnd      : "2024-03-14"
  outcomeDate         : [HELD BY CUSTODIAN]
  observationWindowCount : 24    // Weekly windows; 24 weeks across winter season

  outcomeKnown        : true
  outcomeType         : "ED diversion activation — extended duration"

  sourceInventory     : [
    { sourceId: "B-2026-001-S01", sourceType: "EHR — de-identified operational",
      description: "De-identified ED occupancy, wait times, and patient flow records",
      dateRange: "2023-10-01 through 2024-03-14", accessMethod: "IRB-approved data
      sharing agreement", isIndependent: true, isPreOutcome: true,
      qualityNotes: "Two-day gap in automated data capture during system upgrade;
                     manual records available for gap period" },
    { sourceId: "B-2026-001-S02", sourceType: "Staffing system log",
      description: "Scheduled vs. actual staffing by shift; agency and overtime records",
      dateRange: "2023-10-01 through 2024-03-14", accessMethod: "Data sharing agreement",
      isIndependent: true, isPreOutcome: true, qualityNotes: "Complete; no known gaps" },
    { sourceId: "B-2026-001-S03", sourceType: "NEWS2 score records",
      description: "Automatically computed NEWS2 scores at each assessment point;
                    used as operational baseline",
      dateRange: "2023-10-01 through 2024-03-14", accessMethod: "Data sharing agreement",
      isIndependent: false, isPreOutcome: true,
      qualityNotes: "Not independent — derived from same EHR. Retained as baseline
                     measurement, not as independent source for Criterion IV." }
  ]

  evidenceQuality     : "Medium"
  evidenceQualityNotes : "Two truly independent sources (EHR and staffing); NEWS2 scores
                           are the operational baseline, not an independent source.
                           Expert assessment baseline requires retrospective recruitment of
                           clinicians not involved in the original care period."

  blinded             : true
  dataCustodian       : "CUSTODIAN-ROLE-02"
  blindingBreaches    : []
  evaluatorClearance  : ["EVALUATOR-ROLE-B1"]

  criterionI_met      : true
  criterionII_met     : true
  criterionIII_met    : true
  criterionIV_met     : true
  criterionV_met      : true
  inclusionNotes      : "IRB approval obtained (reference: IRB-2026-B-047).
                          De-identification verified by institutional data governance team."

  baseline_operational : "NEWS2 scores and existing ED diversion trigger thresholds
                           as configured at the site during the evaluation period"
  baseline_expert      : "Two emergency physicians review de-identified operational
                           record without outcome knowledge and document their assessment
                           of when capacity concern warranted escalation"
  baseline_statistical : "Exponential smoothing of daily ED occupancy rate; alarm
                           at 1.5 standard deviation above smoothed trend"

  readinessStatus     : "Collecting Data"
  ...
}
```

---

### Example Placeholder: Track D — Excluded Case

```
CaseRecord {
  caseId              : "D-2026-001"
  track               : "D"
  title               : "Wildfire event — retrospective reconstruction only"
  caseType            : "Wildfire risk region"

  observationStart    : null
  observationEnd      : null
  outcomeDate         : [HELD BY CUSTODIAN]
  observationWindowCount : 2    // Only post-hoc environmental summary reports found

  outcomeKnown        : true
  outcomeType         : "Major wildfire event — ≥5,000 acres"

  evidenceQuality     : "Insufficient"
  evidenceQualityNotes : "Primary available documentation consists of two post-event
                           retrospective environmental reports. No pre-event RAWS station
                           data has been identified for the specific risk region and season.
                           Fewer than four observation windows available."

  criterionI_met      : true
  criterionII_met     : false
  criterionIII_met    : false
  criterionIV_met     : false
  criterionV_met      : true
  inclusionNotes      : "Criteria II, III, and IV all fail. The pre-event record cannot
                          be reconstructed from available sources."

  readinessStatus     : "Excluded"
  exclusionReason     : "Pre-event environmental monitoring record not available for this
                          region and season. Only retrospective post-event reports exist.
                          Fewer than four pre-outcome observation windows can be constructed."
  exclusionCriterion  : "Criterion II, Criterion III, Criterion IV"

  readinessHistory    : [
    { fromStatus: null,        toStatus: "Candidate",
      changeDate: "2026-07-10", authorizedBy: "CASE-MGR-02",
      reason: "Initial registration" },
    { fromStatus: "Candidate", toStatus: "Excluded",
      changeDate: "2026-07-18", authorizedBy: "CATALOG-ADMIN-01",
      reason: "Source investigation confirmed no pre-event RAWS data available.
               Case excluded; may be resubmitted if RAWS data is located." }
  ]

  notes               : "NIFC database search conducted 2026-07-15. Nearest RAWS station
                          was decommissioned 18 months before the event. Recommend checking
                          regional NWS climate office archive for any gridded fuel moisture
                          product that covered this region."
}
```

---

## Section 10 — Validation Execution Workflow

The workflow defines seven stages, the required artifact at each stage, and the transition condition to the next stage. No stage may be skipped. Stages are executed sequentially for each case.

---

```
CASE SELECTION
│
│  Required artifacts:
│  • Case registered in catalog with complete metadata
│  • All five inclusion criteria assessed and documented
│  • Evidence quality assessment completed
│  • Readiness status: Candidate → Collecting Data
│
▼
DATA COLLECTION
│
│  Required artifacts:
│  • Source inventory complete and verified
│  • Pre-outcome record assembled and chronologically windowed
│  • Partition verification: all post-outcome content removed and logged
│  • Original unpartitioned record archived with custodian
│  • Indicator mapping documented and domain-expert approved
│  • Baseline sources identified and described
│  • Readiness status: Collecting Data → Ready For Blind Evaluation
│     (requires Catalog Administrator approval)
│
▼
BLINDING
│
│  Required artifacts:
│  • Outcome record transferred to data custodian; transfer receipt recorded
│  • Custodian confirmation in audit trail
│  • Evaluator assigned; conflict check documented
│  • Expert blind evaluator identified; conflict check documented
│  • Analyst usefulness rater pool identified; no prior case knowledge confirmed
│  • Readiness status confirmed: Ready For Blind Evaluation
│
▼
CIS EVALUATION
│
│  Required artifacts:
│  • CIS analysis executed chronologically across all observation windows
│    (each window analyzed with access only to that window and prior windows)
│  • CIS outputs produced for each window:
│    - continuity state classification
│    - anomaly detections
│    - weak-signal clusters
│    - trajectory assessments
│    - fragility indicators
│    - load displacement candidates (where applicable)
│  • All outputs timestamped at time of production
│  • Expert blind evaluation conducted independently and in parallel
│  • Analyst usefulness ratings recorded before outcome reveal
│  • CIS outputs sealed (submitted to sealing custodian; receipt recorded)
│  • Readiness status: Evaluation In Progress
│
▼
OUTCOME REVEAL
│
│  Required artifacts:
│  • CIS output seal confirmed by sealing custodian
│  • Expert evaluation confirmed submitted
│  • Analyst usefulness ratings confirmed submitted
│  • Written authorization from Outcome Authorization authority
│  • Outcome record released by data custodian to scoring team
│  • Outcome reveal date recorded in audit trail
│  • CIS outputs, expert evaluation, and analyst ratings simultaneously
│    released to scoring team along with outcome record
│
▼
SCORING
│
│  Required artifacts:
│  • Metric computation for all nine required metrics:
│    - Lead-time advantage (with confidence interval)
│    - Precision
│    - Recall
│    - False positive rate
│    - False negative rate
│    - Calibration quality assessment
│    - Analyst usefulness rating (mean and distribution)
│  • Baseline comparison documentation:
│    - CIS vs. operational baseline (each metric)
│    - CIS vs. expert judgment (each metric)
│    - CIS vs. statistical baseline (each metric)
│  • Supplementary metrics (where data permits)
│  • Scoring completed before case-level report drafted
│
▼
REPORTING
│
│  Required artifacts:
│  • Case-level track report containing:
│    - Case metadata reference
│    - Metric values with confidence intervals and sample sizes
│    - Baseline comparison results (better / worse / equivalent for each metric)
│    - Outcome classification for this case: VALIDATED / PARTIALLY VALIDATED /
│      INCONCLUSIVE / NOT VALIDATED (per track-level criteria in validation program)
│    - Known limitations of this case's evaluation
│    - Protocol deviation log (if any)
│  • Case readiness status updated to: Completed
│  • All artifacts archived in case record
```

---

## Section 11 — Governance

Governance defines who may perform which actions. The primary control is separation of duties: no individual may hold more than one role in a single case's lifecycle if those roles would undermine blinding or independence.

---

### Role Definitions

| Role | Responsibilities | May Not Simultaneously Hold |
|------|-----------------|----------------------------|
| **Case Submitter** | Identifies and registers candidate cases. Completes initial metadata. | Any evaluator role on the same case |
| **Case Manager** | Manages data collection, source verification, and partition preparation. Maintains the case record. | Any evaluator role on the same case |
| **Catalog Administrator** | Approves readiness status transitions. Conducts audit trail review. Enforces governance rules. | Case Submitter, Case Manager, Evaluator, Scorer on any case under their oversight |
| **Domain Expert (Indicator Mapping)** | Reviews and approves indicator mappings for a case type. May review multiple cases of the same type. | Evaluator or Scorer on any case whose mapping they approved |
| **Data Custodian** | Holds outcome record. Releases only upon written authorization from Outcome Authorization authority. | Any analysis, evaluation, or scoring role |
| **Evaluator (CIS Analysis)** | Conducts CIS analysis chronologically on the pre-outcome record. Produces and seals CIS outputs. | Expert blind evaluator or scorer on the same case. Must not have prior case knowledge. Must not have participated in CIS implementation. |
| **Expert Blind Evaluator** | Reviews pre-outcome record independently of CIS analysis. Produces conventional signal timeline. | CIS analyst or scorer on the same case |
| **Analyst Usefulness Rater** | Reviews CIS outputs before outcome reveal and rates usefulness. | Scorer on the same case |
| **Outcome Authorization Authority** | Authorizes outcome reveal. Confirms that CIS outputs and expert evaluation are sealed before authorizing. | Data custodian, evaluator, or scorer on the same case |
| **Scoring Team** | Computes metrics against revealed outcomes. Produces case-level track reports. | Any role that had access to analysis outputs or outcome records before the simultaneous reveal |

---

### Separation of Duties — Critical Rules

1. **The data custodian does not participate in analysis or scoring.** A data custodian who becomes aware of the CIS outputs or expert evaluation before scoring is in a position to influence outcome release timing. This is prohibited.

2. **The CIS analyst does not score their own case.** The analyst produced the outputs being evaluated. Self-scoring of those outputs is not permissible.

3. **The Catalog Administrator does not evaluate cases.** The Catalog Administrator's role is governance oversight. Participating in evaluation would create a conflict between oversight and operational execution.

4. **The Outcome Authorization Authority must confirm sealing before authorizing release.** The authorization cannot be issued without confirmation from the sealing custodian that CIS outputs are sealed and from the expert evaluation record that expert evaluation is complete.

5. **No role may be held by the same individual across both the analysis and the scoring stages of a single case.** This rule applies regardless of organizational structure. If the validation study is conducted by a small team, roles are assigned to named individuals per case, not per person globally.

---

### Governance Approval Points

| Action | Required Approver |
|--------|------------------|
| Case admission to catalog | Case Manager (initial registration); Catalog Administrator (transition to Collecting Data) |
| Evidence quality assessment | Case Manager; reviewed by Catalog Administrator |
| Indicator mapping approval | Domain Expert |
| Transition to Ready For Blind Evaluation | Catalog Administrator; requires all entry criteria documented |
| Outcome record transfer to custodian | Case Manager; custodian confirmation required |
| Evaluator assignment | Case Manager; conflict check reviewed by Catalog Administrator |
| Outcome reveal authorization | Outcome Authorization Authority; sealing confirmation required |
| Case exclusion | Catalog Administrator |
| Protocol deviation documentation | Catalog Administrator; copy to all active role holders for the case |

---

## Section 12 — Success Condition

The case catalog is validation-ready when all of the following conditions are met.

**Structural completeness:**
- The catalog contains at least the minimum number of cases at **Ready For Blind Evaluation** or later status for at least one complete track (per minimum sample sizes in `CIS_VALIDATION_PROGRAM.md` Section 13.2).
- Every case at **Ready For Blind Evaluation** or later has a complete metadata record, documented outcome transfer to custodian, approved indicator mapping, assigned evaluator with documented conflict check, and a complete audit trail.

**Governance readiness:**
- All governance roles are filled by named individuals with documented role assignments.
- No single individual holds conflicting roles in any case.
- The Catalog Administrator has reviewed the audit trail for all cases at **Ready For Blind Evaluation** status and confirmed no protocol violations.

**Baseline readiness:**
- All three baseline comparisons (operational, expert, statistical) are defined and constructible for every case proceeding to evaluation.
- The statistical baseline methodology is documented and approved before analysis begins.

**Blinding integrity:**
- No blinding breach is recorded for any case proceeding to evaluation.
- The data custodian has confirmed in writing that outcome records are held separately for every case at **Ready For Blind Evaluation** or later.

**Indicator mapping completeness:**
- Indicator mappings are domain-expert approved for every proceeding case.
- Where proxy inferences are used, the proxy rationale is documented and approved.

A catalog meeting all conditions is validation-ready. A catalog that meets all structural and governance conditions but lacks the minimum case count for any track is administratively ready but not yet evaluation-ready for that track.

---

## Section 13 — Final Review

### 1. What information must exist before the first blind CIS evaluation can begin?

The following must all be in place before analysis begins on the first case:

**Case-level requirements:**
- Complete metadata record for the case, including all five inclusion criteria assessed as met
- Evidence quality assessment at Medium or higher
- Pre-outcome record assembled, chronologically windowed, and partition-verified (all post-outcome content identified and removed)
- Original unpartitioned record archived with the data custodian
- Outcome record transferred to data custodian; transfer confirmed in writing
- Indicator mapping for all five CIS dimensions documented and approved by a domain expert
- All three baseline comparisons defined and documented

**Governance and personnel requirements:**
- Evaluator assigned to the case; conflict check completed and documented
- Expert blind evaluator identified; conflict check completed
- Analyst usefulness rater pool identified; no prior case knowledge confirmed for any rater
- Data custodian in role; outcome record confirmed held
- Sealing custodian identified (to receive sealed CIS outputs)
- Outcome Authorization Authority identified and not in a conflicting role
- Scoring team constituted (no member participated in analysis or has prior outcome knowledge)

**Governance approval:**
- Catalog Administrator has approved the transition to **Ready For Blind Evaluation** status
- Audit trail reviewed and confirmed complete up to analysis start

**Nothing may be analyzed before this checklist is complete.** Beginning analysis without a sealed outcome record, without a defined indicator mapping, or without a cleared evaluator constitutes a protocol violation that excludes the case from primary analysis.

---

### 2. Which validation track should be executed first, and why?

**Track A — Historical Investigations** should be executed first.

The reasons are structural, not domain-specific:

**Data is archival and fixed.** Track A uses historical records. The pre-outcome record cannot change after the case is registered. There is no risk that the system under study produces new data during the evaluation that alters the analysis. This makes the blind protocol easier to maintain.

**No active data access partnership is required.** Tracks B, C, and D require institutional data access agreements — ethics approval for clinical data (Track B), utility operator cooperation (Track C), or active environmental monitoring access (Track D). These agreements take months to negotiate and may fail. Track A requires access to public or archived records that can often be obtained without partnership agreements.

**Outcomes are fully resolved and documented.** Track A cases are historical; their outcomes are known and cannot change. Track D events are also historical, but pre-event environmental records are often harder to reconstruct than investigative records. Track B and C evaluations may require prospective data collection.

**Blinding is cleanest.** For archival cases, the pre-outcome record is a fixed historical corpus. Evaluators outside the relevant jurisdiction or professional context can be found who have no prior case knowledge. The partition between pre-outcome and post-outcome records is a historical date boundary, not an ongoing operational boundary.

**The indicator mapping challenge is tractable.** Track A requires proxy inference from qualitative investigative records to CIS quantitative indicators — this is difficult, but it is a one-time, well-bounded design problem. Tracks C and D face spatial aggregation challenges (what geographic unit defines the system?) that require separate methodological development.

**Failure in Track A is interpretable.** If CIS does not perform well on historical investigations, that is a finding about CIS performance on archival qualitative records — informative and bounded. It does not invalidate clinical or infrastructure tracks. Starting with Track A produces an early interpretable result without foreclosing the full program.

---

### 3. What is the minimum number of completed cases required before any public validation claim should be made?

**No public validation claim should be made until at least one full track is complete at the minimum sample size specified in `CIS_VALIDATION_PROGRAM.md` Section 13.2, with a second track having at least 50% of its minimum sample size completed.**

For Track A (the recommended first track), this means:

- **20 completed cases** across at least 3 case categories (per the validation program minimum)
- Covering at least 2 different investigation types (e.g., fraud and organized crime; or kidnapping/missing persons and corruption)
- With a second track (recommended: Track B or Track D, depending on data access progress) having at least 10 completed cases

The rationale for the two-track threshold:

**Single-track results are not generalizable.** A finding that CIS performs well on historical financial fraud investigations does not constitute evidence that CIS provides diagnostic value generally. A single-track result may be published as a domain-specific preliminary finding, clearly labelled as such — it cannot support a claim that CIS has been validated.

**Within-track minimum case counts exist to prevent small-sample anomalies.** Twenty Track A cases, if they include a mix of case types, provide enough variance to distinguish a real signal from a run of favorable coincidences. Fewer than 20 completed cases in any track is insufficient for a within-track claim regardless of the results.

**The public claim must be scoped to the evidence.** A completed Track A at 20 cases supports the claim: "CIS has been evaluated on N historical investigation cases with the following results." It does not support the claim: "CIS has been validated as a diagnostic tool." The second phrasing requires multi-track evidence and explicit comparison to the validation program's VALIDATED outcome category criteria.

**The earliest defensible public claim is:** "A preliminary Track A evaluation of N cases (minimum 20) has been completed under blind protocol. Results are as follows. Validation across additional tracks is ongoing."

Any claim of general validation requires all four tracks completed and at least three producing VALIDATED or PARTIALLY VALIDATED outcomes.

---

*CIS Case Catalog Framework v1.0 — 2026-05-30*
*This document defines the case selection and management infrastructure for CIS validation. It does not constitute validation evidence. Population of the catalog and execution of evaluations are required before any finding can be produced.*
