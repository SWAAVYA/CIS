# Artifact C — Batch 6 Comparison Report (SI-1 Falsification)

**Batch:** 6 | **Status:** FROZEN | **Date:** 2026-06-02

---

## Comparison Matrix

| Case | Construct | Predicted | Found | Result |
|------|-----------|-----------|-------|--------|
| T2-012 | SI-1 | ABSENT HIGH | ABSENT | CONFIRMED |
| T2-012 | CR | ABSENT HIGH | ABSENT | CONFIRMED |
| T2-012 | WSP | ABSENT HIGH | ABSENT | CONFIRMED |
| T2-012 | HCL | ABSENT HIGH | ABSENT | CONFIRMED |
| T2-012 | CDA | ABSENT HIGH | ABSENT | CONFIRMED |
| T2-012 | LD | ABSENT HIGH | ABSENT | CONFIRMED |
| T2-012 | FA | PRESENT HIGH | PRESENT | CONFIRMED |
| **T2-013** | **SI-1** | **ABSENT HIGH** | **PRESENT** | **DISCONFIRMED** |
| T2-013 | CR | ABSENT HIGH | ABSENT | CONFIRMED |
| T2-013 | WSP | PRESENT HIGH | PRESENT | CONFIRMED |
| T2-013 | HCL | ABSENT HIGH | ABSENT | CONFIRMED |
| T2-013 | CDA | ABSENT HIGH | ABSENT | CONFIRMED |
| T2-013 | LD | PRESENT MODERATE | PRESENT | CONFIRMED |
| T2-013 | FA | PRESENT MODERATE | PRESENT | CONFIRMED |
| T2-014 | SI-1 | ABSENT HIGH | ABSENT | CONFIRMED |
| T2-014 | CR | PRESENT MODERATE | PRESENT | CONFIRMED |
| T2-014 | WSP | ABSENT HIGH | ABSENT | CONFIRMED |
| T2-014 | HCL | PRESENT MODERATE | PRESENT | CONFIRMED |
| T2-014 | CDA | PRESENT HIGH | PRESENT | CONFIRMED |
| T2-014 | LD | PRESENT HIGH | PRESENT | CONFIRMED |
| T2-014 | FA | PRESENT MODERATE | PRESENT | CONFIRMED |

---

## FCR

| Case | Confirmed | Disconfirmed | Valid | FCR |
|------|-----------|--------------|-------|-----|
| T2-012 | 7 | 0 | 7 | **1.000** |
| T2-013 | 6 | 1 | 7 | **0.857** |
| T2-014 | 7 | 0 | 7 | **1.000** |
| **Batch 6** | **20** | **1** | **21** | **0.952** |

**Program total: 118/123 = 0.959 | 5 disconfirmations across 18 cases**

---

## The Disconfirmation — Aloha 243, SI-1 ABSENT predicted, PRESENT found

**What was predicted:** SI-1 ABSENT HIGH. The Boeing 737 inspection specification was correct within its validated scope. Aloha's decision to operate beyond the DSO is LD, not SI-1.

**What the reconstruction found:** SI-1 PRESENT MODERATE. The inspection specification embedded an assumption about detection adequacy — specifically, that its visual and eddy current inspection methods could detect the relevant failure modes in a high-cycle aircraft. This assumption was not verified for multi-site fatigue damage as a failure mode. Multi-site damage, where numerous small cracks coalesce across a wide area of the lap joint, is qualitatively different from the single-crack growth for which the inspection intervals were calibrated. The assumption that the methodology could detect multi-site damage was never specifically validated, independent of the DSO question.

**What the disconfirmation reveals:**

The LD/SI-1 distinction is real but the boundary is finer than the GD-008 formulation specified. GD-008 distinguished: specification wrong at acceptance (SI-1) vs. operator applied specification beyond its validated scope (LD). The Aloha reconstruction shows a third condition: the specification was correct for its intended failure mode (single-crack detection) but embedded an unverified assumption about its adequacy for a different failure mode (multi-site damage) that the high-cycle environment produced. This is neither pure SI-1 (the specification wasn't wrong in principle) nor pure LD (the failure mode issue exists at all cycle counts, not just post-DSO).

The disconfirmation is productive. It reveals a sub-class of SI-1 not previously identified: **methodology adequacy assumption failure** — where a testing or inspection methodology embeds an assumption about its detection capability for a specific failure mode that was never verified. This is distinct from the design specification assumption failures in the prior corpus (MCO, Ariane 5, Genesis, etc.). It is still SI-1 under the verification test, but it is a different instantiation.

**SI-1 scope implication:** The GD-008 LD/SI-1 boundary needs one additional clause:

> An inspection or testing methodology specification that assumes its detection methods are adequate for a specific failure mode, where that assumption was not verified for the failure mode actually present, qualifies as SI-1 regardless of whether the associated system is operating within or beyond its design service objective.

**What the other two SI-1 ABSENT predictions show:**

Comair 5191 (T2-012): SI-1 ABSENT confirmed cleanly. Pure execution failure with correctly specified systems. The framework correctly codes SI-1 absent when the failure is attentional and procedural.

ValuJet 592 (T2-014): SI-1 ABSENT confirmed. The cargo specification was correct; wrong information was admitted (CDA). The falsification condition was not met — the specification did not embed an assumption about independent verification capability that didn't exist.

---

## SI-1 Falsification Scorecard

| Case | SI-1 predicted | SI-1 found | Result | Mechanism |
|------|---------------|------------|--------|-----------|
| T2-012 Comair | ABSENT HIGH | ABSENT | ✓ CONFIRMED | Pure execution; human navigation excluded |
| **T2-013 Aloha** | **ABSENT HIGH** | **PRESENT** | **✗ DISCONFIRMED** | **Inspection methodology adequacy assumption** |
| T2-014 ValuJet | ABSENT HIGH | ABSENT | ✓ CONFIRMED | CDA/LD; specification was correct |

**2 of 3 SI-1 ABSENT predictions survived. 1 failed.**

The failure is informative — it identifies a new sub-class of SI-1. The two survivals demonstrate that SI-1 can be correctly predicted absent in cases with real organisational and systemic failure.

---

## Governance Determinations

**G1 — Program continuation:** CONTINUE. Batch 6 FCR = 0.952. Program FCR = 0.959.

**G2 — SI-1 is a genuine discriminating construct with refined scope:**

The Batch 6 test produces a decisive result on the GD-008 question. SI-1:
- Is correctly predicted ABSENT in cases of pure execution failure (Comair)
- Is correctly predicted ABSENT in cases where the specification was correct and CDA/LD are the operative constructs (ValuJet)
- Is incorrectly predicted ABSENT in a case where an inspection methodology embedded an unverified detection adequacy assumption (Aloha)

The disconfirmation refines the scope rather than defeating the construct. SI-1 applies to methodology specifications as well as design specifications. The construct is genuine and discriminating — it can be predicted absent and the prediction can fail, which means it can also be predicted present and the prediction can succeed.

**G3 — GD-008 amendment required:** Add methodology adequacy clause to SI-1 scope. A testing or inspection methodology's assumption about its detection adequacy for a specific failure mode qualifies as SI-1 when that assumption is unverified, independent of whether the system is within design service objectives.

**G4 — Program construct state stabilised:**

| Construct | Status after Batch 6 |
|-----------|---------------------|
| CR | Strong — absent confirmed in Swissair and Comair |
| HCL | Strong — multi-domain, multi-context |
| SI-1 | Genuine — scope refined to include methodology adequacy; can be predicted absent |
| SI-2 | Emerging — two confirmations |
| SI-3 | Boundary validated bidirectionally |
| SI-4 | Boundary validated |
| CDA | Strong — absent confirmed in pure execution cases |
| LD | Strong — primary in Mars Observer, ValuJet |
| WSP | Solid — primary in Therac-25, Aloha |
| FA | Solid — present in multi-condition cases, absent in single-mechanism cases |

---

*Artifact C — Batch 6 Comparison | FROZEN | 2026-06-02*  
*FCR 0.952 | SI-1 falsification: 2/3 ABSENT confirmed, 1 disconfirmed (Aloha — methodology adequacy sub-class identified) | Construct status stabilised across all ten constructs*
