# Track A — Artifact B
# Case Reconstruction: T1-004 — Space Shuttle Columbia (STS-107)

**Artifact designation:** Artifact B — Case Reconstruction  
**Case ID:** T1-004  
**Status:** FROZEN  
**Session type:** Reconstruction Session — Artifact A blinded  
**Governing protocol:** Protocol v1 (A-02) + Clarification Addendum v1 (A-05) + Clarification Addendum v2 (A-20)  
**Session boundary:** This reconstruction was conducted without access to Artifact A predictions for any case in Batch 1.

---

## Mandatory Disclosure — GD-002 R-01 / A-03

**DISCLOSURE REQUIRED IN ALL TRACK A OUTPUTS**

This is a retrospective structured validation exercise. The AI system conducting this reconstruction (Claude, Anthropic) has been trained on data that includes the Columbia Accident Investigation Board Report (2003), the CAIB organizational analysis, and extensive secondary literature in aerospace safety, organizational behavior, and engineering ethics. AI prior exposure for T1-004 is assessed as HIGH (M-06 v1.2). The Normalization of Deviance finding, the foam debris history, the imagery request, and the Mission Management Team's risk assessment are widely known in aerospace safety literature and likely present in AI training data at high resolution.

Kappa values from CAL-2026-001 are characterized as intra-system consistency metrics and may not be characterized as inter-rater reliability measures until human coder validation is complete (OI-001).

**Classification:** RETROSPECTIVE STRUCTURED VALIDATION — AI-ASSISTED, HUMAN VALIDATION PENDING

---

## Section B1 — Case Metadata

| Field | Value |
|-------|-------|
| Case ID | T1-004 |
| Case Name | Space Shuttle Columbia (STS-107) |
| Domain | Aerospace / Organizational Decision-Making |
| Tier | 1 |
| AI Prior Exposure | HIGH |
| Primary Source | Columbia Accident Investigation Board Report, Volume I. August 2003. NASA. |
| Supplementary Source | Columbia Accident Investigation Board Report, Volume VI (Organizational Causes). 2003. NASA. |
| Source Accessibility | CONFIRMED (M-06 v1.2) |
| Reconstruction Date | 2026-05-31 |
| Analyst Identity | EE/CIS Research Governance Team — AI-assisted |
| Governing Failure Conditions | Artifact 0 v1.0 |
| Artifact A Access | NONE — blinded per session boundary protocol |

---

## Section B2 — Phase Boundary Verification

Phase boundaries adopted from M-06 v1.2 as the authoritative registry record.

### Pre-Decision Phase

**Start boundary:** First documented foam debris strike on shuttle external tank in Space Shuttle program history, as identified in CAIB Vol. I organizational normalization of deviance analysis (specific chapter reference consistent with CAIB content; STS-2, November 1981 identified as the first documented foam debris strike causing tile damage).

**Justification:** The CAIB's organizational analysis explicitly traces the normalization of foam debris strikes as an organizational failure pattern beginning with the earliest missions. The Phase boundary is set at the first foam strike because the Pre-Decision Phase signal environment that is analytically significant for this case includes the full history of foam debris classification and normalization — this history constitutes the structural context in which the STS-107 decisions were made. The physical and organizational environment of the STS-107 Decision Phase cannot be understood without the preceding 22-year normalization history.

**End boundary:** STS-107 ascent foam strike occurrence and initial Mission Management Team notification, January 16–17, 2003, as documented in CAIB Vol. I Chapter 6.

**Justification:** The foam strike during ascent is the event that converts the pre-existing normalized assessment framework into an active decision environment. The end of the Pre-Decision Phase is the beginning of the decision-making sequence: once the foam strike was documented and communicated to the MMT, the organizational decision process that characterizes this case began.

### Decision Phase

**Start:** MMT assessment process commencement, approximately January 17, 2003.

**End:** MMT decision not to pursue imaging request, approximately January 21–24, 2003, as documented in CAIB Vol. I Chapter 6.

**Decision Phase scope note:** The Decision Phase for this case is the seven-day period during which the MMT assessed the foam strike damage risk and decided not to pursue formal imaging of the damaged area. This is an unusually extended Decision Phase compared to T1-002 and T1-003, reflecting the organizational nature of the decision — it was not a single technical decision but a sustained assessment process with multiple participants.

### Boundary Ambiguity

**Ambiguity 1 — Pre-Decision Phase scope:** The full normalization history (1981–2003) is an unusually long Pre-Decision Phase. The practical signal inventory focuses primarily on the period 1999–2003, including the STS-112 foam strike (October 2002) and the period immediately before STS-107. The full history is referenced as structural context; the signal inventory focuses on the most proximate and documentable signals.

**Ambiguity 2 — Decision Phase end date:** The CAIB documents the MMT's decision process across multiple meetings and communications. The specific date of the operative "decision not to pursue imaging" is identified approximately as January 21–24, 2003. This reconstruction treats the Decision Phase as the period January 17–24, 2003.

---

## Section B3 — Evidence Timeline

| Date | Event | Actor(s) | Signal | Classification at Time |
|------|-------|---------|--------|----------------------|
| Nov 1981 (STS-2) | First documented foam debris strike causing tile damage. Orbiter Columbia sustained tile damage from foam debris during ascent. Damage documented during post-flight inspection. | NASA / Columbia mission team | First foam debris tile damage | Anomaly — classified as acceptable; no safety-of-flight concern |
| 1981–2002 | Multiple shuttle missions document foam debris strikes and tile damage. Each is individually assessed and classified as within acceptable bounds. The assessment criterion is whether the observed damage would have affected mission safety. No mission was lost to foam debris damage. The classification of foam strikes as acceptable anomalies becomes institutionalized. | NASA Shuttle Program | Pattern of foam debris strikes classified as acceptable anomalies | Individually acceptable — pattern not formally assessed cumulatively |
| Oct 2002 (STS-112) | Large foam piece from left External Tank / SRB bipod area strikes the left SRB attachment fitting. The foam piece is described as larger than typical debris. Extensive documentation of the strike and its effects. The damage observed prompts internal discussion but is classified as acceptable. | NASA Shuttle Program / Mission Evaluation Room | STS-112 large foam strike — same ET region as STS-107 | Anomaly — classified as acceptable; investigation initiated but mission proceeded as planned |
| Nov 2002 (STS-113) | Foam debris strikes documented on the mission immediately preceding STS-107. Damage assessed and classified as acceptable. Program proceeds. | NASA Shuttle Program | STS-113 foam debris — pre-STS-107 immediate predecessor mission | Acceptable anomaly |
| Jan 16, 2003 (STS-107 launch, ~T+81.7s) | **[Pre-Decision Phase end boundary / Decision Phase start]** Large foam piece separates from left bipod area of the External Tank. The piece, approximately 1.67 pounds, strikes the Reinforced Carbon-Carbon (RCC) panels on the leading edge of the left wing, in the vicinity of panels 5-9. The strike is not visible in real-time to the launch team. | STS-107 (automated) | Foam strike — left wing RCC panel damage | Not classified in real-time; footage analyzed post-launch |
| Jan 16–17, 2003 | Post-launch imagery review by NASA engineers reveals foam debris separation and strike event during ascent review. The foam piece separation is documented from launch camera footage. Initial assessment of strike area begins. MMT is notified that a foam strike occurred. | NASA / Mission Management Team | Foam strike notification from footage analysis | Initial anomaly notification — investigation begins |
| Jan 17, 2003 | Mission Management Team convenes to assess the foam strike. Debris Assessment Team (DAT) formed to conduct formal analysis. The DAT is tasked with determining whether the foam strike constitutes a safety-of-flight concern. | Mission Management Team / Linda Ham (MMT Chair) | MMT convened; DAT formation | Active investigation — classification pending DAT assessment |
| Jan 17–21, 2003 | Debris Assessment Team (DAT) analyzes the foam strike using the Crater model — NASA's approved analytical tool for assessing foam/debris impacts on TPS tiles. The foam piece (approximately 1.67 lbs) is larger than the Crater model's validated input range. The model is extrapolated beyond its validated bounds. At least one analyst notes the extrapolation and associated uncertainty. Results of Crater analysis are produced and transmitted to the MMT. | Debris Assessment Team / Boeing / NASA engineers | DAT analysis using extrapolated Crater model | Engineering analysis — results transmitted to MMT |
| Jan 17–24, 2003 | **Multiple engineering requests for Department of Defense imagery of the damaged wing area.** Engineers from various groups — including Rodney Rocha (chief thermal protection engineer) and others — request that the DoD be asked to image the left wing leading edge to assess actual damage extent. Requests are made through email and internal communication channels. | NASA engineers (multiple) / Rodney Rocha and others | Requests for DoD imaging of damaged wing | [Routing unclear — requests not officially elevated to MMT level] |
| ~Jan 21–22, 2003 | MMT receives and reviews DAT results. The Crater model analysis is presented as suggesting the foam strike damage may be survivable, though with acknowledged uncertainty. Key MMT assessment: the damage is an "in-family" anomaly consistent with prior experience, and does not constitute a safety-of-flight concern requiring mission modification. | Mission Management Team | MMT review of DAT results | Classified as manageable anomaly — not safety-of-flight concern |
| ~Jan 21–24, 2003 | **MMT decides not to formally request DoD imaging.** The rationale: imaging would not change the mission outcome because there was no in-orbit repair capability and re-entry would proceed regardless. The foam strike is classified as an accepted risk within the mission framework. Engineers who expressed concern are not given a formal channel to escalate above the MMT determination. | Mission Management Team / Linda Ham | MMT decision: no formal imaging request | Mission continues — foam strike closed as acceptable anomaly |
| Jan 28 – Feb 1, 2003 | STS-107 mission continues. On February 1, during re-entry, superheated plasma enters through the breach in the left wing's RCC panels, travels through the wing structure, causes progressive structural failure of the left wing, and leads to vehicle breakup. Columbia is lost with all seven crew members. | Space Shuttle Columbia | Vehicle loss during re-entry | Mission failure |
| Aug 2003 | CAIB Report released. Root causes: foam debris breach of TPS during ascent; organizational culture enabling normalization of deviance; MMT decision not to pursue imaging; failure to recognize the unprecedented scale of the STS-107 foam strike. | Columbia Accident Investigation Board | Post-loss investigation | Root cause determination (post-event) |

---

## Section B4 — Signal Inventory

All signals are within the Pre-Decision Phase scope (November 1981 — January 16-17, 2003) unless noted as Decision Phase signals. Decision Phase signals are included for completeness of the case record.

---

**S-001 — Multi-mission foam debris strike normalization history (1981–2002)**

| Field | Value |
|-------|-------|
| Signal ID | S-001 |
| Description | Across the Space Shuttle program from STS-2 (1981) through STS-113 (November 2002), foam debris strikes causing tile damage were documented on numerous missions. Each strike was individually assessed and classified as an acceptable anomaly because no mission had been lost to foam debris damage. The pattern of acceptable classifications constituted a de facto risk standard: foam strikes were treatable as a normal operational condition within acceptable limits. The CAIB identifies this normalization as "normalization of deviance." |
| Source | CAIB Vol. I, Chapter 6; CAIB Vol. VI |
| First Appearance | STS-2, November 1981; pattern accumulates through 87+ missions |
| Visibility Level | VISIBLE as individual records — the pattern was visible in aggregate only in retrospect or through deliberate cross-mission analysis |
| Decision Relevance | HIGH — the normalization history is the organizational context in which the STS-107 foam strike was assessed |
| Notes | The CAIB documents that the normalization history established the assessment framework within which the STS-107 foam strike was evaluated. Each prior acceptable classification created precedent for the next acceptable classification. |

---

**S-002 — STS-112 large foam strike (October 2002)**

| Field | Value |
|-------|-------|
| Signal ID | S-002 |
| Description | During STS-112 (October 2002), a large foam piece from the left ET/SRB bipod area — the same region as the STS-107 strike — separated and struck the left SRB attachment fitting. The piece was larger than typical debris events. The strike caused visible damage. An investigation was conducted; the strike was classified as acceptable. |
| Source | CAIB Vol. I |
| First Appearance | October 2002 |
| Visibility Level | VISIBLE to the NASA shuttle program — the STS-112 strike was documented and investigated |
| Decision Relevance | HIGH — STS-112 was the most significant pre-STS-107 signal from the same ET bipod location. Its classification as acceptable directly informed the normalization context within which STS-107 was assessed. |
| Notes | The STS-112 strike's location (left bipod area) and scale make it the most proximate pre-STS-107 precursor signal. Its classification as acceptable may have reinforced the assessment framework applied to the larger STS-107 strike. |

---

**S-003 — STS-107 ascent foam strike (January 16, 2003)**

| Field | Value |
|-------|-------|
| Signal ID | S-003 |
| Description | A foam piece of approximately 1.67 pounds separated from the left bipod area of the External Tank approximately 81.7 seconds after launch. The piece struck the leading edge of the left wing's Reinforced Carbon-Carbon panels, in the vicinity of panels 5-9. The strike was captured on launch camera footage and identified during post-launch imagery review. The foam piece was larger than any previously documented foam debris strike from this region. |
| Source | CAIB Vol. I, Chapter 3 |
| First Appearance | January 16, 2003 (strike); documented January 16–17, 2003 (review) |
| Visibility Level | NOT VISIBLE in real-time; identified during post-launch imagery review January 16–17 |
| Decision Relevance | DIRECT — this strike was the physical cause of the RCC panel breach that led to vehicle loss |
| Notes | The size of the foam piece (approximately 1.67 lbs) was unprecedented in shuttle history for this debris category. The CAIB documents that the strike was larger than previous foam strikes from the bipod area and that Crater's validated range did not extend to this foam mass. |

---

**S-004 — Debris Assessment Team (DAT) Crater model analysis (January 17–21, 2003)**

| Field | Value |
|-------|-------|
| Signal ID | S-004 |
| Description | The Debris Assessment Team used the Crater model (NASA's approved analytical tool for tile impact assessment) to model the foam strike. The foam piece was larger than Crater's validated input range. The model was extrapolated beyond its validated bounds. At least one analyst noted the extrapolation. The analysis produced results suggesting that damage might be survivable, but with acknowledged uncertainty about the reliability of the extrapolated results. These results were transmitted to the MMT. |
| Source | CAIB Vol. I, Chapter 6 |
| First Appearance | January 17–21, 2003 (Decision Phase) |
| Visibility Level | VISIBLE to DAT and MMT — the analysis was the official engineering assessment transmitted to decision-makers |
| Decision Relevance | DIRECT — the DAT analysis was the primary engineering input to the MMT risk assessment |
| Notes | The extrapolation of Crater beyond its validated range is documented in the CAIB as a significant analytical limitation. Whether the uncertainty associated with the extrapolation was prominently communicated in the MMT briefing is a key CR coding question. |

---

**S-005 — Engineer requests for DoD imaging (January 17–24, 2003)**

| Field | Value |
|-------|-------|
| Signal ID | S-005 |
| Description | Multiple engineers from NASA — including Rodney Rocha, the chief thermal protection engineer, and engineers from the Mission Evaluation Room — independently identified that the actual extent of the damage to the left wing RCC panels was unknown and could not be determined from available data. These engineers requested that the Department of Defense be asked to provide satellite imagery of the orbiter in orbit to assess the actual damage. Requests were made through email and internal communication channels. The requests did not reach the MMT through official channels as formal safety-of-flight concerns. |
| Source | CAIB Vol. I, Chapter 6; CAIB Vol. VI |
| First Appearance | January 17–24, 2003 (Decision Phase) |
| Visibility Level | VISIBLE to requesting engineers; NOT formally visible to MMT as elevated safety concern |
| Decision Relevance | DIRECT — the imaging requests represent the engineering signal that additional information was needed to assess the actual damage |
| Notes | The CAIB documents that DoD had informally offered imaging assistance, that multiple engineers requested imaging, and that these requests were routed in ways that did not result in a formal MMT decision to pursue imaging. The organizational path by which the imaging requests were handled is a key signal for CR and CDA coding. |

---

**S-006 — Crater model extrapolation flag (January 2003)**

| Field | Value |
|-------|-------|
| Signal ID | S-006 |
| Description | During the DAT analysis (S-004), at least one analyst recognized that the foam piece mass (approximately 1.67 lbs) exceeded Crater's validated input range. The analyst noted the extrapolation in analysis communications. The CAIB documents that this concern was present in the engineering record. Whether this concern was prominently communicated in the official DAT findings transmitted to the MMT is the key coding question. |
| Source | CAIB Vol. I, Chapter 6 |
| First Appearance | January 2003 (during DAT analysis) |
| Visibility Level | VISIBLE within the DAT engineering context; visibility to the MMT is uncertain |
| Decision Relevance | HIGH — if the Crater extrapolation concern reached the MMT with its full uncertainty implications, the MMT had information suggesting the analysis was unreliable for this foam mass. |
| Notes | This signal is the most proximate CDA/CR-relevant finding in the Decision Phase. Its visibility path — from engineering analysis to MMT briefing — is the key organizational question. |

---

**S-007 — Wing Leading Edge RCC panel thermal threshold**

| Field | Value |
|-------|-------|
| Signal ID | S-007 |
| Description | The Reinforced Carbon-Carbon panels on the shuttle wing leading edge were designed to withstand re-entry plasma temperatures up to a specific threshold. A breach of the RCC panels of sufficient size would allow superheated plasma to enter the wing structure during re-entry, causing progressive structural failure. The threshold for catastrophic failure was a function of breach size, location, and re-entry angle and conditions. The STS-107 foam strike created a breach that exceeded this threshold. |
| Source | CAIB Vol. I, Chapter 3 (technical analysis) |
| First Appearance | Design specification — inherent in the shuttle's TPS architecture throughout the program |
| Visibility Level | VISIBLE to thermal engineers — the TPS threshold was a known design parameter; the actual state of the TPS after the foam strike was UNKNOWN during the Decision Phase |
| Decision Relevance | DIRECT — the physical threshold whose exceedance caused vehicle loss |
| Notes | The fundamental problem during the Decision Phase was that the actual damage state — whether the breach exceeded the threshold — was unknown and could not be determined without imaging. S-005 (imaging requests) and S-007 (threshold) are directly coupled: the imaging requests were specifically motivated by the need to assess whether S-007 had been breached. |

---

**S-008 — Organizational culture signals — safety voice suppression (documented throughout program)**

| Field | Value |
|-------|-------|
| Signal ID | S-008 |
| Description | The CAIB Vol. VI documents a pattern across the shuttle program in which dissenting engineering voices faced structural barriers to formal elevation. The organizational culture made it difficult for engineers to challenge management decisions through official channels. Engineers who believed a concern warranted further investigation had limited formal mechanisms to escalate above a management determination. |
| Source | CAIB Vol. VI |
| First Appearance | Documented as a pattern throughout the shuttle program's history; specifically relevant to the STS-107 decision period |
| Visibility Level | VISIBLE to individual engineers who experienced the barriers; not visible as a formal organizational characteristic in the official risk record |
| Decision Relevance | STRUCTURAL — this signal represents the organizational condition that shaped how signals S-005 and S-006 were routed and received |
| Notes | S-008 is a structural/organizational signal rather than a technical signal. Its inclusion is justified by the CAIB's explicit organizational findings. It is the organizational condition that prevented S-005 (imaging requests) from reaching the MMT as a formal safety-of-flight concern. |

---

**S-009 — MMT risk assessment and decision record (January 17–24, 2003)**

| Field | Value |
|-------|-------|
| Signal ID | S-009 |
| Description | The MMT's assessment of the STS-107 foam strike, culminating in the decision not to formally request DoD imaging. The MMT determination: (a) the foam strike was an in-family anomaly consistent with prior experience; (b) the DAT analysis showed the damage was manageable; (c) there was no in-orbit repair capability, so imaging would not change the mission outcome; (d) the mission would proceed as planned. |
| Source | CAIB Vol. I, Chapter 6 |
| First Appearance | January 17–24, 2003 (Decision Phase) |
| Visibility Level | VISIBLE to MMT members; limited visibility to the broader engineering community |
| Decision Relevance | DIRECT — this is the operative decision of the Decision Phase |
| Notes | The CAIB's analysis of the MMT decision is extensive. The rationale "imaging would not change the outcome" is specifically critiqued: if imaging had revealed catastrophic damage, options including rescue or emergency re-entry preparation would have been available. The rationale represents a significant analytical gap in the MMT's decision framework. |

---

## Section B5 — AP Signal Coding

### WSP — Weak Signal Preservation

**Assessment: PRESENT — HIGH CONFIDENCE**

**Evidence:**

The multi-mission foam debris strike history (S-001) constitutes the primary WSP signal environment. Across 87+ missions (STS-2 through STS-113), foam debris strikes were individually documented, individually assessed, and individually classified as acceptable anomalies. No single foam strike event exceeded the threshold that would trigger a safety-of-flight hold or a systemic program review. The classification criterion was the absence of mission loss: because no mission had been lost to foam damage, foam strikes were treated as within acceptable operational bounds.

The WSP failure pattern is the absence of an aggregation mechanism that would combine the series of individually acceptable foam strike events into a cumulative risk assessment. Each strike was assessed on its own terms:
- Did this strike produce damage within previously observed ranges? → Acceptable.
- Did any prior mission lose a vehicle to foam damage? → No. → Acceptable.

This assessment framework explicitly suppressed the aggregation that would have been required to identify the systematic increase in foam debris events, the escalating scale of the STS-112 strike (S-002), and the unprecedented scale of the STS-107 strike (S-003).

**WSP sub-criteria assessment:**

WSP-1 (signal present in evidence environment): Present — the foam strike pattern is documented across 87+ missions.

WSP-2 (signal individually below threshold): Present — each foam strike was individually classified as acceptable; no single strike triggered a systemic safety review.

WSP-3 (no aggregation mechanism): Present — the CAIB documents that no formal mechanism existed for cumulative risk assessment of foam debris strikes across the shuttle fleet's history.

**WSP coding: PRESENT — all three sub-criteria satisfied at high confidence**

**Additional WSP signal: STS-107 specific signals.** During the Decision Phase, the DAT analysis (S-004) and the Crater extrapolation concern (S-006) together constitute a WSP sub-pattern within the Decision Phase: the uncertainty about the actual damage extent (S-006 extrapolation concern, S-005 imaging requests) was individually raised by multiple engineers but was not aggregated into a formal safety-of-flight challenge to the MMT determination.

---

### CDA — Cross-Domain Admission

**Assessment: PRESENT — MEDIUM-HIGH CONFIDENCE**

**Evidence:**

The primary CDA signal is the movement of engineering concern from the technical analysis domain to the mission management decision domain.

**CDA-1 (signal from different domain):** The engineering uncertainty about the foam strike damage extent (S-005, S-006) originated in the technical analysis domain — engineers and analysts who had domain expertise in TPS damage assessment and who had direct access to the Crater analysis limitations. The Mission Management Team operated in the mission management domain, with different organizational authority, different decision criteria, and different information processing norms.

**CDA-2 (signal not fully admitted into decision process):** The CAIB documents that the engineering uncertainty about the foam strike — specifically, the concern that the actual damage extent was unknown — was not admitted into the MMT decision process in a form that reflected its full implications. Specifically:
- The Crater extrapolation concern (S-006) was noted in engineering communications but the degree to which it was prominently communicated in the official MMT briefing is uncertain.
- The imaging requests (S-005) were made but were routed in ways that did not result in a formal MMT deliberation on whether to pursue imaging as a response to uncharacterized risk.
- The CAIB documents that individual engineers who believed the damage was potentially catastrophic did not have a formal channel to escalate this concern as a safety-of-flight challenge above the MMT determination.

**CDA-3 (organizational admissibility architecture):** The organizational structure described in S-008 — the cultural suppression of dissenting engineering voices — constitutes an admissibility architecture that limited which signals could cross from the engineering domain to the mission management decision domain as formal safety-of-flight concerns.

**CDA coding: PRESENT — all three sub-criteria present; confidence is medium-high rather than high because the organizational admissibility architecture is more complex than the pure technical boundary failure seen in T1-002**

---

### CR — Contradiction Retention

**Assessment: PRESENT — HIGH CONFIDENCE**

**Evidence:**

At least two explicit contradictions are present in the Decision Phase evidence environment:

**Contradiction CR-A — DAT assessment vs. engineer concern about unknown damage:**

Signal A (DAT assessment, S-004): The foam strike damage is manageable; the Crater analysis suggests survivable damage levels.

Signal B (engineering uncertainty, S-005, S-006): The actual damage extent is unknown because Crater was extrapolated beyond its validated range; imaging is needed to determine whether the damage is actually within survivable limits.

These two signals are in direct structural contradiction on the same factual parameter: whether the actual damage was survivable. The DAT assessment asserted that the damage was likely survivable based on an extrapolated model. The engineer uncertainty signals asserted that the model extrapolation made the assessment unreliable and that the actual damage extent was unknown.

The contradiction was resolved by accepting Signal A (the DAT assessment) and treating Signal B (the uncertainty) as insufficient to require mission modification.

**Contradiction CR-B — MMT's "no in-orbit repair capability" rationale vs. available options:**

The MMT's rationale for not pursuing imaging included the assertion that imaging would not change the mission outcome because there was no in-orbit repair capability (S-009). This rationale was in potential contradiction with available options: the International Space Station was in orbit and a rescue mission was theoretically possible; emergency contingency re-entry procedures existed. The CAIB specifically documents that options existed that imaging might have activated.

**CR sub-criteria assessment:**

CR-1 (two signals in direct contradiction on the same parameter): Present — S-004 (damage manageable) and S-005/S-006 (damage extent unknown, analysis unreliable) are directly contradictory on whether the TPS breach was survivable.

CR-2 (both signals present in evidence environment): Present — both the DAT assessment and the engineering uncertainty were present in the programme's information environment during the Decision Phase.

CR-3 (contradiction resolved by discarding one signal): Present — the MMT accepted the DAT assessment and classified the engineering uncertainty as insufficient to require mission modification. The imaging requests (S-005) were not escalated to a formal MMT deliberation, which constitutes the discarding of the uncertainty signal.

**CR coding: PRESENT — all three sub-criteria satisfied at high confidence**

**This is the strongest CR finding in the batch.** The CR for T1-004 has specific organizational documentation (the CAIB explicitly documents the contradiction between engineering concern and MMT assessment) that the CR codings for T1-002 and T1-003 lack. The imaging request denial constitutes a formally documented contradiction resolution: S-005 (the signal that more information was needed) was present, was received by organizational actors who had the authority to act on it, and was resolved in favor of the existing assessment rather than in favor of uncertainty acknowledgment.

---

## Section B6 — EE Structural Coding

### Fragility Accumulation (FA)

**Assessment: PRESENT — HIGH CONFIDENCE**

**Evidence:**

The CAIB documents multiple independently managed system margins that were simultaneously below their designed safety levels at the time of STS-107. The reconstruction identifies four primary FA elements:

**FA element 1 — TPS foam debris impact safety margin (S-001, S-002):**

The normalization of foam debris strikes across 87+ missions represented a progressive degradation of the organizational safety margin: each acceptable classification of a foam strike implicitly reduced the threshold below which the next foam strike would be treated as within normal parameters. By STS-112 (October 2002), a large bipod foam strike had been classified as acceptable. The organizational foam debris safety margin for STS-107 was at a minimum — prior to STS-107, the largest documented bipod strike had been accepted, making the STS-107 strike — which was larger still — an unprecedented test of a margin that had been progressively eroded.

**FA element 2 — Engineering voice margin (S-008):**

The CAIB's organizational analysis documents that the shuttle programme's culture had degraded the effective margin for dissenting engineering voices to reach decision-makers. Engineers who identified safety concerns faced structural barriers to formal escalation. The organizational safety voice margin — the institutional capacity to surface and formally deliberate on engineering disagreement — was below its designed level.

**FA element 3 — Assessment tool validation margin (S-004, S-006):**

The Crater model was the approved tool for foam impact assessment. For the STS-107 foam mass (approximately 1.67 lbs), Crater was extrapolated beyond its validated range. The assessment tool margin — the confidence that the approved tool would produce reliable results for the observed impact conditions — was zero: the tool was being used beyond its own specifications.

**FA element 4 — Organizational safety culture review margin (S-001):**

The CAIB documents that multiple earlier program reviews had identified cultural issues with safety voice and normalization, but had not produced substantive organizational change. The institutional margin for self-correction through internal review was degraded.

**FA sub-criteria assessment:**

FA-1 (at least three independently managed margins simultaneously degraded below nominal): Present — four elements are identified, each managed by distinct organizational functions: TPS safety classification (flight operations/safety), engineering voice (organizational culture/management), assessment tool scope (engineering analysis), and institutional review (programme management).

**FA coding: PRESENT — four independently managed margins simultaneously below designed safety levels for STS-107**

---

### Load Displacement (LD)

**Assessment: PRESENT — HIGH CONFIDENCE**

**Evidence:**

**LD-1 — Risk transferred without information:**

The technical risk assessment for the STS-107 foam strike was transferred from the engineering analysis domain (DAT/MER engineers) to the Mission Management Team through the official DAT briefing process. The risk that was transferred — the DAT's analysis — did not carry the full informational content of the engineering uncertainty. Specifically, the Crater extrapolation concern (S-006) and the engineers' belief that the actual damage extent was genuinely unknown were present in the engineering domain but did not transfer completely to the MMT domain in a form that would enable the MMT to assess the residual risk independently.

**LD-2 — Source appears stable:**

The Debris Assessment Team produced an official analysis through the program's established process. The engineering domain appeared to have resolved the assessment question: a team had been formed, an analysis had been conducted, and results had been produced. The source of the risk assessment — the engineering team — appeared to have completed its function and delivered a result.

**LD-3 — Destination holds risk without assessment:**

The MMT held the residual risk of the STS-107 foam strike — specifically, the uncertainty about the actual damage extent — without the information required to assess it. The MMT made its decision based on the DAT analysis and the historical normalization context. The engineering uncertainty (that the actual damage was unknown because Crater was extrapolated) was present in the evidence environment but was not part of the information the MMT held in a form that would enable independent risk evaluation.

**LD coding: PRESENT — all three sub-criteria satisfied**

---

### Threshold Instability (TI)

**Assessment: PRESENT — HIGH CONFIDENCE**

**Evidence:**

**TI-1 (critical parameter operating within measurement uncertainty of design limit):**

The RCC panel thermal threshold — the breach size and location at which plasma ingestion during re-entry would be catastrophic — was the critical design limit for this case. The STS-107 foam strike created a breach that, as established by the post-accident investigation, exceeded this threshold and caused vehicle loss.

During the Decision Phase, the critical finding is that the actual breach size was unknown (it could not be assessed without imaging), and the assessment tool being used (Crater) was extrapolated beyond its validated range. This means the system was operating within measurement uncertainty of the threshold: the engineering team could not determine whether the actual breach size was below or above the catastrophic threshold. The uncertainty was not "within measurement uncertainty of a safe value" — it was within measurement uncertainty of an unknown, potentially catastrophic value.

**TI coding: PRESENT — the TPS was operating with unknown proximity to the catastrophic damage threshold, with the assessment uncertainty itself constituting a form of threshold instability: the system could not determine which side of the threshold it was on**

---

### Cascade Precondition (CP)

**Assessment: PRESENT**

**Evidence:**

**CP coupling 1 — Physical damage cascade:**

The foam strike breach (S-003) created a physical cascade precondition: RCC panel breach → plasma ingestion during re-entry → wing structural failure → vehicle breakup. Each step in this cascade was coupled to the preceding step: the breach enabled plasma ingestion; plasma ingestion caused structural failure; structural failure caused vehicle breakup. The cascade was not reflected in the pre-launch or mission operations risk model because the breach was not known (it would have required imaging to detect).

**CP coupling 2 — Decision-organizational cascade:**

The organizational decision not to pursue imaging (S-009) removed the intervention point that could have interrupted the physical cascade. The coupling: the physical damage cascade (CP coupling 1) was causally coupled to the organizational decision cascade (the normalization of the foam strike risk → DAT analysis → MMT decision not to pursue imaging → no knowledge of breach severity → no protective action). The organizational decision cascade did not amplify the physical damage, but it eliminated the feedback mechanism that would have identified the physical cascade condition and potentially enabled protective response.

**CP sub-criteria assessment:**

CP-1 (at least two coupled failure modes): Present — the physical damage cascade and the organizational decision cascade are coupled.

CP-2 (coupling not reflected in decision-phase risk model): Present — the MMT's decision framework did not include the coupling between the decision not to pursue imaging and the probability of a catastrophic reentry outcome: the rationale that imaging would not change the outcome eliminated consideration of the imaging→knowledge→protective action chain.

**CP coding: PRESENT**

**Note:** A-20 (Clarification Addendum v2) governs CP coding in reconstruction. This assessment is documented per protocol; any additional A-20 sub-criteria documentation requirements should be applied during Artifact C review.

---

### Hidden Common Link (HCL)

**Assessment: PRESENT — MEDIUM CONFIDENCE**

**Evidence:**

**HCL identification:**

The multi-mission foam debris normalization history (S-001, S-002) and the STS-107 foam strike assessment (S-003, S-004, S-009) share a common structural cause: the organizational risk assessment framework that evaluated each foam strike individually rather than cumulatively, and that treated the absence of prior mission loss as evidence of acceptable risk rather than as the absence of a prior triggering event.

**HCL-1 (signals from structurally independent sources):** S-001 (history of foam strikes from missions 1981–2002) and S-003/S-004 (STS-107 foam strike and its assessment) originated in different operational contexts — different missions, different time periods, different engineering personnel.

**HCL-2 (non-connection documented during decision phase):** The connection between the historical normalization pattern and the STS-107 assessment was not explicitly made during the MMT's risk deliberations. The MMT assessed the STS-107 strike within the existing normalization framework rather than recognizing the normalization framework itself as a structural cause of the risk.

**HCL-3 (investigation confirmed shared structural cause):** The CAIB confirmed that the normalization of deviance was the shared organizational cause connecting the historical foam strike pattern and the STS-107 assessment decision.

**HCL-4 (connection non-obvious from within either domain):** From within the operational history context, individual missions' foam strike classifications were each locally valid. From within the STS-107 decision context, the DAT analysis and the MMT deliberation operated on the basis of the established assessment framework rather than examining the framework itself.

**HCL confidence caveat:** HCL is coded at medium rather than high confidence because the shared cause (normalization framework) is an organizational pattern rather than a discrete technical cause. This makes HCL-4 (non-obvious from within either domain) somewhat harder to establish: individual decision-makers were aware of the normalization history but may have been positioned to recognize its implications. The CAIB's organizational analysis suggests the connection was not made; whether HCL-4 is fully satisfied at the individual actor level is uncertain.

**HCL coding: PRESENT — medium confidence; all four sub-criteria present, HCL-4 with uncertainty**

---

### Structural Incongruence (SI)

**Assessment: PRESENT — HIGH CONFIDENCE**

**Evidence:**

**Operational assumption (organizational/decision domain):**

The MMT's decision framework operated on the assumption that the STS-107 foam strike was "in-family" — within the range of foam debris events that had been previously assessed and accepted as safe. This assumption embedded the normalization framework: foam strikes of the historically observed type are within acceptable bounds.

**Operational reality (physical/technical domain):**

The STS-107 foam strike was qualitatively different from prior strikes: it was from a historically concerning ET region (bipod, same as STS-112), it was of unprecedented mass (~1.67 lbs), and it struck the RCC leading edge panels at a location and with sufficient energy to create a breach beyond the TPS threshold. The assumption that this strike was "in-family" with prior acceptable events was structurally incongruent with the physical reality of the strike's consequences.

The incongruence was not visible during the Decision Phase because:
1. The actual damage extent was unknown (imaging not pursued).
2. The assessment tool (Crater) was extrapolated beyond validated range, masking the incongruence.
3. The normalization framework filtered the assessment of whether the strike was actually "in-family."

**SI coding: PRESENT — the operational assumption (in-family anomaly) was structurally incongruent with the operational reality (unprecedented breach of critical TPS threshold)**

---

## Section B7 — Visibility Analysis

### Which Signals Were Visible

**S-001 (foam strike normalization history):** VISIBLE as individual mission records — each mission's foam strike record existed. Visible as a cumulative pattern — PARTIALLY VISIBLE to those who reviewed the full history (the CAIB explicitly reviewed it); not visible as a cumulative risk indicator within the normal MMT operational briefing process.

**S-002 (STS-112 large foam strike):** VISIBLE to the shuttle program — documented, investigated, and classified. Visibility as a precursor signal for STS-107 assessment — NOT formally established during the STS-107 decision process.

**S-003 (STS-107 foam strike):** VISIBLE from post-launch imagery review. Formally communicated to the MMT.

**S-004 (DAT Crater analysis):** VISIBLE to the DAT and the MMT — the official analysis was formally transmitted.

**S-005 (imaging requests):** VISIBLE to requesting engineers and their immediate supervisors. NOT VISIBLE to the MMT as a formal safety-of-flight concern.

**S-006 (Crater extrapolation concern):** VISIBLE within the DAT engineering context. Visibility to the MMT — UNCERTAIN.

**S-007 (RCC threshold):** VISIBLE as a design parameter — the threshold was known. The actual proximity of the STS-107 damage to this threshold — NOT VISIBLE without imaging.

**S-008 (organizational safety voice suppression):** VISIBLE to individual engineers who experienced it; NOT VISIBLE as an organizational characteristic in the formal safety and risk record.

### Which Signals Were Filtered

**The Crater extrapolation concern (S-006):** FILTERED from full MMT visibility — the concern that the model was extrapolated beyond its validated range was present in the engineering record but its prominence in the official MMT briefing is documented as insufficient to trigger a formal uncertainty acknowledgment in the MMT deliberation.

**The imaging request signal (S-005):** FILTERED from MMT formal deliberation — multiple engineers requested imaging, but the organizational routing of these requests did not result in a formal MMT decision to deliberate on whether to pursue imaging as a response to uncharacterized risk.

**The cumulative foam strike pattern (S-001):** FILTERED from the STS-107 assessment — the normalization history was present but the STS-107 assessment was conducted within the normalization framework rather than against the cumulative pattern.

**The actual damage state (S-007):** FILTERED by the decision not to pursue imaging — the unknown damage extent was filtered from the decision process because the assessment tool that could have identified it (imaging) was not deployed.

### Filtering Mechanism

**Primary filtering mechanism — Normalization-through-precedent (WSP):**

The classification of each prior foam strike as acceptable created a self-reinforcing standard: new foam strikes were assessed against the precedent that prior strikes of this type had been acceptable. This mechanism filtered the cumulative risk signal (S-001) by converting it from a risk indicator (increasing frequency and scale of foam strikes) into a safety confirmation (no prior mission loss = acceptable).

**Secondary filtering mechanism — Organizational admissibility architecture (CDA, CR):**

The organizational culture documented in S-008 created a filtering condition for engineering concerns seeking to cross from the technical analysis domain to the mission management decision domain as formal safety-of-flight challenges. The imaging requests (S-005) and the Crater extrapolation concern (S-006) were filtered by this architecture.

**Tertiary filtering mechanism — Decision rationale foreclosure:**

The MMT's rationale that "imaging would not change the outcome because there is no in-orbit repair capability" functionally foreclosed deliberation on the uncertainty: if the conclusion was that the mission would proceed regardless of what imaging showed, the uncertainty signal (S-005, S-006) could not generate an actionable concern. This rationale-based filtering is distinct from the organizational filtering mechanisms: it operated at the level of decision logic rather than organizational hierarchy.

### Organizational Location of Filtering

The primary filtering occurred in the organizational interface between the engineering analysis domain (DAT, MER engineers) and the Mission Management Team decision domain. The filtering was not a single individual's decision; it was the product of the organizational architecture: the assessment briefing process that determined which signals from the engineering domain reached the MMT, and in what form, constituted the filtering interface.

A secondary filtering location was within the engineering domain itself: engineers who identified concerns about the Crater extrapolation and who wanted to request imaging were filtered by the organizational culture (S-008) from reaching the formal escalation mechanisms that would have required the MMT to formally deliberate on those concerns.

---

## Section B8 — Alternative Explanation Inventory

*Supported by source materials. No ranking. No comparison to EE framework. Inventory only.*

**AE-001 — Foam debris physical failure account:**
The shuttle was lost because a foam piece struck the wing during ascent and created a breach in the TPS that was fatal during re-entry. Root cause (physical): foam debris impact exceeding TPS survivability threshold.

**AE-002 — Normalization of deviance organizational account:**
The shuttle program normalized foam debris strikes as acceptable anomalies through a multi-year process of accepting each individual strike without loss. This normalization caused the STS-107 strike to be assessed within an established "acceptable" framework rather than as an unprecedented event. Root cause (organizational): normalization of deviance pattern established over 22 years of operations.

**AE-003 — Communication failure account:**
Engineering concerns about the foam strike and the Crater model extrapolation were present but were not effectively communicated to the Mission Management Team in a form that would trigger formal deliberation. Root cause: communication breakdown between engineering analysis and management decision-making.

**AE-004 — Management decision-making failure:**
The MMT made a decision not to pursue imaging based on an incomplete risk assessment and a rationale (no in-orbit repair capability) that did not account for all available options. Root cause: decision-making failure by the MMT to adequately characterize the uncertainty.

**AE-005 — Assessment tool inadequacy:**
The Crater model was not validated for the foam mass encountered in STS-107. The use of an extrapolated model produced an analysis that under-represented the actual damage risk. Root cause: reliance on an assessment tool beyond its validated range.

**AE-006 — Safety culture systemic failure:**
The shuttle program's organizational culture systematically suppressed engineering concern and made it difficult for technical experts to challenge management determinations. Root cause (systemic): organizational safety culture that under-weighted technical dissent.

**AE-007 — Resource/process constraint:**
The decision not to pursue imaging may have been influenced by perceptions that requesting DoD imaging would be disruptive, resource-intensive, or unlikely to change the mission outcome. Root cause: operational and resource constraints on the formal imaging request process.

**AE-008 — Absence of in-flight repair capability:**
The CAIB notes that the MMT's rationale included the belief that there was no in-orbit repair capability. If this belief were accurate, the decision not to pursue imaging would have a different character. The CAIB documents that the belief was not fully accurate (rescue options existed). Root cause (conditional): if the in-orbit options were indeed absent, the decision not to pursue imaging would be more defensible.

---

## Section B9 — Reconstruction Findings

### Signal Environment

The Columbia (STS-107) Pre-Decision Phase evidence environment contained a 22-year accumulation of foam debris strike signals (S-001), each individually classified as acceptable, that established a normalized assessment framework within which the STS-107 foam strike (S-003) was assessed. The STS-107 strike was documented from post-launch imagery review and formally communicated to the Mission Management Team. The Decision Phase evidence environment contained a direct contradiction (CR-A): the official DAT analysis (S-004) characterizing the damage as manageable and the engineering uncertainty signals (S-005, S-006) indicating that the actual damage extent was unknown and the assessment tool was extrapolated beyond its validated range.

This is the most AP-dense signal environment in the batch: WSP, CDA, and CR are all present at medium-high to high confidence, with CR being the most clearly evidenced of any case in the batch. The direct contradiction between the DAT assessment and the engineering uncertainty is documented in the CAIB with specificity that makes CR sub-criteria assessment more reliable than for T1-002 or T1-003.

### Structural Environment

All five primary EE structures are coded Present: Fragility Accumulation (four elements, high confidence), Load Displacement (all three sub-criteria, high confidence), Threshold Instability (threshold unknown proximity, high confidence), Cascade Precondition (two couplings), and Hidden Common Link (medium confidence). Structural Incongruence is coded Present (high confidence). The FA finding for T1-004 is the clearest in the batch: the CAIB's organizational analysis explicitly documents multiple simultaneously degraded safety margins, which maps directly to the FA structural definition.

The most distinctive structural co-occurrence in T1-004 is FA + LD: the fragility accumulation (multiple degraded margins) created the conditions in which the load displacement (technical risk transferred without full informational content) could produce an incomplete MMT risk assessment. Unlike T1-003 (where LD and SI were the primary co-occurring structures), T1-004's primary structural combination is FA + LD + CR — the fragility accumulation created the organizational context, the load displacement created the information gap, and the CR resolved the contradiction in favor of the incomplete assessment.

### Visibility Environment

The primary visibility finding is the dual-mechanism filtering: the normalization-through-precedent mechanism (WSP) that filtered the cumulative foam strike signal from the assessment of S-003, and the organizational admissibility architecture (CDA/CR) that filtered the engineering uncertainty signals from reaching the MMT as a formal safety-of-flight challenge. Unlike T1-002 (where filtering was primarily architectural/technical) and T1-003 (where filtering was primarily prior-model-based), T1-004's filtering is primarily organizational and cultural — embedded in the decision-making structures and norms of the shuttle program.

### AP Environment

WSP, CDA, and CR are all coded Present. CR is coded at the highest confidence of any AP finding in the batch. The contradiction between the DAT assessment and the engineering uncertainty requests is formally documented in the CAIB, making the CR sub-criteria assessment more secure than in T1-002 (where CR was partial/uncertain) or T1-003 (where CR was partial/low confidence).

---

## Section B10 — Reconstruction Freeze

### Session Boundary Confirmation

This reconstruction was conducted without access to Artifact A predictions for T1-004 or for any other case in Batch 1. No prediction document, prediction summary, comparison document, or Artifact C material was accessed during this session. The reconstruction findings in Sections B4 through B9 were produced independently of prediction content.

### Reconstruction Completion Record

| Field | Value |
|-------|-------|
| Reconstruction completion date | 2026-05-31 |
| Analyst identity | EE/CIS Research Governance Team — AI-assisted |
| Artifact A access during session | NONE — session boundary maintained |
| Primary sources accessed | CAIB Vol. I and Vol. VI (as mediated through AI training data) |
| Session boundary compliance | CONFIRMED |

### Batch 1 Reconstruction Completeness Declaration

With the freeze of this document (Artifact B, T1-004), all three Artifact B reconstructions for Prediction Batch 1 are complete:

| Case | Artifact B Status |
|------|------------------|
| T1-002 (Mars Climate Orbiter) | FROZEN — 2026-05-31 |
| T1-003 (Ariane 5 Flight 501) | FROZEN — 2026-05-31 |
| T1-004 (Space Shuttle Columbia) | FROZEN — 2026-05-31 |

All three Artifact B reconstructions are frozen. Artifact C comparison sessions may now commence per protocol: Artifact A predictions and Artifact B reconstructions may be simultaneously accessed in Artifact C sessions for the first time.

### Freeze Declaration

This document is frozen as of 2026-05-31. No finding may be revised in response to prediction content. Artifact C is now authorized to open Artifact A and this document simultaneously for the first time.

**AP coding status at freeze:**
- WSP: PRESENT
- CDA: PRESENT
- CR: PRESENT — HIGH CONFIDENCE

**EE coding status at freeze:**
- Load Displacement: PRESENT
- Fragility Accumulation: PRESENT — HIGH CONFIDENCE
- Threshold Instability: PRESENT
- Cascade Precondition: PRESENT
- Hidden Common Link: PRESENT — MEDIUM CONFIDENCE
- Structural Incongruence: PRESENT

**FROZEN — 2026-05-31**

---

*Track A — Artifact B — T1-004 Space Shuttle Columbia Reconstruction | EE/CIS Research Governance Team | 2026-05-31*  
*FROZEN — REC-ART — RECONSTRUCTION ONLY — ARTIFACT C SESSIONS NOW AUTHORIZED*
