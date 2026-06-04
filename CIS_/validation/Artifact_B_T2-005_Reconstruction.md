# Artifact B — Case Reconstruction: T2-005 NOAA-N Prime

**Artifact type:** Artifact B (Case Reconstruction)  
**Case:** T2-005 — NOAA-N Prime Satellite Manufacturing Incident  
**Tier:** 2 | **AI Prior Exposure:** MEDIUM-LOW  
**Status:** FROZEN  
**Date:** 2026-06-02  
**Sources accessed:** NASA/Lockheed Martin NOAA-N Prime Mishap Investigation Report (October 2003)  
**Artifact A:** SEALED — not accessed during reconstruction  
**Phase Boundaries:** Per M-06 v1.5

---

## Phase Boundary Confirmation

**Pre-Decision Phase start:** Rotation test fixture design specification and bolt retention procedure — manufacturing engineering design phase, prior to satellite delivery to Sunnyvale.

**Pre-Decision Phase end:** Beginning of scheduled rotation operation, September 6, 2003, morning shift, Lockheed Martin Sunnyvale facility.

**Decision Phase:** Technician bolt removal operation on the rotation fixture while the NOAA-N Prime spacecraft was attached.

**Post-Decision Phase end:** Spacecraft drop and structural impact, September 6, 2003.

Boundaries confirmed as consistent with Mishap Investigation Report sequence of events.

---

## Signal Inventory

### Pre-Decision Phase Signals

---

**Signal PRE-001**  
**Description:** Rotation fixture design and bolt retention procedure — the fixture used to hold and rotate the spacecraft during testing used a bolted interface between the spacecraft and the fixture frame, and between the fixture frame and the test stand. The bolt retention procedure for the fixture-to-stand interface was a separate document from the spacecraft-to-fixture interface procedure. Configuration control of which bolts were installed was not embedded in either work order for subsequent operations.  
**Value status:** Within engineering design norms — bolt retention is standard procedure.  
**Construct coding:**
- SI: PRESENT (SI-1) — the work order for the tilting/rotation operation assumed the fixture was in standard secured configuration. The fixture design did not physically enforce or visually indicate the current bolt configuration to the operating team.
- CDA: PRESENT (structural precondition) — the configuration state of the fixture-to-stand interface existed as information in the prior operation's work records but was not embedded in the subsequent operation's work order.

---

**Signal PRE-002**  
**Description:** Prior operation (specific date before September 6, 2003) — a separate work team performed an operation that required removing the 24 bolts securing the rotation fixture to the test stand. This operation was completed. The bolts were not reinstalled. The spacecraft remained attached to the fixture. The next scheduled operation (rotation/tilting) was assigned to a different team.  
**Value status:** Each individual operation within its own scope was performed correctly. The bolt removal was appropriate for the operation being performed. The failure to reinstall was not flagged as an anomaly in the prior team's records.  
**Construct coding:**
- CDA: PRESENT — critical configuration information (24 bolts removed, fixture unsecured to stand) was generated in Domain A (prior operations team) and not admitted to Domain B (rotation operations team) through any formal channel.
- LD: PRESENT — the responsibility for ensuring the fixture was in standard secured configuration before the next operation was implicitly held by the rotation operations team, which had no access to the prior team's configuration records.
- HCL: PRESENT — Domain A (prior operations team) held a signal: "we removed the 24 bolts." Domain B (rotation operations team) held a signal: "we are about to perform a rotation operation on this fixture." Both signals related to the same structural condition (unsecured fixture with spacecraft attached) through a shared structural source: the undocumented configuration state change.

---

**Signal PRE-003**  
**Description:** Spacecraft configuration prior to September 6 — the NOAA-N Prime satellite had been recently transferred to the rotation fixture as part of normal manufacturing flow. This transfer was an event in the spacecraft integration records. The fixture operations team's work order did not reflect this recent transfer or the current configuration state.  
**Value status:** Within manufacturing flow norms — configuration transfers are routine.  
**Construct coding:**
- SI: PRESENT (SI-1) — the rotation operation work order assumed the fixture's structural state (standard configuration). The actual structural state (spacecraft recently transferred to fixture, 24 interface bolts removed) was different. The work order's assumption about fixture configuration was structurally incongruent with the fixture's actual state.
- CDA: PRESENT — the spacecraft transfer event existed in spacecraft integration records but was not admitted into the rotation operations work order context.

---

### Decision Phase Signals

---

**Signal DEC-001**  
**Description:** September 6, 2003, morning shift — rotation operations team arrives at the fixture. The team's work order specifies a tilting/rotation operation. Standard pre-operation checks are conducted. The fixture appears ready for the operation.  
**Value status:** Nominally within acceptable parameters from the operations team's perspective — no threshold crossed.  
**Construct coding:**
- CDA: PRESENT — the 24-bolt absence (critical configuration information) is not visible from the work order or from visual inspection if the bolt pattern is not standard-checked.
- LD: PRESENT — the team proceeds with the operation using only the information available in their work order context, which does not include the prior operation's configuration change.

---

**Signal DEC-002**  
**Description:** September 6, 2003 — technicians begin the rotation/tilting operation. As the fixture is moved, the spacecraft's weight exceeds the retention capacity of the remaining fixture-to-stand connection. The fixture tips. The 1,550-pound NOAA-N Prime satellite falls and impacts the floor.  
**Value status:** ANOMALOUS — catastrophic outcome.  
**Construct coding:**
- Outcome event.

---

## Construct Determinations

### CDA — Cross-Domain Admission: PRESENT | HIGH

**Evidence:** Two CDA conditions documented:

1. **PRE-002 / DEC-001:** The critical configuration information — "24 bolts removed from fixture-to-stand interface" — was generated by the prior operations team (Domain A) and not formally transmitted to the rotation operations team (Domain B). The information existed in the prior team's work records. It was not embedded in a handoff protocol, not reflected in the rotation team's work order, and not visually obvious at the fixture. The absence of this information from the rotation team's decision context is the primary CDA failure.

2. **PRE-003 / DEC-001:** The spacecraft transfer event (NOAA-N Prime recently placed on this fixture) was in the spacecraft integration records but not in the rotation operations work order. The rotation team did not know — and had no mechanism to know — the current spacecraft attachment status.

Both CDA conditions share the same structural root: no formal cross-domain admission mechanism existed to transmit configuration state information from one operations team to the next.

---

### LD — Load Displacement: PRESENT | HIGH

**Evidence:** The rotation operations team's work order assigned them an operation (rotate/tilt the fixture) without providing the configuration information necessary to safely perform it. The implicit responsibility for verifying fixture configuration was transferred to the rotation team, which lacked the capacity to independently verify:

1. Whether the fixture-to-stand interface was properly secured (required access to prior team's records)
2. Whether the spacecraft was attached to the fixture (required access to spacecraft integration records)

The load (verify configuration before operating) was displaced to a receiving context that did not have evaluation capacity. This is an LD condition: risk transferred to a team that cannot independently assess it.

---

### HCL — Hidden Common Link: PRESENT | MODERATE

**Evidence:** Two structurally independent domains held simultaneous signals about an unusual configuration:

- **Domain A (prior operations team):** Held signal "we removed 24 fixture-to-stand bolts; fixture is in non-standard configuration."
- **Domain B (rotation operations team):** Proceeding with standard rotation operation under assumption of standard configuration; about to encounter structural resistance or failure.

The shared structural source: the undocumented configuration state of the fixture (bolts removed, spacecraft attached) simultaneously created:
- A documentation gap in Domain A's records (the non-standard state was not formally flagged for the next operation)
- An operational assumption failure in Domain B (the work order assumed standard state)

Neither domain alone possessed the observation that the next rotation operation would encounter an unsecured fixture holding a 1,550-pound spacecraft. The HCL condition — the hidden common structural source creating parallel incongruence across independent domains — is the undocumented configuration state change.

The correspondence between domains:
- Same mismatch type: both domains have a gap between assumed configuration and actual configuration
- Same temporal pattern: simultaneous (Domain A's gap and Domain B's assumption failure co-exist at the moment of operation)
- Same direction: both pointing toward the undocumented non-standard state

---

### SI — Structural Incongruence: PRESENT | MODERATE | SI-1

**Evidence:** The rotation operation work order assumed the fixture was in its standard operating configuration — properly secured to the test stand with 24 bolts, available for standard rotation operations. The fixture's actual structural state was non-standard: 24 securing bolts absent, fixture connected to the test stand with insufficient retention for the weight of the attached spacecraft. The work order's structural assumption was incongruent with the fixture's actual structural state. This is an SI-1 condition: the operational specification (work order) embedded an assumption about adjacent system state (fixture configuration) that was not verified and was incorrect.

---

### CR — Contradiction Resolution: ABSENT | MODERATE CONFIDENCE

**Evidence:** No documented instance of a concern being raised about the fixture configuration before the incident. The Mishap Investigation Report does not describe a contradicting signal that was raised and closed. The failure is an admission failure (CDA) rather than a closure failure (CR). No one in the rotation operations team appears to have noticed or raised a concern that was then suppressed. The information simply was not present in their context.

---

### WSP — Weak Signal Preservation: ABSENT | HIGH CONFIDENCE

**Evidence:** This is a configuration state failure at a single moment, not a pattern accumulation failure. The investigation record does not document a prior pattern of configuration control anomalies at this facility that were individually managed without aggregation. WSP requires a series of individually sub-threshold signals; the NOAA-N Prime incident is a single configuration state mismatch.

---

### FA — Fragility Accumulation: PRESENT | LOW-MODERATE

**Evidence:** Multiple conditions were simultaneously non-standard at the time of the operation: (1) fixture-to-stand interface missing 24 bolts; (2) spacecraft recently transferred to this fixture (non-standard configuration for rotation operations); (3) work order not updated for current configuration; (4) no pre-operation configuration verification step in the work order; (5) no cross-team notification protocol. Each condition individually might be managed. The simultaneous co-occurrence of all five created an aggregate vulnerability that no single condition's assessment revealed.

FA is coded PRESENT at LOW-MODERATE — the co-occurring conditions constitute a weak FA signal. The primary failure mode is CDA/LD rather than multi-margin fragility accumulation.

---

## Construct Summary

| Construct | Determination | Confidence | Primary evidence |
|-----------|--------------|------------|-----------------|
| CDA | PRESENT | HIGH | Bolt removal information not admitted to rotation team; spacecraft attachment state not in work order |
| LD | PRESENT | HIGH | Verification responsibility displaced to team without evaluation capacity |
| HCL | PRESENT | MODERATE | Undocumented configuration state shared structural source across two independent operational domains |
| SI | PRESENT | MODERATE | Work order assumed standard fixture configuration; actual configuration non-standard (SI-1) |
| CR | ABSENT | MODERATE | No contradicting signal raised and closed; failure is admission, not closure |
| WSP | ABSENT | HIGH | Single configuration state failure; no prior pattern |
| FA | PRESENT | LOW-MODERATE | Multiple simultaneously non-standard conditions |

**Primary constructs:** CDA, LD  
**Secondary constructs:** HCL, SI  
**Present but weak:** FA  
**Absent:** CR, WSP

---

*Artifact B — T2-005 NOAA-N Prime Reconstruction | FROZEN | 2026-06-02*
