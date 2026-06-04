# Artifact C — Batch 4 Comparison Report (Adversarial)

**Artifact type:** Artifact C  
**Batch:** 4  
**Cases:** T2-006 (X-33), T2-007 (Air France 447), T2-008 (Überlingen)  
**Status:** FROZEN  
**Date:** 2026-06-02  
**Design:** Adversarial — zero UNCERTAIN predictions, 16 HIGH confidence predictions, all falsifiable

---

## Comparison Matrix

| Case | Construct | Predicted | Found | Result |
|------|-----------|-----------|-------|--------|
| T2-006 | CR | PRESENT HIGH | PRESENT | CONFIRMED |
| T2-006 | WSP | ABSENT HIGH | ABSENT | CONFIRMED |
| T2-006 | SI (SI-2) | PRESENT HIGH | PRESENT | CONFIRMED |
| T2-006 | HCL | ABSENT HIGH | ABSENT | CONFIRMED |
| T2-006 | CDA | PRESENT MODERATE | PRESENT | CONFIRMED |
| T2-006 | LD | PRESENT HIGH | PRESENT | CONFIRMED |
| T2-006 | FA | ABSENT HIGH | ABSENT | CONFIRMED |
| T2-007 | CR | PRESENT HIGH | PRESENT | CONFIRMED |
| T2-007 | WSP | PRESENT HIGH | PRESENT | CONFIRMED |
| **T2-007** | **SI-3** | **PRESENT HIGH** | **ABSENT** | **DISCONFIRMED** |
| T2-007 | SI-4 | PRESENT HIGH | PRESENT | CONFIRMED |
| T2-007 | LD | ABSENT HIGH | ABSENT | CONFIRMED |
| T2-007 | HCL | ABSENT HIGH | ABSENT | CONFIRMED |
| T2-007 | CDA | ABSENT HIGH | ABSENT | CONFIRMED |
| T2-007 | FA | PRESENT HIGH | PRESENT | CONFIRMED |
| T2-008 | CR | PRESENT HIGH | PRESENT | CONFIRMED |
| T2-008 | WSP | ABSENT HIGH | ABSENT | CONFIRMED |
| T2-008 | SI (SI-2) | PRESENT MODERATE | PRESENT | CONFIRMED |
| T2-008 | HCL | ABSENT HIGH | ABSENT | CONFIRMED |
| T2-008 | CDA | ABSENT HIGH | ABSENT | CONFIRMED |
| T2-008 | LD | ABSENT HIGH | ABSENT | CONFIRMED |
| T2-008 | FA | PRESENT MODERATE | PRESENT | CONFIRMED |

---

## FCR Calculation

| Case | Confirmed | Disconfirmed | Valid | FCR |
|------|-----------|--------------|-------|-----|
| T2-006 | 7 | 0 | 7 | **1.000** |
| T2-007 | 7 | 1 | 8 | **0.875** |
| T2-008 | 7 | 0 | 7 | **1.000** |
| **Batch 4** | **21** | **1** | **22** | **0.955** |

---

## The Disconfirmation — SI-3 in T2-007

**Prediction:** SI-3 PRESENT HIGH — the fleet-wide pitot icing pattern across 2003–2009 was not formally aggregated into a systemic risk assessment before AF447.

**Finding:** ABSENT — the pattern was formally aggregated. The February 2009 EASA Airworthiness Directive was issued in direct response to the accumulated pitot icing event history. The AD is evidence of formal pattern recognition. The failure was not absence of aggregation (which SI-3 requires) but inadequate response to the aggregated assessment — a recommendation rather than a mandatory requirement.

**What the disconfirmation reveals:**

The AF447 pre-flight failure is a CR event, not an SI-3 event. The aggregate pattern was recognized and produced a formal regulatory response. That response was closed as "recommendation is sufficient" — an alternative explanation adoption — without direct testing of whether voluntary compliance with a recommendation was adequate given the actual risk. Options Released: mandatory pitot tube replacement.

**The distinction that the disconfirmation makes precise:** SI-3 describes failure of pattern aggregation. CR describes inadequate response to a recognized pattern. These are adjacent failure modes that the program had not previously separated with this precision. The AF447 case is the first case in the program where SI-3 was predicted and the reconstruction required distinguishing between the two. The distinction is real and consequential: the intervention required for SI-3 (build an aggregation mechanism) differs from the intervention required for CR (require direct disconfirmation before closing recognized risks with recommendations).

**What this means for the framework:** SI-3 has a cleaner boundary than the program previously understood. SI-3 applies when the pattern is not formally aggregated. When the pattern IS aggregated but the response is inadequate, the operative construct is CR. This boundary was not empirically tested before Batch 4.

---

## Case-Level Notes

### T2-006 — X-33

Full confirmation. FCR = 1.000. Three co-primary constructs simultaneously confirmed at HIGH: SI-2, CR, LD.

The X-33 case is the first case in the program where SI-2, CR, and LD are all primary simultaneously. This co-occurrence structure is significant: the design boundary verification gap (SI-2) was what allowed the design to be accepted with unresolved concerns (CR) and the technology risk to be transferred to the test phase (LD). The three constructs are structurally linked — SI-2 is the mechanism, CR and LD are the governance failures that allowed SI-2 to persist unresolved.

SI-2 confirmation at HIGH is the first clean HIGH-confidence SI-2 confirmation in the program. The materials knowledge about cryogenic microcracking crossed from the materials science domain into the structural design verification without adequate verification that the knowledge remained valid at system scale under combined loading. This is the SI-2 mechanism in its most precise form.

### T2-007 — Air France 447

FCR = 0.875. First disconfirmation in the program.

SI-3 was predicted PRESENT HIGH. The reconstruction found the fleet event pattern was formally aggregated (AD issued). SI-3 is ABSENT. The failure is CR at the regulatory level — inadequate response to a recognized risk.

SI-4 confirmed at MODERATE (predicted HIGH). The multi-dimensional signal configuration during the descent is real. MODERATE confidence in the finding is correct given the partial reducibility to a single cause. The prediction at HIGH may have overstated confidence.

Two constructs confirmed that were not in prior batches in this form: CR at the regulatory level (pre-decision phase CR event involving a recommendation rather than mandatory action closing a formally recognized aggregate risk) and FA at HIGH for the combined operational conditions of the flight.

### T2-008 — Überlingen

Full confirmation. FCR = 1.000.

SI-2 confirmed at MODERATE. The flight director's simultaneous descent command while the TCAS RA commanded climb is the specific interface coupling failure. The BFU identifies this as a contributing factor. The MODERATE confidence was appropriate — the TCAS priority rule was also known, creating genuine ambiguity between SI-2 and individual non-compliance (CR-only).

CR remains the primary construct — the clearest CR event in Batch 4. TCAS RA correct, crew followed ATC, TCAS option released.

---

## Cumulative Program FCR

| Batch | Cases | FCR | Disconfirmations |
|-------|-------|-----|-----------------|
| Batch 1 | T1-002, T1-003, T1-004 | 0.933 | 1 (CDA in T1-002, unresolved) |
| Batch 2 | T1-005, T2-002, T2-003 | 0.933 | 1 (CR in T2-003, partial) |
| Batch 3 | T1-001, T2-004, T2-005 | 1.000 | 0 |
| Batch 4 | T2-006, T2-007, T2-008 | **0.955** | **1 (SI-3 in T2-007, HIGH confidence)** |
| **Program** | **12 cases** | **~0.955** | |

---

## Governance Determinations

**G1 — Program continuation:** CONTINUE. Batch 4 FCR = 0.955. No failure conditions met.

**G2 — First HIGH-confidence disconfirmation confirmed:** The adversarial design functioned. SI-3 was predicted PRESENT HIGH and found ABSENT. This is the program's first disconfirmation of a HIGH-confidence prediction. The disconfirmation is informative rather than damaging — it reveals a real distinction (SI-3 vs. CR at the regulatory level) that the framework needed to make explicit.

**G3 — SI sub-criterion boundary established:** Batch 4 has empirically tested three SI sub-criteria for the first time at HIGH confidence:
- SI-2: CONFIRMED in T2-006 (HIGH) and T2-008 (MODERATE)
- SI-3: DISCONFIRMED in T2-007 — boundary with CR now precise
- SI-4: CONFIRMED in T2-007 at MODERATE

The SI sub-criterion differentiation is now empirically grounded for the first time. SI-1 has been present in all 12 cases. SI-2 survives in the first two tests at HIGH and MODERATE. SI-3 has a clear boundary. SI-4 survives at MODERATE.

**G4 — GD recommendation:** Produce a governance decision (GD-007) documenting the SI-3/CR boundary distinction established by T2-007. The distinction — SI-3 applies when pattern is not formally aggregated; CR applies when pattern is aggregated but response is inadequate — should be incorporated into the coding workbook before Batch 5.

**G5 — Batch 5 design implication:** The program has now tested SI-1 through SI-4 across 12 cases with varying confidence. The next informative design question: can the framework predict ABSENT at HIGH confidence and be correct? All ABSENT-HIGH predictions in Batch 4 confirmed. This is confirmation of the framework's discriminant validity — it is not simply predicting PRESENT for everything.

---

*Artifact C — Batch 4 Comparison Report | FROZEN | 2026-06-02*  
*FCR: 0.955 | 1 disconfirmation (SI-3, HIGH, T2-007) | G1: CONTINUE | GD-007 recommended*
