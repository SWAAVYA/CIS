# EE Utility Challenge Review

**Status:** Post-Validation Transition Review  
**Date:** 2026-06-02  
**Construct status assumed:** HCL, SI, CR frozen. GD-007 and GD-008 incorporated. Track A provisionally complete.

---

## Section 1 — Utility Standard

**What must each construct improve to justify operational use?**

A construct justifies use when it identifies something that existing approaches miss, at a cost that makes the finding worthwhile. "Valid" is not sufficient. The test is: does using the construct change what investigators do, and does that change produce better outcomes?

**Explicit criteria, in order of operational weight:**

| Criterion | Definition | Measurement |
|-----------|-----------|-------------|
| Reduced missed failures | Identifies structurally important situations that standard practice would miss | Recall on cases with known construct instances |
| Earlier identification | Identifies the situation before standard practice would | Time-to-identification difference |
| Reduced premature closure | Prevents conclusions formed before adequate testing | Proportion of closures that are later reversed |
| Better prioritisation | Directs investigative resources toward higher-yield observations | Diagnostic yield per unit of investigative effort |

A construct that meets none of these criteria, even if valid, should not be deployed. A construct that meets one at a meaningful magnitude justifies pilot deployment. A construct that meets two or more with acceptable cost justifies routine deployment.

**The cost constraint:** A construct whose implementation cost (cognitive, training, governance) exceeds the value of what it identifies should not be deployed regardless of validity. Utility is net value, not gross identification rate.

---

## Section 2 — Comparator Definition

**CR:** Closure type discrimination — direct disconfirmation vs. alternative explanation adoption.

Strongest comparator: **Croskerry's cognitive forcing strategies** in medical diagnosis. Specifically designed to prevent anchoring and premature closure. The literature on diagnostic error reduction is the closest existing comparator to what CR provides. If CR cannot outperform Croskerry's in a head-to-head study, it adds nothing to existing debiasing practice. The distinction CR offers over Croskerry's: CR creates a permanent governance record (the closure type is documented, options released are recorded). Croskerry's operates in-the-moment without creating an auditable trail.

Secondary comparator: **structured red teaming and devil's advocacy**. These explicitly challenge conclusions at closure. The difference from CR: red teams are episodic and externally applied; CR is embedded in the closure event itself and applies to every closure, not just selected high-stakes ones.

**HCL:** Cross-domain shared-cause synthesis mandate.

Strongest comparator: **frontier AI with standard investigative prompting** — specifically, large language models applied to multi-source investigation materials with a prompt directing synthesis. AI can now perform cross-document synthesis that previously required manual multi-analyst effort. If HCL-structured prompting adds nothing above unguided AI synthesis on the same materials, HCL's contribution is governance structure (making synthesis mandatory) rather than observation generation. The former has lower utility than the latter.

Secondary comparator: **experienced analyst synthesis** — a skilled cross-domain investigator who reads all available materials and applies professional judgment. This is the human baseline. HCL's claim over this comparator: it mandates the cross-domain synthesis question regardless of whether an experienced analyst would have thought to ask it, and it provides a structural criterion (independent domains + correlated structural incongruence) rather than relying on analyst intuition.

**SI:** Specification-assumption-reality mismatch detection.

Strongest comparator: **experienced domain expert review** — engineers, safety specialists, or investigators with deep domain knowledge who naturally look for specification-reality mismatches when reviewing technical documentation. SI's claim over this comparator: it provides a structured criterion (was this assumption verified against the adjacent system's actual behavior?) that prompts the verification check regardless of whether domain intuition would have raised it. The weakness: in domains with strong domain expertise, the comparator is very capable and SI may add little.

Secondary comparator: **FMEA (Failure Mode and Effects Analysis)** — systematic enumeration of failure modes at specification and interface levels. FMEA is the closest structured methodology to SI. SI's distinction: FMEA asks "what could fail?" SI asks "what assumption was embedded without verification?" These are different questions. FMEA is failure-forward; SI is assumption-backward.

---

## Section 3 — Cost Analysis

| Construct | Cognitive burden | Review burden | Training burden | False positive burden | Governance burden | Overall |
|-----------|----------------|---------------|----------------|----------------------|-------------------|---------|
| CR | LOW | LOW | LOW | LOW | LOW | **LOW** |
| HCL | HIGH | HIGH | MODERATE | HIGH | MODERATE | **HIGH** |
| SI | MODERATE | MODERATE | HIGH | MODERATE | MODERATE | **MODERATE-HIGH** |

**CR costs in detail:**

Cognitive: One additional binary question at each closure event — "was this resolved by direct test or by assumption?" Near-zero marginal load.

Review: Reviewing the evidence basis for a closure adds one step to existing closure procedure.

Training: Intuitive once explained. The concept does not require understanding of structural mechanics, information theory, or domain-specific expertise. A one-hour training is probably sufficient.

False positives: Low. Either direct disconfirmation occurred or it didn't. The classification is relatively unambiguous.

Governance: One additional field in closure records; one additional document per case (Options Released). Scalable.

**HCL costs in detail:**

Cognitive: Cross-domain synthesis requires holding multiple organisational contexts simultaneously, understanding structural independence, and evaluating whether signal correspondence implies shared causation. This is demanding even for experienced investigators.

Review: Requires reading and analysing materials from multiple independent sources — potentially a significant time investment in large investigations.

Training: The concept is not intuitive. Understanding what "structurally independent" means, why correspondence implies shared cause, and how to avoid false positives from coincidental correspondence requires substantial training.

False positives: High. Many apparent cross-domain correspondences don't reflect shared causes. Every HCL synthesis operation that finds no shared cause imposes cost without benefit. In domains with many independent information sources, the false positive burden could be large.

Governance: Documenting independence assessments, correspondence analyses, and structural hypotheses for every HCL synthesis operation is a meaningful burden.

**SI costs in detail:**

Cognitive: Requires understanding of adjacent system characterisation, verification adequacy, and the sub-criterion distinctions. Higher than CR but lower than HCL.

Review: Requires reading specifications and comparing them to adjacent system documentation — moderate burden per specification reviewed.

Training: The sub-criterion distinctions (SI-1 through SI-4 plus methodology adequacy sub-class from GD-008) took multiple governance decisions to stabilise in Track A. Getting operationally deployed investigators to code reliably requires substantial training.

False positives: Moderate. SI-1 is present in most complex failures (11/15 in Track A). Without careful application of the GD-008 verification test, SI generates many alerts that are not actionable.

Governance: Structured SI scoring and sub-criterion documentation is a non-trivial burden per specification reviewed.

---

## Section 4 — HCL Utility Test

**What measurable advantage should appear if HCL is valid and useful?**

**Metric 1 — Recall on shared-cause cases:**
In investigations where a shared structural cause across independent domains later proves true, what proportion does HCL-structured synthesis identify prospectively? Comparator: what proportion does standard investigation (or AI with standard prompting) identify within the same investigation timeframe?

**Metric 2 — Time-to-identification:**
When HCL identifies a shared cause, how much earlier in the investigation lifecycle does the identification occur compared to standard investigation?

**Metric 3 — Marginal cases:**
What proportion of HCL-identified shared causes would not have been identified by the strongest comparator (frontier AI with standard investigative prompting) within the same timeframe?

**Success thresholds:**

HCL is useful if, in cases with confirmed shared causes across independent domains:
- HCL-structured synthesis identifies the shared cause in ≥ 25% of cases where frontier AI with standard prompting misses it within the investigation window
- The false positive rate (HCL synthesis hypotheses that are not confirmed) is below 60%

HCL is not useful if:
- Frontier AI with standard investigative prompting achieves equivalent recall with equivalent precision
- The marginal cases identified by HCL are below 15% of total confirmed shared-cause cases

**The specific threat to HCL utility:** Frontier AI models are now capable of cross-document synthesis that was previously HCL's distinctive contribution. The question is whether HCL-structured prompting (which provides the independence assessment criterion and the correspondence analysis structure) adds above unguided AI synthesis on the same materials. If it does not, HCL's remaining utility is governance (making synthesis mandatory and structured) rather than observation generation. Governance utility is real but lower.

---

## Section 5 — SI Utility Test

**What measurable advantage should appear if SI is valid and useful?**

**Metric 1 — Specification review recall:**
In retrospective review of investigation records for cases with known specification-assumption mismatches, what proportion does SI-structured review identify prospectively compared to standard engineering review or FMEA?

**Metric 2 — Earlier identification in specification acceptance:**
If applied at specification acceptance (forward-looking), does SI-structured review identify assumption-verification gaps before they cause failures? Measurable as: proportion of specifications with identified assumption gaps where the gap is subsequently confirmed as causally relevant.

**Metric 3 — Sub-criterion discrimination:**
Do the SI sub-criteria (SI-1 through SI-4 plus methodology adequacy) generate differential action recommendations? If all sub-criteria point to the same intervention (verify the assumption), the sub-criterion structure adds training burden without decision advantage.

**Success thresholds:**

SI is useful if:
- SI-structured specification review identifies assumption-verification gaps at a rate ≥ 30% above standard engineering review on the same specifications
- The sub-criteria generate meaningfully different recommended interventions (if they don't, collapse to a single "verify the assumption" criterion and reduce training burden)

SI is not useful if:
- Experienced domain experts applying standard review find assumption-verification gaps at equivalent rates
- The sub-criterion distinctions require more training than they save in precision

**The specific threat to SI utility:** SI is most powerful when applied prospectively at specification acceptance — before failures occur. But most SI application in Track A was retrospective. The prospective utility test requires deploying SI in live specification review programs, which has not been done. The retrospective validity (SI is present in 11/15 Track A cases) does not by itself justify prospective operational deployment.

---

## Section 6 — CR Utility Test

**What measurable advantage should appear if CR is valid and useful?**

**Metric 1 — Premature closure rate:**
In investigations or diagnostic reviews using CR governance, what proportion of contradicting signals are closed by alternative explanation rather than by direct disconfirmation, compared to standard practice? CR should reduce this rate.

**Metric 2 — Reopening rate:**
Among cases closed under CR governance vs. standard practice, what proportion are later reopened when new contradicting evidence arrives? CR should reduce reopening rate by preventing premature closure in the first place.

**Metric 3 — Options released recovery:**
When closure by alternative explanation does occur, does the Options Released record enable faster identification of the released option when new evidence arrives? Measurable as: time from new evidence arrival to case reopening, in CR-governed vs. standard-documented investigations.

**Success thresholds:**

CR is useful if, in a prospective study:
- Premature closure rate in the CR-governed group is ≥ 20% lower than the standard group
- OR reopening rate is ≥ 20% lower in the CR-governed group
- OR time to correct identification, for cases that initially make premature closures, is meaningfully shorter in the CR-governed group

CR is not useful if:
- The premature closure rate is equivalent between groups, meaning investigators already distinguish closure types without explicit governance
- Croskerry's cognitive forcing strategies achieve equivalent reduction without the governance burden

**Note on CR's dual utility claim:** CR makes two separable claims — behavioral (the documentation requirement changes investigator behavior at closure time) and governance (the record changes what can be done after the fact). These should be tested separately. Even if the behavioral claim fails (investigators close prematurely regardless of governance), the governance claim may hold (the record enables better post-closure action). Either claim alone justifies deployment.

---

## Section 7 — Failure Despite Validity

**How could the framework fail operationally even if all three constructs are valid?**

**Risk 1 — Signal-to-noise overwhelm:**

In real investigations, the number of potential signals vastly exceeds the curated signal environment in Track A cases. Track A cases used investigation reports (already curated by professional investigators). Operational HCL would require synthesis across raw multi-source materials before any curation. Operational SI would require reviewing every specification in a complex system before any has been identified as problematic. Operational CR would require tracking every contradiction in a complex case.

The signal-to-noise problem is most severe for HCL (many apparent cross-domain correspondences are coincidental) and for SI (many specifications embed assumptions that are adequately verified). The framework works in Track A partly because Track A cases are already known to have construct instances. In prospective deployment, most cases will not have the constructs, and the false positive burden will be high.

**Risk 2 — Analyst resistance:**

CR governance explicitly requires investigators to document when they've resolved a contradiction by assumption rather than by test. Many experienced investigators will experience this as documentation of their inadequacy. The cultural barrier to adoption in organisations where investigative expertise is a professional identity is high.

**Risk 3 — Training ceiling:**

The SI sub-criterion distinctions required six governance decisions to stabilise even in a controlled research program. Getting front-line investigators in high-tempo operational contexts to code reliably at acceptable inter-rater agreement levels is a genuinely uncertain proposition. If the framework requires more training than operational contexts can accommodate, it will be applied inconsistently or abandoned.

**Risk 4 — Counterfactual invisibility:**

The framework's primary value is what it prevents — premature closures not made, shared causes identified before failure, specification mismatches caught before they cause harm. In most operational contexts, there is no mechanism to measure what was prevented. Investigators and organisations will therefore have no feedback signal confirming that the framework added value. Without feedback, adoption erodes.

**Risk 5 — Substitution without addition:**

Organisations that adopt HCL governance may redirect resources from other investigative activities toward HCL synthesis. If HCL-prompted activities are no more productive than the activities they replace, the framework creates workload reallocation without net benefit.

---

## Section 8 — Minimum Viable Deployment

**If only one construct:**

**CR.**

Reasons:
- Lowest total cost across all cost dimensions
- Clearest operationalisation: one binary classification at each closure event
- Most direct connection to the highest-impact failure events in the Track A corpus (DWH, Challenger, Columbia — all have CR as primary or co-primary)
- Deployable without domain expertise: the classification "resolved by direct test vs. by assumption" is domain-independent
- Produces a governance record with standalone value (the Options Released documentation) even if the behavioral claim does not hold
- Can be introduced as a single additional step in existing investigation protocols without redesigning investigative practice

One question, added to every closure: "Was this resolved by direct test or by assumption?" One field added to the investigation record. This is the minimum viable deployment of CR. Everything else can follow.

**If two constructs:**

**CR + HCL.**

CR provides closure quality governance — the backstop against premature conclusions. HCL provides the cross-domain synthesis mandate — the construct that addresses the class of observations most likely to be missed entirely (not missed and suppressed, but never generated at all). Together they address the two primary failure modes the Track A corpus documented: conclusions closed prematurely (CR) and observations that require cross-domain synthesis never formed (HCL).

SI is excluded from the minimum viable second position for three reasons: the training burden for sub-criterion discrimination is high, the comparator (experienced domain expert review) is capable, and the prospective utility case requires a specification review deployment that has not been designed. SI is the right third construct in a well-resourced deployment context, not the right second construct in a minimum viable framework.

---

## Section 9 — Utility Experiment Design

**Smallest experiment capable of answering "does the framework improve outcomes?"**

**Target construct:** CR. Lowest cost to test, strongest comparator, most tractable experimental design.

**Domain:** Medical diagnosis. Established case databases with known outcomes, experienced participants, clear diagnostic accuracy measures, regulatory motivation for improvement.

**Design:**

*Participants:* 60 attending physicians in internal medicine or emergency medicine, randomised to three arms (n=20 per arm):
- Arm A: CR governance (closure type classification + Options Released documentation required)
- Arm B: Croskerry's cognitive forcing strategy (structured reflection before diagnosis commit)
- Arm C: Standard diagnostic review (control)

*Cases:* 30 complex diagnostic cases per participant, drawn from a published diagnostic challenge database with known final diagnoses. Each case includes at least one contradicting clinical finding documented in the case record.

*Procedure:* Sequential information presentation. Participants make interim diagnostic commitments as new information arrives. In Arms A and B, the intervention is applied at each commitment point. Participants cannot see their prior commitments during the session.

*Primary outcome:* Premature closure rate — the proportion of contradicting findings that are classified as resolved by assumption (Arm A and B, scored by reviewers) or that are not reconsidered when later contradicting information arrives (Arm C, scored by sequential response pattern).

*Secondary outcomes:* Final diagnostic accuracy; time to correct diagnosis; reopening rate (proportion of prior commitments revised when contradicting information arrives).

*Comparator:* Arm B (Croskerry) is the critical comparator, not Arm C. If Arm A and Arm B are indistinguishable, CR adds governance overhead without behavioral benefit. If Arm A outperforms Arm B, CR adds something Croskerry's does not.

*Sample size justification:* 60 participants × 30 cases = 1,800 case-reviews. Sufficient power to detect a 15–20% difference in premature closure rate between arms at α = 0.05 with 80% power.

*Timeline:* Can be conducted in a single half-day session per participant. Total study duration approximately 6 months from IRB approval to data collection completion.

*This is the smallest experiment that would produce a useful signal about the construct most likely to produce operational value at the lowest cost.*

---

## Section 10 — Final Verdict

**1. Strongest utility case: CR**

The cost-benefit ratio is the strongest of the three constructs. Low implementation cost, clear operationalisation, domain-independent, produces a governance record with standalone value, directly targets the highest-impact failure events in the corpus. The utility case does not depend on the framework being valid — even a framework that generates false positives can provide value if the Options Released record enables faster case reopening.

**2. Weakest utility case: SI**

The strongest comparator (experienced domain expert review) is capable in high-expertise domains. The training burden for sub-criterion discrimination is high. The prospective utility claim requires a specification review deployment context that does not yet exist. SI is valid and will produce value in specific contexts (formal specification review programs, systems engineering organizations with dedicated safety review functions) but is too costly and domain-specific for general operational deployment.

**3. Deploy first: CR**

One question. One field in the investigation record. Can be piloted in any investigation-intensive context without infrastructure investment.

**4. Remain research-only: SI and HCL**

*SI:* Until a prospective specification review deployment is designed and piloted in a technical domain (aerospace, nuclear, medical devices). Retrospective validity (11/15 Track A cases) is not sufficient basis for prospective operational deployment in a domain-general context.

*HCL:* Until the AI comparator study is completed. If frontier AI with HCL-structured prompting outperforms frontier AI with standard prompting, HCL deploys as a prompting protocol. If not, HCL's remaining contribution is governance mandate (making synthesis mandatory), which has lower but still real utility. The study needs to run before operational deployment is justified.

**5. Minimum viable framework: CR alone; CR + HCL with adequate resources**

CR alone is the minimum investment that produces the clearest expected return. CR + HCL addresses both primary failure mode classes (premature closure, integration failure) and is the appropriate target for a well-resourced pilot deployment.

**6. Strongest operational risk: Counterfactual invisibility**

The framework prevents things that, if prevention succeeds, never become visible. An investigator who applies CR correctly and avoids a premature closure will never know what the premature closure would have cost. An organisation that adopts HCL and synthesises a cross-domain connection that prevents a failure will have no mechanism to attribute the prevention to HCL. Without feedback, adoption erodes and the framework is abandoned before its value accumulates. This is the primary risk to long-term operational utility, independent of whether the constructs are valid.

**7. Strongest expected benefit: CR in high-stakes diagnosis**

Medical diagnosis is the clearest deployment target — high frequency of contradicting findings, well-documented costs of diagnostic error, existing debiasing culture to build on, tractable experimental design, strong regulatory motivation. CR governance in diagnosis adds one documented question per significant diagnostic commitment. The potential benefit (reduced diagnostic error in contradiction-heavy cases) is large relative to the implementation cost.

**8. Has the framework crossed from validation into utility testing?**

**Yes — for CR.** The Track A validation is sufficient basis for a prospective utility study of CR in medical diagnosis or safety investigation. The construct has been validated across 18 cases in 6 domains, survived multiple disconfirmation attempts, and produced stable coding with calibration. The next question for CR is empirical — not further validation but operational performance.

**No — not yet for HCL and SI.** HCL requires the AI comparator study before operational deployment is justified. SI requires a prospective specification review design. Both are research-phase constructs despite Track A validation.

---

## Most Important: How would we know if the framework is valid but not useful?

**The signature of a valid-but-not-useful framework is:** it identifies the same observations as existing approaches, arrives at the same conclusions, just more slowly and with more documentation. The framework adds process without adding outcomes.

The specific indicators:

**CR fails utility even if valid when:**
- The premature closure rate in CR-governed investigations is equivalent to standard investigations — meaning experienced investigators already distinguish closure types intuitively without the formal governance
- The Options Released records are never consulted in case reopening decisions — meaning the documentation adds burden without changing subsequent action
- Croskerry's cognitive forcing strategies achieve equivalent closure quality reduction without the governance overhead

**HCL fails utility even if valid when:**
- Frontier AI with standard investigative prompting generates equivalent cross-domain synthesis hypotheses to HCL-structured prompting — meaning HCL's structure adds nothing above the model's baseline synthesis capability
- The marginal cases identified by HCL are consistently low-priority leads that experienced analysts would not have pursued regardless
- The false positive burden (HCL syntheses that don't confirm) exceeds the yield by enough that analysts learn to ignore HCL outputs

**SI fails utility even if valid when:**
- Experienced domain experts applying standard engineering review find assumption-verification gaps at equivalent rates to SI-structured review
- The sub-criterion distinctions generate no differential action recommendations — SI-1, SI-2, SI-3, and SI-4 all point to "verify the assumption against the adjacent system" with the same urgency
- The training cost required to achieve reliable sub-criterion coding exceeds the yield from the additional precision

**The test in all three cases is the same:** does the framework change what investigators do, and does that change produce better outcomes? Validity establishes the first condition. Utility requires the second. The two can come apart, and the utility experiment in Section 9 is designed specifically to detect when they do.

---

*EE Utility Challenge Review | 2026-06-02*  
*Determination: CR crosses into utility testing now. HCL and SI remain research-phase. Minimum viable framework is CR alone. Strongest risk is counterfactual invisibility.*
