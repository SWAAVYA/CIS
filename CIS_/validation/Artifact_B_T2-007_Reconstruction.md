# Artifact B — Case Reconstruction: T2-007 Air France Flight 447

**Artifact type:** Artifact B  
**Case:** T2-007 — Air France Flight 447  
**Tier:** 2 | **AI Prior Exposure:** MEDIUM  
**Status:** FROZEN  
**Date:** 2026-06-02  
**Sources:** Bureau d'Enquêtes et d'Analyses (BEA) Final Report on Accident to Airbus A330-203 registered F-GZCP operated by Air France, Flight AF 447, June 1, 2009 (2012)  
**Artifact A:** SEALED

---

## Phase Boundary Confirmation

**Pre-Decision Phase start:** First documented pitot tube icing event causing temporary loss of airspeed indication on an A330/A340 aircraft — approximately 2003.

**Pre-Decision Phase end:** AF447 departure from Rio de Janeiro Galeão Airport, June 1, 2009, 19:29 UTC.

**Decision Phase:** Loss of reliable airspeed indication through crew response, approximately 02:10:05 UTC (autopilot disconnect) through 02:14:28 UTC (ocean impact).

**Post-Decision Phase end:** Impact with Atlantic Ocean, June 2, 2009, approximately 02:14:28 UTC.

---

## Signal Inventory

### Pre-Decision Phase Signals

**Signal PRE-001**  
**Description:** 2003–2009 — Multiple occurrences of temporary airspeed indication unreliability on Airbus A330/A340 aircraft in service, caused by pitot tube icing in high-altitude convective weather. Events were reported through the safety reporting system and to EASA/Airbus. Approximately a dozen significant events documented. Each event was managed individually: crews followed unreliable airspeed procedures, incidents were investigated, and the pitot probe design was identified as a contributing factor.  
**Construct coding:**
- WSP: PRESENT — individually sub-threshold events accumulating. No single event triggered mandatory fleet-wide action. The aggregate pattern exceeded what any individual event would have warranted.
- SI-3: REQUIRES ASSESSMENT — the pattern was recognized and produced an airworthiness directive. See determination section.

**Signal PRE-002**  
**Description:** February 2009 — EASA Airworthiness Directive 2009-0043 issued, recommending (not mandating) replacement of Thales AA pitot probes with upgraded Goodrich probes on A330/A340 aircraft. The AD was a recommendation based on the accumulated incident history. Air France had not yet replaced the pitot tubes on F-GZCP (the accident aircraft) at the time of the accident.  
**Construct coding:**
- CR: PRESENT — the accumulated pitot icing pattern was formally recognized. The risk assessment concluded: "recommendation for upgrade is adequate response." This is an alternative explanation adoption: "we have identified the problem and issued guidance; the risk is manageable with the recommendation in place." Options Released: mandatory immediate replacement that would have prevented the accident. No direct test was conducted of whether voluntary compliance with a recommendation was adequate given the risk profile.
- WSP: PRESENT (the AD itself confirms the pattern crossed recognition threshold but the individual events were never aggregated into a mandatory action threshold)

---

### Decision Phase Signals

**Signal DEC-001**  
**Description:** June 2, 2009, 02:10:05 UTC — At FL350, in convective weather, the pitot probes on F-GZCP ice over, producing inconsistent airspeed data from the three probes. The autopilot and autothrust systems disconnect automatically due to inconsistent airspeed inputs. The PF (co-pilot Bonin, in the right seat) assumes manual control.  
**Construct coding:**
- This event activates the pre-existing structural tension: individual pitot icing events were individually managed without mandatory fleet correction, and AF447 is now experiencing the event category that was not mandatorily addressed.

**Signal DEC-002**  
**Description:** 02:10:07–02:14:28 UTC — During the 4.5-minute descent:
- PF applies nose-up inputs, causing the aircraft to climb from FL350 to approximately FL380, reducing airspeed below stall speed
- Stall warning activates at 02:10:51 UTC. Continues to activate throughout much of the descent.
- Stall warning deactivates temporarily when airspeed drops below the validity floor (the system interprets speed as too low to be valid and suppresses the warning)
- PF continues nose-up inputs throughout
- Aircraft enters a deep stall with high angle of attack and descends through 38,000 feet
- The crew does not recover  
**Construct coding:**
- CR: PRESENT — stall warning is a direct contradicting signal. It asserts the aircraft is in a stall. PF's inputs and apparent aircraft state model are inconsistent with stall (PF appears to believe the aircraft is in a high-speed or unusual attitude situation). The contradiction is closed by alternative explanation: the stall warning is invalid given the aircraft state as understood by PF. No direct disconfirmation of the stall warning is attempted (stall recovery inputs are not applied). Options Released: stall recovery.
- SI-4: PRESENT — the signal configuration during descent simultaneously includes: unreliable airspeed from multiple probes; stall warning oscillating between active and inactive; high angle of attack; nose-up attitude; TOGA thrust; decreasing airspeed. This configuration is inconsistent with any standard classified flight state. Normal cruise predicts reliable airspeed and inactive stall warning. A stall predicts active stall warning and requires nose-down recovery. A high-speed upset predicts different power and attitude relationships. The simultaneous signal configuration did not match any trained response category — it was structurally incongruent with all classified states. However: this multi-dimensional incongruence was caused by a single initiating event (pitot icing) and its downstream cascades. The question for SI-4 is whether the cascade constitutes genuine multi-dimensional incongruence or a single-cause chain. Determination below.
- FA: PRESENT — multiple simultaneously degraded conditions: night operations, IMC in convective weather, pitot failure, PF with limited A330 command experience, sole experienced captain on rest break, crew not fully in shared situation awareness.

---

## Construct Determinations

### CR — PRESENT | HIGH

Two distinct CR events:

**CR-1 (Pre-Decision Phase):** The accumulated pitot icing event pattern was formally recognized (AD issued) and assessed as manageable with a recommendation. The closure mechanism was "recommendation issued" rather than "mandatory action completed and verified to reduce risk to acceptable level." Options Released: the mandatory upgrade that would have prevented the AF447 pitot failure.

**CR-2 (Decision Phase):** The stall warning is the clearest CR event. A correct contradicting signal (aircraft is stalling) was present throughout the 4.5-minute descent. The crew's maintained nose-up inputs represent closure by alternative explanation (the stall warning is erroneous) without direct disconfirmation. Options Released: stall recovery.

---

### SI-3 — ABSENT

**This is the disconfirmation finding.** The prediction was SI-3 PRESENT HIGH.

The fleet-wide pitot icing pattern was formally recognized and aggregated into an airworthiness directive before AF447. The AD is documented evidence that the pattern was aggregated — it produced a formal regulatory response. The SI-3 condition requires that the pattern was NOT formally aggregated. The AD demonstrates it was.

The failure is not absence of aggregation (which would be SI-3). The failure is inadequate response to the aggregated pattern — a recommendation instead of a mandate. This is a CR failure: the aggregated risk assessment closed with "recommendation is sufficient" rather than "mandatory action is required and verified." SI-3 is absent because the pattern crossed the threshold of formal recognition. The inadequacy is in the response (CR domain), not in the aggregation (SI-3 domain).

**SI-3: ABSENT | HIGH CONFIDENCE**

This disconfirms the prediction of SI-3 PRESENT HIGH. The adversarial design functioned as intended.

---

### SI-4 — PRESENT | MODERATE

The multi-dimensional signal configuration during the AF447 descent is real: unreliable airspeed, oscillating stall warning, high altitude, nose-up attitude, TOGA thrust, decaying airspeed. No standard classified flight state accounts for this simultaneous configuration.

However, the configuration is partially reducible to a single initiating cause (pitot icing → autopilot disconnect → crew response cascade). The question is whether the cascade produces genuine structural incongruence across independent dimensions or a sequential single-cause chain.

Determination: PRESENT at MODERATE. The signal configuration was genuinely multi-dimensional and did not fit any trained flight state — this is the operative structural property. That the cascade began with a single cause does not eliminate the multi-dimensional nature of the resulting signal environment. The crew faced genuinely incompatible signal information from multiple independent instruments simultaneously. SI-4 is present but the single-cause cascade argument justifies MODERATE rather than HIGH.

---

### WSP — PRESENT | MODERATE

The individual pitot icing events across the A330/A340 fleet from 2003–2009 were each managed without triggering mandatory fleet action. This constitutes WSP: individually sub-threshold signals that were not formally aggregated into a mandatory action threshold. The AD (PRE-002) represents partial aggregation but insufficient to produce mandatory action. WSP is present at MODERATE — the aggregation did occur but was inadequate to cross the mandatory-action threshold. This is related to but distinct from SI-3: WSP codes the governance failure (signals not aggregated into sufficient response); SI-3 would have coded the observational failure (pattern not recognized at all). SI-3 is absent; WSP is present.

---

### FA — PRESENT | HIGH

Multiple simultaneously degraded operational conditions at time of the Decision Phase: night IMC in convective weather; pitot tube failure; PF (Bonin) with limited A330 command hours; sole experienced captain (Dubois) on scheduled rest break; crew not sharing consistent situational awareness; stall warning oscillating between active/inactive creating additional interpretive confusion. No single condition causes the accident; the cumulative configuration creates vulnerability that no individual condition assessment reveals.

---

### LD — ABSENT | HIGH

No organizational risk transfer structure. All relevant actors had access to relevant information within their respective domains. The failure is systemic safety response inadequacy (CR at the regulatory level) and in-flight misinterpretation (CR at the crew level), not displacement of evaluation responsibility to a context without evaluation capacity.

---

### HCL — ABSENT | HIGH

Single flight event. No independent domain parallel structure with correlated signals sharing a hidden common source.

---

### CDA — ABSENT | HIGH

All cockpit signals were present and admitted. The failure is interpretation under stress and novel conditions, not failure of information to cross a domain boundary.

---

## Construct Summary

| Construct | Determination | Confidence | Note |
|-----------|--------------|------------|------|
| CR | PRESENT | HIGH | Pre-decision (AD closure) + decision (stall warning) |
| WSP | PRESENT | MODERATE | Fleet events sub-threshold individually; partial aggregation |
| SI-3 | **ABSENT** | **HIGH** | **DISCONFIRMS prediction — pattern was aggregated (AD); failure is response adequacy (CR)** |
| SI-4 | PRESENT | MODERATE | Multi-dimensional; partially reducible to single-cause cascade |
| FA | PRESENT | HIGH | Multiple simultaneously degraded operational conditions |
| LD | ABSENT | HIGH | No organizational risk transfer |
| HCL | ABSENT | HIGH | Single flight; no independent domain structure |
| CDA | ABSENT | HIGH | All signals in cockpit; interpretation failure, not admission failure |

**Primary constructs:** CR (dual event), FA  
**Secondary:** WSP, SI-4  
**Absent:** SI-3 (disconfirmed), LD, HCL, CDA

---

*Artifact B — T2-007 Air France 447 Reconstruction | FROZEN | 2026-06-02*  
*SI-3 prediction DISCONFIRMED. Pattern was formally aggregated; failure is in response adequacy (CR domain).*
