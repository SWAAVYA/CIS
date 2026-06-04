# Artifact B — Case Reconstruction: T2-008 Überlingen Mid-Air Collision

**Artifact type:** Artifact B  
**Case:** T2-008 — Überlingen Mid-Air Collision  
**Tier:** 2 | **AI Prior Exposure:** MEDIUM-LOW  
**Status:** FROZEN  
**Date:** 2026-06-02  
**Sources:** German Federal Bureau of Aircraft Accident Investigation (BFU) Investigation Report AX001-1-2/02 (May 2004)  
**Artifact A:** SEALED

---

## Phase Boundary Confirmation

**Pre-Decision Phase start:** Operational introduction of TCAS II and establishment of TCAS-over-ATC priority procedures in European airspace — approximately 1993–1995, when TCAS II with Version 7 became mandatory in European commercial aviation.

**Pre-Decision Phase end:** TCAS Resolution Advisory issued to Bashkirian Airlines Flight 2937, July 1, 2002, 21:35:04 UTC.

**Decision Phase:** BA2937 crew response to simultaneous TCAS RA and ATC descend instruction, 21:35:04–21:35:32 UTC.

**Post-Decision Phase end:** Mid-air collision, July 1, 2002, 21:35:32 UTC.

---

## Signal Inventory

### Pre-Decision Phase Signals

**Signal PRE-001**  
**Description:** 1993–2002 — TCAS II Version 7 established in European airspace with a clear operational priority rule: when a TCAS Resolution Advisory is issued, crews must follow it immediately and not follow conflicting ATC instructions. This rule is codified in ICAO documentation, EASA regulations, and airline operational procedures. Bashkirian Airlines was operating in European airspace and the crew was trained on TCAS. However, TCAS was relatively new to Bashkirian Airlines' operational culture — the BFU report notes that Russian carriers had recently introduced TCAS compliance into standard operations and that crew confidence and familiarity with TCAS varied.  
**Construct coding:**
- SI-2: ASSESSMENT REQUIRED — the TCAS priority rule was documented and trained. Whether this constitutes adequate interface coupling or a coupling failure depends on whether the failure is individual non-compliance with a known rule (which is CR only) or structural insufficiency in how the priority interface was enforced at the cockpit level (which is SI-2).

**Signal PRE-002**  
**Description:** The Tu-154 cockpit avionics configuration — The Bashkirian Tu-154's flight management system was coupled to a flight director. When the ATC instruction to descend was entered or accepted, the flight director displayed a descent command. At the moment of the TCAS RA (which commanded CLIMB), the flight director continued displaying a descent command derived from the ATC-sourced descent. The cockpit therefore simultaneously displayed: the TCAS RA commanding climb (on the dedicated TCAS display/annunciator) and the flight director commanding descent (on the primary flight display). Two conflicting commands in the cockpit visual environment simultaneously, with no structural mechanism to resolve priority in the display.  
**Construct coding:**
- SI-2: PRESENT — this is the specific interface coupling failure. The flight director was not suppressed or overridden by the TCAS RA. The cockpit interface simultaneously displayed contradictory commands without structural priority enforcement at the display level. The information (TCAS RA priority) crossed the boundary into the cockpit visual environment but was presented in a form that did not structurally govern crew action — it competed with a simultaneously active conflicting display command. This is a genuine SI-2 condition at the cockpit display interface level.

---

### Decision Phase Signals

**Signal DEC-001**  
**Description:** July 1, 2002, 21:34:42 UTC — Skyguide controller Peter Nielsen instructs BA2937 to descend to FL350 due to conflicting traffic. The controller does not issue a TCAS-related warning to the crew. At this moment, Nielsen is handling two sectors simultaneously and has been on a telephone call dealing with another aircraft.  
**Construct coding:**
- FA: PRESENT — multiple simultaneously degraded operational conditions contributing to the environment: single controller on dual sector; STCA (Short-Term Conflict Alert) tool unavailable for maintenance at this time; controller occupied with phone call during conflict development; reduced staffing on the night shift.

**Signal DEC-002**  
**Description:** July 1, 2002, 21:35:04 UTC — TCAS issues Resolution Advisories to both aircraft. BA2937 receives CLIMB RA. DHL Flight 611 receives DESCEND RA (complementary). The TCAS RA is a direct contradiction to the ATC descend instruction BA2937 received 22 seconds earlier.  
**Construct coding:**
- CR: PRESENT — the TCAS RA (CLIMB) is the contradicting signal. It directly contradicts the active ATC instruction (DESCEND). The contradiction is present in the cockpit simultaneously with the ATC instruction.
- SI-2: PRESENT — at this moment, the flight director (still commanding descent from the ATC instruction) and the TCAS RA (commanding climb) are simultaneously active in the cockpit. The interface coupling failure is instantiated: two commands, no structural resolution in the display.

**Signal DEC-003**  
**Description:** 21:35:04–21:35:32 UTC — BA2937 crew acknowledges the TCAS RA but follows the ATC descend instruction. The crew begins or continues the descent. DHL611 follows its TCAS RA and descends. Both aircraft descend toward each other. Mid-air collision at 21:35:32 UTC.  
**Construct coding:**
- CR: PRESENT (resolution event) — the TCAS RA contradiction is closed by the crew following the ATC instruction. The closure mechanism: institutional familiarity preference (ATC is the known authority; TCAS is the newer, less familiar system) plus the flight director visual reinforcement of the descent command. No direct disconfirmation of the TCAS RA (the crew did not verify that the TCAS guidance was incorrect before overriding it). Options Released: the separation that would have resulted from following the TCAS RA.

---

## Construct Determinations

### CR — PRESENT | HIGH

The TCAS RA at 21:35:04 UTC is the clearest CR event in this batch. A correct, automated contradicting signal (the TCAS RA commanding climb) was present in the cockpit simultaneously with the ATC descend instruction. The crew resolved the contradiction by following ATC — alternative explanation adoption ("ATC is the authoritative source; the TCAS must be accounted for by ATC's instruction"). No direct disconfirmation of the TCAS RA was applied. The TCAS RA was correct; following it would have resulted in safe separation. Options Released: the climb that would have created vertical separation.

---

### SI — PRESENT | MODERATE | SI-2

The flight director displaying a descent command simultaneously with the TCAS RA displaying a climb command is a genuine interface coupling failure at the cockpit avionics display level. The TCAS RA priority rule existed in documentation and training, but the cockpit interface did not structurally enforce that priority — the flight director, driven by the ATC-sourced descent, remained active and visible, presenting a competing visual command.

**The adversarial question:** Is this individual non-compliance with a known priority rule (which is CR only), or is it structural interface coupling failure (SI-2)?

The BFU finding resolves this: the simultaneous flight director descent command is specifically noted as a contributing factor to the crew's decision to follow ATC. The flight director's active descent command, derived from the ATC instruction, was visible in the primary flight display while the TCAS RA commanded climb. This is not simply a crew choosing to ignore a rule they knew — the cockpit display structure actively reinforced the ATC instruction through the flight director while the TCAS RA competed on a separate display. The interface between TCAS guidance and flight director display was not coupled in a way that structurally enforced TCAS priority at the point of conflict.

SI-2 is PRESENT at MODERATE confidence — the specific cockpit display interface coupling failure is documented and contributing. It is MODERATE rather than HIGH because the TCAS priority rule was also known to crews, creating a genuine ambiguity between interface coupling failure and individual non-compliance.

---

### FA — PRESENT | MODERATE

Multiple simultaneously degraded operational conditions: single controller on two sectors; STCA unavailable; controller occupied with phone call; night operations; reduced staffing; BA2937 crew's lower TCAS familiarity; flight director actively displaying conflicting command. No single condition causes the collision; the aggregate creates the vulnerability environment that made the outcome possible.

---

### LD — ABSENT | HIGH

The failure does not involve organizational risk transfer. Both flight crews had the information needed to avoid the collision; the failure is in how one crew processed and acted on that information. No evaluation-incapable receiving context.

---

### WSP — ABSENT | HIGH

No documented pattern of sub-threshold signal accumulation. Single event, single decision failure.

---

### HCL — ABSENT | HIGH

The two aircraft and the ATC controller form a connected operational system. The failure is not hidden cross-domain integration — the conflict was known (ATC issued the instruction) and TCAS detected it. The failure is resolution, not integration.

---

### CDA — ABSENT | HIGH

All signals were admitted to the cockpit — TCAS RA, ATC instruction, flight director. The failure is resolution of admitted signals, not admission of missing signals.

---

## Construct Summary

| Construct | Determination | Confidence | Note |
|-----------|--------------|------------|------|
| CR | PRESENT | HIGH | TCAS RA vs. ATC instruction; flight director reinforcement |
| SI | PRESENT | MODERATE | SI-2 at cockpit display interface; flight director not overridden by TCAS RA |
| FA | PRESENT | MODERATE | Multiple simultaneously degraded operational conditions |
| LD | ABSENT | HIGH | |
| WSP | ABSENT | HIGH | |
| HCL | ABSENT | HIGH | |
| CDA | ABSENT | HIGH | |

**Primary construct:** CR  
**Secondary:** SI-2, FA  
**Absent:** LD, WSP, HCL, CDA

---

*Artifact B — T2-008 Überlingen Reconstruction | FROZEN | 2026-06-02*  
*SI-2 confirmed at MODERATE — flight director simultaneous display is the interface coupling failure, consistent with MODERATE prediction confidence.*
