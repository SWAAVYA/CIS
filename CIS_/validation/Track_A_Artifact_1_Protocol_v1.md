# Track A — Artifact 1
# Track A Protocol v1

**Status:** FROZEN after Artifact 0 is complete  
**Purpose:** Define the repeatable methodology for all Track A case analyses  
**Dependency:** Artifact 0 must exist and be frozen before this document is finalized  
**Date:** 2026

---

## Section 1 — Case Selection Rules

Cases are selected before any reconstruction work begins. The selection criteria are applied to produce the case pool. Individual case assignment to Tier is recorded in the case registry before analysis begins.

---

### Tier 1 — Canonical Cases

**Selection criteria:**

The case is widely known in the relevant domain and in general public discourse. The case has been analyzed in multiple independent public accounts. The case outcome is not contested. A formal investigation report exists from an independent body (government commission, independent review board, regulatory authority).

**Purpose in the program:** Method development and coding protocol calibration. Tier 1 cases are used to develop and refine the coding procedures because the evidence is well-documented and the outcome is unambiguous. Findings from Tier 1 cases carry reduced evidential weight for framework evaluation because prior training exposure is highest.

**Known Tier 1 cases for the space domain:**

- Challenger (STS-51-L, 1986)
- Columbia (STS-107, 2003)
- Mars Climate Orbiter (MCO, 1999)
- Ariane 5 Flight 501 (1996)

**Tier 1 finding weight:** Tier 1 confirmations contribute to qualitative understanding and coding calibration. They are excluded from the primary confirmation rate calculation used for framework evaluation. They are included in the inter-rater agreement calculation.

---

### Tier 2 — Moderately Known Cases

**Selection criteria:**

The case is known within the relevant technical community but has not achieved the level of public narrative saturation of Tier 1 cases. A formal investigation record exists but may be less comprehensive than Tier 1. The outcome is known and not contested. The signal-filtering pathway is documented but is not part of the standard public account of the case.

**Purpose in the program:** Framework stress testing. Tier 2 cases are used to test whether the framework generates specific predictions in cases where the narrative is less saturated and prior training exposure is lower.

**Candidate Tier 2 cases for the space domain:**

- Beagle 2 (ESA Mars lander, 2003)
- Genesis Probe (sample return crash, 2004)
- Mars Polar Lander (MPL, 1999)
- Cluster I launch failure (Ariane 5 Flight 501 payload — distinct from launch vehicle analysis)
- NOAA-19 satellite assembly incident (2009)
- Mars Observer (communications loss, 1993)

**Tier 2 finding weight:** Tier 2 confirmations are included in the primary confirmation rate calculation. They carry standard evidential weight.

---

### Tier 3 — Low Narrative Saturation Cases

**Selection criteria:**

The case outcome is known and confirmed by independent sources. The signal-filtering pathway is poorly documented in public accounts — the case is not part of the standard aerospace folklore. The primary source documentary record exists and is accessible. The case has not been used as an illustrative example in EE/CIS framework development.

**Purpose in the program:** Highest evidential weight cases. Tier 3 cases provide the clearest test of whether the framework generates predictions that go beyond what is already known from the conventional account.

**Tier 3 case identification procedure:** Tier 3 cases cannot be pre-listed without compromising the selection criteria. They are identified through systematic review of aerospace incident databases (NASA NTRS, ESA technical reports, AIAA incident records) by searching for cases that meet the three criteria above. The identification process is documented in the case registry.

**Tier 3 finding weight:** Tier 3 confirmations carry the highest evidential weight. A confirmation rate of ≥ 0.60 on Tier 3 cases alone, with CES ≥ 0.50, would constitute the strongest available evidence for framework applicability.

---

### Case Registry

Before any analysis begins, a case registry is produced listing:

- Case name
- Tier assignment
- Primary source documents identified
- Ground truth statement (what the confirmed outcome is)
- Rationale for tier assignment

The case registry is frozen before prediction generation begins.

---

## Section 2 — Artifact Structure

Each case produces exactly three artifacts, in the following order. No artifact may be produced out of sequence.

---

### Artifact A — Pre-Registered Predictions

**Produced in:** The prediction session (see Section 5).

**Contents:** The completed prediction template (Artifact 3) for the case. Named EE structures, named AP classifications, named alternative explanations, phase assignments, confidence ratings, and rationale.

**Frozen when:** At the end of the prediction session, before any reconstruction work begins.

**May be modified:** Never. Artifact A is immutable once frozen.

**Format requirement:** The frozen Artifact A includes a session timestamp at the point of freezing.

---

### Artifact B — Case Reconstruction

**Produced in:** The reconstruction session (see Section 6).

**Contents:** The structured case reconstruction including timeline, signal inventory, filtering event inventory, EE structure coding, AP classification coding, and decision point analysis.

**Produced without access to:** Artifact A. The prediction document must not be in the context window during reconstruction.

**Frozen when:** At the end of the reconstruction session.

**May be modified:** Never. Artifact B is immutable once frozen.

---

### Artifact C — Comparison Report

**Produced in:** The comparison session (see Section 7).

**Contents:** Side-by-side comparison of Artifact A predictions against Artifact B findings. Confirmation, partial confirmation, and absence determinations for each prediction. Unexpected structure inventory. IRA calculation. CES assessment. Qualitative findings.

**Produced with access to:** Both Artifact A and Artifact B simultaneously for the first time.

**Frozen when:** At the end of the comparison session.

---

## Section 3 — Information Boundary Rules

The information boundaries are the primary methodological control. Violations of these boundaries invalidate the case analysis.

---

### Rule IB-1: Prediction-Reconstruction Boundary

Artifact A (predictions) must not be present in the context window or available to the analyst during Artifact B (reconstruction) production. This applies to both human and AI components of the analysis.

**In AI-assisted sessions:** The session producing Artifact B begins without Artifact A in the context. Artifact A exists as a frozen document but is not loaded into the session context.

**Verification:** Artifact B must contain no references to specific predictions from Artifact A. If Artifact B references a specific predicted structure before that structure has been independently identified in the reconstruction, a boundary violation has occurred. The case is flagged and removed from the primary confirmation rate calculation.

---

### Rule IB-2: Reconstruction-First Principle

The full Artifact B reconstruction must be complete before Artifact C comparison begins. No comparison work may be done while reconstruction is ongoing.

---

### Rule IB-3: Cross-Case Contamination Control

Artifact A predictions for Case N+1 may not be generated after Artifact B for Case N is complete. The prediction session for subsequent cases must occur before any reconstruction sessions, or the case registry must be followed strictly: all Artifact A documents are produced in a single prediction session before any reconstruction work begins.

**Preferred procedure:** All Artifact A documents for all cases in a batch are produced in a single session. Reconstruction sessions for individual cases follow in sequence.

---

### Rule IB-4: Boundary Violation Recording

Any boundary violation is recorded in the case's Artifact C. The violation does not require stopping the analysis, but the affected case is excluded from the confirmation rate calculation and the violation is reported in the cross-case findings.

---

## Section 4 — Coding Procedures

The following procedures apply to every case reconstruction (Artifact B).

---

### 4.1 Timeline Segmentation

The case timeline is divided into three phases before any coding begins:

**Pre-Decision Phase:** The period from the earliest available documentary record to the point at which the decision or action that led to the failure was made. For Challenger, this ends at the moment the launch decision was finalized.

**Decision Phase:** The decision event itself — the meeting, the review, the authorization. For some cases this is a single event; for others it is a process spanning days.

**Post-Decision Phase:** From the decision to the outcome. This phase is included to capture signals that emerged after the key decision but before the failure became apparent.

Phase boundaries are defined in the prediction template for each case before reconstruction begins.

---

### 4.2 Signal Identification

A signal is any piece of information that was present in the documented evidence environment and that was potentially relevant to the structural outcome.

**Operational definition of "present in the evidence environment":** The information existed in a form that could have been accessed by at least one person involved in the decision process at the time it was relevant. This includes: written reports, test data, verbal communications recorded in minutes, engineering analyses, and anomaly reports. It excludes information that was generated after the decision phase.

**Coding procedure for signals:**

Step 1: Read the primary source document section by section.

Step 2: For each piece of information encountered, record: what the information is, what primary source it comes from, what phase of the timeline it belongs to.

Step 3: Assign a preliminary significance rating: High (directly relevant to structural outcome), Medium (potentially relevant), Low (context only).

Step 4: Record all High and Medium signals in the signal inventory. Low signals are not coded individually but are noted in aggregate.

---

### 4.3 Signal Classification

Each High and Medium signal is classified by AP category:

**WSP-candidate:** The signal is individually below the significance threshold that would trigger formal action or escalation under the institutional admissibility standards in place at the time. It requires aggregation with other signals to become structurally significant.

**CDA-candidate:** The signal originates from a domain different from the primary analytical domain of the decision-making group. A signal from the engineering subsystem would be CDA-candidate in a management decision context.

**CR-candidate:** The signal is in direct structural contradiction with another signal in the evidence environment. Both signals were available; they cannot both be fully correct under a single simple interpretation.

**Not AP-classifiable:** The signal is individually significant under standard admissibility criteria, originates within the primary domain, and is not in structural contradiction with other signals.

**Multiple classification:** A signal may receive multiple AP classifications. A weak signal that is also cross-domain is classified as both WSP-candidate and CDA-candidate.

---

### 4.4 Filtering Event Identification

A filtering event is a documented instance in which a signal failed to enter the decision process in a way that influenced the outcome.

**Operational definition:** A filtering event has occurred when: (a) a signal is confirmed present in the evidence environment (per 4.2), and (b) the signal does not appear in the final decision rationale, or appears but is explicitly discounted, or is present in lower levels of the organization but does not reach decision-makers.

**Filtering event types:**

F-1 Individual filtering: A single person encountered the signal and did not escalate it.

F-2 Institutional filtering: The signal was present in the evidence environment but the institutional reporting structure did not provide a pathway for it to reach the relevant decision-maker.

F-3 Aggregation failure: The signal was available alongside other signals that together constituted a significant structural pattern, but no mechanism existed for combining them.

F-4 Model exclusion: The signal was inconsistent with the prevailing model and was discounted on those grounds.

F-5 Authority asymmetry: The signal was present and raised, but the person raising it lacked sufficient institutional authority for the signal to affect the decision.

---

### 4.5 EE Structure Identification

EE structures are identified in the reconstruction using the following operational definitions. These are the structures available for prediction and coding. No new structures may be added during reconstruction.

**Fragility Accumulation:** Multiple independent components, processes, or margins are simultaneously degraded below their designed tolerance. No single degradation is individually disqualifying. The aggregate degradation exceeds the system's resilience to perturbation.

*Coding rule:* Code as present if the documentary record identifies at least three independent degraded margins operating simultaneously in the pre-decision phase. All three must be identifiable from primary sources.

**Threshold Instability:** A system is operating near a threshold at which a small perturbation produces a qualitatively different outcome. The proximity to threshold is documentable from available data.

*Coding rule:* Code as present if the documentary record shows that at least one critical parameter was within measurement uncertainty of its design limit during the decision phase.

**Load Displacement:** Structural load (risk, cost, pressure) that should be absorbed by one component or level of the system is documented as being transferred to another component or level, producing apparent stability in the first while accumulating stress in the second.

*Coding rule:* Code as present if the documentary record shows a decision in which a risk that was identified at one level was not acted upon there and the consequence was transferred to a different component, time period, or group.

**Cascade Precondition:** A structural configuration exists in which a failure in one component would predictably amplify rather than absorb perturbation, producing progressive failure across coupled components.

*Coding rule:* Code as present if the documentary record shows documented coupling between two or more failure modes such that the failure of one would predictably affect the probability of the other, and this coupling was not reflected in the decision analysis.

**Hidden Common Link:** Two or more apparently independent signals share a common structural cause that was not identified in the decision process.

*Coding rule:* Code as present if the retrospective investigation identified a single root cause that produced multiple independently reported anomalies that were treated as unrelated during the decision phase.

---

### 4.6 Alternative Explanation Coding

For each confirmed or partially confirmed EE structure finding, the reconstruction records the conventional domain explanation that accounts for the same evidence.

**Coding procedure:** State, in one sentence, what an informed domain expert with no EE framework knowledge would say about the same evidence. This is used in Artifact C for the Conventional Explanation Score calculation.

---

## Section 5 — Prediction Session Procedure

The prediction session produces all Artifact A documents for a case batch.

**Session start conditions:** The case registry is complete and frozen. No reconstruction work has been done for any case in the batch. The prediction template (Artifact 3) is available.

**Session procedure:**

Step 1: Review the case registry entry for the case. Do not open primary source documents.

Step 2: Complete the prediction template based on framework knowledge and domain knowledge.

Step 3: Assign confidence ratings (Low / Medium / High) to each prediction.

Step 4: Record the rationale for each prediction in two sentences or fewer.

Step 5: Freeze the Artifact A document with a session timestamp.

Step 6: Repeat for the next case in the batch before beginning reconstruction.

**Session end condition:** All Artifact A documents in the batch are frozen.

---

## Section 6 — Reconstruction Session Procedure

The reconstruction session produces Artifact B for a single case.

**Session start conditions:** Artifact A for this case is frozen and will not be accessed during this session. Primary source documents are available.

**Session procedure:**

Step 1: Establish the timeline and phase boundaries from the primary sources.

Step 2: Conduct signal identification (Section 4.2) across all available primary source documents.

Step 3: Classify each High and Medium signal (Section 4.3).

Step 4: Identify filtering events (Section 4.4).

Step 5: Code EE structures (Section 4.5).

Step 6: Record alternative explanations for each coded structure (Section 4.6).

Step 7: Record all unexpected structures as exploratory findings.

Step 8: Freeze Artifact B with a session timestamp.

**Session end condition:** Artifact B is frozen. Artifact A is not accessed during this session. If Artifact A is encountered accidentally (e.g., referenced in another document), the encounter is recorded and the affected prediction is flagged.

---

## Section 7 — Comparison Session Procedure

The comparison session produces Artifact C for a single case.

**Session start conditions:** Both Artifact A and Artifact B are frozen. This is the first session in which both are simultaneously available.

**Session procedure:**

Step 1: For each prediction in Artifact A, locate the corresponding finding (or absence of finding) in Artifact B.

Step 2: Assign confirmation status: Confirmed / Partial / Absent / Evidence-Limited.

Step 3: Record the primary source evidence supporting each determination.

Step 4: Calculate IRA for this case using the signal classification dimension.

Step 5: Calculate CES for each confirmed prediction.

Step 6: Record unexpected structures from Artifact B.

Step 7: Record qualitative findings — patterns, anomalies, methodology observations.

Step 8: Freeze Artifact C with a session timestamp.

---

## Section 8 — Cross-Case Analysis Procedure

After every five cases are complete (Artifacts A, B, C all frozen):

Calculate confirmation rate across the batch.

Calculate absence rate.

Calculate USR.

Calculate average IRA.

Apply failure threshold checks (Artifact 0, Section C).

Record findings in a batch summary document.

Determine whether to continue, revise, or terminate per Artifact 0 Section D.

---

*Artifact 1 — Frozen after Artifact 0 is complete and before prediction generation begins.*
