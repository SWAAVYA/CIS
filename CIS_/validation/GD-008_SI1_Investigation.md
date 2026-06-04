# Governance Decision GD-008 — SI-1 Construct Investigation

**Decision ID:** GD-008  
**Status:** OPERATIVE — INVESTIGATION IN PROGRESS  
**Date:** 2026-06-02  
**Authority:** Artifact_C_Batch5_Comparison.md G4  
**Applies to:** All SI-1 coding from Batch 6 onward

---

## The Problem

SI-1 has been coded PRESENT in cases across all five batches. The G4 note in the Batch 5 comparison report states: "SI-1 is present in all 15 cases." If this is accurate, one of two things is true:

**Explanation A — Genuine universality:** Specification assumption mismatches are structurally present in nearly all complex-system failures. SI-1 identifies a real property but it is background structure rather than a discriminating construct.

**Explanation B — Over-coding:** The SI-1 definition is broad enough that any failure can be retrospectively framed as an assumption mismatch. SI-1 becomes equivalent to "failure occurred → some assumption was wrong" — which adds no information.

**The distinguishing question:** Can SI-1 be predicted ABSENT before reconstruction and have that prediction confirmed? A construct that cannot be predicted absent is not a discriminating construct.

---

## First Finding — The 15/15 Claim Is Overstated

Before investigating further, the first step is precision about the actual corpus state.

Reviewing the five batches, SI-1 was explicitly coded in the following cases:

| Batch | Case | SI coded | Sub-criterion |
|-------|------|----------|---------------|
| 1 | T1-002 MCO | PRESENT | SI-1 (unit convention specification assumption) |
| 1 | T1-003 Ariane 5 | PRESENT | SI-1 (reused software specification assumption) |
| 1 | T1-004 Columbia | PRESENT | SI-1 (in-family assessment specification assumption) |
| 2 | T1-005 DWH | PRESENT | SI-1 (cement integrity specification assumption) |
| 2 | T2-002 MPL | PRESENT | SI-1 (touchdown detection specification assumption) |
| 2 | T2-003 Genesis | PRESENT | SI-1 (sensor orientation specification assumption) |
| 3 | T1-001 Challenger | PRESENT | SI-1 (temperature range specification assumption) |
| 3 | T2-004 Mars Observer | PRESENT | SI-1 (mission profile specification assumption) |
| 3 | T2-005 NOAA-N Prime | PRESENT | SI-1 (fixture configuration specification assumption) |
| 4 | T2-006 X-33 | PRESENT | **SI-2** (boundary crossing) — not SI-1 |
| 4 | T2-007 AF447 | PRESENT | **SI-4** (multi-dimensional incongruence) — not SI-1 |
| 4 | T2-008 Überlingen | PRESENT | **SI-2** (cockpit interface coupling) — not SI-1 |
| 5 | T2-009 Therac-25 | PRESENT | SI-1 (software state assumption) |
| 5 | T2-010 Herald | PRESENT | SI-1 (crew compliance assumption) — **flagged** |
| 5 | T2-011 Swissair | PRESENT | SI-1 (material flammability assumption) |

**Corrected count:** SI-1 explicitly coded in 12 of 15 cases. SI was coded in all 15 cases, but sub-criteria SI-2 and SI-4 were the operative sub-criterion in Batches 4 (T2-006, T2-008, and T2-007 respectively). The G4 claim was imprecise.

**Revised problem statement:** SI-1 is coded in 12 of 15 cases. This is still very high. The concern stands.

---

## Second Finding — One SI-1 Coding Is Suspect

**T2-010 Herald of Free Enterprise — SI-1 MODERATE — flagged for review**

The Herald SI-1 was coded: "the operating procedure specification assumed crew compliance; the actual crew state violated this assumption."

The problem: "the specification assumed crew would follow it" is true of every operating procedure in every failure involving human non-compliance. If crew compliance is an "adjacent system" in the SI-1 sense, then SI-1 applies to any case with a human reliability component — which is most cases.

This is the over-coding risk in its clearest form. The Herald failure is CDA (bow door status not on bridge), CR (departure on assumption of closure), and FA (five simultaneously degraded conditions). SI-1 was added as a secondary code for the procedure assumption. But "procedure assumed crew would close doors" and "procedure assumed crew would comply" is not the same structural claim as "specification embedded a specific technical assumption about adjacent system behavior that was unverifiable at the time without direct test."

The distinction SI-1 is meant to capture: a specification that embeds a specific assumption about how an adjacent technical system behaves — an assumption that required verification against that system's actual behavior and that was accepted without such verification.

Human behavioral assumptions are different in kind from technical system assumptions:
- MCO: the specification assumed the navigation software would receive SI units — a specific technical interface assumption about a specific system property
- Herald: the procedure assumed a crew member would perform a task — a behavioral assumption about human reliability

Behavioral compliance assumptions are present in every procedure in every organization. If these code SI-1, then SI-1 is genuinely universal for any failure with human involvement.

**Determination for Herald SI-1:** The Herald SI-1 code should be reclassified. The CDA/CR/FA structure is the correct characterization. The "procedure assumed crew compliance" observation is a property of all procedural systems, not a specific specification-adjacent-system mismatch in the SI-1 sense. Herald SI-1 is over-coded.

**Revised corpus state after correction:** SI-1 explicitly coded in 11 of 15 cases. Still high.

---

## Third Finding — The Falsification Criterion

SI-1 is a discriminating construct if and only if there exist cases where:
1. Complex system failure occurred
2. SI-1 is ABSENT (no specification embedded an unverified technical assumption about adjacent system behavior that was violated)

The question is: what does such a case look like?

**Classes of cases where SI-1 should be ABSENT:**

**Class A — Pure execution error:** The specification is correct and verified. The failure is that an operator or system failed to execute a correct procedure. No specification-assumption mismatch is present because the specifications correctly captured the relevant system behavior; execution simply failed.

Example: a runway incursion where the pilot was correctly cleared for the correct runway, correctly briefed, and taxied on the wrong runway due to distraction or disorientation. The specifications are correct; the execution failed.

**Class B — Correct specification, changed conditions:** The specification assumption was verified and correct at the time of acceptance. Conditions subsequently changed and the specification was not updated. This is a maintenance/change management failure, not an original specification assumption mismatch.

Example: a bridge spec was correctly designed for the traffic load of 1960, never updated, and failed under 2000 traffic loads. At specification acceptance, the assumption was correct. SI-1 describes an original specification error, not a specification that became outdated.

**Class C — Natural hazard exceedance within specification:** A design was correctly specified for a defined hazard level (e.g., Category 4 hurricane). A Category 5 event exceeds the design envelope. The specification assumption (Category 4 is the design basis) was verified and accurate for the specified scope; the event exceeded the scope. This is not SI-1 unless the specification scope itself embedded a wrong assumption about the hazard frequency.

**Class D — Deliberate violation of correct specification:** A specification correctly describes safe operating parameters. An operator deliberately violates those parameters. No specification-assumption mismatch is present; the violation is intentional.

---

## Fourth Finding — The Verification Test

The specific criterion that separates SI-1 from "failure occurred" is the **verification test:**

SI-1 is PRESENT when: the specification embedded an assumption about adjacent system behavior AND a direct verification of that assumption against the adjacent system's actual behavior was practicable AND was not performed before specification acceptance.

SI-1 is ABSENT when:
- No specification exists at the relevant interface (CDA or LD may be more appropriate)
- The assumption was verified and confirmed at acceptance (but may have subsequently changed — not SI-1)
- The failure is execution error against a correct specification (CR, FA, or human reliability failure)
- The adjacent system is human behavioral compliance rather than a technical system with characterizable behavior

**The verification test applied to the existing corpus:**

| Case | Verification test — was verification practicable and absent? | SI-1 determination |
|------|-------------------------------------------------------------|---------------------|
| MCO | Yes — checking unit conventions across the AMD-JPL interface was practicable; it was not done | PRESENT — correct |
| Ariane 5 | Yes — revalidating SRI software against Ariane 5 trajectory was practicable; it was not done | PRESENT — correct |
| Challenger | Yes — testing O-ring performance at 29°F was practicable; it was not done | PRESENT — correct |
| Columbia | Partial — the in-family assessment assumption was not verified against actual TPS vulnerability for this specific strike; CR is also present | PRESENT MODERATE — correct |
| DWH | Yes — CBL verification of cement integrity was practicable; it was not done | PRESENT — correct |
| MPL | Yes — testing the leg deployment signal interpretation in touchdown detection software was practicable; it was not done | PRESENT — correct |
| Genesis | Yes — verifying sensor orientation enforcement by the housing was practicable; it was not done | PRESENT — correct |
| Mars Observer | Yes — characterizing propulsion behavior under Mars mission profile was practicable (though difficult); it was not done | PRESENT — correct |
| NOAA-N Prime | Yes — verifying fixture configuration before operation was practicable; it was not done | PRESENT — correct |
| Therac-25 | Yes — testing software behavior under race condition timing was practicable; it was not done (hardware interlocks would have verified this mechanically) | PRESENT — correct |
| **Herald** | **No — "verify that crew complies with procedures" is not a specification-adjacent-system verification; crew compliance is not a technical system with characterizable behavior that can be verified at acceptance** | **RECLASSIFY to ABSENT** |
| Swissair 111 | Yes — testing MPET flammability in the specific in-situ installation configuration was practicable; it was not done | PRESENT — correct |

**Corrected count:** SI-1 PRESENT in 11 of 15 cases; ABSENT in 4 (X-33 = SI-2, AF447 = SI-4, Überlingen = SI-2, Herald = reclassified ABSENT).

---

## Determination

**SI-1 is a genuine discriminating construct, not a universal coding artifact — with one important scope constraint.**

The corpus evidence at 11 of 15 cases is high but not universal once the scope is precisely applied. The Herald reclassification demonstrates that the verification test can exclude cases when applied carefully.

**The scope constraint that must be enforced from Batch 6 onward:**

SI-1 applies to technical specification assumptions about adjacent technical systems with characterizable behavior. It does not apply to:
- Human behavioral compliance assumptions embedded in procedures
- Assumptions about human reliability or human performance
- Assumptions about environmental conditions that are natural rather than engineered

These are better coded as CR (if a specific concern was raised and closed), CDA (if information about the adjacent domain's actual behavior was not admitted), or LD (if evaluation responsibility was displaced without adequate capacity).

**Is SI-1 background structure or genuinely explanatory?**

The 11-case prevalence suggests SI-1 describes a structural property of complex technical system failures that is very common — but not universal. The cases where it is absent (SI-2, SI-4, Herald) are coherent: they are cases where the failure mechanism is interface coupling (SI-2), multi-dimensional signal environment incongruence (SI-4), or pure admission and closure failure with no specification-assumption mismatch (Herald).

SI-1 is genuinely explanatory because it points to a specific intervention: verify the specification assumption against the adjacent system's actual behavior before accepting the specification. This intervention is different from the CR intervention (require direct disconfirmation before closing contradictions) and the CDA intervention (require formal cross-domain admission). A program that adds SI-1 verification to its review process would catch failures in a different place than a program that only applies CR and CDA governance.

---

## Amended Coding Rule — Effective Batch 6

**SI-1 coding requires all three conditions:**

1. A specification exists that embeds an assumption about how an adjacent technical system behaves
2. The adjacent system has characterizable behavior that could have been verified at specification acceptance
3. That verification was practicable and was not performed

**Explicitly excluded from SI-1:**

- Human behavioral compliance (crew will follow procedure; operator will perform task)
- Environmental assumptions about natural phenomena (weather, geology) that are not adjacent system specifications
- Assumptions that were verified and confirmed at acceptance but subsequently changed

**Note on Herald of Free Enterprise:** The Herald SI-1 code in T2-010 Artifact B is amended to ABSENT. The CDA/CR/FA structure remains unchanged. This amendment is retroactive to Artifact B T2-010 only; no other prior Artifact B documents require amendment.

---

## Program Construct State After GD-008

| Construct | Program status | Cases present (corrected) |
|-----------|---------------|--------------------------|
| CR | Strong support | 11/15 |
| HCL | Strong support | 7/15 |
| SI-1 | Genuine — not artifact — scope refined | 11/15 (Herald corrected to absent) |
| SI-2 | Emerging support | 3/15 |
| SI-3 | Boundary validated | 3/15 |
| SI-4 | Boundary validated | 2/15 |
| CDA | Strong support | 11/15 |
| LD | Moderate support | 10/15 |
| WSP | Moderate support | 8/15 |
| FA | Moderate support | 8/15 |

---

## Batch 6 Implication

Batch 6 must include at least one case where **SI-1 is predicted ABSENT at HIGH confidence** under the refined scope. This case should involve:
- Complex system failure (to establish the test is meaningful)
- No specification-assumption mismatch at a technical interface
- Failure mode is execution error, deliberate violation, or pure admission/closure failure

If the SI-1 ABSENT prediction survives reconstruction in such a case, the refined scope is validated. If reconstruction finds SI-1 despite the prediction, the scope requires further tightening.

---

*GD-008 | SI-1 Construct Investigation | 2026-06-02*  
*Determination: SI-1 is genuine, not an artifact. Scope refined to exclude human behavioral compliance. Herald T2-010 SI-1 corrected to ABSENT. Batch 6 must include SI-1 ABSENT HIGH test case.*
