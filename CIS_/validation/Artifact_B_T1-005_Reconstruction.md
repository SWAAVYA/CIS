# Track A — Artifact B
# Case Reconstruction: T1-005 — Deepwater Horizon (Macondo Well Blowout)

**Artifact designation:** Artifact B — Case Reconstruction  
**Case ID:** T1-005  
**Status:** FROZEN  
**Session type:** Reconstruction Session — Artifact A Batch 2 blinded  
**Governing protocol:** Protocol v1 (A-02) + Clarification Addendum v1 (A-05) + Clarification Addendum v2 (A-20)  
**Session boundary:** This reconstruction was conducted without access to Artifact A Batch 2 predictions for any case.

---

## Mandatory Disclosure — GD-002 R-01 / A-03

**DISCLOSURE REQUIRED IN ALL TRACK A OUTPUTS**

This is a retrospective structured validation exercise. The AI system conducting this reconstruction (Claude, Anthropic) has been trained on data that includes the National Commission on the BP Deepwater Horizon Oil Spill and Offshore Drilling Report (2011), the Joint Investigation Team Report (2011), the National Commission Chief Counsel's Report (2011), and extensive secondary literature on the Deepwater Horizon disaster. AI prior exposure for T1-005 is assessed as HIGH (M-06 v1.4). The negative pressure test misinterpretation, the cement job failures, and the multi-party organizational failures are extensively documented in engineering, legal, and public policy literature since 2010.

Kappa values from CAL-2026-001 are intra-system consistency metrics pending human coder validation (OI-001).

**Classification:** RETROSPECTIVE STRUCTURED VALIDATION — AI-ASSISTED, HUMAN VALIDATION PENDING

---

## Section B1 — Case Metadata

| Field | Value |
|-------|-------|
| Case ID | T1-005 |
| Case Name | Deepwater Horizon (Macondo Well Blowout) |
| Domain | Energy / Marine Engineering / Organizational Decision-Making |
| Tier | 1 |
| AI Prior Exposure Assessment | HIGH |
| Primary Source | National Commission on the BP Deepwater Horizon Oil Spill and Offshore Drilling: *Deep Water: The Gulf Oil Disaster and the Future of Offshore Drilling — Report to the President.* January 2011. Washington, D.C.: U.S. Government Printing Office. |
| Supporting Sources | Joint Investigation Team Report (USCG/BOEMRE, 2011); National Commission Chief Counsel's Report (2011) |
| Source Accessibility | CONFIRMED (M-06 v1.4) |
| Reconstruction Date | 2026-05-31 |
| Analyst Identity | EE/CIS Research Governance Team — AI-assisted |
| Governing Failure Conditions | Artifact 0 v1.0 |
| Artifact A Access | NONE — blinded per session boundary protocol |

**Organizational parties:**
- **BP:** Well operator and leaseholder; responsible for well design and ultimate decision authority on all major operations
- **Transocean:** Drilling contractor; operated the Deepwater Horizon rig; responsible for rig operations, pressure monitoring, and well control on the rig
- **Halliburton:** Cementing contractor; responsible for cement job design, testing, and execution
- **Cameron International:** Manufactured the Blowout Preventer (BOP)
- **Minerals Management Service (MMS):** Federal regulatory authority for offshore drilling (subsequently reorganized as BSEE/BOEM)

---

## Section B2 — Phase Boundary Verification

Phase boundaries adopted from M-06 v1.4 (incorporating B2R-02 protocol decision — October 2009 adopted as Pre-Decision Phase start).

### Pre-Decision Phase

**Start boundary:** October 2009 — Commencement of Macondo well (Mississippi Canyon Block 252) drilling operations by the Marianas rig. Justification: The October 2009 start captures the full Macondo well operational signal history, including the Marianas-phase well control events that are part of the signal environment the National Commission documents as contextually relevant to the April 2010 decisions.

**End boundary:** April 14, 2010 — Commencement of final temporary abandonment procedures, as documented in National Commission Report Chapter 4 timeline. The temporary abandonment sequence (final production casing run, cement job planning and execution, negative pressure test, displacement) began on approximately April 14, 2010. The pre-Decision Phase ends when the specific operational sequence directly leading to the blowout commences.

**Boundary ambiguity note:** The Pre-Decision Phase end is defined as April 14, 2010. Several key decisions relevant to the failure (centralizer count, CBL decision) were made within the April 14-20 Decision Phase window. These decisions are coded as Decision Phase signals, but they draw on the Pre-Decision Phase context (well history, Halliburton cement test results from February/March 2010) for their epistemic environment. This boundary placement is consistent with M-06 v1.4 and is retained.

### Decision Phase

**Start:** April 14, 2010 — Commencement of final temporary abandonment procedures.

**End:** April 20, 2010, approximately 21:49 CDT — Blowout, explosions, and loss of the Deepwater Horizon. The operative terminal decision event is the acceptance of the negative pressure test as passed and the commencement of displacement (approximately 17:00–21:00 CDT, April 20, 2010).

---

## Section B3 — Evidence Timeline

| Date | Event | Actor(s) | Signal | Classification at Time |
|------|-------|---------|--------|----------------------|
| Oct 2009 | Macondo well drilling commences with Marianas rig at Mississippi Canyon Block 252. Macondo is a deep water well (approximately 18,360 feet total depth; 5,000 feet of water depth). | BP / Marianas / Transocean | Well operations commencement | Nominal |
| Oct–Nov 2009 | During Marianas drilling phase, well encounters difficult formation conditions. Multiple well control events (kicks — unexpected influxes of formation fluids into the wellbore) occur and are managed through standard well control procedures. Each kick is handled and classified as resolved. Marianas damaged by Hurricane Ida (November 2009) and drilling is suspended. | BP / Marianas crew | Well control events during initial drilling phase | Each kick classified as resolved; aggregate pattern not formally assessed as a program-level concern |
| Feb 2010 | Deepwater Horizon takes over the Macondo well after Marianas is repaired/replaced. Well operations resume. | BP / Transocean / Deepwater Horizon | Rig transition; operations resume | Nominal transition |
| Feb–Mar 2010 | **Halliburton conducts pre-job cement stability tests.** Halliburton's laboratory tests on the proposed nitrogen foam cement slurry for the Macondo production casing cement job show that the foam cement is unstable under the expected downhole temperature and pressure conditions. The slurry does not maintain consistent nitrogen distribution; the cement has potential for channeling and incomplete setting. Results are generated within Halliburton's technical domain. | Halliburton cement engineers | Cement slurry instability test results — formal laboratory signal | Within Halliburton technical domain — significance for cement job quality is documentable from these results |
| Feb–Apr 14, 2010 | Continued drilling of Macondo well. Additional well control and drilling events occur and are managed. The well's difficult geology (high-pressure zones, lost circulation events) continues to produce individual signals each classified within the range of manageable operational conditions. | BP / Transocean | Ongoing drilling signals — formation pressures, drilling events | Each individually classified as within operational parameters |
| ~Apr 14, 2010 | **[Pre-Decision Phase ends / Decision Phase begins]** The 9⅞-inch production casing has been run. The final temporary abandonment procedure sequence begins. This phase will involve the cement job, negative pressure test, and displacement of drilling fluids before temporary well abandonment. | BP / Transocean | Final temporary abandonment sequence commences | Active operational sequence |
| ~Apr 15–16, 2010 | **Centralizer decision.** Halliburton engineers recommend 21 centralizers to ensure proper cement placement around the casing and reduce the risk of channeling (cement failing to surround the casing completely, leaving paths for gas migration). BP operations personnel review the recommendation and decide to use 6 centralizers — 15 fewer than recommended. Rationale recorded in internal BP communications: using additional centralizers would require additional rig time. Halliburton engineers note in internal communications that using fewer centralizers risks a poor cement job and gas channeling. | BP operations / Halliburton | Centralizer recommendation vs. decision — 21 recommended, 6 used | BP decision accepted; Halliburton concern noted internally but not escalated as a formal safety objection through operational channels |
| ~Apr 17–18, 2010 | **Additional Halliburton cement stability testing.** A further Halliburton laboratory test of the nitrogen foam cement slurry is conducted and also shows instability. The results indicate the cement as formulated does not meet stability standards. Results exist within Halliburton's technical records. The extent to which these April test results were formally communicated to BP prior to cement job execution is a key question for the reconstruction. | Halliburton cement engineers | April cement instability test results | Within Halliburton technical domain at time of cement job |
| ~Apr 18–19, 2010 | **CBL crew decision.** A Schlumberger crew is aboard the Deepwater Horizon specifically to perform a Cement Bond Log — a measurement that would verify the cement's integrity by assessing acoustic bonding of the cement to the casing and formation. BP personnel decide not to run the CBL. The Schlumberger crew is transported off the rig before the CBL is performed. The stated reason: cost and schedule (CBL would add approximately 10 hours and associated cost). | BP / Schlumberger | Decision not to run CBL — elimination of cement verification tool | BP decision accepted within operational authority |
| Apr 19–20, 2010 | **Cement job executed.** Halliburton executes the nitrogen foam cement job on the production casing with 6 centralizers. The cement is pumped as designed. No real-time verification of cement quality is available; the CBL has been eliminated. The cement job is considered complete. | Halliburton / Transocean | Cement job completion | Nominal completion — no quality verification available |
| Apr 20, 2010 ~14:00–16:00 CDT | **Negative pressure test conducted.** The negative pressure test is performed to verify that the cement seal is intact before displacing the heavy drilling mud with seawater. The procedure measures pressure at the drill pipe (which should show zero if the well is sealed). The results are anomalous: the kill line shows 0 psi (as expected if sealed) but the drill pipe shows approximately 1,400 psi (which indicates pressure from the formation — the well is NOT sealed). | BP (company man) / Transocean (tool pusher, driller) | Negative pressure test result — anomalous drill pipe pressure of ~1,400 psi | Classified as passed — attributed to "bladder effect" |
| Apr 20, 2010 ~16:00–17:00 CDT | **"Bladder effect" explanation accepted.** BP and Transocean well site leaders interpret the anomalous drill pipe pressure as resulting from the "bladder effect" — the hypothesis that the annular BOP is trapping pressure from the riser, not from the formation. The kill line at 0 psi is taken as the valid pressure reading. The test is declared passed. The National Commission subsequently found that the "bladder effect" as described is not physically possible in the well configuration used; the kill line and drill pipe should hydraulically equalize if they are connected. | BP / Transocean | "Bladder effect" explanation — contradiction resolution | Test declared passed — displacement authorized to proceed |
| Apr 20, 2010 ~17:00 CDT | **Displacement commences.** Heavy drilling mud is displaced from the riser with seawater, progressively reducing the weight of the fluid column and the hydrostatic pressure controlling the wellbore. With the cement seal compromised and the heavy mud being removed, the sole remaining barrier against formation pressure is progressively eliminated. | BP / Transocean | Displacement commenced | Operational procedure — no concerns raised at this stage |
| Apr 20, 2010 ~20:00–21:30 CDT | **Kick detection (late).** Multiple indicators of formation fluid influx become visible: pit volume gains, flow-check anomalies, and other surface indicators. These are initially either not recognized or are misinterpreted as related to displacement operations. The kick grows as formation fluids (oil and gas) continue to flow into the wellbore. | Transocean rig crew | Late kick indicators | Initially misclassified; eventually recognized as a kick |
| Apr 20, 2010 ~21:47 CDT | **BOP activated.** Well control procedures are initiated. The blowout preventer is activated in an attempt to seal the well. The BOP does not successfully seal the wellbore. Gas reaches the surface. | Transocean / rig crew | BOP activation | Emergency response |
| Apr 20, 2010 ~21:49 CDT | **Explosions and fire.** Hydrocarbon gases that have reached the rig ignite. Two explosions occur. Eleven workers are killed, seventeen injured. The rig begins to burn. | — | Mission failure | Catastrophic event |
| Apr 22, 2010 | Deepwater Horizon sinks. Macondo well continues to blow out, uncontrolled, for 87 days. | — | Well uncontrolled | Post-event |

---

## Section B4 — Signal Inventory

Signals within the Pre-Decision Phase scope (October 2009 — April 14, 2010) are the primary inventory. Decision Phase signals (April 14–20, 2010) are included for completeness and for AP coding context.

---

**S-001 — Macondo well control events during drilling (October 2009 — April 14, 2010)**

| Field | Value |
|-------|-------|
| Signal ID | S-001 |
| Description | During the Macondo well's drilling history from October 2009 through April 14, 2010, multiple well control events (kicks — unexpected influxes of formation fluids) occurred and were managed through standard well control procedures. Each kick was individually classified as resolved. The well's difficult geology produced multiple pressure challenges. The National Commission documents that the Macondo well had characteristics making it a challenging high-pressure, high-temperature environment. |
| Source | National Commission Report, Chapters 3–4; Joint Investigation Team Report |
| First Appearance | October 2009 (Marianas phase) |
| Visibility Level | VISIBLE to the operational teams (Marianas, then Deepwater Horizon crew); records documented in well logs; BP operations management had access to well reports |
| Decision Relevance | STRUCTURAL — the cumulative kick history establishes the well's pressure environment and the pattern of individually-accepted abnormal events |
| Notes | Each individual kick was managed within the well control procedures; no single kick event triggered a formal program-level safety review or a change in the well design approach. The aggregate pattern was not formally assessed as a cumulative risk indicator. |

---

**S-002 — Halliburton February/March 2010 cement stability tests (Pre-Decision Phase)**

| Field | Value |
|-------|-------|
| Signal ID | S-002 |
| Description | Halliburton's pre-job laboratory tests on the nitrogen foam cement slurry formulated for the Macondo production casing cement job showed that the slurry was unstable under the expected downhole conditions. The foam cement was not maintaining consistent nitrogen distribution in testing, indicating potential for channeling and incomplete sealing. These results were generated within Halliburton's cementing technical domain. |
| Source | National Commission Report, Chapter 3; National Commission Chief Counsel's Report |
| First Appearance | February–March 2010 |
| Visibility Level | VISIBLE within Halliburton's cement engineering domain; the degree to which these results were formally communicated to BP operations as a concern requiring action is the key CDA question |
| Decision Relevance | HIGH — these test results constitute the primary technical signal about the cement job's potential integrity risk |
| Notes | The National Commission Report documents that Halliburton's own testing showed the cement was problematic. BP did not request or receive these test results in a form that would have required a formal response before the cement job was executed. The cross-domain signal path (Halliburton technical domain → BP decision-making domain) is the primary CDA finding candidate. |

---

**S-003 — Macondo well general condition signals — formation pressure environment**

| Field | Value |
|-------|-------|
| Signal ID | S-003 |
| Description | Throughout the Pre-Decision Phase drilling history, the Macondo well's formation pressure characteristics were documented in well logs, drilling reports, and operational communications. The well's high-pressure environment was known. Formation pressure data was generated in the drilling operations domain and was available to the well engineering team. |
| Source | National Commission Report, Chapters 3–4 |
| First Appearance | October 2009 (ongoing) |
| Visibility Level | VISIBLE within the drilling and well engineering domain; accessibility across organizational boundaries (Halliburton cementing domain) is a CDA question |
| Decision Relevance | STRUCTURAL — establishes the physical pressure environment within which the cement integrity signal (S-002) must be assessed |
| Notes | The well's high-pressure characteristics made the cement job's integrity particularly critical. The National Commission documents that the combination of the well's pressure environment and the cement job's potential instability (S-002) creates the HCL structural condition. |

---

**S-004 — Halliburton centralizer recommendation (21 centralizers) — Decision Phase**

| Field | Value |
|-------|-------|
| Signal ID | S-004 |
| Description | Halliburton engineers communicated to BP that 21 centralizers were recommended to ensure adequate cement placement around the production casing and reduce the risk of channeling. This recommendation was based on well modeling showing that fewer centralizers would produce an off-center casing with associated cement placement risks. The recommendation was communicated in internal Halliburton-to-BP communications approximately April 15–16, 2010. |
| Source | National Commission Report, Chapter 3; National Commission Chief Counsel's Report |
| First Appearance | ~April 15–16, 2010 (Decision Phase) |
| Visibility Level | VISIBLE to BP operations personnel who received the recommendation |
| Decision Relevance | HIGH — the recommendation, if followed, would have reduced cement channeling risk; the decision to use 6 instead of 21 is a key Decision Phase signal |
| Notes | An internal BP communication from a BP engineer acknowledged the risk of using fewer centralizers (the engineer wrote words to the effect that using fewer centralizers risked a "nightmare" well). The decision to proceed with 6 was made at the BP operations level. |

---

**S-005 — BP decision to use 6 centralizers (vs. 21 recommended) — Decision Phase**

| Field | Value |
|-------|-------|
| Signal ID | S-005 |
| Description | BP operations personnel decided to use 6 centralizers instead of the 21 recommended by Halliburton engineers. The stated rationale was rig time and schedule. Halliburton engineers' internal communications noted the risk; a BP engineer also noted the risk internally. The decision was made within BP's operational authority. |
| Source | National Commission Report, Chapter 3; internal BP communications cited in the report |
| First Appearance | ~April 15–16, 2010 (Decision Phase) |
| Visibility Level | Visible within BP operations — the decision and its rationale are documented in communications |
| Decision Relevance | HIGH — directly increased cement channeling risk |

---

**S-006 — Decision not to run Cement Bond Log (CBL) — Decision Phase**

| Field | Value |
|-------|-------|
| Signal ID | S-006 |
| Description | A Schlumberger CBL crew was aboard the Deepwater Horizon to perform a Cement Bond Log — a test that would verify the quality of the cement bond by acoustic measurement. BP decided not to run the CBL, and the Schlumberger crew was transported off the rig before the test was performed. The CBL would have been the primary direct verification of the cement job's quality; its elimination meant that the cement job's integrity would be assumed based on design calculations rather than confirmed by measurement. |
| Source | National Commission Report, Chapter 3; National Commission Chief Counsel's Report |
| First Appearance | ~April 18–19, 2010 (Decision Phase) |
| Visibility Level | VISIBLE to BP and Transocean personnel on the rig; the Schlumberger crew departure was known |
| Decision Relevance | HIGH — eliminated the verification mechanism that would have detected the cement failure before the negative pressure test |
| Notes | The National Commission documents that a CBL was included in the well design as a verification step; its elimination was a cost and schedule decision. The CBL was the organizational mechanism that would have required the cement quality signal to cross from the Halliburton technical domain into the go/no-go decision process. |

---

**S-007 — Negative pressure test anomalous drill pipe reading (~1,400 psi) — Decision Phase**

| Field | Value |
|-------|-------|
| Signal ID | S-007 |
| Description | During the negative pressure test conducted on April 20, the drill pipe pressure gauge showed approximately 1,400 psi when it should have shown 0 psi if the well was properly sealed. A sealed wellbore with the valve closed should produce no pressure reading on the drill pipe. The anomalous reading indicated that pressure was communicating from below — consistent with formation pressure entering the wellbore through a compromised cement seal. |
| Source | National Commission Report, Chapter 4; Joint Investigation Team Report |
| First Appearance | April 20, 2010 (Decision Phase) |
| Visibility Level | VISIBLE to BP company man and Transocean tool pusher/driller present at the test |
| Decision Relevance | DIRECT — this is the primary pre-blowout signal that the well was not sealed |
| Notes | S-007 is the most critical single Decision Phase signal. It was present, was visible to the relevant decision-makers, and was misinterpreted. This is the central CR event in the reconstruction. |

---

**S-008 — Kill line vs. drill pipe pressure discrepancy — Decision Phase**

| Field | Value |
|-------|-------|
| Signal ID | S-008 |
| Description | During the negative pressure test, the kill line showed 0 psi while the drill pipe simultaneously showed ~1,400 psi. In a hydraulically connected system (which the well should be if properly configured for the test), both lines should equalize to the same pressure. The discrepancy between the two readings was an additional internal signal of abnormal conditions. The National Commission found that the two lines should have equalized if they were both connected to the same fluid column; their failure to equalize was itself a signal that something was wrong with the test configuration or the well. |
| Source | National Commission Report, Chapter 4 |
| First Appearance | April 20, 2010 (Decision Phase) |
| Visibility Level | VISIBLE to the personnel conducting the test |
| Decision Relevance | HIGH — the internal inconsistency between two simultaneous measurements should have been a signal that the test result was not valid |
| Notes | The "bladder effect" explanation was offered to explain the discrepancy — the claim being that the annular BOP was trapping pressure on the drill pipe side, preventing equalization. The National Commission found this explanation physically impossible for the well configuration. |

---

**S-009 — "Bladder effect" explanation and test declared passed — Decision Phase**

| Field | Value |
|-------|-------|
| Signal ID | S-009 |
| Description | BP and Transocean well site leaders accepted the explanation that the anomalous drill pipe pressure (S-007) and the kill-line/drill-pipe discrepancy (S-008) were caused by the "bladder effect" — a phenomenon purportedly caused by the annular BOP trapping riser pressure. The kill line reading of 0 psi was taken as the valid measurement. The negative pressure test was declared passed. Displacement was authorized to proceed. The National Commission found that the "bladder effect" as described cannot exist in the well configuration used; the lines should hydraulically equalize when the relevant valves are open. |
| Source | National Commission Report, Chapter 4 |
| First Appearance | April 20, 2010 (Decision Phase) |
| Visibility Level | VISIBLE to those present on the rig |
| Decision Relevance | DIRECT — this is the operative contradiction resolution event |
| Notes | S-009 is the CR-resolution event: the anomalous signal (S-007, S-008) contradicted the expected test result; S-009 is the resolution of that contradiction by accepting an alternative explanation and declaring the test passed. |

---

**S-010 — Late kick detection indicators — Decision Phase**

| Field | Value |
|-------|-------|
| Signal ID | S-010 |
| Description | After displacement commenced, multiple indicators of formation fluid influx became observable at the surface: pit volume gains, increased flow from the well, and other surface indicators that formation fluids were entering the wellbore. These signals were either not recognized or were initially attributed to displacement operations. The kick was recognized late, reducing the time available for well control response. |
| Source | National Commission Report, Chapter 4; Joint Investigation Team Report |
| First Appearance | April 20, 2010, approximately 20:00–21:30 CDT (Decision Phase) |
| Visibility Level | VISIBLE to Transocean rig crew monitoring the pit volume and flow indicators |
| Decision Relevance | HIGH — late recognition reduced the window for effective well control response |

---

## Section B5 — AP Signal Coding

### WSP — Weak Signal Preservation

**Assessment: PRESENT — HIGH CONFIDENCE**

**Evidence:**

The Macondo well's drilling history from October 2009 through April 14, 2010 (S-001) produced a series of well control events — kicks and pressure anomalies — each individually managed and classified as resolved through standard well control procedures. No single kick event exceeded the threshold for a formal program-level safety review or for a change in the well design approach (drilling deeper, using heavier mud weights as a primary response rather than circulating out the kick and continuing, or redesigning the casing program).

The pattern across the Pre-Decision Phase is the structural WSP signature: multiple individually acceptable signals whose aggregate pattern, if assessed, would indicate a well with an unusually challenging pressure environment requiring elevated attention to the final cement job integrity. The aggregate was not formally assessed.

Within the Decision Phase, the Halliburton centralizer recommendation (S-004) was a formal technical signal that the cement job had elevated channeling risk. This signal was visible to BP operations but was resolved by using 6 centralizers rather than triggering a comprehensive cement risk reassessment.

**WSP sub-criteria:**

WSP-1 (signal present in evidence environment): Present — S-001 documents the Pre-Decision Phase well control event history; S-002 documents the cement stability test results; S-004 documents the centralizer recommendation.

WSP-2 (signal individually below threshold): Present — each kick was individually managed and closed out; S-002 did not produce a formal hold on the cement job execution; S-004 produced a cost/schedule override rather than a comprehensive safety review.

WSP-3 (no aggregation mechanism): Present — no cross-party, cross-domain mechanism existed to aggregate (a) the well's kick history, (b) Halliburton's cement instability test results, and (c) the centralizer recommendation into a combined well integrity risk assessment before the cement job was executed.

**WSP coding: PRESENT**

---

### CDA — Cross-Domain Admission

**Assessment: PRESENT — HIGH CONFIDENCE**

**Evidence:**

T1-005 contains the most complex CDA structure in the Batch 2 reconstruction, arising from the three-party organizational architecture.

**CDA Channel 1 — Halliburton technical domain → BP decision-making domain (S-002):**

Halliburton's February/March 2010 cement stability test results (S-002) originated in Halliburton's cementing technical domain. For these results to constitute an actionable signal in BP's decision-making domain, they would need to cross the Halliburton-BP organizational boundary with enough technical specificity to require BP to modify the cement design, conduct additional testing, or halt the cement job. The National Commission Report documents that these results were present within Halliburton's records but did not reach BP in a form that produced a formal response. The Halliburton-BP interface did not include a process requiring Halliburton to certify the cement slurry's stability to BP's engineering standards before job execution.

**CDA-1:** S-002 originated in Halliburton's technical domain; the operative decision-making domain was BP's.  
**CDA-2:** S-002 was not admitted into BP's decision process as a formal concern requiring action before the cement job.  
**CDA-3:** The organizational admissibility architecture at the Halliburton-BP interface did not include a formal technical review process requiring cement stability certification before execution.

**CDA Channel 2 — Pressure monitoring domain → Decision-making domain (S-007, S-008):**

The negative pressure test anomalous readings (S-007, S-008) were generated in Transocean's pressure monitoring operational context. For these signals to be admitted into the BP decision-making domain as a signal requiring halting displacement, they needed to cross from the pressure monitoring context (Transocean driller/tool pusher) to the BP company man who held the authority to halt displacement. The "bladder effect" explanation represented the filtering mechanism: the signal was admitted in a modified form (as an artifact rather than a formation signal) that did not require the decision-making context to respond differently.

**CDA Channel 3 — Well engineering domain → Operational decision domain (S-003 cross-party):**

The Macondo well's pressure characteristics (S-003), which were documentable from the drilling history, needed to cross from the well engineering domain into the Halliburton cementing technical domain to inform the cement slurry design for the specific well conditions. The cross-party information flow required for Halliburton to correctly calibrate its cement design to the specific downhole conditions of the Macondo well represents a third CDA channel.

**CDA coding: PRESENT — three distinct CDA channels identified across the three-party organizational structure**

---

### CR — Contradiction Retention

**Assessment: PRESENT — HIGH CONFIDENCE**

**Evidence:**

T1-005 contains the clearest CR condition in the Batch 2 reconstruction. Two directly contradictory signals were simultaneously present during the negative pressure test:

**Contradiction CR-A (Primary):**

Signal A: The drill pipe pressure reading of approximately 1,400 psi — indicating that pressure is communicating from below, consistent with a compromised cement seal and formation pressure entering the wellbore. If this signal is valid: the well is NOT sealed; displacement should not proceed.

Signal B: The "bladder effect" explanation — the hypothesis that the annular BOP is trapping riser pressure on the drill pipe side, creating an apparent pressure reading that does not reflect well integrity. If this interpretation is accepted: the kill line reading of 0 psi is valid; the well IS sealed; displacement can proceed.

These two signals are in direct contradiction on the same physical parameter: the integrity of the Macondo well's cement seal. Both signals were simultaneously present in the Decision Phase evidence environment. The contradiction was resolved by accepting Signal B (the "bladder effect" explanation) and dismissing Signal A (the anomalous pressure reading as an artifact).

**CR sub-criteria:**

CR-1 (two signals in direct contradiction on the same parameter): Present — S-007/S-008 (anomalous readings indicating unsealed well) vs. S-009 ("bladder effect" explanation indicating sealed well with artifact pressure).

CR-2 (both signals present in evidence environment): Present — both the anomalous readings and the "bladder effect" explanation were present in the decision-making environment at the same time and location (the rig).

CR-3 (contradiction resolved by discarding one signal): Present — S-009 documents the acceptance of the "bladder effect" explanation and the test being declared passed; the anomalous reading was discarded as an artifact.

**Contradiction CR-B (Secondary):**

Signal A: The kill line showing 0 psi and the drill pipe showing ~1,400 psi simultaneously — an internal inconsistency between two measurements that should equalize in a properly configured hydraulic system.

Signal B: The interpretation that the discrepancy is acceptable because the lines are not fully equalized due to the "bladder effect."

This second contradiction was simultaneously resolved with CR-A. Both are present in the evidence record.

**CR coding: PRESENT — two explicit contradictions (CR-A and CR-B) documented; both resolved by accepting the nominal ("bladder effect") interpretation**

**Evidence quality:** HIGH. The National Commission Report explicitly documents the anomalous readings, the "bladder effect" explanation, and the declaration that the test passed. This is the most comprehensively documented CR event in the Track A program to date — it is specifically named, the two signals are identified, and the resolution is recorded.

---

## Section B6 — EE Structural Coding

### Fragility Accumulation (FA)

**Assessment: PRESENT — HIGH CONFIDENCE**

**Evidence:**

At minimum four independently managed system margins were simultaneously below their nominal levels at the time of the Macondo blowout:

**FA element 1 — Cement integrity margin:**

The nitrogen foam cement job was executed with multiple degraded integrity controls: (a) the cement slurry was unstable per Halliburton's own pre-job tests (S-002); (b) only 6 centralizers were used vs. 21 recommended, increasing channeling risk (S-004, S-005); (c) no CBL was run to verify the cement bond (S-006). Three independently managed quality assurance elements were each below nominal for the cement job. The cement integrity margin was degraded in multiple independent dimensions, each managed by a distinct organizational function.

**FA element 2 — Negative pressure test reliability margin:**

The negative pressure test was the primary verification mechanism before displacement. The test produced anomalous readings that were misinterpreted. The test's ability to function as a reliable verification mechanism was compromised by the "bladder effect" misinterpretation. Additionally, the well configuration for the test (specific valve positions) may have affected test reliability.

**FA element 3 — Well control history margin:**

S-001 documents the Macondo well's kick history. Each individually resolved kick event potentially calibrated operations personnel toward a lower effective concern threshold. The aggregate of individually-accepted abnormal events represents a degraded organizational safety margin for recognizing and responding to the April 20 kick.

**FA element 4 — Cross-party verification margin:**

The three-party structure (BP, Transocean, Halliburton) created a cross-party verification architecture in which each party assumed another was managing key safety functions. No party held responsibility for integrating the technical risk assessments from all three domains into a unified well integrity picture before the cement job and displacement. This organizational verification margin was below the nominal level required for a complex multi-party well operation.

**FA sub-criteria:**

FA-1 (at least three independently managed margins simultaneously degraded below nominal): Present — four elements identified, each managed by a distinct organizational function (Halliburton cementing quality, BP operational decisions, well history management, cross-party integration).

**FA coding: PRESENT — four independently managed margins simultaneously below nominal; strongly supported by National Commission Report's organizational analysis**

---

### Load Displacement (LD)

**Assessment: PRESENT — HIGH CONFIDENCE**

**Evidence:**

**LD-1 — Risk transferred without information:**

The cement job quality risk was displaced from Halliburton's technical domain (where the instability was documented in February tests) to BP's operational decision-making domain, but without the information required for BP to evaluate the risk independently. The Halliburton-BP interface transferred the completed cement job as a technical deliverable, but the cement instability test results (S-002) were not transferred with the deliverable in a form that required BP's independent technical assessment before proceeding.

The CBL elimination (S-006) is the most direct LD mechanism: the CBL was the organizational instrument through which the cement quality risk would have been verified in BP's decision context. Its elimination transferred the entire cement integrity risk to the negative pressure test as the sole verification mechanism — without the independent technical assessment the CBL would have provided.

**LD-2 — Source appears stable:**

Halliburton's delivery of the cement job appeared complete and technically competent — a cement job was designed, executed, and reported. Within Halliburton's domain, the technical work was completed as contracted. The source appeared to have fulfilled its function. No anomaly was visible at the Halliburton-BP boundary from within either party's operational context.

**LD-3 — Destination holds risk without assessment:**

BP's decision-making context held the cement integrity risk without the full technical information required to assess it. The available assessment tool (the negative pressure test) was then misinterpreted (S-009), eliminating even the indirect verification that was available.

**LD coding: PRESENT — all three sub-criteria satisfied; the CBL elimination is the most direct LD mechanism; the three-party structure amplifies LD by creating multiple displacement pathways**

---

### Threshold Instability (TI)

**Assessment: PRESENT — HIGH CONFIDENCE**

**Evidence:**

The wellbore pressure vs. formation pressure balance is the critical threshold for the Macondo well. The Macondo well's formation is a high-pressure reservoir; the wellbore must maintain sufficient pressure to prevent formation fluid influx.

**TI-1 (critical parameter operating within measurement uncertainty of design limit):**

During the displacement operation (removing heavy mud and replacing with seawater), the wellbore pressure was progressively reduced. As the heavy mud was replaced by lighter seawater, the hydrostatic pressure fell progressively toward and below the formation pore pressure. The system was operating at or near the threshold at which formation pressure would overcome wellbore pressure and produce an influx.

The negative pressure test was specifically designed to measure whether the wellbore was at or beyond this threshold — a passed test would indicate the cement was providing a positive barrier. The misinterpretation of the test result (S-009) meant that displacement was authorized when the well was actually already at or beyond the critical threshold.

**TI coding: PRESENT — the wellbore pressure/formation pressure threshold was the operative design limit; the well was operating at or beyond this threshold during displacement; the negative pressure test was the threshold measurement instrument and its misinterpretation prevented recognition of the threshold condition**

---

### Cascade Precondition (CP)

**Assessment: PRESENT — HIGH CONFIDENCE**

**Evidence:**

Three distinct cascade couplings are present:

**CP coupling 1 — Cement integrity failure × Displacement decision:**

The compromised cement job (degraded by the unstable slurry, inadequate centralizers, and no CBL verification) failed to seal the wellbore. The decision to proceed with displacement (removing the heavy mud) was made on the assumption that the cement provided a positive barrier. These two failure modes are coupled: the cement failure eliminated the barrier that the displacement decision assumed was in place. The negative pressure test was the mechanism that should have detected the coupling — its misinterpretation prevented the coupling from being recognized.

**CP coupling 2 — Negative pressure test misinterpretation × Displacement authorization:**

The misinterpretation of the negative pressure test result (S-009) was coupled to the authorization to displace. If the test had been correctly interpreted, displacement would not have been authorized. The decision to accept the "bladder effect" explanation was coupled to the displacement commencement in a direct causal chain: misinterpretation → authorization → removal of pressure control → blowout.

**CP coupling 3 — BOP failure × Well control response:**

When the blowout began, the BOP — the last line of defense — was activated but failed to seal the well. The coupling: the blowout control relied on the BOP functioning as designed; the BOP's failure to seal amplified the blowout from a potentially controllable event into the loss of the rig and the prolonged uncontrolled blowout.

**CP sub-criteria:**

CP-1 (at least two coupled failure modes): Present — three couplings identified.

CP-2 (coupling not reflected in the decision-phase risk model): Present — the National Commission documents that the risk model used by BP and Transocean on April 20 did not account for the cement failure; the coupling between cement failure and the displacement's reliance on cement integrity was not in the operational risk assessment.

**CP coding: PRESENT — three cascade couplings identified; two are pre-BOP (cement-displacement and test-misinterpretation-displacement); one is during the blowout response (BOP failure)**

**Note:** A-20 (Clarification Addendum v2) governs CP coding in reconstruction.

---

### Hidden Common Link (HCL)

**Assessment: PRESENT — HIGH CONFIDENCE**

**Evidence:**

**HCL-1 (signals from structurally independent sources):**

Multiple signals originating in three structurally independent organizational domains:
- Halliburton's cement technical domain: S-002 (cement instability tests)
- Transocean's rig operational domain: S-007, S-008 (negative pressure test pressure readings)
- BP's well engineering domain: S-001 (well kick history), S-003 (formation pressure environment)

These domains are organizationally, contractually, and operationally independent.

**HCL-2 (non-connection documented during decision phase):**

The connection between these signals — that S-002 (unstable cement) + S-001/S-003 (well pressure environment) + S-007/S-008 (test anomaly) all shared the common structural cause of a compromised well bore integrity — was not established during the Decision Phase. The National Commission specifically documents that no party on April 20 was integrating all available signals into a unified well integrity assessment.

**HCL-3 (investigation confirmed shared structural cause):**

The National Commission Report confirmed that the shared structural cause connecting all signals was the Macondo well bore's compromised integrity — the cement had not sealed the well, formation fluids were in the wellbore, and the negative pressure test readings were a direct consequence of this condition.

**HCL-4 (connection non-obvious from within any single domain):**

From within Halliburton's cementing domain: the cement instability tests were a technical quality concern; the connection to the negative pressure test anomaly was not visible from within Halliburton's scope. From within Transocean's monitoring domain: the pressure anomaly was a measurement to be interpreted; the connection to the cement stability test results was not available to the rig-based personnel. From within BP's decision domain: the available signals were the test results presented by the personnel on scene; the full technical picture connecting all three parties' domains was not assembled in any organizational context.

**HCL coding: PRESENT — all four sub-criteria satisfied; the three-party organizational structure creates the conditions for HCL at a higher complexity level than any Batch 1 case**

---

### Structural Incongruence (SI)

**Assessment: PRESENT — HIGH CONFIDENCE**

**Evidence:**

**Operational assumption (decision domain):** The negative pressure test has passed and the Macondo well bore is properly sealed by the cement. The well is in a condition that allows safe displacement of the heavy drilling mud.

**Operational reality (physical domain):** The cement has failed to seal the well. Formation pressure is communicating through the wellbore. The anomalous drill pipe pressure reading (S-007) was a direct physical indicator of this reality. The "bladder effect" explanation (S-009) was physically impossible in the well configuration; the assumption embedded in accepting that explanation was structurally incongruent with the physical state of the well.

The incongruence was not visible during the Decision Phase because the interpretation framework (the "bladder effect" explanation) provided an internally coherent account of the anomalous readings that did not require acknowledging the physical reality. The filtering mechanism — the misinterpretation — was what allowed the structural incongruence to persist through the displacement decision.

**SI coding: PRESENT — the decision framework's assumption (well is sealed) was structurally incongruent with the physical reality (well is not sealed); the "bladder effect" explanation was the mechanism that prevented the incongruence from being recognized**

---

## Section B7 — Visibility Analysis

### Which Signals Were Visible

**S-001 (kick history):** VISIBLE to operational teams and BP operations management. Well logs and well reports were produced and accessible.

**S-002 (Halliburton cement instability tests):** VISIBLE within Halliburton's cementing technical domain. Visibility across the Halliburton-BP boundary — UNCERTAIN/PARTIAL. The National Commission documents the test results existed; whether they were formally communicated to BP in a form requiring action is the key CDA question.

**S-004 (centralizer recommendation):** VISIBLE to BP operations personnel — the recommendation was formally communicated in writing.

**S-006 (CBL elimination):** VISIBLE to all parties on the rig — the Schlumberger crew's departure was a physical event.

**S-007/S-008 (negative pressure test anomalous readings):** VISIBLE to the BP company man and Transocean tool pusher and driller present at the test. Documented in rig records.

**S-009 ("bladder effect" acceptance):** VISIBLE to those present — the test was declared passed.

### Which Signals Were Filtered

**S-002 (Halliburton cement instability results — Halliburton-to-BP filtering):** The cement instability signal was filtered at the Halliburton-BP organizational boundary. It was visible within Halliburton's domain but did not reach BP's decision context in a form requiring formal response. The filtering mechanism: the Halliburton-BP interface required Halliburton to deliver a cement job, not to certify the slurry's stability to BP's engineering standards.

**S-007/S-008 (negative pressure test anomaly — decision filtering):** The anomalous readings were not filtered at the visibility level — they were seen by the decision-makers. They were filtered at the interpretation level: the "bladder effect" explanation converted the anomalous signal from an indication of well failure into an artifact. This is interpretation-level filtering rather than organizational-boundary filtering.

**S-001 aggregate pattern (cumulative kick history — aggregation filtering):** Individual kick signals were visible; the cumulative pattern suggesting an unusually challenging pressure environment was not formally produced as an aggregated signal. The filtering mechanism: the absence of a cross-mission kick aggregation review mechanism.

### Filtering Mechanisms

**Primary — Three-party organizational boundary (CDA):** The three independent organizational parties created domain boundaries at which signals did not fully cross. The Halliburton-BP boundary filtered the cement instability signal; the Transocean-BP boundary filtered the full implications of the negative pressure test pressure readings.

**Secondary — Interpretation-level CR filtering:** The "bladder effect" explanation filtered the anomalous pressure signal at the interpretation level rather than the organizational boundary level. This is a CR-resolution filtering mechanism, distinct from the CDA organizational-boundary mechanism.

**Tertiary — Aggregation absence (WSP):** The lack of a cross-party, cross-domain signal aggregation mechanism meant that the individually visible signals from each party's domain were never assembled into a unified well integrity picture.

### Organizational Location of Filtering

The primary filtering occurred at the Halliburton-BP interface (S-002 filtering) and in the BP-Transocean joint operational context on April 20 (S-007/S-008 interpretation filtering). No single organizational actor made a decision to suppress signals; the filtering was embedded in the organizational interfaces between parties and in the interpretation framework that was applied to the test results.

---

## Section B8 — Alternative Explanation Inventory

*No comparison to predictions. Inventory only.*

**AE-001 — Cost and schedule prioritization account:** BP made specific decisions (6 centralizers vs. 21; no CBL; proceeding with displacement after anomalous test) that prioritized cost and schedule over safety. Root cause: corporate cost/schedule pressure overriding safety management.

**AE-002 — Technical misinterpretation account:** The "bladder effect" explanation was a good-faith but incorrect technical interpretation of ambiguous data by personnel who genuinely believed they had a valid explanation. Root cause: technical misunderstanding under operational pressure.

**AE-003 — Regulatory failure account:** The MMS did not provide adequate independent oversight and did not have the technical capacity to detect or prevent the unsafe practices that preceded the blowout. Root cause: regulatory capture and inadequate regulatory standards.

**AE-004 — Multi-party diffused responsibility account:** When three independent organizations share responsibility for a complex operation, each assumes another is managing critical safety functions. No party had full situational awareness; no party felt responsibility for the complete risk picture. Root cause: organizational structure without clear safety integration responsibility.

**AE-005 — Industry-wide normalization account:** Offshore drilling industry practices had normalized certain risk-taking behaviors (minimal verification steps, cost/schedule trade-offs with safety) over many years without a catastrophic event; the Deepwater Horizon was not operating outside industry norms. Root cause: industry-wide safety culture degradation.

**AE-006 — BOP failure account:** The blowout preventer failed to seal the well; a functioning BOP would have prevented the loss of the rig and the prolonged spill. Root cause: equipment failure, maintenance deficiency.

**AE-007 — Complex systems / normal accident account:** The Deepwater Horizon disaster was a normal accident in a tightly coupled, complex system; multiple independent failures combined in ways that no individual could have predicted or prevented. Root cause: system complexity rather than individual failures.

---

## Section B9 — Reconstruction Findings

### Signal Environment

The Deepwater Horizon Pre-Decision Phase evidence environment contained a six-month well control history (S-001) producing individually managed and accepted kick events, a formal technical signal from Halliburton's cementing domain about cement slurry instability (S-002), and the Macondo well's challenging formation pressure environment (S-003). The Decision Phase produced the most comprehensively documented signal environment in the Track A program: explicit contradiction between the negative pressure test anomalous readings and the "bladder effect" explanation, with both signals present, both visible, and the resolution documented in real-time communications and rig records.

T1-005 is the richest CR case in the batch: the contradiction is explicitly documented, the two signals are named, the resolution mechanism is identified, and the resolution's physical impossibility is established by the National Commission.

### Structural Environment

All six EE structures are coded Present: FA (four elements, HIGH confidence — strongest FA finding in Batch 2), LD (HIGH confidence — three-party displacement with CBL elimination as the primary LD mechanism), TI (HIGH confidence — wellbore threshold crossed during displacement), CP (HIGH confidence — three couplings), HCL (HIGH confidence — all four sub-criteria), SI (HIGH confidence — "bladder effect" framework incongruent with physical reality).

The most distinctive structural finding in T1-005 is the three-party HCL: the three independent organizational domains (Halliburton, Transocean, BP) each generated signals whose connection was architecturally invisible from within any single party's operational context. This is the highest structural complexity of any HCL finding in the program to date.

The LD finding has a distinctive mechanism not seen in Batch 1: the CBL elimination is a specific, documentable act that removed the verification mechanism that would have required the cement quality signal to cross from Halliburton's technical domain to BP's decision context. This is LD-by-verification-elimination — a structurally specific LD variant.

### Visibility Environment

Three distinct filtering mechanisms are present: organizational boundary filtering (CDA — Halliburton-BP interface), interpretation-level filtering (CR — "bladder effect" explanation), and aggregation absence (WSP — no cross-party signal aggregation). The co-presence of all three mechanisms simultaneously is unique in the batch.

### AP Environment

WSP, CDA, and CR are all coded Present at HIGH confidence. This is the strongest AP finding in the program to date — all three AP dimensions confirmed at HIGH confidence simultaneously, with each independently supported by primary source evidence from the National Commission Report.

The CR finding (two explicit documented contradictions during the negative pressure test) is the highest-quality CR coding in the program: unlike T1-004 (Columbia), where CR was well-documented but required some inference about the imaging request denial process, the T1-005 CR is recorded in contemporaneous communications and rig records cited directly in the National Commission Report.

---

## Section B10 — Reconstruction Freeze

### Session Boundary Confirmation

This reconstruction was conducted without access to Artifact A Batch 2 predictions for T1-005 or for any other case. No prediction document, prediction summary, comparison document, or Artifact C material was accessed during this session.

### Reconstruction Completion Record

| Field | Value |
|-------|-------|
| Reconstruction completion date | 2026-05-31 |
| Analyst identity | EE/CIS Research Governance Team — AI-assisted |
| Artifact A Batch 2 access during session | NONE — session boundary maintained |
| Primary sources accessed | National Commission Report; JIT Report; Chief Counsel's Report (as mediated through AI training data) |
| Session boundary compliance | CONFIRMED |

**AP coding status at freeze:**
- WSP: PRESENT (HIGH CONFIDENCE)
- CDA: PRESENT (HIGH CONFIDENCE — three distinct CDA channels)
- CR: PRESENT (HIGH CONFIDENCE — two explicit documented contradictions)

**EE coding status at freeze:**
- Load Displacement: PRESENT (HIGH CONFIDENCE)
- Fragility Accumulation: PRESENT (HIGH CONFIDENCE — four elements)
- Threshold Instability: PRESENT (HIGH CONFIDENCE)
- Cascade Precondition: PRESENT (HIGH CONFIDENCE — three couplings)
- Hidden Common Link: PRESENT (HIGH CONFIDENCE — all four sub-criteria)
- Structural Incongruence: PRESENT (HIGH CONFIDENCE)

**FROZEN — 2026-05-31**

---

*Track A — Artifact B — T1-005 Deepwater Horizon Reconstruction | EE/CIS Research Governance Team | 2026-05-31*  
*FROZEN — REC-ART — RECONSTRUCTION ONLY — NO PREDICTION COMPARISON PERMITTED*
