# Artifact B — Case Reconstruction: T1-001 Space Shuttle Challenger

**Artifact type:** Artifact B (Case Reconstruction)  
**Case:** T1-001 — Space Shuttle Challenger (STS-51-L)  
**Tier:** 1 | **AI Prior Exposure:** HIGH  
**Status:** FROZEN  
**Date:** 2026-06-02  
**Sources accessed:** Rogers Commission Report Vol. I; Rogers Commission Report Vol. II (Appendices)  
**Artifact A:** SEALED — not accessed during reconstruction  
**Phase Boundaries:** Per M-06 v1.5

---

## Phase Boundary Confirmation

**Pre-Decision Phase start:** First documented O-ring erosion — STS-2, November 1981. Rogers Commission Vol. I documents the STS-2 O-ring erosion as the first anomaly in the program record.

**Pre-Decision Phase end:** Commencement of January 27, 1986 teleconference between NASA Marshall Space Flight Center and Morton Thiokol. This is the event that separates the pre-decision signal environment from the active launch decision process.

**Decision Phase:** January 27–28, 1986 — the teleconference proceedings, Thiokol management vote, Kilminster signature, and launch authorization. Ends with launch commit.

**Post-Decision Phase end:** Breakup of Challenger, January 28, 1986, T+73 seconds.

All boundaries confirmed as named events in Rogers Commission Report Vol. I.

---

## Signal Inventory

### Pre-Decision Phase Signals

---

**Signal PRE-001**  
**Description:** STS-2 (November 1981) — primary O-ring erosion observed on right SRB nozzle field joint. First recorded O-ring anomaly in Shuttle program history.  
**Value status:** Below threshold — documented, assessed as acceptable, program continued.  
**Construct coding:**
- WSP: PRESENT (sub-threshold signal 1 of accumulating pattern)
- CR: ABSENT (no formal contradiction raised and closed at this stage)
- SI: WEAK (below the level where specification-reality mismatch was formally articulated)

---

**Signal PRE-002**  
**Description:** STS-41-B, STS-41-C, STS-51-B (1984–1985) — additional O-ring erosion events. STS-51-B (April 1985) produced the most severe erosion observed to that point. Engineers within Thiokol noted the pattern.  
**Value status:** Each individually assessed as within acceptable parameters. STS-51-B erosion was more severe but program continued.  
**Construct coding:**
- WSP: PRESENT (sub-threshold signals 2–4; pattern developing but not formally aggregated)
- CR: ABSENT at this stage

---

**Signal PRE-003**  
**Description:** July 31, 1985 — Roger Boisjoly internal memorandum to Thiokol Vice President R.K. Lund. Subject: SRM O-Ring Erosion/Potential Failure Criticality. Text warns: "the result would be a catastrophe of the highest order — loss of human life." Requests assignment of a task force with authority and resources to solve the O-ring problem.  
**Value status:** ABOVE threshold within Thiokol engineering domain — explicit written warning of catastrophic failure potential.  
**Construct coding:**
- CR: PRESENT — this signal directly contradicts the implicit ground truth that the program is safe to continue on its current trajectory. The signal is anomalous and explicit.
- WSP: PRESENT — the memo explicitly references the accumulating erosion pattern as the basis for concern

---

**Signal PRE-004**  
**Description:** August 1985 — Thiokol management response to Boisjoly memo. A seal team task force is formed. The task force lacks resources and schedule authority. The launch schedule is not affected. The task force meetings are later described as "non-productive" and lacking management commitment.  
**Value status:** Within normal parameters from organizational standpoint — a response was made.  
**Construct coding:**
- CR: PRESENT — this is the first closure event. The contradiction (Boisjoly's warning) is closed by alternative explanation adoption: "we have formed a task force, the problem is being managed." No direct disconfirmation of Boisjoly's concern is produced — no cold-temperature testing, no design change, no launch constraint.
- Options Released: The possibility that the seals were inadequate for continued flight was released without resolution.

---

**Signal PRE-005**  
**Description:** STS-51-C (January 1985) — flown at 53°F, the coldest launch temperature to that date. Significant O-ring erosion and blow-by observed. Thiokol engineers noted the temperature correlation after this flight. This flight became a key data point in pre-STS-51-L temperature analysis.  
**Value status:** Accepted as in-family but noted as temperature-correlated by engineers.  
**Construct coding:**
- WSP: PRESENT (critical data point in temperature-erosion pattern)
- SI: PRESENT — this flight provides the empirical basis for the specification-temperature mismatch. At 53°F, significant erosion occurred. At 29°F (forecast for STS-51-L), the specification's implicit temperature assumption is violated beyond even the most anomalous prior data point.

---

**Signal PRE-006**  
**Description:** October 1985 — Boisjoly attempts to escalate O-ring concerns through NASA channels. The concerns are acknowledged but no launch constraint is issued. The problem is classified as an acceptable risk pending redesign.  
**Value status:** Below threshold for launch constraint (Criticality 1 designation notwithstanding).  
**Construct coding:**
- CR: PRESENT (second closure event — organizational acceptance without resolution)
- CDA: PRESENT — Thiokol engineering concerns did not cross to NASA launch decision authority in a form that could operate as a launch constraint

---

### Decision Phase Signals

---

**Signal DEC-001**  
**Description:** January 27, 1986 (afternoon/evening) — Marshall Space Flight Center receives weather forecast showing launch temperature of 26–29°F for January 28. NASA management contacts Thiokol to discuss launch implications.  
**Value status:** Within nominal launch procedures — weather consultation is standard.  
**Construct coding:**
- SI: PRESENT — the forecast temperature (29°F) is below the lower bound of the tested O-ring temperature range (STS-51-C at 53°F was the coldest prior launch). The structural incongruence is now formally visible: the operating condition will fall outside the specification's validated envelope.

---

**Signal DEC-002**  
**Description:** January 27, 1986, approximately 8:45 PM — three-way teleconference begins among Thiokol (Utah, Huntsville), Marshall Space Flight Center, and Kennedy Space Center. Thiokol engineers (Boisjoly, Arnie Thompson, Bob Ebeling, others) present data showing O-ring erosion correlation with temperature and recommend against launch below 53°F.  
**Value status:** ABOVE threshold — explicit engineering recommendation against launch constitutes a formal contradiction to the launch decision.  
**Construct coding:**
- CR: PRESENT (strongest contradiction event) — Thiokol engineering team explicitly recommends NO LAUNCH. This directly contradicts the implied launch readiness.
- CDA: PRESENT — the technical evidence crosses the organizational boundary in the teleconference but is not admitted in actionable form (it does not produce a launch hold)
- LD: PRESENT — NASA's response to the launch objection places evaluation burden back on Thiokol management

---

**Signal DEC-003**  
**Description:** January 27, 1986, during teleconference — NASA's George Hardy states he is "appalled" by Thiokol's recommendation and that it is "inconclusive." Lawrence Mulloy states the data does not constitute a basis for launch constraint. NASA requests Thiokol to "reconsider" its recommendation.  
**Value status:** Within organizational authority of NASA management.  
**Construct coding:**
- CR: PRESENT — NASA management contests the contradicting signal without providing direct disconfirmation (no cold-temperature test data is produced; no counter-analysis is offered)
- LD: PRESENT — the evaluation burden is displaced back to Thiokol management

---

**Signal DEC-004**  
**Description:** January 27, 1986 — Thiokol management (Jerry Mason) requests a five-minute caucus off-line. During caucus, Mason tells Bob Lund (VP Engineering): "Take off your engineering hat and put on your management hat." After caucus, Thiokol management votes 4–0 to recommend launch. Boisjoly and Thompson are not included in the vote.  
**Value status:** Within Thiokol organizational authority — management can override engineering recommendation.  
**Construct coding:**
- CR: PRESENT (resolution event) — the contradiction (engineering no-launch) is closed by managerial override. The closure mechanism is RP-2/RP-3 (institutional pressure / analytical inconvenience). No new evidence is produced. No cold-temperature test is conducted.
- Options Released: The engineering team's no-launch recommendation is released without testing. The possibility that O-rings are inadequate at 29°F is not resolved.
- LD: PRESENT — the evaluation of O-ring safety at 29°F is displaced from the engineers who hold the technical knowledge to management who are under external pressure

---

**Signal DEC-005**  
**Description:** January 27/28, 1986 — Joe Kilminster (Thiokol VP, Space Booster Programs) signs the launch recommendation and transmits it to NASA. The teleconference concludes. Launch is authorized for the following morning.  
**Value status:** Within normal launch authorization procedure.  
**Construct coding:**
- CR: PRESENT (final closure) — the signed launch recommendation formally closes the contradiction without resolution
- CDA: PRESENT — the Thiokol engineering team's technical objection is not admitted into the launch authorization record
- LD: PRESENT — NASA accepts Kilminster's signature as the basis for launch. The receiving context (NASA management) conducts no independent O-ring temperature assessment.

---

**Signal DEC-006**  
**Description:** January 28, 1986 — Launch day. Ice observed on launch structure overnight. Ice inspection team assesses and deems acceptable. Temperature at launch time: 36°F (warmer than overnight forecast but still below any prior launch). SRB field joints at approximately 28°F.  
**Value status:** Ice within previously accepted parameters. Temperature above the overnight forecast.  
**Construct coding:**
- FA: PRESENT — multiple simultaneously degraded safety conditions: O-ring temperature below tested range, ice on launch structure, SRB joint temperature at approximately 28°F (below even the launch ambient temperature), compressed schedule with back-to-back launch attempts
- SI: PRESENT — actual SRB joint temperature (~28°F) is further below specification envelope than even the forecast had indicated

---

## Construct Determinations

### CR — Contradiction Resolution: PRESENT | HIGH

**Evidence:** Three distinct CR events documented:

1. PRE-003/PRE-004: Boisjoly memo (catastrophic failure warning) closed by task force formation without direct testing or design change. Closure type: alternative explanation (task force formation = problem managed). Options Released: inadequacy of seals for continued flight.

2. PRE-006/DEC-002/DEC-003: Multiple escalation attempts closed by organizational acceptance without launch constraint. Closure type: institutional authority.

3. DEC-002/DEC-003/DEC-004/DEC-005: The strongest CR event — explicit engineering no-launch recommendation during teleconference closed by management override ("take off your engineering hat"), managerial vote (4–0), and Kilminster signature. Closure type: RP-2 (institutional preference) and RP-3 (analytical inconvenience). No RC-1, RC-2, or RC-3 applied. Options Released: engineering determination that O-rings are inadequate at 29°F.

The teleconference CR event is among the most thoroughly documented premature closure events in the engineering investigation record. The Rogers Commission devotes significant attention to this event and explicitly critiques the closure mechanism.

---

### WSP — Weak Signal Preservation: PRESENT | MODERATE

**Evidence:** O-ring erosion events across STS-2, STS-41-B, STS-41-C, STS-51-B, STS-51-C — each individually assessed as acceptable and documented separately. Boisjoly's July 1985 memo explicitly identifies the pattern ("if this pattern persists, we will lose a vehicle"). No formal aggregation mechanism across the program assembled these signals into a cumulative threshold assessment. The temperature-erosion relationship was recognized by engineers but never formally aggregated into a program-level launch constraint.

The WSP failure is moderate rather than primary because the pattern was recognized by engineers (Boisjoly's memo exists). The failure is that the recognition did not propagate through the organizational structure into formal program governance. The WSP-to-CR transition is explicit: Boisjoly identifies the pattern, reports it, and the report is closed by the task force formation.

---

### SI — Structural Incongruence: PRESENT | MODERATE | SI-1

**Evidence:** The O-ring performance specification assumed operation within a temperature range characterized by prior flight data. The coldest prior launch (STS-51-C) was 53°F, with significant erosion. The STS-51-L launch temperature was 36°F ambient and approximately 28°F at the SRB field joints — below the tested range by 25°F. This is an SI-1 condition: the specification's implicit temperature assumption was violated by the actual operating conditions. The mismatch was not a value-level anomaly (no threshold crossed before launch) — it was a structural property of the operating condition relative to the specification's validated envelope.

---

### HCL — Hidden Common Link: ABSENT

**Evidence:** The case does not exhibit HCL structure. Both the Thiokol engineering domain and the NASA management domain were in active communication throughout the decision phase. The failure is not that signals from independent sources were unconnected — the signals were connected and communicated explicitly. The failure is that the communicated signal was closed through organizational pressure (CR) rather than through technical resolution. HCL would apply if the two domains held signals that were never connected; here the domains connected and the connection was suppressed.

---

### CDA — Cross-Domain Admission: PRESENT | MODERATE

**Evidence:** Thiokol engineering's technical concern was transmitted in the teleconference but was not admitted into the decision framework in actionable form. The teleconference crossed the organizational boundary; the decision to authorize launch was made within NASA management, which filtered the engineering input through the "management hat" framing before admitting it as a decision factor. The formal launch authorization record (Kilminster's signature) does not reflect the engineering objection — the objection was admitted into the conversation but not into the formal decision record.

---

### LD — Load Displacement: PRESENT | MODERATE

**Evidence:** NASA management's response to Thiokol's initial no-launch recommendation placed the evaluation burden back on Thiokol management. Hardy's statement that he was "appalled" and Mulloy's request to "reconsider" displaced the risk assessment responsibility to Thiokol — specifically to management rather than engineering. Kilminster's signature then transferred the formal risk acceptance back to NASA, which accepted it without independent technical evaluation. The receiving context (NASA management) could not independently assess O-ring temperature performance — they were dependent on Thiokol's technical judgment, which had been overridden by Thiokol management under NASA pressure.

---

### FA — Fragility Accumulation: PRESENT | LOW-MODERATE

**Evidence:** Multiple simultaneously degraded safety conditions at launch: O-ring joint temperature approximately 28°F (well below tested range); O-ring erosion history across 24 prior flights indicating structural degradation tendency; ice on launch structure (environmental stressor); launch after back-to-back delays (schedule pressure contributing to decision environment); disrupted decision process (teleconference outside normal FRR structure removes standard safety filters). No formal aggregate assessment of cumulative safety margin state was produced.

FA is coded PRESENT but not as primary — the individual conditions were each assessed (and some accepted) separately. The failure to assess the cumulative state is present but is secondary to the CR failure (explicit concern raised and suppressed).

---

## Construct Summary

| Construct | Determination | Confidence | Primary evidence |
|-----------|--------------|------------|-----------------|
| CR | PRESENT | HIGH | January 27 teleconference; Boisjoly memo closure; Kilminster override |
| WSP | PRESENT | MODERATE | O-ring erosion pattern STS-2 through STS-51-C |
| SI | PRESENT | MODERATE | Joint temperature ~28°F below tested range (SI-1) |
| HCL | ABSENT | HIGH | Active cross-domain communication present; failure is closure, not integration |
| CDA | PRESENT | MODERATE | Engineering objection admitted to conversation, not to decision record |
| LD | PRESENT | MODERATE | Evaluation burden displaced Thiokol engineers → Thiokol management → NASA |
| FA | PRESENT | LOW-MODERATE | Multiple simultaneously degraded conditions at launch |

**Primary construct:** CR  
**Secondary constructs:** WSP, SI, CDA, LD  
**Absent:** HCL

---

*Artifact B — T1-001 Challenger Reconstruction | FROZEN | 2026-06-02*
