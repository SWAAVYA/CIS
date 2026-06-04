# Artifact B — Case Reconstruction: T2-009 Therac-25

**Artifact type:** Artifact B  
**Case:** T2-009 — Therac-25 Radiation Therapy Accidents (1985–1987)  
**Tier:** 2 | **AI Prior Exposure:** MEDIUM  
**Status:** FROZEN  
**Date:** 2026-06-02  
**Sources:** Leveson, N.G. and Turner, C.S. (1993) "An Investigation of the Therac-25 Accidents," IEEE Computer 26(7):18–41; NRC correspondence and investigation letters (1987); FDA investigation records  
**Artifact A:** SEALED

---

## Phase Boundary Confirmation

**Pre-Decision Phase start:** First overdose incident — Kennestone Regional Oncology Center, Marietta, Georgia, June 1985.

**Pre-Decision Phase end:** Sixth documented overdose incident — Yakima Valley Memorial Hospital, Washington, January 1987.

**Decision Phase:** The regulatory investigation and enforcement period through which AECL formally acknowledged the software cause and issued mandatory corrective action.

**Post-Decision Phase end:** AECL mandatory corrective action and software redesign acknowledged, 1987.

---

## Signal Inventory — Organized by Facility

**Incident 1 — Kennestone, Georgia (June 1985):** Patient receives massive overdose. Therac-25 displays "Malfunction 54" error. AECL investigates; cannot reproduce the problem; attributes to "transient" or possible operator error. Case closed. Options Released: direct test of whether software race condition could produce the overdose.

**Incident 2 — Hamilton, Ontario (July 1985):** Patient receives overdose; severe radiation burns. AECL investigates; blames operator error. Hamilton facility removes the machine from service temporarily. AECL provides software update (not targeting the race condition, which has not been identified). Case closed.

**Incident 3 — Yakima, Washington (December 1985):** Technician struck by anomalous beam during setup. AECL investigates; unable to reproduce; attributes to operator error.

**Incident 4 — East Texas Cancer Center, Tyler (March 1986):** Patient receives massive overdose; dies three weeks later. AECL continues to deny software cause. FDA becomes involved. AECL provides another software "fix." Case closed by AECL as operator error with software update issued.

**Incident 5 — East Texas, Tyler (April 1986):** Second patient at same facility overdosed. Dies five months later. FDA issues safety alert requiring AECL to halt distribution.

**Incident 6 — Yakima (January 1987):** Patient overdosed. At this point, FDA and NRC compel AECL to conduct comprehensive cross-incident review. Software race condition is finally identified.

---

## Construct Determinations

### CR — PRESENT | HIGH

Six individual CR events, each structurally identical: an anomalous signal (overdose/injury/machine error) contradicts the accepted account (machine is safe, software is reliable). Each is closed by AECL through alternative explanation: "operator error," "transient fault," "cannot be reproduced." In no case does AECL produce a direct test demonstrating the software cannot produce the anomalous dose level. The race condition is not identified until regulatory intervention forces a comprehensive cross-site review. Options Released at each closure: the possibility that the software was causally responsible.

---

### SI — PRESENT | HIGH | SI-1 and SI-3

**SI-1:** The Therac-25 software controlled beam delivery without hardware interlocks. The software assumed that its internal state corresponded to hardware configuration — that if the software believed the X-ray target was in place, the target was physically in place. The race condition violated this assumption: under specific operator input timing, the software state diverged from hardware state. The specification's assumption (software state = hardware state) was violated by concurrent operation that the software's design did not protect against. SI-1 confirmed.

**SI-3 (GD-007 applied):** Six incidents across four facilities from June 1985 to January 1987. GD-007 check: was there a formal aggregation event (regulatory directive, cross-site investigation report, NRC action) before the sixth incident that would make this CR rather than SI-3?

The answer is NO. AECL treated each incident as isolated. FDA issued a safety alert after Incident 5 but this was a reaction to repeated incidents at the same facility (East Texas), not a formal cross-site pattern aggregation. The aggregate pattern — same machine type, multiple independent sites, same failure mechanism — was not formally entered into a cross-site governed assessment until NRC/FDA compelled it after Incident 6. Aggregation was absent during the Pre-Decision Phase. GD-007 rule: aggregation absent → SI-3 PRESENT. Confirmed.

---

### HCL — PRESENT | HIGH

Four geographically and organizationally independent facilities each held anomalous signals (overdose incidents). No formal mechanism connected their signals. Each facility investigated its own incident in isolation. The shared structural source — the Therac-25 software race condition — was invisible from within any single facility's investigation because: (1) AECL denied software causation; (2) no cross-facility information exchange existed; (3) each facility's signal was attributed to local factors.

The cross-domain synthesis that would have identified the shared source required asking: "Do these incidents at independent facilities share a structural cause?" This question was not asked within any single domain. It was only answerable across domains. HCL confirmed.

Independence confirmed: four facilities in different US states and Canada, different organizational governance, different regulatory jurisdictions, no shared information exchange mechanism.

---

### WSP — PRESENT | HIGH

Six incidents are the signal set. Each individually managed, individually attributed, individually "resolved." The aggregate pattern constitutes a threshold-crossing signal that no individual incident reached. No aggregation mechanism existed to form the cross-site assessment. WSP confirmed alongside SI-3. The distinction holds: WSP codes the governance failure (no aggregation mechanism). SI-3 codes the structural observation property (pattern accumulating without formal recognition).

---

### CDA — PRESENT | HIGH

Each facility's incident information existed in AECL's investigation files and the respective facility's records. This information did not cross into a cross-site analytical context. Facility A did not know about Facility B's incident. AECL knew about all incidents but did not admit them collectively into a shared pattern analysis until forced. The cross-domain admission failure is the specific mechanism by which the HCL condition persisted — the signals from independent domains were never admitted into a shared framework.

---

### LD — PRESENT | MODERATE

AECL designed the Therac-25 without hardware interlocks, explicitly representing that software-based safety was adequate. Clinical facilities purchased and operated the machine on the basis of this representation. The safety assurance responsibility was displaced from verifiable hardware (interlocks that physically prevent incorrect beam delivery) to unverifiable software (race condition not detectable under normal operation). Clinical facilities had no capacity to independently verify software safety. LD confirmed at MODERATE — real but secondary to the WSP/HCL/SI-3 pattern.

---

### FA — ABSENT | HIGH

The Therac-25 failure is not characterized by multiple independently managed safety margins simultaneously degraded. The safety architecture itself was the problem — hardware interlocks had been removed as a design decision. This is not multiple margins failing; it is the absence of a margin that should have existed. ABSENT confirmed.

---

## Construct Summary

| Construct | Determination | Confidence |
|-----------|--------------|------------|
| CR | PRESENT | HIGH |
| SI-1 | PRESENT | HIGH |
| SI-3 | PRESENT | HIGH |
| HCL | PRESENT | HIGH |
| WSP | PRESENT | HIGH |
| CDA | PRESENT | HIGH |
| LD | PRESENT | MODERATE |
| FA | ABSENT | HIGH |

**Primary constructs:** CR, SI-3, HCL, WSP, CDA — all co-primary  
**Secondary:** SI-1, LD  
**Absent:** FA

This is the richest case in the program by construct count. Six constructs PRESENT at HIGH or MODERATE simultaneously, including the first HIGH-confidence HCL outside aerospace.

---

*Artifact B — T2-009 Therac-25 Reconstruction | FROZEN | 2026-06-02*
