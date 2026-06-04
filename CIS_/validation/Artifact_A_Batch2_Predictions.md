# Track A — Artifact A
# Prediction Batch 2: Pre-Registered Predictions

**Artifact designation:** Artifact A — Prediction Batch 2  
**Category:** PRD-ART  
**Version:** 1.0  
**Status:** FROZEN  
**Production date:** 2026-05-31  
**Governing protocol:** Protocol v1 (A-02) + Clarification Addendum v1 (A-05) + Clarification Addendum v2 (A-20)  
**Case registry authority:** M-06 v1.4 (FROZEN 2026-05-31)  
**Failure conditions authority:** Artifact 0 v1.0  
**Governing disclosure:** GD-002 (R-01), GD-006 (SI vocabulary gap — Condition A)

**Cases in this batch:**  
T1-005 — Deepwater Horizon (Macondo Well Blowout)  
T2-002 — Mars Polar Lander  
T2-003 — Genesis Sample Return Capsule

**Freeze declaration:** These predictions are frozen as of this document's production. They may not be revised, amended, or supplemented in response to reconstruction findings. Predictions not confirmed, partially confirmed, or confirmed with reduced weight are recorded as Absent in Artifact C. Failure conditions in Artifact 0 v1.0 apply.

---

## Mandatory Disclosure — GD-002 R-01 / A-03

**DISCLOSURE REQUIRED IN ALL TRACK A OUTPUTS**

This is a retrospective structured validation exercise. The AI system producing these predictions (Claude, Anthropic) has been trained on data that includes public accounts of all three cases in this batch.

**Case-specific prior knowledge levels:**

*T1-005 (Deepwater Horizon):* AI prior exposure assessed as HIGH (M-06 v1.4). The National Commission Report (2011) is a widely cited public document. The multi-party organizational failures (BP, Transocean, Halliburton), the negative pressure test misinterpretation, and the cementing decisions are extensively covered in academic, legal, and engineering literature. Predictions for T1-005 carry the highest contamination risk in Batch 2. The CES assessment in Artifact C is the designated control mechanism.

*T2-002 (Mars Polar Lander):* AI prior exposure assessed as MEDIUM-LOW (M-06 v1.4). The mission loss is known in the space engineering community; the specific pre-launch software specification and testing program decision environment is less publicly saturated. The B2R-01 revision (testing coverage gap environment, not known-anomaly environment) reflects a genuine framework-based characterization rather than the conventional account.

*T2-003 (Genesis Sample Return Capsule):* AI prior exposure assessed as MEDIUM (outcome account: "sensors installed backwards") and MEDIUM-LOW (signal-filtering pathway: design ambiguity enabling backwards installation). The manufacturing/assembly domain analysis is less contaminated than Batch 1 cases.

**GD-006 Condition A Disclosure (SI supplementary predictions):** Per Batch 1 Governance Review GD-006, SI may be pre-registered as supplementary (non-FCR) with the following mandatory disclosure: *SI predictions in Batch 2 are informed by the known presence of SI in all three Batch 1 cases (T1-002, T1-003, T1-004). These predictions carry reduced evidential weight due to prior-knowledge contamination. SI findings in Batch 2 will not count in the FCR numerator and will be assessed for CES but carry reduced framework-specificity weighting in Artifact C.*

**Kappa qualification:** All CAL-2026-001 kappa values are intra-system consistency metrics. Human coder validation (OI-001) remains outstanding.

**Classification:** RETROSPECTIVE STRUCTURED VALIDATION — AI-ASSISTED, HUMAN VALIDATION PENDING

---

## Methodology Note — Automated Decision Phases (T2-002 and T2-003)

For T2-002 (Mars Polar Lander) and T2-003 (Genesis Sample Return Capsule), the Decision Phase is an automated execution sequence with no human decision-making possible during the terminal event. AP signal coding in this document applies exclusively to Pre-Decision Phase design, specification, testing, and verification decisions. The automated execution of the terminal failure event is not treated as a decision event for AP coding purposes.

This methodology follows B2R-04 (Batch2_Readiness_Verification_Report) and represents a structural difference from all Batch 1 cases, where human decision-making was the operative Decision Phase event. Artifact B reconstructions for T2-002 and T2-003 must apply the same convention. Artifact C will note whether this automated-decision-phase convention produced consistent AP codings between Artifact A and Artifact B.

---

## Scope and Phase Boundary Adherence

All predictions are bounded by the Pre-Decision Phase as defined in M-06 v1.4 for each case. EE structures and AP signal types are predicted using the EE/CIS Framework documents, the M-06 v1.4 case metadata, and the framework's structural prediction logic. Investigation reports have not been accessed for this document.

---

---

# Case T1-005: Deepwater Horizon (Macondo Well Blowout)

**Case ID:** T1-005  
**Pre-Decision Phase scope:** Macondo well commencement by Marianas rig (October 2009) → Commencement of final temporary abandonment procedures (April 14, 2010)  
**Decision Phase:** April 14–20, 2010 — final temporary abandonment operations including cement job, negative pressure test, and displacement decisions  
**Primary failure mode context (M-06):** WSP + CDA + CR — multi-party organizational decision-making failure; first cross-domain case in Track A  
**Domain:** Energy / Marine Engineering / Organizational Decision-Making

---

## T1-005 — A1: Predicted EE Structures

### 1. Fragility Accumulation (FA) — PRIMARY PREDICTION

**Prediction:** PRESENT (HIGH confidence)

**Rationale:** The Deepwater Horizon case domain (organizational decision-making, multi-party) is the case type most strongly associated with FA in the Batch 1 evidence base. The Macondo well had a documented history of well control events (influxes, kicks) during its drilling phase from October 2009 through April 2010. Each individually managed and accepted event represents a potential margin degradation contributing to FA.

The framework predicts at minimum four independently managed margin categories simultaneously below nominal at the time of the final temporary abandonment decision:

- **Well integrity margin:** The cement job quality (nitrogen foam cement without mechanical verification of bond) represents a degraded barrier integrity margin relative to standard well abandonment practice.
- **Well control margin:** Prior well control events during the Macondo drilling history were each managed and accepted, potentially calibrating personnel toward a lower effective concern threshold than a clean well history would support.
- **Organizational decision-making margin:** The multi-party structure (BP, Transocean, Halliburton) with each party operating under different organizational risk frameworks creates a condition where no single party holds the full risk picture.
- **Regulatory oversight margin:** The regulatory environment may not have provided independent technical oversight at the resolution required to detect the margin degradation in real-time operations.

**EE sub-criteria predicted:** FA-1 (at least three independently managed margins simultaneously below nominal) — PRESENT.

---

### 2. Load Displacement (LD) — PRIMARY PREDICTION

**Prediction:** PRESENT (HIGH confidence)

**Rationale:** The multi-party organizational structure (BP, Transocean, Halliburton) is the ideal structural condition for LD. Technical risk assessments originating in one party's domain (Halliburton cement engineering; Transocean well pressure monitoring) are transferred to BP's decision-making domain. The framework predicts:

- LD-1: Risk of well integrity failure — embedded in the cement job quality assessment and the negative pressure test results — was transferred to BP's management decision-making without the complete technical information that would enable independent evaluation.
- LD-2: Source appears stable — Halliburton's cement job was completed and accepted; Transocean's pressure monitoring was functioning. Both source domains appeared to have completed their technical functions.
- LD-3: Destination holds risk without assessment — BP's management decision to proceed with temporary abandonment was made with the risk of well integrity failure held in the technical record but not fully characterized for the decision-making context.

---

### 3. Hidden Common Link (HCL) — PRIMARY PREDICTION

**Prediction:** PRESENT (HIGH confidence)

**Rationale:** The multi-source signal environment created by three independent organizational parties generates a strong HCL prediction. The framework predicts that multiple signals from structurally independent sources (BP operations, Transocean pressure monitoring, Halliburton cementing) share a common structural cause not identified during the Decision Phase: the compromised integrity of the Macondo well bore. Each party's signals, viewed within their own organizational domain, were assessable as individually manageable; the shared underlying cause (well bore integrity failure) was not visible from within any single party's domain.

**HCL sub-criteria predicted:** HCL-1 (signals from independent sources — three separate organizational parties), HCL-2 (non-connection during decision phase — integrated well integrity assessment not produced across all three parties), HCL-3 (investigation established shared cause), HCL-4 (connection non-obvious from within any single party's operational context).

---

### 4. Cascade Precondition (CP) — SECONDARY PREDICTION

**Prediction:** PRESENT (MEDIUM-HIGH confidence)

**Rationale:** At least two coupled failure modes are predicted:

**CP coupling 1:** Cement job integrity failure coupled with the decision to displace heavy mud (remove the primary pressure barrier) before setting the production casing lockdown sleeve. Once the cement barrier failed and the heavy mud was displaced, the well had no remaining pressure control barrier.

**CP coupling 2:** The negative pressure test anomalous result coupled with the decision to accept an alternative explanation rather than investigate the anomaly before displacement. The test result and the displacement decision are coupled: a correct interpretation of the test would have prevented the displacement; the incorrect interpretation enabled the cascade.

**Note:** A-20 (Clarification Addendum v2) governs CP coding in reconstruction.

---

### 5. Threshold Instability (TI) — SECONDARY PREDICTION

**Prediction:** PRESENT (MEDIUM confidence)

**Rationale:** The Macondo well's formation pressure versus the controlled wellbore pressure margin represents a threshold condition: the wellbore must maintain sufficient pressure to prevent formation fluid influx. During the displacement operation (removing heavy drilling mud from the riser), the wellbore pressure was progressively reduced toward or below the threshold at which formation pressure would overcome the wellbore pressure. The framework predicts the system was operating within measurement uncertainty of this threshold during the Decision Phase, with the negative pressure test being the measurement instrument.

---

### 6. Structural Incongruence (SI) — SUPPLEMENTARY PREDICTION

**Prediction:** PRESENT (SUPPLEMENTARY — non-FCR per GD-006)

**GD-006 disclosure:** This SI prediction is informed by the known presence of SI in all three Batch 1 cases and carries reduced evidential weight.

**Rationale:** The operational assumption embedded in the Decision Phase (the negative pressure test has passed and the well is secure) was structurally incongruent with the physical reality (the well bore integrity was compromised). This incongruence was architecturally embedded in the decision framework: the "bladder effect" explanation accepted for the anomalous pressure reading created an interpreted framework in which the system appeared secure when it was not.

---

## T1-005 — A2: Predicted AP Signals

### WSP — PREDICTED PRESENT (HIGH confidence)

The Macondo well's history from October 2009 through April 2010 is predicted to contain multiple individually assessable well control signals (influxes, pressure anomalies, cementing concerns) each classified as within acceptable limits or manageable through standard procedures. The framework predicts:
- Individual kick events during drilling classified as resolved through well control procedures
- Cementing design concerns (if any) assessed as within acceptable cementing practice
- Negative pressure test anomalous readings individually explained away rather than aggregated into a pattern indicating well integrity failure

The absence of a cross-party signal aggregation mechanism — a process that would combine Halliburton cementing data, Transocean pressure monitoring, and BP risk assessment into a unified well integrity picture — is the structural WSP condition.

### CDA — PREDICTED PRESENT (HIGH confidence)

This is the primary AP prediction for T1-005 and the strongest CDA case in Batch 2. The three-party organizational structure (BP, Transocean, Halliburton) creates at minimum three domain boundaries across which signals must cross:

- **Halliburton → BP:** Cement job quality assessment signals crossing from Halliburton's technical domain to BP's decision-making domain. The cement job design, quality indicators, and any concerns about nitrogen foam cement performance needed to be admitted into BP's go/no-go decision process.
- **Transocean → BP:** Well pressure monitoring signals crossing from Transocean's operations domain to BP's management domain. The negative pressure test anomalous readings were Transocean data; their interpretation required admission into BP's decision-making.
- **Geological engineering → Operations:** Signals about the Macondo well's formation pressure characteristics and the required barrier specifications needed to cross from geological engineering analysis into the operational decision-making context.

The organizational admissibility architecture — the formal and informal processes governing which signals cross from one party to another in what form — is the predicted primary CDA condition.

### CR — PREDICTED PRESENT (HIGH confidence)

The negative pressure test creates a strong CR prediction: the anomalous test reading (one sensor showing pressure inconsistent with a secure well) and the "bladder effect" explanation (an interpretation that accounts for the anomalous reading without acknowledging well integrity failure) constitute two directly contradictory signals about the same physical parameter (whether the well bore was sealed). Both signals were simultaneously present in the Decision Phase environment. The framework predicts the contradiction was resolved by accepting the nominal explanation and dismissing the anomalous signal.

This is the strongest CR prediction in Batch 2, comparable in structure to the T1-004 (Columbia) CR finding in Batch 1.

---

## T1-005 — A3: Predicted Visibility Failures

**Primary:** Multi-party organizational boundary admissibility failure (CDA). The three-party structure creates an admissibility architecture in which each party's technical signals are formally produced and received within their own domain but are not systematically integrated across party boundaries into a unified well integrity assessment. The filtering is structural, not individual.

**Secondary:** Normalization-through-precedent (WSP). If prior well control events in the Macondo well's history were classified as resolved, each acceptable classification creates a precedent that calibrates the effective concern threshold for subsequent events. This mechanism is structurally parallel to the T1-004 foam debris normalization pattern.

**Tertiary (predicted):** Time-pressure or schedule-pressure filtering. The Macondo well was reportedly behind schedule with associated cost pressure. The framework predicts this creates a third filtering mechanism in which uncertainty signals that would require investigation delay are subject to additional organizational filtering beyond the structural admissibility conditions.

---

## T1-005 — A4: Predicted Alternative Explanations

**AE-001 — Cost-cutting conventional account:** BP made cost-cutting decisions to save money on the Macondo well, sacrificing safety for schedule and cost. This is the dominant conventional account.

**AE-002 — Individual negligence account:** Specific individuals on the rig or in management made negligent decisions that caused the disaster.

**AE-003 — Regulatory failure account:** Insufficient regulatory oversight by the relevant regulatory authority (MMS/BOEMRE) allowed unsafe practices to proceed.

**AE-004 — Multi-party diffused responsibility account:** When responsibility is divided among multiple parties (BP, Transocean, Halliburton), each party assumes another is managing the risk; the distributed structure produces no single point of safety accountability.

**AE-005 — Technical misinterpretation account:** The negative pressure test was technically misinterpreted; individuals applied an incorrect engineering concept ("bladder effect") to rationalize an anomalous result.

**AE-006 — Complex systems accident account:** The Deepwater Horizon disaster was a normal accident in a complex system; no single decision or failure caused it; the coupling of multiple independent failures produced the outcome.

---

## T1-005 — A5: Prediction Confidence

| Prediction | Dimension | Confidence | Justification |
|------------|-----------|-----------|---------------|
| Fragility Accumulation | EE | High | Multi-party organizational case type — FA strongly predicted; Batch 1 lesson: FA should not be underestimated for distributed organizational cases |
| Load Displacement | EE | High | Three-party structure directly produces LD; risk displaced across organizational boundaries without complete technical information transfer |
| Hidden Common Link | EE | High | Three independent organizational sources sharing a common underlying cause (well bore integrity) not identified from within any single party's domain |
| Cascade Precondition | EE | Medium-High | Cement-displacement coupling and test-interpretation-displacement coupling both predicted; specific evidence pending reconstruction |
| Threshold Instability | EE | Medium | Wellbore pressure vs. formation pressure threshold — system predicted to be operating near threshold during displacement; specific proximity uncertain |
| SI (supplementary) | EE | Medium (GD-006 informed) | Present in all Batch 1 cases; expected in organizational decision cases; contamination disclosure applies |
| WSP | AP | High | Well control event history over 6-month Pre-Decision Phase; strong normalization conditions predicted |
| CDA | AP | High | Three-party structure is the strongest CDA test environment in the batch |
| CR | AP | High | Negative pressure test anomaly vs. "bladder effect" explanation is a textbook CR candidate |

---

## T1-005 — A6: Falsification Conditions

**FA falsified if:** The reconstruction finds fewer than three independently managed margins simultaneously below nominal — specifically, if the cement job, well control history, and organizational oversight each meet their respective nominal standards with no documentable margin degradation.

**LD falsified if:** The reconstruction finds that the full technical risk assessment of the cement job quality and negative pressure test anomaly was transferred to the BP decision-making domain with complete information, enabling independent evaluation.

**HCL falsified if:** The reconstruction finds that the connection between signals from the three parties' domains (shared well bore integrity cause) was explicitly identified and communicated before the negative pressure test decision.

**CDA falsified if:** The reconstruction finds that each party's technical domain signals were formally integrated into a unified well integrity assessment before the displacement decision.

**CR falsified if:** The reconstruction finds that the negative pressure test anomalous reading was the only signal present (no confirmatory "normal" interpretation exists), or that the anomalous reading and the alternative explanation were not simultaneously present in any organizational context.

---

---

# Case T2-002: Mars Polar Lander

**Case ID:** T2-002  
**Pre-Decision Phase scope:** Landing software touchdown detection logic specification and test program design (~1997–1998) → Launch of Mars Polar Lander (January 3, 1999)  
**Decision Phase:** Entry, descent, and landing sequence, December 3, 1999 (automated)  
**Primary failure mode context:** Testing coverage gap + software specification environment. NOT a known-anomaly environment (B2R-01).  
**Domain:** Aerospace / Software Engineering / Entry, Descent, and Landing  
**Automated Decision Phase note:** AP coding applies to Pre-Decision Phase specification and testing decisions only.

---

## T2-002 — A1: Predicted EE Structures

### 1. Load Displacement (LD) — PRIMARY PREDICTION

**Prediction:** PRESENT (HIGH confidence)

**Rationale:** The software touchdown detection logic specification created a Load Displacement condition: the technical responsibility for ensuring the touchdown signal would only be generated at actual touchdown — not during in-flight leg deployment — was embedded in the specification but was not verified against the mechanical behavior of the landing legs during in-flight operation. The verification burden was displaced from the specification and design review phase (where the failure mode would have been identifiable) to the landing test program, which did not cover the specific in-flight failure mode. The test program then transferred the implicit "verified" status to flight operations without the information that would have enabled detection of the gap.

LD-1: Risk of false touchdown signal from in-flight leg deployment was present in the software-mechanical interface but was not transferred with the information required to assess it from within the test program design.  
LD-2: The software was validated within its tested parameter range; the source (test program) appeared to have completed its verification function.  
LD-3: Flight operations proceeded with the risk of false touchdown signal held in the system without assessment capacity.

---

### 2. Hidden Common Link (HCL) — PRIMARY PREDICTION

**Prediction:** PRESENT (HIGH confidence)

**Rationale:** The software touchdown detection specification and the landing leg deployment mechanical dynamics are from structurally independent engineering domains — software engineering and mechanical/structural engineering. Their shared structural cause: the interface between what the software interprets as a touchdown signal and what the mechanical leg deployment generates as a sensor output during in-flight operation. This interface was not explicitly characterized in either domain's engineering documentation; neither domain, working independently within its own scope, would necessarily identify the other domain's behavior as relevant to its specifications. The connection required simultaneous cross-domain characterization that was architecturally unavailable in the program's information flows.

---

### 3. Cascade Precondition (CP) — SECONDARY PREDICTION

**Prediction:** PRESENT (MEDIUM confidence)

**Rationale:** Two coupled failure modes are predicted: (1) the touchdown detection logic generating an engine cutoff command on a false signal, and (2) the lack of an altitude-based protection that would have prevented engine cutoff above a minimum safe altitude. The coupling: the touchdown logic's false-signal vulnerability was coupled to the absence of a secondary safeguard that would have interrupted the cascade. If an altitude floor had been specified for the engine cutoff command, the false signal at altitude would not have been fatal. The two coupled absences — no false-signal filtering and no altitude floor — together constitute the cascade condition.

**Note:** A-20 governs CP coding in reconstruction.

---

### 4. Fragility Accumulation (FA) — SECONDARY PREDICTION

**Prediction:** PRESENT (MEDIUM confidence)

**Lesson from Batch 1:** Batch 1 found FA significantly underpredicted for T1-003 (Ariane 5, a prior-model failure with concentrated software cause). The same risk applies here: FA should not be assumed absent because the failure has a concentrated technical cause. Multiple independently managed margins may be simultaneously below nominal for the T2-002 landing system:

- Software touchdown logic coverage for false-signal scenarios
- Landing system test program coverage for in-flight leg deployment
- Software-mechanical interface characterization in design documentation
- Independent verification connecting mechanical engineering and software engineering

**Confidence is MEDIUM** (not LOW as it would have been without the Batch 1 FA lesson) because the concentrated software specification failure type may or may not produce multiple independently managed margin degradations, depending on how the test program and design verification were organized.

---

### 5. Threshold Instability (TI) — SUPPLEMENTARY PREDICTION

**Prediction:** PRESENT (MEDIUM confidence)

**Rationale:** The altitude at which the false touchdown signal triggered engine cutoff is relevant to TI: if the signal triggered at or near the altitude where a free fall would be fatal (above the threshold for survivable impact), the system was operating at or beyond a critical design threshold. The framework predicts that the altitude at which the false signal occurred was above the threshold for survivable free fall from engine cutoff — placing the system beyond its survivability threshold. The threshold was a design parameter; the false signal crossed it without the design having specifically accounted for the crossing mechanism.

---

### 6. Structural Incongruence (SI) — SUPPLEMENTARY PREDICTION

**Prediction:** PRESENT (SUPPLEMENTARY — non-FCR per GD-006)

**GD-006 disclosure:** Informed by Batch 1 SI findings.

**Rationale:** The operational assumption embedded in the software specification (the landing legs will not generate signals that the touchdown detection logic will interpret as touchdown during in-flight leg deployment at altitude) was structurally incongruent with the physical reality (the landing leg deployment does generate such signals). This incongruence was inherent in the mechanical-software interface and was architecturally invisible from within the software specification process because the mechanical leg deployment behavior at altitude was not characterized as an input to the touchdown logic specification.

---

## T2-002 — A2: Predicted AP Signals

### WSP — PREDICTED PRESENT (MEDIUM confidence)

Per B2R-01, the Pre-Decision Phase signal environment is a testing coverage gap, not a known-anomaly environment. WSP signals are the individual testing scope decisions — each individually below the formal threshold for requiring an additional test — that collectively produced a test program that did not cover the in-flight leg deployment false-signal failure mode.

Predicted signal characteristics: individual test scenario selections that excluded in-flight leg deployment dynamics; individual software coverage decisions that prioritized other failure modes; each individually within standard test scope management practice and below the threshold for formal additional-test-requirement escalation.

### CDA — PREDICTED PRESENT (HIGH confidence)

The signal requiring cross-domain admission was the characterization of landing leg deployment mechanical dynamics as relevant to the software touchdown logic specification. This signal existed in the mechanical engineering domain (the physical behavior of the legs during in-flight deployment is a documentable mechanical property) and needed to cross into the software specification domain to trigger a false-signal protection requirement. The organizational admissibility architecture for the spacecraft program did not include an explicit interface requiring mechanical engineers to certify software signal assumptions against mechanical behavior before software acceptance.

### CR — PREDICTED PRESENT (LOW confidence)

Per B2R-01, the known-anomaly environment assumed in the Tier 2 Approval Review was incorrect. The false touchdown signal was not identified pre-launch. Therefore, the classic CR structure (known contradiction resolved in favor of the nominal signal) may not be present. A softer CR possibility exists: if the software specification included an assertion about what would trigger the touchdown signal, and if the mechanical design documentation characterized the landing leg deployment behavior in a way that was inconsistent with this assertion, both signals could have been simultaneously documentable in the design review process without being explicitly recognized as a contradiction. This is CR at very low confidence — the architecture of the CR would be a non-obvious inconsistency between specification language and mechanical documentation rather than an explicitly recognized and resolved contradiction.

---

## T2-002 — A3: Predicted Visibility Failures

**Primary:** Cross-domain interface absence (CDA) — no organizational requirement connecting the mechanical engineering characterization of landing leg behavior to the software specification of touchdown signal conditions. The filtering was structural: the program's design review process did not include a mandatory step requiring these two domains to verify their shared interface assumptions.

**Secondary:** Testing scope limitation (WSP) — the test program was designed within a scope that did not include the specific in-flight leg deployment false-signal scenario. The absence was one of many scope decisions; no individual scope decision was flagged as requiring supplementary coverage.

---

## T2-002 — A4: Predicted Alternative Explanations

**AE-001 — Software specification error:** The touchdown detection logic was incorrectly specified; it should have included a filter or altitude interlock preventing engine cutoff signals above a minimum altitude.

**AE-002 — Test coverage gap:** The landing system test program was insufficient; the specific in-flight leg deployment scenario should have been included in the test matrix.

**AE-003 — Design oversight:** The software-mechanical interface between landing leg behavior and touchdown signal interpretation was not formally characterized during design review; an explicit interface requirement was missing.

**AE-004 — Process failure:** The development process did not include a cross-discipline review connecting mechanical engineering and software engineering for the landing system's signal chain.

**AE-005 — Resource constraint:** The MPL mission was developed under constrained budget and schedule conditions; the specific test scenario may not have been added due to resource limitations.

---

## T2-002 — A5: Prediction Confidence

| Prediction | Dimension | Confidence | Justification |
|------------|-----------|-----------|---------------|
| Load Displacement | EE | High | Testing coverage gap directly produces LD; verification burden displaced without information required to identify the gap |
| Hidden Common Link | EE | High | Software specification and mechanical leg dynamics from independent domains with shared interface cause |
| Cascade Precondition | EE | Medium | False-signal coupled with absent altitude floor safeguard; specific sub-criteria pending reconstruction |
| Fragility Accumulation | EE | Medium | Batch 1 lesson applied; concentrated software failure may produce multi-margin degradation |
| Threshold Instability | EE | Medium | Altitude threshold at false-signal triggering — survivability boundary crossing predicted |
| SI (supplementary) | EE | Medium (GD-006) | Software assumption vs. mechanical reality; informed by Batch 1 |
| WSP | AP | Medium | Testing scope gap signals each below individual threshold; aggregation mechanism absent |
| CDA | AP | High | Software-mechanical domain boundary with absent interface requirement is the clearest CDA structure in Batch 2 Tier 2 cases |
| CR | AP | Low | B2R-01 revision — known-anomaly environment not confirmed; softer CR possible |

---

## T2-002 — A6: Falsification Conditions

**LD falsified if:** The reconstruction finds that the risk of false touchdown signals during in-flight leg deployment was explicitly characterized and verified as non-occurring in the software specification domain before launch.

**HCL falsified if:** The reconstruction finds that the connection between landing leg mechanical dynamics and the software touchdown signal was explicitly characterized in a cross-domain interface document during the development phase.

**CP falsified if:** The reconstruction finds that a secondary safeguard (altitude floor or other protection) was specified for the engine cutoff command, or that the false-signal coupling was explicitly assessed and determined not to constitute a cascade condition.

**CDA falsified if:** The reconstruction finds a formal organizational interface between the mechanical engineering and software engineering domains specifically requiring mechanical characterization of leg deployment dynamics as an input to the software touchdown specification.

**WSP falsified if:** The reconstruction finds no documentable testing scope decisions in the Pre-Decision Phase — i.e., if the test program was fully specified without any scope-reduction decisions relevant to the landing system's false-signal coverage.

---

---

# Case T2-003: Genesis Sample Return Capsule

**Case ID:** T2-003  
**Pre-Decision Phase scope:** G-switch sensor design specification (~1998–1999) → Launch of Genesis spacecraft (August 8, 2001)  
**Decision Phase:** Atmospheric entry and parachute deployment sequence, September 8, 2004 (automated)  
**Primary failure mode context:** Manufacturing/assembly defect — absent physical keying on sensor housing  
**Domain:** Aerospace / Spacecraft Systems / Manufacturing and Assembly  
**Automated Decision Phase note:** AP coding applies to Pre-Decision Phase design specification, manufacturing, and testing decisions only.

---

## T2-003 — A1: Predicted EE Structures

### 1. Hidden Common Link (HCL) — PRIMARY PREDICTION

**Prediction:** PRESENT (HIGH confidence)

**Rationale:** The design specification (correct orientation required) and the manufactured outcome (backwards installation) originate in structurally independent domains — design engineering and manufacturing/assembly operations — and share a common structural cause that was invisible from within either domain alone: the sensor housing permitted installation in either orientation without physical distinction. From within the design engineering domain, the correct orientation was specified in the drawing; the design was correct. From within the manufacturing domain, the sensor was installed in accordance with what was physically possible; the installation followed standard procedures. Neither domain, working independently, would necessarily identify the shared cause — the absence of physical keying — as the link between the drawing's specification and the manufacturing outcome.

**HCL sub-criteria predicted:** HCL-1 (design engineering and manufacturing as independent domains), HCL-2 (non-connection during Pre-Decision Phase — no documentation connecting drawing specification to physical keying requirement), HCL-3 (investigation confirmed shared cause — absent physical keying), HCL-4 (connection non-obvious from within either domain independently).

---

### 2. Load Displacement (LD) — PRIMARY PREDICTION

**Prediction:** PRESENT (HIGH confidence)

**Rationale:** The risk of orientation ambiguity was displaced from the design engineering domain — where the sensor orientation requirement was specified and the sensor housing was designed — to the manufacturing/assembly domain, without the physical keying mechanism that would have made correct installation reliably achievable in the manufacturing context. The design specification transferred the orientation requirement to manufacturing with the drawing; it did not transfer the physical enforcement mechanism that would have managed the risk in that context. The manufacturing domain held the orientation risk without the physical means to control it independently of drawing compliance.

LD-1: Orientation risk displaced from design to manufacturing without physical enforcement.  
LD-2: Design engineering source appeared stable — the design was correct per the drawing.  
LD-3: Manufacturing held the orientation risk without an independent verification mechanism.

---

### 3. Structural Incongruence (SI) — SUPPLEMENTARY AND PRIMARY PREDICTION

**Prediction:** PRESENT (SUPPLEMENTARY — non-FCR per GD-006)

**Rationale note:** SI in T2-003 is simultaneously a supplementary non-FCR prediction (per GD-006) and the most structurally central finding predicted for this case. The SI is the constitutive cause of the failure: the design assumption (sensors will be installed in the orientation shown in the drawing) was structurally incongruent with the physical reality (the sensor housing allowed installation in either orientation without visual distinction). This is the cleanest SI prediction in the batch — the incongruence was directly embedded in the hardware design.

**GD-006 disclosure:** Informed by Batch 1 SI findings.

---

### 4. Fragility Accumulation (FA) — SECONDARY PREDICTION

**Prediction:** PRESENT (MEDIUM-HIGH confidence)

**Rationale:** Applying the Batch 1 FA lesson (FA should not be underestimated even for apparently concentrated failures), the manufacturing domain failure is predicted to involve multiple independently managed safety margins simultaneously below nominal:

- **Physical installation verification margin:** No physical keying reduced the installation verification margin to reliance on drawing compliance only.
- **Test coverage for entry deceleration profile:** The pre-launch testing did not include the specific entry deceleration conditions that would have revealed the backwards installation; the test coverage margin was below nominal for this scenario.
- **Design-to-manufacturing interface margin:** No formal cross-verification requirement connecting the drawing orientation specification to a physical installation control method.
- **Manufacturing inspection margin:** Visual inspection could not distinguish correct from incorrect sensor orientation; the inspection margin relied on the assumption that the sensor had a single valid installation orientation.

**FA confidence MEDIUM-HIGH:** Four elements are predicted, each independently managed; this confidence level reflects the Batch 1 lesson about not underestimating FA in apparently concentrated failure cases.

---

### 5. Cascade Precondition (CP) — SECONDARY PREDICTION

**Prediction:** PRESENT (MEDIUM confidence)

**Rationale:** Two coupled failure modes: (1) backwards sensor installation (manufacturing defect — the sensor generates no output under entry deceleration), and (2) absence of entry deceleration profile testing (test coverage gap — the defect would have been detectable under that test condition but the test was not done). These two failures are coupled such that the presence of either alone would not have caused mission failure: if the sensor had been correctly installed, the testing gap would not have mattered; if the testing had included entry deceleration, the backwards installation would have been detected. The cascade condition is the coupling between the manufacturing defect and the test coverage gap.

**Note:** A-20 governs CP coding in reconstruction.

---

### 6. Threshold Instability (TI) — LOW CONFIDENCE PREDICTION

**Prediction:** PARTIAL / LOW confidence

**Rationale:** The parachute deployment system for T2-003 operated on a binary threshold — either the G-switch triggered (correct orientation, deploying parachute) or it did not (backwards orientation, no deployment). This is less characteristic of the continuous-parameter TI structure (operating within measurement uncertainty of a design limit) than of the other cases in Batch 2. TI could be present in a specific sense: the entry deceleration profile may have been within measurement uncertainty of the G-switch's trigger threshold even for a correctly-oriented sensor, but the failure mechanism (backwards installation producing no signal rather than an off-threshold signal) is better characterized as an HCL/LD/SI finding than TI.

---

## T2-003 — A2: Predicted AP Signals

### CDA — PREDICTED PRESENT (HIGH confidence)

The primary CDA signal for T2-003: the signal that the sensor housing's orientation-neutral design required a physical keying specification — i.e., the signal that the drawing orientation requirement alone was insufficient to control manufacturing installation — originated in the manufacturing/assembly domain interface and needed to cross into the design engineering domain to trigger a physical keying requirement. This crossing did not occur: the design engineering domain produced a correct drawing without considering whether the manufacturing context could enforce the drawing's orientation requirement through physical hardware controls rather than drawing compliance alone.

A secondary CDA channel: the signal from the test planning domain (the entry deceleration profile as a required test condition) needed to cross into the formal test requirement specification. The test was not specified because the test planning domain did not receive the signal from the manufacturing/assembly domain that the sensor orientation was uncertain.

### WSP — PREDICTED PRESENT (MEDIUM confidence)

The individual design review checks, manufacturing inspection steps, and test coverage decisions each represented a signal at or below the formal threshold for triggering an additional requirement. No single check was individually far enough below nominal to trigger a formal corrective action:
- The drawing was correct — no anomaly in the drawing
- The sensor was physically installable in either orientation — each individual installation step was within normal procedure
- The test program covered functional parachute deployment testing — the specific entry deceleration scenario was one of many test scenarios not included

Each individually was within normal scope; the aggregate produced a verification gap.

### CR — PREDICTED PRESENT (MEDIUM confidence)

A potential CR candidate exists in this case: the drawing specification (correct orientation required) and the physical sensor housing design (orientation ambiguous — either installation is physically possible) constitute two signals that are in structural contradiction when considered together. The drawing says "install in this orientation"; the hardware says "either orientation is physically equivalent." If both signals were simultaneously present in a design review context, a reviewer could potentially have identified the contradiction between the drawn orientation requirement and the housing's orientation-neutral physical design. The framework predicts this contradiction was present and resolvable but was not resolved — the housing design passed design review without a physical keying requirement being added to enforce the drawing specification.

This CR candidate is medium confidence because the contradiction requires cross-domain awareness (of both the drawing requirement and the physical housing properties) to be recognizable as a contradiction, which may or may not have been within any single reviewer's scope.

---

## T2-003 — A3: Predicted Visibility Failures

**Primary:** Manufacturing-to-design boundary (CDA) — the absence of physical keying was a design decision that was not visible as a risk from within the design engineering domain alone. The design drew the correct orientation; the risk was that the hardware did not enforce this orientation. This risk was visible only from a cross-domain perspective that combined design engineering knowledge (correct orientation required) with manufacturing knowledge (housing is orientation-neutral).

**Secondary:** Test deceleration profile gap (WSP) — the entry deceleration test scenario was not included in the test matrix. This absence was one of many test scope decisions each individually within normal scope management, and no individual absence was flagged as requiring supplementary coverage.

---

## T2-003 — A4: Predicted Alternative Explanations

**AE-001 — Manufacturing error:** A technician installed the G-switch sensor backwards. Root cause (proximate): human installation error.

**AE-002 — Design deficiency:** The sensor housing should have had physical keying to prevent backwards installation. Root cause: hardware design failure to enforce orientation requirement.

**AE-003 — Testing gap:** The pre-launch testing should have included entry deceleration profile conditions that would have revealed the backwards installation. Root cause: inadequate test coverage.

**AE-004 — Quality control failure:** Pre-launch quality control inspection should have verified sensor orientation before the capsule was certified for flight. Root cause: inspection process failure.

**AE-005 — Drawing interpretation:** The drawing may not have been clear enough about the orientation requirement in the manufacturing context. Root cause: documentation clarity failure.

---

## T2-003 — A5: Prediction Confidence

| Prediction | Dimension | Confidence | Justification |
|------------|-----------|-----------|---------------|
| Hidden Common Link | EE | High | Design specification and manufacturing outcome from independent domains sharing the absent-physical-keying cause |
| Load Displacement | EE | High | Orientation risk displaced from design to manufacturing without physical enforcement |
| Fragility Accumulation | EE | Medium-High | Four independently managed margin elements predicted; Batch 1 FA lesson applied |
| Cascade Precondition | EE | Medium | Manufacturing defect coupled with test coverage gap; coupling predicts cascade |
| Threshold Instability | EE | Low | Binary activation mechanism less characteristic of TI than continuous-parameter cases |
| SI (supplementary) | EE | High (GD-006 informed) | Constitutive cause of the failure; cleanest SI prediction in the batch |
| CDA | AP | High | Manufacturing-to-design domain boundary with absent physical keying requirement is primary CDA structure |
| WSP | AP | Medium | Individual scope decisions each below formal threshold; aggregate produces coverage gap |
| CR | AP | Medium | Drawing specification vs. orientation-neutral housing — recognizable contradiction in cross-domain design review |

---

## T2-003 — A6: Falsification Conditions

**HCL falsified if:** The reconstruction finds that the connection between the drawing's orientation requirement and the housing's physical installation properties was explicitly characterized in a design review document, OR that the housing was designed with a unique installation orientation that was only removed or overlooked during manufacturing.

**LD falsified if:** The reconstruction finds that the design engineering domain included a physical keying specification or a manufacturing control requirement that would have managed the orientation risk in the manufacturing context, and this was removed or not implemented as a separate gap.

**CDA falsified if:** The reconstruction finds a formal cross-domain interface between design engineering and manufacturing that specifically required physical verification of sensor orientation against housing properties before acceptance.

**FA falsified if:** The reconstruction finds that the four margin elements predicted (physical installation verification, test coverage, design-manufacturing interface, manufacturing inspection) were each at or above their nominal levels — i.e., the failure was a single isolated gap rather than a multi-margin condition.

**CR (medium confidence) falsified if:** The reconstruction finds no design review context in which both the drawing orientation requirement and the housing's orientation-neutral physical properties were simultaneously accessible to a reviewer.

---

---

## Cross-Case Batch 2 Structural Predictions

### Batch-level prediction B2-01: Load Displacement in all three cases

**Prediction:** LD will be confirmed Present in all three Batch 2 cases.

**Rationale:** LD was present in all three Batch 1 cases. The framework predicts LD across the Batch 2 case types: multi-party organizational (T1-005), testing coverage gap / software specification (T2-002), and manufacturing/assembly defect (T2-003). LD appears to be a near-universal structural feature of engineered system failure cases where risk is transferred across an organizational or technical boundary without the information required for the receiving context to evaluate it.

**Disclosure:** This prediction is informed by the Batch 1 finding of LD in all three cases. The cross-batch CES assessment will evaluate whether B2-01 confirmation reflects framework prediction or Batch 1 knowledge.

**Falsification:** B2-01 is disconfirmed if LD is coded Absent in two or more of the three Batch 2 cases.

---

### Batch-level prediction B2-02: At least one CES ≥ MEDIUM per case

**Prediction:** Each of the three Batch 2 cases will produce at least one confirmed AP signal or EE structure that receives CES ≥ MEDIUM in Artifact C — indicating that the finding has framework-specific content not readily generated from the conventional account.

**Rationale:** Batch 2's lower contamination profile (T2-002: MEDIUM-LOW AI exposure; T2-003: MEDIUM for outcome/MEDIUM-LOW for pathway) should produce higher CES scores than Batch 1's Tier 1 cases. The manufacturing domain analysis for T2-003 and the testing coverage gap analysis for T2-002 are predicted to carry higher CES than Batch 1 findings because the conventional accounts of these cases focus on proximate causes rather than structural signal-filtering patterns.

**Falsification:** B2-02 is disconfirmed if all confirmed findings across all three cases receive CES < MEDIUM — i.e., if all confirmations are fully accounted for by the conventional account.

---

### Batch-level prediction B2-03: SI present in all three cases (supplementary)

**Prediction:** SI will be found Present in all three Batch 2 cases (SUPPLEMENTARY — non-FCR per GD-006).

**GD-006 disclosure:** This prediction is directly informed by the Batch 1 finding of SI in all three cases. It carries reduced evidential weight. Its primary value is to test whether SI is a consistently present structural feature across Batch 2 case types (multi-party organizational, software specification, manufacturing defect) or whether Batch 1's unanimous SI finding was domain-specific.

---

## Pre-Registration Lock Statement

These predictions are produced in a session that has not accessed the primary investigation documents for T1-005, T2-002, or T2-003. The Approved Sources for each case (National Commission Report; MPL Review Board Report; Genesis MIB Report) have not been accessed in this session. Predictions are generated from the EE Framework documents, M-06 v1.4, Batch 1 governance documents, and the framework's structural prediction logic.

Session boundary controls are confirmed active. The reconstruction sessions for Batch 2 cases (Artifact B) will access the Approved Sources without access to this document. The comparison sessions (Artifact C, Batch 2) will simultaneously access both this document and the Artifact B reconstructions for the first time.

This document is frozen. No prediction may be revised after this freeze declaration.

**Frozen:** 2026-05-31  
**Authorization:** M-06 v1.4 (FROZEN); Batch 1 Governance Review (G7 — CONTINUE WITH GOVERNANCE NOTES)  
**Governing failure conditions:** Artifact 0 v1.0

---

*Track A — Artifact A — Prediction Batch 2 | EE/CIS Research Governance Team | 2026-05-31*  
*FROZEN — PRD-ART — PRE-REGISTERED PREDICTIONS ONLY*
