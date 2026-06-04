# Track A — Artifact B
# Case Reconstruction: T1-003 — Ariane 5 Flight 501

**Artifact designation:** Artifact B — Case Reconstruction  
**Case ID:** T1-003  
**Status:** FROZEN  
**Session type:** Reconstruction Session — Artifact A blinded  
**Governing protocol:** Protocol v1 (A-02) + Clarification Addendum v1 (A-05) + Clarification Addendum v2 (A-20)  
**Session boundary:** This reconstruction was conducted without access to Artifact A predictions for any case in Batch 1.

---

## Mandatory Disclosure — GD-002 R-01 / A-03

**DISCLOSURE REQUIRED IN ALL TRACK A OUTPUTS**

This is a retrospective structured validation exercise. The AI system conducting this reconstruction (Claude, Anthropic) has been trained on data that includes the Ariane 5 Flight 501 Inquiry Board Report (Lions, 1996) and extensive secondary literature on this case in software engineering and aerospace safety domains. AI prior exposure for T1-003 is assessed as HIGH (M-06 v1.2). The reconstruction is conducted from the approved source as mediated through AI training data.

Kappa values from CAL-2026-001 are characterized as intra-system consistency metrics and may not be characterized as inter-rater reliability measures until human coder validation is complete (OI-001).

**Classification:** RETROSPECTIVE STRUCTURED VALIDATION — AI-ASSISTED, HUMAN VALIDATION PENDING

---

## Section B1 — Case Metadata

| Field | Value |
|-------|-------|
| Case ID | T1-003 |
| Case Name | Ariane 5 Flight 501 |
| Domain | Aerospace / Software Engineering |
| Tier | 1 |
| AI Prior Exposure | HIGH |
| Primary Source | Ariane 5 Flight 501 Failure: Report by the Inquiry Board. J.L. Lions, Chairman. July 19, 1996. European Space Agency. |
| Source Accessibility | CONFIRMED (M-06 v1.2) |
| Reconstruction Date | 2026-05-31 |
| Analyst Identity | EE/CIS Research Governance Team — AI-assisted |
| Governing Failure Conditions | Artifact 0 v1.0 |
| Artifact A Access | NONE — blinded per session boundary protocol |

---

## Section B2 — Phase Boundary Verification

Phase boundaries are adopted from M-06 v1.2 as the authoritative registry record.

### Pre-Decision Phase

**Start boundary:** Specification and acceptance of the SRI (Système de Référence Inertielle) incorporating reused Ariane 4 flight software without revalidation against the Ariane 5 flight trajectory — Ariane 5 development phase, approximately 1992–1994.

**Justification:** The decision to reuse the Ariane 4 IRS software without full revalidation for Ariane 5 flight profile parameters was made during the software specification and acceptance phase of Ariane 5 development. This decision is the structural origin of the failure chain: it is the point at which the operational assumption (Ariane 4 software is safe for Ariane 5) was established without the verification that would have exposed the trajectory-parameter incompatibility. All subsequent signals flow from this origin point.

**End boundary:** Final launch commit authorization for Ariane 5 Flight 501, June 4, 1996, approximately 09:33 UTC.

**Justification:** The launch commit authorization is the terminal Pre-Decision Phase event: it is the last organizational decision point at which the trajectory-software incompatibility could have been identified and the launch halted without vehicle loss. After this point, the flight sequence proceeded and the structural cause embedded in the development phase produced its consequences.

### Decision Phase

**Start:** Launch of Ariane 5 Flight 501, June 4, 1996, 09:33:59 UTC.

**End:** Vehicle destruction of Ariane 5 Flight 501, June 4, 1996, approximately T+37 seconds.

**Decision Phase scope note:** The Decision Phase for this case is exceptionally compressed: 37 seconds. The operative "decision" was the launch authorization, not any in-flight decision, because the failure chain was triggered automatically by the software overflow rather than by a human decision during flight. The Decision Phase is included for completeness per protocol, but the analytically significant decisions were all made in the Pre-Decision Phase.

### Boundary Ambiguity

**Ambiguity 1 — Pre-Decision Phase start date precision:** The development phase during which the SRI acceptance decision was made spans approximately 1992–1994. The specific date of the software reuse decision is not precisely determinable from the Inquiry Board Report. M-06 v1.2 defines the start as the development phase; this reconstruction adopts that definition and treats the 1992–1994 period as the relevant boundary context.

**Ambiguity 2 — What constitutes the operative "decision":** The Inquiry Board identifies two decision layers — the initial reuse authorization and the lack of trajectory-profile compatibility verification. This reconstruction treats both as Pre-Decision Phase elements because neither constitutes a flight operation decision; both are development-phase acceptance decisions.

---

## Section B3 — Evidence Timeline

| Date | Event | Actor(s) | Signal | Classification at Time |
|------|-------|---------|--------|----------------------|
| ~1992–1994 | Ariane 5 SRI specification phase. Decision made to reuse Ariane 4 SRI software (developed by Aerospatiale) for Ariane 5 without full revalidation against Ariane 5 flight trajectory parameters. Justification: software validated on Ariane 4; proven flight heritage. | ESA / CNES / Aerospatiale / Ariane 5 programme | Software reuse decision made | Accepted — software has proven heritage; revalidation not required per programme decision |
| ~1992–1994 | Software hazard analysis conducted on SRI code. Seven variables identified as potentially overflowable. Five variables protected with exception handlers. Two variables — BH (horizontal bias) and BV (vertical bias) — left unprotected. Justification for non-protection: operational analysis showed these variables would not overflow within Ariane 4 flight envelope. | Aerospatiale software team | Overflow protection decision for BH and BV | Accepted — operational analysis confirmed no overflow risk for Ariane 4 trajectory |
| ~1992–1994 | Ariane 5 trajectory engineering establishes flight profile. Ariane 5 trajectory includes significantly higher horizontal velocity early in flight (first 40 seconds post-launch) compared to Ariane 4 trajectory profile. | Ariane 5 trajectory engineering team | Ariane 5 trajectory specification — higher horizontal velocity than Ariane 4 | Nominal trajectory specification — no connection made to SRI software overflow analysis |
| ~1994–1996 | SRI software accepted for Ariane 5 integration on the basis of Ariane 4 validation record. The trajectory-profile-specific parameter check (whether Ariane 5 horizontal velocity would cause BH overflow) was not conducted as part of acceptance. | ESA / CNES programme management / software acceptance board | SRI software acceptance for Ariane 5 | ACCEPTED — Ariane 4 validation record treated as sufficient basis |
| Pre-launch | Ariane 5 Flight 501 preparation and pre-launch checks. Two SRI units configured: SRI-2 as active (primary), SRI-1 as backup. Both units running identical software. Pre-launch software verification confirmed software functioned correctly within the tested parameter range. | ESA / CNES launch team | Pre-launch software verification nominal | Nominal — all checks passed within verified parameter range |
| Jun 4, 1996 09:33:59 UTC | **Ariane 5 Flight 501 launches.** All systems nominal at launch. | ESA / CNES | Launch event | Nominal |
| Jun 4, 1996 ~T+30s | As the rocket climbs and accelerates, the SRI's horizontal bias parameter (BH) approaches and then exceeds the representable range of the 16-bit signed integer data type used in the Ariane 4 software. This is the first moment at which the trajectory-software incompatibility produces a computational consequence. | Ariane 5 (automated) | BH parameter value approaching/exceeding 16-bit signed integer maximum | [No classification possible — event unknown to any human observer at this point] |
| Jun 4, 1996 ~T+36.7s | **SRI-2 (active) operand overflow exception triggered.** The BH conversion from 64-bit float to 16-bit integer fails. Instead of shutting down cleanly, SRI-2 transmits diagnostic error data on the data bus. The On-Board Computer (OBC) receives this diagnostic data and interprets it as valid attitude/trajectory data indicating an extreme attitude deviation. | Ariane 5 (automated) / SRI-2 | SRI-2 failure — diagnostic data transmitted as flight data | [No classification possible at time — event not visible to human observers during flight] |
| Jun 4, 1996 ~T+36.7s | OBC switches to backup SRI-1. SRI-1 also fails with operand overflow — same software, same trajectory, same parameter exceedance. SRI-1 also transmits diagnostic error data. OBC now receiving diagnostic data from its sole remaining reference and commanding nozzle deflections to correct the erroneously indicated extreme attitude deviation. | Ariane 5 (automated) / SRI-1 / OBC | SRI-1 failure — both reference systems failed; OBC commanding on error data | [No classification possible at time] |
| Jun 4, 1996 ~T+37s | Nozzle deflection commands produce extreme aerodynamic loads. Boosters separate from the main rocket. Self-destruction commanded by range safety or triggered automatically. | Ariane 5 (automated) / Range Safety | Vehicle destruction | Mission failure — detected at this point |
| Jul 19, 1996 | Inquiry Board Report released. Root cause identified: operand overflow in BH conversion, caused by reuse of Ariane 4 software without revalidation against Ariane 5 trajectory profile. Key finding: the BH overflow protection was removed based on an analysis applicable to Ariane 4 but not reperformed for Ariane 5. | ESA / Lions Inquiry Board | Post-loss investigation finding | Root cause determination (post-event) |

---

## Section B4 — Signal Inventory

All signals are within the Pre-Decision Phase scope (approximately 1992–1994 through June 4, 1996 09:33 UTC) unless otherwise noted.

---

**S-001 — Ariane 5 horizontal velocity trajectory profile**

| Field | Value |
|-------|-------|
| Signal ID | S-001 |
| Description | The Ariane 5 flight profile specified horizontal velocity values in the first 40 seconds of flight that were significantly higher than the Ariane 4 trajectory profile in the same time segment. This difference was inherent in the Ariane 5 mission design — a larger, more powerful rocket with a different trajectory optimization. |
| Source | Ariane 5 Flight 501 Inquiry Board Report — trajectory analysis section |
| First Appearance | Ariane 5 trajectory specification phase, approximately 1992–1993 |
| Visibility Level | VISIBLE to trajectory engineering team — the trajectory specification was a known engineering document |
| Decision Relevance | CRITICAL — the trajectory profile difference was the physical cause of BH exceeding the 16-bit integer range |
| Notes | Whether this signal was communicated to the SRI software team during the reuse decision is the central visibility question for CDA coding. The trajectory specification existed in the trajectory engineering domain; its implications for the SRI software's parameter range were not assessed during reuse acceptance. |

---

**S-002 — Ariane 4 IRS software overflow protection analysis (BH unprotected)**

| Field | Value |
|-------|-------|
| Signal ID | S-002 |
| Description | During the Ariane 4 software safety analysis, a hazard analysis identified that the BH (horizontal bias) parameter could theoretically overflow a 16-bit integer representation. The analysis concluded this would not occur within the Ariane 4 flight envelope and therefore no overflow protection (exception handler) was required for BH. This analysis was conducted for Ariane 4 parameters and was not reperformed for Ariane 5 parameters during the reuse decision. |
| Source | Ariane 5 Flight 501 Inquiry Board Report — software analysis section |
| First Appearance | Ariane 4 software development period; conclusion carried into Ariane 5 reuse decision |
| Visibility Level | VISIBLE to software engineering and safety analysis teams — this analysis existed in the software documentation |
| Decision Relevance | DIRECT — the decision not to protect BH against overflow was the specific technical condition enabling the failure |
| Notes | The analysis was accurate for Ariane 4. Its application to Ariane 5 without revalidation against Ariane 5's trajectory parameters was the critical gap. The analysis constituted a prior-model assessment that was applied beyond its validated scope. |

---

**S-003 — Software reuse decision record**

| Field | Value |
|-------|-------|
| Signal ID | S-003 |
| Description | The formal decision to reuse the Ariane 4 IRS software for Ariane 5 without full trajectory-profile revalidation. The decision was recorded in programme documentation. The justification was the Ariane 4 validated operational record. |
| Source | Ariane 5 Flight 501 Inquiry Board Report — decision history section |
| First Appearance | Ariane 5 development phase, approximately 1992–1994 |
| Visibility Level | VISIBLE to programme management — the reuse decision was a formal programme decision |
| Decision Relevance | STRUCTURAL — this decision established the operational condition (unvalidated software for Ariane 5 trajectory) that enabled all subsequent failure chain elements |
| Notes | The Inquiry Board Report characterizes the reuse decision as the primary organizational precondition for the failure. The decision was not itself anomalous under the programme's prevailing software reuse standards; the gap was in the completeness of the revalidation scope. |

---

**S-004 — Backup SRI running identical software**

| Field | Value |
|-------|-------|
| Signal ID | S-004 |
| Description | The backup SRI (SRI-1) was configured to run the same software as the primary SRI (SRI-2). In the event of a primary SRI failure, the backup SRI would be activated. If the failure mode that affected the primary SRI was also present in the backup SRI — because both ran identical software — the backup provided no protection against that failure mode. |
| Source | Ariane 5 Flight 501 Inquiry Board Report — redundancy architecture section |
| First Appearance | Ariane 5 SRI configuration decision — development phase |
| Visibility Level | VISIBLE to system architects — the backup SRI software configuration was a known design choice |
| Decision Relevance | HIGH — the backup SRI with identical software was the system design choice that prevented the redundancy architecture from providing any protection against the specific failure |
| Notes | The Inquiry Board Report notes that the backup SRI configuration was specifically designed for hardware redundancy — protection against hardware failures — rather than software failure mode independence. A software fault common to both units would disable both simultaneously. |

---

**S-005 — OBC data bus handling: no validation of SRI output**

| Field | Value |
|-------|-------|
| Signal ID | S-005 |
| Description | The On-Board Computer (OBC) was designed to interpret data received on the SRI data bus as valid attitude/trajectory information without validating the format or plausibility of that data. When the SRI experienced an exception, it transmitted diagnostic error data (not flight data) on the same bus. The OBC had no mechanism to distinguish diagnostic error data from valid flight data; it treated the error output as extreme attitude deviation data and commanded compensating nozzle deflections. |
| Source | Ariane 5 Flight 501 Inquiry Board Report — failure chain analysis |
| First Appearance | OBC software design — development phase |
| Visibility Level | VISIBLE to system designers — the OBC's SRI data handling was a known design characteristic |
| Decision Relevance | HIGH — the OBC data handling was the amplification mechanism that translated the software exception into a vehicle-destroying nozzle deflection command |
| Notes | The Inquiry Board Report characterizes the OBC's handling of SRI error output as a coupling between the SRI failure mode and the flight control system's response. In the Ariane 4 operational context, this design had never been exposed to the specific failure mode it would encounter in Ariane 5 Flight 501. |

---

**S-006 — Pre-flight software verification within tested parameter range**

| Field | Value |
|-------|-------|
| Signal ID | S-006 |
| Description | Pre-flight software verification confirmed that the SRI software performed correctly within the parameter range tested. The tested parameter range was defined based on Ariane 4 flight experience and Ariane 5 pre-flight analysis. BH values exceeding the 16-bit integer range were not within the tested parameter scope. |
| Source | Ariane 5 Flight 501 Inquiry Board Report — pre-launch verification section |
| First Appearance | Pre-launch — Ariane 5 Flight 501 preparations |
| Visibility Level | VISIBLE to launch team — verification results were part of launch readiness record |
| Decision Relevance | STRUCTURAL — the pre-flight verification gave no indication of the overflow risk because the test parameter range did not include the values that would be encountered in flight |
| Notes | The verification "passed" because the tests were correctly defined relative to the assumptions of the reuse analysis. The tests confirmed the software was correct for Ariane 4 parameters; they did not test Ariane 5-specific parameter values because those values were not identified as a verification requirement. |

---

**S-007 — Trajectory-software interface specification absence**

| Field | Value |
|-------|-------|
| Signal ID | S-007 |
| Description | No formal cross-domain verification requirement existed mandating that the SRI software team assess the Ariane 5 trajectory profile parameters against the SRI software's representable value ranges before reuse acceptance. The trajectory specification (S-001) and the overflow protection analysis (S-002) existed in separate engineering domains without an interface requirement connecting them. |
| Source | Ariane 5 Flight 501 Inquiry Board Report — organizational and process analysis |
| First Appearance | Ariane 5 development phase — this is the absence of a process rather than a positive signal |
| Visibility Level | NOT VISIBLE as a positive signal — this is a structural absence; no one was positioned to observe the missing interface requirement |
| Decision Relevance | STRUCTURAL — the absence of a cross-domain interface requirement was the organizational condition enabling the trajectory-software incompatibility to persist undetected through the development and launch phases |
| Notes | This signal records an architectural absence rather than a positive event. Its inclusion in the inventory is justified because the Inquiry Board Report specifically identifies this organizational gap as a contributing cause. |

---

## Section B5 — AP Signal Coding

### WSP — Weak Signal Preservation

**Assessment: PRESENT — with sub-criteria uncertainty**

**Evidence:**

The Ariane 5 trajectory profile (S-001) produced horizontal velocity values in the first 40 seconds of flight that would cause the BH parameter to exceed its 16-bit integer representable range. This trajectory-parameter relationship was documentable from the trajectory specification and the software analysis (S-002) in combination. However, neither document, reviewed independently within its own domain, surfaced the incompatibility as a signal requiring action:

- S-001 (trajectory specification): Documented Ariane 5 horizontal velocities without noting implications for software parameter ranges. Visible in the trajectory engineering domain.
- S-002 (overflow protection analysis): Documented that BH would not overflow for Ariane 4 trajectories, without assessing Ariane 5 trajectory values. Visible in the software domain.
- S-007 (interface requirement absence): The absence of a requirement connecting S-001 and S-002 meant the combination of these two signals was never formally produced.

The WSP assessment depends on whether the combination of S-001 and S-002 constitutes a sub-threshold weak signal rather than an above-threshold concern that was actively suppressed. The reconstruction supports WSP coding because: each signal, reviewed within its own domain, was classified as acceptable; the combined implication (Ariane 5 trajectory would cause BH overflow in reused software) was not produced as a single assessable signal; and no aggregation mechanism connected the trajectory specification to the software overflow protection analysis.

**WSP sub-criteria assessment:**

WSP-1 (signal present in evidence environment): Present — S-001 and S-002 together encode the incompatibility.

WSP-2 (signal individually below threshold): Present — each signal, in its own domain, was within normal parameters. No single signal from either domain raised a formal concern.

WSP-3 (no aggregation mechanism): Present — S-007 documents the absence of an interface requirement that would have forced aggregation of S-001 and S-002 into a combined compatibility assessment.

**WSP coding: PRESENT**

**Uncertainty note:** The distinction between WSP (signals individually below threshold, no aggregation) and CDA (cross-domain signal not admitted) is relevant here. The incompatibility signal required cross-domain aggregation to become visible; its absence as an aggregated signal reflects both WSP (no aggregation mechanism) and CDA (no cross-domain admission) simultaneously. Both dimensions are coded as Present; the relative weight is documented for Artifact C.

---

### CDA — Cross-Domain Admission

**Assessment: PRESENT**

**Evidence:**

The signal that would have triggered revalidation of the SRI software was the Ariane 5 trajectory specification (S-001), which existed in the trajectory engineering domain. For this signal to produce a revalidation requirement, it needed to cross into the software engineering domain — specifically, to reach the overflow protection analysis (S-002) and the reuse decision (S-003) — as a signal that the Ariane 5 trajectory parameters would produce BH values outside the software's previously analyzed range.

This cross-domain admission did not occur:

**CDA-1 (signal from different domain than primary analytical domain):** Present — S-001 originated in the trajectory engineering domain. The software validation domain was the analytical domain where the reuse decision was made. The trajectory specification required domain crossing to become relevant to the software validation decision.

**CDA-2 (signal not admitted into the decision process):** Present — the Ariane 5 trajectory parameter values were not assessed against the SRI software's parameter representability range during the reuse acceptance decision. The software validation domain operated on the basis of the Ariane 4 analysis; the trajectory domain's Ariane 5 parameters were not admitted into this analysis.

**CDA-3 (organizational admissibility architecture failure):** Present — S-007 documents the absence of an interface requirement that would have mandated trajectory-software parameter compatibility verification. The organisational admissibility architecture for the reuse decision did not include a process requiring the trajectory engineering domain to certify software parameter compatibility before reuse authorization.

**CDA coding: PRESENT — all three sub-criteria satisfied**

**Evidence quality:** HIGH. The Inquiry Board Report explicitly identifies the failure to assess Ariane 5 trajectory parameters against the software's representability range as a primary finding. This constitutes a clear CDA failure: a signal from the trajectory domain that was required to cross into the software validation domain did not do so because no cross-domain interface requirement existed.

---

### CR — Contradiction Retention

**Assessment: PARTIAL / LOW CONFIDENCE**

**Evidence:**

A potential CR condition exists between:
- Signal A: The Ariane 4 validation record, which established that the SRI software was safe and that BH would not overflow (S-002, S-003).
- Signal B: The Ariane 5 trajectory specification, which documented horizontal velocities that differed significantly from Ariane 4 (S-001).

These two signals are in potential structural contradiction: if the BH overflow analysis was trajectory-dependent (which it was — it was derived for Ariane 4 trajectories), and if the Ariane 5 trajectory differed from Ariane 4 in the relevant dimension (which it did), then the Ariane 4 validation conclusion (BH is safe) could not be simply extended to Ariane 5 without reassessment.

However, for CR to be fully present, both signals must have been available to a common decision-making context in a form where the contradiction was potentially recognizable. The reconstruction evidence does not clearly establish that the Ariane 5 trajectory's horizontal velocity parameters and the BH overflow protection analysis were simultaneously present in the same organizational context in a form that would have made the contradiction visible.

The prior-model character of this case is relevant: the Ariane 4 validation status may have operated as a settled admissibility determination rather than as one signal among two that was in contradiction with another. If the validation status operated as a prior model (a pre-resolved question rather than an active signal), then the Ariane 5 trajectory parameters would have been filtered before reaching the decision context — a WSP/CDA failure rather than a CR failure.

**CR sub-criteria assessment:**

CR-1 (two signals in direct contradiction): Partially present — S-001 and S-002 encode a potential contradiction when combined, but the contradiction was not formed as a recognizable contradiction within any single organizational context during the development phase.

CR-2 (both signals present in evidence environment): Present — both S-001 and S-002 existed in the programme's documentation environment.

CR-3 (contradiction resolved by discarding one signal): Uncertain — the evidence does not establish that the contradiction was explicitly recognized and then resolved. The more supported characterization is that the contradiction was never formed as a recognizable signal.

**CR coding: PARTIAL / LOW CONFIDENCE**

**Coding note:** The predominant failure mode for T1-003 in the AP framework appears to be CDA (cross-domain admission failure) rather than CR (contradiction retention). The prior-model character of the reuse decision — where the Ariane 4 validation operated as a settled status rather than an active signal — is more consistent with WSP (individual signals below threshold) and CDA (cross-domain admission failure) than with CR (explicit contradiction retained and resolved in one direction).

---

## Section B6 — EE Structural Coding

### Load Displacement (LD)

**Assessment: PRESENT**

**Evidence:**

**LD-1 — Risk transferred without information:**

The reuse decision (S-003) transferred the software safety responsibility from a trajectory-specific validation exercise to the existing Ariane 4 validation record. In doing so, the risk of trajectory-profile incompatibility was embedded in the Ariane 4 validation assumptions without the information required for the Ariane 5 flight operations context to evaluate it. The flight operations team proceeded with the SRI software on the basis that it had been accepted — the acceptance process had resolved the safety question. The residual risk (the BH overflow vulnerability for Ariane 5 trajectories) was not part of the information transferred with the acceptance decision.

**LD-2 — Source appears stable after transfer:**

The Ariane 4 IRS software had an operationally proven validation record. Within the software engineering domain, the software was correctly validated for Ariane 4 trajectories. The source of the reuse decision — the software acceptance body — appeared stable: it had correctly validated the software for its original purpose. No anomaly was apparent in the software itself; it performed correctly within its validated parameter range.

**LD-3 — Destination holds risk without assessment:**

The Ariane 5 Flight 501 flight operations proceeded with the accepted SRI software. The flight operations context held the risk of the trajectory-software incompatibility without the information to assess it — the BH overflow vulnerability was embedded in the flight software's operational characteristics but was not documented as a risk in the flight operations record. Pre-flight verification (S-006) confirmed the software performed correctly within the tested range, reinforcing the impression that no risk was held.

**LD coding: PRESENT — all three sub-criteria satisfied**

---

### Fragility Accumulation (FA)

**Assessment: PRESENT**

**Evidence:**

The failure involved at least four independently managed system elements simultaneously operating below their Ariane 5-specific safety standards:

**FA element 1 — SRI software overflow protection for BH:** The BH parameter had no overflow protection because the analysis that justified non-protection (S-002) was conducted for Ariane 4 parameters. For Ariane 5, this protection margin was zero — the unprotected parameter would overflow at the values encountered in flight.

**FA element 2 — Backup SRI with identical software (S-004):** The system's redundancy architecture provided backup hardware but not software failure-mode independence. Both SRI units running identical software constituted a backup margin of zero against software-induced failures. For hardware failures, the backup provided genuine redundancy; for the specific software failure mode, it provided none.

**FA element 3 — OBC data handling without SRI output validation (S-005):** The OBC's design did not include validation of SRI output plausibility. For the operational conditions of Ariane 4 — where the SRI would not produce the specific failure mode encountered in Ariane 5 — this design was adequate. For Ariane 5 Flight 501, this design margin was zero against the failure mode produced by the SRI overflow.

**FA element 4 — Cross-domain verification requirement (S-007):** No interface requirement mandated trajectory-software parameter compatibility verification. The organizational process margin for this specific safety verification was zero.

**FA sub-criteria assessment:**

FA-1 (at least three independently managed margins simultaneously degraded below nominal for Ariane 5): Present — elements 1 through 4 represent four independently governed system properties, each below their nominal safety standard for the Ariane 5 context. Each was managed by a different engineering discipline: software safety analysis, redundancy architecture, OBC software design, and programme interface requirements.

**FA coding: PRESENT — four independently managed margins simultaneously below Ariane 5-specific safety standards, each managed by distinct organisational functions**

---

### Threshold Instability (TI)

**Assessment: PRESENT**

**Evidence:**

The critical threshold is the 16-bit signed integer maximum representable value (32,767) for the BH parameter. The Ariane 5 flight trajectory produced a horizontal velocity that, when converted to the BH parameter representation, exceeded this threshold within the first 40 seconds of flight.

**TI sub-criteria assessment:**

TI-1 (critical parameter operating within measurement uncertainty of design limit during the decision phase): Present — during the actual flight (Decision Phase), the BH parameter operated at or above the 16-bit integer limit. During the Pre-Decision Phase, the trajectory specification (S-001) documented the horizontal velocities that would be encountered, placing the expected BH values at or beyond the overflow threshold for the Ariane 5 trajectory — this was documentable from the trajectory specification, though the connection to the software threshold was not made.

**TI coding: PRESENT — the BH parameter crossed the representability threshold during flight, and the trajectory specification made this threshold exceedance documentable pre-flight for any analysis that connected trajectory parameters to software representability**

**Note:** TI in this case has a distinctive character: the threshold was not uncertain — it was a fixed 16-bit integer limit — but the assessment of whether the trajectory would exceed it was not performed. This is a TI-by-absence-of-assessment rather than TI-by-measurement-uncertainty.

---

### Cascade Precondition (CP)

**Assessment: PRESENT**

**Evidence:**

The failure chain contained two analytically distinct cascade couplings:

**CP coupling 1 — Dual SRI common-mode failure:**

The primary SRI (SRI-2) failed due to the BH operand overflow. The OBC switched to the backup SRI (SRI-1). SRI-1 ran identical software and was subjected to the identical flight trajectory, producing an identical operand overflow failure. Both SRIs failed simultaneously by the same mechanism. The coupling: the primary system failure did not trigger recovery; it triggered an identical failure in the backup, amplifying the loss of reference rather than compensating for it.

**CP coupling 2 — SRI error output and OBC command:**

When the SRI produced an operand overflow exception, its error response was to transmit diagnostic data on the data bus (S-005). The OBC was designed to interpret any data on this bus as valid attitude/trajectory information. The coupling: the SRI's failure mode (transmitting diagnostic data in the format of flight data) was coupled to the OBC's operational design (treating all SRI bus data as valid), amplifying a recoverable software exception into an unrecoverable flight control catastrophe.

**CP sub-criteria assessment:**

CP-1 (at least two coupled failure modes present): Present — dual-SRI common-mode coupling and SRI-OBC data handling coupling are both documented in the Inquiry Board Report.

CP-2 (coupling not reflected in the decision-phase risk analysis): Present — the Inquiry Board Report indicates that the common-mode software failure risk of the dual-SRI configuration was not reflected in the Ariane 5 flight software safety analysis, and that the OBC's handling of SRI diagnostic data was not specifically assessed against the failure mode produced by the trajectory-induced overflow.

**CP coding: PRESENT — two cascade couplings identified, neither reflected in the flight software risk model**

**Note:** A-20 (Clarification Addendum v2) governs CP coding in reconstruction. This CP assessment is documented per protocol. Any additional A-20 sub-criteria requirements for CP confirmation documentation should be applied during Artifact C review.

---

### Hidden Common Link (HCL)

**Assessment: PRESENT**

**Evidence:**

**HCL-1 (signals from structurally independent sources):**

S-001 (Ariane 5 trajectory specification — horizontal velocity parameters) originated in the trajectory engineering domain. S-002 (SRI software BH overflow protection decision — based on Ariane 4 trajectory analysis) originated in the software safety analysis domain. These are structurally independent engineering disciplines with distinct organisations, personnel, methods, and documentation streams.

**HCL-2 (non-connection documented during decision phase):**

The connection between the Ariane 5 trajectory horizontal velocity values and the SRI software's BH overflow protection analysis was not established during the Ariane 5 software acceptance process. S-007 documents the organizational absence of an interface requirement that would have mandated this connection. The Inquiry Board Report confirms that the trajectory-profile-specific overflow assessment was not conducted.

**HCL-3 (investigation confirmed shared structural cause):**

The Inquiry Board Report confirmed that the shared structural cause connecting the Ariane 5 trajectory profile (S-001) and the SRI software overflow (S-002) was the functional dependency of the BH parameter value on the horizontal velocity of the flight trajectory — a dependency that held for Ariane 4 within safe limits but exceeded those limits for Ariane 5.

**HCL-4 (connection non-obvious from within either domain):**

From within the trajectory engineering domain, horizontal velocity values were documented as a trajectory design parameter without implications for software representability being within the standard trajectory engineering analysis scope. From within the software safety analysis domain, the BH overflow analysis was conducted against the prevailing (Ariane 4) trajectory assumptions without the Ariane 5 trajectory specification being part of the software safety team's input set. The connection required simultaneous access to both domain's technical details at a level of integration not routinely produced in the programme's information flows.

**HCL coding: PRESENT — all four sub-criteria satisfied**

---

### Structural Incongruence (SI)

**Assessment: PRESENT**

**Evidence:**

The reuse decision (S-003) established a structural incongruence between:

**Operational assumption (software domain):** The Ariane 4 SRI software, as validated and accepted, is safe for use on Ariane 5. The software operates correctly and will produce valid outputs for the Ariane 5 flight.

**Operational reality (physical/trajectory domain):** The Ariane 5 flight profile produces horizontal velocity values in the first 40 seconds that exceed the representable range of the 16-bit integer data type used for the BH parameter in the Ariane 4 software.

This incongruence was structural: it arose from the physical difference between the Ariane 4 and Ariane 5 flight profiles, embedded in the engineering properties of both systems. It was not a contingent or removable misunderstanding; it was inherent in the combination of two valid but mutually incompatible facts about the two flight regimes. The incongruence was architecturally invisible because no organizational process required the two facts to be jointly assessed.

The SI was the condition that made all other failure elements consequential: it was not the LD, FA, CP, or HCL that independently caused the failure — it was the structural incongruence between what the software was designed for and what the flight would demand of it that made the other structural conditions into a failure chain.

**SI coding: PRESENT — structural incongruence between the operational assumption embedded in the reuse decision and the operational reality of the Ariane 5 flight profile**

---

## Section B7 — Visibility Analysis

### Which Signals Were Visible

**S-001 (Ariane 5 trajectory profile):** VISIBLE to trajectory engineering — documented in programme specifications. Visibility within trajectory engineering domain was full. Visibility across the domain boundary to software safety analysis was absent.

**S-002 (BH overflow protection analysis):** VISIBLE to software safety engineering — documented in software safety analysis records. Visibility within software domain was full. Visibility to trajectory engineering was present only insofar as the analysis conclusion (BH will not overflow for Ariane 4) was recorded, not the trajectory-specific reasoning.

**S-003 (software reuse decision):** VISIBLE to programme management — formal programme decision recorded. The decision outcome (software accepted for Ariane 5) was visible. The conditional nature of the safety analysis on which it was based was less prominently visible.

**S-004 (backup SRI identical software):** VISIBLE to system architects — the configuration was a known design choice. The failure-mode implication (no protection against common-mode software faults) was less explicitly documented.

**S-005 (OBC data handling without SRI validation):** VISIBLE to OBC software designers — the data handling design was explicit. The specific failure mode that this design would encounter with Ariane 5 SRI overflow was not assessed.

**S-006 (pre-flight verification nominal):** VISIBLE to launch team — verification results confirmed. This signal reinforced the impression that all software concerns had been addressed, as all tests passed within their defined scope.

### Which Signals Were Filtered

**The combined implication of S-001 and S-002:** FILTERED — the trajectory-software incompatibility (the joint implication of S-001 and S-002 read together) was never produced as a single assessable signal. The filtering mechanism was the organizational boundary between the trajectory engineering and software safety analysis domains, operationalized as the absence of a cross-domain interface requirement (S-007).

**The trajectory-specific BH parameter exceedance:** FILTERED — the fact that Ariane 5 horizontal velocity would produce BH values exceeding the 16-bit integer range was not produced as a signal in any domain. It was documentable from S-001 and S-002 in combination, but the combination was not made.

**The common-mode software failure risk (S-004):** PARTIALLY FILTERED — the backup SRI with identical software was a visible design choice, but the specific failure mode consequence (both SRIs fail simultaneously on the same trajectory-induced overflow) does not appear to have been assessed as a residual risk in the Ariane 5 flight software safety analysis.

### Filtering Mechanism

**Primary filtering mechanism — Prior-model admissibility gate:**

The Ariane 4 validation record operated as a resolved prior model: the question of SRI software safety had been answered by Ariane 4 validation, and this answer was carried into Ariane 5 without reopening the question. Signals from the Ariane 5 trajectory domain (S-001) that would have required reopening this question were filtered because the prior model (validated = safe) did not include a sensitivity to trajectory-profile differences as a re-opening condition.

**Secondary filtering mechanism — Cross-domain interface absence:**

The absence of an organizational interface requirement between the trajectory engineering domain and the software safety analysis domain (S-007) meant that trajectory-specific parameter values did not reach the software validation context as inputs. The filtering was architectural: the system for producing the combined implication of S-001 and S-002 did not exist.

### Organizational Location of Filtering

The filtering occurred at the interface between the trajectory engineering function and the software safety analysis function. More precisely, the filtering was embedded in the programme's software reuse acceptance process, which did not include a step requiring trajectory-software parameter compatibility verification. No individual organizational actor made a decision to filter the incompatibility signal; the filtering was a structural property of the acceptance process design.

---

## Section B8 — Alternative Explanation Inventory

*Supported by source materials. No ranking. No comparison to EE framework. Inventory only.*

**AE-001 — Operand overflow software error:**
The immediate technical cause. The SRI software contained an operand overflow condition for the BH parameter that was triggered by the Ariane 5 flight trajectory. Root cause (proximate): a software exception that was not handled gracefully.

**AE-002 — Software reuse without revalidation:**
The software reuse decision applied an Ariane 4 validated software component to an Ariane 5 context without revalidating the software against Ariane 5-specific trajectory parameters. Root cause: inadequate reuse qualification process.

**AE-003 — Incomplete overflow protection:**
The software hazard analysis identified overflow risk for seven variables but provided protection for only five. The two unprotected variables (BH and BV) were left unprotected based on an analysis that was accurate for Ariane 4 but not applicable to Ariane 5. Root cause: overflow protection decision based on trajectory-specific analysis not updated for the new trajectory.

**AE-004 — Redundancy architecture design:**
The dual-SRI redundancy architecture provided hardware redundancy but not software failure-mode independence. Both SRIs running identical software provided no protection against a common-mode software fault. Root cause: redundancy design that did not account for software failure-mode independence.

**AE-005 — OBC data handling design:**
The OBC treated all SRI bus data as valid flight data without format validation. When the SRI transmitted diagnostic error data, the OBC commanded flight control responses based on that error data. Root cause: OBC software design that did not include SRI output validation logic.

**AE-006 — Testing coverage gap:**
Pre-flight verification tested the software within parameter ranges derived from Ariane 4 experience. The Ariane 5-specific trajectory parameters that would trigger overflow were not in the test matrix. Root cause: test coverage that did not include Ariane 5 trajectory-specific parameter values.

**AE-007 — Process failure in safety analysis update:**
The software safety analysis was not updated to reflect the Ariane 5 trajectory profile when the reuse decision was made. Root cause: absence of a mandatory process step requiring safety analysis update at the point of reuse authorization.

---

## Section B9 — Reconstruction Findings

### Signal Environment

The Ariane 5 Flight 501 Pre-Decision Phase evidence environment contained two signals in separate organizational domains — the Ariane 5 trajectory specification (S-001) and the SRI software BH overflow protection analysis (S-002) — whose joint implication (the trajectory would cause BH overflow in the reused software) was documentable from the programme's own records but was never produced as an integrated signal within any single organizational context. The filtering mechanism was the combination of a prior-model admissibility gate (the Ariane 4 validation status as a settled safety question) and the absence of a cross-domain interface requirement (S-007) that would have mandated trajectory-software parameter compatibility verification.

The pre-flight verification (S-006) reinforced the filtered condition: verification confirmed the software performed correctly within the tested parameter range, which — because the test range was defined by Ariane 4 experience — did not include the overflow-producing values that Ariane 5 would encounter.

### Structural Environment

Five EE structures are coded as Present: Load Displacement, Fragility Accumulation, Threshold Instability, Cascade Precondition, and Hidden Common Link. Structural Incongruence is coded as Present. This is the highest structural density of any case in the batch: all five primary EE structures plus SI are simultaneously present.

The most analytically distinctive structural finding is the co-presence of LD and SI: the load was displaced (risk transferred via the reuse decision without trajectory-specific information) because a structural incongruence existed (the operational assumption of the reuse decision was incompatible with the operational reality of the Ariane 5 flight profile). LD and SI are mutually reinforcing in this case: the displacement was possible because the incongruence was architecturally invisible, and the incongruence was consequential because the displacement prevented independent assessment.

FA is confirmed at higher confidence here than in T1-002: four independently managed system elements (overflow protection, backup software, OBC data handling, cross-domain interface) are each below Ariane 5-specific safety standards simultaneously.

### Visibility Environment

The primary filtering mechanism — the prior-model admissibility gate — is the most distinctive visibility finding of this case. Unlike T1-002, where the filtering operated at a live operational interface (AMD-JPL data exchange), T1-003's primary filtering operated at the point of a historical decision (the reuse authorization), which closed the safety question before the Ariane 5 trajectory context was fully established. Once the reuse decision was made and the software was accepted, the prior-model status of the Ariane 4 validation created a resolved admissibility determination: the safety of the SRI software was a settled question that trajectory specifications were not positioned to reopen through normal programme information flows.

### AP Environment

WSP and CDA are both coded as Present. CDA is the more crisply evidenced of the two: the trajectory specification required cross-domain admission into the software validation process for the incompatibility to surface, and the organizational architecture did not include the process to admit it. WSP is also Present: the individual signals from each domain were below the threshold for a formal revalidation requirement within either domain. CR is coded as Partial/Low Confidence: the prior-model character of the case makes a pure CR account less well-supported than a WSP+CDA account.

---

## Section B10 — Reconstruction Freeze

### Session Boundary Confirmation

This reconstruction was conducted without access to Artifact A predictions for T1-003 or for any other case in Batch 1. No prediction document, prediction summary, comparison document, or Artifact C material was accessed during this session. The reconstruction findings in Sections B4 through B9 were produced independently of prediction content.

### Reconstruction Completion Record

| Field | Value |
|-------|-------|
| Reconstruction completion date | 2026-05-31 |
| Analyst identity | EE/CIS Research Governance Team — AI-assisted |
| Artifact A access during session | NONE — session boundary maintained |
| Primary source accessed | Ariane 5 Flight 501 Inquiry Board Report (as mediated through AI training data) |
| Session boundary compliance | CONFIRMED |

### Freeze Declaration

This document is frozen as of 2026-05-31. No finding may be revised in response to prediction content. The comparison between this reconstruction and Artifact A predictions is the exclusive function of Artifact C. This document constitutes the reconstruction record for T1-003 within Track A Batch 1.

**AP coding status at freeze:**
- WSP: PRESENT
- CDA: PRESENT
- CR: PARTIAL / LOW CONFIDENCE

**EE coding status at freeze:**
- Load Displacement: PRESENT
- Fragility Accumulation: PRESENT
- Threshold Instability: PRESENT
- Cascade Precondition: PRESENT
- Hidden Common Link: PRESENT
- Structural Incongruence: PRESENT

**FROZEN — 2026-05-31**

---

*Track A — Artifact B — T1-003 Ariane 5 Flight 501 Reconstruction | EE/CIS Research Governance Team | 2026-05-31*  
*FROZEN — REC-ART — RECONSTRUCTION ONLY — NO PREDICTION COMPARISON PERMITTED*
