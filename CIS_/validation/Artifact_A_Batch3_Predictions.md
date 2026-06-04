# Artifact A — Batch 3 Pre-Registered Predictions

**Artifact type:** Artifact A (Pre-Registered Predictions)  
**Batch:** 3  
**Cases:** T1-001 (Challenger), T2-004 (Mars Observer), T2-005 (NOAA-N Prime)  
**Status:** FROZEN  
**Date:** 2026-06-02  
**Authority:** M-06 v1.5; A-27 (Protocol Clarification Addendum v3); A-28 (Prediction Template v1.1); A-01-CORR-01-A  
**Information boundary compliance:** Predictions generated from M-06 v1.5 outcome statements, Phase Boundary Definitions, general domain knowledge, and EE/CIS framework documents only. No primary investigation documents accessed.

---

## Prediction Format

For each construct:
- **Prediction:** PRESENT / ABSENT / UNCERTAIN
- **Confidence:** HIGH / MODERATE / LOW
- **Structural mechanism predicted:** What specifically the construct would look like in this case
- **Falsification condition:** What in the reconstruction would disconfirm this prediction

Construct set per A-01-CORR-01-A: CR, WSP, HCL, CDA, LD, SI, FA  
SI sub-criteria (SI-1 through SI-4) required per A-01-CORR-01-A for any PRESENT SI prediction.

---

## Case T1-001 — Space Shuttle Challenger (STS-51-L)

**CASE-ID:** T1-001  
**Tier:** 1  
**AI Prior Exposure Assessment:** HIGH  
**Outcome Statement (from M-06 v1.5):** The Space Shuttle Challenger broke apart 73 seconds after launch on January 28, 1986, due to the failure of an O-ring seal in the right solid rocket booster, as established by the Rogers Commission, 1986.

**Phase Boundaries (from M-06 v1.5):**
- Pre-Decision Phase start: First documented O-ring anomaly referenced in Rogers Commission Report Vol. I
- Pre-Decision Phase end: Commencement of January 27, 1986 teleconference between NASA and Morton Thiokol
- Decision Phase: January 27–28, 1986 teleconference and launch authorization
- Post-Decision Phase end: Challenger breakup, T+73 seconds

---

### CR — Contradiction Resolution

**Prediction:** PRESENT  
**Confidence:** HIGH

**Structural mechanism predicted:** During the Decision Phase (January 27–28 teleconference), Morton Thiokol engineers explicitly raised concern that the O-ring temperature-performance relationship made the January 28 launch unsafe at the forecast temperature. This concern constitutes a contradicting signal: it directly contradicts the implicit ground truth that the launch is safe to proceed. The investigation record will show this contradiction was closed by organizational pressure — management requesting engineers to defer to launch recommendation — rather than by direct disconfirmation of the engineering concern (which would require empirical data showing O-ring performance was adequate at 29°F, data that did not exist). The closure mechanism will be classifiable as alternative explanation adoption: "the O-rings will probably be adequate" accepted over "the O-rings will probably not be adequate" without the test that would distinguish them.

**Falsification condition:** The reconstruction finds no documented instance of the engineering concern being raised in a form that constitutes a contradiction to the launch decision, or finds that the concern was resolved by direct temperature-performance testing at the relevant temperature range before the launch decision.

---

### WSP — Weak Signal Preservation

**Prediction:** PRESENT  
**Confidence:** MODERATE

**Structural mechanism predicted:** The Pre-Decision Phase (from first O-ring anomaly through the eve of the teleconference) will contain a series of individually below-threshold O-ring erosion events across prior flights. Each flight's erosion will have been individually assessed as within acceptable limits, explained by specific flight conditions, or accepted as within the in-family range. No aggregation mechanism will have formally combined the erosion events into a cumulative trend assessment that would cross the threshold for launch hold. The pattern of O-ring erosion across temperatures — individually managed, never aggregated as a trending structural concern — constitutes the WSP signal environment.

**Falsification condition:** The reconstruction finds a formal aggregation mechanism that combined O-ring erosion events across flights into a cumulative trend assessment, or finds that no pattern of individually-below-threshold O-ring signals existed in the pre-decision period.

---

### SI — Structural Incongruence

**Prediction:** PRESENT  
**Confidence:** MODERATE  
**Sub-criterion:** SI-1 (Specification assumption mismatch)

**Structural mechanism predicted:** The O-ring performance specification assumed an operational temperature range validated by prior flight data. The January 28 launch temperature (29°F) fell below the lower bound of the temperature range within which O-ring performance had been empirically characterized. This is an SI-1 condition: the specification embedded an assumption about operating conditions (launch within the tested temperature envelope) that the actual conditions violated. The structural incongruence is not that the O-ring failed (value-level anomaly) but that the specification's temperature assumption was violated before launch — a mismatch between the specification's operating envelope and the actual operating condition that was structurally present and assessable before the outcome.

**Falsification condition:** The reconstruction finds that the O-ring performance specification explicitly addressed and validated performance at temperatures consistent with or below the January 28 forecast, or that no specification temperature assumption exists that the launch condition violated.

---

### HCL — Hidden Common Link

**Prediction:** UNCERTAIN  
**Confidence:** LOW

**Structural mechanism predicted:** A weak HCL candidate exists between the Thiokol engineering domain and the NASA management domain — both held information about O-ring performance but in different organizational contexts, and the shared structural source (the actual O-ring temperature-performance relationship) was not synthesized across the two domains. However, this case is more likely to present as CDA (admission failure) than HCL (hidden common link requiring cross-domain shared-cause synthesis), because the signals in the two domains were not independently anomalous — Thiokol engineers explicitly communicated their concern, making this a governance failure rather than an integration failure.

**Falsification condition:** N/A — prediction is uncertain. Reconstruction will determine whether HCL or CDA better characterizes the cross-domain structure.

---

### CDA — Cross-Domain Admission

**Prediction:** PRESENT  
**Confidence:** MODERATE

**Structural mechanism predicted:** The Thiokol engineering domain possessed the temperature-performance relationship data. The NASA management domain held decision authority for launch. The teleconference structure created a formal cross-domain communication event, but the engineering evidence did not fully cross into the decision domain in actionable form — the management request to "take off your engineering hats" signals a domain boundary at which the engineering signal was filtered before it could operate as an admission criterion in the decision. The CDA failure is not that the information never crossed (it crossed in the teleconference) but that the crossing mechanism filtered the structural content before admission into the decision framework.

**Falsification condition:** The reconstruction finds that Thiokol's engineering evidence was fully admitted into the decision framework in a form that could have operated as a launch hold criterion, and was rejected on the merits rather than filtered at the admission boundary.

---

### LD — Load Displacement

**Prediction:** PRESENT  
**Confidence:** MODERATE

**Structural mechanism predicted:** The launch risk assessment was displaced from NASA's independent verification capability to the contractor's (Morton Thiokol's) recommendation. When NASA management reversed the decision burden ("take off your engineering hats"), they were making a load displacement visible: the evaluation of whether the O-ring risk was acceptable had been transferred to the contractor team, and the receiving context (Thiokol management under NASA pressure) lacked the independence to exercise that evaluation against its own engineers' judgment. The risk evaluation capacity was structurally compromised at the point of transfer.

**Falsification condition:** The reconstruction finds that NASA conducted an independent assessment of O-ring risk at the relevant temperature rather than relying on the contractor's recommendation, or that no decision-authority transfer occurred.

---

### FA — Fragility Accumulation

**Prediction:** PRESENT  
**Confidence:** LOW-MODERATE

**Structural mechanism predicted:** Multiple simultaneously degraded safety conditions at launch: forecast temperature below tested O-ring range; O-ring erosion history across prior flights; ice on the launch structure; schedule pressure from prior delays. Each condition individually managed and accepted. No aggregate assessment of the cumulative safety margin state. This is a weaker FA case than Columbia (where the multi-margin degradation is more explicitly documented) but the simultaneous presence of multiple below-nominal conditions without aggregate assessment is structurally present.

**Falsification condition:** The reconstruction finds that the aggregate safety state was formally assessed across all simultaneously degraded conditions before launch authorization, or that fewer than two simultaneous below-nominal safety conditions existed.

---

### Conventional Explanation Score Prediction

**Predicted CES:** LOW (0.20–0.35)

The conventional account of Challenger is highly developed: O-ring failure at cold temperature, management override of engineering concerns. This account substantially overlaps with the EE/CIS structural account. CR (management override of engineering concern) is explicitly documented in the Rogers Commission Report and is part of the established public narrative. WSP (O-ring erosion pattern) is also present in the Rogers Commission analysis. The EE/CIS structural account adds: SI (temperature specification assumption violation), LD (displaced risk evaluation), and FA (aggregate condition assessment). The marginal contribution of the EE/CIS framework over the conventional account is expected to be low for this case due to its narrative saturation. This is expected and is consistent with T1-001's role as a calibration cross-validation case.

---

## Case T2-004 — Mars Observer

**CASE-ID:** T2-004  
**Tier:** 2  
**AI Prior Exposure Assessment:** MEDIUM  
**Outcome Statement (from M-06 v1.5):** Contact with Mars Observer was lost on August 21, 1993, three days before planned Mars orbit insertion, most likely due to rupture of the propulsion system pressurization line during fuel pressurization for MOI, as established by the Mars Observer Failure Review Board, 1993.

**Phase Boundary confirmation:** Phase Boundaries as specified in M-06 v1.5 are based on general knowledge of the case. Formal confirmation against the Failure Review Board Report will occur during reconstruction (Artifact B) before signal inventory construction.

**Phase Boundaries (from M-06 v1.5):**
- Pre-Decision Phase start: Propulsion system design and pressurization line specification acceptance — development phase, approximately 1985–1990
- Pre-Decision Phase end: Commencement of pre-MOI propulsion pressurization sequence, August 21, 1993, approximately 17:00 UTC
- Decision Phase: Propulsion pressurization sequence through loss of signal, August 21, 1993
- Post-Decision Phase end: Loss of Mars Observer communications, August 21, 1993, approximately 20:00 UTC

---

### LD — Load Displacement

**Prediction:** PRESENT  
**Confidence:** HIGH

**Structural mechanism predicted:** The Mars Observer propulsion system design was adapted from Earth-orbiting spacecraft technology under schedule and cost constraints. Design trade-offs during development — specifically regarding the pressurization line's vulnerability to propellant residue accumulation during extended mission durations — were accepted and effectively transferred to the mission operations phase. The receiving context (mission operations at MOI) had no technical capacity to mitigate, verify, or independently assess the pressurization risk once the spacecraft was en route to Mars. The 11-month transit exposed the propulsion system to thermal cycling and propellant migration conditions that ground testing had not fully characterized. The risk of pressurization line failure under these conditions was a load displaced from the development phase to the mission phase without the receiving context having evaluation or mitigation capacity.

**Falsification condition:** The reconstruction finds that the propulsion system risk was independently assessed and explicitly accepted by mission operations with full technical understanding of the residue accumulation risk under extended transit conditions, or that the development-phase design trade-offs did not involve a known pressurization risk.

---

### SI — Structural Incongruence

**Prediction:** PRESENT  
**Confidence:** MODERATE  
**Sub-criterion:** SI-1 (Specification assumption mismatch)

**Structural mechanism predicted:** The propulsion system specification was developed and validated for Earth-orbiting spacecraft mission profiles: shorter mission durations, more frequent operations, different thermal environments. The Mars Observer mission imposed an 11-month transit phase with conditions outside the specification's validated envelope — specifically, extended propellant dormancy creating conditions for residue migration into the pressurization line. The specification's implicit assumption about operating conditions (mission profile consistent with Earth-orbiting applications) was structurally incongruent with the Mars mission profile. This is an SI-1 condition: the specification assumed a mission profile different from the actual operating environment.

**Falsification condition:** The reconstruction finds that the propulsion system specification was explicitly revalidated for the Mars mission transit profile, or that the failure mechanism is unrelated to mission-profile assumptions in the specification.

---

### WSP — Weak Signal Preservation

**Prediction:** UNCERTAIN — POSSIBLE  
**Confidence:** LOW

**Structural mechanism predicted:** Pre-launch or pre-MOI evidence of propulsion system anomalies (pressure readings, propellant handling concerns, ground test anomalies) may constitute individually-below-threshold signals that were individually managed without pattern aggregation. Whether such a pattern exists in the documentary record is uncertain from general knowledge.

**Falsification condition:** Reconstruction finds no sub-threshold propulsion anomaly pattern, or finds a formal aggregation mechanism that assessed cumulative propulsion risk before MOI.

---

### CR — Contradiction Resolution

**Prediction:** UNCERTAIN — POSSIBLE  
**Confidence:** LOW

**Structural mechanism predicted:** If pre-mission testing or engineering review produced anomalous results that were individually addressed or waived under schedule pressure rather than formally resolved, CR would be present. The specific mechanism — a contradicting signal closed by alternative explanation rather than direct disconfirmation — would require the reconstruction to identify a documented anomaly that received a closure decision.

**Falsification condition:** Reconstruction finds no documented contradicting signals in the pre-mission record, or finds all anomalies were resolved through direct testing.

---

### HCL — Hidden Common Link

**Prediction:** ABSENT  
**Confidence:** MODERATE

**Structural mechanism predicted:** The Mars Observer case does not strongly suggest an HCL condition based on general knowledge. The failure mechanism is primarily a single-system design limitation under extended mission conditions, not a cross-domain shared-cause integration failure. The organizational structure (single primary contractor, single mission operations team) does not suggest independent domain parallelism of the type HCL requires.

**Falsification condition:** Reconstruction finds structurally independent domains with correlated SI-bearing signals sharing a hidden common source.

---

### CDA — Cross-Domain Admission

**Prediction:** UNCERTAIN  
**Confidence:** LOW

**Structural mechanism predicted:** Whether propulsion risk information from the development engineering domain was fully admitted into the mission operations decision context is uncertain. If the design trade-off documentation did not flow through to mission operations planning, this would constitute a CDA condition.

**Falsification condition:** Reconstruction confirms propulsion risk documentation was fully transmitted to and integrated into mission operations risk assessment.

---

### FA — Fragility Accumulation

**Prediction:** UNCERTAIN  
**Confidence:** LOW

**Structural mechanism predicted:** Multiple simultaneously degraded mission conditions at MOI are possible — propulsion system vulnerability, schedule pressure, extended communication blackout during MOI, limited redundancy — but the specific multi-margin degradation pattern requires reconstruction to confirm.

**Falsification condition:** Reconstruction finds no evidence of multiple simultaneously degraded safety margins at MOI.

---

### Conventional Explanation Score Prediction

**Predicted CES:** MEDIUM (0.40–0.55)

The conventional account of Mars Observer focuses on the propulsion hardware failure and the "bad luck" narrative common to unexplained spacecraft losses. The EE/CIS structural account focuses on LD (design trade-offs displaced to mission phase) and SI (specification assumption mismatch between Earth-orbiting and Mars mission profiles). These structural claims are present in the engineering community's post-hoc analysis but are not the widely known public account. The CES is expected to be medium — lower than T1 cases, reflecting reduced narrative saturation, but not as low as T2-005 which has the least saturated account.

---

## Case T2-005 — NOAA-N Prime Satellite Manufacturing Incident

**CASE-ID:** T2-005  
**Tier:** 2  
**AI Prior Exposure Assessment:** MEDIUM-LOW  
**Outcome Statement (from M-06 v1.5):** The NOAA-N Prime satellite was dropped and damaged at Lockheed Martin's Sunnyvale facility on September 6, 2003, when the spacecraft, attached to a rotation test fixture, was not recognized as attached when technicians removed 24 of 27 bolts from the fixture interface, causing the 1,550-pound spacecraft to fall and sustain significant structural damage.

**Phase Boundary confirmation:** Phase Boundaries as specified in M-06 v1.5 are based on general knowledge of the case. Formal confirmation against the investigation report will occur during reconstruction (Artifact B).

**Phase Boundaries (from M-06 v1.5):**
- Pre-Decision Phase start: Rotation test fixture design specification and bolt retention procedure — manufacturing engineering design phase, prior to satellite delivery
- Pre-Decision Phase end: Beginning of scheduled rotation operation, September 6, 2003, morning shift
- Decision Phase: Technician bolt removal from rotation fixture while spacecraft attached
- Post-Decision Phase end: Spacecraft drop and structural impact, September 6, 2003

---

### CDA — Cross-Domain Admission

**Prediction:** PRESENT  
**Confidence:** HIGH

**Structural mechanism predicted:** The spacecraft attachment state — specifically, that the NOAA-N Prime satellite was currently attached to the rotation fixture — constituted critical structural information in the spacecraft integration domain. The bolt-removal operation occurred in the rotation fixture operations domain. The structural information (spacecraft is attached) was not admitted into the bolt-removal decision context before operations commenced. The two domains — spacecraft integration team and fixture operations team — were organizationally and procedurally independent at the point of the operation. The attachment state existed as a fact; its absence from the bolt-removal work order context is the CDA condition. The satellite was lost not because the information didn't exist but because no admission mechanism transferred it across the domain boundary.

**Falsification condition:** The reconstruction finds that the spacecraft attachment state was documented in and consulted before the bolt-removal work order was executed, or that a formal cross-domain verification step existed in the procedure and was bypassed through a documented decision.

---

### LD — Load Displacement

**Prediction:** PRESENT  
**Confidence:** HIGH

**Structural mechanism predicted:** The responsibility for verifying spacecraft attachment before fixture operations was structurally distributed but not explicitly assigned. The risk that the fixture might hold the spacecraft during bolt-removal — and the verification capacity to confirm whether it did — was implicitly transferred to the fixture operations team when they received the work order. The fixture operations team lacked the capacity to independently verify spacecraft attachment status: they would need to consult the spacecraft integration team's current configuration records. The load (verify before you remove bolts) was displaced to a receiving context (fixture operations) that did not have the means to independently evaluate what it received.

**Falsification condition:** The reconstruction finds a formal verification requirement in the bolt-removal procedure that explicitly assigned spacecraft attachment verification to a specific party with the capacity to perform it, or that the fixture operations team had direct access to current spacecraft configuration records.

---

### SI — Structural Incongruence

**Prediction:** PRESENT  
**Confidence:** MODERATE  
**Sub-criterion:** SI-1 (Specification assumption mismatch)

**Structural mechanism predicted:** The bolt-removal work order was written for the rotation fixture in its standard configuration — without a spacecraft attached. The actual structural state of the fixture at the time of operations was different: the NOAA-N Prime satellite had recently been transferred to this fixture, placing it in a non-standard configuration. The work order's implicit structural assumption (fixture in standard configuration) was incongruent with the fixture's actual structural state (fixture holding a 1,550-pound spacecraft). This is an SI-1 condition: the operational specification (work order) assumed a structural state that had changed since the work order was written or that was not reflected in the work order's scope.

**Falsification condition:** The reconstruction finds that the work order explicitly accounted for the spacecraft attachment and included steps for verifying and managing the spacecraft-attached configuration.

---

### HCL — Hidden Common Link

**Prediction:** PRESENT  
**Confidence:** MODERATE

**Structural mechanism predicted:** The spacecraft integration domain and the fixture operations domain each held information about an unusual configuration state. The spacecraft integration team knew the satellite had recently been transferred to the rotation fixture — an unusual configuration event. The fixture operations team was proceeding with a standard rotation operation — assuming the standard fixture configuration. The shared structural source: a recent configuration change (spacecraft transfer to the fixture) that simultaneously created an anomalous condition in both domains without either domain recognizing the cross-domain significance. The spacecraft integration team knew about the transfer but may not have communicated the operational implications to fixture operations. The fixture operations team had no indication from the work order that the configuration was non-standard. The hidden common link is the undocumented configuration state change.

**Falsification condition:** Reconstruction finds that either the spacecraft integration team communicated the configuration change to fixture operations, or that the fixture operations work order reflected the non-standard configuration. Either would eliminate the HCL condition.

---

### CR — Contradiction Resolution

**Prediction:** UNCERTAIN — POSSIBLE  
**Confidence:** LOW

**Structural mechanism predicted:** If any technician or supervisor noted the unusual configuration (24 of 27 bolts removed, one bolt remaining) or raised a question about the configuration before proceeding, and that concern was dismissed or overridden without investigation, CR would be present. The partial bolt pattern (24 removed, 3 remaining) may constitute a structurally anomalous observation that was not investigated.

**Falsification condition:** Reconstruction finds no documented observation of an anomalous configuration before the spacecraft fell, or confirms the partial bolt pattern was the intended state.

---

### WSP — Weak Signal Preservation

**Prediction:** ABSENT  
**Confidence:** MODERATE

**Structural mechanism predicted:** This is primarily a configuration state failure at a specific moment, not a pattern accumulation failure. Unless prior configuration control violations or near-misses at this facility constituted a sub-threshold pattern, WSP is not the primary failure mode. General knowledge does not suggest a prior pattern of configuration control failures that were individually managed.

**Falsification condition:** Reconstruction finds a prior pattern of configuration control anomalies at the Sunnyvale facility that individually did not cross threshold for corrective action but that, aggregated, would have indicated structural vulnerability in the configuration control system.

---

### FA — Fragility Accumulation

**Prediction:** UNCERTAIN  
**Confidence:** LOW

**Structural mechanism predicted:** Multiple simultaneously degraded safety conditions are possible: recent spacecraft configuration change creating non-standard fixture state; work order not updated for current configuration; absence of cross-team verification requirement; absence of supervisor sign-off for non-standard operations. Whether these constitute simultaneously degraded independent safety margins (the FA condition) or a single compound CDA/LD failure is uncertain.

**Falsification condition:** Reconstruction finds either no multiple simultaneously degraded safety margins or a formal aggregate assessment that would have identified the cumulative vulnerability.

---

### Conventional Explanation Score Prediction

**Predicted CES:** HIGH (0.65–0.80)

The conventional account of the NOAA-N Prime incident is deeply anchored in individual human error: technicians should have known the spacecraft was attached; someone should have checked. This account is both widespread and superficially complete — it explains the outcome without reference to the structural conditions that made the error possible. The EE/CIS structural account (CDA, LD, SI, HCL) requires distinguishing between "a technician made an error" and "the procedural and information architecture created conditions in which an error of this type was possible without anomaly detection." This distinction is not part of the conventional account. The EES is expected to be high — meaning the EE/CIS account adds substantially to what the conventional account explains.

This case is selected in part because high CES provides the clearest test of the EE/CIS framework's marginal contribution.

---

## Batch 3 Prediction Summary

| Case | CR | WSP | SI | HCL | CDA | LD | FA | CES prediction |
|------|----|----|----|----|-----|----|----|---------------|
| T1-001 | PRESENT HIGH | PRESENT MOD | PRESENT MOD (SI-1) | UNCERTAIN | PRESENT MOD | PRESENT MOD | PRESENT LOW | LOW 0.20–0.35 |
| T2-004 | UNCERTAIN | UNCERTAIN | PRESENT MOD (SI-1) | ABSENT | UNCERTAIN | PRESENT HIGH | UNCERTAIN | MEDIUM 0.40–0.55 |
| T2-005 | UNCERTAIN | ABSENT | PRESENT MOD (SI-1) | PRESENT MOD | PRESENT HIGH | PRESENT HIGH | UNCERTAIN | HIGH 0.65–0.80 |

---

*Artifact A — Batch 3 Pre-Registered Predictions | FROZEN | 2026-06-02*  
*Information boundary compliant. No primary investigation documents accessed. Predictions generated from M-06 v1.5 registry data, Phase Boundary Definitions, general domain knowledge, and EE/CIS framework documents only.*
