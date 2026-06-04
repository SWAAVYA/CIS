# Artifact B — Case Reconstruction: T2-006 X-33 Composite LOX Tank Failure

**Artifact type:** Artifact B  
**Case:** T2-006 — X-33 Composite Liquid Oxygen Tank Failure  
**Tier:** 2 | **AI Prior Exposure:** MEDIUM-LOW  
**Status:** FROZEN  
**Date:** 2026-06-02  
**Sources:** NASA Independent Assessment Team Report on X-33 Composite Liquid Oxygen Tank Failure (2000)  
**Artifact A:** SEALED

---

## Phase Boundary Confirmation

**Pre-Decision Phase start:** Composite LOX tank material specification and design acceptance — X-33 development phase, approximately 1996–1997. The decision to use bismaleimide (BMI) composite sandwich panels for the LOX tank was made and locked during this period.

**Pre-Decision Phase end:** Final ground pressure test configuration, November 1999, Edwards Air Force Base.

**Decision Phase:** Cryogenic propellant loading and pressurization test sequence, November 3, 1999.

**Post-Decision Phase end:** Structural failure of composite LOX tank inner face sheet, November 3, 1999.

All boundaries confirmed against IAT Report timeline.

---

## Signal Inventory

### Pre-Decision Phase Signals

**Signal PRE-001**  
**Description:** X-33 program definition (1996) — Lockheed Martin selected composite sandwich panel construction for the LOX tank to meet the aggressive mass fraction requirements of the single-stage-to-orbit mission. The selected material system, bismaleimide composite over aluminum honeycomb, had not been previously qualified for cryogenic service in contact with liquid oxygen at the temperatures and pressures required by the X-33 mission profile. Prior aerospace applications of composite pressure vessels used different resin systems and/or did not require sustained LOX contact under cryogenic thermal cycling.  
**Construct coding:**
- SI-2: PRESENT — the material properties established in prior applications (the information) crossed into the X-33 structural design without structural verification that those properties remained valid under the X-33-specific LOX/cryogenic/combined-loading conditions
- LD: PRESENT — composite cryogenic tank technology at this performance level was being developed concurrently with the vehicle program; the technology risk was accepted into the vehicle design before it was flight-validated

**Signal PRE-002**  
**Description:** Development phase (1996–1999) — cryogenic microcracking of composite resin matrices was a documented phenomenon in the composites research community. Under thermal cycling to cryogenic temperatures, matrix microcracks form in the resin, creating pathways for fluid ingestion. For LOX systems, ingested oxygen creates an explosion hazard on warming; for structural applications, ingested fluids create delamination risk. The IAT Report found that this phenomenon was known in the composites literature and was identifiable from existing cryogenic composite test data. This information was not fully integrated into the X-33 tank structural verification.  
**Construct coding:**
- SI-2: PRESENT (strengthened) — the cryogenic microcracking knowledge existed in the materials science domain and did not cross into the X-33 structural design verification process with sufficient completeness to prevent the failure
- CDA: PRESENT — materials science community knowledge of cryogenic composite microcracking was not admitted into the X-33 structural design acceptance decision in operational form

**Signal PRE-003**  
**Description:** Development phase — engineering concerns were raised within the X-33 program about the maturity of composite cryogenic tank technology. These concerns were addressed through analytical modeling rather than through full-scale or subscale testing that directly replicated the combined loading conditions (cryogenic temperature, LOX exposure, pressure, and structural loading simultaneously). The analytical models used did not capture the microcracking-ingestion-delamination failure mode. Concerns were closed as acceptable within program schedule and budget constraints.  
**Construct coding:**
- CR: PRESENT — concerns about composite cryogenic behavior were raised and closed by alternative explanation adoption (analytical models showing adequate margins) without direct test of the specific combined-loading failure scenario. Options Released: whether the composite would maintain structural integrity under combined LOX/cryogenic/pressure loading at full scale.
- LD: PRESENT (strengthened) — the technology risk was transferred to the test phase without a validated design basis for the specific failure mode

**Signal PRE-004**  
**Description:** Material qualification testing — coupon-level testing of the BMI composite material system was conducted under cryogenic conditions. These tests characterized the material's properties in isolation. They did not replicate the full-scale tank geometry, the manufacturing process variability inherent in large-scale composite fabrication, or the combined loading state of pressure plus structural loads plus cryogenic temperature plus LOX exposure simultaneously.  
**Construct coding:**
- SI-2: PRESENT (boundary specification) — coupon-level material property data crossed the design-to-structures boundary as the material characterization basis. The boundary crossing did not verify that coupon-level properties were valid for the full-scale panel geometry under combined loading. This is the specific SI-2 event: material properties crossing from characterization to design without verification of scale and loading context validity.

---

### Decision Phase Signals

**Signal DEC-001**  
**Description:** November 3, 1999 — X-33 LOX tank is filled with liquid oxygen as part of a propellant loading test at Edwards Air Force Base. The cryogenic loading imposes thermal cycling on the composite structure as the tank temperature drops from ambient to LOX temperature (~90K).  
**Construct coding:**
- LD culmination — this is the moment at which the displaced risk from the development phase becomes consequential. No mitigation capacity exists at this point; the tank geometry and material system are fixed.

**Signal DEC-002**  
**Description:** November 3, 1999 — During or following the cryogenic loading test, the inner face sheet of the LOX tank separates from the aluminum honeycomb core. LOX had ingressed through microcracking in the composite matrix during thermal cycling. On pressurization or warming, the trapped oxygen expanded, driving delamination of the inner face sheet. The failure is consistent with the cryogenic microcracking-ingestion mechanism documented in the composites literature.  
**Construct coding:**
- Outcome event confirming the failure mode predicted by materials science data that was not integrated into the design verification.

---

## Construct Determinations

### SI — PRESENT | HIGH | SI-2

The IAT Report found that the composite cryogenic microcracking phenomenon was knowable from existing data and was predictable. The failure arose from the crossing of material characterization data (generated under coupon-level, single-variable conditions) into the structural design domain without verification that the coupon-level properties were valid under the X-33 tank's combined loading conditions — cryogenic temperature, LOX contact, pressure, and structural loads simultaneously.

This is a clean SI-2 case: the boundary crossing (materials characterization → structural design acceptance) lacked structural verification of the information's validity in the receiving context. The receiving context (structural design at full scale, under combined loading) had different structural requirements than the source context (coupon-level characterization, individual loading variables).

---

### CR — PRESENT | HIGH

Concerns about composite cryogenic behavior were raised during development. The resolution mechanism was analytical modeling — "the models show adequate margins" adopted as an alternative explanation rather than direct test of the combined failure scenario. No subscale or full-scale test directly challenged the design's adequacy under combined cryogenic loading before the failure test. Options Released: whether the full-scale tank would maintain structural integrity under combined LOX/cryogenic/pressure loading.

---

### LD — PRESENT | HIGH

The composite LOX tank technology was at a development maturity level (TRL ~4–5) when it was incorporated into the X-33 vehicle design. The risk that system-scale behavior under combined loading differed from coupon-level characterization was accepted at program inception and transferred to the test phase. At the time of the failure, the vehicle had been designed around this tank — there was no alternative. The technology risk was displaced from the R&D domain (where continued characterization was the appropriate response) to the vehicle program (where the design was fixed and the risk had to be tested out).

---

### CDA — PRESENT | MODERATE

The materials science community's knowledge of cryogenic composite microcracking — documented in the composites literature and available to knowledgeable reviewers — was not admitted into the X-33 structural design acceptance process in a form that influenced the design verification approach. The IAT specifically noted that the failure mode was identifiable from existing literature. This constitutes a moderate CDA: the information existed in an adjacent domain and did not cross into the design verification decision context.

---

### WSP — ABSENT | HIGH

No documented pattern of individually sub-threshold signals accumulating across time periods. The failure mode (cryogenic microcracking) was not detectable in the pre-failure signal environment through standard monitoring.

---

### HCL — ABSENT | HIGH

Single program, single technology system. No independent domain parallel structure.

---

### FA — ABSENT | HIGH

The failure is attributable to a specific material-boundary verification gap. Multiple simultaneously degraded safety margins is not the characterization supported by the IAT Report.

---

## Construct Summary

| Construct | Determination | Confidence |
|-----------|--------------|------------|
| SI | PRESENT (SI-2) | HIGH |
| CR | PRESENT | HIGH |
| LD | PRESENT | HIGH |
| CDA | PRESENT | MODERATE |
| WSP | ABSENT | HIGH |
| HCL | ABSENT | HIGH |
| FA | ABSENT | HIGH |

**Primary constructs:** SI-2, CR, LD simultaneously — all three are co-primary  
**Secondary:** CDA  
**Absent:** WSP, HCL, FA

---

*Artifact B — T2-006 X-33 Reconstruction | FROZEN | 2026-06-02*
