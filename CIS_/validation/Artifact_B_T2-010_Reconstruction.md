# Artifact B — Case Reconstruction: T2-010 Herald of Free Enterprise

**Artifact type:** Artifact B  
**Case:** T2-010 — Herald of Free Enterprise  
**Tier:** 2 | **AI Prior Exposure:** MEDIUM-LOW  
**Status:** FROZEN  
**Date:** 2026-06-02  
**Sources:** Sheen Inquiry Report: mv Herald of Free Enterprise — Report of Court No. 8074 (1987); Department of Transport Formal Investigation  
**Artifact A:** SEALED

---

## Phase Boundary Confirmation

**Pre-Decision Phase start:** First documented master's request for bow door indicator light on the bridge — approximately 1984–1985 per Sheen inquiry findings.

**Pre-Decision Phase end:** Herald of Free Enterprise departure from Zeebrugge berth, March 6, 1987, approximately 18:05 local time.

**Decision Phase:** Captain's proceeding to sea without bow door closure confirmation, through capsizing.

**Post-Decision Phase end:** Herald of Free Enterprise capsizes approximately 18:28 local time, approximately 1km outside Zeebrugge harbour.

---

## Signal Inventory

### Pre-Decision Phase Signals

**PRE-001:** Multiple requests from Masters of the Townsend Thoresen fleet for bow door indicator lights to be installed on the bridge. The Sheen inquiry documented that these requests were made through proper channels and were denied by Townsend Thoresen management on cost grounds. Management's response reflected the view that it was the crew's responsibility to confirm door closure before departure, not a management responsibility to provide structural verification.

- **LD:** PRESENT — management's denial displaced bow door verification responsibility from a structural mechanism (indicator light visible from bridge) to individual crew reliability (operational responsibility without structural support)
- **WSP:** PRESENT — the pattern of masters' requests constitutes a sub-threshold safety signal accumulating across the fleet without formal risk aggregation. Each request was individually denied; no mechanism aggregated the requests into a formal safety assessment

**PRE-002:** Established operating procedure — the assistant bosun Mark Stanley was responsible for closing the bow doors after vehicle loading. The deck officer Leslie Sabel was responsible for confirming the vehicle deck was secured before leaving to take up his bridge position. Neither a formal positive confirmation requirement nor a structural verification mechanism existed.

- **SI-1:** PRESENT — the operating procedure specification assumed crew compliance (assistant bosun will close doors; deck officer will confirm). This assumption was embedded without structural verification. The actual state (bosun asleep, doors unclosed) violated the specification's assumption about crew behavior.

---

### Decision Phase Signals

**DEC-001:** March 6, 1987 — Mark Stanley (assistant bosun), responsible for closing bow doors, falls asleep in his cabin after completing vehicle loading duties. He does not close the doors. He does not report this to any officer.

**DEC-002:** Leslie Sabel (deck officer) leaves the vehicle deck to take up his bridge post without checking that the bow doors are closed. He does not communicate bow door status to the bridge.

**DEC-003:** Officer of the Watch Paul Burns on the bridge sees no indication that the bow doors are open (no indicator light exists). Captain David Lewry receives no report of open doors. Applying the standing convention — absence of negative report implies readiness — Captain Lewry proceeds to sea.

- **CR:** PRESENT — the captain's operating assumption is "doors are closed because no one has reported otherwise." This assumption closes the implicit contradiction: "doors might not be closed." The closure is by default assumption rather than by direct confirmation. No crew member confirms the doors are closed; the captain confirms by silence. Options Released: direct verification of bow door closure.
- **CDA:** PRESENT — bow door state (open) is a physical fact. No information about this state crosses to the bridge through any channel — no indicator, no verbal report, no visual observation. The critical structural information is absent from the bridge decision context.
- **FA:** PRESENT — five simultaneously degraded conditions: (1) responsible crew member absent from post; (2) deck officer departed without checking; (3) no structural indicator on bridge; (4) no positive confirmation requirement in procedure; (5) management culture of "proceed unless reported otherwise." Simultaneous degradation of all five creates the capsizing vulnerability.

---

## Construct Determinations

### CR — PRESENT | HIGH

Captain Lewry's departure without positive confirmation of bow door closure is a CR event: the contradiction implicit in uncertainty (bow doors may be open) is resolved by assumption (if no one reports a problem, there is no problem). This is not a case where a warning was explicitly raised and suppressed — it is a case where the absence of a signal was treated as a positive confirmation of safety. This is CR at the operational level: alternative explanation adoption (silence = confirmation) without direct disconfirmation (actual bow door closure verified). Confirmed.

### CDA — PRESENT | HIGH

Bow door state was not admitted to the bridge through any channel. The indicator light (which would have provided automated admission of door status) was denied by management. No crew member crossed the information boundary from vehicle deck to bridge. CDA confirmed as co-primary with CR.

### FA — PRESENT | HIGH

Five simultaneously degraded conditions documented by the Sheen inquiry. Each individually might have been compensated; the co-occurrence of all five removes all compensation capacity. Confirmed.

### SI-4 — ABSENT | HIGH

At the bridge, the signal environment was not multi-dimensionally incongruent — it was simply absent. The captain had no signals about bow door state, either indicating safe or indicating unsafe. The absence of signals is CDA, not SI-4. SI-4 requires simultaneous signals pointing in incompatible directions. The Herald bridge had no bow door signals at all. ABSENT confirmed.

This confirms the discriminant validity prediction: FA and SI-4 can co-occur or be independent. Herald is a case where FA is clearly present and SI-4 is clearly absent.

### SI — PRESENT | MODERATE | SI-1

The operating procedure's specification assumed crew behavioral compliance. The actual crew state violated this assumption. SI-1 confirmed at MODERATE — real but secondary to the CR/CDA/FA structure.

### WSP — PRESENT | MODERATE

The pattern of masters' requests for bow door indicators constitutes a fleet-wide sub-threshold safety signal. Individually managed (each request denied separately), never formally aggregated into a safety assessment. Confirmed at MODERATE — the pattern is documented in the Sheen inquiry but is less dense than Therac-25's six-incident pattern.

### HCL — ABSENT | HIGH

Single organizational structure. No independent-domain parallel signals. Confirmed absent.

### LD — PRESENT | MODERATE

Management's denial of structural indicators displaced bow door verification responsibility onto crew reliability. The receiving context (individual crew members under operational pressure) had less capacity to ensure verification than a structural indicator would have provided. Confirmed at MODERATE.

---

## Construct Summary

| Construct | Determination | Confidence |
|-----------|--------------|------------|
| CR | PRESENT | HIGH |
| CDA | PRESENT | HIGH |
| FA | PRESENT | HIGH |
| SI-4 | **ABSENT** | HIGH |
| SI-1 | PRESENT | MODERATE |
| WSP | PRESENT | MODERATE |
| LD | PRESENT | MODERATE |
| HCL | ABSENT | HIGH |

**Primary constructs:** CR, CDA, FA  
**Secondary:** SI-1, WSP, LD  
**Absent:** SI-4 (discriminant validity confirmed), HCL

---

*Artifact B — T2-010 Herald of Free Enterprise Reconstruction | FROZEN | 2026-06-02*  
*SI-4 ABSENT confirmed while FA PRESENT HIGH — discriminant validity between constructs demonstrated.*
