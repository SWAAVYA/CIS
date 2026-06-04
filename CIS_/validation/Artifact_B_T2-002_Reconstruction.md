# Track A — Artifact B
# Case Reconstruction: T2-002 — Mars Polar Lander

**Artifact designation:** Artifact B — Case Reconstruction  
**Case ID:** T2-002  
**Status:** FROZEN  
**Session type:** Reconstruction Session — Artifact A Batch 2 blinded; T1-005 reconstruction blinded  
**Governing protocol:** Protocol v1 (A-02) + Clarification Addendum v1 (A-05) + Clarification Addendum v2 (A-20)  
**Session boundary:** This reconstruction was conducted without access to Artifact A Batch 2 predictions or any other Batch 2 reconstruction document.

---

## Mandatory Disclosure — GD-002 R-01 / A-03

**DISCLOSURE REQUIRED IN ALL TRACK A OUTPUTS**

This is a retrospective structured validation exercise. The AI system conducting this reconstruction (Claude, Anthropic) has been trained on data that includes the Mars Polar Lander/Deep Space 2 Loss: Report of the Review Board (Spear and Casani, March 22, 2000) and secondary literature on the MPL failure in spacecraft software safety and spacecraft development methodology domains. AI prior exposure for T2-002 is assessed as MEDIUM-LOW (M-06 v1.4). The failure mode (false touchdown signal from leg deployment) is documented in the Review Board Report; the specific pre-launch engineering decision environment is less publicly saturated than Tier 1 cases.

**Critical pre-reconstruction note (B2R-01):** The M-06 v1.3 Phase Boundary start anchor described the signal environment as beginning with "identification of landing leg sensor transient signal issue during development testing." The Batch 2 Readiness Verification Report (B2R-01) revised this characterization: the false touchdown failure mode was established by the Review Board through post-loss investigation testing, not by pre-launch development testing. The Pre-Decision Phase signal environment is therefore a software specification and testing coverage gap environment. This reconstruction proceeds from that corrected characterization.

Kappa values from CAL-2026-001 are intra-system consistency metrics pending human coder validation (OI-001).

**Classification:** RETROSPECTIVE STRUCTURED VALIDATION — AI-ASSISTED, HUMAN VALIDATION PENDING

---

## Section B1 — Case Metadata

| Field | Value |
|-------|-------|
| Case ID | T2-002 |
| Case Name | Mars Polar Lander (MPL) |
| Domain | Aerospace / Software Engineering / Entry, Descent, and Landing |
| Tier | 2 |
| AI Prior Exposure Assessment | MEDIUM-LOW |
| Primary Source | Mars Polar Lander/Deep Space 2 Loss: Report of the Review Board. Anthony Spear and John Casani, Co-Chairs. March 22, 2000. Jet Propulsion Laboratory, California Institute of Technology / NASA. |
| Source Accessibility | CONFIRMED (M-06 v1.4) |
| Reconstruction Date | 2026-05-31 |
| Analyst Identity | EE/CIS Research Governance Team — AI-assisted |
| Governing Failure Conditions | Artifact 0 v1.0 |
| Artifact A Batch 2 Access | NONE — blinded per session boundary protocol |
| T1-005 Reconstruction Access | NONE — blinded per session boundary protocol |

**Programmatic context:** MPL was part of the Mars Surveyor '98 program, which operated under NASA's "faster, better, cheaper" (FBC) mission design philosophy of the late 1990s. The FBC approach compressed development schedules and budgets relative to earlier flagship missions. MPL and the Mars Climate Orbiter (T1-002, Batch 1) were developed simultaneously under this constraint framework. Both were lost in 1999.

---

## Section B2 — Phase Boundary Verification

Phase boundaries adopted from M-06 v1.4 (incorporating B2R-01 correction).

### Pre-Decision Phase

**Start boundary:** Approximately 1997–1998 — Landing software touchdown detection logic specification and landing system test program design, during MPL development. The Pre-Decision Phase begins when the engineering decisions governing what the landing system would verify and what signals would trigger engine cutoff were made. Specific documents and dates require confirmation against the Review Board Report primary text (noted as pending in M-06 v1.4; this reconstruction uses the AI-knowledge-level characterization and flags specific references as requiring primary source confirmation).

**End boundary:** January 3, 1999 — Launch of Mars Polar Lander. The Pre-Decision Phase ends at launch because after launch no modification to the flight software or landing system design was possible. All relevant specification and verification decisions were made before this boundary.

**Boundary ambiguity note:** The Pre-Decision Phase covers an approximately 1–2 year development window. The specific date when the touchdown detection logic was specified, the date when the test program design was finalized, and the date when the fault tree analysis was completed are all within this window and require primary source confirmation. This reconstruction treats all development-phase decisions from 1997 through January 3, 1999 as within the Pre-Decision Phase.

### Decision Phase

**Start and end:** December 3, 1999 — Entry, descent, and landing sequence.

**Decision Phase character (automated):** Per the B2R-04 methodology note in the Batch 2 Readiness Verification Report, the T2-002 Decision Phase is an automated execution sequence with no human decision-making possible during the terminal event. The engine cutoff was executed by the flight software autonomously in response to the sensor signal; no human decision point existed between the false signal and the engine cutoff. The AP coding in this document applies to the Pre-Decision Phase specification and testing decisions, not to the automated execution.

---

## Section B3 — Evidence Timeline

| Date | Event | Actor(s) | Signal | Classification at Time |
|------|-------|---------|--------|----------------------|
| ~1997–1998 | MPL development phase: Landing system design. The EDL system design specifies that the spacecraft will deploy its three landing legs during descent from altitude, above the Martian surface. The legs are stowed for cruise and are deployed by spring-loaded mechanisms during the terminal descent sequence. | JPL / MPL development team | Landing leg deployment mechanism design specification | Nominal design element |
| ~1997–1998 | **Touchdown detection logic specified.** The flight software is specified to detect touchdown using sensors on the landing leg deployment mechanism — contact sensors that change state when the legs contact a surface. The software is designed to command engine cutoff when these sensors indicate touchdown, preventing engine plume impingement on the surface after landing. | JPL software engineers / MPL development team | Touchdown detection logic specification — engine cutoff on leg sensor signal | Design decision — accepted as the mechanism for touchdown detection |
| ~1997–1998 | **Test program designed.** The landing system verification test program is planned and its scope is defined. Tests are designed to verify the landing system's function under expected conditions: touchdown detection at surface contact, leg structural integrity, descent engine performance. The test program scope for the specific scenario of in-flight leg deployment false-signal generation is the key gap question. | JPL / MPL test team | Landing system test program design | Test program scoped within development resource and schedule constraints |
| ~1997–1998 | **Fault tree / failure mode analysis.** A safety and reliability analysis of the landing system is conducted as part of the MPL development process. The specific failure mode of "false touchdown signal generated by leg deployment mechanism during descent" either was or was not included in this analysis. The Review Board's findings indicate this specific failure mode was not in the formal fault tree analysis. | JPL / MPL safety team | Fault tree analysis — scope of failure mode coverage | Analysis completed within development constraints |
| ~1997–1998 | **Interface between mechanical and software subsystems.** The mechanical engineering domain characterizes the landing leg deployment mechanism; the software engineering domain specifies the touchdown detection logic. The formal or informal interface between these domains — whether the mechanical system's signal behavior during deployment was characterized as an input to the software specification — is the key CDA question. Whether an Interface Control Document or equivalent specified the expected signal output of the landing leg sensors during deployment (as distinct from touchdown) is the central interface question. | JPL mechanical engineers / software engineers | Mechanical-software interface characterization (or absence thereof) | Interface scope defined within development process |
| 1998–1999 | Development testing conducted for the MPL landing system. Tests are conducted to verify the landing system's performance across defined test scenarios. The Review Board subsequently found that the specific in-flight leg deployment false-signal scenario was not among the tested conditions. Some test data may have existed regarding landing leg sensor behavior during deployment, but the specific relevance of any such data to the touchdown detection logic's vulnerability was not formally assessed. | JPL / MPL test team | Development test results within defined test matrix scope | Nominal test results for tested scenarios |
| Jan 3, 1999 | **[Pre-Decision Phase ends]** Mars Polar Lander launched from Cape Canaveral on a Delta II rocket. All launch systems nominal. The flight software with the unverified touchdown detection logic is aboard. | JPL / NASA | Launch — nominal | Nominal |
| Jan–Nov 1999 | MPL cruise phase. The spacecraft travels from Earth to Mars. The flight software cannot be modified for the specific failure mode during cruise (no software uplink capability for this type of change). | JPL Mission Operations | Cruise — nominal telemetry | Nominal operations |
| Dec 3, 1999 | **[Decision Phase — automated]** MPL enters the Martian atmosphere. The EDL sequence begins as designed. At approximately 12 km altitude, the heat shield is jettisoned. At approximately 1.4 km altitude, the landing legs are deployed from their stowed configuration. The leg deployment mechanism generates transient signals on the landing leg contact sensors as the legs spring open. The flight software interprets these signals as a touchdown indication. The software commands engine cutoff. The spacecraft is at approximately 40 meters altitude. The descent engines stop firing. | MPL flight system (automated) | Leg deployment transient signal → touchdown detection → engine cutoff at altitude | [Not classifiable in real-time — event unknown to any observer] |
| Dec 3, 1999 | MPL falls from approximately 40 meters with engines off. Impact with the Martian surface. Loss of spacecraft. | MPL flight system | Spacecraft loss | Contact never reestablished |
| Mar 22, 2000 | **Review Board Report released.** The Board identifies the most probable cause as false touchdown signal from leg deployment transient, causing engine cutoff at altitude. The Board established this probable cause through testing conducted post-loss on hardware of the same design. The Report notes the failure mode was not in the formal fault tree analysis and was not specifically tested for during development. | Mars Polar Lander Review Board | Post-loss investigation finding — probable cause (post-event) | Root cause determination |

---

## Section B4 — Signal Inventory

All signals are within the Pre-Decision Phase scope (approximately 1997–1998 through January 3, 1999) unless otherwise noted.

---

**S-001 — Touchdown detection logic specification**

| Field | Value |
|-------|-------|
| Signal ID | S-001 |
| Description | The MPL flight software specification governing the touchdown detection logic: the specification that the landing leg contact sensors would be the primary mechanism for detecting surface contact, and that the engine cutoff command would be issued when these sensors indicated touchdown. This design decision embedded the vulnerability: the logic did not distinguish between sensor actuation by surface contact (intended) and sensor actuation by the leg deployment mechanism (not intended). |
| Source | Review Board Report — technical analysis section |
| First Appearance | Software specification phase, approximately 1997–1998 |
| Visibility Level | VISIBLE within the software engineering domain; the specification was a formal design document |
| Decision Relevance | FOUNDATIONAL — this specification is the technical root of the failure chain |
| Notes | The specification as written was correct for the assumed use case: landing legs touching the surface. It did not account for the mechanical behavior of the leg deployment mechanism as a signal source. This omission is the structural gap between the software specification and the mechanical design domains. |

---

**S-002 — Landing leg deployment mechanism design**

| Field | Value |
|-------|-------|
| Signal ID | S-002 |
| Description | The mechanical engineering design of the MPL landing legs: spring-loaded mechanisms that deploy the legs from the stowed position during descent. The deployment mechanism, as a physical system, generates motion and force on the leg structure during deployment. The contact sensors on the legs, designed to detect surface contact, are physically capable of being actuated by the deployment motion — not just by surface contact. Whether the mechanical design documentation characterized this behavior of the sensors during deployment, and whether this characterization was visible to the software engineering domain, is the key interface question. |
| Source | Review Board Report — mechanical system analysis; technical description of EDL hardware |
| First Appearance | Mechanical design phase, approximately 1997–1998 |
| Visibility Level | VISIBLE within the mechanical engineering domain; visibility to the software engineering domain as a relevant signal behavior is the CDA question |
| Decision Relevance | CRITICAL — the physical mechanism of the false signal |
| Notes | The deployment mechanism generates the false signal; the touchdown logic is the interpretation system that converts the false signal into an engine cutoff command. The connection between S-002 (mechanical behavior) and S-001 (software specification) is the HCL structural condition. |

---

**S-003 — Test program design decisions (what was and was not tested)**

| Field | Value |
|-------|-------|
| Signal ID | S-003 |
| Description | The design of the MPL landing system verification test program: the set of test scenarios, test conditions, and acceptance criteria used to verify the landing system's performance. The Review Board found that the specific scenario of in-flight leg deployment generating false touchdown signals was not among the tested conditions. This test program scope reflects a series of design decisions about what to include, each individually within the expected scope for the development schedule and budget, and each individually below the threshold for a specific additional test requirement. |
| Source | Review Board Report — testing and verification analysis section |
| First Appearance | Test program design phase, approximately 1997–1998 |
| Visibility Level | VISIBLE within the test program management context; the test matrix was a formal planning document |
| Decision Relevance | HIGH — the test program was the organizational mechanism for verifying the specification against the physical system |
| Notes | This is the primary WSP signal: the individual test scope decisions that collectively produced a test program that did not cover the specific failure mode. No single exclusion was flagged as a risk; the aggregate exclusion of the false-signal scenario was the gap. |

---

**S-004 — Fault tree / failure mode analysis coverage**

| Field | Value |
|-------|-------|
| Signal ID | S-004 |
| Description | The safety and reliability analysis of the MPL landing system, specifically the failure mode and effects analysis (FMEA) or fault tree analysis (FTA) that was conducted during development. The Review Board found that the specific failure mode of false touchdown signal from leg deployment was not included in the formal fault tree analysis. This means the failure mode was not formally characterized as a risk scenario to be mitigated, and no specific design or test requirement was generated to address it. |
| Source | Review Board Report — safety analysis section |
| First Appearance | Safety analysis phase, approximately 1997–1998 |
| Visibility Level | VISIBLE within the safety analysis team; the fault tree was a formal analysis document |
| Decision Relevance | HIGH — the fault tree is the organizational mechanism for formally identifying and mitigating failure modes |
| Notes | The absence of the failure mode from the fault tree is a structural signal: the analysis did not produce the cross-domain integration question ("what happens to the touchdown logic if the leg sensors fire during deployment?") that would have triggered a design requirement or test requirement. |

---

**S-005 — Mechanical-software interface documentation (or gap)**

| Field | Value |
|-------|-------|
| Signal ID | S-005 |
| Description | The formal or informal interface documentation between the mechanical landing system design and the software touchdown detection logic: specifically, whether the expected signal output of the landing leg sensors during deployment (as distinct from surface touchdown) was characterized as an input to the software specification. In standard spacecraft development practice, an Interface Control Document (ICD) or equivalent specification governs the signal behavior at the interface between hardware and software. Whether this interface document explicitly specified the sensor's behavior during leg deployment — and whether this behavior was incorporated into the software specification — is the key question. The Review Board's findings imply this cross-domain characterization was not complete for the specific deployment scenario. |
| Source | Review Board Report — system integration analysis |
| First Appearance | Interface definition phase, approximately 1997–1998 |
| Visibility Level | PARTIALLY VISIBLE — interface documents exist as formal engineering records; the completeness of the characterization within the interface documents is the gap |
| Decision Relevance | STRUCTURAL — this is the organizational artifact that should have connected S-002 (mechanical behavior) to S-001 (software specification) |
| Notes | S-005 represents the CDA condition: if the interface documentation did not characterize the leg deployment signal behavior as a required software input, then the mechanical domain signal (S-002) could not cross the mechanical-software boundary into the software specification domain (S-001) through the normal documentation pathway. |

---

**S-006 — Development test data (any results related to leg deployment signal behavior)**

| Field | Value |
|-------|-------|
| Signal ID | S-006 |
| Description | Any test results from the MPL development test program that documented landing leg sensor behavior during leg deployment. The Review Board report indicates that the specific failure mode scenario was not specifically tested for; however, it is possible that testing of related functions produced data that, if analyzed with the specific failure mode in mind, would have revealed the vulnerability. The extent to which any development test data documented leg deployment sensor behavior and whether such data was analyzed for false-signal vulnerability is a question requiring primary source confirmation. |
| Source | Review Board Report — testing section; development test records referenced in the report |
| First Appearance | Development testing phase, approximately 1997–1998 |
| Visibility Level | VISIBLE within the test team; any data generated would have been in test records |
| Decision Relevance | UNCERTAIN — the significance of any such data for the specific failure mode would depend on whether it was analyzed in the correct context |
| Notes | AI-knowledge uncertainty: The specific content of development test data that may have touched on leg deployment sensor behavior is not confirmed at the required resolution from AI training data. This signal is included as a potential signal whose characterization requires primary source confirmation. If no such data existed, S-006 is an absence signal (confirming the test program gap in S-003). If data existed but was not analyzed for false-signal vulnerability, S-006 becomes a WSP signal with associated CDA implications. |

---

**S-007 — NASA "Faster, Better, Cheaper" (FBC) development constraints**

| Field | Value |
|-------|-------|
| Signal ID | S-007 |
| Description | The MPL development operated under the "Faster, Better, Cheaper" mission design philosophy that was NASA's approach to Mars missions in the late 1990s. This philosophy compressed development schedules and budgets relative to earlier flagship missions, limiting testing coverage and integration review depth. The FBC constraints represent the organizational context within which the test program design (S-003) and interface documentation (S-005) decisions were made. |
| Source | Review Board Report — program context section; National Academy of Sciences review of FBC program (cited in Review Board context) |
| First Appearance | Program initiation, approximately 1996–1997 (MPL program start) |
| Visibility Level | VISIBLE as NASA program management policy; the budget and schedule constraints were organizational parameters known to the development team |
| Decision Relevance | STRUCTURAL CONTEXT — explains why each individual test scope or analysis scope decision was within the normal range for the program; the FBC constraint is the organizational condition lowering the threshold below which individual scope decisions were accepted without additional review |
| Notes | S-007 is the organizational context signal rather than a specific technical signal. It is relevant to the WSP coding: under FBC constraints, each individual test program scope decision was more likely to be within the acceptable range, making individual-scope signals harder to aggregate into a formal risk concern. |

---

## Section B5 — AP Signal Coding

### WSP — Weak Signal Preservation

**Assessment: PRESENT — MEDIUM CONFIDENCE**

**Evidence:**

The landing system test program design (S-003) represents the primary WSP signal environment. The test program was designed under FBC development constraints (S-007) with a defined scope covering the anticipated landing scenarios. The specific in-flight leg deployment false-signal scenario was not among the tested conditions. This absence was one of many testing scope decisions; each individual test scenario exclusion was within the normal scope management practice for the FBC era.

The pattern: multiple individual test scope decisions each below the threshold for a formal additional-test requirement, collectively producing a test program that did not cover the specific failure mode. No single scope decision was flagged as a risk requiring additional coverage.

The fault tree analysis coverage (S-004) represents a parallel WSP signal: the failure mode was not in the formal analysis. This was one of many failure modes that could have been included; its exclusion was one of many analysis scope decisions each individually within the expected coverage for the program's scale.

**WSP sub-criteria:**

WSP-1 (signal present in evidence environment): Present — S-003 and S-004 document the testing and analysis coverage decisions; the excluded failure mode scenario was representable from the development documentation.

WSP-2 (signal individually below threshold): Present — each individual test scope decision and each individual fault tree analysis scope decision was within the expected range for an FBC mission development program.

WSP-3 (no aggregation mechanism): Present — no mechanism existed to aggregate the set of excluded test scenarios and fault tree entries into a combined assessment of what failure modes the program had not verified against.

**WSP coding: PRESENT — MEDIUM CONFIDENCE**

**Confidence note:** The MEDIUM (rather than HIGH) confidence reflects the AI-knowledge uncertainty about the specific content of the MPL test program and whether any test data related to leg deployment sensor behavior existed (S-006). If S-006 contained documentable test data related to the failure mode that was not specifically analyzed, the WSP confidence increases; if no such data existed, the WSP is entirely characterizable from S-003 and S-004 at medium confidence.

---

### CDA — Cross-Domain Admission

**Assessment: PRESENT — HIGH CONFIDENCE**

**Evidence:**

The CDA signal for T2-002 is the interface between the mechanical engineering domain (landing leg deployment mechanism design, S-002) and the software engineering domain (touchdown detection logic specification, S-001). The physical behavior of the landing leg sensors during deployment — specifically that the deployment mechanism generates sensor signals distinguishable from surface-contact signals only by context, not by sensor output — needed to cross from the mechanical engineering domain into the software specification domain for the false-signal vulnerability to be incorporated into the software design requirements.

**CDA-1 (signal from different domain):** S-002 (mechanical leg deployment sensor behavior) originated in the mechanical engineering domain. The touchdown detection logic (S-001) was specified in the software engineering domain. The relevant signal — that leg deployment generates sensor signals interpretable as touchdown signals by the software logic — required cross-domain integration to become a software specification input.

**CDA-2 (signal not admitted into the decision process):** The interface documentation (S-005) did not fully characterize the landing leg sensor behavior during deployment as a relevant software specification input. The Review Board finding that the failure mode was not in the fault tree analysis (S-004) confirms that this signal — the mechanical leg deployment as a source of touchdown-indistinguishable sensor signals — was not admitted into the formal safety analysis that would have generated a software protection requirement.

**CDA-3 (organizational admissibility architecture failure):** The interface documentation structure (S-005) represented the organizational admissibility architecture: it was the instrument through which mechanical domain information became a software specification input. The absence of the leg deployment signal behavior from this interface characterization constitutes the organizational admissibility failure.

**CDA coding: PRESENT — HIGH CONFIDENCE**

**Confidence note:** HIGH confidence because the Review Board's finding that the failure mode was not in the fault tree analysis directly implies that the mechanical domain signal (leg deployment as a source of false touchdown signals) was not admitted into the organizational safety analysis process. The inference from Review Board findings to CDA coding is direct.

---

### CR — Contradiction Retention

**Assessment: PARTIAL / LOW CONFIDENCE**

**Evidence:**

Per B2R-01, the Pre-Decision Phase signal environment for T2-002 is a testing coverage gap and software specification environment, not a known-anomaly environment where the false signal was identified and dismissed. The Review Board identified the failure mode through post-loss testing, not from pre-launch records of a known and dismissed risk.

A potential soft CR condition exists:

If the software specification (S-001) stated that the touchdown detection would trigger on any landing leg sensor actuation, AND if the mechanical design documentation (S-002) characterized the landing legs as spring-deployed mechanisms that generate physical forces during deployment, THEN a reviewer with access to both documents could potentially identify the implicit contradiction: the software will cut off engines whenever the sensors fire, but the sensors can fire during mechanical deployment before any surface contact.

Whether this constitutes a documentable CR depends on whether both signals were simultaneously present in any organizational design review context in a form that made the contradiction recognizable. The Review Board findings suggest that the integration question was not formally posed — which is more consistent with a CDA failure (the mechanical signal never reaching the software specification context) than with a CR failure (the contradiction recognized and then dismissed).

**CR sub-criteria:**

CR-1 (two signals in direct contradiction): Potentially present as a soft condition — the software specification's assumption and the mechanical deployment behavior are logically inconsistent, but this inconsistency required cross-domain integration to be recognizable as a contradiction.

CR-2 (both signals in evidence environment): Present — both the software specification and the mechanical design exist as engineering documents.

CR-3 (contradiction resolved by discarding one signal): NOT clearly present — the evidence supports a CDA account (signals never jointly present in a common decision context) more than a CR account (contradiction recognized and resolved).

**CR coding: PARTIAL / LOW CONFIDENCE — consistent with the B2R-01 revised signal environment characterization; CDA is the more evidenced account**

---

## Section B6 — EE Structural Coding

### Load Displacement (LD)

**Assessment: PRESENT — HIGH CONFIDENCE**

**Evidence:**

**LD-1 — Risk transferred without information:**

The verification burden for the touchdown detection logic's correctness under all possible input conditions was displaced through two transfers: first, from the software specification process (where the requirement could have been captured) to the test program (which was supposed to validate the specification against hardware behavior), and second from the test program (with its validated scope) to flight operations (implicitly endorsing the software as verified for flight).

The interface documentation (S-005) was the displacement mechanism: it transferred the "verified interface" status from the specification phase to the integration phase without the specific characterization of leg deployment sensor behavior that would have revealed the vulnerability. The test program's "test pass" status then transferred the "validated" status to launch without the specific failure mode having been exercised.

**LD-2 — Source appears stable:**

The software specification and test program each appeared to have completed their function correctly within their own domains. The software specification was a complete and internally consistent document. The test program was executed and the tested scenarios passed. Both source domains appeared to have fulfilled their verification function.

**LD-3 — Destination holds risk without assessment:**

Flight operations — the launch and cruise phase — held the risk of the false touchdown signal vulnerability without any assessment capacity. The vulnerability was embedded in the flight software as launched; it could not be modified during cruise (no software uplink for this type of change). The destination (flight operations) held the risk without the information required to identify it.

**LD coding: PRESENT — all three sub-criteria satisfied**

---

### Fragility Accumulation (FA)

**Assessment: PRESENT — MEDIUM CONFIDENCE**

**Evidence:**

Multiple independently managed verification elements were simultaneously below their nominal levels for the specific failure mode:

**FA element 1 — Touchdown logic false-signal coverage:** The software touchdown logic did not include protection against false signals from leg deployment. This was a single specification gap, but it represented a below-nominal safety margin for the specific failure mode.

**FA element 2 — Test program coverage for the failure mode:** The test program did not include the specific in-flight leg deployment scenario. This is a below-nominal verification coverage margin for this failure mode.

**FA element 3 — Fault tree analysis coverage:** The failure mode was not in the formal fault tree analysis. This is a below-nominal safety analysis margin for this failure mode.

**FA element 4 — Interface characterization completeness:** The mechanical-software interface documentation did not fully characterize leg deployment sensor behavior as a software specification input. This is a below-nominal interface management margin.

**FA element 5 — Altitude protection for engine cutoff:** The software did not include a minimum altitude requirement for the engine cutoff command. An altitude floor would have been a compensating safety margin; its absence meant there was no backup protection against false-signal engine cutoff above a survivable altitude.

**FA sub-criteria:**

FA-1 (at least three independently managed margins simultaneously below nominal): Present — five elements identified; elements 1–4 are each managed by different engineering functions (software design, test management, safety analysis, interface management); element 5 is managed by the system architecture function.

**FA coding: PRESENT — MEDIUM CONFIDENCE**

**Confidence note:** MEDIUM (rather than HIGH) confidence because the independently managed character of each margin element is an inference from the general development process structure rather than directly confirmed from specific passages in the Review Board Report at this reconstruction resolution. Applying the Batch 1 FA lesson (FA should not be underestimated even in apparently concentrated failures), MEDIUM confidence is assigned rather than the lower confidence that might have been assigned without that lesson.

---

### Threshold Instability (TI)

**Assessment: PRESENT — MEDIUM CONFIDENCE**

**Evidence:**

The landing system operated at a threshold defined by the minimum altitude from which a free fall would be survivable vs. fatal. When the engine cutoff command was issued at approximately 40 meters altitude, the spacecraft was above the threshold for survivable free fall on Mars — the impact velocity from that altitude, without the descent engines, was fatal.

**TI-1 (critical parameter operating at or beyond design limit):** The spacecraft was at approximately 40 meters altitude when the engines cut off. This placed the system at or beyond the threshold for survivable impact — not within measurement uncertainty of a threshold that might have been safe, but past the threshold that would have required continued descent for a controlled landing.

**TI note:** TI in this case has a distinctive character. The threshold is the altitude below which engine cutoff would be survivable (approximately 0-10 meters for a controlled fall). The system triggered the cutoff far above this threshold (approximately 40 meters). This is not TI-by-measurement-uncertainty (operating near a limit without knowing the proximity) but TI-by-specification-gap: the specification did not recognize the altitude-engine-cutoff dependency, so no threshold proximity was assessed.

**TI coding: PRESENT — MEDIUM CONFIDENCE**

---

### Cascade Precondition (CP)

**Assessment: PRESENT — MEDIUM CONFIDENCE**

**Evidence:**

**CP coupling 1 — False touchdown signal × Engine cutoff logic:**

The landing leg deployment generates a transient sensor signal (the mechanical event from S-002). The touchdown detection logic interprets any leg sensor actuation as touchdown (the software design from S-001). These two elements are coupled: the deployment mechanism produces the signal; the software logic responds to any signal from that mechanism. The coupling was built into the design — it was not an unexpected interaction but a predictable consequence of the specification-mechanical interface gap. Neither element alone produces the failure; the coupling does.

**CP coupling 2 — Engine cutoff at altitude × Absence of altitude protection:**

The engine cutoff at approximately 40 meters (consequence of CP coupling 1) was coupled with the absence of a minimum altitude protection mechanism. If the software had included a requirement that engine cutoff not occur above a minimum altitude (e.g., 5 meters), the false signal at 40 meters would not have produced a fatal outcome. The absence of this protection was coupled to the false signal vulnerability: neither the false signal alone (if an altitude floor existed) nor the absent altitude floor alone (if no false signal occurred) would have caused the failure. Their coupling produced the cascade.

**CP sub-criteria:**

CP-1 (at least two coupled failure modes): Present — both couplings identified.

CP-2 (couplings not reflected in the landing system risk model): Present — the Review Board's finding that the failure mode was not in the fault tree analysis confirms that CP coupling 1 was not in the formal risk model; the absence of altitude protection suggests CP coupling 2 was also not formally assessed.

**CP coding: PRESENT — MEDIUM CONFIDENCE**

**Note:** A-20 (Clarification Addendum v2) governs CP coding in reconstruction.

---

### Hidden Common Link (HCL)

**Assessment: PRESENT — HIGH CONFIDENCE**

**Evidence:**

**HCL-1 (signals from structurally independent sources):**

S-001 (software touchdown detection logic specification) originated in the software engineering domain. S-002 (landing leg deployment mechanism design and sensor behavior) originated in the mechanical engineering domain. These are structurally independent engineering disciplines with distinct organizational roles, technical methods, and documentation systems.

**HCL-2 (non-connection documented during decision phase):**

The connection between S-001 and S-002 — specifically that the leg deployment mechanism (S-002) generates signals that the touchdown logic (S-001) will interpret as touchdown commands — was not established during the development phase. The fault tree analysis (S-004) did not contain this failure mode; the interface documentation (S-005) did not fully characterize this connection; the test program (S-003) did not test for this scenario.

**HCL-3 (investigation confirmed shared structural cause):**

The Review Board confirmed that the shared structural cause connecting S-001 and S-002 was the functional dependency of the software's touchdown response on the sensor's signal output during any actuation event — including leg deployment, not just surface contact.

**HCL-4 (connection non-obvious from within either domain):**

From within the software engineering domain: the specification correctly described touchdown detection logic for the assumed use case (surface contact); the mechanical behavior of the leg deployment mechanism was not within the software engineer's normal specification input set. From within the mechanical engineering domain: the leg deployment mechanism was designed to deploy correctly; the software's response to leg deployment signals was not within the mechanical engineer's normal concern scope. The connection required deliberate cross-domain integration that was not routinely produced in the development process.

**HCL coding: PRESENT — HIGH CONFIDENCE**

---

### Structural Incongruence (SI)

**Assessment: PRESENT — HIGH CONFIDENCE**

**Evidence:**

**Operational assumption embedded in the software specification (S-001):** The landing leg contact sensors will generate signals when and only when the legs contact the Martian surface (touchdown). The engine cutoff command will therefore be issued at the correct moment — surface contact — not before.

**Operational reality embedded in the mechanical design (S-002):** The landing leg deployment mechanism generates signals on the leg contact sensors during the deployment event itself — a mechanical transient occurring at altitude, before any surface contact is possible.

These two are structurally incongruent: the assumption that the sensors signal only at surface contact is incompatible with the physical reality that the sensors also signal during leg deployment at altitude. The incongruence was inherent in the physical system and was architecturally invisible during the development phase because the mechanical-software interface was not characterized to this level of specificity.

**SI is the constitutive structural cause of the T2-002 failure:** The false signal failure would not have occurred if the operational assumption (sensors signal only at surface contact) matched the operational reality (sensors also signal during deployment). The incongruence was the fundamental cause; LD and HCL describe how the incongruence was embedded in the development process; CP describes how it produced the cascade; FA describes the multiple verification gaps that allowed it to persist.

**SI coding: PRESENT — HIGH CONFIDENCE**

---

## Section B7 — Visibility Analysis

### Which Signals Were Visible

**S-001 (Software specification):** VISIBLE within the software engineering domain — the specification was a formal document.

**S-002 (Mechanical design):** VISIBLE within the mechanical engineering domain — the design was documented in formal engineering records.

**S-003 (Test program design):** VISIBLE to the test program management — the test matrix was a formal planning document.

**S-004 (Fault tree analysis):** VISIBLE to the safety analysis team — the analysis was a formal safety document.

**S-005 (Interface documentation):** VISIBLE as a formal interface document to both mechanical and software engineering teams; the completeness of its characterization of the leg deployment signal behavior is the gap.

**S-007 (FBC constraints):** VISIBLE as NASA program policy to the MPL development team.

### Which Signals Were Filtered

**The combined implication of S-001 and S-002:** FILTERED — the logical implication that the software would respond to leg deployment sensor signals (a consequence of S-001's design when combined with S-002's physical behavior) was never produced as an integrated signal in any single organizational context. The connection was architecturally invisible because the interface documentation (S-005) did not bridge the two domains at the required level of specificity.

**The failure mode scenario (false signal from leg deployment):** FILTERED from the fault tree analysis (S-004) and test program (S-003). The filtering mechanism: the absence of a cross-domain integration requirement that would have mandated characterizing the mechanical leg deployment signal behavior as a software specification input.

### Filtering Mechanisms

**Primary — Cross-domain interface absence (CDA):** The mechanical-software interface documentation (S-005) was the organizational mechanism for bridging the two domains. Its incomplete characterization of the leg deployment signal behavior meant the mechanical domain signal (S-002) could not reach the software specification domain (S-001) through the normal documentation pathway. This is the structural filtering mechanism: the interface was the boundary, and the specific signal required to cross it was not included.

**Secondary — Test scope limitation under FBC constraints (WSP):** The FBC development context (S-007) created an organizational environment in which individual test scope decisions were routinely accepted at lower coverage levels than would be expected for flagship missions. Each individual test scenario exclusion was within the acceptable range; the aggregate exclusion of the failure mode scenario was the filtering outcome.

**Tertiary — Fault tree scope limitation:** The fault tree analysis's failure to include the specific failure mode means the analysis did not generate the corrective action (test requirement or design change) that would have resolved the vulnerability. The fault tree was the second organizational mechanism (after the interface documentation) that could have admitted the failure mode into the engineering response process.

### Organizational Location of Filtering

The primary filtering occurred at the mechanical-software engineering interface — the point where the mechanical leg deployment behavior should have been characterized as a software specification input and was not. This was an architectural gap in the development process rather than an individual decision to suppress the signal. No engineer made a deliberate choice to exclude the failure mode; the organizational process for cross-domain integration was insufficient to surface it.

---

## Section B8 — Alternative Explanation Inventory

*No comparison to predictions. Inventory only.*

**AE-001 — Software specification error:** The touchdown detection logic was incorrectly specified; it should have explicitly filtered leg deployment signals or used an altitude interlock to prevent engine cutoff above a minimum altitude. Root cause: software engineering specification gap.

**AE-002 — Test coverage gap:** The landing system test program did not include the specific in-flight leg deployment false-signal scenario. If this test had been included and run, the failure mode would have been identified before launch. Root cause: test program scope deficiency.

**AE-003 — Interface documentation gap:** The mechanical-software interface was not characterized to the level of specificity required to identify the leg deployment signal behavior as a software specification input. Root cause: interface management process gap.

**AE-004 — Fault tree incompleteness:** The formal safety analysis did not include the false touchdown signal failure mode. If it had been included, a mitigation requirement (software protection or additional test) would have been generated. Root cause: safety analysis scope limitation.

**AE-005 — FBC resource constraint:** The "Faster, Better, Cheaper" development philosophy reduced testing and analysis resources to the point where comprehensive failure mode coverage was not achievable within program constraints. Root cause: programmatic resource limitation.

**AE-006 — Cross-discipline integration failure:** Spacecraft landing systems involve both mechanical and software engineering; the integration between these disciplines requires deliberate cross-domain review. The MPL development process did not produce the specific integration review that would have connected leg deployment behavior to touchdown logic vulnerability. Root cause: cross-discipline integration process deficiency.

---

## Section B9 — Reconstruction Findings

### Signal Environment

The Mars Polar Lander Pre-Decision Phase evidence environment contained the engineering documentation of a development process in which the software touchdown detection logic (S-001) and the mechanical landing leg deployment mechanism (S-002) were specified independently without a formal cross-domain interface requirement that would have connected leg deployment signal behavior to the software's engine cutoff logic. The testing and safety analysis programs (S-003, S-004) defined their scope within the FBC development context (S-007) without including the specific false-signal failure mode scenario.

The signal environment is a collection of organizational process absences rather than visible suppressed signals: the failure mode was not identified, not tested, not analyzed — it was absent from the organizational processes that should have identified it. This distinguishes T2-002 from T1-005 and T1-004, where signals were present and were handled (correctly or incorrectly). In T2-002, the primary signal was the failure to produce the integration question that would have generated the relevant signal.

### Structural Environment

All six EE structures are coded Present: HCL (HIGH confidence — software and mechanical domains sharing an invisible common cause), LD (HIGH confidence — verification burden displaced through specification-to-test chain without the specific failure mode being exercised), SI (HIGH confidence — software assumption and mechanical reality structurally incongruent), FA (MEDIUM confidence — five independently managed margin elements), TI (MEDIUM confidence — altitude threshold crossed at engine cutoff), CP (MEDIUM confidence — two couplings in the landing system failure chain).

The most analytically distinctive finding is the co-presence of SI and HCL as the primary structural pair. SI identifies what the incongruence was (assumption vs. reality of sensor behavior during deployment); HCL identifies why it was architecturally invisible (the two domains were independently specified and the connection was not produced through the interface process). Together they characterize the failure at a level of structural specificity not achievable from the conventional account ("software didn't protect against false signals").

### Visibility Environment

The primary filtering mechanism is a cross-domain interface absence rather than the organizational boundary filtering seen in T1-005 or the normalization filtering seen in T1-004. The signal that needed to cross domains was the characterization of landing leg deployment sensor behavior — a signal that existed in the mechanical engineering domain but was not translated into a software specification requirement through the interface process. The test program and fault tree analysis both failed to independently surface the failure mode because neither was designed with an explicit cross-domain integration mandate for this specific scenario.

### AP Environment

CDA is coded Present at HIGH confidence — the clearest AP finding in the reconstruction. WSP is Present at MEDIUM confidence. CR is Partial/Low confidence — the B2R-01 characterization of the signal environment as a testing coverage gap (not a known-anomaly environment) is consistent with the reconstruction findings: no pre-launch evidence of the failure mode being identified and then dismissed. The primary AP finding is CDA, not CR.

---

## Section B10 — Reconstruction Freeze

### Session Boundary Confirmation

This reconstruction was conducted without access to Artifact A Batch 2 predictions for T2-002 or for any other case. No Batch 2 prediction document, prediction summary, T1-005 reconstruction, comparison document, or Artifact C material was accessed during this session.

### Reconstruction Completion Record

| Field | Value |
|-------|-------|
| Reconstruction completion date | 2026-05-31 |
| Analyst identity | EE/CIS Research Governance Team — AI-assisted |
| Artifact A Batch 2 access | NONE — session boundary maintained |
| T1-005 Reconstruction access | NONE — session boundary maintained |
| Primary source accessed | MPL Review Board Report (as mediated through AI training data) |
| Session boundary compliance | CONFIRMED |

**AP coding status at freeze:**
- WSP: PRESENT (MEDIUM CONFIDENCE)
- CDA: PRESENT (HIGH CONFIDENCE)
- CR: PARTIAL / LOW CONFIDENCE

**EE coding status at freeze:**
- Load Displacement: PRESENT (HIGH CONFIDENCE)
- Fragility Accumulation: PRESENT (MEDIUM CONFIDENCE)
- Threshold Instability: PRESENT (MEDIUM CONFIDENCE)
- Cascade Precondition: PRESENT (MEDIUM CONFIDENCE)
- Hidden Common Link: PRESENT (HIGH CONFIDENCE)
- Structural Incongruence: PRESENT (HIGH CONFIDENCE)

**FROZEN — 2026-05-31**

---

*Track A — Artifact B — T2-002 Mars Polar Lander Reconstruction | EE/CIS Research Governance Team | 2026-05-31*  
*FROZEN — REC-ART — RECONSTRUCTION ONLY — NO PREDICTION COMPARISON PERMITTED*
