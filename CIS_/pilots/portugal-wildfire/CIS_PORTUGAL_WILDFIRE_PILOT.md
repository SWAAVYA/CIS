# CIS Portugal Wildfire Pilot
# Operational Pilot Definition — Centro Region Early Warning and Fragility Monitoring

**Date:** 2026-05-30
**Version:** 1.0
**Status:** PILOT DEFINITION — Pre-execution

**CIS engine version:** Phase 1 through Phase 2E (feature-complete as of 2026-05-29)
**Engine modification:** None. The CIS engine is used exactly as implemented.
**New diagnostics capabilities:** None. All capabilities used in this pilot are present in the current engine.

---

## Scope Statement

This document defines an operational pilot that applies the existing CIS diagnostics engine to Portugal wildfire early-warning and fragility monitoring in the Centro region. The pilot does not propose changes to the CIS specification, the Extended Epistemology framework, or any diagnostic module. It defines how the existing engine is applied to a specific domain through indicator mapping, observation construction, and analyst workflow.

The CIS engine produces advisory outputs. Nothing in this pilot changes that. Pilot outputs are advisory inputs to human decision-making — they do not trigger automatic alerts, constitute official warnings, or replace operational judgment.

---

## Section 1 — Pilot Objective

### 1.1 Target Users

**Primary:** Operational analysts at ANEPC (Autoridade Nacional de Emergência e Proteção Civil) regional coordination center covering the Centro region. These analysts produce situational assessments that inform pre-positioning decisions, resource allocation, and alert level escalation.

**Secondary:** ICNF (Instituto da Conservação da Natureza e das Florestas) regional planning staff responsible for fuel management planning, prescribed burn scheduling, and forest fire risk assessment.

**Not targeted in this pilot:** Incident commanders managing active fires. CIS is a diagnostic tool for system-level continuity monitoring, not a tactical incident management tool. Incident command operates at timescales and with data requirements that differ from what the CIS diagnostic pipeline addresses.

### 1.2 Target Decisions

CIS pilot outputs are intended to inform three categories of decision, each at a different timescale:

| Decision Type | Timescale | CIS Output Used | Decision Remains With |
|--------------|-----------|----------------|----------------------|
| **Resource pre-positioning** | Weekly | State assessment + trajectory estimate + fragility indicators | ANEPC regional coordination |
| **Alert level escalation** | Daily (during high-risk periods) | Anomaly detections + state classification | ANEPC duty officer |
| **Operational readiness review** | Weekly | Weak-signal clusters + load displacement candidates | ANEPC/ICNF joint review |

CIS outputs provide structured, uncertainty-visible diagnostic information. They do not replace operational judgment. Every output carries `isAdvisory: true` and explicit confidence bounds.

### 1.3 Pilot Duration

The pilot runs in three sequential phases:

| Phase | Period | Mode | Purpose |
|-------|--------|------|---------|
| **Calibration** | March–May 2026 | Retrospective (2023–2024 seasons) | Establish domain-calibrated parameters; test indicator mapping; produce preliminary state assessments for comparison against known outcomes |
| **Active monitoring** | June–September 2026 | Prospective (real-time) | Apply CIS weekly to current-season observations; produce advisory outputs for analyst review |
| **Review** | October 2026 | Analysis | Collect analyst usefulness ratings; compute success metrics; produce final pilot report |

**Total duration: 8 months.** The calibration phase uses historical data and requires no real-time data infrastructure. The active monitoring phase requires a weekly data collection and observation construction workflow.

### 1.4 Pilot Scope

**Geographic scope:** Centro region (NUTS II), with sub-regional focus on the Pinhal Interior Norte, Pinhal Interior Sul, and Serra da Estrela municipalities — the historically highest fire burden sub-regions.

**System under study:** The integrated wildfire management system, comprising:
- The environmental subsystem (fire weather, fuel moisture, vegetation condition)
- The suppression capacity subsystem (ANEPC, Bombeiros, aerial resources, GNR SEPNA)

Load displacement analysis (Phase 2E) treats these as a Source-Recipient pair when applicable.

**Out of scope:** Individual fire incident management, evacuation planning, post-fire ecological recovery, criminal investigation of fire origin.

---

## Section 2 — System Definition

### 2.1 The Monitored System

The CIS analysis target is the **integrated wildfire management system of the Centro region** — the combined environmental and operational system whose continuity is defined as: the region's capacity to prevent ignition, suppress fires that do ignite, and maintain human safety and infrastructure integrity within acceptable operational bounds.

System continuity is not fire prevention per se. In CIS terms, continuity is the capacity of the system to maintain its primary function (fire management within operational bounds) under varying environmental load. A period of severe fire weather during which no major fires escape suppression is high-load / high-continuity. A period of moderate fire weather during which suppression capacity is already committed and degraded is lower-load but lower-continuity — the system's buffer is depleted.

### 2.2 Region

**Geographical extent:** Centro NUTS II region, approximately 28,000 km², covering the NUTS III sub-regions Pinhal Interior Norte, Pinhal Interior Sul, Serra da Estrela, Beira Baixa, and Médio Tejo (inland areas).

**Topography:** Mountainous interior (Serra da Estrela reaching 1,993 m); plateau terrain (Beira Baixa); river valleys. Complex topography accelerates fire spread through chimney effects and wind channeling.

**Historical context:** The Centro region carries approximately 40–50% of Portugal's annual burned area in high-fire years. The 2017 Pedrógão Grande fire (107 fatalities, ~45,000 ha burned) and the October 2017 fires occurred in this region. The system's continuity failures in 2017 are the most severe case study available for retrospective validation.

### 2.3 Vegetation

The fuel load composition is the primary structural driver of fire behavior and system fragility:

| Vegetation Type | Approximate Coverage | Fire Behavior Significance |
|----------------|---------------------|--------------------------|
| Eucalyptus (*Eucalyptus globulus*) | ~35% of forest area | Highly flammable; rapid drying; volatile oils; fire spreads to canopy rapidly |
| Maritime pine (*Pinus pinaster*) | ~30% of forest area | High resin content; crown fires; pine needle litter increases surface fuel load |
| Scrubland / mato (*Cistus* spp., *Erica* spp., *Ulex* spp.) | ~20% | Dense; flammable when dry; rapid surface fire spread; re-sprouts aggressively after fire |
| Native broadleaf (cork oak, holm oak) | ~15% | More fire-resistant; higher moisture content; lower spread rate |

High eucalyptus and pine coverage means the system operates with inherently lower buffer than regions with fire-resistant vegetation. Structural fire risk is chronically elevated — this affects calibration of the `bufferInitialLevel` parameter.

### 2.4 Weather Drivers

**Fire weather** is the primary environmental load on the system. The following weather variables directly drive system state:

| Variable | Role in System | Primary Source |
|----------|---------------|----------------|
| Maximum temperature | Direct fuel moisture driver; above 35°C accelerates drying dramatically | IPMA SNIRH / EFFIS |
| Relative humidity | Critical below 25%; below 15% creates extreme drying conditions | IPMA / SNIRH |
| Wind speed and direction | Primary fire spread driver; föhn-type winds (Nortada, Leste) create dangerous combinations | IPMA surface network |
| Precipitation | Primary buffer recovery mechanism; 10mm+ over 3 days partially restores fuel moisture | IPMA / SNIRH |
| Drought index (PDSI / SPI) | Integrated measure of soil moisture deficit; principal driver of season-length buffer depletion | SNIRH drought monitoring |

The **Canadian Fire Weather Index (FWI)** system, as implemented in EFFIS, integrates temperature, humidity, wind, and precipitation into composite fire danger indices. The FWI and its sub-indices (Fine Fuel Moisture Code, Duff Moisture Code, Drought Code, Initial Spread Index, Buildup Index) provide the most operationally relevant pre-processed environmental inputs.

### 2.5 Human Activity

Human activity enters the system as both a load driver and a boundary modifier:

| Activity | Effect on System |
|---------|----------------|
| Agricultural burning | Ignition source during dry periods; restricted under Lei n.º 76/2017; restriction compliance rate is a boundary condition |
| Road network use | Ignition source (discarded cigarettes, vehicle fires); also primary access route for suppression resources |
| Tourism and recreation | Elevated ignition risk during summer season; access restriction (admissibility boundary modification) is a management tool |
| Forest management (fuel clearing, firebreaks) | Increases buffer; failure to maintain reduces buffer at the structural level |
| Prescribed burning | Scheduled fuel reduction; window restrictions during fire season; weather-dependent execution |
| Land abandonment | Increasing scrubland coverage; structural increase in fuel load; not captured in annual indicators but affects `bufferInitialLevel` calibration |

### 2.6 Emergency Response Capacity

The suppression system is the operational continuity infrastructure:

| Resource Type | Role | National Coordination |
|--------------|------|----------------------|
| Corpos de Bombeiros (volunteer and professional) | First response; structural firefighting; forest fire suppression | ANEPC / LBOM coordination |
| ICNF forest rangers (Guarda Florestal) | Surveillance, detection, first response in forest areas | ICNF |
| GNR SEPNA | Forest law enforcement; fire investigation; patrol | GNR |
| ANEPC GIPS (Grupo de Intervenção de Proteção e Socorro) | Specialized wildfire suppression teams | ANEPC national reserve |
| Aerial resources (EMEL — Empresa de Meios Aéreos) | Air tankers, helicopters, Canadair; critical for inaccessible terrain | ANEPC national coordination |
| DECIR (Dispositivo Especial de Combate a Incêndios Rurais) | Seasonal reinforcement plan; defines pre-season resource commitment | ANEPC national plan |

The **DECIR** annual operational order is the primary document establishing the season's pre-positioned capacity and alert level thresholds. It is publicly available and constitutes the primary calibration reference for `bufferInitialLevel` and `capacityBaseline`.

---

## Section 3 — CIS Indicator Mapping

The CIS engine operates on five indicator dimensions, each expressed as a scalar in a normalized [0,1] range (except `operatingLoad`, which may exceed 1.0 during overload). The following mappings translate wildfire-domain observables into the format the engine requires.

The mappings are applied consistently throughout the pilot. No mapping changes once the active monitoring phase begins.

Three indicator dimensions require domain calibration parameters (`capacityBaseline`, `bufferInitialLevel`, `synchronizationTimingTolerance`). The remaining two (`recoveryRate`, `admissibilityBoundary`) are ratio and proportion measures that do not require a baseline — they are inherently normalized. See Section 3.7 for calibration requirements.

---

### 3.1 operatingLoad

**Observable:** Daily suppression commitment ratio — the proportion of the Centro region's total certified operational suppression capacity (crews, vehicles, and aerial resources) currently committed to active fire incidents or placed on immediate readiness at incident command.

**Normalized value:**
```
operatingLoad.value = Σ(active_resource_units) / capacityBaseline
```
Where `capacityBaseline` = total certified operational capacity in resource-unit-equivalents at season start per the DECIR.

**Engine band thresholds:**
- `< 0.70` → Stable band: system managing demand with substantial reserve
- `0.70 – 0.85` → Stressed band: significant resource commitment; reduced reserve
- `> 0.85` → Fragile band: commitment approaching or exceeding 85% of total capacity; critically reduced reserve

**Rationale:** Operating load in the CIS framework measures the proportion of capacity consumed by current demand. In wildfire operations, crew and aircraft commitment is the most direct and operationally meaningful measure of how much of the system's capacity is consumed. A region with 85% of its aircraft committed to active fires has almost no reserve for new ignitions.

**Expected update frequency:** Daily during fire season (June–September); weekly during shoulder months (April–May, October).

**Uncertainty considerations:**
- Resource-unit equivalence (converting between crew-hours and aircraft-hours) introduces estimation uncertainty. Document the conversion method at calibration and hold it constant.
- Mutual-aid resources received from outside the region during large events inflate the denominator if `capacityBaseline` is set to the standing regional capacity only. Protocol: use regional capacity as the denominator; mutual-aid resources received are recorded separately and noted in the uncertainty spec.
- Pre-positioned DECIR reinforcement resources are counted in the capacity baseline once deployed to the region.

**Measurement source:** `observed` when drawn from ANEPC operational reporting; `estimated` when derived from EFFIS/ANEPC published weekly situational reports.

---

### 3.2 recoveryRate

**Observable:** The ratio of the rate at which suppression resources are returning to available status (from committed incidents) to the rate at which new incidents are consuming available resources — computed over a rolling 7-day window.

**Normalized value:**
```
recoveryRate.value = resources_returned_to_available / resources_committed_to_new_incidents
                     (both over the same 7-day period; ratio is dimensionless)
```

**Engine band thresholds:**
- `≥ 1.20` → Stable band: resources returning to available faster than new commitments; system clearing backlog
- `1.00 – 1.20` → Stressed band: returns approximately matching new commitments; no backlog growth but no recovery
- `< 1.00` → Fragile band: new commitments outpacing returns; resource pool shrinking over the period

**Rationale:** The `recoveryRate` dimension in CIS measures the ratio of the system's recovery rate to its accumulation rate. In wildfire operations, this maps directly to the ratio of fire suppression and resource release against new fire commitment — is the system getting ahead of demand or falling behind? A recoveryRate below 1.0 means the system is progressively committing more resources than it is releasing, which is the definition of accumulating operational fragility.

**Expected update frequency:** Daily during active fire periods; weekly during low-activity periods.

**Uncertainty considerations:**
- The 7-day window is a design choice. Shorter windows (3-day) are more sensitive to day-to-day variation but noisier; longer windows (14-day) smooth noise but lag real changes. 7-day is recommended as the baseline. Window length is locked at calibration.
- During a single large sustained fire, the numerator (resources returned) may be zero for multiple consecutive days. This produces a recoveryRate of 0, which maps to the Fragile band. This is correct — a system fully committed to one sustained fire and unable to release resources is operationally fragile. It must be noted in the uncertainty spec.
- This dimension does not require `capacityBaseline` — the ratio is dimensionless.

**Measurement source:** `observed` from ANEPC operational logs; `estimated` from ANEPC published incident counts and resource deployment duration data.

---

### 3.3 admissibilityBoundary

**Observable:** The proportion of the Centro region's territory, time windows, and activity categories operating under fire restriction conditions more stringent than the baseline (normal fire-season) configuration.

**Normalized value:**
```
admissibilityBoundary.value = (area_under_elevated_restriction / total_area)
                               × (restricted_activity_proportion)
                               averaged across the current observation window
```

Operationally: the proportion of territory under "interdição" (prohibition) or "alerta máximo" (maximum alert) conditions that restrict human activity beyond the baseline Level 1 restriction applied across the region in normal fire season.

**Engine band thresholds:**
- `< 0.10` → Stable band: less than 10% of region under elevated restriction; near-normal operational configuration
- `0.10 – 0.25` → Stressed band: 10–25% of region under elevated restriction; meaningful operational constraint
- `> 0.25` → Fragile band: more than 25% under elevated restriction; system significantly tightening admissibility in response to elevated risk

**Rationale:** The CIS `admissibilityBoundary` dimension measures the proportion by which the system has tightened what it accepts — the narrowing of the operational envelope in response to risk. In wildfire management, restriction levels (from IPMA Risco de Incêndio Rural "Maximum" and "Very High" classifications triggering territorial restrictions) are the direct observable of this tightening. When more than 25% of the territory is under elevated restriction, the system has significantly narrowed its admissibility — this is a Fragile-band signal.

**Expected update frequency:** Daily (restriction levels are updated daily by IPMA and ANEPC during fire season).

**Uncertainty considerations:**
- The IPMA Risco de Incêndio Rural map is a risk map, not a restriction map. Restrictions are applied by local and national authorities based on risk levels, but the correspondence is not exact. The conversion method must be documented at calibration.
- During multi-day heat events, restrictions may remain elevated even if risk indices momentarily dip. The 7-day averaging window smooths this.
- This dimension does not require a baseline calibration parameter — it is expressed as a proportion of the territory-activity space from the nominal (baseline Level 1) configuration.

**Measurement source:** `observed` from IPMA daily fire risk maps + ANEPC restriction bulletins; `estimated` when spatial coverage data is incomplete.

---

### 3.4 synchronization

**Observable:** The proportion of inter-agency coordination events completed within the defined timing tolerance during the observation window. Primary coordination events:

1. **Dispatch-to-first-response arrival:** Proportion of fire incident reports where the first suppression resource arrives within the ANEPC-defined response target interval (varies by incident type; defined in DECIR protocols)
2. **Cross-agency incident command transfer:** Proportion of incidents where command transfers between local and national coordination meet protocol timing requirements
3. **Aerial resource tasking:** Proportion of aerial tasking requests where aircraft reaches the reported fire location within the target interval

**Normalized value:**
```
synchronization.value = (qualifying_events_completed_within_tolerance) /
                         (total_qualifying_events_in_observation_window)
```

**Engine band thresholds:**
- `> 0.85` → Stable band: more than 85% of coordination events meet timing requirements
- `0.70 – 0.85` → Stressed band: 70–85% meeting requirements; coordination degradation detectable
- `< 0.70` → Fragile band: fewer than 70% meeting timing requirements; coordination coherence significantly degraded

**Rationale:** The CIS `synchronization` dimension measures the proportion of coordination dependencies satisfied within timing tolerance. In wildfire operations, this is the inter-agency coordination system — ANEPC, Bombeiros, ICNF, GNR, and aerial resources must coordinate effectively for suppression to work. When aerial tasking response times lengthen, command transfers degrade, or first-response arrival rates slip, the coordination coherence of the suppression system is degrading independently of how much resource is committed. A system with adequate resources but poor coordination is operationally fragile in a structurally distinct way from a system with high load.

**Expected update frequency:** Weekly (aggregated over the prior 7 days). Daily data is used but reported as a weekly proportion.

**Uncertainty considerations:**
- `synchronizationTimingTolerance` (the target interval for each coordination event type) is a calibration parameter. In domain-confirmed mode, it is drawn from ANEPC protocol documents. In structurally-estimated mode, structural defaults are applied and flagged.
- Coordination data is the least publicly available of the five dimensions. In the calibration phase (retrospective analysis), this dimension may need to be `estimated` from published response time statistics or `missing` where no data is available. Missing dimensions are handled by the CIS engine's 3-of-5 classification rule.
- During mass fire events, coordination data quality degrades (everyone is in the field). The uncertainty spec must note this.

**Measurement source:** `observed` from ANEPC published response time data and incident reports; `estimated` from published statistics; `missing` where no coordination data is available for the window.

---

### 3.5 bufferLevel

**Observable:** The proportion of the Centro region's pre-positioned reserve suppression capacity (crews and aerial resources not currently committed and available for immediate deployment to new incidents) relative to the season-start pre-positioned capacity level.

**Normalized value:**
```
bufferLevel.value = available_reserve_capacity_now / bufferInitialLevel
```
Where `bufferInitialLevel` = the pre-positioned reserve capacity defined in the DECIR at fire season start for the Centro region. This is the reference level — the full buffer.

**Engine band thresholds:**
- `> 0.30` → Stable band: more than 30% of pre-positioned reserve remains available; adequate cushion
- `0.15 – 0.30` → Stressed band: 15–30% remains; reduced cushion; second surge capacity is limited
- `< 0.15` → Fragile band: less than 15% remains; system is critically depleted; new major ignitions have minimal reserve response available

**Rationale:** The CIS `bufferLevel` dimension is the most direct measure of remaining system capacity. In wildfire operations, the pre-positioned reserve represents exactly this — the gap between current deployment and total capacity. As the season progresses and multiple fires run simultaneously, this reserve depletes. When the buffer falls below 15% of the initial pre-positioned level, a new major ignition has almost no reserve available to it. This is the definition of system-level fragility.

**Expected update frequency:** Daily during fire season. The buffer is tracked as a daily operational figure by ANEPC and ICNF.

**Uncertainty considerations:**
- `bufferInitialLevel` is the critical calibration parameter. It is set from the DECIR annual operational order. If the DECIR is revised mid-season (e.g., emergency reinforcement), `bufferInitialLevel` is updated and the revision is logged as an `admissibilityBoundary` event (boundary-condition modification).
- Mutual-aid resources arriving from outside the region temporarily inflate the buffer. Protocol: external mutual-aid is counted separately and noted in the uncertainty spec. The buffer is the regional standing capacity.
- `bufferHistory` (the time series of `bufferLevel` values across observation windows) is the primary input to Phase 2D fragility estimation. Maintaining this history is essential for time-to-threshold analysis.

**Measurement source:** `observed` from ANEPC operational capacity tracking; `estimated` from DECIR allocation minus publicly reported deployments.

---

### 3.6 Coherence Type Assignment

The CIS engine requires a `coherenceType` from the closed six-type enumeration for every observation. The assignment rule for the wildfire system is:

| System Condition | Assigned coherenceType | Rationale |
|-----------------|----------------------|-----------|
| Normal operational state; no CSD signals; buffer adequate | `adaptive` | Standard continuity; no diagnostic flag required |
| CSD signals present (recovery time increasing over ≥3 consecutive Fragile periods); buffer declining | `brittle` | Threshold proximity elevated; fragility accumulation rate likely underestimated by buffer metrics alone |
| Local suppression units (Bombeiros) stable but national resources (ANEPC reserve, GIPS) accumulating fragility — load displacement candidate present | `extractive` | Extractive coherence flag: assess as load displacement candidate; Recipient (national reserve) requires separate diagnostic |
| Multiple indicators in Fragile band; system maintaining function only through extraordinary measures (international aid, military) | `pathological` | Sustainability window assessment required; advise governance review |

`coercive` and `regenerative` types are not expected in the normal operating range of this pilot. `regenerative` would apply during a recovery phase with documented active restoration investment and two or more consecutive periods of improving indicators.

The coherenceType is assigned by the observation constructor (see Section 7) based on the rule table above, before the observation is submitted to the CIS engine. The assignment is documented in the observation record.

---

### 3.7 Calibration Requirements

Three CIS parameters require domain calibration. Their status determines whether the engine operates in `domain-confirmed`, `partially-calibrated`, or `structurally-estimated` mode.

| Parameter | Value | Source | Availability |
|-----------|-------|--------|-------------|
| `capacityBaseline` | Total certified operational capacity of the Centro region suppression system in resource-unit equivalents (crews × mean crew size × availability factor + aircraft × operational-day equivalence factor) | DECIR annual operational order (ANEPC) | Publicly available annually |
| `bufferInitialLevel` | Pre-positioned reserve capacity at fire season start for Centro, in resource-unit equivalents (same units as `capacityBaseline`) | DECIR allocation section for Centro region | Publicly available annually |
| `synchronizationTimingTolerance` | Target dispatch-to-first-response interval (minutes) per incident category, per ANEPC protocols | ANEPC operational protocol documents | May require institutional access; default to structurally-estimated if unavailable |

**Calibration mode during pilot:**

- *Calibration phase (March–May 2026):* The DECIR for 2026 will be issued in late May. Before DECIR publication, use 2024 DECIR values and operate in `partially-calibrated` mode (two of three parameters available; `synchronizationTimingTolerance` structurally estimated). After DECIR publication, update to `partially-calibrated` or `domain-confirmed` depending on `synchronizationTimingTolerance` availability.

- *Active monitoring phase (June–September 2026):* Target `partially-calibrated` as minimum. `Domain-confirmed` if ANEPC provides protocol timing data.

All CIS outputs produced under `structurally-estimated` or `partially-calibrated` mode carry wider confidence bounds and explicit uncertainty disclosures. The pilot does not suppress these disclosures — they are the honest representation of what the engine knows.

---

## Section 4 — Data Sources

All data sources identified below are open-access or obtainable through standard public agency request. No proprietary data is required to run the pilot.

### 4.1 Weather and Fire Danger

| Source | Data Provided | Update Frequency | Access |
|--------|--------------|-----------------|--------|
| **EFFIS (European Forest Fire Information System)** | Daily Fire Danger Forecast (FWI components: FFMC, DMC, DC, ISI, BUI, FWI); current fire danger map; 10-day forecast | Daily | effis.jrc.ec.europa.eu — public download |
| **IPMA (Instituto Português do Mar e da Atmosfera)** | Daily Risco de Incêndio Rural maps (5-level risk: Reduzido, Moderado, Elevado, Muito Elevado, Máximo); weather station data; precipitation | Daily | ipma.pt — public |
| **SNIRH (Sistema Nacional de Informação de Recursos Hídricos)** | Palmer Drought Severity Index; Standardized Precipitation Index; soil moisture; river flow | Weekly/monthly | snirh.apambiente.pt — public |

### 4.2 Vegetation Stress and Fuel Condition

| Source | Data Provided | Update Frequency | Access |
|--------|--------------|-----------------|--------|
| **Copernicus Land Monitoring Service** | NDVI (Normalized Difference Vegetation Index); Leaf Area Index; fuel moisture content derived products | 10-day composites | land.copernicus.eu — public |
| **Copernicus Global Land Service** | Fraction of Absorbed Photosynthetically Active Radiation (FAPAR); vegetation productivity anomaly | 10-day | land.copernicus.eu — public |
| **Sentinel-2 (ESA)** | High-resolution vegetation indices; burned area mapping (10m) | 5-day revisit | Copernicus Open Access Hub — public |
| **MODIS (NASA Terra/Aqua)** | Vegetation indices (MOD13); fuel moisture content; burned area (MCD64) | 8-day / monthly | earthdata.nasa.gov — public |

### 4.3 Drought Indicators

| Source | Data Provided | Update Frequency | Access |
|--------|--------------|-----------------|--------|
| **SNIRH Drought Monitor** | PDSI by hydrological basin; SPI at 1-, 3-, 6-, 12-month scales | Monthly | snirh.apambiente.pt — public |
| **IPMA Drought Monitoring** | Monthly drought monitoring reports; spatial drought maps | Monthly | ipma.pt — public |
| **JRC European Drought Observatory** | Soil moisture anomaly; Combined Drought Indicator | Monthly | edo.jrc.ec.europa.eu — public |

### 4.4 Fire Occurrence

| Source | Data Provided | Update Frequency | Access |
|--------|--------------|-----------------|--------|
| **EFFIS Current Situation** | Active fires in Europe (from MODIS/VIIRS); burned area by country and region; fire count | Daily | effis.jrc.ec.europa.eu — public |
| **FIRMS (NASA Fire Information for Resource Management System)** | Near-real-time active fire detections (MODIS, VIIRS, LANDSAT) | Sub-daily (4–6 hour latency) | firms.modaps.eosdis.nasa.gov — public |
| **ICNF Fire Statistics** | Annual and seasonal burned area by municipality; fire occurrence count; origin investigation summary | Annual (with seasonal updates) | icnf.pt — public |
| **ANEPC Situational Reports** | Weekly fire situation summaries during fire season; resource deployment status | Weekly during fire season | prociv.pt — public |

### 4.5 Response Activity

| Source | Data Provided | Update Frequency | Access |
|--------|--------------|-----------------|--------|
| **ANEPC Published Situational Reports** | Weekly operational summary; active fires; resources committed; major incident declarations | Weekly during fire season | prociv.pt — public |
| **DECIR Annual Operational Order** | Season pre-positioning plan; resource allocation by region; alert level thresholds | Annual (May/June) | anepc.pt — public |
| **ANEPC SIRESP/SADO data** (if access granted) | Real-time dispatch and coordination data | Real-time | Requires institutional access; not mandatory for pilot |

### 4.6 Administrative and Boundary Reference

| Source | Data Provided | Update Frequency | Access |
|--------|--------------|-----------------|--------|
| **ICNF Restriction Bulletins** | Daily fire restriction levels by district and municipality during fire season | Daily | icnf.pt — public during fire season |
| **DGTERFF / DGT** | Land use maps; forest type classification; administrative boundaries | Annual | dgterff.icnf.pt — public |
| **INE (Instituto Nacional de Estatística)** | Population and settlement data for vulnerability context | Annual | ine.pt — public |

---

## Section 5 — Continuity-State Interpretation

The following interprets each CIS continuity state in the wildfire management context. These interpretations govern how analysts read CIS state assessments and how the pilot's success metrics are evaluated.

---

### 5.1 Stable

**CIS definition:** 3 of 5 indicators in the stable band; no special-state criteria met.

**Wildfire interpretation:** The Centro region suppression system is operating with substantial reserve capacity. Active fire commitment is below 70% of certified capacity. Resource recovery is outpacing new commitments (ratio ≥ 1.20). No more than 10% of the territory is under elevated fire restriction. Inter-agency coordination is meeting response targets in more than 85% of events. More than 30% of the pre-positioned reserve buffer remains uncommitted.

**Operational implication:** The system can absorb a significant new ignition without capacity breach. Pre-positioning adjustments are routine maintenance, not reactive response. This is the expected state in April, early May, and October.

**Example conditions:** Mild FWI; recent precipitation; crews returning from training or low-level activity; aerial resources at base; standard restriction levels in effect.

---

### 5.2 Stressed

**CIS definition:** 3 of 5 indicators in the stressed band; no special-state criteria met; does not meet Compensating, Fragile, or other special-state criteria.

**Wildfire interpretation:** The system is managing elevated fire weather and/or active fire demand, but within capacity. At least three indicators show meaningful degradation from the stable band. Operational load is between 70–85% of capacity. Recovery rate is marginal (1.00–1.20). Restrictions have been elevated in 10–25% of territory. Reserve buffer has dropped to 15–30% of pre-positioned level.

**Operational implication:** The system has reduced margin. A new major ignition would create pressure. Pre-positioning review is warranted. This is the expected state during moderate fire weather periods in July and August. It is not an emergency — it is elevated monitoring.

**CIS action:** Trajectory estimation (Phase 2C) is most useful here — which direction is the system moving? A Stressed system trending toward Fragile requires different pre-positioning response than one trending toward Stable.

**Example conditions:** Sustained FWI "Very High" for 5+ days; 2–3 active significant fires in the region; aerial resources partially committed; some municipalities under elevated restriction.

---

### 5.3 Compensating

**CIS definition (special state):** Primary function (fire suppression capacity at regional level) is stable within 5% of baseline; secondary mechanism load measurably increasing.

**Wildfire interpretation:** The regional suppression system appears to be managing — primary suppression metrics are holding — but only because secondary mechanisms are absorbing escalating load. The most operationally significant patterns:

- **Local-to-national load transfer:** Municipal Bombeiros units (primary regional response) are stable, but GIPS (national specialized teams) and DECIR mutual-aid resources are increasingly committed to the region. The primary system appears functional; the secondary system is carrying the growing burden.
- **Aerial-to-ground substitution:** Ground suppression is stable, but aerial resource commitment is increasing disproportionately (aerial resources compensating for difficult terrain or inaccessible fires that exceed ground suppression reach).
- **Volunteer-to-professional substitution:** Volunteer corps are stable in deployment, but professional (salaried) firefighter overtime is rising, indicating that apparent stability rests on increasing secondary-mechanism load.

**Operational implication:** Compensating state is the most important early-warning state in this domain. The system looks managed but is consuming its secondary capacity. If the secondary mechanism degrades (mutual-aid resources are recalled, aerial resources reach maintenance limits, volunteer burnout reduces availability), the system may transition to Fragile with little warning. Immediate review of secondary mechanism sustainability is warranted.

---

### 5.4 Fragile

**CIS definition:** 3 of 5 indicators in the fragile band; or CSD pre-threshold signal present.

**Wildfire interpretation:** Multiple system dimensions are in the fragile band simultaneously. Operating load exceeds 85% of capacity; recovery rate is negative (new commitments outpacing releases); restrictions have been elevated across more than 25% of territory; coordination timing is failing in more than 30% of events; reserve buffer is below 15% of pre-positioned level.

**CSD signal in this context:** Recovery time following individual fire incidents has been increasing by more than 20% across three or more consecutive observation periods in which the system was classified as Fragile. This means the system is taking progressively longer to reconstitute after each event — a CSD pre-threshold signal. The system's elasticity is declining.

**Operational implication:** This is the high-alert state. The system has minimal reserve. A new significant ignition under Fragile conditions — especially with CSD signals present — can overwhelm suppression capacity. Emergency pre-positioning requests, mutual aid activation, and executive decision-making are warranted. CIS does not make these decisions; it surfaces the structural state that informs them.

**Phase 2D fragility estimation:** In the Fragile state, the `bufferHistory` time series enables time-to-threshold estimation — at the current depletion rate (dB/dt), how many additional observation periods until the buffer reaches effectively zero? This estimate carries explicit confidence bounds and is not a prediction; it is an advisory assessment of trajectory at current rates.

**Example conditions:** Sustained extreme FWI; multiple simultaneous large fires; aerial fleet at or near operational limits; mutual aid already activated; >25% territory at maximum restriction.

---

### 5.5 Collapsing

**CIS definition (special state):** Cascade events documented; primary function declining (primary function indicator trend = 'declining'); recovery rate zero or negative.

**Wildfire interpretation:** The suppression system has lost the capacity to contain the situation within operational bounds. Cascades — fires jumping containment lines, spotting beyond control perimeters, secondary ignitions from embers — are documented and the primary suppression function is not gaining ground. Recovery rate is at or below zero: the system is not releasing resources from any incidents because no incidents are reaching containment. This is a mass fire event.

**What CIS does not do in Collapsing state:** The trajectory estimator always returns COLLAPSING for systems currently in Collapsing state. CIS does not predict when collapse will end or what condition will precipitate stabilization. Those are incident management questions, not continuity diagnostic questions. CIS identifies that the system is Collapsing and continues monitoring for recovery signals.

**Operational implication:** At the Collapsing state, the diagnostic function shifts to recovery monitoring — tracking whether recovery signals (precipitation, wind shift, international aid) are producing measurable change in indicator values. CIS continues issuing advisory assessments.

**Historical reference:** The 2017 Pedrógão Grande event represents a period when the Centro region integrated wildfire management system reached Collapsing state. The CIS retrospective analysis in the calibration phase will reconstruct the indicator trajectory through that event as a reference case.

---

### 5.6 Recovering

**CIS definition:** Active recovery input documented; primary function improving from degraded baseline; ≥2 consecutive periods showing improvement.

**Wildfire interpretation:** The system is reconstituting after a Collapsing or Fragile period. Primary fire suppression capacity is improving from a degraded baseline. At least two consecutive observation windows show consistent indicator improvement across multiple dimensions.

**Active recovery inputs in this context:** Precipitation (fuel moisture recovery); reduction in active fire count; return of aerial resources from extended deployment; return of mutual-aid resources; improvement in coordination timing as operational tempo reduces.

**CIS trajectory in Recovering state:** The trajectory estimator projects toward Stable if improving indicators ≥3 in the current window, or toward Stressed if degrading indicators ≥2 (risk of relapse if fire weather returns before full reconstitution).

**Operational implication:** The Recovering state is the appropriate time for after-action review, resource maintenance, and preparation for the remainder of the fire season. The CIS fragility accumulation estimates (dB/dt sign change, d²B/dt² direction) are most informative here — is recovery accelerating, or is it slow and at risk of reversal?

---

## Section 6 — Weak-Signal Use Cases

These use cases illustrate how the CIS Phase 2A–2E capabilities apply to the wildfire domain. These are illustrative scenarios using the existing engine; they are not new capabilities.

### 6.1 Anomaly Detection (Phase 2A)

Phase 2A detects indicator dimensions or primary function trends that are inconsistent with the current state classification.

**Use case A — StateMismatch (load anomaly under Stable classification):**

The system is classified as Stable based on a 3-of-5 count. However, the `operatingLoad` value is 0.68 — just below the 0.70 Stable threshold, with a strong upward trend. Phase 2A flags this as a StateMismatch anomaly: the operating load dimension is barely within the Stable band despite the state classification suggesting adequate margin. Severity: Medium. The anomaly flags that one dimension is at the margin of the Stable band — the classification is valid but thin on that dimension.

**Use case B — TrendMismatch (buffer declining during a Stable period):**

The system is classified as Stable. However, across the last three weekly observation windows, the `bufferLevel` value has declined from 0.65 to 0.52 to 0.41 — all within the Stable band, but trending downward consistently. Phase 2A flags a TrendMismatch: the buffer trend is inconsistent with the Stable state, where buffer should be stable or recovering. Severity: Medium. This signals that the system is drifting toward the Stressed band even though it has not crossed it.

**Use case C — SynchronizationMismatch (coordination degrading independent of load):**

Operating load is 0.72 (Stressed band). Synchronization has fallen to 0.66 (Fragile band). The classification is Stressed (3-of-5: load, recovery, admissibility in Stressed or below). But synchronization is in the Fragile band independently of load — it is worse than the overall state classification suggests. Phase 2A flags a SynchronizationMismatch anomaly: the synchronization dimension is in a worse band than the state classification reflects. Severity: High. This flags that coordination coherence has degraded more severely than the overall state suggests — operationally significant because coordination failure can cause a Stressed system to collapse without passing through the intermediate Fragile state.

**Use case D — BoundaryMismatch (restriction escalation without corresponding load change):**

Operating load is 0.61 (Stable band). Admissibility boundary has jumped from 0.08 (Stable) to 0.28 (Fragile) in a single observation window. Load has not changed correspondingly. Phase 2A flags a BoundaryMismatch: the admissibility boundary has tightened to the Fragile band in a manner inconsistent with the current load level. This can signal that authorities are responding to environmental conditions (e.g., extreme FWI forecast) that have not yet translated into increased operational load — an early-warning pattern worth flagging.

---

### 6.2 Weak-Signal Clustering (Phase 2B)

Phase 2B groups sub-threshold anomalies — individually below the threshold for formal escalation — when they share a structural indicator relationship.

**Use case — Pre-season drought establishment cluster:**

In the third week of May, the following sub-threshold (Low-severity) anomalies are present:
- `bufferLevel` trending slightly downward (0.78 → 0.71 over 3 weeks), still firmly Stable, but the trend is negative
- `admissibilityBoundary` rising slightly (0.06 → 0.10), just entering the Stressed band — not alarming in isolation
- `recoveryRate` dipping slightly (1.35 → 1.22), still Stable, but declining

None of these individually triggers a formal escalation. Each is Low-severity. But Phase 2B clusters them because `bufferLevel` and `recoveryRate` share a structural relationship (both reflect capacity margin), and `admissibilityBoundary` shares a relationship with both (boundary restrictions tighten as capacity becomes constrained). The cluster's inferred structural driver: **early drought establishment** — the system is showing multi-dimensional sub-threshold degradation consistent with a slow-building drought condition establishing before fire season opens.

**Analyst value:** In isolation, a slightly declining buffer in May is unremarkable. A slightly elevated restriction level in May is unremarkable. A slightly lower recovery rate is unremarkable. Together, as a cluster with a coherent structural driver, they constitute early evidence that the 2026 fire season may be beginning from a depleted starting position — operationally significant for pre-positioning decisions made in June.

---

### 6.3 Fragility Accumulation (Phase 2D)

Phase 2D estimates fragility trends from the buffer level observation history using OLS regression.

**Use case — Buffer depletion rate estimation mid-season:**

The pilot maintains a `bufferHistory` time series from the start of the active monitoring phase (June). By the end of July, the buffer history contains 8 weekly observations:

```
Week  1 (June 7):  bufferLevel = 0.92
Week  2 (June 14): bufferLevel = 0.88
Week  3 (June 21): bufferLevel = 0.85
Week  4 (June 28): bufferLevel = 0.80
Week  5 (July 5):  bufferLevel = 0.72
Week  6 (July 12): bufferLevel = 0.63
Week  7 (July 19): bufferLevel = 0.55
Week  8 (July 26): bufferLevel = 0.48
```

Phase 2D OLS regression over the 8-week history:
- `dB/dt` (OLS slope): approximately −0.062 per week (negative: buffer declining)
- `d²B/dt²`: the week-5 through week-8 decline is steeper than weeks 1–4. Second derivative is negative — accumulation is **accelerating**.
- `timeToThreshold` (at dB/dt = −0.062/week, from current level 0.48): to reach the Fragile threshold (0.15) takes approximately 5.3 weeks at current rate — **but** given accelerating depletion, the actual time-to-threshold is likely shorter

The Phase 2D output carries a confidence range (e.g., `{ low: 3, high: 7 }` weeks) and an explicit assumption list noting that the time-to-threshold assumes current depletion rate continues. The output is advisory; it does not state that collapse will occur.

**Analyst value:** Without OLS trend analysis, an analyst looking at week 8 sees a buffer at 0.48 — still in the Stable band (>0.30). The CIS fragility estimate reveals that at the current accumulation rate with acceleration, the buffer crosses the Stressed threshold in approximately 3 weeks and the Fragile threshold in approximately 5. This structurally changes the resource pre-positioning decision horizon.

---

### 6.4 Load Displacement (Phase 2E)

Phase 2E identifies Source-Recipient pairs where the Source system is stable or improving while the Recipient system shows accumulating fragility — with a documented or inferable structural boundary between them.

**Use case — Local Bombeiros / ANEPC national reserve displacement:**

The pilot monitors two subsystems as a potential Source-Recipient pair:
- **Source:** Municipal and district Bombeiros units in the Centro region (local first response)
- **Recipient:** ANEPC national reserve (GIPS, DECIR mutual-aid, aerial fleet)

The structural boundary: ANEPC has a documented coordination protocol under which local units respond first; national reserve units are activated when local capacity is exceeded. This is the documented boundary for load displacement analysis.

After six observation windows, the Phase 2E analysis shows:
- Source (local Bombeiros) OLS buffer slope: −0.008/week (within the `stable` classification threshold of ±0.01)
- Recipient (national reserve) OLS buffer slope: −0.071/week (`accumulating` classification; slope < −0.01)
- Boundary: documented in ANEPC DECIR coordination protocol

Phase 2E result: `candidateFlag: true` — load displacement candidate identified. The local system is stable while the national reserve system accumulates fragility, with a documented structural boundary between them. This is the pattern described by CIS MAY item 7.

CIS does not assert causality. The output is advisory: the pattern is present. Whether the national reserve's fragility accumulation is caused by load from the local system or by independent factors requires domain expert review.

**Analyst value:** The displacement candidate flags a structural vulnerability that neither the local nor the national system's analysis would surface independently. The local system appears fine; the national system's depletion looks like routine operational tempo. The displacement candidate surfaces the structural relationship — the local system's apparent stability is partly maintained by increasingly drawing on national reserve capacity.

---

## Section 7 — Pilot Workflow

### 7.1 Overview

```
DATA COLLECTION
│  Weekly (daily for critical dimensions during fire season)
│  Sources: EFFIS, IPMA, SNIRH, ANEPC reports, ICNF bulletins
│  Responsible: Data Collector
│
▼
OBSERVATION CONSTRUCTION
│  Weekly (producing one SystemObservation per monitoring period)
│  Translate domain data into CIS indicator values
│  Assign coherenceType per Section 3.6 rules
│  Document calibration status, measurement sources, uncertainty notes
│  Responsible: Observation Constructor
│
▼
CIS ANALYSIS
│  Weekly (running the CIS diagnostics engine on the new observation)
│  Phase 1: state classification, transition detection, CSD, coherence, recurrence
│  Phase 2A: anomaly detection
│  Phase 2B: weak-signal clustering (from accumulated anomaly history)
│  Phase 2C: trajectory estimation (from accumulated observation history)
│  Phase 2D: fragility estimation (from bufferHistory)
│  Phase 2E: load displacement (Source/Recipient pair, where both observed)
│  Responsible: CIS Analyst
│
▼
ANALYST REVIEW
│  Weekly (reviewing CIS outputs before inclusion in report)
│  Domain expert reviews CIS outputs for operational plausibility
│  Flags outputs that appear inconsistent with operational knowledge
│  Records usefulness ratings
│  Does not modify CIS outputs — flags disagreements as DomainExpertConflictFlag
│  Responsible: Domain Expert Reviewer
│
▼
REPORTING
│  Weekly during fire season; biweekly during calibration phase
│  State assessment + anomaly summary + weak-signal summary + analyst notes
│  Responsible: Pilot Coordinator
```

---

### 7.2 Data Collection

**Frequency:** Daily for `operatingLoad`, `bufferLevel`, `admissibilityBoundary` (these change daily during fire season). Weekly aggregation for `recoveryRate` and `synchronization` (these are computed over 7-day windows).

**Data Collector responsibilities:**

Each collection day, the Data Collector retrieves the following and stores in the date-stamped collection directory:

| Data Item | Source | Format | Notes |
|-----------|--------|--------|-------|
| EFFIS Daily Fire Danger | EFFIS map server | GeoJSON / CSV for Centro region | Download the FWI composite and sub-indices for the Centro NUTS II polygon |
| IPMA Risco de Incêndio Rural | IPMA daily bulletin | PDF + spatial data | Extract restriction level proportions for the Centro municipalities |
| ANEPC situational report | ANEPC website (weekly) | PDF | Extract resource commitment figures and any major incident declarations |
| ICNF restriction bulletin | ICNF website (daily during fire season) | HTML / PDF | Extract district-level restriction categories |
| SNIRH drought indices | SNIRH portal (weekly) | CSV | SPI and PDSI for Centro hydrological basins |
| Active fire detections | FIRMS VIIRS near-real-time | CSV / Shapefile | Filter to Centro NUTS II bounding box |

All files are stored in:
```
pilot/
  data/
    raw/
      YYYY-MM-DD/
        effis_danger_[date].geojson
        ipma_risco_[date].pdf
        anepc_sitrep_[week].pdf   (weekly)
        icnf_restricoes_[date].pdf
        snirh_drought_[date].csv  (weekly)
        firms_viirs_[date].csv
    processed/
      YYYY-WW/              (ISO week number)
        indicators.json     (computed indicator values for this week)
        observation.json    (complete SystemObservation object)
```

---

### 7.3 Observation Construction

**Frequency:** Once per week (producing one observation per ISO week).

The Observation Constructor takes the daily raw data for the week and produces a single `SystemObservation` object suitable for input to the CIS engine.

**Computation steps:**

**operatingLoad:**
```
1. From ANEPC sitrep: extract total crews committed to active fires
   (plus crews on immediate readiness at incident command)
2. Convert to resource-unit equivalents using the standard conversion factor
3. From aerial: extract aircraft committed from ANEPC sitrep
4. Sum all committed resource units
5. Divide by capacityBaseline
6. Record measurement source as "observed" if from ANEPC sitrep;
   "estimated" if inferred from incident counts × average resource requirements
```

**recoveryRate:**
```
1. From the current week: resources_committed_to_new_incidents
   (from FIRMS active fire count × average commitment per detection, calibrated
   against ANEPC sitrep counts where available)
2. From the current week: resources_returned_to_available
   (from ANEPC sitrep: incidents resolved or controlled in the week)
3. ratio = resources_returned / resources_committed_to_new_incidents
4. If resources_committed_to_new_incidents = 0: ratio = 1.50 (no new commitments;
   full recovery; capped at 1.5 to avoid division by zero producing extreme values)
5. Record measurement source
```

**admissibilityBoundary:**
```
1. From ICNF restriction bulletins: count municipalities under elevated restriction
   (Interdição or equivalent) versus baseline (Level 1 restriction)
2. proportion = municipalities_under_elevated_restriction / total_municipalities_in_Centro
3. Weight by area if spatial data is available; otherwise use municipality count
4. Record measurement source
```

**synchronization:**
```
1. From ANEPC sitrep: extract any noted coordination failures, delayed responses,
   or incidents flagged for response time review
2. Estimate: (total_incidents − flagged_coordination_issues) / total_incidents
3. In absence of explicit coordination data: use structural default rate of 0.82
   (within the Stressed band; represents a conservative estimate for a complex
   multi-agency system under moderate load) — flag as "estimated"
4. When ANEPC response time data becomes available, update to "observed"
```

**bufferLevel:**
```
1. From ANEPC sitrep: extract total resource commitment at end of week
2. available_reserve = capacityBaseline − committed_resources − on_immediate_readiness
3. bufferLevel.value = available_reserve / bufferInitialLevel
4. Append value to bufferHistory array (maintained across all weeks)
5. Record measurement source
```

**coherenceType assignment:**
```
1. Check for CSD signals from Phase 1 output of prior week (if available)
2. Check for load displacement candidate from prior Phase 2E output
3. Assign per the rule table in Section 3.6
4. Record assignment rationale in the observation notes
```

**Complete observation object (example structure):**
```javascript
{
  systemId: "PT-CENTRO-WILDFIRE-2026",
  observationDate: "2026-07-12",
  indicators: {
    operatingLoad:         { value: 0.74, source: "observed"  },
    recoveryRate:          { value: 1.05, source: "estimated" },
    admissibilityBoundary: { value: 0.18, source: "observed"  },
    synchronization:       { value: 0.79, source: "estimated" },
    bufferLevel:           { value: 0.55, source: "observed"  }
  },
  calibrationStatus: {
    capacityBaseline:              true,   // from 2026 DECIR
    bufferInitialLevel:            true,   // from 2026 DECIR
    synchronizationTimingTolerance: false  // structurally estimated
  },
  coherenceType: "adaptive",
  priorClassification: "Stressed",   // from prior week's CIS output
  bufferHistory: [0.92, 0.88, 0.85, 0.80, 0.72, 0.63, 0.55],
  primaryFunctionIndicator: {
    metricName: "suppression_containment_rate",
    value: 0.84,
    trend: "stable"
  },
  cascadeEvents: [],
  secondaryMechanisms: [
    {
      mechanismId: "gips-national-teams",
      loadValue: 0.61,
      trend: "increasing"
    }
  ]
}
```

---

### 7.4 CIS Analysis

**Frequency:** Once per week, immediately after observation construction.

The CIS Analyst runs the complete diagnostics engine pipeline on the current observation:

1. **Phase 1** (`diagnostics-engine.js`): `runDiagnostics(observation, priorState, bands)`
   - State classification
   - Transition detection (using `priorClassification` from prior week)
   - CSD detection (using `Fragile`-state history)
   - Coherence classification and diagnostic flag
   - Recurrence validation (not applicable in this domain — no pattern citations are made; recurrence validation passes trivially)
   - Advisory boundary validation

2. **Phase 2A** (`anomaly-detector.js`): `runAnomalyDetection(observation, stateClassification, bands)`
   - Anomaly detection across all five dimensions

3. **Phase 2B** (`weak-signal-clustering.js`): `runWeakSignalClustering(anomalies, systemId, priorClusters)`
   - Cluster formation from Low and Medium anomalies
   - Uses accumulated anomaly history from prior weeks

4. **Phase 2C** (`trajectory-estimator.js`): `runTrajectoryEstimation(observationHistory, stateClassification, bands, opts)`
   - Trajectory estimation from accumulated observation history (minimum 2 observations for trend analysis)

5. **Phase 2D** (`fragility-estimator.js`): `runFragilityEstimation(bufferHistory, systemId, opts)`
   - OLS-based fragility trend analysis from `bufferHistory`
   - Produces `dB/dt`, `d²B/dt²`, and `timeToThreshold` where available

6. **Phase 2E** (`load-displacement-analyzer.js`): `runLoadDisplacementAnalysis(sourceHistory, recipientHistory, boundary, opts)`
   - Requires two observation histories: local Bombeiros (Source) and ANEPC national reserve (Recipient)
   - Only runs when both subsystem histories are available (from Week 2 onward)

All outputs are written to `pilot/analysis/YYYY-WW/cis_output.json`. Outputs are not modified after generation.

---

### 7.5 Analyst Review

**Frequency:** Weekly, within 24 hours of CIS analysis.

The Domain Expert Reviewer reads the CIS output for the current week and completes the **Weekly Analyst Review Form** (see Section 10):

- For each CIS state classification: does this match your operational understanding of the current system state? Rate 1–5.
- For each anomaly flagged: is this operationally meaningful? Rate 1–5. Would you have escalated based on this signal?
- For each weak-signal cluster: does the inferred structural driver correspond to something real? Rate 1–5.
- For the trajectory estimate: does the projected direction align with your operational expectation? Rate 1–5.
- For any fragility estimate: is the time-to-threshold estimate operationally relevant? Rate 1–5.

Where the reviewer's assessment conflicts with CIS output: the conflict is recorded using the `DomainExpertConflictFlag` structure (`resolution: null` — CIS does not resolve conflicts). The conflict is noted in the weekly report.

The Domain Expert Reviewer does not modify CIS outputs. The outputs stand as produced. Conflicts are additive information, not corrections.

---

### 7.6 Reporting

**Frequency:** Weekly during fire season; biweekly during calibration phase.

The Pilot Coordinator assembles the **Weekly Pilot Report** (see Section 10) from CIS outputs and the Analyst Review Form. The report is distributed to target users (ANEPC regional analysts, ICNF planning staff).

---

## Section 8 — Success Metrics

### 8.1 What This Pilot Does Not Claim

This pilot does not claim predictive accuracy. The CIS engine produces advisory diagnostic assessments. Evaluating whether CIS outputs correspond to subsequent outcomes is a Track D validation study (defined in `CIS_VALIDATION_PROGRAM.md`), not a pilot objective.

The pilot's success metrics measure whether CIS outputs are useful to analysts — whether they surface relevant structure, surface it early enough to inform decisions, and do so without overwhelming analysts with false signals.

### 8.2 Analyst Usefulness

**Metric:** Mean analyst usefulness rating across all weekly review sessions.

**Scale:** 1–5, using the behaviorally anchored scale from `CIS_CASE_CATALOG_FRAMEWORK.md` Appendix B.

**Collection:** Domain Expert Reviewer completes a rating for each CIS output type (state assessment, anomaly, cluster, trajectory, fragility estimate) each week.

**Threshold for pilot success:** Mean rating ≥ 3.5 across all output types; fewer than 20% of individual ratings at 1 or 2.

**Threshold for pilot concern:** Mean rating < 3.0; or > 40% of ratings for any single output type at 1 or 2 (suggests that specific output type is not useful in this domain).

---

### 8.3 Signal Relevance

**Metric:** Proportion of flagged anomalies and weak-signal clusters that the Domain Expert Reviewer assesses as operationally meaningful.

**Collection:** Weekly Analyst Review Form, per anomaly and cluster.

**Threshold for pilot success:** ≥ 60% of flagged anomalies assessed as operationally meaningful (rating 3 or above).

**Threshold for pilot concern:** < 40% of flagged anomalies assessed as meaningful; or any output type consistently rated as not meaningful (mean < 2.5 for that type over four consecutive weeks).

**What "meaningful" means:** The reviewer answers: "If I had received this signal in real time, would it have been worth noting in my situational assessment?" A "yes" response is meaningful.

---

### 8.4 Lead-Time Usefulness

**Metric:** Whether CIS outputs arrive early enough relative to operational decision windows to influence decisions.

**Measurement:**
- For each week where a CIS output changes state classification or flags a significant anomaly, the Analyst Review records: "Would this output, if available in real time, have had time to influence a resource pre-positioning or alert level decision before the relevant decision window closed?"
- Response: Yes / Marginally / No

**Target:** ≥ 70% of state changes and significant anomalies rated "Yes" or "Marginally" for decision-window timing.

**Structural constraint:** Weekly observation windows mean CIS outputs may lag intra-week developments. The pilot should assess whether weekly frequency is adequate or whether some dimensions (operatingLoad, bufferLevel) should be updated more frequently for the outputs to be decision-relevant.

---

### 8.5 False-Positive Burden

**Metric:** Rate at which CIS flags anomalies, clusters, or state changes that the Domain Expert Reviewer assesses as spurious — neither operationally meaningful nor corresponding to any identifiable environmental or operational development.

**Collection:** Weekly Analyst Review Form. For each flagged item rated 1 ("not useful") with a note that it corresponds to no identifiable development: counted as a false-positive burden event.

**Target:** False-positive burden rate < 20% of all flagged items over the pilot period.

**Context:** A moderate false-positive rate is expected and acceptable. The question is whether the useful signals are worth the noise. If analysts spend more time dismissing spurious flags than acting on real ones, the operational value is negative.

---

### 8.6 Calibration Quality

**Metric:** Whether CIS confidence ranges are empirically well-calibrated — do stated confidence bounds correspond to the frequency with which subsequent observations fall within them?

**Collection:** At the end of the active monitoring phase, for all trajectory estimates that included a confidence range: what proportion of subsequent observations fell within the stated range?

**Target:** 70% confidence ranges contain the true subsequent observation approximately 70% of the time; not systematically overconfident (coverage < 50%) or underconfident (coverage > 90% for stated 70% ranges).

**Note:** This metric can only be computed at the end of the monitoring phase, not weekly. It is a pilot-level metric, not a weekly metric.

---

## Section 9 — Risks

### 9.1 Data Quality Risks

| Risk | Description | Likelihood | Mitigation |
|------|-------------|-----------|-----------|
| **ANEPC data unavailability** | Weekly ANEPC situational reports may not contain sufficient detail for `operatingLoad` and `bufferLevel` computation | Medium | Use FIRMS active fire counts as proxy estimator; flag as "estimated"; document in uncertainty spec |
| **EFFIS / IPMA data gaps** | Temporary server downtime; data delivery failures | Low | Maintain 3-day data cache; use prior available observation with a staleness flag if current data is unavailable for >2 days |
| **Synchronization data absent** | Coordination timing data is the least publicly available dimension; may be consistently missing | High | Flag as "missing" for that dimension; CIS 3-of-5 rule accommodates one missing dimension without breaking state classification; document consistently |
| **DECIR not published before pilot start** | DECIR 2026 may not be public before June 1 | Low | Use 2025 DECIR values as preliminary; update `bufferInitialLevel` and `capacityBaseline` when 2026 DECIR is published; log the update as a calibration revision |
| **Spatial data resolution mismatch** | EFFIS FWI data is at ~1km grid; municipal restriction data is at municipality level; aggregation method affects indicator values | Medium | Document spatial aggregation method at calibration; hold it constant; report spatial uncertainty in the uncertainty spec |

### 9.2 Calibration Risks

| Risk | Description | Likelihood | Mitigation |
|------|-------------|-----------|-----------|
| **capacityBaseline is underspecified** | The DECIR may not provide a single regional capacity figure — it may allocate by resource type. Converting to a single resource-unit equivalent requires a conversion factor that introduces uncertainty | Medium | Define the conversion factor from the DECIR resource categories before pilot start; document the method; flag load values as "estimated" when conversion is applied |
| **bufferInitialLevel changes during the season** | ANEPC may activate emergency reinforcement resources mid-season, changing the pre-positioned baseline | Medium | Treat mid-season reinforcement as an `admissibilityBoundary` event (boundary modification); update `bufferInitialLevel` and log the revision; this is structurally accurate — the system expanded its admissibility |
| **Structural defaults misaligned with wildfire operations** | The CIS structural threshold bands (e.g., buffer < 15% = Fragile) may not correspond well to the wildfire domain's operational experience of fragility | Medium | Use the calibration phase (March–May retrospective) to assess whether state classifications correspond to known historical system states; adjust via domain calibration if evidence supports it; do not adjust structural thresholds (they are fixed in the engine) — adjust `capacityBaseline` and `bufferInitialLevel` to produce values that are correctly normalized |
| **synchronizationTimingTolerance unavailable** | Without institutional access to ANEPC protocol documents, this parameter cannot be domain-calibrated | High | Operate in `partially-calibrated` mode; explicitly note in all outputs that synchronization estimates are structurally estimated; widen the synchronization confidence range accordingly |

### 9.3 Interpretation Risks

| Risk | Description | Likelihood | Mitigation |
|------|-------------|-----------|-----------|
| **Coherence type misassignment** | The rule table for coherenceType assignment (Section 3.6) may produce incorrect assignments for novel system states | Medium | Review coherenceType assignments weekly in the Analyst Review; escalate ambiguous cases to the domain expert; log disagreements as DomainExpertConflictFlag |
| **State classification lag** | Weekly observation windows mean CIS may classify a system as Stressed when it has already moved to Fragile within the week | Medium | Flag high-rate-of-change periods in the observation notes; the trajectory estimate partially compensates by projecting beyond the current window |
| **Trajectory estimate misleads** | Phase 2C trajectory projection may project toward Stable when fire weather deteriorates suddenly | Medium | Trajectory estimates carry explicit confidence bounds; the analyst review explicitly checks trajectory plausibility; sudden deterioration is flagged as a BoundaryMismatch anomaly (environmental conditions changing faster than indicator history predicts) |
| **Fragility estimate misinterpreted as prediction** | Analysts may treat the Phase 2D time-to-threshold estimate as a prediction rather than an advisory assessment at current rates | Medium | Pilot training explicitly covers what time-to-threshold means (and does not mean); all estimates carry `isAdvisory: true` and explicit assumptions; weekly report templates include a standard disclaimer |
| **Load displacement candidate generates causal inference** | Analysts may infer that the local Bombeiros are "causing" national reserve depletion from the displacement candidate | Low | Weekly report template explicitly states: "Load displacement candidates identify a pattern, not a cause. Domain expert review is required before any causal inference." CIS does not include `causalAttribution` in displacement candidates. |

### 9.4 Operational Adoption Risks

| Risk | Description | Likelihood | Mitigation |
|------|-------------|-----------|-----------|
| **Analyst time constraint** | ANEPC operational analysts have limited time during active fire season; weekly CIS review adds to workload | High | Weekly report is designed to be reviewed in 15–20 minutes; the most time-constrained output is the state assessment (single page); detailed anomaly and cluster summaries are optional annexes |
| **Output format unfamiliar** | CIS output structure (isAdvisory, confidenceRange, assumptions) may be unfamiliar to operational analysts | Medium | Pilot onboarding session: 2-hour introduction to CIS output format and how to read it; pilot coordinator translates CIS outputs into operational-language summaries in weekly reports |
| **Advisory framing creates ambiguity** | Analysts accustomed to binary alert levels may find CIS advisory outputs with confidence ranges difficult to act on | Medium | Weekly report translates CIS confidence ranges into operational language: "CIS assesses the system as Stressed with high confidence" vs. "CIS assesses trajectory toward Fragile; uncertainty is substantial" |
| **CIS outputs ignored after early false flags** | If CIS produces several early spurious flags, analysts may stop engaging with the outputs | Medium | Monitor false-positive burden metric weekly; if it exceeds 30% in any two consecutive weeks, convene a review to assess whether the indicator mapping needs recalibration |
| **Institutional resistance** | Operational agencies may be resistant to an external diagnostic tool producing advisory assessments of their capacity state | Medium | Frame explicitly as analyst-support tool, not audit or oversight; outputs are advisory, not authoritative; the pilot coordinator role should be filled by someone with existing ANEPC/ICNF relationships |

---

## Section 10 — Pilot Deliverables

### 10.1 Weekly Reports (June–September 2026)

**Format:** Two-page maximum (operational summary) + optional annexes.

**Operational Summary (mandatory, 2 pages):**

*Page 1 — State Assessment:*
- CIS continuity state classification for the current week (with calibration mode noted)
- State transition from prior week (if any)
- Classification confidence value
- One-paragraph narrative translating the state classification into operational language
- Trajectory estimate: projected state with confidence range and 1–2 key assumptions

*Page 2 — Signals Summary:*
- Anomalies: count by severity (High / Medium / Low); table of High-severity anomalies with dimension, category, and 1-sentence description
- Weak-signal clusters: count; brief description of any new clusters with inferred structural driver
- Fragility indicators: current dB/dt and time-to-threshold estimate (if available) with confidence range
- Load displacement: current status of Source/Recipient monitoring (candidate / no candidate / insufficient history)

**Optional Annexes:**
- Annex A: Full anomaly list (all severities)
- Annex B: Cluster detail (full Phase 2B output for each active cluster)
- Annex C: Assumption lists from trajectory and fragility estimates
- Annex D: Raw CIS output (JSON) for technical review

---

### 10.2 State Assessments

State assessments are produced every week and archived. Each assessment contains:
- `systemId`: PT-CENTRO-WILDFIRE-2026
- `observationDate`
- `calibrationMode`
- `continuityState` with `classificationConfidence`
- `stateTransition` (if applicable)
- `uncertaintySpec` with data coverage, calibration mode, and uncalibrated dimensions
- `isAdvisory: true`

State assessment archive: `pilot/assessments/YYYY-WW-state.json`

---

### 10.3 Anomaly Summaries

Weekly anomaly summaries are produced by Phase 2A and archived. Each summary contains:
- All anomalies detected in the current observation
- Per anomaly: dimension, category, severity, description
- Aggregate statistics: anomaly count by severity; anomaly count by dimension
- `isAdvisory: true` on all outputs

Anomaly archive: `pilot/anomalies/YYYY-WW-anomalies.json`

---

### 10.4 Weak-Signal Summaries

Produced weekly when clusters are active. Each summary contains:
- Active clusters (persisting from prior weeks with new anomalies added)
- New clusters formed in the current week
- Dissolved clusters (lost coherence)
- Per cluster: anomaly list, inferred structural driver, confidence tier, compatible coherence type
- `isAdvisory: true`

Cluster archive: `pilot/clusters/YYYY-WW-clusters.json`

---

### 10.5 Final Pilot Report (October 2026)

The Final Pilot Report is produced after the active monitoring phase ends. It contains:

**Section A — Executive Summary:** Pilot scope, period, and principal findings in 500 words.

**Section B — State Assessment Archive:** Chronological table of all weekly state classifications; state transition history; comparison against ANEPC official alert level history for the same period.

**Section C — Success Metric Results:** All five success metrics (analyst usefulness, signal relevance, lead-time usefulness, false-positive burden, calibration quality) with values, confidence intervals, and against-threshold assessment.

**Section D — Indicator Mapping Assessment:** Which mappings worked well; which produced consistently missing or estimated values; which produced plausible indicator values; recommendations for calibration revision in a future cycle.

**Section E — Analyst Feedback Summary:** Aggregated Analyst Review Form results; recurring disagreements between CIS and domain expert; DomainExpertConflictFlag log with resolution notes (resolution remains null — CIS does not resolve conflicts, but the nature of recurring conflicts is documented).

**Section F — Domain Expert Conflict Log:** Full record of all DomainExpertConflictFlag events.

**Section G — Calibration Recommendations:** What additional calibration data would improve output quality; which dimensions would benefit most from moving from structurally-estimated to domain-confirmed.

**Section H — Recommendation on Continuation:** A recommendation on whether to continue the pilot in the 2027 fire season, expand to additional regions, or halt and document findings. This recommendation is advisory — it does not constitute a governance decision.

**Section I — Raw Data and Analysis Archive Index:** Complete index of all collected data, observations, and CIS outputs for audit purposes.

---

## Section 11 — Final Review

### 1. Can the current CIS engine support this pilot without modification?

**Yes.** The CIS engine as implemented in Phases 1 through 2E can support this pilot without any modification to its code, specification, or diagnostic capabilities.

Three things must be built around the engine — none of them are engine modifications:

**1. Observation construction pipeline.** The CIS engine accepts `SystemObservation` objects with five indicator dimensions as normalized scalar values. The wildfire domain data (EFFIS FWI, IPMA risk maps, ANEPC operational reports) must be translated into that format by the observation constructor. This is a data pipeline, not a CIS capability. It is described in Section 7.3.

**2. Load displacement subsystem tracking.** Phase 2E requires two observation histories (Source and Recipient) as separate inputs. The pilot must maintain separate observation histories for the local Bombeiros subsystem and the ANEPC national reserve subsystem. This is a data management requirement, not an engine capability.

**3. Buffer history maintenance.** Phase 2D requires `bufferHistory` — the time series of `bufferLevel` values across observation windows. The pilot must maintain this array and pass it to the engine each week. This is bookkeeping, not a capability gap.

**One engine constraint to acknowledge:** The CIS engine requires a `coherenceType` from the closed six-type enumeration for every observation. Wildfire management systems do not naturally carry a coherenceType label. The pilot addresses this through the explicit coherenceType assignment rule in Section 3.6. The rule is deterministic and domain-expert-reviewed; it does not require engine modification.

**Calibration mode:** The engine operates in `structurally-estimated` mode when calibration parameters are absent, `partially-calibrated` when some are present, and `domain-confirmed` when all three are present. All three modes are fully supported. The pilot begins in `partially-calibrated` mode (two of three parameters available from the DECIR) and aims for `domain-confirmed` if `synchronizationTimingTolerance` can be obtained from ANEPC protocols.

**What the engine cannot do in this pilot** (not modifications — honest scope statements):
- The engine cannot process spatial data. Spatial aggregation (converting the EFFIS FWI grid or the IPMA risk map to a single scalar for the Centro region) happens in the observation constructor, not the engine. The engine receives only the scalar.
- The engine does not know it is analyzing a wildfire system. The indicator mapping is applied by the observation constructor. The engine classifies states based on normalized scalar values against structural thresholds — it is domain-agnostic.
- The engine does not produce fire incident predictions. It produces advisory continuity state assessments. These are structurally different outputs.

---

### 2. What calibration work is required?

Three calibration parameters require domain-specific values. The required work for each:

**`capacityBaseline`** — Required for `operatingLoad` normalization.
- **What it is:** The total certified operational suppression capacity of the Centro region in a consistent resource-unit measure.
- **Where to find it:** DECIR 2026 annual operational order (ANEPC). This document is published each May/June and is publicly available on anepc.pt.
- **What must be done:** Extract the Centro region resource allocation from the DECIR (crews, vehicles, aerial resources). Apply a conversion factor to produce a single resource-unit-equivalent scalar. Document the conversion factor. This is approximately 4–8 hours of work.
- **Fallback:** Use 2024 or 2025 DECIR values until 2026 DECIR is published. Flag as provisional.

**`bufferInitialLevel`** — Required for `bufferLevel` normalization.
- **What it is:** The pre-positioned reserve capacity at fire season start for the Centro region, in the same resource-unit equivalents as `capacityBaseline`.
- **Where to find it:** DECIR 2026, same document. The DECIR distinguishes between committed resources (immediate response deployment) and reserve (pre-positioned but not committed). The reserve figures for Centro define `bufferInitialLevel`.
- **What must be done:** Extract the reserve allocation from the DECIR and convert to resource-unit equivalents using the same conversion factor as `capacityBaseline`. This takes 2–4 hours given the conversion factor is already defined.
- **Fallback:** Same as above.

**`synchronizationTimingTolerance`** — Required for `synchronization` normalization in `domain-confirmed` mode.
- **What it is:** The target dispatch-to-first-response interval for each coordination event category (first response, aerial tasking, incident command transfer), as defined in ANEPC operational protocols.
- **Where to find it:** ANEPC internal operational protocols. These are not necessarily public. An institutional access request to ANEPC for the protocol target intervals is required for domain-confirmed calibration.
- **What must be done:** Identify the relevant protocol documents; request access; extract the target intervals for the three key coordination event types; document them. If access is granted: 4–8 hours. If access is not granted: operate in `partially-calibrated` mode with synchronization as the uncalibrated dimension.
- **Fallback:** Structural default. The observation constructor assigns `synchronization: { value: 0.82, source: "estimated" }` when no coordination data is available — this places the system in the Stressed band for synchronization, which is a conservative but defensible default for a multi-agency system under moderate load.

**Total calibration effort before pilot start:** 10–20 hours of analysis work (assuming DECIR is publicly available; institutional access for synchronization is not obtained). This is the work required to move from `structurally-estimated` to `partially-calibrated` mode. Domain-confirmed mode requires additional institutional cooperation.

**Retrospective calibration check (calibration phase, March–May):** Using historical data from the 2022 and 2023 fire seasons, verify that the calibrated indicator values produce state classifications that correspond to the known historical operational states of the Centro region during those seasons. If a period known to have been operationally stable produces a Fragile classification from CIS, the calibration values need review. This is a validation of the calibration, not a validation of CIS.

---

### 3. What is the minimum viable pilot that could begin within 30 days?

**The minimum viable pilot is a retrospective analysis of the 2023 fire season using publicly available data, with structurally-estimated calibration, weekly observation windows, and a single analyst.**

Everything required is available today, without institutional partnerships, without the 2026 DECIR, and without `synchronizationTimingTolerance` data.

**What this minimum pilot does:**

- **Period:** June–September 2023 (the 2023 fire season, which had significant activity in the Centro region)
- **Data:** EFFIS archived fire danger data (publicly available for any historical date); IPMA archived Risco de Incêndio Rural daily maps; ANEPC published situation reports from 2023 (archived on prociv.pt); ICNF published fire statistics for 2023; FIRMS archived active fire detections
- **Calibration mode:** `structurally-estimated` (no DECIR values are needed — structural thresholds are used for all three calibratable parameters; all outputs carry the structurally-estimated flag and wider confidence bounds)
- **Observation frequency:** Weekly (17–18 observation windows across June–September 2023)
- **Synchronization dimension:** `missing` for all windows (no public coordination timing data available; the 3-of-5 rule accommodates one missing dimension)
- **Analyst:** 1 person (pilot coordinator doubles as analyst for the retrospective phase)

**30-day setup tasks:**

| Week | Task | Hours |
|------|------|-------|
| Week 1 | Collect all 2023 fire season data from public sources; organize in directory structure | 20 |
| Week 1–2 | Construct 17 weekly observations from the collected data; compute all five indicator values for each week | 30 |
| Week 2–3 | Run CIS analysis on all 17 observations chronologically; record all outputs | 15 |
| Week 3–4 | Analyst review of all outputs; compare state classifications against known 2023 events; write preliminary findings | 20 |
| **Total** | | **~85 hours** |

**What the minimum pilot produces:**
- 17 weekly CIS state assessments for the Centro region fire season 2023
- Anomaly detections across all observation windows
- Weak-signal clusters from accumulated anomaly history
- Trajectory estimates from week 3 onward (minimum 2 observations for trend analysis)
- Fragility accumulation estimates from week 3 onward (bufferHistory ≥ 3 observations)
- Load displacement analysis is not available in the minimum pilot — it requires separate source/recipient observation histories, and the 2023 public data is not sufficiently detailed to construct separate subsystem histories

**What the minimum pilot cannot produce (and what that means):**
- `domain-confirmed` calibration — all outputs are `structurally-estimated`; this is disclosed in every output, not hidden
- `synchronization` dimension values — missing in all windows; 4-of-5 dimensional coverage
- Load displacement candidates — insufficient subsystem data
- Real-time relevance — this is a retrospective reconstruction, not an operational output

**Value of the minimum pilot:**
- Tests the observation construction workflow end-to-end
- Validates that the five indicator mappings produce plausible values for the wildfire domain
- Tests whether CIS state classifications correspond to the known 2023 operational history of the Centro region
- Identifies which indicator dimensions are most data-constrained (likely synchronization)
- Produces a preliminary assessment of whether the indicator mapping is sensible before committing to the prospective monitoring phase
- Requires no institutional partnerships, no DECIR access, no new data agreements
- Can begin within 5 working days of deciding to proceed

**The 30-day minimum viable pilot is a retrospective calibration exercise as much as it is a CIS evaluation.** Its primary output is not the 2023 state assessment history — it is the evidence that the mapping works and the identification of what additional calibration is needed before the prospective 2026 fire season monitoring begins.

---

*CIS Portugal Wildfire Pilot v1.0 — 2026-05-30*
*Operational pilot definition for Centro region wildfire early-warning and fragility monitoring using the existing CIS diagnostics engine. No engine modifications. No new diagnostic capabilities. All pilot outputs are advisory.*
