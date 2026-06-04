# Track A — Artifact B
# Case Reconstruction: T1-002 — Mars Climate Orbiter

**Artifact designation:** Artifact B — Case Reconstruction  
**Case ID:** T1-002  
**Status:** FROZEN  
**Session type:** Reconstruction Session — Artifact A blinded  
**Governing protocol:** Protocol v1 (A-02) + Clarification Addendum v1 (A-05) + Clarification Addendum v2 (A-20)  
**Session boundary:** This reconstruction was conducted without access to Artifact A predictions for any case in Batch 1.

---

## Mandatory Disclosure — GD-002 R-01 / A-03

**DISCLOSURE REQUIRED IN ALL TRACK A OUTPUTS**

This is a retrospective structured validation exercise. The AI system conducting this reconstruction (Claude, Anthropic) has been trained on data that includes the MCO Mishap Investigation Board Phase I Report and secondary accounts of the Mars Climate Orbiter mission loss. AI prior exposure for T1-002 is assessed as HIGH (M-06 v1.2). The reconstruction is conducted from the approved source materials as mediated through AI training data. A human reconstruction using the primary source document directly would provide stronger evidentiary separation.

Kappa values from CAL-2026-001 are characterized as intra-system consistency metrics. These values may not be characterized as inter-rater reliability measures until human coder validation is complete (OI-001).

**Classification:** RETROSPECTIVE STRUCTURED VALIDATION — AI-ASSISTED, HUMAN VALIDATION PENDING

---

## Section B1 — Case Metadata

| Field | Value |
|-------|-------|
| Case ID | T1-002 |
| Case Name | Mars Climate Orbiter (MCO) |
| Domain | Aerospace / Software Engineering / Mission Operations |
| Tier | 1 |
| AI Prior Exposure | HIGH |
| Primary Source | Mars Climate Orbiter Mishap Investigation Board Phase I Report. November 10, 1999. NASA. |
| Source Accessibility | CONFIRMED (M-06 v1.2) |
| Reconstruction Date | 2026-05-31 |
| Analyst Identity | EE/CIS Research Governance Team — AI-assisted |
| Governing Failure Conditions | Artifact 0 v1.0 |
| Artifact A Access | NONE — blinded per session boundary protocol |

---

## Section B2 — Phase Boundary Verification

Phase boundaries are adopted from M-06 v1.2 as the authoritative case registry record.

### Pre-Decision Phase

**Start boundary:** TCM-1 execution, January 18, 1999. Justification: TCM-1 was the first trajectory correction maneuver in which the AMD Micropropulsion unit-discrepant thruster data (SM_FORCES file, in pound-force-seconds rather than newton-seconds) was operationally applied to produce a corrective trajectory output. This is the first moment at which the unit discrepancy had measurable trajectory consequences. All signals in the pre-TCM-1 period are part of the developmental/specification environment; TCM-1 is the start of the operational signal-generation environment.

**End boundary:** Navigation team periapsis estimate of approximately 170 km altitude, September 15, 1999. Justification: By September 15, the navigation team's best computed periapsis estimate was approximately 170 km — significantly below the planned 226 km — and represented the last clear navigational signal that, if acted upon, could have triggered a mission-altering response before MOI commitment. This date is identified in M-06 v1.2 as the Pre-Decision Phase end.

**Boundary ambiguity note:** The Pre-Decision Phase start could alternatively be defined as the specification period when the SM_FORCES interface was specified, or as the period before launch when the AMD output format was not verified against the ICD. M-06 v1.2 defines the start as TCM-1 execution. This reconstruction follows that definition. The pre-launch specification period is treated as background context, not as part of the Pre-Decision Phase signal inventory. Signals arising from that period are noted but not inventoried as Pre-Decision Phase signals.

### Decision Phase

**Start:** Mars Orbit Insertion (MOI) burn sequence, September 23, 1999.

**End:** Loss of MCO communications signal during MOI blackout period, September 23, 1999, approximately 09:00:46 UTC. Signal was never reacquired.

**Decision Phase scope note:** The MOI burn was initiated on schedule. The "decision" was the MOI execution commitment — once MOI was initiated, the trajectory could not be corrected to prevent the low periapsis atmospheric entry. The decision not to investigate the navigation anomalies further before MOI commitment is a Decision Phase boundary question. This reconstruction treats the MOI execution as the terminal Decision Phase event, with the pre-MOI period (September 15–22, 1999) as the transition from Pre-Decision to Decision Phase.

---

## Section B3 — Evidence Timeline

*Events within the Pre-Decision Phase scope (January 18 — September 15, 1999) plus key context events.*

| Date | Event | Actor(s) | Signal | Classification at Time |
|------|-------|---------|--------|----------------------|
| 1992–1995 | AMD Micropropulsion develops spacecraft propulsion software for Lockheed Martin / MCO project. SM_FORCES output file configured to report in English unit (pound-force-seconds) convention consistent with AMD internal practices. | AMD / LM team | AMD internal unit convention established | Not classified as anomaly — consistent with internal practice |
| 1995–1998 | Interface Control Document (ICD) specifies that SM_FORCES data should be in metric units (newton-seconds). The ICD requirement was not checked against AMD's actual output format before mission operations. | MCO Project / AMD interface team | ICD metric unit specification | Governance document — no operational consequence until operations begin |
| Dec 11, 1998 | MCO launched from Cape Canaveral on Delta II rocket. All launch systems nominal. | MCO Project | Launch — nominal | Nominal |
| Jan 18, 1999 | **TCM-1 executed.** AMD provides SM_FORCES data to JPL navigation in pound-force-seconds. JPL navigation consumes data assuming newton-seconds. First application of unit-discrepant data to trajectory model. Trajectory model now incorporating a systematic error approximately 4.45× smaller than actual delta-V corrections. | AMD / JPL Navigation | Unit-discrepant SM_FORCES data applied to trajectory model | Nominal — no anomaly detected at single-event level |
| Jan–Feb 1999 | Post-TCM-1 navigation residuals: differences between predicted spacecraft position and best-estimate position noted. Residuals attributed to solar pressure uncertainty, atmospheric drag estimation, and other modeling factors. Root cause not identified. | JPL Navigation System Section | Navigation residuals | Below individual-event review threshold; attributed to known modeling uncertainties |
| Mar–Jun 1999 | TCM-2, TCM-3 (and subsequent trajectory correction maneuvers) executed. Each applies unit-discrepant AMD data. Navigation residuals persist and grow. Successive TCMs attempt to correct trajectory anomalies but each correction uses unit-discrepant data, compounding rather than resolving the trajectory divergence. | AMD / JPL Navigation | Cumulative trajectory correction anomalies | Each individually within normal uncertainty bands; accumulation not formally assessed |
| Jul–Aug 1999 | Navigation team continues to track anomalous residuals. Internal discussions about possible causes. The AMD SM_FORCES unit discrepancy is not identified as a candidate cause during this period. JPL navigation team operates on assumption that AMD data is in correct metric units as specified. | JPL Navigation System Section | Unexplained navigation residuals — ongoing | Anomalous but below formal review escalation threshold; actively under investigation within navigation team |
| Aug–Sep 1999 | Periapsis altitude estimates begin to diverge significantly from planned values. By early September, best estimates suggest MCO will arrive at Mars at significantly lower altitude than planned 226 km. | JPL Navigation System Section | Periapsis estimate deviation — accelerating divergence | Escalating concern; investigation intensified |
| Sep 8, 1999 | Navigation team calculates that close-approach distance to Mars is approximately 150–170 km — far below the planned 226 km — based on best-available trajectory data. This estimate is communicated within the navigation team and to mission management. | JPL Navigation / MCO Project | Low periapsis estimate | Formal mission concern — within recovery discussion but abnormal |
| Sep 15, 1999 | **[Pre-Decision Phase end boundary]** Navigation team's best estimate of periapsis altitude: approximately 170 km. This represents the last documented navigational assessment before MOI burn planning commitment. Possible explanations discussed include modeling errors and data anomalies, but the AMD unit discrepancy is not identified. | JPL Navigation | Periapsis estimate ≈170 km (planned 226 km) | Formal anomaly under investigation; MOI burn planning continues |
| Sep 22, 1999 | Final trajectory assessment before MOI. Navigation team's best estimate of periapsis still far below planned altitude. MOI burn is not halted or modified. | MCO Project / Navigation | Final pre-MOI trajectory assessment | Mission concern noted; decision made to proceed with MOI |
| Sep 23, 1999 | MOI burn initiated as scheduled. MCO enters Mars atmosphere at approximately 57 km altitude (compared to planned 226 km). Spacecraft destroyed by aerodynamic forces during atmospheric entry. Communications lost during MOI blackout; signal never reacquired. | MCO Project | Spacecraft loss | Post-hoc determination: mission failure |
| Nov 10, 1999 | MIB Phase I Report released. Root cause identified: AMD SM_FORCES data in pound-force-seconds vs. ICD-required newton-seconds. Unit discrepancy accumulated across nine months and nine trajectory correction maneuvers. | MCO MIB | Post-loss investigation finding | Root cause determination (post-event) |

---

## Section B4 — Signal Inventory

All signals are within the Pre-Decision Phase scope (January 18 — September 15, 1999) unless otherwise noted. Signals from the pre-launch period are included as context-establishing signals but marked accordingly.

---

**S-001 — AMD SM_FORCES file: pound-force-seconds unit convention**

| Field | Value |
|-------|-------|
| Signal ID | S-001 |
| Description | The AMD Micropropulsion SM_FORCES file reported attitude control thruster data in pound-force-seconds (English units) rather than newton-seconds (metric units) as required by the Interface Control Document. This file was produced by AMD and consumed by JPL's navigation team. |
| Source | MCO MIB Phase I Report — root cause determination section |
| First Appearance | Pre-launch (AMD configuration) — first operational consequence at TCM-1, January 18, 1999 |
| Visibility Level | INVISIBLE to JPL navigation team during operations — the unit convention was embedded in AMD's internal system and not surfaced at the interface boundary |
| Decision Relevance | DIRECT — this signal constitutes the root cause of the trajectory divergence that ended the mission |
| Notes | This signal was present continuously from TCM-1 through MOI. Its unit convention was not communicated across the AMD-JPL boundary in any operational document reviewed by the navigation team during mission operations. |

---

**S-002 — Post-TCM-1 navigation residuals (January 1999)**

| Field | Value |
|-------|-------|
| Signal ID | S-002 |
| Description | After TCM-1, the JPL navigation team noted unexplained differences between predicted and best-estimate spacecraft position. These residuals could not be fully attributed to known modeling factors (solar pressure, atmospheric drag). |
| Source | MCO MIB Phase I Report — navigation anomaly timeline |
| First Appearance | January 1999, following TCM-1 execution |
| Visibility Level | VISIBLE to JPL navigation team — residuals were tracked and investigated |
| Decision Relevance | INDIRECT — the residuals were the first operational manifestation of the unit discrepancy, but the unit discrepancy was not identified as the cause |
| Notes | The residuals were individually within the range attributable to known modeling uncertainties. The JPL navigation team investigated and attributed them to various sources without identifying S-001 as the cause. |

---

**S-003 — Cumulative trajectory correction anomalies (January–August 1999)**

| Field | Value |
|-------|-------|
| Signal ID | S-003 |
| Description | Across nine trajectory correction maneuvers, each TCM was computed using S-001 unit-discrepant data, producing corrections approximately 4.45× smaller than required. The cumulative effect of nine under-corrections was a progressively diverging trajectory. The anomalous residuals after each TCM were tracked but not aggregated into a single cumulative trajectory concern until late August. |
| Source | MCO MIB Phase I Report — TCM history and navigation anomaly analysis |
| First Appearance | Pattern emerged from TCM-1 through TCM-9; cumulative divergence began to exceed normal uncertainty bands in August 1999 |
| Visibility Level | PARTIALLY VISIBLE — each individual TCM anomaly was visible; the cumulative pattern was not formally assessed as a single signal until late in the mission |
| Decision Relevance | HIGH — the cumulative trajectory divergence produced the low-periapsis condition |
| Notes | The navigation team tracked individual TCM anomalies. Whether the cumulative divergence was formally assessed as a single pattern rather than a series of individual anomalies is a key coding question for Section B5. |

---

**S-004 — Periapsis estimate divergence from planned (September 1999)**

| Field | Value |
|-------|-------|
| Signal ID | S-004 |
| Description | Beginning in early September 1999, navigation computations showed the MCO periapsis altitude was estimated to be significantly below the planned 226 km. By September 15, the estimate was approximately 170 km. The divergence was large enough that mission management was formally engaged. |
| Source | MCO MIB Phase I Report — mission operations timeline |
| First Appearance | Early September 1999; formally documented by September 8-15 |
| Visibility Level | VISIBLE to navigation team and mission management by September 8 |
| Decision Relevance | DIRECT — the low periapsis estimate was the primary pre-MOI warning signal |
| Notes | This signal was above any individual-event threshold — it was formally communicated to mission management. The question for AP coding is whether it was acted upon appropriately as a signal for MOI modification. |

---

**S-005 — ICD metric unit specification (pre-mission)**

| Field | Value |
|-------|-------|
| Signal ID | S-005 |
| Description | The Interface Control Document (ICD) governing the SM_FORCES file specified that data must be provided in metric units (newton-seconds). This specification was not verified against AMD's actual output before mission operations. |
| Source | MCO MIB Phase I Report — interface specification and root cause analysis |
| First Appearance | Pre-mission (development phase) |
| Visibility Level | VISIBLE as a document — INVISIBLE as a verification requirement during operations (not operationally enforced) |
| Decision Relevance | STRUCTURAL — the ICD specification constitutes the organizational requirement that was not enforced at the interface boundary |
| Notes | This is a pre-mission context signal rather than a Pre-Decision Phase operational signal. Included for completeness of the interface architecture record. |

---

**S-006 — AMD internal coordinate system in English units**

| Field | Value |
|-------|-------|
| Signal ID | S-006 |
| Description | AMD's internal software system used English units as its native convention. The SM_FORCES output was produced by AMD's internal system before any unit conversion to the ICD-required metric format. The absence of a conversion step in AMD's production of the SM_FORCES file was the immediate cause of S-001. |
| Source | MCO MIB Phase I Report — root cause and technical analysis |
| First Appearance | Pre-mission — AMD software design phase |
| Visibility Level | INVISIBLE to JPL — AMD's internal system architecture was not visible across the organizational boundary |
| Decision Relevance | CAUSAL — explains why S-001 persisted undetected across the mission |
| Notes | This signal represents the organizational and software architecture that generated S-001. It was not visible to JPL navigation because it was an internal AMD system property, not a communicated interface characteristic. |

---

**S-007 — Navigation team anomaly investigation records (throughout mission)**

| Field | Value |
|-------|-------|
| Signal ID | S-007 |
| Description | The JPL navigation team conducted ongoing investigations of the navigation residuals identified in S-002 and S-003. These investigations proposed and assessed multiple candidate causes — solar pressure models, atmospheric drag estimates, propulsion system models — without identifying S-001 (unit discrepancy) as a candidate. |
| Source | MCO MIB Phase I Report — navigation anomaly investigation history |
| First Appearance | January 1999 (following TCM-1) — ongoing through September 1999 |
| Visibility Level | VISIBLE within the navigation team; extent of escalation to mission management during this period is documented in the Phase I Report |
| Decision Relevance | INDIRECT — the failure to identify the root cause during this period is the key decision environment finding |
| Notes | The navigation team's investigation was technically competent within its organizational scope but did not cross the organizational boundary to examine AMD's output format. The AMD team was not consulted about unit conventions during the residual investigation period. |

---

## Section B5 — AP Signal Coding

### WSP — Weak Signal Preservation

**Assessment: PRESENT**

**Evidence:**

The individual navigation residuals following each TCM (S-002, S-003) each fell within the range attributable to known modeling uncertainties. No single post-TCM residual exceeded the threshold for formal anomaly escalation to mission management or for a root-cause investigation that would cross the AMD-JPL boundary. The navigation team investigated the residuals but operated within the JPL navigation domain, proposing and assessing causes from within that domain's repertoire of known uncertainty sources.

The cumulative trajectory divergence (S-003) was the aggregate of nine individually sub-threshold anomalies. Each individual TCM anomaly was assessed on its own terms rather than aggregated with prior TCM anomalies into a single cumulative trajectory concern signal. The MCO MIB Phase I Report identifies the accumulation of unexplained residuals as a pattern that was investigated but not resolved before MOI.

**WSP sub-criteria assessment:**

WSP-1 (signal present in evidence environment): Present — S-002 and S-003 document individual trajectory anomaly signals at each TCM throughout the nine-month cruise phase.

WSP-2 (signal individually below threshold): Present — each individual post-TCM residual was within the normal uncertainty band for single-event navigation performance.

WSP-3 (no aggregation mechanism): Present — the navigation team tracked individual TCM anomalies but the evidence does not indicate that a cumulative-deviation assessment across all nine TCMs was formally produced and reviewed before the late-August/September period when the periapsis estimate divergence (S-004) became the primary concern.

**WSP coding: PRESENT**

**Uncertainty note:** The degree to which the navigation team formally assessed the cumulative pattern of anomalous residuals — versus assessing each TCM anomaly individually — is a point of evidence ambiguity that the reconstruction records. The MIB Phase I Report indicates that investigations were conducted, which suggests some level of pattern awareness. The coding of WSP-3 (absence of aggregation mechanism) carries moderate uncertainty.

---

### CDA — Cross-Domain Admission

**Assessment: PRESENT**

**Evidence:**

The central structural feature of this case is the failure of cross-domain signal integration. The AMD Micropropulsion domain and the JPL Navigation domain operated in parallel throughout the nine-month cruise phase. The SM_FORCES file (S-001) was the interface product: AMD produced it within their English-unit internal system, and JPL consumed it assuming metric units per the ICD specification. No cross-domain verification mechanism existed at this interface.

**CDA sub-criteria assessment:**

CDA-1 (signal from different domain than primary analytical domain): Present — the unit convention of AMD's SM_FORCES data (S-001) originated in AMD's internal software domain and needed to cross into JPL's metric-unit navigation computation domain.

CDA-2 (signal not admitted into the decision process): Present — the unit discrepancy embedded in S-001 was never admitted into the navigation trajectory computation with the correct unit interpretation. The SM_FORCES data entered the navigation computation as if it were in newton-seconds; the unit discrepancy was not identified as a signal requiring cross-domain verification.

CDA-3 (organizational admissibility architecture failure): Present — there was no institutional process requiring AMD to confirm their output unit convention against the ICD, nor any process requiring JPL navigation to verify AMD's output format before consuming the data. The interface control document (S-005) specified the required convention, but its verification was not operationally enforced.

**CDA coding: PRESENT**

**Evidence quality:** HIGH. This is the root cause finding of the MIB Phase I Report. The unit discrepancy represents a clear cross-domain failure: two organizationally separate technical domains with incommensurable unit conventions and no cross-domain verification mechanism.

---

### CR — Contradiction Retention

**Assessment: PARTIAL / UNCERTAIN**

**Evidence:**

The navigation team's investigation of anomalous residuals (S-007) produced multiple candidate explanations for the observed trajectory anomalies. The available evidence suggests that the navigation team investigated these anomalies and proposed various candidate causes, none of which was the unit discrepancy. The question for CR coding is whether a signal contradicting the accepted trajectory model was available and was resolved by retaining the nominal assessment.

The closest CR-qualifying scenario is the relationship between S-004 (periapsis estimate of ~170 km) and the decision to proceed with MOI on September 23. The periapsis estimate of 170 km was in explicit contradiction with the planned 226 km, and this contradiction was present in the evidence environment before the MOI execution decision. The decision to proceed with MOI despite the anomalous periapsis estimate may constitute a CR instance.

**CR sub-criteria assessment:**

CR-1 (two signals in direct contradiction on the same factual parameter): Partially present — the official trajectory plan (periapsis 226 km) and the navigation team's best estimate (periapsis ~170 km, later revised to ~57 km actual) constitute contradictory signals about the spacecraft's trajectory.

CR-2 (both signals present in the evidence environment): Present — both the planned trajectory and the estimated actual trajectory were known to mission management by September 8-15.

CR-3 (contradiction resolved by discarding one signal): Uncertain — whether the decision to proceed with MOI constituted a resolution of this contradiction by accepting the planned trajectory over the estimated actual trajectory, or whether the navigation team believed a recovery was possible within the uncertainty range, is not fully determinable from the Phase I Report summary level.

**CR coding: PARTIAL — UNCERTAIN**

**Uncertainty note:** The CR assessment carries significant uncertainty. The Phase I Report is an engineering investigation focused on root cause determination. The organizational decision-making record around whether the anomalous periapsis estimate was formally characterized as a contradiction that was then resolved — versus being assessed as an anomaly within recovery range — is not fully reconstructible from the available source material at this resolution. This is flagged as a CR-uncertainty finding for Artifact C.

---

## Section B6 — EE Structural Coding

### Load Displacement (LD)

**Assessment: PRESENT**

**Evidence:**

**LD-1 — Risk transferred without information:**

The risk of trajectory error arising from the unit discrepancy in S-001 was held within AMD's internal system and transferred to the JPL navigation computation through the SM_FORCES interface without the information needed to evaluate or detect the discrepancy. JPL navigation received the data as an authorized interface product. AMD's internal system architecture (S-006) was not part of the information provided at the interface. The navigation team could not evaluate the unit convention from within their operational scope.

**LD-2 — Source appears stable after transfer:**

The AMD Micropropulsion team's system was operationally stable and produced consistent output. Within AMD's domain, the SM_FORCES file was correctly produced according to their internal conventions. The source (AMD) appeared stable from any observable perspective — no anomalies were detectable in AMD's performance of their defined function.

**LD-3 — Destination holds risk without assessment:**

The JPL navigation team held the risk of the unit discrepancy in their trajectory computations for nine months without the information required to assess it. The navigation team was technically competent and actively investigated anomalous residuals; they were unable to identify the root cause because the causal information (AMD's unit convention) was not available to them from within the navigation domain.

**LD coding: PRESENT — all three sub-criteria satisfied**

---

### Fragility Accumulation (FA)

**Assessment: PARTIAL**

**Evidence:**

Multiple independently managed elements of the MCO mission system were simultaneously below their nominal verification and redundancy standards at the time of the mission operations period:

- Interface verification margin: The ICD unit specification (S-005) had not been verified against AMD's actual output format, reducing the interface verification margin to zero.
- Navigation redundancy margin: No cross-system check existed for the unit convention at the AMD-JPL interface.
- Investigation scope margin: The navigation team's residual investigation operated within the JPL navigation domain without crossing the organizational boundary to AMD.

Whether these constitute three independently managed margins that are each documentably below their nominal levels is an FA sub-criteria question. The Phase I Report focuses on root cause determination rather than multi-margin assessment, limiting the evidence base for FA.

**FA sub-criteria assessment:**

FA-1 (at least three independently managed margins simultaneously degraded): Partially present — the three elements described above represent different organizational functions (interface governance, navigation computation, investigation scope). Whether each was below a definable nominal level in the Phase I Report is uncertain at this evidence resolution.

**FA coding: PARTIAL — evidence base is insufficient for full FA confirmation at the sub-criteria level**

---

### Threshold Instability (TI)

**Assessment: PRESENT**

**Evidence:**

The MCO periapsis estimate of approximately 170 km (S-004, September 15, 1999) was within measurement uncertainty of the minimum safe periapsis for MOI. The planned periapsis was 226 km; the minimum safe corridor was approximately 80 km (below which atmospheric entry would occur). An estimate of 170 km placed the spacecraft within the corridor but approaching its lower boundary with significant uncertainty.

**TI sub-criteria assessment:**

TI-1 (critical parameter operating within measurement uncertainty of design limit): Present — the navigation team's periapsis estimate placed MCO near the boundary of the safe orbital insertion corridor. The actual periapsis was approximately 57 km, well below the atmospheric entry limit, meaning the spacecraft was operating significantly below its design-minimum periapsis without this being determinable from the navigation team's available measurement resolution.

**TI coding: PRESENT — the navigation system was operating near the threshold for safe orbital insertion without the navigation team being able to determine how close they were to the limit**

---

### Cascade Precondition (CP)

**Assessment: PRESENT**

**Evidence:**

The evidence environment contains at least two coupled failure modes:

**CP coupling 1:** Unit-discrepant data generation (S-001) coupled with trajectory correction application (S-003). Each TCM that applied S-001 data produced a correction approximately 4.45× smaller than required, compounding the trajectory error rather than correcting it. The correction mechanism was coupled to the error source through the same interface: each "corrective" action using S-001 data worsened the trajectory rather than recovering it.

**CP coupling 2:** The absence of a cross-domain verification mechanism coupled with the cumulative trajectory divergence. The navigation team's inability to cross the organizational boundary to investigate AMD's unit convention (the absence of cross-domain investigation) was coupled with the growing trajectory error: the investigation mechanism that could have identified the root cause was structurally inaccessible from within the affected domain.

**CP sub-criteria assessment:**

CP-1 (at least two coupled failure modes present): Present — the unit-discrepant TCM correction and the investigation scope limitation are coupled such that each TCM "correction" produced further trajectory divergence while the investigation mechanism that could have identified the cause was architecturally inaccessible.

CP-2 (coupling not reflected in decision-phase risk analysis): Present — the MIB Phase I Report indicates that the unit discrepancy was not identified during the operations period, which means the coupling between AMD's unit convention and JPL's trajectory computations was not in the mission operations risk model.

**CP coding: PRESENT**

**Note:** A-20 (Clarification Addendum v2) governs CP coding decisions in reconstruction. This CP assessment is documented per standard protocol; additional A-20 sub-criteria documentation should be applied if A-20 specifies additional requirements for CP confirmation. The reconstruction records CP as Present pending A-20 compliance verification.

---

### Hidden Common Link (HCL)

**Assessment: PRESENT**

**Evidence:**

**HCL-1 (signals from structurally independent sources):** S-001 (AMD SM_FORCES data in pound-force-seconds) and S-003 (cumulative trajectory correction anomalies at JPL) originated in structurally independent organizational domains — AMD Micropropulsion and JPL Navigation — with distinct organizational roles, personnel, software systems, and geographic locations.

**HCL-2 (non-connection documented during decision phase):** The connection between AMD's unit convention and JPL's navigation anomalies was not established during the nine-month operations period. The MIB Phase I Report specifically notes that the AMD team was not consulted about unit conventions during the navigation team's investigation of anomalous residuals. S-007 documents the navigation team's investigation record, which proposed multiple candidate causes without identifying S-001.

**HCL-3 (investigation confirmed shared structural cause):** The MIB Phase I Report confirmed that S-001 (AMD unit discrepancy) was the shared structural cause connecting the AMD SM_FORCES output and the JPL trajectory computation anomalies.

**HCL-4 (connection non-obvious from within either domain):** The connection between the AMD unit convention and the JPL navigation anomalies was non-obvious from within either domain alone. From within AMD's domain, the SM_FORCES file was correctly produced according to internal conventions. From within JPL's navigation domain, the residuals were investigated using the tools and knowledge available to the navigation team, which did not include the capability to verify AMD's unit convention.

**HCL coding: PRESENT — all four sub-criteria satisfied**

---

### Structural Incongruence (SI)

*Note: SI is assessed here as indicated in the Artifact B protocol. The five primary EE structures in Artifact 0 v1.0 do not include SI as a named structure. SI is assessed as a supplementary structural finding consistent with A-20's extended framework vocabulary, if applicable.*

**Assessment: PRESENT**

**Evidence:**

A structural incongruence exists in this case between:

**The operational assumption embedded in JPL's navigation system:** All interface data products provided to the navigation computation are in metric units as specified in the ICD.

**The operational reality of AMD's SM_FORCES file:** The data was in pound-force-seconds, not newton-seconds.

This incongruence was structural — it arose from the difference between the ICD specification and AMD's internal implementation — and it persisted invisibly across the entire nine-month cruise phase because the interface did not include a verification mechanism that could surface it. The incongruence was not a temporary misunderstanding or a human error that could have been corrected by attention — it was embedded in the systems on both sides of the interface.

**SI coding: PRESENT — the operational assumptions of the receiving system (JPL navigation) were structurally incongruent with the operational reality of the producing system (AMD Micropropulsion), and this incongruence was architecturally invisible at the interface boundary**

---

## Section B7 — Visibility Analysis

### Which Signals Were Visible

**S-004 (periapsis estimate divergence):** VISIBLE to navigation team and mission management by September 8-15, 1999. The divergence from planned periapsis was formally communicated and investigated. Visibility was high in the final weeks before MOI.

**S-002 and S-003 (individual TCM anomalies and cumulative residuals):** VISIBLE to the JPL navigation team. The anomalies were tracked, investigated, and discussed. Visibility was within the navigation domain, with uncertain escalation to mission management during the investigation period.

**S-007 (navigation team investigation records):** VISIBLE within the navigation team. Whether the investigation scope crossed to the AMD domain is documented as NOT crossing: AMD was not contacted about unit conventions.

### Which Signals Were Filtered

**S-001 (AMD unit convention in SM_FORCES):** FILTERED — invisible to JPL navigation throughout the mission. The filtering mechanism was the organizational boundary between AMD and JPL combined with the absence of an interface verification step.

**S-006 (AMD internal English-unit system):** FILTERED — AMD's internal system architecture was not visible across the organizational boundary.

**The causal connection between S-001 and S-002/S-003:** FILTERED — the navigation team's investigation of S-002/S-003 did not identify S-001 as the cause, meaning the most operationally significant signal — that the AMD data was in the wrong units — was filtered throughout the investigation period.

### Filtering Mechanism

**Primary filtering mechanism — Organizational boundary without verification interface:**

The AMD-JPL interface did not include a cross-domain verification step that would surface unit-convention information at the boundary. The ICD specified metric units, but the specification was not operationally verified against AMD's actual output. The boundary functioned as a trust interface: JPL navigation trusted that AMD's output conformed to the ICD. This trust was the filtering mechanism — the signal about AMD's actual unit convention was not structurally positioned to cross the boundary.

**Secondary filtering mechanism — Investigation scope limitation:**

The JPL navigation team's investigation of anomalous residuals operated within JPL's organizational scope. The investigation assessed candidates available within the JPL navigation toolset: solar pressure models, atmospheric drag estimates, thruster performance models. The AMD unit convention was not in the JPL navigation team's candidate set because the investigation did not cross the organizational boundary to AMD.

### Organizational Location of Filtering

The filtering occurred at the AMD-JPL interface boundary — the point at which the SM_FORCES file was produced by AMD and consumed by JPL without unit-convention verification. This was not a filtering decision made by an individual or group; it was an architectural filtering condition embedded in the interface structure. No organizational actor made a decision to suppress the unit-convention signal; the organizational structure did not include a position or process that would have admitted it.

---

## Section B8 — Alternative Explanation Inventory

*Alternative explanations supported by the source materials. No ranking. No comparison to EE framework. Inventory only.*

**AE-001 — Unit conversion software error:**
The most proximate causal account: AMD engineers coded the SM_FORCES output in English units. This was a software production error — the code did not include the conversion from AMD's internal English-unit convention to the ICD-specified metric format. Root cause: a software engineering implementation error.

**AE-002 — Interface specification failure:**
The interface between AMD and JPL was inadequately specified or inadequately verified. The ICD specified metric units but no verification step confirmed AMD's compliance. Root cause: a configuration management and interface governance failure.

**AE-003 — Testing and verification gap:**
The mission's testing and verification program did not include a check that would have compared AMD's actual SM_FORCES output against the ICD unit specification. Root cause: an inadequate test coverage gap in the system verification program.

**AE-004 — Navigation investigation scope limitation:**
The JPL navigation team investigated anomalous residuals throughout the mission but confined the investigation to within the JPL navigation domain. The investigation did not extend to verification of AMD's output format. Root cause: an insufficient investigation methodology that did not consider cross-domain causes.

**AE-005 — Accumulated navigation error:**
The mission was lost because nine months of unit-discrepant trajectory corrections accumulated into an unrecoverable trajectory divergence. Root cause (proximate): the accumulated effect of repeated unit-discrepant corrections across the cruise phase.

**AE-006 — Management escalation failure:**
The navigation team's anomalous residual findings were investigated but may not have been escalated to mission management at the level or urgency that would have triggered a cross-organizational investigation. Root cause: insufficient escalation of technical anomalies to management decision-making authority.

---

## Section B9 — Reconstruction Findings

### Signal Environment

The Mars Climate Orbiter Pre-Decision Phase evidence environment contained a persistent, invisible structural signal (S-001 — AMD unit discrepancy) and a series of visible but individually sub-threshold manifestations of that signal (S-002, S-003 — navigation residuals and TCM anomalies). The invisible signal was architecturally filtered at the AMD-JPL interface boundary; its manifestations were visible to the JPL navigation team but were not traceable to their cause within the investigation scope available to that team.

By the end of the Pre-Decision Phase (September 15, 1999), one signal had exceeded any reasonable individual-event threshold: S-004, the periapsis estimate of approximately 170 km versus the planned 226 km. This signal was formally communicated to mission management. Whether S-004 constituted an actionable decision signal before MOI is a Decision Phase question beyond the Pre-Decision Phase scope of this reconstruction.

### Structural Environment

Four EE structures are coded as Present: Load Displacement, Threshold Instability, Cascade Precondition, and Hidden Common Link. Structural Incongruence is coded as Present. Fragility Accumulation is coded as Partial — the evidence base is insufficient for full FA sub-criteria confirmation at the reconstruction resolution available.

The strongest structural finding is the co-presence of Load Displacement and Hidden Common Link: the risk was architecturally displaced across the AMD-JPL interface (LD), and the causal connection between AMD's unit convention and JPL's trajectory anomalies was architecturally invisible from within either domain alone (HCL). These two structures are both well-supported by the Phase I Report's root cause analysis.

### Visibility Environment

The primary filtering mechanism was an organizational boundary without a cross-domain verification interface. The signal requiring cross-domain admission (AMD's unit convention) was architecturally positioned to be invisible at the boundary — not as a result of a human decision to suppress it, but as a structural property of the interface design. The navigation team's investigation methodology, which was technically competent within its organizational scope, could not access the information needed to identify the root cause from within that scope.

### AP Environment

CDA is coded as Present — the strongest AP finding, well-supported by the root cause determination. WSP is coded as Present — nine months of individually sub-threshold navigation anomalies without aggregation into a cumulative pattern concern before S-004 became dominant. CR is coded as Partial/Uncertain — the evidence supports possible CR between the periapsis estimate and the MOI execution decision, but the Phase I Report does not provide sufficient resolution on the Decision Phase decision-making record to confirm full CR sub-criteria.

---

## Section B10 — Reconstruction Freeze

### Session Boundary Confirmation

This reconstruction was conducted without access to Artifact A predictions for T1-002 or for any other case in Batch 1. No prediction document, prediction summary, or prediction comparison document was accessed during this session. The reconstruction findings in Sections B4 through B9 were produced independently of prediction content.

### Reconstruction Completion Record

| Field | Value |
|-------|-------|
| Reconstruction completion date | 2026-05-31 |
| Analyst identity | EE/CIS Research Governance Team — AI-assisted |
| Artifact A access during session | NONE — session boundary maintained |
| Primary source accessed | MCO MIB Phase I Report (as mediated through AI training data) |
| Session boundary compliance | CONFIRMED |

### Freeze Declaration

This document is frozen as of 2026-05-31. No finding may be revised in response to prediction content. The comparison between this reconstruction and Artifact A predictions is the exclusive function of Artifact C. This document constitutes the reconstruction record for T1-002 within Track A Batch 1.

**AP coding status at freeze:**
- WSP: PRESENT
- CDA: PRESENT
- CR: PARTIAL / UNCERTAIN

**EE coding status at freeze:**
- Load Displacement: PRESENT
- Threshold Instability: PRESENT
- Cascade Precondition: PRESENT
- Hidden Common Link: PRESENT
- Fragility Accumulation: PARTIAL
- Structural Incongruence: PRESENT

**FROZEN — 2026-05-31**

---

*Track A — Artifact B — T1-002 Mars Climate Orbiter Reconstruction | EE/CIS Research Governance Team | 2026-05-31*  
*FROZEN — REC-ART — RECONSTRUCTION ONLY — NO PREDICTION COMPARISON PERMITTED*
