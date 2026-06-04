# Track A — Artifact C
# Batch 1 Comparison Review

**Artifact designation:** Artifact C — Batch 1 Comparison  
**Status:** FROZEN  
**Session type:** Comparison Session — first simultaneous access to Artifact A and all Artifact B documents  
**Governing protocol:** Protocol v1 (A-02) + Clarification Addendum v1 (A-05) + Clarification Addendum v2 (A-20)  
**Governing failure conditions:** Artifact 0 v1.0  
**Cases:** T1-002 (Mars Climate Orbiter), T1-003 (Ariane 5 Flight 501), T1-004 (Space Shuttle Columbia)

---

## Mandatory Disclosure — GD-002 R-01 / A-03

**DISCLOSURE REQUIRED IN ALL TRACK A OUTPUTS**

This is a retrospective structured validation exercise. All three Batch 1 cases are Tier 1 with AI Prior Exposure assessed as HIGH. The confirmed findings in this Artifact C overlap substantially with well-documented conventional accounts of each case. The Conventional Explanation Score (CES) assessment in this document is the primary mechanism for evaluating whether confirmations carry framework-specific evidential weight beyond conventional domain knowledge.

Kappa values from CAL-2026-001 are intra-system consistency metrics and may not be characterized as inter-rater reliability measures until human coder validation is complete (OI-001). All findings in this document share this limitation.

**Classification:** RETROSPECTIVE STRUCTURED VALIDATION — AI-ASSISTED, HUMAN VALIDATION PENDING

---

## Comparison Methodology

**Comparison procedure:** Each Artifact A prediction is compared directly against the corresponding Artifact B finding for the same case, dimension, and sub-criteria. Classification uses three levels:

- **CORRECT:** The Artifact B finding confirms the Artifact A prediction at the level predicted. Sub-criteria match.
- **PARTIAL:** The Artifact B finding partially supports the prediction — structure found but in a different form, at lower sub-criteria density, or with less confidence than predicted.
- **INCORRECT:** The Artifact B finding contradicts the Artifact A prediction — structure coded Absent where Predicted Present, or Present where no prediction was made and the absence was implicitly predicted.

**FCR calculation (per Artifact 0 v1.0):**

FCR = Confirmed Predictions / (Total Valid Predictions − Evidence-Limited Predictions)

Partial confirmations are excluded from the numerator. No Evidence-Limited predictions were identified in this batch.

**CES assessment:** For each confirmed prediction, the Conventional Explanation Score assesses whether the prediction is distinguishable from what conventional domain knowledge about the case would produce without applying the EE/AP framework. CES values: HIGH (prediction is framework-specific, not easily generated from conventional accounts), MEDIUM (prediction has framework-specific elements but overlaps with conventional accounts), LOW (prediction is substantially replicated by the conventional account without framework application).

---

---

# Case T1-002: Mars Climate Orbiter

## C1 — EE Structure Comparison

### Hidden Common Link (HCL)

**Artifact A prediction:** HCL present (HIGH confidence). HCL-1 through HCL-4 all predicted.

**Artifact B finding:** HCL PRESENT. All four sub-criteria satisfied: HCL-1 (AMD unit convention and JPL navigation anomalies from independent organizational domains), HCL-2 (non-connection during operations — AMD not consulted during residual investigation), HCL-3 (MIB confirmed shared cause), HCL-4 (connection non-obvious from within either domain).

**Classification: CORRECT**

**CES assessment: MEDIUM.** The "unit conversion error" conventional account names the same cause but does not frame it as a hidden structural link between two independent systems sharing an invisible common cause. The HCL framing adds specificity: the cause was architecturally invisible from within either domain independently, not merely unchecked. This architectural-invisibility distinction has some framework-specific content. However, the unit discrepancy is so canonical that the HCL framing is readily derivable from the conventional account by any technically informed reader. CES = MEDIUM.

---

### Load Displacement (LD)

**Artifact A prediction:** LD present (MEDIUM-HIGH confidence). LD-1, LD-2, LD-3 all predicted.

**Artifact B finding:** LD PRESENT. All three sub-criteria: LD-1 (risk of unit discrepancy embedded in AMD-JPL interface without informational transfer), LD-2 (AMD system operationally stable, no anomaly detectable at source), LD-3 (JPL navigation held the risk for nine months without assessment capacity).

**Classification: CORRECT**

**CES assessment: MEDIUM.** The conventional account identifies the interface failure as a "software engineering error" or "specification violation." The LD framing — risk displaced across a domain boundary without the information required for the receiving domain to evaluate it — adds structural specificity not present in the conventional account. This framing has MEDIUM framework-specificity.

---

### Cascade Precondition (CP)

**Artifact A prediction:** CP present (MEDIUM confidence). Nine-month TCM compounding; investigation scope coupled to the boundary hiding the cause.

**Artifact B finding:** CP PRESENT. Two couplings: (1) unit-discrepant TCMs compounding trajectory error rather than correcting it; (2) investigation scope structurally inaccessible to the boundary concealing the root cause. Both couplings confirmed absent from the mission operations risk model.

**Classification: CORRECT**

**CES assessment: MEDIUM-HIGH.** The CP framing — specifically the coupling between the investigation scope limitation and the boundary that concealed the cause — is not present in the conventional account of MCO. The conventional account focuses on the unit error and the interface specification failure; it does not characterize the investigation's domain limitation as a cascade coupling. CES = MEDIUM-HIGH for the investigation-scope CP coupling; MEDIUM for the TCM-compounding coupling (the compounding is inferable from the conventional account).

---

### Threshold Instability (TI)

**Artifact A prediction:** TI present (LOW confidence). Periapsis estimate near safe orbital insertion corridor.

**Artifact B finding:** TI PRESENT. The navigation system was operating with unknown proximity to the catastrophic periapsis threshold — the actual periapsis (~57 km) was well below the design minimum (~226 km), but the navigation team's best estimate (~170 km) placed them near but not below the safe corridor boundary. The threshold was being approached without accurate knowledge of the actual proximity.

**Classification: CORRECT — prediction confirmed despite LOW confidence assignment**

**Underprediction note:** TI was assigned LOW confidence in Artifact A. The Artifact B finding confirms TI at the level described. This represents a case where the prediction was correct but the confidence was underestimated.

**CES assessment: LOW-MEDIUM.** The periapsis deviation from nominal is in the conventional account. The framework-specific contribution is the characterization of the deviation as operating within measurement uncertainty of the threshold — the navigation team could not determine whether they were within or outside the safe corridor. This uncertainty-at-threshold framing has some framework-specific content.

---

### Fragility Accumulation (FA)

**Artifact A prediction:** FA present (LOW-MEDIUM confidence). Interface verification, navigation redundancy, investigation scope as possible degraded margins.

**Artifact B finding:** FA PARTIAL. Evidence base insufficient for full FA sub-criteria confirmation at reconstruction resolution. The three elements proposed (interface verification margin, navigation redundancy, investigation scope) are present in the evidence environment, but FA requires three or more independently managed margins simultaneously below nominal — the Artifact B assessment could not confirm this at full sub-criteria level from the MIB Phase I Report.

**Classification: PARTIAL**

**Note:** The LOW-MEDIUM confidence prediction matched the PARTIAL finding. The prediction correctly assigned lower confidence to FA than to HCL and LD.

---

### Structural Incongruence (SI) — Not Predicted in Artifact A

**Artifact A prediction:** SI not explicitly predicted as a named structure.

**Artifact B finding:** SI PRESENT. The JPL metric-unit assumption (operational assumption of the receiving system) was structurally incongruent with the AMD English-unit reality (operational convention of the producing system), architecturally invisible at the interface boundary.

**Classification: UNEXPECTED FINDING — SI not in Artifact A's named prediction set**

**Note:** SI was assessed in Artifact B per the Artifact B protocol, which includes SI in the EE structure coding list. SI was not predicted in Artifact A because SI was not among the five primary structures defined in Artifact 0 v1.0. This creates an asymmetry: Artifact B found a structure that Artifact A did not predict, not because the prediction was wrong but because the prediction vocabulary did not include SI as a predictable structure. This is a **vocabulary gap finding**: the EE Framework's Track A prediction template (A-04) does not include SI in the predictable structure list, but SI was found present in all three cases.

---

### T1-002 EE Summary Table

| Structure | A Predicted | A Confidence | B Found | Classification |
|-----------|------------|-------------|---------|----------------|
| HCL | Yes | High | Present | **CORRECT** |
| LD | Yes | Medium-High | Present | **CORRECT** |
| CP | Yes | Medium | Present | **CORRECT** |
| TI | Yes | Low | Present | **CORRECT** (underpredicted) |
| FA | Yes | Low-Medium | Partial | **PARTIAL** |
| SI | No | — | Present | **UNEXPECTED** |

**T1-002 EE FCR contribution:** 4 confirmed + 0 partial (excluded from numerator) = **4/5 = 0.800**

---

## C2 — AP Signal Comparison

### WSP

**Artifact A:** WSP present (MEDIUM). Nine-month progressive sub-threshold navigation anomalies without aggregation.

**Artifact B:** WSP PRESENT. Individual post-TCM residuals below formal escalation threshold; cumulative pattern not formally aggregated before S-004 became dominant.

**Classification: CORRECT**

**CES: LOW-MEDIUM.** The navigation residual anomalies are in the conventional account; the WSP framing adds the aggregation-absence specification.

---

### CDA

**Artifact A:** CDA present (HIGH). AMD-JPL interface; unit convention as cross-domain signal.

**Artifact B:** CDA PRESENT. All three sub-criteria confirmed. CDA is the root cause finding of the MIB Phase I Report.

**Classification: CORRECT**

**CES: LOW.** The unit conversion error is one of the most cited examples of interface failure in aerospace engineering literature. The CDA framing precisely matches the conventional account and does not add significant structural specificity beyond naming it as a cross-domain admission failure rather than a software interface error.

---

### CR

**Artifact A:** CR present (LOW confidence). Possible contradiction between nominal trajectory assessment and anomalous periapsis estimate.

**Artifact B:** CR PARTIAL / UNCERTAIN. The periapsis estimate (~170 km) vs. MOI execution constitutes a potential CR candidate, but the MIB Phase I Report does not provide sufficient resolution on the Decision Phase decision-making record to confirm full CR sub-criteria.

**Classification: PARTIAL — prediction matched finding in direction and uncertainty level**

**Note:** Artifact A assigned LOW confidence to CR for T1-002; Artifact B coded CR as Partial/Uncertain. The prediction correctly characterized the CR as uncertain.

---

### T1-002 AP Summary

| Dimension | A Predicted | A Confidence | B Found | Classification |
|-----------|------------|-------------|---------|----------------|
| WSP | Yes | Medium | Present | **CORRECT** |
| CDA | Yes | High | Present | **CORRECT** |
| CR | Yes | Low | Partial/Uncertain | **PARTIAL** |

---

## C3 — Visibility Failure Comparison (T1-002)

**Artifact A predicted:** Organizational boundary without verification interface as primary filtering mechanism; WSP aggregation absence as secondary.

**Artifact B found:** Primary filtering mechanism: organizational boundary without cross-domain verification interface (AMD-JPL trust interface). Secondary: investigation scope limitation (navigation team's investigation did not cross to AMD domain). These match the predictions.

**Classification: CORRECT**

**CES: LOW-MEDIUM.** The interface specification failure is in the conventional account. The framing of the boundary as an "admissibility gate" rather than a specification error adds structural specificity.

---

## C4 — Alternative Explanation Comparison (T1-002)

**Artifact A predicted:** AE-001 (technical failure/software error), AE-002 (documentation failure/interface specification), AE-003 (verification oversight).

**Artifact B found:** AE-001 (unit conversion software error), AE-002 (interface specification failure), AE-003 (testing and verification gap), AE-004 (navigation investigation scope limitation), AE-005 (accumulated navigation error), AE-006 (management escalation failure).

**Prediction coverage:** All three predicted alternative explanations were found in the reconstruction. The reconstruction identified three additional alternatives (AE-004 through AE-006) not predicted. **Prediction coverage: 3/6 = 50% of reconstruction alternatives predicted.**

---

## C5 — Falsification Review (T1-002)

| Falsification Condition | A Prediction | B Finding | Status |
|------------------------|-------------|----------|--------|
| HCL falsified if no shared structural cause | HCL: shared cause exists | MIB confirmed AMD unit convention as shared cause | **SURVIVED** |
| LD falsified if risk actively communicated to JPL | LD: risk embedded, not communicated | No cross-domain unit verification occurred | **SURVIVED** |
| CDA falsified if discrepancy known and then disregarded | CDA: discrepancy unknown during ops | Unit discrepancy not identified during 9-month ops period | **SURVIVED** |
| WSP falsified if no individual sub-threshold signals | WSP: signals present | Post-TCM residuals documented across 9 months | **SURVIVED** |

**All T1-002 falsification conditions: SURVIVED**

---

---

# Case T1-003: Ariane 5 Flight 501

## C1 — EE Structure Comparison

### Load Displacement (LD)

**Artifact A prediction:** LD present (HIGH confidence). LD-1, LD-2, LD-3 all predicted. Software validation burden displaced via reuse decision without trajectory-specific information.

**Artifact B finding:** LD PRESENT. All three sub-criteria: LD-1 (trajectory incompatibility risk embedded in Ariane 4 validation without transfer of trajectory-specific assessment to Ariane 5 flight operations), LD-2 (Ariane 4 software had clean validation record — source appeared stable), LD-3 (Ariane 5 flight operations held the overflow risk without trajectory-specific assessment capacity).

**Classification: CORRECT**

**CES: MEDIUM-HIGH.** The conventional account identifies "software reuse without revalidation" as the cause. The LD framing adds structural specificity: the risk was not merely "not checked" — it was specifically displaced through the reuse acceptance mechanism such that the receiving context (flight operations) had no capacity to evaluate it independently. This displacement framing is not present in the conventional reuse-error account.

---

### Hidden Common Link (HCL)

**Artifact A prediction:** HCL present (HIGH confidence). Trajectory specification and BH overflow analysis as signals from independent domains sharing a common structural cause.

**Artifact B finding:** HCL PRESENT. All four sub-criteria: HCL-1 (trajectory engineering and software safety analysis as structurally independent domains), HCL-2 (connection between Ariane 5 trajectory and BH overflow not established during reuse decision), HCL-3 (Inquiry Board confirmed shared cause), HCL-4 (connection non-obvious from within either domain).

**Classification: CORRECT**

**CES: HIGH.** The conventional account frames the MCO case as a software reuse error or specification gap — it does not characterize the trajectory specification and the software vulnerability as two signals from independent domains sharing an invisible common cause. The HCL framing is distinctively structural and is not readily derivable from the conventional account. This is the highest CES finding in T1-003.

---

### Cascade Precondition (CP)

**Artifact A prediction:** CP present (MEDIUM-HIGH). Two CP couplings predicted: dual-SRI identical software, and the pre-flight verification test scope masking the Ariane 5 parameter exceedance.

**Artifact B finding:** CP PRESENT. Two distinct couplings confirmed: (1) dual-SRI common-mode failure (both SRIs fail simultaneously by identical mechanism), (2) SRI error output to OBC command amplification (SRI diagnostic data interpreted as extreme attitude data). The couplings found partially differ from those predicted: Artifact A predicted the verification scope as a CP coupling; Artifact B found the SRI-OBC data handling amplification as the second coupling.

**Classification: CORRECT — with substitution in the second coupling**

**Sub-finding:** One predicted CP coupling (pre-flight test scope masking) was not coded as a CP coupling in Artifact B — it was coded as a verification gap contributing to FA rather than as a coupled failure mode in the CP sense. The Artifact B second coupling (SRI-OBC amplification) was correctly predicted in spirit (amplification rather than absorption) but the specific mechanism differed. This does not affect the overall CORRECT classification but is noted for sub-criteria precision.

**CES: MEDIUM-HIGH.** The dual-SRI common-mode coupling is noted in the Inquiry Board Report. The SRI-OBC amplification coupling is present in the conventional account. The CP framing — that neither coupling was in the risk model — adds structural specificity not prominent in the conventional account.

---

### Threshold Instability (TI)

**Artifact A prediction:** TI present (MEDIUM confidence). BH parameter operating near or beyond the 16-bit integer representable limit.

**Artifact B finding:** TI PRESENT. The BH parameter exceeded the 16-bit signed integer maximum during flight. Pre-flight, the trajectory specification placed the expected BH values at or beyond the overflow threshold — documentable from trajectory data, though the connection to the software threshold was not made.

**Classification: CORRECT**

**CES: LOW-MEDIUM.** The operand overflow is the central technical finding of the Inquiry Board Report. The TI framing adds the "operating within measurement uncertainty of a design limit" characterization, but the limit itself (the 16-bit integer maximum) is precisely the technical cause described in the conventional account.

---

### Fragility Accumulation (FA)

**Artifact A prediction:** FA present (LOW confidence). Less characteristic of concentrated prior-model failures.

**Artifact B finding:** FA PRESENT — HIGH CONFIDENCE. Four independently managed margins simultaneously below Ariane 5-specific safety standards: (1) BH overflow protection absent, (2) backup SRI with identical software providing no protection against common-mode software failure, (3) OBC data handling without SRI output validation, (4) cross-domain interface requirement absent.

**Classification: CORRECT — but significantly underpredicted**

**Critical finding:** Artifact A assigned LOW confidence to FA for T1-003, predicting it was "less characteristic of concentrated prior-model failures." Artifact B found FA at HIGH confidence with four distinct elements, each managed by a separate organizational function. The underprediction reflects a framework logic error: the prediction reasoning assumed that prior-model SI failures would have concentrated rather than distributed structural failures. The reconstruction demonstrates that the prior-model reuse decision produced simultaneous degradation of multiple independently managed safety margins — making T1-003 one of the richest FA cases in the batch.

**Implication for framework logic:** The framework's prior-model failure category should not be assumed to produce lower FA than organizational-decision cases (T1-004). The prediction logic for FA in prior-model failures requires refinement.

**CES: MEDIUM.** The individual elements (unprotected overflow, identical backup software, OBC design) are each in the conventional account. The FA framing — characterizing them as simultaneously degraded independently managed margins — integrates them structurally in a way not present in the conventional account.

---

### Structural Incongruence (SI) — Not Predicted in Artifact A

**Artifact A prediction:** SI not predicted.

**Artifact B finding:** SI PRESENT. The operational assumption of the reuse decision (Ariane 4 software is safe for Ariane 5) was structurally incongruent with the operational reality (Ariane 5 trajectory produces BH values exceeding the software's representable range). This is the constitutive structural cause of the case.

**Classification: UNEXPECTED FINDING — second occurrence of unpredicted SI**

**Programmatic note:** SI is now found Present in two of two cases coded in this session. This reinforces the vocabulary gap finding: SI appears to be a consistent structural feature of the case type that the prediction template does not include.

---

### T1-003 EE Summary Table

| Structure | A Predicted | A Confidence | B Found | Classification |
|-----------|------------|-------------|---------|----------------|
| LD | Yes | High | Present | **CORRECT** |
| HCL | Yes | High | Present | **CORRECT** |
| CP | Yes | Medium-High | Present | **CORRECT** (substituted 2nd coupling) |
| TI | Yes | Medium | Present | **CORRECT** |
| FA | Yes | Low | Present (High) | **CORRECT** (significantly underpredicted) |
| SI | No | — | Present | **UNEXPECTED** |

**T1-003 EE FCR contribution:** 5 confirmed + 0 partial = **5/5 = 1.000**

---

## C2 — AP Signal Comparison (T1-003)

### WSP

**Artifact A:** WSP present (MEDIUM). Trajectory parameter signals below formal re-validation threshold within each domain; individual incompatibility signals without aggregation.

**Artifact B:** WSP PRESENT. S-001 (Ariane 5 trajectory) and S-002 (BH analysis for Ariane 4) each within their domain's normal parameters; the combined implication not produced as an aggregated signal.

**Classification: CORRECT**

**CES: MEDIUM.** The reuse decision without parameter check is the conventional account. WSP adds the aggregation-absence framing.

---

### CDA

**Artifact A:** CDA present (MEDIUM). Trajectory-software interface gap; Ariane 5 trajectory specification not crossing to software validation domain.

**Artifact B:** CDA PRESENT. S-007 (interface requirement absence) confirmed as the organizational admissibility architecture failure. S-001 did not cross into the software validation domain because no institutional process required it.

**Classification: CORRECT**

**CES: HIGH.** The conventional reuse-error account focuses on the software team's failure to validate. The CDA framing specifically identifies the interface between the trajectory domain and the software domain as the admissibility boundary — the trajectory specification was the signal that should have crossed, and the absence of a cross-domain requirement was the admissibility failure. This is more structurally specific than the conventional account.

---

### CR

**Artifact A:** CR present (LOW confidence). Prior-model may have prevented contradiction recognition.

**Artifact B:** CR PARTIAL / LOW CONFIDENCE. The potential contradiction between the Ariane 4 validation record and the Ariane 5 trajectory specification was never recognized as an explicit contradiction within any single organizational context. The prior-model character filtered the contradiction before it could be formed.

**Classification: PARTIAL — prediction correctly characterized CR as partial and low-confidence**

---

### T1-003 AP Summary

| Dimension | A Predicted | A Confidence | B Found | Classification |
|-----------|------------|-------------|---------|----------------|
| WSP | Yes | Medium | Present | **CORRECT** |
| CDA | Yes | Medium | Present | **CORRECT** |
| CR | Yes | Low | Partial/Low | **PARTIAL** (direction matched) |

---

## C3 — Visibility Failure Comparison (T1-003)

**Artifact A predicted:** Prior-model admissibility gate as primary mechanism; cross-domain interface absence as secondary.

**Artifact B found:** Primary: prior-model admissibility gate (Ariane 4 validation operating as resolved prior model). Secondary: cross-domain interface absence (S-007 — no organizational process requiring trajectory-software parameter compatibility verification). Both match precisely.

**Classification: CORRECT — strongest visibility prediction accuracy in the batch**

**CES: HIGH.** The prior-model admissibility gate framing is not present in the conventional account (which focuses on the reuse decision as a software engineering failure). The characterization of the validation status as a "resolved admissibility determination" that prospectively filtered trajectory-specific incompatibility signals is distinctively structural.

---

## C4 — Alternative Explanation Comparison (T1-003)

**Artifact A predicted:** AE-001 (software reuse error), AE-002 (specification gap), AE-003 (testing coverage gap).

**Artifact B found:** AE-001 through AE-007. Predicted alternatives (AE-001, AE-002, AE-003) were all found. Four additional alternatives identified: AE-004 (redundancy architecture), AE-005 (OBC data handling), AE-006 (testing coverage gap matched), AE-007 (safety analysis process failure).

**Prediction coverage: 3/7 = 43% of reconstruction alternatives predicted.**

---

## C5 — Falsification Review (T1-003)

| Falsification Condition | A Prediction | B Finding | Status |
|------------------------|-------------|----------|--------|
| LD falsified if Ariane 5 validation conducted | LD: validation burden displaced | No trajectory-specific parameter validation conducted | **SURVIVED** |
| HCL falsified if incompatibility identified during reuse | HCL: non-connection documented | Connection not established during reuse decision | **SURVIVED** |
| CP falsified if backup SRI had different software | CP: backup with identical software | Confirmed: both SRIs ran identical software | **SURVIVED** |
| WSP falsified if no parameter signals available | WSP: signals available but not aggregated | S-001 and S-002 both available but not jointly assessed | **SURVIVED** |

**All T1-003 falsification conditions: SURVIVED**

---

---

# Case T1-004: Space Shuttle Columbia (STS-107)

## C1 — EE Structure Comparison

### Fragility Accumulation (FA)

**Artifact A prediction:** FA present (HIGH confidence). Multi-mission foam debris normalization as the clearest FA test in the batch. Three independently managed margins simultaneously degraded.

**Artifact B finding:** FA PRESENT — HIGH CONFIDENCE. Four independently managed margins: (1) TPS foam debris organizational safety margin (eroded by normalization), (2) engineering voice margin (eroded by organizational culture), (3) assessment tool validation margin (Crater extrapolated beyond validated range), (4) institutional safety culture review margin.

**Classification: CORRECT**

**Note:** Artifact A predicted three margins; Artifact B found four. The fourth (institutional safety culture review margin) was not explicitly predicted but is consistent with the FA structure as predicted. The prediction was correct in both direction and confidence.

**CES: LOW.** The normalization of deviance is explicitly named and analyzed in the CAIB Report. FA for T1-004 is the highest-confidence conventional-account overlap in the batch. The FA framing repackages the CAIB's "normalization of deviance" analysis in EE vocabulary but does not add analytical content not present in the source document. CES = LOW.

---

### Load Displacement (LD)

**Artifact A prediction:** LD present (HIGH confidence). Technical risk transferred from engineering assessment to MMT without full informational content.

**Artifact B finding:** LD PRESENT. LD-1 (Crater extrapolation uncertainty and engineer imaging concerns not fully transferred with the DAT briefing), LD-2 (engineering team appeared to have resolved the assessment), LD-3 (MMT held residual risk without the information to evaluate it independently).

**Classification: CORRECT**

**CES: MEDIUM.** The "engineers were not listened to" account is widely known. The LD framing — specifically the mechanism by which the risk was displaced (the DAT briefing as a formal transfer process that did not carry the engineering uncertainty) — adds structural specificity not prominent in the conventional account.

---

### Cascade Precondition (CP)

**Artifact A prediction:** CP present (MEDIUM-HIGH). TPS damage coupled with absence of imaging; organizational decision cascade coupled to physical damage cascade.

**Artifact B finding:** CP PRESENT. Two couplings: (1) physical damage cascade (RCC breach → plasma ingestion → structural failure → vehicle loss), (2) decision-organizational cascade (normalization → DAT analysis → no imaging → no damage knowledge → no protective action).

**Classification: CORRECT**

**CES: MEDIUM.** The physical cascade is in the technical account. The framing of the organizational decision cascade as coupled to the physical cascade — and specifically the characterization of the decision not to pursue imaging as eliminating the feedback mechanism that could have interrupted the physical cascade — has some framework-specific content.

---

### Hidden Common Link (HCL)

**Artifact A prediction:** HCL present (MEDIUM confidence). Normalization history and STS-107 assessment sharing the common organizational risk assessment framework.

**Artifact B finding:** HCL PRESENT — MEDIUM CONFIDENCE. The multi-mission normalization history (S-001/S-002) and the STS-107 assessment (S-003/S-004/S-009) share the common cause: the individual-event assessment framework that classified each foam strike without cumulative accounting. CAIB confirmed this shared organizational cause.

**Classification: CORRECT — both prediction and finding at MEDIUM confidence**

**CES: LOW-MEDIUM.** The CAIB's normalization of deviance finding names the shared organizational cause. HCL adds the "hidden" framing — the cause was not visible within the STS-107 assessment context because it was embedded in the assessment framework itself — but this is substantially derivable from the CAIB's analysis.

---

### Threshold Instability (TI)

**Artifact A prediction:** TI present (MEDIUM confidence). TPS operating near the threshold at which foam strike damage would exceed survivable limits.

**Artifact B finding:** TI PRESENT. The actual TPS breach exceeded the catastrophic threshold; the measurement uncertainty was that the threshold exceedance was unknown during the Decision Phase (imaging not pursued). The system was operating with unknown proximity to the threshold — a distinctive form of TI where the uncertainty is about which side of the threshold the system is on, not about the threshold's location.

**Classification: CORRECT**

**CES: LOW.** The TPS damage threshold and its exceedance are in the technical account. The TI framing of "unknown proximity to threshold" adds precision but does not add analytical content not present in the conventional account.

---

### Structural Incongruence (SI) — Not Predicted in Artifact A

**Artifact A prediction:** SI not predicted.

**Artifact B finding:** SI PRESENT — HIGH CONFIDENCE. The operational assumption (foam strike is in-family anomaly within acceptable limits) was structurally incongruent with the operational reality (unprecedented breach of TPS threshold). Third consecutive unpredicted SI finding.

**Classification: UNEXPECTED FINDING — third occurrence**

---

### T1-004 EE Summary Table

| Structure | A Predicted | A Confidence | B Found | Classification |
|-----------|------------|-------------|---------|----------------|
| FA | Yes | High | Present (High) | **CORRECT** |
| LD | Yes | High | Present | **CORRECT** |
| CP | Yes | Medium-High | Present | **CORRECT** |
| HCL | Yes | Medium | Present (Medium) | **CORRECT** |
| TI | Yes | Medium | Present | **CORRECT** |
| SI | No | — | Present | **UNEXPECTED** |

**T1-004 EE FCR contribution:** 5 confirmed + 0 partial = **5/5 = 1.000**

---

## C2 — AP Signal Comparison (T1-004)

### WSP

**Artifact A:** WSP present (HIGH confidence). Multi-mission normalized foam strike records directly predicted.

**Artifact B:** WSP PRESENT — HIGH CONFIDENCE. S-001 documents 22 years of individually classified acceptable foam strikes without cumulative risk aggregation.

**Classification: CORRECT**

**CES: LOW.** The foam debris normalization is explicitly documented in the CAIB. WSP adds vocabulary but minimal analytical content.

---

### CR

**Artifact A:** CR present (HIGH confidence). Imaging request vs. MMT assessment contradiction directly predicted.

**Artifact B:** CR PRESENT — HIGH CONFIDENCE. Two explicit contradictions: CR-A (DAT assessment of manageable damage vs. engineering uncertainty that analysis was extrapolated and damage extent unknown); CR-B (MMT "no repair capability" rationale vs. existence of rescue and contingency options). Both contradictions documented in CAIB.

**Classification: CORRECT — strongest AP finding in the batch; prediction matched at highest confidence level**

**CES: LOW-MEDIUM.** The imaging request denial and the engineering concern are documented in the CAIB with specificity. CR-A adds the specific contradiction framing; CR-B (the rescue option contradiction) is less prominent in the conventional account and represents MEDIUM CES.

---

### CDA

**Artifact A:** CDA present (MEDIUM confidence). Engineering domain signals crossing to mission management domain; organizational admissibility architecture limiting the crossing.

**Artifact B:** CDA PRESENT — MEDIUM-HIGH CONFIDENCE. Imaging requests (S-005) and Crater extrapolation concern (S-006) as engineering domain signals that required cross-domain admission to the MMT decision domain; organizational culture (S-008) as the admissibility architecture that limited the crossing.

**Classification: CORRECT**

**CES: MEDIUM.** The conventional account names engineering communication failure as a cause. The CDA framing — characterizing the organizational culture as an admissibility architecture rather than a communication failure — adds structural specificity.

---

### T1-004 AP Summary

| Dimension | A Predicted | A Confidence | B Found | Classification |
|-----------|------------|-------------|---------|----------------|
| WSP | Yes | High | Present (High) | **CORRECT** |
| CR | Yes | High | Present (High) | **CORRECT** |
| CDA | Yes | Medium | Present (Medium-High) | **CORRECT** |

---

## C3 — Visibility Failure Comparison (T1-004)

**Artifact A predicted:** Normalization-through-precedent as primary (WSP mechanism); CR resolution mechanism as secondary.

**Artifact B found:** Primary: normalization-through-precedent. Secondary: organizational admissibility architecture (CDA/CR). Tertiary (not predicted): decision-rationale foreclosure (the "imaging won't change the outcome" logic).

**Classification: CORRECT for primary and secondary. One additional filtering mechanism (decision-rationale foreclosure) not predicted.**

**CES: MEDIUM.** The normalization mechanism is in the CAIB. The organizational admissibility architecture framing adds some structural specificity. The decision-rationale foreclosure (third mechanism) is a finding partially outside the standard prediction vocabulary.

---

## C4 — Alternative Explanation Comparison (T1-004)

**Artifact A predicted:** AE-001 (organizational culture), AE-002 (technical classification error), AE-003 (communication failure), AE-004 (resource constraint).

**Artifact B found:** AE-001 through AE-008. Predicted alternatives (AE-001, AE-003, AE-004, AE-007) were all found. Artifact B found eight total alternatives vs. four predicted.

**Prediction coverage: 4/8 = 50% of reconstruction alternatives predicted.**

---

## C5 — Falsification Review (T1-004)

| Falsification Condition | A Prediction | B Finding | Status |
|------------------------|-------------|----------|--------|
| FA falsified if fewer than 3 margins degraded | FA: multiple margins degraded | 4 independently managed margins confirmed | **SURVIVED** |
| LD falsified if MMT had full technical assessment | LD: technical risk partially transferred | Crater extrapolation uncertainty not fully transferred | **SURVIVED** |
| WSP falsified if no individual foam strike records | WSP: records across 87+ missions | 22-year normalization history confirmed | **SURVIVED** |
| CR falsified if no engineering uncertainty signal | CR: imaging request and uncertainty signal | Two explicit contradictions documented in CAIB | **SURVIVED** |

**All T1-004 falsification conditions: SURVIVED**

---

---

# Batch-Level Assessment

## C6 — Case Scorecards

### T1-002 Mars Climate Orbiter

| Dimension | Score |
|-----------|-------|
| EE Accuracy (5 structures) | 4 Correct + 1 Partial + 1 Unexpected = 4/5 predicted structures confirmed |
| AP Accuracy | 2 Correct + 1 Partial |
| Visibility Accuracy | Correct |
| Alternative Explanation Coverage | 3/6 = 50% |
| Falsification: all survived | All 4 survived |
| FCR contribution | 0.800 |
| Overall prediction quality | **GOOD — all predictions directionally correct; TI underpredicted; SI unexpected** |

---

### T1-003 Ariane 5 Flight 501

| Dimension | Score |
|-----------|-------|
| EE Accuracy | 5 Correct + 1 Unexpected = 5/5 predicted structures confirmed |
| AP Accuracy | 2 Correct + 1 Partial |
| Visibility Accuracy | Correct (highest accuracy in batch) |
| Alternative Explanation Coverage | 3/7 = 43% |
| Falsification: all survived | All 4 survived |
| FCR contribution | 1.000 |
| Overall prediction quality | **EXCELLENT predictions; FA significantly underpredicted in confidence; SI unexpected** |

---

### T1-004 Space Shuttle Columbia

| Dimension | Score |
|-----------|-------|
| EE Accuracy | 5 Correct + 1 Unexpected = 5/5 predicted structures confirmed |
| AP Accuracy | 3 Correct |
| Visibility Accuracy | Correct for primary and secondary; one additional mechanism found |
| Alternative Explanation Coverage | 4/8 = 50% |
| Falsification: all survived | All 4 survived |
| FCR contribution | 1.000 |
| Overall prediction quality | **EXCELLENT — strongest AP accuracy in batch (all three dimensions at high confidence)** |

---

## Batch-Level Summary

### 1. Total EE Prediction Accuracy

**Across 15 predicted EE structure instances (5 per case):**

| Result | Count | Percentage |
|--------|-------|-----------|
| CORRECT | 14 | 93.3% |
| PARTIAL | 1 (T1-002 FA) | 6.7% |
| INCORRECT | 0 | 0% |

**Batch FCR (EE) = 14 confirmed / 15 total = 0.933**

This FCR (0.933) substantially exceeds the EE Failure Condition threshold (FCR < 0.60). **No EE Failure Condition is triggered.**

**Unexpected EE findings:** SI was found Present in all three cases but was not predicted in Artifact A. Three additional SI findings exist outside the FCR calculation (not predicted, not counted as INCORRECT — they constitute vocabulary gap findings).

---

### 2. Total AP Prediction Accuracy

**Across 9 AP dimension predictions (3 per case):**

| Dimension | T1-002 | T1-003 | T1-004 | Overall |
|-----------|--------|--------|--------|---------|
| WSP | Correct | Correct | Correct | 3/3 = 100% |
| CDA | Correct | Correct | Correct | 3/3 = 100% |
| CR | Partial | Partial | Correct | 1 Correct + 2 Partial |

**WSP: 3/3 confirmed.** Full consistency across all case types.

**CDA: 3/3 confirmed.** Full consistency across all case types.

**CR: 1/3 confirmed at high confidence; 2/3 partial.** The CR prediction was confirmed at highest confidence for T1-004 (organizational decision case), where the CAIB provides direct documentation of two specific contradictions. CR was partial for T1-002 and T1-003, where the prior-model and unit-convention failure types did not produce explicitly documented contradiction resolution events at the same resolution.

**AP Failure Condition status:** No AP dimension mean kappa falls below 0.50 within this batch (per the CAL-2026-001 calibration results, WSP κ=0.857, CDA κ=0.696, CR κ=0.857). **No AP Failure Condition is triggered.**

---

### 3. Total Visibility Prediction Accuracy

| Case | Predicted Mechanism | Found Mechanism | Accuracy |
|------|--------------------|-----------------|---------| 
| T1-002 | Organizational boundary + WSP aggregation absence | Organizational boundary (AMD-JPL trust interface) + investigation scope limitation | **CORRECT** |
| T1-003 | Prior-model admissibility gate + cross-domain interface absence | Prior-model admissibility gate + cross-domain interface absence | **CORRECT** — highest accuracy in batch |
| T1-004 | Normalization-through-precedent + CR resolution mechanism | Normalization + CDA/CR organizational architecture + decision-rationale foreclosure (third mechanism unpredicted) | **CORRECT** (primary and secondary) + unpredicted third mechanism |

**Visibility accuracy: 3/3 primary mechanisms correctly predicted. One additional mechanism (T1-004 decision-rationale foreclosure) not predicted.**

---

### 4. Major Misses

**Miss M-01 — FA underpredicted for T1-003 (LOW → HIGH confidence):**

Artifact A predicted FA at LOW confidence for T1-003, reasoning that prior-model failures were "less characteristic of concentrated rather than distributed structural failures." Artifact B found FA at HIGH confidence with four distinct elements. This represents a framework logic error in the prediction for prior-model failure cases: the prediction framework incorrectly assumed that SI-type failures would produce concentrated rather than distributed structural conditions. FA was present in all three cases (confirmed, partial, and confirmed with four elements). The framework's prediction logic for FA should not distinguish between organizational-decision cases and prior-model cases.

**Miss M-02 — SI not predicted (vocabulary gap):**

SI was found Present in all three cases but was not among the structures that Artifact A was designed to predict. This is a systematic vocabulary gap: the Track A prediction template (A-04) does not include SI as a predictable structure, but the reconstruction protocol (Artifact B) includes SI in the EE coding list. The asymmetry means that SI findings cannot contribute to the FCR calculation and cannot be assessed for prediction accuracy — they are structural findings outside the prediction vocabulary.

**Miss M-03 — CR underpredicted for T1-002 (uncertain) and T1-003 (low confidence):**

CR was predicted at LOW confidence for T1-002 and T1-003. Both reconstructions found CR partial/low confidence — directionally consistent but not confirmed. CR was correctly predicted at HIGH confidence for T1-004, where it was the clearest AP finding. The pattern suggests CR is most reliably predicted and found in organizational decision-making cases (T1-004) and is less well-suited as a prediction dimension for technical interface cases (T1-002) and prior-model cases (T1-003).

---

### 5. Major Successes

**Success S-01 — All 15 EE predictions directionally correct:**

No prediction was coded INCORRECT. Every EE structure prediction that was made was confirmed in the reconstruction at some level. This is a strong positive result for the framework's structural vocabulary — the structures it identifies are present in the evidence environments it was applied to.

**Success S-02 — WSP and CDA confirmed unanimously:**

WSP was confirmed Present in all three cases, across organizational, software engineering, and prior-model failure types. CDA was confirmed Present in all three cases, across the same type diversity. This cross-case consistency for WSP and CDA provides the strongest AP evidence in the batch.

**Success S-03 — CR confirmed at highest confidence for T1-004:**

For the organizational decision-making case (T1-004), CR was predicted at HIGH confidence and found at HIGH confidence with two documented contradictions. This represents the highest precision AP prediction in the batch — the prediction was specific about the contradiction structure (imaging request vs. MMT assessment) and the reconstruction confirmed this specific contradiction with primary source documentation.

**Success S-04 — Visibility mechanism predictions correct across all three cases:**

The primary visibility filtering mechanisms were correctly predicted for all three cases: the organizational boundary without verification interface (T1-002), the prior-model admissibility gate (T1-003), and the normalization-through-precedent mechanism (T1-004). The framework's visibility prediction vocabulary — admissibility gates, CDA boundaries, WSP aggregation absence — correctly identified the structural location of signal filtering in all three cases.

**Success S-05 — All 12 falsification conditions survived:**

No prediction was falsified. Every falsification condition specified in Artifact A was tested against the reconstruction findings and survived. This means the predictions were not disconfirmed by evidence.

---

### 6. Unexpected Findings

**UF-01 — SI consistently present (all three cases):**

Structural Incongruence was found Present in all three reconstructed cases. This is a consistent structural finding outside the prediction vocabulary. It suggests SI may be a characteristic structural feature of the failure type (cases where a prior assumption or operational framework is applied in a context for which it was not designed), appearing in CDA failures (T1-002: metric assumption applied to English-unit source), prior-model failures (T1-003: Ariane 4 assumption applied to Ariane 5 context), and organizational normalization failures (T1-004: "in-family" assumption applied to unprecedented strike).

**UF-02 — Decision-rationale foreclosure as a third filtering mechanism (T1-004):**

The MMT's rationale that "imaging would not change the outcome" constituted a distinct filtering mechanism not predicted in Artifact A's visibility failure categories. This mechanism operates by logical foreclosure rather than organizational architecture — it preemptively resolves the uncertainty before deliberation. This finding suggests a gap in the framework's visibility failure taxonomy.

**UF-03 — Cross-case LD consistency:**

Load Displacement was found Present in all three cases, across different failure types. This was predicted for T1-002 and T1-003 at high confidence but was also confirmed in T1-004. LD appears to be a near-universal structural feature of the cases in this batch, which raises a question for cross-case analysis: is LD specifically predictive, or is it a very broadly applicable structure that will confirm in almost any engineering failure case?

---

## Framework Assessment

### EE Framework

**Assessment: MODERATE SUPPORT**

**Evidence for support:** FCR = 0.933, substantially above the 0.60 failure threshold. All 14 confirmed predictions were correct — no predicted structure was found absent. The framework's structural vocabulary (LD, HCL, CP, FA, TI) successfully identified present structures across three case types (technical interface failure, prior-model failure, organizational decision failure). The visibility prediction accuracy (3/3 primary mechanisms correct) is particularly strong.

**Evidence against strong support:** All three cases are Tier 1 with HIGH AI prior exposure. The CES assessment across the batch is predominantly LOW to MEDIUM — most confirmed predictions substantially overlap with the conventional domain knowledge accounts of these cases. The FA finding for T1-003 was significantly underpredicted (LOW → HIGH), indicating a framework logic gap. SI was found in all three cases but was not in the prediction vocabulary — the framework's structural coverage is incomplete. The alternative explanation coverage was 43-50% per case, suggesting the framework's prediction vocabulary covers only a portion of the structural landscape.

**Critical qualification:** The HIGH CES finding (HCL for T1-003 visibility prediction) is isolated. For most confirmations, the CES is LOW or MEDIUM, meaning the predictions are substantially reproducible from conventional domain knowledge without applying the EE framework. For Tier 1 cases, this is expected — the program design acknowledges this limitation. The framework's evidential contribution for Tier 1 cases is limited until Tier 2 and Tier 3 cases are completed.

**Conclusion:** The EE Framework's structural vocabulary correctly predicted present structures across three case types. The vocabulary is reliable in the positive direction (it does not generate false positives — no INCORRECT findings). The framework requires Tier 2/3 testing to establish whether its predictions go beyond conventional accounts.

---

### AP Framework

**Assessment: MODERATE SUPPORT**

**Evidence for support:** WSP and CDA confirmed unanimously across all three cases (6/6). CR confirmed at high confidence for T1-004. The AP dimensions correctly distinguished the primary failure modes of each case: CDA as primary for T1-002, WSP+CDA as primary for T1-003, and WSP+CR as primary for T1-004.

**Evidence against strong support:** CR was partial for T1-002 and T1-003 — the AP framework's third dimension is less reliable than WSP and CDA for technical interface and prior-model failure cases. The CES for WSP and CDA across all cases is LOW to MEDIUM, indicating substantial overlap with conventional accounts. The AP coding system's intra-system reliability (CAL-2026-001 kappas) was confirmed by calibration, but inter-rater reliability with human coders has not yet been established (OI-001).

**Conclusion:** The AP framework's three dimensions (WSP, CDA, CR) correctly identified the primary failure mode dimension for each case. WSP and CDA are the most reliable predictors. CR is more reliable for organizational decision cases than for technical interface or prior-model cases. The framework requires human coder validation and Tier 2/3 testing for stronger evidential claims.

---

## Batch-Level Governance Determinations

### FCR Status

**Batch 1 FCR (EE structures) = 0.933**

Failure condition threshold (from Artifact 0 v1.0): FCR < 0.60

**Status: EE Failure Condition NOT triggered.** The batch FCR substantially exceeds the failure threshold.

### AP Failure Condition Status

**AP Failure Condition requires mean kappa < 0.50 across any dimension.**

CAL-2026-001 kappas: WSP=0.857, CDA=0.696, CR=0.857. All above 0.50.

**Status: AP Failure Condition NOT triggered.**

### Program Termination Status

Termination requires both EE Failure Condition AND AP Failure Condition (full) simultaneously. Neither condition is triggered.

**Status: Track A CONTINUES. Batch 1 findings are complete. Batch 2 planning may proceed.**

---

## Vocabulary Gap Finding — SI

Structural Incongruence (SI) was found Present in all three Batch 1 cases. It was not predicted in Artifact A because SI is not among the five structures defined as predictable in Artifact 0 v1.0. This creates a governance question:

**Option A:** SI should be added to the Artifact 0 predictable structure list for future batches, enabling it to contribute to the FCR. This would require a MAJOR revision to Artifact 0 v1.0 — which cannot occur mid-program under the frozen-artifact governance rules.

**Option B:** SI remains outside the FCR calculation for Batch 1. Future Artifact A documents for Batch 2 should include SI as a predicted structure from the Artifact 0 structure list — but this would require the Artifact 0 v1.0 structure list to be updated.

**Option C:** SI is documented as a consistent additional structural finding but is treated as a supplementary observation rather than a framework prediction for all batches. Its presence does not affect FCR but is recorded in cross-case analysis.

**Governance recommendation:** Option C is the appropriate response within the current governance framework. Adding SI to the predictable structure list mid-program would constitute a post-hoc vocabulary expansion triggered by positive findings — which is precisely the form of result-accommodation that Artifact 0's freeze conditions were designed to prevent. SI is recorded as a consistent supplementary finding. Its systematic presence across cases is itself a finding: SI appears to be a near-universal structural feature of this case type that the current framework vocabulary does not capture.

---

## Cross-Case Structural Patterns

The following structural patterns emerged consistently across all three Batch 1 cases:

| Structure | T1-002 | T1-003 | T1-004 | Pattern |
|-----------|--------|--------|--------|---------|
| LD | Present | Present | Present | **Universal across batch** |
| HCL | Present | Present | Present | **Universal across batch** |
| SI | Present | Present | Present | **Universal (not predicted)** |
| CP | Present | Present | Present | Universal across batch |
| TI | Present | Present | Present | Universal across batch |
| FA | Partial | Present | Present | 2.5/3 |

**Universal structures across Batch 1:** LD, HCL, SI, CP, TI are all confirmed in all three cases.

This degree of structural consistency across three different failure types (technical interface, prior-model, organizational) provides the strongest evidence for the EE framework's cross-case structural claims. However, the CES assessment tempers this finding: these structures are confirmed, but many confirmations overlap with conventional accounts. The question for Tier 2 and Tier 3 cases is whether the structures remain present when the conventional account is less available to the prediction session.

The batch-level prediction B-01 (LD present in at least 2 of 3 cases) is confirmed: LD is present in all 3.

The batch-level prediction B-02 (at least one AP signal per case with CES > 0.50) is partially confirmed: HCL for T1-003 carries HIGH CES; CP investigation-scope coupling for T1-002 carries MEDIUM-HIGH CES. At least one framework-specific finding per case can be identified.

---

## Artifact C Freeze Declaration

This document is frozen as of 2026-05-31. No finding may be revised. Artifacts A and B remain frozen and unchanged. This document constitutes the comparison record for Batch 1 of the Track A program.

**Batch 1 is complete.**

**FROZEN — 2026-05-31**

---

*Track A — Artifact C — Batch 1 Comparison Review | EE/CIS Research Governance Team | 2026-05-31*  
*FROZEN — CMP-ART — COMPARISON SESSION COMPLETE*
