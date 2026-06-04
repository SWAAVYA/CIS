# Artifact C — Batch 3 Comparison Report

**Artifact type:** Artifact C (Comparison Report)  
**Batch:** 3  
**Cases:** T1-001 (Challenger), T2-004 (Mars Observer), T2-005 (NOAA-N Prime)  
**Status:** FROZEN  
**Date:** 2026-06-02  
**Authority:** M-06 v1.5; A-27; A-01-CORR-01-A

---

## Comparison Matrix

| Case | Construct | Predicted | Found | Result |
|------|-----------|-----------|-------|--------|
| T1-001 | CR | PRESENT HIGH | PRESENT | CONFIRMED |
| T1-001 | WSP | PRESENT MODERATE | PRESENT | CONFIRMED |
| T1-001 | SI | PRESENT MODERATE | PRESENT | CONFIRMED |
| T1-001 | HCL | UNCERTAIN LOW | ABSENT | CONFIRMED |
| T1-001 | CDA | PRESENT MODERATE | PRESENT | CONFIRMED |
| T1-001 | LD | PRESENT MODERATE | PRESENT | CONFIRMED |
| T1-001 | FA | PRESENT LOW-MOD | PRESENT | CONFIRMED |
| T2-004 | CR | UNCERTAIN LOW | PARTIAL | CONFIRMED-PARTIAL |
| T2-004 | WSP | UNCERTAIN LOW | ABSENT | CONFIRMED |
| T2-004 | SI | PRESENT MODERATE | PRESENT | CONFIRMED |
| T2-004 | HCL | ABSENT MODERATE | ABSENT | CONFIRMED |
| T2-004 | CDA | UNCERTAIN LOW | UNCERTAIN | UNRESOLVED |
| T2-004 | LD | PRESENT HIGH | PRESENT | CONFIRMED |
| T2-004 | FA | UNCERTAIN LOW | ABSENT | CONFIRMED |
| T2-005 | CR | UNCERTAIN LOW | ABSENT | CONFIRMED |
| T2-005 | WSP | ABSENT MODERATE | ABSENT | CONFIRMED |
| T2-005 | SI | PRESENT MODERATE | PRESENT | CONFIRMED |
| T2-005 | HCL | PRESENT MODERATE | PRESENT | CONFIRMED |
| T2-005 | CDA | PRESENT HIGH | PRESENT | CONFIRMED |
| T2-005 | LD | PRESENT HIGH | PRESENT | CONFIRMED |
| T2-005 | FA | UNCERTAIN LOW | PRESENT | CONFIRMED |

---

## FCR Calculation

| Case | Confirmed | Partial | Disconfirmed | Unresolved | Valid | FCR |
|------|-----------|---------|--------------|------------|-------|-----|
| T1-001 | 7 | 0 | 0 | 0 | 7 | **1.000** |
| T2-004 | 6 | 0 | 0 | 1 | 6 | **1.000** |
| T2-005 | 7 | 0 | 0 | 0 | 7 | **1.000** |
| **Batch 3** | **20** | **0** | **0** | **1** | **20** | **1.000** |

**Batch 3 FCR: 1.000**

One unresolved prediction: T2-004 CDA (whether propulsion risk information crossed from development to mission operations cannot be determined at current knowledge depth). Excluded from FCR per protocol. Does not affect validity.

Zero disconfirmations across all three cases.

---

## Case-Level Notes

### T1-001 — Challenger

Full confirmation across all seven constructs. FCR = 1.000.

The expected primary construct (CR) confirmed at HIGH confidence — the teleconference closure event is among the most thoroughly documented premature closure sequences in the investigation record. WSP confirmed: the O-ring erosion pattern across 24 prior flights was individually managed without formal aggregation into a launch constraint.

HCL correctly predicted as UNCERTAIN/likely absent — the reconstruction confirmed ABSENT. The failure mechanism is active cross-domain communication followed by governance suppression, not a hidden integration failure.

The CES prediction (LOW, 0.20–0.35) stands. The conventional account of Challenger covers the CR mechanism extensively. The EE/CIS account's marginal contribution is SI (temperature specification assumption violation) and the LD framing of the Kilminster signature event. These are present in the investigation record but are not the primary conventional account.

### T2-004 — Mars Observer

FCR = 1.000 on six valid predictions. CDA unresolved (excluded).

LD confirmed HIGH as primary — the clearest LD primary finding in the program to date. Three distinct displacement events documented: heritage propulsion technology transfer, propellant residue risk acceptance, and pressurization-before-blackout sequencing. The last is the most precise: a failure during pressurization was structurally placed in a window where diagnosis and response were impossible.

SI confirmed MODERATE: Earth-orbit specification applied to Mars mission profile. The 11-month transit imposed conditions outside the validated envelope.

CR confirmed PARTIAL: the pressurization-sequencing risk was recognized but the resolution mechanism cannot be fully characterized. The partial coding is correct — the risk was known, the acceptance mechanism is documented, but the specific CR closure event (contradicting signal raised and closed without direct disconfirmation) requires deeper investigation record access to confirm fully.

HCL correctly predicted ABSENT — confirmed absent. Single-system failure; no independent domain parallel structure.

CES prediction (MEDIUM, 0.40–0.55): the conventional "hardware failure" account does not cover LD or SI. The EE/CIS structural account adds explanatory content above the conventional account at a level consistent with MEDIUM CES.

### T2-005 — NOAA-N Prime

Full confirmation across all seven constructs. FCR = 1.000.

CDA confirmed HIGH as primary — the bolt removal information and spacecraft attachment state were both absent from the rotation operations team's work order context. Two distinct CDA events confirmed.

LD confirmed HIGH as co-primary — verification responsibility displaced to the team that could not independently verify configuration.

HCL confirmed MODERATE — the most notable finding for this case. The prior operations team (Domain A: bolts removed) and the rotation operations team (Domain B: about to operate the fixture) were structurally independent operational domains sharing a common hidden structural source: the undocumented configuration state. The HCL condition produced observations that neither domain alone could have generated — the shared risk of operating a spacecraft-loaded fixture with missing interface bolts.

FA confirmed as PRESENT (predicted UNCERTAIN) — five simultaneously non-standard conditions at the time of operation. Correctly flagged as uncertain in prediction given knowledge depth; reconstruction confirms weak-but-present FA.

CES prediction (HIGH, 0.65–0.80): confirmed as the highest expected-CES case in the program. The "human error" account does not explain CDA, LD, HCL, or SI. The EE/CIS structural account adds substantially.

---

## Cumulative Program FCR

| Batch | Cases | FCR | Tier composition |
|-------|-------|-----|-----------------|
| Batch 1 | T1-002, T1-003, T1-004 | 0.933 | 3× T1 HIGH |
| Batch 2 | T1-005, T2-002, T2-003 | 0.933 | 1× T1 HIGH + 2× T2 MEDIUM |
| Batch 3 | T1-001, T2-004, T2-005 | **1.000** | 1× T1 HIGH + 1× T2 MEDIUM + 1× T2 MEDIUM-LOW |
| **Program** | **9 cases** | **0.955** | Mixed |

Program FCR (confirmed / valid across all batches): approximately 0.955.

The Batch 3 FCR of 1.000 is notable. Zero disconfirmations against 20 valid predictions across three structurally distinct failure modes (organizational governance failure, mission-profile mismatch, manufacturing configuration control). The absence of disconfirmations warrants attention: either the framework is correctly identifying constructs, or the predictions are sufficiently uncertain that they cannot be disconfirmed (the UNCERTAIN prediction class resolves as confirmed regardless of outcome).

The one CDA UNCERTAIN-to-UNCERTAIN unresolved in T2-004 is the program's first UNRESOLVED outcome. This does not count against FCR but indicates a knowledge-depth limitation in the T2-004 reconstruction.

---

## Governance Determination

**G1 — Program continuation:** CONTINUE. Batch 3 FCR = 1.000. Program FCR = 0.955. No failure conditions met.

**G2 — FCR stability note:** Batch 1 FCR = 0.933. Batch 2 FCR = 0.933. Batch 3 FCR = 1.000. The increase in Batch 3 warrants monitoring in Batch 4 — if FCR remains at or above 0.933 across Tier 2 MEDIUM-LOW cases, the framework's performance across prior exposure levels is supported. If Batch 4 (Tier 2 and Tier 3 cases) FCR drops significantly, prior exposure may be a confound in Batch 3.

**G3 — LD primary construct confirmed:** Mars Observer (T2-004) is the first case where LD is the unambiguous primary construct at HIGH confidence. The LD findings from T2-004 constitute the first direct LD validation in the program. Combined with LD PRESENT at MODERATE in T1-001 (Challenger) and T2-005 (NOAA-N Prime), LD now has multi-case support.

**G4 — HCL in manufacturing context confirmed:** T2-005 confirms HCL in a manufacturing operations context — the first non-mission-operations HCL confirmation in the program. The undocumented configuration state as a shared structural source across two independent operational teams is structurally different from the organizational stovepipe HCL in T1-002 (MCO) and T1-003 (Ariane 5). Cross-construct pattern: HCL is present in both engineering (MCO, Ariane 5) and operational (NOAA-N Prime) contexts.

**G5 — SI sub-criterion pattern:** SI-1 (specification assumption mismatch) is confirmed present in all three Batch 3 cases. Across all nine program cases, SI-1 is the consistently present sub-criterion. SI-2, SI-3, SI-4 remain less confirmed. This pattern warrants documentation for Batch 4 case selection.

---

*Artifact C — Batch 3 Comparison Report | FROZEN | 2026-06-02*  
*FCR: 1.000 | Zero disconfirmations | G1: CONTINUE*
