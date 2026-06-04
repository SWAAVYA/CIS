# CIS Track A Execution Plan
# Historical Investigations — First Validation Cycle

**Date:** 2026-05-30
**Version:** 1.0
**Status:** OPERATIONAL PLAN — Pre-execution

**Authority documents:**
- `CIS_VALIDATION_PROGRAM.md`
- `CIS_CASE_CATALOG_FRAMEWORK.md`

**Scope:** Operational procedures for executing the first Track A validation cycle from case acquisition through completed case reports. Does not select real cases. Does not evaluate CIS. Does not modify CIS or its specification.

---

## How to Use This Document

This plan is written to be handed to a team. Each section is a self-contained operational procedure. A team member assigned to a workflow should be able to execute it using this document plus the two authority documents, without needing to ask how the pieces fit together.

Sections 1–8 are workflows in execution sequence. Section 9 is a master artifacts checklist that consolidates what each workflow produces. Sections 10–11 govern the validation cycle as a whole. Section 12 is the risk register. Section 13 is the Final Review.

Read Section 10 before starting Section 1. The sample-size structure determines how many cases enter each workflow stage and affects resourcing.

---

## Section 1 — Case Acquisition Workflow

### 1.1 Purpose

Identify cases that meet Track A inclusion criteria, register them in the catalog, and make an evidence-supported admission decision before committing data collection resources.

Case acquisition is a gate, not a funnel. The goal is not to maximize the number of cases admitted — it is to admit only cases that satisfy all five inclusion criteria and have the evidence quality to produce a usable evaluation.

### 1.2 Source Pools for Case Identification

Cases are identified from the following source pools. These are not ranked by preference; they are ranked by the reliability of the chronological record they typically produce.

**Tier 1 — Court and regulatory records (most reliable chronology)**

| Source | Why useful | Access |
|--------|-----------|--------|
| Criminal court records and indictments | Contain timestamped filings, warrant applications, and documented evidentiary milestones | Public access in most jurisdictions; PACER (US), court archive services (UK, EU) |
| Civil litigation records | Useful for fraud cases; discovery filings establish what was known and when | Public access |
| Regulatory enforcement actions | SEC, FCA, FINRA, SFO enforcement timelines with formal action dates | Regulatory authority websites; enforcement release archives |
| Inspector General and audit reports | Document investigation timelines with official dates | Government publication archives |
| Parliamentary and legislative inquiry records | Formal hearing transcripts with dates; committee reports establishing timelines | Hansard, Congressional Record, equivalent national archives |

**Tier 2 — Official investigation records (reliable but access-dependent)**

| Source | Why useful | Access |
|--------|-----------|--------|
| FOIA/FOI-released case files | Primary investigation documentation with internal timestamps | FOI request; may take 3–12 months; plan accordingly |
| Published official inquiry reports | Wainwright-style major inquiries; commissions of investigation | Public record; available immediately |
| Police and prosecutorial press releases (archive) | Establish public recognition milestones; timestamped | Agency archive websites |

**Tier 3 — Academic and journalistic case reconstructions (useful for identification; not sufficient as primary chronological evidence)**

| Source | Why useful | Limitation |
|--------|-----------|-----------|
| Academic criminology and white-collar crime literature | Identifies cases suitable for deeper investigation; provides secondary narrative | May not carry window-level timestamps; retrospective construction |
| Long-form investigative journalism with publication dates | Identifies signal windows; contemporaneous coverage has pre-outcome evidential value | Only contemporaneous articles (pre-outcome publication date) are usable as primary evidence |
| Published case studies (compliance, anti-corruption) | Structured summaries; often contain chronological appendices | Usually retrospective; primary sources must be identified separately |

### 1.3 Preliminary Screening Protocol

Before a case is registered in the catalog, it is screened against five binary criteria. This screening takes approximately 2–4 hours per case on Tier 1 sources. It prevents spending data collection resources on cases that will be excluded.

**Screening decision tree:**

```
1. Is the outcome known and documented in at least one datable source?
   NO  → SCREEN OUT (Criterion I)
   YES → continue

2. Can the pre-outcome record be partitioned from the outcome record
   using a single discrete outcome date?
   NO  → SCREEN OUT (Criterion I / Criterion II)
   YES → continue

3. Are at least four distinct pre-outcome time periods identifiable
   from available sources, each with a verifiable date?
   NO  → SCREEN OUT (Criterion III)
   YES → continue

4. Are at least two independent sources available for the pre-outcome period?
   NO  → SCREEN OUT (Criterion IV)
   YES → continue

5. Can evaluators without prior case knowledge plausibly be identified?
   (Case is not so publicly prominent that evaluator blinding is impossible)
   UNCERTAIN → flag for evaluator screening; admit conditionally
   YES → continue

→ REGISTER IN CATALOG as CANDIDATE
```

Screening is performed by the Case Manager. The screening decision and its rationale are documented in a **Case Screening Record** (Artifact A-SCR; see Section 9).

### 1.4 Case Registration

Cases that pass preliminary screening are registered in the catalog using the metadata schema defined in `CIS_CASE_CATALOG_FRAMEWORK.md` Section 5. At registration, the following fields must be completed:

- `caseId` (assigned by Case Manager; format: A-[YYYY]-[SEQ])
- `track` = "A"
- `title` (short; no outcome information)
- `caseType` (from the Track A template: investigation category)
- `outcomeKnown` = true
- `outcomeType` (brief category; no specifics)
- `registrationDate`
- `caseManagerAssigned`

All other fields are completed during the data collection stage.

### 1.5 Acquisition Volume Target

To reach 20 completed cases, the pipeline must be stocked with approximately 40–50 initial candidates, accounting for:

- ~20% exclusion rate at screening
- ~15% exclusion rate during data collection (source quality failures discovered late)
- ~10% attrition during blinding setup (evaluator conflicts, custodian failures)
- ~5% protocol deviation exclusion during evaluation

Begin case acquisition targeting 45 registered candidates before committing to the first evaluation. Do not begin evaluation until at least 30 candidates have cleared the screening stage, to avoid a situation where early exclusions leave the pipeline below the minimum sample.

### 1.6 Acquisition by Case Category

The validation program requires coverage across at least 3 case categories. Acquisition must be planned by category from the start, not selected opportunistically.

**Recommended category targets for the first cycle:**

| Category | Target Registrations | Rationale |
|----------|---------------------|-----------|
| Major fraud (financial sector) | 15 | Richest archival record; regulatory filing timestamps; court records often public |
| Organized crime investigations | 12 | Multi-subsystem load displacement patterns; strong court record availability |
| Corruption investigations | 10 | Boundary condition modification patterns; good regulatory record availability |
| Kidnapping / missing persons | 8 | High temporal pressure; strong CSD and fragility accumulation patterns; access harder |

Adjust targets based on source pool accessibility in the relevant jurisdiction. If one category consistently fails at the screening stage, pivot resources to another category and document the pivot.

---

## Section 2 — Source Collection Workflow

### 2.1 Purpose

Gather, verify, organize, and archive all sources that will constitute the pre-outcome record for each admitted case. Source collection is complete when the pre-outcome record is ready for timeline reconstruction (Section 3).

Source collection is the most labor-intensive stage. Allocate 20–40 hours per case depending on case complexity and source accessibility.

### 2.2 Source Identification

For each registered case, the Case Manager constructs a **Source Map** (Artifact A-SMP; see Section 9) identifying:

1. All sources that are known to contain pre-outcome documentation
2. The date range each source covers
3. Whether each source is accessible and by what method
4. Whether each source is independent of the primary record
5. The expected timestamp precision (day / week / month)

The Source Map is constructed before collection begins. It prevents discovering mid-collection that a critical source is inaccessible.

**Source independence test:** A source is independent if it was produced by an entity with no organizational relationship to the primary source and if its content was not derived from the primary source. A newspaper article reporting on a regulatory filing is independent of the filing if the article was published contemporaneously by a newsroom with no affiliation to the regulator.

**Minimum source requirement:** At least two independent sources must be identified before collection begins. If only one source is available, the case is excluded (Criterion IV). Document the exclusion with the Source Map showing what was searched and what was found.

### 2.3 Source Access and Acquisition

Sources are acquired through the following methods, in order of preference:

**Direct access (preferred):**
- Public court record databases (PACER, court archive portals)
- Regulatory authority enforcement archives (direct download)
- Government publication repositories (direct download)
- Licensed news archive services (Factiva, LexisNexis, ProQuest)

**Request-based access:**
- FOI/FOIA requests (file early; build into timeline)
- Academic library inter-loan for case study materials
- Court record certified copy requests

**Access through secondary sources (last resort):**
- Academic publications citing primary records (the primary record is the source; the academic citation is the locator)
- Investigative journalism citing primary records (same principle)

**Acquisition log:** Every source acquired is logged in the **Source Acquisition Log** (Artifact A-SAL; see Section 9) with:
- Source ID (matching the Source Map)
- Acquisition date
- Acquisition method
- File format and storage location
- Hash of the archived file (for tamper evidence)

### 2.4 Source Verification

Each acquired source is verified against four quality checks before it is admitted to the case record:

| Check | Question | Pass condition | Fail condition |
|-------|----------|---------------|----------------|
| **Date verification** | Can the timestamp on this source be independently confirmed? | Timestamp matches at least one independent reference (filing date on court database, publication date on archive receipt) | Timestamp is self-reported only and cannot be cross-referenced |
| **Pre-outcome content verification** | Does this source contain only content from before the outcome event? | All datable content in the source predates the outcome | Source contains embedded references to the outcome; forward-looking statements referring to resolution; post-outcome corrections |
| **Independence verification** | Was this source produced independently of the primary source? | Source was produced by a separate entity; content is not derived from the primary source | Source is a repackaging of the primary source by the same entity or a subsidiary |
| **Completeness verification** | Is this source complete, or is it a partial or excerpt version? | Source is the complete document; any gaps are identified and documented | Source is an undisclosed excerpt; key date ranges are missing without notation |

Sources that fail any check are logged as **rejected** in the Source Acquisition Log with the specific failure documented. If rejection reduces the source count below the two-independent-source minimum, the case is excluded.

### 2.5 Source Archiving

All acquired sources are archived in a case-specific directory structure before timeline reconstruction begins. The directory structure is:

```
cases/
  [caseId]/
    sources/
      raw/           — original acquired files, unmodified
      verified/      — verified copies with verification memos attached
      excluded/      — sources that failed verification, with failure memos
    timeline/        — produced during Section 3
    windows/         — produced during Section 4
    blinded/         — produced during Section 5
    evaluation/      — produced during Section 6
    scoring/         — produced during Section 7
```

Raw files are never modified. All processing is done on copies in the `verified/` directory. The archive is the record of what evidence existed at the time of evaluation.

### 2.6 Source Collection Completeness Check

Source collection is complete when:
- All sources identified in the Source Map have been either acquired or formally logged as unavailable
- All acquired sources have passed the four verification checks
- At least two independent, verified, pre-outcome sources exist
- The Source Acquisition Log is complete and filed

The Case Manager signs off on source collection completeness using the **Source Collection Completion Certification** (Artifact A-SCC; see Section 9). The Catalog Administrator reviews the certification before approving transition to timeline reconstruction.

---

## Section 3 — Timeline Reconstruction Workflow

### 3.1 Purpose

Convert the verified source set into a chronologically ordered, independently cross-referenced event record. The timeline is the factual foundation of the evaluation. Errors introduced here propagate through every subsequent stage.

Allocate 15–30 hours per case for timeline reconstruction, depending on source volume and complexity.

### 3.2 Event Extraction

For each source in the `verified/` directory, the Case Manager performs a structured read-through, extracting every event that is:

- Datable (has a timestamp or can be assigned a date range from context)
- Observable (describes something that happened or changed in the system, not an analyst's interpretation of events)
- Relevant (pertains to the investigative system, the target system, or the relationship between them)

Each extracted event is recorded in the **Event Extraction Log** (Artifact A-EEL; see Section 9) with:

```
EventRecord {
  eventId          : string     // Sequential within case (E001, E002, ...)
  sourceId         : string     // Which source this came from
  eventDate        : string     // Most precise date available (ISO8601; use ranges if needed)
  dateConfidence   : string     // "exact" | "within-week" | "within-month" | "estimated"
  eventDescription : string     // Factual description only; no interpretation
  eventCategory    : string     // "investigative action" | "target system behavior" |
                                //  "resource change" | "boundary modification" |
                                //  "coordination event" | "external development"
  cisDimensionHint : string     // Which CIS indicator dimension this event may inform
                                //  (preliminary; confirmed during window construction)
  forwardReference : boolean    // Does this event contain any reference to future events?
  forwardRefNotes  : string     // If true: what forward reference was found and how handled
}
```

**Forward reference identification:** Any event record that contains language referring to future events, outcomes, or resolutions is flagged as `forwardReference: true`. The forward-referencing content is excluded from the event description and documented in `forwardRefNotes`. The event itself (the observable fact, stripped of the forward reference) is retained if the observable fact is pre-outcome. The forward reference language is never exposed to the evaluator.

### 3.3 Cross-Source Reconciliation

Multiple sources often document the same event with slightly different dates or descriptions. The reconciliation procedure:

1. **Identify duplicate events:** Events from different sources describing the same occurrence are grouped as a **reconciliation set**.

2. **Select the authoritative date:** Apply the following priority order:
   - Court filing date or official document date > contemporaneous news publication date > retrospective account date
   - Where two sources of equal priority disagree on date, record the range and assign `dateConfidence: "within-week"` or `"within-month"` as appropriate

3. **Record the reconciliation:** For each reconciled event, note which sources were reconciled, what differences existed, and what decision was made. This is recorded in the **Reconciliation Log** (Artifact A-RCL; see Section 9).

4. **Escalate irreconcilable conflicts:** If two sources of equal authority give fundamentally incompatible descriptions of the same event (not just different dates but different facts), the conflict is escalated to the Case Manager. The resolution (which source is used, or whether the event is excluded) is documented.

### 3.4 Gap Identification

After cross-source reconciliation, the timeline is reviewed for temporal gaps — periods during which no events are documented. For each gap:

- **Document the gap** (start date, end date, duration)
- **Assess the gap type:**
  - *Expected quiet period* — the system was genuinely inactive; the gap is real and informative
  - *Source gap* — events likely occurred but are not documented in available sources
  - *Classification gap* — events occurred but cannot be assigned to a CIS dimension
- **Record the gap** in the **Timeline Gap Register** (Artifact A-TGR; see Section 9)

Gaps do not automatically exclude a case. Long source gaps spanning more than one observation window may reduce evidence quality to Low. Gaps spanning the majority of the pre-outcome period may produce an exclusion.

### 3.5 Forward Reference Sweep

Before the timeline is finalized, a complete forward reference sweep is conducted. This is a second pass through the entire event record (not just flagged events) specifically looking for:

- Dates that are stated in the past tense but refer to events after the observation end date
- Phrasing that implies knowledge of the ultimate resolution ("what later turned out to be," "the scheme that eventually collapsed")
- Embedded outcome references in document titles, headers, or annotations
- Any event dated after the `observationEnd` date that was inadvertently included

All such content is removed from the timeline. The sweep is documented in the **Forward Reference Sweep Record** (Artifact A-FRS; see Section 9), which lists every instance found, the source and location, the content removed, and the reason.

The forward reference sweep is the final quality gate before timeline finalization. It is performed by the Case Manager and independently spot-checked by the Catalog Administrator on a sample of 20% of events.

### 3.6 Timeline Finalization

The finalized timeline is:

- A chronologically ordered sequence of event records
- Free of forward references
- Cross-referenced to source IDs for every event
- Annotated with date confidence levels
- Gap-annotated at every identified gap

The Case Manager certifies the finalized timeline using the **Timeline Completion Certification** (Artifact A-TLC; see Section 9).

---

## Section 4 — Observation Window Construction Workflow

### 4.1 Purpose

Convert the finalized timeline into discrete CIS observation windows — the specific inputs the evaluator will use to run CIS analysis. Each window must be self-contained: it contains exactly the information available at that point in time, translated into the CIS indicator format, with no access to subsequent windows during analysis.

### 4.2 Window Boundary Design

Window boundaries are set before window content is assigned. The boundary design is a methodological decision that must be documented and held fixed — it cannot be changed after the evaluator begins analysis.

**Design principles:**

1. **Windows are chronological, not event-triggered.** Window boundaries are defined by calendar periods, not by when significant events occurred. Event-triggered windows create selection bias — periods of high activity get more windows, creating artificial signal density.

2. **Window spacing reflects the system's natural variation rate.** For fraud investigations, quarterly windows (matching reporting cycles) are natural. For kidnapping cases, weekly windows may be appropriate. For long-duration corruption investigations, monthly windows may be sufficient. The Case Manager proposes window spacing; the domain expert approves it.

3. **Window count must reach the minimum.** The Track A minimum is four windows. The evidence quality minimum for HIGH rating requires six or more. Design windows to meet or exceed the relevant threshold.

4. **Window spacing must be consistent.** Irregular window spacing that happens to cluster windows around known signal-rich periods is not permitted. If the spacing cannot be made regular due to source gaps, the irregular spacing is documented and the gap is noted in the evaluator's pre-analysis briefing.

**Recommended window designs by case category:**

| Case Category | Recommended Spacing | Minimum Windows | Notes |
|--------------|-------------------|----------------|-------|
| Major fraud | Quarterly | 6 | Matches financial reporting cycle |
| Organized crime | Monthly | 6 | Operational tempo justifies monthly |
| Corruption | Quarterly | 5 | Administrative cycle matching |
| Kidnapping | Weekly | 4 | High temporal pressure; short cases |
| Missing persons | Monthly | 4 | For long-duration cases only |

### 4.3 Indicator Value Assignment

For each window, each of the five CIS indicator dimensions is assigned a value derived from the events and observations that fall within that window. This is the most intellectually demanding step in Track A preparation.

**The indicator mapping (defined at case admission, approved by domain expert) determines which observable quantities map to which CIS dimension.** Indicator value assignment follows the mapping; it does not create new mappings.

**Assignment procedure, per window, per dimension:**

```
FOR EACH window W:
  FOR EACH CIS dimension D:

    1. Collect all events in W that are tagged with dimension hint D
       (from the EventExtraction Log)

    2. Identify the observable quantity defined in the IndicatorMap for D

    3. Extract the value of that quantity from the events:
       - If the quantity is directly reported: use the reported value
       - If the quantity must be computed: apply the defined computation
         (e.g., ratio of two reported values)
       - If the quantity must be estimated from indirect evidence:
         apply the estimation method defined in the indicator mapping;
         flag as "estimated" with the estimation rationale

    4. Classify the value as:
       - observed: the value comes directly from a document
       - estimated: the value is computed from a documented quantity
         via the defined mapping
       - missing: insufficient evidence to assign any value

    5. Record in the Window Record (Artifact A-WRD):
       - The assigned value (or null if missing)
       - The observation type (observed / estimated / missing)
       - The source event IDs that support the assignment
       - The estimation rationale (if estimated)
```

**Missing values:** A window may contain missing values for one or more dimensions. A window with three or more missing values is a **sparse window**. A sparse window is included in the evaluation but its sparseness is flagged in the evaluator briefing. The evaluator's CIS uncertainty output should reflect the missing dimensions.

**No imputation without documentation:** If a dimension value must be estimated rather than observed, the estimation method is written out explicitly in the Window Record before the evaluator sees it. The evaluator must not invent estimation methods during evaluation.

### 4.4 Window Record Format

Each window is documented in a Window Record:

```
WindowRecord {
  caseId           : string
  windowId         : string    // Format: [caseId]-W[nn] (e.g., A-2026-001-W01)
  windowStart      : ISO8601 date
  windowEnd        : ISO8601 date
  windowSequence   : integer   // 1 = earliest

  indicators : {
    operationalLoad : {
      value         : number | null
      observationType : "observed" | "estimated" | "missing"
      sourceEventIds  : string[]
      estimationNote  : string | null
    },
    recoveryTime    : { ... },   // same structure
    admissibilityBoundary : { ... },
    synchronization : { ... },
    buffer          : { ... }
  }

  windowNarrative  : string    // 2–4 sentence factual summary of observable events
                               // in this window. No interpretation. No outcome references.
  sparseWindow     : boolean   // true if 3 or more dimensions are missing
  sparseWindowNote : string | null
  sourceEventIds   : string[]  // All events from Event Extraction Log that fall in this window
}
```

### 4.5 Window Set Validation

Before the window set is sealed for evaluation, the Case Manager validates:

- All windows have sequential, non-overlapping date ranges
- No window extends past the `observationEnd` date
- No window contains any forward-referencing content (re-verified here)
- The window count meets the minimum for the case's evidence quality target
- Every window narrative is factual and free of interpretive language
- Every indicator value that is estimated is accompanied by a documented estimation rationale
- No indicator value references a future window

The **Window Set Validation Record** (Artifact A-WSV; see Section 9) documents the validation results.

### 4.6 Evaluator Pre-Analysis Briefing

The evaluator receives a **Pre-Analysis Briefing Document** (Artifact A-PAB; see Section 9) before beginning evaluation. This document contains:

- The case ID and case type (no title details that might suggest the case identity)
- The observation window count and date ranges
- The indicator mapping (which observable quantity corresponds to each CIS dimension)
- The window spacing rationale
- A list of sparse windows and which dimensions are missing in each
- The calibration information available (whether domain-confirmed, partially-calibrated, or structurally-estimated)
- Any source-quality limitations that affect interpretation
- Explicit instructions: evaluate each window in sequence; do not read ahead; record CIS outputs for each window before proceeding to the next

The Pre-Analysis Briefing Document does not contain:
- The case title, jurisdiction, or any identifying details
- The case outcome or outcome date
- The outcome type
- Any post-observationEnd information

---

## Section 5 — Blinding Workflow

### 5.1 Purpose

Operationalize the blinding requirements so that the evaluator, the expert blind evaluator, and the analyst usefulness raters all produce their assessments without knowledge of the case outcome.

Blinding is not a single action — it is a set of maintained states that must hold throughout the evaluation. This workflow defines the specific actions that establish and verify those states.

### 5.2 Outcome Record Isolation

**Step 1 — Outcome record assembly.** Before any blinding action, the Case Manager assembles the **Outcome Record Package** (Artifact A-ORP; see Section 9) containing:
- The outcome event description (what happened)
- The outcome date
- All documents dated after the `observationEnd` date that were collected during source collection
- The conventional detection timeline (when did the investigative record formally recognize each signal?)

The Outcome Record Package is assembled in a separate directory from the pre-outcome record. It is not stored in the case working directory.

**Step 2 — Outcome record transfer.** The Case Manager transfers the Outcome Record Package to the Data Custodian. The transfer uses whatever secure method is appropriate to the operating context (encrypted file transfer, physical handover with receipt, secure shared storage with access-controlled folder). The Data Custodian issues a **Custodian Receipt** (Artifact A-CRC; see Section 9) confirming receipt.

**Step 3 — Working directory lockdown.** After transfer, the Case Manager confirms that the working case directory (`cases/[caseId]/`) contains no outcome-disclosing content. The **Working Directory Lockdown Certification** (Artifact A-WDL; see Section 9) is signed and filed.

**Step 4 — Access restriction.** The Outcome Record Package directory is access-restricted to the Data Custodian only. Any access to the directory is logged automatically (or manually if automatic logging is not available). The Data Custodian does not share the contents with any other role until written authorization from the Outcome Authorization Authority is received.

### 5.3 Evaluator Clearance

**Conflict check protocol:**

For each candidate evaluator (CIS analyst, expert blind evaluator, usefulness rater):

1. Obtain a signed **Evaluator Conflict Declaration** (Artifact A-ECD; see Section 9) stating:
   - The evaluator has no prior direct knowledge of the specific case
   - The evaluator was not involved in the investigation being studied
   - The evaluator has no professional or personal relationship with parties to the case outcome that would create a bias
   - The evaluator has not participated in CIS design or implementation

2. Case Manager reviews the declaration and performs an independent check:
   - For domain experts: confirm no prior published work on the specific case
   - For investigators: confirm no agency overlap with the case jurisdiction and time period

3. If any conflict is identified, the evaluator is disqualified from this case. Document the conflict in the case record.

**Evaluator assignment:**

Only evaluators who have cleared the conflict check are assigned. The assignment is recorded in the case metadata with the date and the case manager's certification that the conflict check was completed.

### 5.4 Pre-Outcome Record Packaging

The pre-outcome record provided to the evaluator is the **Evaluator Package** (Artifact A-EVP; see Section 9). It contains:

- The Pre-Analysis Briefing Document (Artifact A-PAB)
- The Window Records for all windows (Artifact A-WRD), in order, presented such that each window is a separate physical or logical document (to enforce sequential access)
- A blank **CIS Output Record** (Artifact A-COR; see Section 9) for the evaluator to complete for each window

The Evaluator Package does not contain:
- The Source Acquisition Log
- The Event Extraction Log (the evaluator does not have access to raw source materials)
- The Reconciliation Log
- Any working document that contains case-identifying information
- Any post-outcome material

**Evaluator package review:** The Case Manager reviews the assembled Evaluator Package for any residual outcome-disclosing content before it is transmitted to the evaluator. The **Evaluator Package Review Record** (Artifact A-EPR; see Section 9) documents this review.

### 5.5 Expert Blind Evaluator Package

The expert blind evaluator receives a different package — the **Expert Blind Package** (Artifact A-EBP; see Section 9) — which contains:

- The Window Narratives (Section 4.3) for all windows, without indicator values
- The Source Acquisition Log summary (source types and date ranges only; no file contents)
- A blank **Expert Signal Assessment Form** (Artifact A-ESA; see Section 9) on which the expert records their own assessment of which windows contain signals, what those signals represent, and what the trajectory suggests

The expert blind evaluator does not receive the Window Records with assigned indicator values. The expert works from the narrative summaries and source descriptions, not from the CIS-formatted indicator values.

This separation ensures that the expert baseline is genuinely independent — it does not benefit from the CIS indicator translation that the Case Manager performed.

### 5.6 Blinding Audit

The Catalog Administrator performs a **Blinding Audit** (Artifact A-BAD; see Section 9) before approving the case's transition to Evaluation In Progress. The audit confirms:

- Outcome Record Package is held by the Data Custodian
- Custodian Receipt is on file
- Working directory contains no outcome-disclosing content
- Evaluator conflict check is documented
- Expert blind evaluator conflict check is documented
- Evaluator Package contains only pre-outcome material
- Expert Blind Package contains only pre-outcome material
- Access restrictions are in place

A case that fails the Blinding Audit does not proceed to evaluation. The specific failure is documented and the case is held at Ready For Blind Evaluation until the failure is remediated.

---

## Section 6 — Evaluator Workflow

### 6.1 Purpose

Define exactly what the CIS analyst does during evaluation — how to approach each window, what to record, how to handle ambiguity, and how to seal outputs.

This workflow is written for the evaluator. It assumes the evaluator has access to the CIS diagnostics engine documentation but has not been told what to expect to find.

### 6.2 Pre-Evaluation Setup

Before beginning analysis, the evaluator:

1. Reads the Pre-Analysis Briefing Document in full
2. Reviews the indicator mapping and confirms they understand what each CIS dimension represents in this case
3. Reviews the calibration mode (domain-confirmed / partially-calibrated / structurally-estimated) and what that implies for uncertainty
4. Notes which windows are sparse and which dimensions are missing in each
5. Does not open any Window Record beyond the first until that window's analysis is complete

The evaluator does not contact the Case Manager with questions about the case content during evaluation. If there are questions about the indicator mapping or evaluation procedure, they are directed to the Catalog Administrator, who may consult the domain expert without revealing case-identifying information to the evaluator.

### 6.3 Window Analysis Protocol

For each window, in strict sequence:

**Step 1 — Read the window narrative.** The evaluator reads the narrative for the current window. This provides factual context. The evaluator does not yet look at the indicator values.

**Step 2 — Form a prior.** Before looking at the indicator values, the evaluator briefly notes (in the CIS Output Record) their impression from the narrative alone: what state does the system appear to be in? What is changing? This prior is a 2–3 sentence note. It is not a formal CIS output — it is a pre-analysis record.

**Step 3 — Review indicator values.** The evaluator reviews the assigned indicator values for each dimension, noting which are observed, estimated, or missing.

**Step 4 — Run CIS analysis.** The evaluator applies CIS analysis to the indicator values, following the CIS diagnostics engine specification:
- Classify the continuity state
- Run anomaly detection against the current state classification
- Generate weak-signal clusters from any sub-threshold anomalies
- Produce a trajectory estimate if sufficient history is available (prior windows' CIS outputs provide the history)
- Compute fragility indicators if applicable
- Flag load displacement candidates if applicable

**Step 5 — Record CIS outputs.** For this window, the evaluator completes the **CIS Output Record** (Artifact A-COR) with:
```
CISOutputRecord {
  caseId          : string
  windowId        : string
  analysisDate    : ISO8601 date+time
  priorNote       : string          // Pre-indicator narrative impression (Step 2)

  continuityState : string          // State classification
  stateConfidence : number          // classificationConfidence from CIS output
  calibrationMode : string          // From CIS output

  anomalies : [
    { dimension: string, category: string, severity: string, description: string }
  ]

  weakSignalClusters : [
    { clusterLabel: string, anomaliesIncluded: string[], structuralDriverInferred: string,
      confidence: number, coherenceTypeCompatible: string }
  ]

  trajectoryEstimate : {
    projectedState  : string | null   // null if insufficient history
    confidenceRange : { low: number, high: number } | null
    assumptions     : string[]
  } | null

  fragilityIndicators : {
    dBdt           : number | null
    d2Bdt2         : number | null
    timeToThreshold: number | null
    confidenceRange: { low: number, high: number } | null
    assumptions    : string[]
  } | null

  loadDisplacementCandidate : {
    candidateFlag   : boolean
    displacementVerdict : string
    confidenceRange : { low: number, high: number } | null
    assumptions     : string[]
  } | null

  uncertaintySpec : {
    dataCoverage    : string          // "full" | "partial" | "minimal"
    calibrationMode : string
    uncalibratedDimensions : string[]
    classificationConfidence : number
    notes           : string
  }

  evaluatorNotes   : string           // Any observations the evaluator wants to flag;
                                      // not used in scoring but preserved for quality review
}
```

**Step 6 — File the record and advance.** The evaluator saves the completed CIS Output Record for this window before opening the next window. The output for Window N is finalized before Window N+1 is examined. This is enforced by the sequential document structure of the Evaluator Package — each window is a separate document, and the evaluator is instructed not to open the next document until the current one is complete.

### 6.4 Output Sealing

When all windows have been analyzed and all CIS Output Records are complete, the evaluator assembles the **Sealed CIS Output Package** (Artifact A-SOP; see Section 9):

- All CIS Output Records, in window order
- A cover record noting the date and time analysis was completed
- A hash of the complete package

The evaluator submits the Sealed CIS Output Package to the **Sealing Custodian** (a separate role from the Data Custodian who holds the outcome). The Sealing Custodian issues a **Seal Receipt** (Artifact A-SRC; see Section 9) confirming receipt with timestamp.

After sealing, the evaluator must not revise any CIS Output Record. Any post-seal modification is a protocol violation.

### 6.5 Analyst Usefulness Rating

After the Sealed CIS Output Package is submitted, the evaluator is asked to complete the **Analyst Usefulness Rating** for each window's CIS output. This is a separate step that occurs after sealing — the ratings are not considered analysis outputs, they are evaluator assessments of the outputs' potential operational value.

The evaluator rates each window's CIS output on the 1–5 scale defined in `CIS_CASE_CATALOG_FRAMEWORK.md` Appendix B, with a brief rationale for each rating.

The Analyst Usefulness Ratings are submitted directly to the Scoring Team (not through the Sealing Custodian), sealed in a separate **Usefulness Rating Package** (Artifact A-URP; see Section 9).

### 6.6 Expert Blind Evaluation (Parallel Activity)

While the CIS analyst is working through the window sequence, the expert blind evaluator works through the Expert Blind Package independently. The expert does not communicate with the CIS analyst during this period.

The expert records their findings in the **Expert Signal Assessment Form** (Artifact A-ESA), noting:
- For each window: what signals (if any) they identify, and why
- Their overall assessment of the system's trajectory at each point
- When they first identified a signal that would have warranted escalation
- Their assessment of the conventional detection timeline (based solely on the material in the Expert Blind Package)

The Expert Signal Assessment Form is submitted to the Scoring Team directly, also before outcome reveal.

---

## Section 7 — Scoring Workflow

### 7.1 Purpose

Compute the nine required metrics for each completed case, compare CIS against all three baselines, and produce the case-level track report. Scoring occurs after outcome reveal and is performed by the Scoring Team, which has not participated in analysis.

### 7.2 Outcome Reveal Procedure

Outcome reveal requires the following sequence:

1. **Confirmation of sealing:** The Outcome Authorization Authority receives written confirmation from the Sealing Custodian that the CIS Output Package is sealed and timestamped.

2. **Confirmation of expert evaluation:** The Outcome Authorization Authority confirms that the Expert Signal Assessment Form has been submitted and is timestamped before the reveal.

3. **Confirmation of usefulness ratings:** The Outcome Authorization Authority confirms that the Analyst Usefulness Ratings are submitted and timestamped before the reveal.

4. **Written authorization:** The Outcome Authorization Authority issues a **Reveal Authorization** (Artifact A-RAT; see Section 9) to the Data Custodian.

5. **Simultaneous release:** The Data Custodian releases the Outcome Record Package, the Sealing Custodian releases the Sealed CIS Output Package, and the Expert Signal Assessment Form is released — all simultaneously to the Scoring Team.

6. **Reveal logged:** The outcome reveal date and time are recorded in the audit trail.

### 7.3 Baseline Construction

Before scoring CIS against the outcome, the Scoring Team constructs the three baselines:

**Baseline 1 — Conventional investigative timeline:**
From the Outcome Record Package, extract the conventional detection timeline: at what date did the investigative record first formally recognize each signal that CIS may have flagged? This is the primary operational baseline. It is constructed from the post-outcome record materials that were held by the custodian.

**Baseline 2 — Expert judgment timeline:**
From the Expert Signal Assessment Form, extract the date (by window) at which the expert first identified a signal that would have warranted escalation. This is the expert baseline.

**Baseline 3 — Statistical baseline:**
Apply the pre-specified statistical baseline (defined at case registration, before analysis) to the indicator values in the Window Records. Typically a two-sigma deviation rule applied rolling across windows. The statistical baseline is computed from the Window Records — it uses the same indicator values as CIS, not a separate data source.

All three baselines are documented in the **Baseline Comparison Record** (Artifact A-BCR; see Section 9).

### 7.4 Metric Computation

For each of the nine required metrics:

**Lead-time advantage:**
- Identify the first window in which CIS flagged a structurally relevant signal (anomaly, cluster, fragility flag, or trajectory shift toward an adverse state)
- Identify the equivalent first-recognition date from each baseline
- Compute: lead-time = baseline recognition date − CIS signal date
- Positive value = CIS was earlier
- Report separately for each baseline comparison

**Precision:**
- True positive: CIS signal followed by a confirmed adverse event within the outcome window
- False positive: CIS signal not followed by a confirmed adverse event within the outcome window
- Precision = TP / (TP + FP)
- Outcome window is defined at case registration

**Recall:**
- True positive: as above
- False negative: confirmed adverse event not preceded by a CIS signal within the detection window
- Recall = TP / (TP + FN)
- Detection window is defined at case registration

**False positive rate:**
- FPR = FP / (FP + TN)
- TN: windows without a CIS signal that were not followed by an adverse event

**False negative rate:**
- FNR = FN / (FN + TP)

**Calibration quality:**
- For each window where CIS produced a confidence range, check whether the true outcome falls within the range
- 70% confidence ranges should contain the true outcome in approximately 70% of windows
- Compute coverage deviation: observed coverage rate − stated confidence level
- Ideal: coverage deviation near zero; positive deviation = conservative (acceptable); negative deviation = overconfident (concerning)

**Analyst usefulness rating:**
- Mean rating across all windows where a rating was provided
- Distribution: proportion of windows rated 1, 2, 3, 4, 5
- Flag any case where > 50% of windows are rated 1 or 2

All metric computations are documented in the **Metric Computation Record** (Artifact A-MCR; see Section 9) with the values, the supporting calculations, and the outcome window definitions used.

### 7.5 Case-Level Report

The Scoring Team produces the **Case-Level Track Report** (Artifact A-CTR; see Section 9) containing:

- Case ID and case type (not case-identifying details)
- Evidence quality level
- Metric values with confidence intervals (bootstrap 95% CI where sample permits)
- Baseline comparison (for each metric: CIS vs. operational, CIS vs. expert, CIS vs. statistical)
- Preliminary outcome classification for this case (VALIDATED / PARTIALLY VALIDATED / INCONCLUSIVE / NOT VALIDATED) per the criteria in `CIS_VALIDATION_PROGRAM.md` Sections 10–11
- Known limitations of this specific case
- Protocol deviations, if any, and their effect on the case's contribution to the track finding
- Recommendation on whether this case should be included in the primary track analysis or relegated to sensitivity analysis (LOW evidence quality cases)

The Case-Level Track Report is reviewed by the Catalog Administrator before being filed. The case readiness status is updated to COMPLETED.

---

## Section 8 — Quality Control Workflow

### 8.1 Purpose

Define the quality control checks that are applied throughout the workflow to catch errors before they propagate into the evaluation. QC is not a final-stage activity — it is embedded at each transition point.

### 8.2 QC Gate Structure

A QC gate exists at each of the following workflow transitions. The gate must pass before the transition is approved.

| Transition | Gate Holder | QC Activity |
|------------|-------------|-------------|
| Candidate → Collecting Data | Catalog Administrator | Screening record review; inclusion criteria completeness check |
| Collecting Data → Ready For Blind Evaluation | Catalog Administrator | Source verification review; timeline completeness check; blinding audit |
| Ready For Blind Evaluation → Evaluation In Progress | Catalog Administrator | Evaluator clearance confirmation; Evaluator Package content review |
| Evaluation In Progress → Scoring | Outcome Authorization Authority | Sealing confirmation; expert evaluation confirmation; usefulness ratings confirmation |
| Scoring → Completed | Catalog Administrator | Metric computation review; case report review |

### 8.3 Independent Verification Checks

Two independent verification checks are embedded in the workflow regardless of gate approvals:

**Timeline spot-check (20% sample):**
The Catalog Administrator independently re-extracts events from a 20% random sample of source documents and compares the results against the Event Extraction Log. Discrepancies are documented. If more than 5% of sampled events are incorrectly dated or described, the timeline is returned for full reprocessing.

**Metric computation verification:**
A second member of the Scoring Team independently computes the precision, recall, and lead-time advantage metrics from the raw data. Computed values are compared against the primary computation. Discrepancies of more than 0.02 in precision or recall trigger a joint review. The final metric values are the jointly reviewed values.

### 8.4 Protocol Deviation Logging

Any deviation from this execution plan is logged in the **Protocol Deviation Log** (Artifact A-PDL; see Section 9) immediately upon identification, with:

- Date of deviation
- Description of what occurred
- Which workflow step was affected
- Assessment of impact on the case's usability
- Decision: case proceeds (with deviation documented) / case excluded from primary analysis / case excluded entirely

Protocol deviations are reviewed by the Catalog Administrator. Deviations affecting blinding integrity or metric computation are escalated to the Outcome Authorization Authority.

### 8.5 Running QC Log

The Case Manager maintains a **Running QC Log** (Artifact A-QCL; see Section 9) for each case that records all QC activities, their outcomes, and any issues identified and resolved. The Running QC Log is an append-only record — entries are never deleted or overwritten.

---

## Section 9 — Required Artifacts Checklist

The following is the complete set of artifacts produced by Track A validation. Each artifact has an ID, the workflow stage that produces it, the role responsible, and the gate it is required for.

| Artifact ID | Name | Produced By | Required At |
|-------------|------|-------------|-------------|
| A-SCR | Case Screening Record | Case Manager | Candidate → Collecting Data gate |
| A-SMP | Source Map | Case Manager | Data collection initiation |
| A-SAL | Source Acquisition Log | Case Manager | Collecting Data → Ready gate |
| A-SCC | Source Collection Completion Certification | Case Manager | Collecting Data → Ready gate |
| A-EEL | Event Extraction Log | Case Manager | Timeline reconstruction |
| A-RCL | Reconciliation Log | Case Manager | Timeline finalization |
| A-TGR | Timeline Gap Register | Case Manager | Timeline finalization |
| A-FRS | Forward Reference Sweep Record | Case Manager | Timeline finalization |
| A-TLC | Timeline Completion Certification | Case Manager | Window construction initiation |
| A-WRD | Window Record (one per window) | Case Manager | Evaluator package assembly |
| A-WSV | Window Set Validation Record | Case Manager | Evaluator package assembly |
| A-PAB | Pre-Analysis Briefing Document | Case Manager | Evaluator package assembly |
| A-ORP | Outcome Record Package | Case Manager | Blinding workflow |
| A-CRC | Custodian Receipt | Data Custodian | Blinding Audit |
| A-WDL | Working Directory Lockdown Certification | Case Manager | Blinding Audit |
| A-ECD | Evaluator Conflict Declaration (per evaluator) | Each evaluator | Evaluator assignment |
| A-EVP | Evaluator Package | Case Manager | Evaluation initiation |
| A-EPR | Evaluator Package Review Record | Case Manager | Evaluation initiation |
| A-EBP | Expert Blind Package | Case Manager | Expert evaluation initiation |
| A-ESA | Expert Signal Assessment Form | Expert Blind Evaluator | Outcome reveal |
| A-BAD | Blinding Audit | Catalog Administrator | Ready → Evaluation In Progress gate |
| A-COR | CIS Output Record (one per window) | CIS Evaluator | Output sealing |
| A-SOP | Sealed CIS Output Package | Sealing Custodian | Outcome reveal |
| A-SRC | Seal Receipt | Sealing Custodian | Reveal Authorization |
| A-URP | Usefulness Rating Package | CIS Evaluator | Outcome reveal |
| A-RAT | Reveal Authorization | Outcome Authorization Authority | Outcome reveal |
| A-BCR | Baseline Comparison Record | Scoring Team | Metric computation |
| A-MCR | Metric Computation Record | Scoring Team | Case-level report |
| A-CTR | Case-Level Track Report | Scoring Team | Completed status |
| A-PDL | Protocol Deviation Log | Case Manager | Running; reviewed at each gate |
| A-QCL | Running QC Log | Case Manager | Running; reviewed at each gate |

**Total artifacts per case: 31** (plus one A-WRD per observation window, one A-COR per window, and one A-ECD per assigned evaluator)

A case at COMPLETED status has a full artifact set on file. A case missing any artifact from this list is not complete and cannot contribute to the track finding.

---

## Section 10 — Minimum Sample-Size Recommendation

### 10.1 Validation Program Requirement

`CIS_VALIDATION_PROGRAM.md` Section 13.2 specifies: **20 cases across at least 3 case categories** as the minimum Track A sample for a reportable finding.

### 10.2 Recommended Sample for the First Cycle

The minimum is 20. The recommended target for the first cycle is **28 completed cases**, distributed as follows:

| Category | Completed Cases | Rationale |
|----------|----------------|-----------|
| Major fraud | 10 | Richest archival record; highest evidence quality expected; establishes initial metric baselines |
| Organized crime | 8 | Multi-subsystem complexity; tests load displacement capability specifically |
| Corruption | 6 | Admissibility boundary and coherence classification focus |
| Kidnapping / missing persons | 4 | High temporal pressure; tests CSD detection specifically; hardest to collect, so lower target |

**Why 28 rather than 20:**
- Provides a 40% buffer above the minimum, accommodating expected exclusions during evaluation
- Allows subgroup analysis within categories (8–10 cases per category provides enough variance for a within-category finding)
- Provides enough power to detect a medium effect size (d = 0.5) in the lead-time advantage metric at 80% power (requires approximately 26 cases for a paired comparison)

### 10.3 Pipeline Stocking Requirement

To complete 28 cases, the pipeline must be stocked with approximately 50 registered candidates (same attrition logic as Section 1.5). Pipeline stocking and evaluation can overlap — begin evaluation on the first ready cases while acquisition continues for later cases. Do not wait for 50 candidates before starting evaluation.

### 10.4 Reporting Threshold

No track-level finding is reported with fewer than 20 completed cases, regardless of how favorable or unfavorable the results are. Results from 15–19 completed cases may be published as a preliminary report only, with explicit labelling as below-minimum sample.

---

## Section 11 — Pilot Evaluation Sequence

### 11.1 Purpose

The first five cases are a pilot — they validate the workflow as much as they validate CIS. Procedural errors in the workflow (indicator mapping failures, forward reference leakage, window design mistakes) are easier to identify and correct during the pilot than after 20 cases are in progress.

### 11.2 Pilot Selection Criteria

Pilot cases must be:
- **High or Medium evidence quality** (no LOW evidence quality cases in the pilot; workflow problems are harder to separate from data problems)
- **Distributed across at least two case categories** (do not run five fraud cases; the pilot should test the workflow across different system types)
- **Different in duration** (at least one short-duration case and one long-duration case, to test the window spacing design for both)
- **From different jurisdictions** (to test whether the indicator mapping generalizes across legal and institutional contexts)

### 11.3 Pilot Case Sequence

| Pilot Case | Category | Duration | Evidence Quality | Workflow Learning Objective |
|-----------|----------|----------|-----------------|----------------------------|
| Pilot-1 | Major fraud | Long (3+ years) | High | Test quarterly window design; test financial indicator mapping end-to-end; establish artifact production rhythm |
| Pilot-2 | Organized crime | Medium (12–18 months) | High | Test multi-subsystem load displacement mapping; test monthly window design |
| Pilot-3 | Corruption | Long (2+ years) | Medium | Test proxy indicator estimation; test admissibility boundary mapping with indirect evidence |
| Pilot-4 | Kidnapping | Short (days to weeks) | High | Test high-frequency window design; test CSD detection in compressed timeline |
| Pilot-5 | Major fraud | Medium (18–24 months) | Medium | Test workflow with one missing dimension; verify that evidence quality Medium cases produce usable output |

### 11.4 Pilot Review Gate

After all five pilot cases are scored, a **Pilot Review** is conducted before the remaining cases proceed to evaluation.

The Pilot Review assesses:

1. **Workflow fidelity:** Were all artifacts produced correctly? Were any protocol deviations logged? What caused them?

2. **Indicator mapping quality:** Did the approved indicator mappings produce values that CIS could actually use? Were any dimensions consistently missing because the mapping was unmappable in practice? Where were proxy estimations required and were they consistent?

3. **Window design quality:** Were windows appropriately spaced? Were there too few information-rich events in any window to produce a meaningful CIS state classification?

4. **Forward reference sweep effectiveness:** Did the scoring team identify any forward references in the Evaluator Package that the sweep missed?

5. **Evaluator experience:** Did evaluators report confusion about any part of the workflow? Did the Pre-Analysis Briefing Document provide sufficient context?

6. **Metric computation issues:** Were any metrics impossible to compute (e.g., because the outcome window was too narrow to capture any events)?

**Pilot Review outputs:**

- A **Pilot Review Report** (Artifact A-PRR; see Section 9) documenting all findings
- Amendments to this execution plan if workflow problems were identified (amendments are versioned and dated; the pilot cases are re-evaluated under the original plan for comparability)
- A **Go / No-Go decision** on proceeding with the remaining 23+ cases

**No-Go conditions:**
- More than 2 of 5 pilot cases excluded due to workflow failure (not data quality failure)
- Indicator mapping found to be fundamentally unmappable for one or more case categories
- Forward reference leakage identified in the evaluator package of any pilot case
- Protocol deviation rate > 30% of workflow steps across the five pilot cases

If No-Go is declared, the execution plan is revised before proceeding. The pilot cases that produced valid evaluations remain in the dataset; those that were invalidated are excluded.

### 11.5 Parallel Running During Pilot

During the pilot evaluation (Cases 1–5), acquisition and data collection for Cases 6–20 continues in parallel. The Pilot Review may redirect acquisition targets if specific categories prove harder to execute than expected.

---

## Section 12 — Risks and Failure Modes

### 12.1 Risk Register

| Risk ID | Risk | Likelihood | Impact | Mitigation | Contingency |
|---------|------|-----------|--------|-----------|-------------|
| R-01 | **Source inaccessibility** — critical sources unavailable or behind access barriers that cannot be resolved in time | High | Medium | Begin FOI requests and access negotiations before case registration; include access status in Source Map | If source cannot be obtained, assess whether remaining sources meet the two-independent-source minimum; exclude if not |
| R-02 | **Outcome leakage** — forward references not caught by sweep pass through to the Evaluator Package | Medium | High | Independent 20% spot-check of timelines; explicit forward reference sweep; Evaluator Package review by Case Manager | If discovered post-evaluation, case is excluded from primary analysis; document as protocol deviation |
| R-03 | **Indicator mapping failure** — the approved mapping does not yield usable values in practice for one or more dimensions | Medium | High | Pilot sequence tests mapping before full rollout; domain expert required to review mapping against actual source types | If mapping fails for a dimension consistently across multiple cases, revise mapping under domain expert guidance; re-run affected pilot cases; do not revise mapping mid-cycle |
| R-04 | **Evaluator prior knowledge** — assigned evaluator turns out to have knowledge of the case | Low | High | Conflict check at assignment; signed declaration; independent case-manager check of evaluator's professional background | If discovered pre-evaluation: reassign; if discovered during evaluation: exclude case from primary analysis; document breach |
| R-05 | **Window design inadequacy** — windows too sparse, too infrequent, or misaligned with the system's operational tempo | Medium | Medium | Domain expert review of window design before data collection begins; pilot cases test window design | If sparse windows are pervasive (> 40% of windows across a case), downgrade evidence quality; if pattern holds across a category, revise window design before proceeding |
| R-06 | **Blinding breach** — outcome information reaches the evaluator before analysis is complete | Low | High | Strict access controls on outcome directory; custodian role separation; document-level access logging | Case excluded from primary analysis immediately; breach documented; determine whether outcome knowledge has propagated to any other case in the pipeline |
| R-07 | **Pipeline attrition exceeds projection** — more than 40% of registered candidates excluded before reaching evaluation | Medium | Medium | Begin acquisition at 50 candidates, not 20; maintain acquisition activity in parallel with evaluation | If attrition exceeds 50%, increase acquisition target; identify the exclusion pattern (which criterion is failing most often) and adjust sourcing strategy |
| R-08 | **Scoring team metric disagreement** — independent recomputation produces materially different results | Low | Medium | Independent metric recomputation is a mandatory QC check; 0.02 tolerance for precision/recall | Joint review required before finalizing; if disagreement persists, Catalog Administrator arbitrates; the method producing the more conservative result is preferred |
| R-09 | **Expert blind evaluator non-availability** — domain expert cannot be recruited for a specific case category | Medium | Medium | Identify expert blind evaluator pool before beginning that category's pilot case | If no expert can be found for a category, that category's cases can only support a two-baseline comparison (operational + statistical); this is reported as a limitation, not a disqualification |
| R-10 | **CIS output incompleteness** — evaluator produces CIS outputs that lack required fields | Low | Medium | Pre-Analysis Briefing Document specifies required outputs; CIS Output Record is a structured form | Case Manager reviews sealed outputs before they are released to scoring; if required fields are missing, evaluator is contacted to confirm whether the omission is intentional (e.g., insufficient evidence for a trajectory estimate) or inadvertent; no revision permitted after sealing |
| R-11 | **Timeline reconstruction error** — dates incorrectly assigned during cross-source reconciliation | Medium | Medium | 20% independent spot-check; Reconciliation Log documents all reconciliation decisions | If errors are found in spot-check, full re-review of that case's timeline is required before evaluation proceeds |
| R-12 | **Calibration misclassification** — wrong calibration mode applied, affecting CIS confidence outputs | Low | Medium | Calibration mode is specified in the Pre-Analysis Briefing Document and approved by domain expert | If miscalibration is identified after evaluation, the effect on confidence range outputs is assessed; if material, case is flagged; calibration quality metric reports the finding |
| R-13 | **Category concentration failure** — pipeline concentrates in one case category; insufficient diversity for 3-category requirement | Medium | Medium | Acquisition targets set by category from the start (Section 1.6) | If one category proves unavailable, substitute another case type that tests the same CIS primitives; document the substitution |
| R-14 | **Slow pipeline throughput** — data collection and timeline reconstruction take significantly longer than estimated | High | Medium | Allocate 20–40 hours per case for data collection and 15–30 hours for reconstruction; build 4-week buffer between pipeline stages | If throughput is consistently below target, add a second Case Manager; identify which stage is the bottleneck |

### 12.2 Early Warning Indicators

The following indicators suggest a systemic problem requiring intervention before it becomes a risk event:

| Indicator | Threshold | Action |
|-----------|-----------|--------|
| Exclusion rate at screening | > 50% of screened cases excluded | Review screening criteria application; check whether source pools are producing unsuitable case types |
| Source collection failures | > 30% of Source Maps include a critical missing source | Adjust acquisition strategy; focus on case categories with richer archival records |
| Forward reference incidents | > 1 forward reference found in evaluator packages (not in the sweep) | Full audit of forward reference sweep procedure; retrain Case Managers |
| Protocol deviations | > 3 deviations per 5 cases | Investigate root cause; revise the relevant workflow section |
| Pilot Review No-Go | Any No-Go condition triggered | Full execution plan review before proceeding |
| Sparse window rate | > 40% of windows across any case | Window design revision for that case category |

---

## Section 13 — Final Review

### 1. What is the minimum work required before the first blinded Track A evaluation can begin?

The minimum work is a precisely ordered sequence. Nothing in the list can be skipped or reordered. The items are grouped by the role that must complete them.

**Governance setup (before any case work begins):**
- Assign all governance roles: Case Manager, Catalog Administrator, Data Custodian, Sealing Custodian, Outcome Authorization Authority
- Assign a domain expert for indicator mapping approval (at minimum one expert per case category)
- Identify the expert blind evaluator pool (minimum 2–3 experts per case category)
- Identify analyst usefulness raters (minimum 2 per case; domain specialists; no CIS involvement)
- Identify and form the Scoring Team (minimum 2 members; no analysis role in any case)
- Confirm that no individual holds conflicting roles across the governance structure
- Estimated time: 1–2 weeks if organizational context supports it; 4–6 weeks if sourcing externally

**Case acquisition (first pilot case):**
- Identify and screen at least 10 candidate cases using the Section 1.3 screening protocol
- Select Pilot-1 (Major fraud, long duration, High evidence quality)
- Register Pilot-1 in the catalog with complete initial metadata
- Estimated time: 2–4 weeks

**Source collection (Pilot-1):**
- Complete the Source Map; identify all sources and access methods
- Acquire and verify all sources; complete the Source Acquisition Log
- Obtain source collection completion certification from Case Manager
- Catalog Administrator reviews and approves
- Estimated time: 4–8 weeks (FOI access may extend this)

**Timeline reconstruction and window construction (Pilot-1):**
- Extract events from all verified sources into the Event Extraction Log
- Cross-source reconcile all events; document in Reconciliation Log
- Identify and document all gaps in the Timeline Gap Register
- Conduct the forward reference sweep; document every finding
- Certify the finalized timeline
- Design observation windows; obtain domain expert approval of window spacing
- Assign indicator values to all windows; complete Window Records
- Validate the window set
- Estimated time: 3–5 weeks

**Indicator mapping approval (Pilot-1):**
- Complete the IndicatorMap for the case
- Submit to domain expert for review and approval
- Domain expert may request revisions; allow one revision cycle
- Estimated time: 1–2 weeks (may overlap with window construction)

**Blinding setup (Pilot-1):**
- Assemble the Outcome Record Package
- Transfer to Data Custodian; obtain Custodian Receipt
- Certify the Working Directory Lockdown
- Identify and conflict-check the CIS evaluator
- Assemble the Evaluator Package; conduct the Evaluator Package Review
- Assemble the Expert Blind Package
- Conduct the Blinding Audit
- Obtain Catalog Administrator approval to proceed
- Estimated time: 1–2 weeks

**Total minimum elapsed time before first evaluation begins: 12–23 weeks from governance setup.**

The critical path is: Governance setup → Case acquisition → Source collection (including any FOI access waits) → Timeline reconstruction → Blinding setup. All steps are sequential for the first case. Subsequent cases can run in parallel with earlier cases at later stages.

---

### 2. What roles are required?

**Minimum staffing for the first pilot case:**

| Role | Minimum Headcount | Can Be Shared With | Cannot Be Combined With |
|------|------------------|--------------------|------------------------|
| Case Manager | 1 | — | Any evaluator role on the same case |
| Catalog Administrator | 1 | — | Case Submitter, Case Manager, Evaluator, Scorer |
| Domain Expert (indicator mapping) | 1 per case category | May cover multiple cases of the same category | Evaluator or Scorer for any case they approved mapping on |
| Data Custodian | 1 | — | Any analysis, evaluation, or scoring role |
| Sealing Custodian | 1 | Data Custodian if they are different individuals; cannot be the same person | CIS evaluator, Scoring Team |
| CIS Evaluator | 1 per case | — | Expert blind evaluator or scorer on the same case; anyone with prior case knowledge |
| Expert Blind Evaluator | 1–2 per case | May cover multiple cases if no conflict exists | CIS evaluator or scorer on the same case |
| Analyst Usefulness Rater | 2 per case | May cover multiple cases if no conflict exists | Scorer on the same case |
| Outcome Authorization Authority | 1 | — | Data Custodian, evaluator, scorer on the same case |
| Scoring Team | 2 per case | — | Anyone who had analysis or evaluation access to the same case |

**Minimum distinct individuals for a single case: 9**

(Case Manager, Catalog Administrator, Domain Expert, Data Custodian, Sealing Custodian, CIS Evaluator, Expert Blind Evaluator, Outcome Authorization Authority, and 2-person Scoring Team — where some of these are the same person: Catalog Administrator may be Outcome Authorization Authority if they had no analysis access; Sealing Custodian may be the same as a Scoring Team member.)

**Realistic minimum for the pilot cycle (5 cases in parallel):**

- 1 Catalog Administrator (covering all cases)
- 1–2 Case Managers (sharing the 5 pilot cases)
- 2–3 Domain Experts (1 per category)
- 1 Data Custodian (covering all cases)
- 1 Sealing Custodian (covering all cases)
- 1 Outcome Authorization Authority
- 3–5 CIS Evaluators (one per case; may reuse if no conflict; faster if not reused)
- 4–6 Expert Blind Evaluators
- 4–6 Analyst Usefulness Raters
- 1 Scoring Team of 2 (covering all cases sequentially)

**Total headcount for the pilot cycle: 15–25 individuals in distinct roles**, depending on overlap eligibility and case timing.

---

### 3. What is the shortest path from today to the first completed validation case?

The shortest path assumes optimal conditions: all governance roles can be filled immediately, a suitable high-evidence-quality fraud case with existing public court records can be identified without FOI requests, and the domain expert is available for rapid indicator mapping review.

**Optimistic timeline:**

| Week | Activity | Parallel? |
|------|----------|-----------|
| 1–2 | Governance setup: assign all roles; no role conflicts | — |
| 2–4 | Case acquisition: screen 10 candidates; register Pilot-1 | Governance continues |
| 4–10 | Source collection: acquire and verify all sources from public archives | Case acquisition continues for Pilots 2–5 |
| 8–12 | Timeline reconstruction: event extraction, reconciliation, gap identification, forward reference sweep | Source collection for Pilots 2–5 running in parallel |
| 11–13 | Window construction: window design, indicator assignment, domain expert review | Timeline reconstruction for Pilots 2–5 in parallel |
| 13–14 | Blinding setup: outcome transfer, evaluator assignment, package assembly, blinding audit | — |
| 14–18 | CIS evaluation + expert blind evaluation (parallel) | Blinding setup for Pilot-2 begins |
| 18 | Outcome reveal | — |
| 18–20 | Scoring: metric computation, baseline construction, case report | — |

**Earliest possible first completed case: 20 weeks from today (mid-October 2026), assuming:**
- No FOI requests are required (all sources are publicly accessible)
- A suitable case is identified in week 2
- Domain expert is available in week 11 for rapid turnaround
- Evaluator is available immediately upon package assembly
- No protocol deviations occur during evaluation

**Realistic first completed case: 26–30 weeks from today (November 2026 – January 2027), accounting for:**
- 2–4 week governance setup with external role recruitment
- One or two source access delays
- One revision cycle on indicator mapping
- Normal scheduling gaps in evaluator and expert availability

**The single greatest accelerant** is having a case-ready archival source pool identified before governance setup begins. If the team enters the process with a shortlist of 5–10 candidate cases already identified from public court records and regulatory enforcement archives, the acquisition stage compresses from 4 weeks to 1–2 weeks, and the overall path shortens by approximately 3 weeks.

**The single greatest delay risk** is FOI access. If the richest sources for a case category are behind FOI barriers, the source collection stage may extend by 3–12 months regardless of all other workflow efficiency. FOI requests should be filed as early as possible — if necessary, before case registration — and the acquisition strategy should prioritize case categories with robust public-access archival records for the pilot cycle.

**The shortest defensible path is 20 weeks.** Anything shorter compromises either source quality, timeline reconstruction depth, or blinding integrity in ways that would reduce the first completed case's contribution to the track finding.

---

*CIS Track A Execution Plan v1.0 — 2026-05-30*
*Operational plan for the first Track A validation cycle. Does not constitute a validation finding. Execution begins when governance roles are filled and the first pilot case clears the screening stage.*
