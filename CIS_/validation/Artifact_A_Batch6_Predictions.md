# Artifact A — Batch 6 Pre-Registered Predictions (SI-1 Falsification)

**Artifact type:** Artifact A  
**Batch:** 6  
**Cases:** T2-012 (Comair 5191), T2-013 (Aloha Airlines 243), T2-014 (ValuJet 592)  
**Status:** FROZEN  
**Date:** 2026-06-02  
**GD-008 incorporated:** Yes  
**Design intent:** SI-1 ABSENT HIGH in all three cases. The cases are not trivial — each involves real organisational or systemic failure. The prediction is that none involve a specification embedding an unverified technical assumption about adjacent system behaviour.

**Adversarial constraint maintained:** No UNCERTAIN. Every prediction PRESENT-HIGH, PRESENT-MODERATE, or ABSENT-HIGH.

---

## Case T2-012 — Comair Flight 5191

**CASE-ID:** T2-012  
**Tier:** 2 | **AI Prior Exposure:** MEDIUM-LOW  
**Outcome:** On August 27, 2006, Comair Flight 5191, a Bombardier CRJ-100, attempted to take off from Runway 26 at Blue Grass Airport, Lexington, Kentucky, instead of the assigned Runway 22. The runway was 3,500 feet long — insufficient for the CRJ-100 at the prevailing conditions. The aircraft became airborne briefly and struck trees beyond the runway end, killing 49 of 50 occupants. The NTSB determined the probable cause was the crew's failure to verify their position on the airport surface before takeoff.

**Phase Boundaries:**
- Pre-Decision Phase start: Flight planning and crew briefing, August 27, 2006
- Pre-Decision Phase end: Aircraft lineup on Runway 26
- Decision Phase: Takeoff roll through departure end impact
- Post-Decision Phase end: Aircraft impact with trees and terrain

**Primary falsification test:** SI-1 ABSENT HIGH. The runway layout is correctly documented. ATC clearance was for the correct runway. No technical specification about adjacent system behaviour was embedded incorrectly. Human navigational failure is excluded from SI-1 by GD-008.

---

### SI-1 — ABSENT | HIGH

Under GD-008: SI-1 requires a specification embedding an unverified assumption about adjacent technical system behaviour. The failure of Comair 5191 is crew positional disorientation during night taxi — a human execution failure. The airport layout specification was correct. The ATC clearance was correct. The runway geometry was correctly described in all documentation. No technical specification failed. Human navigation is excluded from SI-1 by GD-008. ABSENT HIGH.

### CR — ABSENT | HIGH

CR requires an anomalous signal raised and closed. The crew's incorrect positional assumption was not challenged by any signal they registered and dismissed — they simply failed to check. The runway heading indicator (260° vs. 222°) and runway length difference were available cues but were not consciously processed. This is attentional failure, not contradiction closure. ABSENT HIGH.

### CDA — ABSENT | HIGH

All relevant information was available to the crew — airport diagram, ATC clearance, runway markings. The failure is not that information was absent from the decision context; it is that available information was not used. ABSENT HIGH.

### HCL — ABSENT | HIGH

Single aircraft, single crew. No independent domain parallel structure. ABSENT HIGH.

### WSP — ABSENT | HIGH

No accumulated sub-threshold signal pattern. Single event, single execution failure. ABSENT HIGH.

### LD — ABSENT | HIGH

No organisational risk transfer. The crew had all information needed to verify position. ABSENT HIGH.

### FA — PRESENT | HIGH

Multiple simultaneously degraded conditions documented by the NTSB: (1) night operations with limited visual reference; (2) first officer fatigue (8 hours off before the flight); (3) non-pertinent conversation during taxi violating sterile cockpit rule; (4) captain's failure to brief the departure; (5) single air traffic controller handling an unusual departure sequence. No single condition causes the runway error; the co-occurrence of all five removes the compensating mechanisms that would normally catch positional error.

### Conventional Explanation Score Prediction: HIGH (0.70–0.85)

"Crew error — wrong runway." The EE/CIS structural account adds only FA (the conditions that removed normal error-catching redundancy). The conventional account is nearly complete; FA provides some additional structural explanation of why this error reached takeoff without correction.

---

## Case T2-013 — Aloha Airlines Flight 243

**CASE-ID:** T2-013  
**Tier:** 2 | **AI Prior Exposure:** MEDIUM  
**Outcome:** On April 28, 1988, Aloha Airlines Flight 243, a Boeing 737-200 (N73711), experienced explosive decompression and structural failure of the upper fuselage at 24,000 feet over Hawaii. An 18-foot section of the cabin roof separated in flight. One flight attendant was killed; 65 passengers and crew were injured. The NTSB determined the probable cause was Aloha Airlines' failure to detect significant fatigue and disbonding damage in the fuselage lap joint, resulting from the aircraft's exceptional accumulated service cycle count of approximately 89,680 cycles — nearly 50% above the Boeing 737 design service objective of 60,000 cycles.

**Phase Boundaries:**
- Pre-Decision Phase start: N73711 exceeding the Boeing 737 design service objective of 60,000 cycles — approximately 1985–1986
- Pre-Decision Phase end: Final maintenance check before the accident flight
- Decision Phase: Takeoff and climb to cruise altitude, April 28, 1988
- Post-Decision Phase end: Structural failure and explosive decompression at FL240

**Primary falsification test:** SI-1 ABSENT HIGH. The Boeing 737 structural specification was correct within its validated scope (up to the DSO). The inspection methodology was correct within that scope. Aloha's decision to continue operating N73711 beyond the DSO without enhanced inspection or manufacturer guidance is an LD event (operator accepted post-DSO risk without adequate verification capacity) — not an SI-1 event (specification assumed wrong thing about adjacent system). ABSENT is predicted; reconstruction will test whether the inspection specification's adequacy assumption qualifies as SI-1.

---

### SI-1 — ABSENT | HIGH

**This is the primary adversarial prediction.** Under GD-008 verification test: SI-1 requires that at the time of specification acceptance, the specification embedded an assumption about adjacent technical system behaviour that was practicably verifiable and was not verified.

The Boeing 737 fatigue specification (DSO of 60,000 cycles; inspection intervals calibrated for that scope) was developed and validated for aircraft operating within the DSO. Within that scope, the assumption — that standard inspection intervals would detect significant fatigue damage — was verified by fleet-wide experience.

N73711 was operating 49% above the DSO. The specification was correct within its validated scope. Aloha's continued operation beyond the DSO represents an operator decision to apply a specification outside its validated envelope. That decision, and the absence of enhanced inspection or manufacturer guidance for post-DSO operation, is an LD event: the risk of post-DSO operation was accepted by the operator without adequate evaluation capacity.

GD-008 distinction: SI-1 codes specification errors at acceptance. LD codes risk acceptance beyond a specification's validated scope. The 737 inspection specification was correct at acceptance; the failure is the operator applying it beyond its scope without enhanced verification. ABSENT HIGH.

**Falsification condition:** SI-1 would be present if reconstruction shows the inspection specification embedded a specific assumption about detection adequacy for multi-site fatigue damage that was not verified even within the DSO — i.e., if the specification's detection adequacy was never validated for the failure mode that actually occurred, independent of the cycle count.

### WSP — PRESENT | HIGH

The primary construct. Each of N73711's 89,680 flights contributed a small increment of fatigue damage. Each maintenance inspection found the aircraft within acceptable limits — each inspection result was below the threshold for grounding. The aggregate accumulation of 89,680 cycles of fatigue damage was never formally assessed as a pattern requiring adjustment of inspection intervals. The pattern was visible in the cycle count records but no mechanism translated the unusual cycle accumulation into a modified maintenance approach. WSP PRESENT HIGH.

### LD — PRESENT | MODERATE

Aloha Airlines continued operating N73711 far beyond the Boeing 737's DSO without requesting enhanced inspection guidance from Boeing or the FAA. The risk of post-DSO structural behaviour was implicitly accepted by Aloha. The receiving context — Aloha's standard maintenance program — was not designed to evaluate or mitigate post-DSO structural risk independently. The risk was displaced from the validated specification envelope to the operator without adequate evaluation capacity.

### CR — ABSENT | HIGH

No documented case where a concern about N73711's structural integrity was raised by a named party and closed by alternative explanation without direct testing. The fatigue accumulation was not generating detectable signals in the maintenance record. This is a WSP/LD failure, not a CR failure. ABSENT HIGH.

### HCL — ABSENT | HIGH

Single aircraft, single operator, single structural failure mechanism. ABSENT HIGH.

### CDA — ABSENT | HIGH

Relevant information (cycle count records, DSO threshold) was available within Aloha's maintenance organisation. The failure is not cross-domain admission but rather failure to act on available information. ABSENT HIGH.

### FA — PRESENT | MODERATE

Multiple simultaneously degraded conditions: N73711's exceptional cycle count (structural margin below design assumptions); Aloha's high-frequency short-haul operations (accelerating fatigue accumulation rate); the inspection methodology's limitation for detecting multi-site damage; the absence of any enhanced inspection programme for post-DSO aircraft. MODERATE — real but secondary to WSP as the primary construct.

### Conventional Explanation Score Prediction: MEDIUM (0.40–0.55)

The conventional account: "metal fatigue brought down the plane; old aircraft." The EE/CIS structural account adds: WSP (the cycle accumulation pattern never formally triggered enhanced inspection), LD (post-DSO risk accepted without adequate evaluation). The structural account explains why 89,680 cycles of fatigue damage accumulated without triggering a modified maintenance response.

---

## Case T2-014 — ValuJet Flight 592

**CASE-ID:** T2-014  
**Tier:** 2 | **AI Prior Exposure:** MEDIUM-LOW  
**Outcome:** On May 11, 1996, ValuJet Airlines Flight 592, a McDonnell Douglas DC-9-32, crashed into the Florida Everglades killing all 110 aboard. An in-flight fire originating in the Class D cargo hold was ignited by chemical oxygen generators improperly carried as cargo. The generators, removed from ValuJet aircraft by maintenance contractor SabreTech, were labelled "empty" despite being neither properly discharged nor capped. The NTSB determined the probable causes were the failure of SabreTech to properly prepare, package, and identify the generators; ValuJet's failure to ensure SabreTech complied with hazardous materials regulations; and the FAA's failure to adequately oversee ValuJet's maintenance programme.

**Phase Boundaries:**
- Pre-Decision Phase start: SabreTech workers removing and preparing oxygen generators for shipment — approximately May 1996
- Pre-Decision Phase end: Generators accepted as cargo for ValuJet Flight 592, May 11, 1996
- Decision Phase: Flight 592 departure through in-flight fire development
- Post-Decision Phase end: Aircraft impact, Everglades, May 11, 1996

**Primary falsification test:** SI-1 ABSENT HIGH. The cargo compartment specification correctly excluded active chemical oxygen generators. The specification assumption was correct; the failure was that incorrect information about cargo content (generators labelled "empty" when active) was admitted to the cargo acceptance process. This is CDA and LD, not SI-1. The specification was right; the information fed into the specification-governed process was wrong.

---

### SI-1 — ABSENT | HIGH

Under GD-008: the cargo hold specification correctly specified that hazardous materials, including active chemical oxygen generators, were not permitted in Class D cargo. The specification's assumption about what would be loaded was correct. The failure is that the generators were misrepresented as inactive ("empty") — a CDA failure — and that the risk of improper generator disposal was displaced from SabreTech to ValuJet without adequate evaluation capacity — an LD failure. The specification was not wrong. The information admitted into the specification-governed process was wrong. SI-1 ABSENT HIGH.

**Falsification condition:** SI-1 would be present if the reconstruction shows the cargo hold specification embedded a specific assumption about cargo content detection capability that was unverified — i.e., if the specification assumed the carrier could independently verify hazmat status without that capability existing. That would be an SI-1 condition: the specification assumed a verification capability that didn't exist.

### CDA — PRESENT | HIGH

The actual operational state of the oxygen generators (active, not discharged) existed as information in SabreTech's records and in the physical condition of the generators. This information did not cross into ValuJet's cargo acceptance process. The generators' incorrect labelling ("empty") substituted false information for the correct information. The correct state information was absent from the cargo acceptance decision context. CDA PRESENT HIGH.

### LD — PRESENT | HIGH

SabreTech's responsibility for the safe preparation and disposal of the generators was transferred to ValuJet's cargo acceptance process. ValuJet's cargo process had no independent capacity to verify the operational status of chemical oxygen generators — the cargo acceptance relied on SabreTech's labelling and documentation. The risk of improperly prepared generators was displaced to a receiving context without evaluation capacity. LD PRESENT HIGH.

### CR — PRESENT | MODERATE

NTSB investigation found that SabreTech workers were aware the generators were not properly prepared. Some workers noted concerns. These concerns were not escalated or resolved — the generators were labelled "empty" and shipped. This constitutes a CR event at the SabreTech level: the concern (generators not properly discharged) was present and was closed by the labelling decision ("just mark them empty") without direct resolution. MODERATE because the specific closure mechanism within SabreTech requires fuller investigation record access to characterise precisely.

### HCL — PRESENT | MODERATE

Three organisationally independent domains each held signals about the generator situation: SabreTech workers (knew generators were not discharged), ValuJet cargo acceptance (processed the mislabelled generators), FAA oversight (responsible for SabreTech compliance but not inspecting). The shared structural source: the actual operational state of the generators, simultaneously creating risk in all three domains without any domain synthesising the cross-domain picture. MODERATE — the independence of the three domains is real but the HCL signal quality is lower than Therac-25 or the engineering stovepipe cases.

### WSP — ABSENT | HIGH

The ValuJet 592 failure is a specific instance of improper generator disposal, not a pattern of individually sub-threshold events accumulating across time within ValuJet's operational records. ABSENT HIGH.

### FA — PRESENT | MODERATE

Multiple simultaneously degraded conditions: SabreTech workers undertrained on hazardous materials; ValuJet's rapid expansion creating maintenance outsourcing pressures; FAA oversight programme not keeping pace with ValuJet's growth; Class D cargo hold with no fire suppression requirement; no smoke/fire detection in Class D. MODERATE — contributing conditions, not the primary mechanism.

### HCL — PRESENT | MODERATE

[See above — coded at MODERATE]

### Conventional Explanation Score Prediction: MEDIUM-LOW (0.35–0.50)

The conventional account: "oxygen canisters mislabelled as empty started a fire." The EE/CIS structural account adds: CDA (operational state of generators not admitted to cargo process), LD (disposal risk transferred to ValuJet without verification capacity), HCL (three independent organisational domains each holding pieces of the operational picture). The structural account explains how the generators reached the aircraft despite multiple organisational checkpoints that should have caught them.

---

## Batch 6 Prediction Summary

| Case | SI-1 | CR | WSP | HCL | CDA | LD | FA |
|------|------|----|-----|-----|-----|----|----|
| T2-012 | **ABSENT HIGH** | ABSENT HIGH | ABSENT HIGH | ABSENT HIGH | ABSENT HIGH | ABSENT HIGH | PRESENT HIGH |
| T2-013 | **ABSENT HIGH** | ABSENT HIGH | PRESENT HIGH | ABSENT HIGH | ABSENT HIGH | PRESENT MOD | PRESENT MOD |
| T2-014 | **ABSENT HIGH** | PRESENT MOD | ABSENT HIGH | PRESENT MOD | PRESENT HIGH | PRESENT HIGH | PRESENT MOD |

**SI-1 predicted ABSENT at HIGH confidence in all three cases.**  
**Twelve ABSENT-HIGH predictions across all three cases — all falsifiable.**  
**Zero UNCERTAIN predictions.**

---

*Artifact A — Batch 6 Pre-Registered Predictions | FROZEN | 2026-06-02*  
*Primary test: SI-1 ABSENT HIGH in cases with real organisational failure. GD-008 scope applied.*
