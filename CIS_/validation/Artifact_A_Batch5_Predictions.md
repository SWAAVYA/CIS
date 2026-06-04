# Artifact A — Batch 5 Pre-Registered Predictions (Adversarial, continued)

**Artifact type:** Artifact A  
**Batch:** 5  
**Cases:** T2-009 (Therac-25), T2-010 (Herald of Free Enterprise), T2-011 (Swissair 111)  
**Status:** FROZEN  
**Date:** 2026-06-02  
**GD-007 incorporated:** Yes — SI-3 coding uses the aggregation-absent rule throughout  
**Design intent:** Three open questions from Batch 4:
- Does SI-3 hold under GD-007 when correctly applied prospectively?
- Can the framework predict CR ABSENT at HIGH confidence and survive reconstruction?
- Can it distinguish FA (present) from SI-4 (absent) when both are plausible?

**Adversarial constraint maintained:** No UNCERTAIN. Every prediction PRESENT-HIGH, PRESENT-MODERATE, or ABSENT-HIGH.

---

## M-06 Registration Note

Cases T2-009, T2-010, T2-011 require M-06 v1.6 registration before reconstruction sessions. Phase Boundary Definitions require confirmation against primary investigation documents in reconstruction session per standard APPROVED procedure.

---

## Case T2-009 — Therac-25 Radiation Therapy Accidents

**CASE-ID:** T2-009  
**Tier:** 2 | **AI Prior Exposure:** MEDIUM  
**Domain:** Medical Devices / Software Engineering / Regulatory  
**Outcome:** Between June 1985 and January 1987, the Therac-25 radiation therapy machine, manufactured by Atomic Energy of Canada Limited (AECL), delivered massive radiation overdoses to at least six patients across four geographically separate facilities in the United States and Canada. Three patients died from radiation injuries. The cause was a software race condition that, under specific operator input timing, disabled hardware safety interlocks while delivering a high-power electron beam without the required X-ray target and flattening filter.

**Phase Boundaries:**
- Pre-Decision Phase start: First documented Therac-25 overdose incident — Kennestone Regional Oncology Center, Marietta, Georgia, June 1985
- Pre-Decision Phase end: The sixth documented overdose incident, Yakima Valley Memorial Hospital, Washington, January 1987
- Decision Phase: Each site's individual investigation and disposition of incidents, through FDA/NRC intervention
- Post-Decision Phase end: AECL formal acknowledgment of software cause and mandatory corrective action, 1987

**GD-007 applied prospectively:**

Before predicting SI-3, check: was there a formal aggregation event (AD, NRC/FDA notice, cross-site investigation report) before the sixth incident?

From general domain knowledge: Each incident was investigated by AECL individually. AECL attributed the first incidents to operator error and denied software cause. No formal cross-site pattern aggregation occurred until NRC/FDA compelled it after the pattern became undeniable across multiple sites. The aggregation was absent during the Pre-Decision Phase.

**→ Aggregation absent → Code SI-3, not CR**

---

### CR — PRESENT | HIGH

Each individual overdose incident was investigated by AECL and closed by alternative explanation adoption: "operator error," "machine malfunction unrelated to software," "cause undetermined but not software." Each closure released the option: direct test of whether the software could produce the overdose. AECL did not produce, at time of individual incident investigation, a direct test demonstrating the software could not cause the observed dose level. The contradiction — the machine produced a lethal dose — was closed by explanation rather than resolution in every individual incident until regulatory intervention.

---

### SI — PRESENT | HIGH | SI-1 and SI-3

**SI-1 (Specification assumption mismatch):** The Therac-25 software assumed that the program execution sequence guaranteed hardware state — specifically, that if the software commanded a mode requiring the X-ray target, the target was physically in place. The specification embedded an assumption about hardware state based on program logic rather than direct sensor verification. The race condition violated this assumption: under specific timing, the software could be in a state where it believed the hardware configuration was correct while the hardware was not in the commanded configuration. This is SI-1: the software specification assumed a hardware behavior (deterministic response to commands within race-condition tolerances) that the hardware did not guarantee.

**SI-3 (Temporal accumulation, GD-007 confirmed applicable):** Six incidents across four independent facilities from June 1985 to January 1987. Each individually investigated. No cross-site formal pattern aggregation occurred during this period. AECL's investigation process treated each incident as isolated. The aggregate pattern — the same machine producing overdoses at multiple independent sites — was not entered into a formal cross-site analytical process until regulatory intervention. GD-007 check: no formal recognition event (AD, NRC directive, cross-site investigation report) occurred before the sixth incident. Aggregation was absent. → SI-3 PRESENT.

---

### HCL — PRESENT | HIGH

This is the primary adversarial prediction for this case. The prediction is PRESENT HIGH on HCL despite the case appearing, at first examination, to be primarily a WSP/CR case.

Four geographically independent facilities — Kennestone Regional Oncology Center (Georgia), Hamilton Oncology Clinic (Ontario), East Texas Cancer Center (Tyler, Texas), Yakima Valley Memorial Hospital (Washington) — each held a signal: "the Therac-25 delivered an overdose to a patient." The facilities were organizationally independent — different institutions, different jurisdictions (US and Canada), different regulatory contexts. No formal mechanism existed to connect their signals.

The shared structural source: the Therac-25 software race condition, invisible from within any single facility's investigation. Each facility investigated its own incident, attributed it to local factors or operator error, and received AECL's explanation. No single facility had access to the other facilities' incidents. The hidden common link was the software defect that was simultaneously producing identical signals (overdose) across independent organizational domains.

**Independence assessment:** The four facilities are structurally independent. They do not share organizational governance, regulatory oversight, or operational information exchange. Their signals were not semantically identical (different machine configurations, different patient profiles, different dose levels) but were structurally identical (same mismatch type: machine delivered dose inconsistent with commanded mode). The temporal pattern and mismatch dimension are consistent across all four facilities.

**Why HCL is PRESENT HIGH:** A cross-facility synthesis — asking "do all these Therac-25 incidents share a common structural source?" — would have identified the software defect. This synthesis was not performed until regulatory pressure forced it. The observation requiring synthesis across independent domains never formed within any single domain's investigation. This is the HCL condition.

**Falsification condition:** HCL fails if reconstruction shows the incidents were not organizationally independent — i.e., if a shared reporting or investigation mechanism existed that was failed rather than absent.

---

### WSP — PRESENT | HIGH

Six individually sub-threshold incidents, each attributed to a local cause, not aggregated into a pattern assessment. The aggregate pattern — same machine, multiple sites, similar injury mechanism — would have constituted a threshold-crossing signal if assessed. No aggregation mechanism existed to form the assessment. WSP is present alongside SI-3. Note the distinction: WSP codes the governance failure (no aggregation mechanism). SI-3 codes the structural observation property (pattern accumulating without aggregation).

---

### CDA — PRESENT | HIGH

Each facility's incident information existed in that facility's records and AECL's investigation files. The information from Facility A did not formally cross to Facility B or to the regulatory context in a form that could generate pattern recognition. The structural condition at each incident: "is there information from other facilities about this machine type that should be admitted to this investigation?" This cross-domain admission did not occur. CDA is present alongside HCL — HCL identifies the shared-cause condition; CDA identifies the specific admission pathway gap.

---

### LD — PRESENT | MODERATE

AECL marketed the Therac-25 as requiring no hardware interlocks because the software was adequate for safety — a claim that displaced the safety assurance function from hardware (verifiable) to software (unverifiable under the race condition). Facilities that purchased the Therac-25 accepted the software-only safety claim without independent verification capacity. The risk that software-only safety was inadequate was displaced from AECL (where it could have been tested) to the clinical facilities (where they had no capacity to independently verify software safety).

---

### FA — ABSENT | HIGH

The Therac-25 failure is not characterized by multiple independently managed safety margins simultaneously degraded. The failure is a single software defect that bypassed the safety architecture. The safety architecture itself was the problem — hardware interlocks had been removed — rather than multiple margins being simultaneously degraded.

---

### Conventional Explanation Score Prediction: LOW-MEDIUM (0.30–0.45)

The conventional account: "software bug killed patients; AECL covered it up." The EE/CIS structural account adds: HCL (cross-facility shared-cause not synthesized), SI-3 (pattern not formally aggregated), CDA (cross-facility information not admitted), SI-1 (software specification assumed hardware determinism). The structural account explains why the software bug persisted across six incidents without correction — the governance structure (HCL invisible, SI-3 absent, CDA not operative) prevented the pattern from surfacing.

---

## Case T2-010 — Herald of Free Enterprise

**CASE-ID:** T2-010  
**Tier:** 2 | **AI Prior Exposure:** MEDIUM-LOW  
**Domain:** Maritime / Organizational Safety  
**Outcome:** On March 6, 1987, the roll-on/roll-off ferry Herald of Free Enterprise capsized approximately 1km outside the port of Zeebrugge, Belgium, with its bow doors open. 193 passengers and crew were killed. The proximate cause was departure with unsecured bow doors; the systematic cause was a corporate safety culture and management structure that had denied multiple requests for bow door indicator lights on the bridge.

**Phase Boundaries:**
- Pre-Decision Phase start: First documented master's request for bow door indicator light on the bridge — approximately 1984–1985
- Pre-Decision Phase end: Herald of Free Enterprise departure from Zeebrugge, March 6, 1987, approximately 18:05 local time
- Decision Phase: Captain's decision to proceed to sea following departure from berth, without bow door closure confirmation
- Post-Decision Phase end: Herald of Free Enterprise capsizes, approximately 18:28 local time

**Key adversarial prediction:** SI-4 is predicted ABSENT HIGH despite FA being predicted PRESENT HIGH. This tests whether the framework correctly distinguishes multi-margin degradation (FA) from multi-dimensional signal incongruence (SI-4).

---

### CR — PRESENT | HIGH

The captain departed in the absence of confirmation that the bow doors were closed. The operating assumption — "if no one reports open doors, the doors are closed" — is a closure of the contradiction implicit in the uncertainty: "the bow doors may not be closed." The closure mechanism is assumption-of-compliance: the responsible party (assistant bosun) was assumed to have performed his duty because no one reported otherwise. No direct confirmation was sought or obtained. Options Released: confirmation that the bow doors were closed before departure.

This is CR at the operational level. The contradiction — possible open bow doors — was resolved by default assumption rather than by direct verification. The assistant bosun had in fact fallen asleep in his cabin.

---

### CDA — PRESENT | HIGH

The state of the bow doors (open) existed as a physical fact and was theoretically observable, but no information about the bow door state crossed to the bridge in any form. There was no indicator light (multiple requests for such lights had been denied by management). No crew member on the vehicle deck observed the open doors and reported to the bridge before departure. The structural condition: bow door state information existed in the physical environment and was not admitted to the bridge decision context through any channel. This is the primary CDA event.

---

### FA — PRESENT | HIGH

Multiple simultaneously degraded safety conditions at departure: (1) assistant bosun absent from post (fell asleep — the specific person responsible for closing bow doors was not present); (2) deck officer left the vehicle deck without confirming bow door closure; (3) no bridge indicator showing bow door status (management had denied the request); (4) no formal positive confirmation requirement before departure; (5) culture of "if in doubt, sail" documented by the Sheen inquiry. No single condition causes the capsizing; the co-occurrence of all five created the vulnerability.

---

### SI-4 — ABSENT | HIGH

**This is the primary adversarial prediction.** SI-4 is predicted ABSENT despite FA being PRESENT at HIGH.

The distinction: FA requires multiple simultaneously degraded safety margins. SI-4 requires a signal environment where multiple dimensions simultaneously produce readings inconsistent with any classified state.

Herald of Free Enterprise fails the SI-4 condition: at the bridge, there were effectively NO signals about bow door status. There was no indicator light (denied by management). No crew member reported. The bridge signal environment was not multi-dimensionally incongruent — it was simply absent. The captain had no signals pointing in incompatible directions; he had no signals at all about bow door state.

SI-4 would be present if, for example, multiple instruments simultaneously provided conflicting information about the ship's status — some indicating safe departure, others indicating unsafe. The Herald case is not this. It is a CDA case (information absent from the decision context) that created conditions for a CR event (departure on assumption). FA is present because multiple organizational conditions were simultaneously degraded. SI-4 is not present because the signal environment at the bridge was absent, not incongruent.

**Falsification condition:** SI-4 would be confirmed if the reconstruction shows that the bridge DID have multiple signals pointing in inconsistent directions about departure readiness — not just absent signals. If there were positive indicators suggesting "ready to depart" simultaneously with other signals suggesting "not ready to depart," SI-4 would be present.

---

### SI — PRESENT | MODERATE | SI-1

The standing operating procedure implicitly assumed that the responsible crew member (assistant bosun) would close the bow doors when instructed and would report if he had not. This assumption about crew behavior was embedded in the departure procedure specification. The actual crew state (bosun asleep, not having closed the doors) was structurally incongruent with the procedure's assumption. SI-1 at MODERATE — the specification assumption about adjacent system state (crew reliability) was violated.

---

### WSP — PRESENT | MODERATE

The Sheen inquiry documented that multiple requests from masters for bow door indicator lights had been made and denied over several years. Each request was a sub-threshold safety signal — individually treated as a management preference item, not as a safety-critical requirement. The aggregate pattern of requests, representing masters' direct operational experience with bow door uncertainty, was not formally assessed as a cumulative safety concern. WSP at MODERATE — the pattern exists but is less fully documented than Therac-25's multi-incident pattern.

---

### HCL — ABSENT | HIGH

The Herald failure is contained within a single organizational structure (Townsend Thoresen / P&O). The assistant bosun's failure, the deck officer's failure, and management's indicator denial are not signals from structurally independent domains sharing a hidden common source — they are failures within a single organizational chain. HCL is absent.

---

### LD — PRESENT | MODERATE

Management's denial of bow door indicator lights displaced the bow door verification responsibility from a structural mechanism (indicator light visible from bridge) to individual crew reliability (bosun must close and report). The receiving context — individual crew members under operational pressure — had less evaluation capacity than a structural indicator. The risk of bow door uncertainty was transferred from an architectural solution (indicator) to a human reliability assumption.

---

### Conventional Explanation Score Prediction: MEDIUM (0.45–0.55)

The Sheen inquiry explicitly named management failure and safety culture as causative factors. The conventional account is partially structural ("management denied safety requests; this is a systemic failure"). The EE/CIS account adds CDA (bow door state never admitted to bridge) and the specific FA structure (five simultaneously degraded conditions). CES is medium — the inquiry already did much of the structural analysis.

---

## Case T2-011 — Swissair Flight 111

**CASE-ID:** T2-011  
**Tier:** 2 | **AI Prior Exposure:** MEDIUM-LOW  
**Domain:** Aviation / Flammability Certification / Maintenance  
**Outcome:** On September 2, 1998, Swissair Flight 111, an MD-11 operating from New York to Geneva, declared an emergency due to smoke in the cockpit over the Atlantic Ocean south of Nova Scotia and crashed into the sea near Peggy's Cove, killing all 229 aboard. The Swiss Transportation Safety Board investigation determined the cause was an in-flight fire ignited by the entertainment wiring system (IFE — In-Flight Entertainment) that used a polyethylene-based material (MPET — Metallized Polyethylene Terephthalate) not properly certified for in-flight flammability in that location.

**Phase Boundaries:**
- Pre-Decision Phase start: IFE system installation and certification approval — approximately 1995–1997 (when the modified IFE system was approved for installation on MD-11 aircraft)
- Pre-Decision Phase end: SR111 departure from New York JFK, September 2, 1998, 20:18 EDT
- Decision Phase: Crew smoke detection through emergency declaration, approximately 01:10–01:14 UTC September 3
- Post-Decision Phase end: Ocean impact, September 3, 1998, approximately 01:31 UTC

**Primary adversarial prediction: CR ABSENT HIGH**

This is the most adversarial prediction in Batch 5. CR is predicted absent — meaning the reconstruction must find NO documented case in the pre-decision period where a contradicting signal about IFE flammability was raised and closed without direct disconfirmation. If any such signal is found, CR is present and the prediction fails.

---

### CR — ABSENT | HIGH

**Primary adversarial prediction.**

CR requires: an anomalous signal contradicting the accepted state, present in the investigation record, closed by alternative explanation rather than direct disconfirmation.

The IFE flammability failure is a certification gap (SI-1) and a risk transfer failure (LD). It is not, based on pre-decision phase evidence available from general domain knowledge, a case where a specific concern about IFE wiring flammability was raised during the pre-decision phase and closed without resolution. The MPET material was approved through the certification process with an assumption about its flammability that was incorrect — but this was a systematic certification failure, not a documented contradiction closed by organizational pressure.

**Falsification condition:** CR is present if the reconstruction finds evidence of a prior safety concern about MPET or IFE wiring flammability that was formally raised, reviewed, and closed as acceptable without direct flammability testing under the relevant installation conditions. If such a contradiction exists in the investigation record, CR is PRESENT and this prediction fails.

This prediction is the program's second HIGH-confidence prediction of ABSENT on a primary construct. It directly tests discriminant validity: the framework must not code CR simply because a complex organizational failure occurred.

---

### SI — PRESENT | HIGH | SI-1

The IFE system certification approved MPET-backed wiring for use in the overhead area of the MD-11 cabin. The certification process embedded an assumption about MPET's flammability behavior under the thermal conditions of the MD-11's overhead area during continuous operation. The material was not properly characterized for its in-situ flammability properties in the relevant installation configuration — the MPET-backed wiring, when heated by adjacent electrical equipment in an enclosed overhead space, behaved differently than the certification assumed. The specification's assumption about material flammability in the installation environment was structurally incongruent with the material's actual behavior. SI-1 PRESENT HIGH.

---

### LD — PRESENT | HIGH

The IFE system was a third-party modification to the MD-11. The approval and installation process displaced the risk of in-flight flammability from the certification domain (where it could have been characterized through fire testing of the installed configuration) to the operational phase (where no mitigation was available once an in-flight fire started). The operators (Swissair) and crews had no capacity to independently evaluate or mitigate IFE wiring flammability once airborne. The technology risk was transferred from the certification/modification phase to operations without adequate validation of the risk under operational conditions.

---

### WSP — ABSENT | HIGH

From general domain knowledge, there is no documented pattern of individually sub-threshold IFE wiring incidents across the fleet that accumulated before SR111 without pattern aggregation. The failure mechanism (MPET flammability under in-situ thermal conditions) was not producing observable sub-threshold signals that were being individually managed. The failure was latent — not generating observable signals — until the in-flight fire.

---

### HCL — ABSENT | HIGH

The SR111 failure is contained within a single aircraft and a single certification/modification chain. It does not exhibit independent-domain parallel signal structure. ABSENT HIGH.

---

### CDA — PRESENT | MODERATE

The flammability characterization information — specifically, that MPET behaves differently in the in-situ overhead installation than under standard flammability test conditions — existed in the materials science and certification testing domain but was not admitted into the MD-11 IFE modification approval decision. The specific combination (material + installation geometry + thermal environment) was not represented in the certification testing. MODERATE rather than HIGH because the admission gap is at the certification testing scope level rather than a clear cross-organizational boundary failure.

---

### FA — PRESENT | MODERATE

Multiple simultaneously degraded conditions during the SR111 emergency: in-flight fire in inaccessible overhead area; night over ocean (no immediate diversion option close); cockpit environment degrading (smoke and eventually electrical failures); crew focusing on checklist execution during rapid deterioration. Multiple conditions simultaneously reduced the crew's options and time available. MODERATE — not the primary failure mode but a contributing factor to the outcome severity.

---

### SI-4 — ABSENT | HIGH

During the emergency, the cockpit signal environment was not multi-dimensionally incongruent in the SI-4 sense. The signals were consistent: smoke = fire = emergency. The crew correctly identified and responded to the emergency. The failure was that the fire progressed faster than the emergency could be resolved — a consequence of the underlying LD/SI-1 failure, not a multi-dimensional signal incongruence.

---

### Conventional Explanation Score Prediction: MEDIUM-LOW (0.30–0.45)

The conventional account: "faulty wiring caused the fire; the plane crashed before they could land." The EE/CIS structural account adds: SI-1 (certification assumption about MPET flammability), LD (modification risk transferred to operations without characterization), CDA (material flammability properties in installation configuration not admitted to certification decision). The structural account explains why the wiring was installed — the governance mechanisms that should have identified the flammability risk before installation did not. The conventional account explains what happened; the EE/CIS account explains why the condition was allowed to exist.

---

## Batch 5 Prediction Summary

| Case | CR | WSP | SI | HCL | CDA | LD | FA | SI-4 |
|------|----|----|----|----|-----|----|----|------|
| T2-009 | PRESENT HIGH | PRESENT HIGH | PRESENT HIGH (SI-1+SI-3) | PRESENT HIGH | PRESENT HIGH | PRESENT MOD | ABSENT HIGH | — |
| T2-010 | PRESENT HIGH | PRESENT MOD | PRESENT MOD (SI-1) | ABSENT HIGH | PRESENT HIGH | PRESENT MOD | PRESENT HIGH | ABSENT HIGH |
| T2-011 | **ABSENT HIGH** | ABSENT HIGH | PRESENT HIGH (SI-1) | ABSENT HIGH | PRESENT MOD | PRESENT HIGH | PRESENT MOD | ABSENT HIGH |

**Design notes:**
- T2-009: First case with HCL, SI-3, WSP, and CDA all predicted PRESENT simultaneously. Tests whether multi-construct co-presence is reliably coded.
- T2-010: FA PRESENT HIGH alongside SI-4 ABSENT HIGH. Tests discriminant validity between the two constructs.
- T2-011: CR ABSENT HIGH. Second instance of predicting ABSENT on a primary construct. Most adversarial prediction in Batch 5.
- GD-007 incorporated in T2-009 SI-3 prediction: aggregation absent confirmed before coding.

---

*Artifact A — Batch 5 Pre-Registered Predictions | FROZEN | 2026-06-02*  
*GD-007 applied. Zero UNCERTAIN predictions. Three distinct discriminant validity tests.*
