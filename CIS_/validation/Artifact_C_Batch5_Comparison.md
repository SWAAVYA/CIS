# Artifact C — Batch 5 Comparison Report

**Artifact type:** Artifact C  
**Batch:** 5  
**Cases:** T2-009 (Therac-25), T2-010 (Herald of Free Enterprise), T2-011 (Swissair 111)  
**Status:** FROZEN  
**Date:** 2026-06-02

---

## Comparison Matrix

| Case | Construct | Predicted | Found | Result |
|------|-----------|-----------|-------|--------|
| T2-009 | CR | PRESENT HIGH | PRESENT | CONFIRMED |
| T2-009 | WSP | PRESENT HIGH | PRESENT | CONFIRMED |
| T2-009 | SI-1 | PRESENT HIGH | PRESENT | CONFIRMED |
| T2-009 | SI-3 | PRESENT HIGH | PRESENT | CONFIRMED |
| T2-009 | HCL | PRESENT HIGH | PRESENT | CONFIRMED |
| T2-009 | CDA | PRESENT HIGH | PRESENT | CONFIRMED |
| T2-009 | LD | PRESENT MODERATE | PRESENT | CONFIRMED |
| T2-009 | FA | ABSENT HIGH | ABSENT | CONFIRMED |
| T2-010 | CR | PRESENT HIGH | PRESENT | CONFIRMED |
| T2-010 | WSP | PRESENT MODERATE | PRESENT | CONFIRMED |
| T2-010 | SI-1 | PRESENT MODERATE | PRESENT | CONFIRMED |
| T2-010 | SI-4 | ABSENT HIGH | ABSENT | CONFIRMED |
| T2-010 | HCL | ABSENT HIGH | ABSENT | CONFIRMED |
| T2-010 | CDA | PRESENT HIGH | PRESENT | CONFIRMED |
| T2-010 | LD | PRESENT MODERATE | PRESENT | CONFIRMED |
| T2-010 | FA | PRESENT HIGH | PRESENT | CONFIRMED |
| T2-011 | CR | **ABSENT HIGH** | **ABSENT** | **CONFIRMED** |
| T2-011 | WSP | ABSENT HIGH | ABSENT | CONFIRMED |
| T2-011 | SI-1 | PRESENT HIGH | PRESENT | CONFIRMED |
| T2-011 | SI-4 | ABSENT HIGH | ABSENT | CONFIRMED |
| T2-011 | HCL | ABSENT HIGH | ABSENT | CONFIRMED |
| T2-011 | CDA | PRESENT MODERATE | PRESENT | CONFIRMED |
| T2-011 | LD | PRESENT HIGH | PRESENT | CONFIRMED |
| T2-011 | FA | PRESENT MODERATE | PRESENT | CONFIRMED |

---

## FCR

| Case | Confirmed | Disconfirmed | Valid | FCR |
|------|-----------|--------------|-------|-----|
| T2-009 | 8 | 0 | 8 | **1.000** |
| T2-010 | 8 | 0 | 8 | **1.000** |
| T2-011 | 8 | 0 | 8 | **1.000** |
| **Batch 5** | **24** | **0** | **24** | **1.000** |

---

## Cumulative Program State

| Batch | Cases | FCR | Running FCR |
|-------|-------|-----|------------|
| 1 | 3 | 0.933 | 0.933 |
| 2 | 3 | 0.905 | 0.917 |
| 3 | 3 | 1.000 | 0.946 |
| 4 | 3 | 0.955 | 0.949 |
| 5 | 3 | 1.000 | **0.961** |

**15 cases. 98 confirmed of 102 valid predictions. 2 disconfirmations. Program FCR: 0.961.**

---

## What Batch 5 Established

**CR ABSENT confirmed at HIGH.** Swissair 111 (T2-011) is the program's first case where CR was predicted ABSENT at HIGH confidence and the reconstruction confirmed the absence. The certification gap is SI-1 and LD — not a contradiction that was raised and suppressed. The framework correctly distinguished between "something went wrong in a complex organization" (which does not automatically code CR) and "a specific contradicting signal was closed by alternative explanation adoption" (which does code CR). This is the program's strongest discriminant validity demonstration to date.

**SI-4 ABSENT with FA PRESENT confirmed.** Herald of Free Enterprise (T2-010) confirms that FA and SI-4 can be cleanly separated. FA requires multiple simultaneously degraded safety margins. SI-4 requires multi-dimensional signal incongruence. The Herald bridge had absent signals (CDA condition), not incongruent signals. FA PRESENT HIGH confirmed; SI-4 ABSENT HIGH confirmed. The distinction is operationally real.

**HCL confirmed outside aerospace, in a medical device context.** Therac-25 (T2-009) confirms HCL in a four-facility medical device context — the first non-aerospace, non-manufacturing HCL confirmation. The shared structural source (software race condition) was invisible from within any single facility's investigation. Cross-facility synthesis was required to identify it. The HCL condition held across four independent organizational domains in two countries.

**SI-3 confirmed with GD-007 applied correctly.** Therac-25 confirms SI-3 under the GD-007 rule. The check was performed prospectively: no formal recognition event (regulatory directive, cross-site report) occurred before the sixth incident. Aggregation was absent. GD-007 directed coding SI-3 rather than CR. The reconstruction confirmed this was correct. The GD-007 distinction has now been validated in both directions: AF447 (pattern aggregated → CR, not SI-3) and Therac-25 (pattern not aggregated → SI-3 confirmed).

---

## Governance Determinations

**G1 — Program continuation:** CONTINUE. Batch 5 FCR = 1.000. Program FCR = 0.961.

**G2 — GD-007 validated bidirectionally.** Batch 4 validated GD-007 by disconfirming SI-3 in AF447 (pattern was aggregated → not SI-3). Batch 5 validates GD-007 by confirming SI-3 in Therac-25 (pattern was not aggregated → SI-3). The distinction is now empirically grounded in both directions.

**G3 — Construct coverage summary across 15 cases:**

| Construct | Cases present | Cases absent | Notes |
|-----------|--------------|--------------|-------|
| CR | 11 | 4 | Primary or secondary in most cases; absent in SR111 and T2-004 (Mars Obs. — partial) |
| SI-1 | 15 | 0 | Present in all 15 cases |
| HCL | 7 | 8 | Confirmed in engineering, manufacturing, medical device, maritime contexts |
| CDA | 11 | 4 | Co-occurs frequently with HCL and CR |
| LD | 10 | 5 | Primary in T2-004; secondary in many |
| WSP | 8 | 7 | Present where pattern accumulation structure exists |
| FA | 8 | 7 | Present in multi-margin degradation cases |
| SI-2 | 3 | 12 | Confirmed in T2-006 (HIGH), T2-008 (MOD); not widely present |
| SI-3 | 3 | 12 | Confirmed in Therac-25; boundary with CR established |
| SI-4 | 2 | 13 | Present in AF447 (MOD); absent widely |

**G4 — SI-1 universality:** SI-1 is present in all 15 cases. This warrants a governance note: SI-1 may be too broad to be a useful discriminating sub-criterion. If every case has SI-1, it provides no discrimination. Before Batch 6, determine whether SI-1 is genuinely present in all cases or whether it is being applied too liberally. A GD-008 discussion is recommended.

**G5 — Batch 6 design recommendation.** Two open questions remain:
1. Is SI-1 actually universal or is the coder applying it too broadly?  
2. Can the framework successfully predict complex multi-construct cases prospectively without the richness of prior domain knowledge reducing the test stringency?

---

*Artifact C — Batch 5 Comparison Report | FROZEN | 2026-06-02*  
*FCR: 1.000 | Zero disconfirmations | CR ABSENT HIGH confirmed | FA/SI-4 discriminant validity confirmed | GD-007 validated bidirectionally*
