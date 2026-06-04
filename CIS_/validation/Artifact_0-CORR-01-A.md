# Artifact 0-CORR-01-A — SI Classification Amendment

**Artifact ID:** A-01-CORR-01-A  
**Category:** GOV — Governance correction  
**Status:** OPERATIVE  
**Date:** 2026-06-02  
**Authority basis:** CR_RC3_Determinations.md RC3-001 — RC-3 domain resolution confirming SI as foundational primitive  
**Supersedes in part:** A-01-CORR-01 (SI FCR entry conditions)  
**Amends:** A-21 (SI_Vocabulary_Review, GD-006 Condition C)  
**Parent artifacts:** CR_RC3_Determinations.md; EE_SI_THEORY_v1.0; CIS_SLS_v1.0

---

## Purpose

A-01-CORR-01 resolved a contradiction (CR-001) under RP-4 conditions — Signal B (EE_SI_THEORY, CIS_SLS specification) was not available at the time of resolution. CR_RC3_Determinations RC3-001 applies RC-3 with both signals available and finds Signal B correct. This document amends A-01-CORR-01 accordingly.

---

## Section 1 — Rescinded Determination

**From A-21 (SI_Vocabulary_Review), GD-006 Condition C:**

> SI is classified as a Derived Construct (Tier B). Before SI can contribute to FCR, sub-criteria SI-1 through SI-4 must be coded and SI must be confirmed as meeting at least one sub-criterion.

**This classification is rescinded.**

**Basis for rescission:** A-21 classified SI based on its frequency as a primary explanation in Track A retrospective case coding. EE_SI_THEORY_v1.0 and CIS_SLS_v1.0 establish SI's architectural position as the foundational detection primitive from which Signal Pool admission is derived. A-21 addressed SI's explanatory prominence in case analysis. EE_SI_THEORY and SLS address SI's architectural position. These are different questions. SI's lower frequency as primary explanation in Track A cases does not make SI derivative. RC3-001 accepts the architectural position as determinative.

---

## Section 2 — Operative Determinations

**Determination 1 — SI structural position:**

SI (Structural Incongruence) is a foundational detection primitive. Its architectural position is established by EE_SI_THEORY_v1.0 and operationalized in CIS_SLS_v1.0 Section 9 as the primary Signal Pool admission criterion. The Derived Construct (Tier B) classification is replaced with: **Foundational Primitive.**

**Determination 2 — Sub-criteria SI-1 through SI-4:**

Sub-criteria SI-1 through SI-4 (from A-21) are retained as Track A Artifact B coding guidance. Their function is to document what is present when SI is coded in a reconstruction — they specify what the coder should record. They are not conditions on whether SI qualifies as a construct.

Sub-criteria definitions (retained from A-21, reframed as coding guidance):

- **SI-1 (Specification assumption mismatch):** The observation involves a specification containing an assumption about an adjacent system that does not match that system's actual behavior. Code when the SI signal arises from a specification-reality gap.
- **SI-2 (Interface coupling failure):** The observation involves information or load crossing an organizational or technical boundary without adequate structural verification. Code when the SI signal arises at a domain boundary.
- **SI-3 (Temporal accumulation):** The observation involves a pattern of sub-threshold signals accumulating across periods. Code when the SI signal requires multi-period evidence.
- **SI-4 (Configuration incongruence):** The observation involves multiple dimensions simultaneously approaching constraint limits in a configuration inconsistent with the classified state. Code when the SI signal is a cross-dimensional structural pattern.

At least one sub-criterion must be coded for each SI observation in Artifact B. This requirement is retained — not as a qualification for SI construct status but as a documentation standard ensuring Artifact B records are specific about what type of structural incongruence was present.

**Determination 3 — SI FCR entry:**

SI observations coded in Batch 3 and subsequent batches are FCR-eligible without Tier qualification. Observations must carry at least one coded sub-criterion (per Determination 2) but this is a documentation requirement, not an FCR eligibility condition.

**Determination 4 — SI-FCR tracking:**

Separate FCR tracking for SI (SI-FCR) is retained from A-01-CORR-01. SI-FCR tracks prediction accuracy specifically for SI-coded observations across Batches 3 onward. This tracking is useful as a calibration instrument and does not imply SI is derivative.

---

## Section 3 — Batch 3 Implications

Batch 3 coding proceeds with SI as a foundational construct. Coders document SI using sub-criteria SI-1 through SI-4 as coding guidance. SI observations are FCR-eligible from first appearance. SI-FCR is tracked separately for calibration purposes.

No changes to WSP, CDA, CR, FLT, or EES coding procedures.

---

## Section 4 — Register Updates Required

| Document | Required update |
|----------|----------------|
| A-21 (SI_Vocabulary_Review) | Amendment note referencing this document; Derived Construct classification notation amended |
| A-01-CORR-01 | Superseded in part by this document; cross-reference to A-01-CORR-01-A added |
| M-09 (Version Control Register) | Register A-01-CORR-01-A as new governance artifact |
| Track_A_Protocol_Clarification_Addendum_v3 (A-27) | Any reference to SI as Derived Construct requires amendment |

---

*Artifact 0-CORR-01-A | GOV | 2026-06-02 | SI foundational primitive confirmed; sub-criteria retained as coding guidance; FCR eligibility unconditional*
