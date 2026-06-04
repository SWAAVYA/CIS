# Governance Decision GD-007 — SI-3 / CR Boundary Definition

**Decision ID:** GD-007  
**Status:** OPERATIVE  
**Date:** 2026-06-02  
**Authority:** Artifact_C_Batch4_Comparison.md — first HIGH-confidence disconfirmation in the program  
**Applies to:** All Track A coding from Batch 5 onward; Coder Workbook (A-07) amendment required before Batch 5  

---

## Trigger

Batch 4 produced the program's first disconfirmation of a HIGH-confidence prediction.

**Case:** T2-007 (Air France Flight 447)  
**Prediction:** SI-3 PRESENT HIGH — fleet-wide pitot icing pattern not formally aggregated before AF447  
**Finding:** ABSENT — pattern was formally aggregated; EASA AD 2009-0043 issued in response to accumulated incident history  
**Reconstruction conclusion:** The failure is in response adequacy, not in aggregation. CR, not SI-3.

The disconfirmation exposed an ambiguous boundary between SI-3 and CR that is consequential for coding decisions. GD-007 resolves that ambiguity.

---

## The Boundary

### SI-3: Aggregation Absent

Code SI-3 when a pattern of individually sub-threshold signals accumulates across observation periods WITHOUT the pattern being formally recognized and assessed as a pattern.

The signals exist. They are individually managed. No mechanism connects them into an aggregate assessment. The pattern is structurally present in the data but is not present in the program's analytical framework.

**The operative condition:** The aggregate pattern has not entered the governed analytical process.

**Intervention implied:** Build an aggregation mechanism. The pattern cannot be acted on because it has not been recognized as a pattern.

---

### CR: Aggregation Present, Adequacy Assumed

Code CR — not SI-3 — when the pattern has been formally aggregated AND assessed AND a response has been produced AND the response was closed as adequate without direct disconfirmation of adequacy.

The signals exist. The pattern is recognized. A formal response is generated (a recommendation, a review, an advisory, a policy). The response is assessed as sufficient. Closure is made by assumption — "this response addresses the risk" — without direct test of whether the response actually reduces the risk to the required level. Options Released: the response that would have been required if adequacy had been directly tested rather than assumed.

**The operative condition:** The pattern entered the governed analytical process and received a response whose adequacy was assumed rather than tested.

**Intervention implied:** Require direct disconfirmation of response adequacy before closure. The pattern is recognized; the question is whether the response is sufficient.

---

## Coding Decision Rule

**At the point of coding, ask one question:**

> Was the pattern formally recognized and assessed before the outcome?

| Answer | Code |
|--------|------|
| No — pattern was not recognized as a pattern | SI-3 |
| Yes — pattern was recognized; a response was generated | Do not code SI-3; assess CR instead |

**If the answer is Yes, assess CR:**

> Was the response to the recognized pattern closed as adequate without direct disconfirmation of adequacy?

| Answer | Code |
|--------|------|
| Yes — adequacy was assumed; no direct test was applied | CR PRESENT |
| No — adequacy was directly tested and confirmed | CR ABSENT |

---

## AF447 Applied

- Pitot icing pattern: YES, formally recognized (AD 2009-0043 issued) → SI-3 ABSENT
- AD response closed as adequate (recommendation is sufficient): YES, without direct test of whether voluntary compliance reduces risk → CR PRESENT

The prediction of SI-3 PRESENT HIGH was wrong because the aggregation condition was not verified before prediction. Lesson: before coding SI-3, confirm that no formal recognition event (AD, policy, review, investigation) occurred in response to the pattern.

---

## Consequence for Prior Case Review

T2-007 AF447 is the only case in the program where SI-3 was coded and this distinction matters. All other SI-3 absences in the program were coded absent for different reasons (no temporal pattern present). No retroactive amendments to prior Artifact B documents required.

---

## Required Amendment Before Batch 5

**Coder Workbook (A-07) — Section: SI Sub-Criteria:**

Add to SI-3 coding guidance:

> *Before coding SI-3 PRESENT, confirm that no formal recognition event (airworthiness directive, safety advisory, investigation report, policy response) was produced in response to the pattern during the Pre-Decision Phase. If a formal recognition event exists, the operative construct is CR (assess whether the response was closed as adequate without direct disconfirmation of adequacy). SI-3 requires that the aggregate pattern did not enter the governed analytical process. If it entered and received a response, code CR.*

---

## Summary

| | Aggregation absent | Aggregation present, adequacy assumed |
|--|--|--|
| **Code** | SI-3 | CR |
| **Pattern recognized?** | No | Yes |
| **Intervention** | Build aggregation mechanism | Require response adequacy testing |
| **Options Released** | The aggregate risk assessment | The adequate response |

---

*GD-007 | SI-3 / CR Boundary | 2026-06-02 | Operative from Batch 5 | Purchased by T2-007 SI-3 disconfirmation*
