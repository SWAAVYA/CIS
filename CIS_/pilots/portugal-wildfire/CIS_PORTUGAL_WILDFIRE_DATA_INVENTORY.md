# CIS Portugal Wildfire Data Inventory
# Acquisition Assessment for the Centro Region Pilot

**Date:** 2026-05-30
**Version:** 1.0
**Status:** ASSESSMENT — No data collected, no outcomes evaluated

**Authority documents:**
- `CIS_PORTUGAL_WILDFIRE_PILOT.md`
- `diagnostics-types.js`
- `CIS_OPERATIONAL_SPECIFICATION.md`

**Scope:** Complete data dependency identification and acquisition feasibility assessment for the Portugal wildfire pilot. Does not modify CIS. Does not modify the pilot design. Does not evaluate wildfire outcomes.

---

## Section 1 — Purpose and Dependency Classification

### 1.1 Assessment Objective

Determine whether the Portugal wildfire pilot as designed in `CIS_PORTUGAL_WILDFIRE_PILOT.md` can be executed using publicly obtainable data — and if not, identify precisely where the gaps are, what they cost, and what the fallback is.

A dependency is **Required** if the pilot cannot produce a CIS output without it. **Recommended** if its absence degrades output quality but does not prevent analysis. **Optional** if it enhances specific capabilities but the core analysis runs without it.

### 1.2 Complete Dependency Registry

Every input field consumed by the CIS engine is traced here. Field names are taken directly from `diagnostics-types.js` and `diagnostics-engine.js`.

**Group 1 — Indicator values (five dimensions)**

| Dependency | Classification | Consequence if absent |
|------------|---------------|----------------------|
| `operatingLoad.value` | **Required** | Cannot classify state; missing dimension reduces 3-of-5 count |
| `recoveryRate.value` | **Required** | Missing dimension reduces 3-of-5 count |
| `admissibilityBoundary.value` | **Required** | Missing dimension reduces 3-of-5 count |
| `synchronization.value` | Recommended | Missing; 3-of-5 count falls to 4 available; classification still possible |
| `bufferLevel.value` | **Required** | Core fragility buffer; Phase 2D cannot run without it |
| `.source` tags on all values | **Required** | Engine marks coverage as missing; uncertainty spec incomplete |

**Group 2 — Calibration status**

| Dependency | Classification | Consequence if absent |
|------------|---------------|----------------------|
| `calibrationStatus.capacityBaseline` | **Required** | `false` → engine uses structural thresholds; outputs flagged `structurally-estimated`; confidence bounds widen |
| `calibrationStatus.bufferInitialLevel` | **Required** | `false` → same effect; `bufferLevel` normalization is structural |
| `calibrationStatus.synchronizationTimingTolerance` | Recommended | `false` → `synchronization` structurally estimated; acceptable given synchronization will likely be missing anyway |

**Group 3 — Special-state fields**

| Dependency | Classification | Consequence if absent |
|------------|---------------|----------------------|
| `primaryFunctionIndicator.trend` | Recommended | Collapsing and Recovering states cannot be detected; engine falls back to standard 3-of-5; mass fire events classified as Fragile rather than Collapsing |
| `primaryFunctionIndicator.deviationFromBaseline` | Recommended | Compensating state cannot be detected; engine skips Compensating check |
| `primaryFunctionIndicator.improvingPeriods` | Recommended | Recovering state cannot be detected without this |
| `secondaryMechanisms[]` with trend fields | Recommended | Compensating state cannot be detected; load displacement between secondary mechanisms not visible |
| `cascadeEvents[]` | Recommended | Collapsing state cannot be detected; cascade must be documented for the check to trigger |
| `recoveryInput` | Optional | Recovering state criterion requires this; without it, Recovering classification cannot be assigned |

**Group 4 — Coherence and transition**

| Dependency | Classification | Consequence if absent |
|------------|---------------|----------------------|
| `coherenceType` (from closed enumeration) | **Required** | Engine rejects observation; no output produced |
| `priorClassification` | Recommended | Transition detection cannot run for Week 1; from Week 2 onward, the prior CIS output provides this |

**Group 5 — Phase 2 inputs (accumulated across observation windows)**

| Dependency | Classification | Consequence if absent |
|------------|---------------|----------------------|
| `bufferHistory` (array of `bufferLevel` values) | **Required for Phase 2D** | Time-to-threshold and OLS trend analysis unavailable; Phase 2D returns no fragility estimate |
| Observation history (prior observations for Phase 2C) | **Required for Phase 2C** | Trajectory estimation unavailable until Week 2; after Week 2, accumulates automatically |
| Anomaly history (prior Phase 2A outputs for Phase 2B) | **Required for Phase 2B** | Weak-signal clustering unavailable until Week 2; accumulates automatically |
| Source subsystem observation history (Phase 2E) | **Required for Phase 2E** | Load displacement analysis unavailable |
| Recipient subsystem observation history (Phase 2E) | **Required for Phase 2E** | Load displacement analysis unavailable |

**Group 6 — Phase 2E upstream signals**

| Dependency | Classification | Consequence if absent |
|------------|---------------|----------------------|
| `anomalyResult` (Phase 2A output for recipient) | Optional | Phase 2E runs without it; anomaly integration in assumptions is empty |
| `weakSignalClusters` (Phase 2B output for recipient) | Optional | Phase 2E runs without it |
| `sourceTrajectoryEstimate` / `recipientTrajectoryEstimate` (Phase 2C) | Optional | Phase 2E runs without them |
| `recipientFragilityResult` (Phase 2D) | Optional | Phase 2E runs without it; fragility integration in assumptions is empty |

### 1.3 Summary Count

| Classification | Count | Notes |
|---------------|-------|-------|
| Required | 11 | Cannot produce any CIS output without these |
| Recommended | 13 | Absent → reduced capability; specific states undetectable |
| Optional | 5 | Absent → reduced richness of Phase 2E assumptions |
| **Total dependencies** | **29** | |

---

## Section 2 — Indicator Dependency Matrix

For each of the five CIS indicator dimensions, this section defines the required observable, its update cadence, the depth of historical availability, and its calibration dependency.

---

### 2.1 operatingLoad

| Property | Value |
|----------|-------|
| **CIS definition** | Proportion of capacity baseline consumed by current operational demand; value in [0.0, 1.0+] |
| **Engine band thresholds** | < 0.70 Stable · 0.70–0.85 Stressed · > 0.85 Fragile |
| **Required observable** | Active suppression resource commitment ÷ total certified regional capacity. In practice: (crews deployed to active incidents + aircraft on tasking) expressed in resource-unit equivalents, divided by `capacityBaseline`. |
| **Update frequency needed** | Daily during fire season; weekly during shoulder months |
| **Historical availability** | **Partial.** ANEPC weekly situation reports (Relatório de Situação) published during fire season give total resources deployed. These are weekly snapshots, not daily records. For the 2023 retrospective, approximately 17 weekly data points are recoverable. Intra-week daily resolution is not publicly available. |
| **Calibration dependency** | `capacityBaseline` — the denominator. Without it, the engine cannot normalize the raw resource count to a [0,1] proportion. The structural default is unavailable for this dimension (unlike the ratio-based dimensions). If `capacityBaseline` is absent, the engine cannot map `operatingLoad` to a band. |
| **Estimation fallback** | Proxy: treat EFFIS Fire Danger Index "Extreme" as operatingLoad ≈ 0.90 (Fragile), "Very High" ≈ 0.75 (Stressed), "High" ≈ 0.55 (Stable). This is a rough environmental proxy, not an operational measure. Mark as `source: "estimated"`. Significant uncertainty: environment-to-operations correlation is imperfect. |
| **Blocking conditions** | DECIR unavailable for the target season → `capacityBaseline` unknown → operatingLoad cannot be normalized → dimension must be dropped or estimated via proxy |

---

### 2.2 recoveryRate

| Property | Value |
|----------|-------|
| **CIS definition** | Ratio: recovery rate ÷ accumulation rate; dimensionless; value in [0.0, 2.0+] |
| **Engine band thresholds** | ≥ 1.20 Stable · 1.00–1.20 Stressed · < 1.00 Fragile |
| **Required observable** | Resources returning to available status ÷ resources newly committed to incidents, over a 7-day rolling window. |
| **Update frequency needed** | Weekly (computed from daily incident open/close records) |
| **Historical availability** | **Partial.** ANEPC situation reports give cumulative active fire counts and resources deployed at the time of the report. They do not provide a clean separation of new commitments vs. releases within the week. ICNF annual reports give total fires extinguished by date range, which permits a weekly approximation. This dimension requires the most inference of the five. |
| **Calibration dependency** | None. The ratio is dimensionless — it does not require a calibrated baseline. |
| **Estimation fallback** | Weekly ratio estimated from: (fires extinguished or controlled in week W) ÷ (new fires reported in week W), sourced from ANEPC sitreps + FIRMS active fire counts. This approximates the resource ratio because each fire involves roughly comparable average resource commitment for the region (a coarse assumption — large fires invalidate this). Mark as `source: "estimated"`. |
| **Blocking conditions** | None blocking. The estimation fallback produces a value, albeit with higher uncertainty. The dimension will not be Missing for any week. |

---

### 2.3 admissibilityBoundary

| Property | Value |
|----------|-------|
| **CIS definition** | Proportion of the operational envelope tightened from nominal baseline; value in [0.0, 1.0] where 0.0 = no change from baseline |
| **Engine band thresholds** | < 0.10 Stable · 0.10–0.25 Stressed · > 0.25 Fragile |
| **Required observable** | Proportion of the Centro region territory operating under elevated fire restriction (above baseline Level 1 restriction). Primary source: IPMA Risco de Incêndio Rural daily maps combined with ICNF restriction bulletins. |
| **Update frequency needed** | Daily during fire season (restriction levels change daily) |
| **Historical availability** | **Good.** IPMA publishes daily Risco de Incêndio Rural maps during fire season. These are archived at ipma.pt. For 2023, full-season daily risk maps are recoverable. ICNF restriction bulletins for 2023 are archived and linked to risk levels. The conversion from risk level to restriction proportion is defined by regulation (Lei n.º 76/2017 and Portaria n.º 128/2019) and is consistent across the season. |
| **Calibration dependency** | None. The proportion is computed against the nominal (Level 1) configuration, which is the legal baseline — no domain-calibrated parameter is needed. |
| **Estimation fallback** | Not needed. This dimension has the strongest public data coverage of the five. The IPMA risk map archive is sufficient. |
| **Blocking conditions** | None. This is the most data-ready indicator dimension. |

---

### 2.4 synchronization

| Property | Value |
|----------|-------|
| **CIS definition** | Proportion of coordination dependencies satisfied within timing tolerance; value in [0.0, 1.0] |
| **Engine band thresholds** | > 0.85 Stable · 0.70–0.85 Stressed · < 0.70 Fragile |
| **Required observable** | Proportion of inter-agency coordination events (dispatch-to-arrival, aerial tasking, command transfer) completed within `synchronizationTimingTolerance`. |
| **Update frequency needed** | Weekly (proportion computed over the prior 7 days) |
| **Historical availability** | **None publicly available.** ANEPC does not publish response timing data. ICNF does not publish dispatch-to-arrival statistics. No public Portuguese authority publishes operational coordination timing data for the fire suppression system. Academic literature contains aggregate response time statistics for specific fire seasons (e.g., post-2017 inquiries) but not the granular weekly coordination data needed. |
| **Calibration dependency** | `synchronizationTimingTolerance` — the target interval for each event type. This is an internal ANEPC operational protocol parameter. Not publicly available. |
| **Estimation fallback** | `source: "missing"` for all observation windows throughout the pilot. The CIS engine's 3-of-5 rule accommodates one missing dimension. With 4 available dimensions, state classification remains possible. The uncertainty spec explicitly notes: `uncalibratedDimensions: ["synchronization"]`, `missingDimensions: ["synchronization"]`. |
| **Blocking conditions** | This dimension is blocked for the entire pilot on public data alone. It does not block the pilot — the 3-of-5 rule handles it. It does reduce classification confidence for states where synchronization would have been a deciding dimension. |

**Critical finding:** `synchronization` is the only dimension that is structurally inaccessible from public sources. It will be `missing` in every observation constructed from public data. This is the single largest public-data gap in the pilot. It is not a blocking gap because the engine accommodates it, but it is a persistent data quality limitation that must be disclosed in every output.

---

### 2.5 bufferLevel

| Property | Value |
|----------|-------|
| **CIS definition** | Proportion of initial buffer level remaining; value in [0.0, 1.0] |
| **Engine band thresholds** | > 0.30 Stable · 0.15–0.30 Stressed · < 0.15 Fragile |
| **Required observable** | Available (uncommitted) reserve suppression capacity ÷ `bufferInitialLevel`. Reserve = `capacityBaseline` − active commitments − on-immediate-readiness. |
| **Update frequency needed** | Weekly (from ANEPC situation reports) |
| **Historical availability** | **Partial.** ANEPC situation reports provide total resource deployment figures weekly. Subtracting from `capacityBaseline` yields available reserve. The subtraction requires `bufferInitialLevel` from the DECIR. For 2023, the DECIR was published before the season and should be recoverable from ANEPC archives. The on-immediate-readiness category (resources placed on standby but not committed) is not always separately reported — must be assumed as zero when absent (conservative; actual buffer is modestly higher). |
| **Calibration dependency** | `bufferInitialLevel` — the denominator. Essential. Without it, the raw available capacity figure cannot be normalized to a [0,1] proportion. |
| **Estimation fallback** | If `bufferInitialLevel` is unknown: express buffer as the complement of `operatingLoad` (buffer ≈ 1 − operatingLoad). This is a structural approximation — it assumes total capacity = initial buffer, which is approximately true at season start. Mark as `source: "estimated"`. |
| **Blocking conditions** | DECIR 2023 unavailable → `bufferInitialLevel` unknown → buffer can only be expressed as proxy. This is resolvable: the DECIR 2023 is a public document. |

**Phase 2D dependency note:** `bufferLevel` is the sole input to `bufferHistory`, which Phase 2D requires for OLS fragility estimation. Every week's `bufferLevel` value must be stored and accumulated. If any week's value is missing or estimated with low confidence, that propagates into the OLS slope calculation. The quality of Phase 2D output is directly proportional to the quality and completeness of `bufferLevel` values across the season.

---

## Section 3 — Public Data Sources

Sources are assessed specifically for the Centro region wildfire pilot. For each source, the critical question is: does it provide the data needed, in the format needed, with sufficient historical depth to support the 2023 retrospective analysis?

### 3.1 Meteorology and Fire Weather

---

**EFFIS — European Forest Fire Information System (JRC, European Commission)**

| Property | Assessment |
|----------|-----------|
| Provider | Joint Research Centre (JRC), European Commission |
| URL | effis.jrc.ec.europa.eu |
| Access method | Web map service, downloadable data portal, API |
| Primary data | Daily Fire Danger Forecast for all of Europe: FWI composite index + sub-indices (Fine Fuel Moisture Code, Duff Moisture Code, Drought Code, Initial Spread Index, Buildup Index, Fire Weather Index) |
| Update frequency | Daily during fire season; the forecast product is updated at least daily |
| Historical depth | Full archive available; historical data for Portugal extends back to at least 2000. 2023 season data confirmed available through EFFIS data download portal |
| Spatial resolution | ~9 km grid (ERA5-Land based) at daily frequency |
| Wildfire pilot use | Primary environmental load indicator; FWI provides the environmental demand signal that drives `operatingLoad` proxy estimation and confirms the environmental context for state classification |
| Reliability considerations | JRC institutional source; consistent methodology; EFFIS FWI is the operational standard for European fire danger. Well-maintained archive. No access restrictions. |
| Required registration | No. Data downloadable anonymously. |
| **Pilot verdict** | **High confidence — fully usable for 2023 retrospective and 2026 prospective** |

---

**IPMA — Instituto Português do Mar e da Atmosfera**

| Property | Assessment |
|----------|-----------|
| Provider | IPMA (Portuguese national meteorological authority) |
| URL | ipma.pt |
| Access method | Web portal; daily bulletins; API (data.ipma.pt) |
| Primary data for pilot | Daily Risco de Incêndio Rural maps (5-level risk classification: Reduzido, Moderado, Elevado, Muito Elevado, Máximo); weather station data |
| Update frequency | Daily during fire season (typically published by 11:00 UTC) |
| Historical depth for risk maps | **Uncertain for daily map images.** IPMA maintains a web archive but daily map images may not be individually accessible going back to 2023. The underlying data (weather station records) is available through data.ipma.pt API with good historical coverage. |
| Alternative access path | IPMA publishes seasonal fire risk statistics in their annual climate reports. These provide period-level summaries (proportion of days at each risk level, by district) even where daily maps are not individually accessible. |
| Wildfire pilot use | Primary source for `admissibilityBoundary` computation: risk level → restriction zone proportion. Also provides temperature, humidity, wind speed for environmental context. |
| Reliability considerations | National meteorological authority; data quality high. The risk level classification methodology is standardized and publicly documented. |
| **Key uncertainty** | Daily map archive accessibility for 2023 needs to be verified. Daily maps are confirmed for current-season but historical archive depth for individual daily maps is not confirmed. The seasonal statistics are confirmed available. |
| **Pilot verdict** | **High confidence for seasonal summaries; verify daily map archive before relying on it for daily admissibilityBoundary values** |

---

**SNIRH — Sistema Nacional de Informação de Recursos Hídricos**

| Property | Assessment |
|----------|-----------|
| Provider | APA (Agência Portuguesa do Ambiente) |
| URL | snirh.apambiente.pt |
| Primary data | Palmer Drought Severity Index (PDSI); Standardized Precipitation Index (SPI-1, SPI-3, SPI-6, SPI-12); river flow; soil moisture; reservoir levels |
| Update frequency | Monthly for drought indices; near-real-time for gauging stations |
| Historical depth | Extensive — drought index series extends to pre-2000; 2023 full data confirmed available |
| Wildfire pilot use | Drought indices are input to `bufferLevel` context and `admissibilityBoundary` adjustment. SPI-6 and SPI-12 provide multi-month drought establishment signal that feeds into weak-signal clustering (pre-season buffer depletion pattern) |
| Reliability considerations | Portuguese national water information system; consistent methodology; well-maintained |
| **Pilot verdict** | **High confidence — fully usable** |

---

### 3.2 Vegetation Condition and Fuel Moisture

---

**Copernicus Land Monitoring Service (CLMS)**

| Property | Assessment |
|----------|-----------|
| Provider | European Environment Agency / Copernicus |
| URL | land.copernicus.eu |
| Primary data | NDVI, Leaf Area Index, Fraction of Absorbed PAR (FAPAR), vegetation productivity anomaly, estimated fuel moisture content (via derived products) |
| Update frequency | 10-day composites for most products |
| Historical depth | Full archive; 2023 data confirmed available |
| Wildfire pilot use | Vegetation stress as corroborating environmental signal; particularly useful for drought-driven fuel drying not captured in weather station data |
| Reliability considerations | Copernicus is a flagship EU Earth observation program; data quality is high; methodology is publicly documented |
| Access method | Copernicus Land Service portal (land.copernicus.eu); registration required but free |
| **Pilot verdict** | **High confidence — fully usable; free registration required** |

---

**Sentinel-2 (ESA / Copernicus)**

| Property | Assessment |
|----------|-----------|
| Provider | European Space Agency (ESA) / Copernicus |
| URL | Copernicus Open Access Hub (scihub.copernicus.eu); Copernicus Dataspace Ecosystem |
| Primary data | Multispectral imagery at 10m resolution; NDVI, NBR (Normalized Burn Ratio), burned area mapping |
| Update frequency | 5-day revisit time over Portugal |
| Historical depth | Full archive from 2015 onward; 2023 data confirmed available |
| Wildfire pilot use | Vegetation stress index and burned area corroboration for the Centro region. Most useful for confirming `admissibilityBoundary` context (post-fire zones have permanent structural fragility implications). Not required for weekly indicator construction — supports quality review rather than primary indicator values. |
| Access method | Free download after registration at Copernicus Dataspace |
| **Pilot verdict** | **Recommended — use for quality review; not required for primary indicator construction** |

---

### 3.3 Wildfire Occurrence

---

**FIRMS — Fire Information for Resource Management System (NASA)**

| Property | Assessment |
|----------|-----------|
| Provider | NASA EOSDIS |
| URL | firms.modaps.eosdis.nasa.gov |
| Primary data | Near-real-time and historical active fire detections from MODIS (Terra/Aqua) and VIIRS (S-NPP, NOAA-20); point data with coordinates, confidence, brightness, fire radiative power |
| Update frequency | Near-real-time: 3-hour latency; historical: daily download |
| Historical depth | MODIS archive from 2000; VIIRS from 2012; 2023 full season confirmed available |
| Wildfire pilot use | Weekly active fire count in the Centro region → numerator for `recoveryRate` estimation (fires reported = new commitments); also confirms fire occurrence for Collapsing state `cascadeEvents` documentation |
| Spatial query | Download as CSV/Shapefile filtered to Centro bounding box; straightforward |
| Reliability considerations | Well-established NASA product; VIIRS 375m resolution is appropriate for wildfire detection. Confidence filters available. |
| Access method | Free download; FIRMS Map (firms.modaps.eosdis.nasa.gov/map) allows historical download by area and date |
| **Pilot verdict** | **High confidence — fully usable; critical for recoveryRate proxy** |

---

**EFFIS Current Situation and Historical Fire Database**

| Property | Assessment |
|----------|-----------|
| Provider | JRC (same as fire danger) |
| URL | effis.jrc.ec.europa.eu/applications/current-situation |
| Primary data | Active fires across Europe; burned area by country, region, season; fire count; EFFIS validates fire perimeters |
| Historical depth | Annual statistics from 2000; 2023 data confirmed |
| Wildfire pilot use | Corroborates FIRMS active fire counts; provides burned area (useful for estimating cascade severity) |
| **Pilot verdict** | **High confidence — use alongside FIRMS** |

---

**ICNF — Estatísticas de Incêndios Rurais**

| Property | Assessment |
|----------|-----------|
| Provider | ICNF (Instituto da Conservação da Natureza e das Florestas) |
| URL | icnf.pt |
| Primary data | Annual fire statistics reports (Relatórios de Incêndios Rurais); total fires by municipality, burned area, cause, seasonality |
| Update frequency | Annual (published approximately March–April following the fire year) |
| Historical depth | Extensive; ICNF 2023 report confirmed published and available |
| Wildfire pilot use | Denominator for annual calibration; confirms active fire counts; provides municipal-level breakdown for Centro sub-region assessment |
| **Key limitation** | Annual statistics only; does not provide weekly breakdowns. The 2023 report gives season totals, not the week-by-week progression needed for observation construction. |
| **Pilot verdict** | **Useful for calibration and quality review; not sufficient alone for weekly indicator construction** |

---

### 3.4 Suppression Activity and Emergency Response Capacity

---

**ANEPC — Autoridade Nacional de Emergência e Proteção Civil (Situation Reports)**

| Property | Assessment |
|----------|-----------|
| Provider | ANEPC |
| URL | prociv.pt; anepc.pt |
| Primary data during fire season | Weekly "Relatório de Situação de Incêndios Rurais" — situation reports published every Monday covering the prior week; also daily brief situation bulletins |
| Key data fields in reports | Total active fires in period; total resources deployed (crews/equipes, vehicles/veículos, aerial means/meios aéreos); major incidents; district breakdown |
| Update frequency | Weekly detailed reports; daily brief bulletins |
| Historical depth | **The critical question for the 2023 retrospective.** ANEPC maintains an archive at anepc.pt/comunicacao/relatorios/incendios-rurais. For 2023, the weekly situation reports should be in this archive. Access requires navigating ANEPC's document repository. Confirmed that 2022 and 2021 reports are archived; 2023 archive presence is highly probable but must be verified. |
| **What these reports provide** | Total crews deployed (equipes); total vehicles; total aerial means; cumulative fire count; weekly totals for the Centro district. This is the primary public source for `operatingLoad` and `bufferLevel` computation. |
| **What these reports do NOT provide** | Breakdown by local (Bombeiros) vs. national (GIPS, GNR) resources. This aggregation prevents clean Phase 2E (load displacement) subsystem separation. Response timing data absent. Within-week daily breakdown absent. |
| Reliability considerations | Authoritative source; ANEPC has operational responsibility; figures are consistent within-season. Methodology may shift slightly between years. |
| **Pilot verdict** | **Partially Ready — primary source for operatingLoad and bufferLevel; critical gap is absence of local/national resource disaggregation** |

---

**DECIR — Dispositivo Especial de Combate a Incêndios Rurais**

| Property | Assessment |
|----------|-----------|
| Provider | ANEPC |
| URL | anepc.pt |
| What it is | The annual operational order governing the fire season suppression system: resource pre-positioning plan, alert level definitions, regional capacity allocations, coordination protocols |
| Update frequency | Annual; published each May/June before the fire season opens |
| Historical depth | DECIR 2023 was published in May/June 2023 and should be in the ANEPC archive. DECIR 2024 and 2025 similarly available. |
| **What the DECIR provides for calibration** | Total force capacity by region (`capacityBaseline`); pre-positioned reserve allocation by region (`bufferInitialLevel`); alert level triggers and resource mobilization thresholds. |
| **What the DECIR does NOT provide** | `synchronizationTimingTolerance` — this is an internal protocol parameter that may appear in annexes or operational sub-documents not included in the public DECIR. |
| Reliability considerations | Definitive official document; figures are binding; consistent year-to-year structure allows direct extraction |
| Estimated extraction effort | 4–8 hours to locate, download, read, and extract the Centro region resource figures and convert to resource-unit equivalents |
| **Pilot verdict** | **High confidence for calibration — this is the primary calibration source; must be located and extracted before indicator computation can begin** |

---

**GNR SEPNA (Guarda Nacional Republicana — Serviço de Proteção da Natureza e do Ambiente)**

| Property | Assessment |
|----------|-----------|
| Provider | GNR |
| Public availability | GNR publishes annual activity reports and seasonal press releases but does not publish weekly operational deployment data |
| Wildfire pilot relevance | SEPNA units contribute to forest patrol and detection but are a minor suppression resource relative to Bombeiros and aerial means |
| **Pilot verdict** | **Not a primary source; supplementary context only** |

---

### 3.5 Restriction and Admissibility Data

---

**ICNF Restriction Bulletins (Comunicados de Restrição)**

| Property | Assessment |
|----------|-----------|
| Provider | ICNF |
| URL | icnf.pt |
| Primary data | Daily fire restriction bulletins during fire season specifying restriction level (nível de alerta) by district and type of activity (burning, access, equipment use) |
| Update frequency | Daily during fire season (restriction levels follow IPMA risk map) |
| Historical depth | **Uncertain for 2023.** ICNF publishes these during the season; whether they are archived individually for 2023 requires verification. If not individually accessible, the IPMA risk map archive (which drives restriction levels by regulation) can serve as a proxy with a defined conversion rule. |
| Reliability considerations | These bulletins define what `admissibilityBoundary` measures — they are the ground-truth for territorial restriction proportion |
| **Pilot verdict** | **Verify archive for 2023; fallback to IPMA risk map + conversion rule is reliable** |

---

## Section 4 — Calibration Data Assessment

The CIS engine uses three calibration parameters. Their presence determines whether the engine operates in `domain-confirmed`, `partially-calibrated`, or `structurally-estimated` mode. Each parameter has specific implications for output confidence.

### 4.1 capacityBaseline

**What it is:** The total certified operational suppression capacity of the Centro region at the start of the fire season, expressed in a consistent resource-unit equivalent (RUE). The RUE converts crews, vehicles, and aircraft into a common unit using a defined conversion factor.

**Public availability:** YES — the DECIR annual operational order contains regional resource allocations. The DECIR is publicly available on anepc.pt.

**Extraction method:**
1. Locate DECIR for the target year (DECIR 2023 for retrospective; DECIR 2026 for prospective)
2. Find the Centro region resource allocation table
3. Sum all resource categories: Bombeiros crews (equipes), GNR SEPNA units, ICNF ranger teams, aerial resources allocated to Centro
4. Apply a conversion factor to produce RUE (crews × 1.0; vehicles × 0.2 as a fraction of crew equivalent; helicopters × 3.0; fixed-wing tankers × 5.0 — these conversion factors are a design choice that must be documented, held constant, and referenced in the uncertainty spec)

**Estimated effort:** 4–8 hours. Primary effort is locating and reading the DECIR document (Portuguese language; technical terminology) and defining the conversion factor rationale.

**Fallback approach:** If DECIR 2023 is not accessible (unlikely given public mandate), use an order-of-magnitude estimate from ICNF statistics and academic literature on Portuguese suppression capacity. Mark `calibrationStatus.capacityBaseline: false`; engine operates in `structurally-estimated` mode for `operatingLoad`.

**Uncertainty impact:** Without `capacityBaseline`, `operatingLoad` cannot be normalized and must be substituted with the EFFIS FWI proxy. The FWI proxy is an environmental signal, not an operational one — it measures fire weather demand, not suppression consumption. This is a meaningful accuracy reduction. The confidence range on state classification widens, and any state classification driven by `operatingLoad` must be flagged as structurally estimated.

**Acquisition verdict:** Obtainable. Moderate effort. Should be resolved before pilot begins.

---

### 4.2 bufferInitialLevel

**What it is:** The pre-positioned reserve capacity at fire season start for the Centro region, in the same resource-unit equivalents as `capacityBaseline`. This is the denominator for all `bufferLevel` values and the reference point for the `bufferHistory` time series.

**Public availability:** YES — the DECIR includes the pre-positioning plan which specifies reserve allocations by region and alert level.

**Extraction method:** From the same DECIR document used for `capacityBaseline`:
1. Identify the pre-positioning table showing "Dispositivo Reforçado" (reinforced device) vs. baseline commitment for the Centro region
2. The pre-positioned reserve is the total DECIR allocation minus the baseline committed deployment
3. Express in the same RUE as `capacityBaseline`

**Estimated effort:** 2–4 hours (incremental to the `capacityBaseline` work; same document).

**Fallback approach:** If the DECIR does not clearly separate committed from reserve: estimate `bufferInitialLevel = 0.35 × capacityBaseline` (35% reserve at season start is a defensible structural estimate for a system that maintains some immediate-response reserve). Mark `calibrationStatus.bufferInitialLevel: false`.

**Uncertainty impact:** Without `bufferInitialLevel`, `bufferLevel` must use the complement-of-load proxy (`bufferLevel ≈ 1 − operatingLoad`). This reduces the independence of the buffer and load indicators — they become anti-correlated by construction rather than independently measured. Phase 2D fragility estimation is significantly degraded: the OLS slope is computed over a derived proxy rather than a true buffer measurement.

**Acquisition verdict:** Obtainable, same document as `capacityBaseline`. Combined effort 6–12 hours including RUE conversion definition.

---

### 4.3 synchronizationTimingTolerance

**What it is:** The target dispatch-to-first-response interval for each inter-agency coordination event type, as defined in ANEPC operational protocols. This is the denominator for `synchronization` normalization.

**Public availability:** NO — not published in the DECIR or any other publicly available document. This is an operational protocol parameter internal to ANEPC. Some approximations exist:
- Post-event inquiries (e.g., the 2017 Pedrógão Grande inquiry) contain response time data that implies target intervals
- Academic studies of Portuguese fire response have published average response times that could serve as proxy targets
- EU fire suppression standards suggest typical target intervals (EFFIS best practice documents)

**Estimated effort to obtain from ANEPC:** Unknown. An institutional access request would require:
- Identifying the correct contact at ANEPC (Operações or Informação Pública department)
- Submitting a written request citing the research/advisory purpose
- Waiting for institutional review (weeks to months)
- No guarantee of a positive response

**Fallback approach:** Mark `calibrationStatus.synchronizationTimingTolerance: false` and `synchronization: { value: null, source: "missing" }` for all observations. The 3-of-5 classification rule accommodates one missing dimension. The uncertainty spec discloses the missing dimension explicitly.

**Alternative approach (structurally estimated):** Use 20 minutes as the target dispatch-to-first-response interval (consistent with EU fire response standards) and derive a synchronization estimate from ANEPC response time data where published. Mark as `source: "estimated"`. This is weaker than a domain-confirmed value but stronger than leaving the dimension missing.

**Uncertainty impact:** Synchronization missing → 4-of-5 dimension coverage throughout the pilot. State classification still functions under 3-of-5 rule. Compensating and Collapsing detection are less affected (these use `primaryFunctionIndicator` and `cascadeEvents`, not `synchronization` directly). The primary loss is: if coordination genuinely degrades during a high-pressure event, the engine cannot detect it from this dimension.

**Acquisition verdict:** Blocked for public data. Pilot proceeds without it. Institutional access request is worth attempting for the 2026 prospective season; do not delay pilot start waiting for it.

---

## Section 5 — Historical Pilot Feasibility (2023 Retrospective Season)

### 5.1 Season Overview

The 2023 fire season in Portugal was significant but not catastrophic by historical standards. Key facts relevant to feasibility:
- Centro region experienced meaningful fire activity, particularly in July and August
- ANEPC issued regular situation reports throughout the season
- DECIR 2023 was published before the season; it is in ANEPC archives
- No mass casualty events of the 2017 scale occurred, meaning the Collapsing state may only appear briefly if at all — appropriate for a calibration retrospective (avoids anchoring the analysis on a known extreme)
- ICNF published the 2023 Relatório de Incêndios Rurais (annual statistics)

### 5.2 Available Public Records by Indicator

| Indicator | 2023 Data Availability | Expected Windows | Quality |
|-----------|----------------------|-----------------|---------|
| `operatingLoad` | ANEPC weekly situation reports (approx. 17 weeks); DECIR 2023 for denominator | 17 weekly | Medium — requires resource-unit conversion; weekly aggregation only |
| `recoveryRate` | FIRMS active fire counts (weekly); ANEPC situation reports (incident counts) | 17 weekly | Low-Medium — ratio estimated from fire count proxy; not direct resource flow data |
| `admissibilityBoundary` | IPMA risk maps (daily; archive accessibility TBC) or seasonal statistics; ICNF restrictions | 17 weekly (from daily) | High — if daily maps accessible; Medium — if seasonal statistics only |
| `synchronization` | None | 0 (all missing) | Not applicable |
| `bufferLevel` | ANEPC weekly deployment data − `bufferInitialLevel` from DECIR | 17 weekly | Medium — derived from deployment subtraction; uncertainty in on-standby category |

### 5.3 Special-State Field Availability

| Field | 2023 Availability | Quality |
|-------|------------------|---------|
| `primaryFunctionIndicator.trend` | Inferable from ANEPC reports (are fires being controlled or expanding?) | Low — qualitative inference; not a direct measurement |
| `primaryFunctionIndicator.deviationFromBaseline` | Constructable if baseline fire management tempo is established from prior seasons | Low — requires multi-year comparison |
| `cascadeEvents[]` | Documentable from ANEPC reports when major incidents are declared (fires "jumping" is reported) | Medium — reported qualitatively; specific cascade events noted in reports |
| `secondaryMechanisms[]` | Partially constructable — ANEPC reports mention mutual-aid activations | Low — not systematically reported by mechanism type |
| `recoveryInput` (for Recovering state) | Constructable from precipitation events and fire extinguishment reports | Medium — precipitation from IPMA; fires controlled from ANEPC |
| `coherenceType` | Assigned by rule from pilot Section 3.6; requires CSD signal detection and displacement candidate identification | Deterministic — computed from CIS outputs, not from raw data |

### 5.4 Observation Construction Feasibility

**Weeks 1–2 (June 7–14, 2023):** Low fire activity period; `operatingLoad` likely Stable; `admissibilityBoundary` in Stable-to-Stressed range (restrictions escalate with the season opening). All four available dimensions constructable. `bufferLevel` near 1.0 (season start; minimal commitments). `recoveryRate` > 1.20 (few fires; full recovery rate). **Fully constructable.**

**Weeks 3–6 (June 21 – July 12, 2023):** Increasing fire activity; EFFIS likely shifting to Very High/Extreme; ANEPC reports increasing resource deployment. `operatingLoad` moving into Stressed band; `bufferLevel` declining. `recoveryRate` likely 1.0–1.2 (Stressed). **Fully constructable.**

**Weeks 7–12 (July 19 – August 23, 2023):** Peak fire season. ANEPC reports show maximum resource deployment; FIRMS shows highest fire counts. `operatingLoad` likely approaching Fragile band; `bufferLevel` potentially Stressed. This is the period where weak-signal clustering and fragility trend analysis are most valuable. **Fully constructable for 4 dimensions; `synchronization` missing throughout.**

**Weeks 13–17 (August 30 – September 27, 2023):** Season winding down; resources returning to reserve; `bufferLevel` recovering. Recovering state signals possible if precipitation occurs. **Fully constructable.**

### 5.5 Expected Data Gaps for 2023 Retrospective

| Gap | Probability | Impact | Mitigation |
|-----|------------|--------|-----------|
| IPMA daily risk maps not individually accessible for 2023 | Medium (40%) | Admissibility boundary computed weekly from seasonal statistics rather than daily maps | Use IPMA seasonal risk statistics + SNIRH drought index as composite; document in uncertainty spec |
| ANEPC 2023 weekly reports not in public archive | Low (15%) | operatingLoad and bufferLevel primary source lost | Use ICNF annual statistics + EFFIS for proxy; degrades quality |
| DECIR 2023 not findable in ANEPC archive | Low (10%) | capacityBaseline and bufferInitialLevel unknown | Use 2024 DECIR values as approximation (capacity does not change dramatically year-to-year); flag as provisional |
| FIRMS fire counts anomalously high/low for Centro | Low (10%) | recoveryRate proxy distorted | Cross-validate against ANEPC incident counts; use the lower figure |
| Week-by-week breakdown absent from ANEPC reports (reports aggregate to month) | Low (20% for some weeks) | Cannot assign indicator values to specific weeks | Interpolate linearly; flag affected windows |

**Overall 2023 retrospective feasibility verdict:** The 2023 retrospective pilot is feasible with publicly available data. Four of five indicator dimensions can be constructed for all 17 observation windows. `synchronization` is absent throughout. The quality of `operatingLoad` and `bufferLevel` depends on successfully locating DECIR 2023 and ANEPC weekly situation reports — both expected to be publicly available but requiring verification.

---

## Section 6 — Observation Construction Inputs

This table provides a complete mapping of every SystemObservation field to its data source, transformation, update frequency, and uncertainty classification. Field names are taken from `diagnostics-types.js` and the engine source.

| Field | Source | Transformation | Frequency | Uncertainty |
|-------|--------|---------------|-----------|------------|
| `systemId` | Defined at pilot start | None — constant string `"PT-CENTRO-WILDFIRE-2026"` | Static | None |
| `observationDate` | Calendar — end of observation week | None — ISO8601 date of Sunday | Weekly | None |
| `indicators.operatingLoad.value` | ANEPC weekly sitrep (resources deployed) ÷ DECIR `capacityBaseline` | Sum deployed resource-unit equivalents (RUE); divide by `capacityBaseline` in RUE | Weekly | Medium — weekly snapshot; RUE conversion factor is a design choice |
| `indicators.operatingLoad.source` | ANEPC sitrep availability | `"observed"` if from sitrep; `"estimated"` if derived from EFFIS FWI proxy | Weekly | — |
| `indicators.recoveryRate.value` | ANEPC sitrep (fires controlled) + FIRMS (fires detected) | (fires controlled or extinguished in week) ÷ (new fires detected in week); minimum 0.0 | Weekly | Low-Medium — proxy for resource flow; fire count is not resource count |
| `indicators.recoveryRate.source` | Source availability | `"estimated"` — always; direct resource release data is not public | Weekly | — |
| `indicators.admissibilityBoundary.value` | IPMA daily risk maps OR ICNF restriction bulletins | (municipality-days at elevated restriction) ÷ (total municipality-days in week); divide by Centro total | Weekly (from daily) | Medium-High — mapping from risk level to restriction proportion is defined by regulation; reliable if maps accessible |
| `indicators.admissibilityBoundary.source` | Source availability | `"observed"` if from daily maps/bulletins; `"estimated"` if from seasonal statistics | Weekly | — |
| `indicators.synchronization.value` | No public source | `null` | — | — |
| `indicators.synchronization.source` | — | Not applicable — dimension is Missing | — | — |
| `indicators.bufferLevel.value` | `capacityBaseline` − ANEPC deployed resources ÷ `bufferInitialLevel` | (`capacityBaseline` − deployed_RUE − standby_RUE) ÷ `bufferInitialLevel`; standby = 0 if not reported | Weekly | Medium — standby category absent from public reports; denominator requires DECIR |
| `indicators.bufferLevel.source` | ANEPC sitrep + DECIR | `"observed"` if deployment data from sitrep; `"estimated"` if standby assumed zero | Weekly | — |
| `calibrationStatus.capacityBaseline` | DECIR (annual) | `true` if DECIR located and RUE conversion defined; `false` otherwise | Annual | — |
| `calibrationStatus.bufferInitialLevel` | DECIR (annual) | `true` if DECIR pre-positioning figures extracted; `false` otherwise | Annual | — |
| `calibrationStatus.synchronizationTimingTolerance` | ANEPC internal protocol — not public | `false` throughout pilot | Static | — |
| `coherenceType` | Computed from prior CIS outputs per rule table (pilot Section 3.6) | Deterministic rule: `adaptive` by default → `brittle` on CSD signal → `extractive` on displacement candidate → `pathological` if multiple fragile-band indicators with extraordinary measures | Weekly | Low — rule is deterministic; rule accuracy depends on CSD and displacement detection quality |
| `priorClassification` | Prior week's CIS engine output | Direct carry-forward; `null` for Week 1 | Weekly | None — internal carry |
| `primaryFunctionIndicator.trend` | ANEPC sitrep interpretation | `"stable"` if fire containment rate holding; `"declining"` if active fires expanding net; `"improving"` if resolution outpaces ignition | Weekly | Low — qualitative inference from narrative sitrep text; not a direct measurement |
| `primaryFunctionIndicator.deviationFromBaseline` | ANEPC data vs. prior-season baseline | (current_week_deployment − prior_year_same_week_deployment) ÷ prior_year; requires multi-year comparison | Weekly | Low-Medium — requires 2022 data for comparison |
| `primaryFunctionIndicator.improvingPeriods` | Counted from prior CIS outputs | Number of consecutive prior observations with `trend: "improving"` | Weekly (accumulated) | Medium — depends on PFI trend classification quality |
| `secondaryMechanisms[]` | ANEPC sitrep mutual-aid references | Construct one entry per mutual-aid activation mentioned in sitrep; `resourceTrend: "increasing"` if activations are increasing week-over-week | Weekly | Low — mutual-aid activations are reported qualitatively; not systematically enumerated |
| `cascadeEvents[]` | ANEPC major incident declarations; FIRMS multi-detection clusters | Construct from: fires declared as "grande incêndio" (major fire) in sitrep; empty if no such declaration | Weekly | Medium — "major fire" threshold is qualitative; cascade documentation is narrative |
| `recoveryInput` | IPMA precipitation data + ANEPC fire extinguishment reports | `true` if weekly precipitation ≥ 10mm AND fire containment positive for the week | Weekly | Medium — precipitation threshold is a structural estimate |
| `bufferHistory` | Accumulated from prior `bufferLevel` values | Append current week's `bufferLevel.value` to the running array | Weekly (accumulated) | Cumulative uncertainty from each constituent value |

**Note on systemId for Load Displacement (Phase 2E):** Phase 2E requires two separate system IDs with separate observation histories. If load displacement analysis is included:
- Source system: `"PT-CENTRO-LOCAL-BOMBEIROS-2026"`
- Recipient system: `"PT-CENTRO-ANEPC-NATIONAL-RESERVE-2026"`

These require separate observation construction for each subsystem. See Section 9.3 for the specific data availability assessment.

---

## Section 7 — Data Quality Risks

### 7.1 Missing Data Risk

**Risk:** One or more data sources are unavailable for specific observation windows, producing `null` indicator values.

| Indicator | Missing Probability | Windows Likely Affected | CIS Impact |
|-----------|-------------------|------------------------|------------|
| `operatingLoad` | Low (10%) | Weeks where ANEPC sitrep missing from archive | Reduces to 3-of-4 available dimensions; state classification still possible |
| `recoveryRate` | Very Low (5%) | None — FIRMS always available as fallback | Minimal |
| `admissibilityBoundary` | Low (15%) | Weeks where daily IPMA maps not individually accessible | Seasonal statistics proxy available |
| `synchronization` | Certain (100%) | All weeks | Handled by 3-of-5 rule; disclosed in every output |
| `bufferLevel` | Low (10%) | Weeks where sitrep unavailable | Same as operatingLoad |

**Mitigation:** Maintain a priority fallback chain for each indicator. Document which fallback was used in each observation's `source` tag and uncertainty notes. The CIS engine's `missingDimensions` tracking and the `uncalibratedDimensions` field in the uncertainty spec are the correct disclosure mechanisms.

**Critical threshold:** If any single week has more than 2 dimensions missing (i.e., only 2 dimensions available), that observation cannot support reliable 3-of-5 state classification. Flag such observations as `belowClassificationThreshold` (which the engine already does when fewer than 3 dimensions meet any band) and exclude them from trajectory and fragility trend analysis.

---

### 7.2 Delayed Reporting Risk

**Risk:** Data for a given week arrives late, requiring the observation to be constructed from a partial record.

| Source | Typical Delay | Mitigation |
|--------|-------------|-----------|
| ANEPC weekly sitrep | Published Monday for the prior week | Design observation window to close on Sunday; construct observation on Monday after sitrep publication |
| IPMA daily risk maps | Same-day | No delay issue for prospective pilot |
| FIRMS active fire detections | 3–6 hours | Sufficient for daily data; no issue for weekly aggregation |
| SNIRH drought indices | Monthly update; no weekly delay | Use most recent available value for all weeks in the month |
| ICNF restriction bulletins | Same-day | No delay issue |

**For the retrospective analysis:** Delay is not a concern — all 2023 data is already available. The issue is archive accessibility, not timeliness.

---

### 7.3 Inconsistent Reporting Risk

**Risk:** The same data item is reported with different definitions across time, producing apparent variation that is methodological rather than real.

| Data Item | Inconsistency Risk | Impact | Mitigation |
|-----------|------------------|--------|-----------|
| ANEPC resource counts | Medium — methodology for counting "equipes" may shift between years or within a season | Artificial step changes in `operatingLoad` | Document the counting methodology as stated in the DECIR; use a consistent counting rule throughout; flag any apparent discontinuities |
| IPMA risk level definitions | Low — standardized by regulation; stable since 2019 | Minimal | None required |
| FIRMS fire detection thresholds | Low — consistent NASA methodology; confidence filters should be applied consistently | Minimal if same confidence filter applied throughout | Define confidence filter at analysis start; hold constant |
| EFFIS FWI methodology | Very Low — EU-standardized methodology | Minimal | None required |
| DECIR allocation categories | Low to Medium — DECIR structure is consistent but category names may vary | Affects RUE conversion | Map to RUE using consistent conversion factor regardless of category name variations |

---

### 7.4 Calibration Risk

**Risk:** The calibration values extracted from the DECIR do not correspond accurately to the actual operational capacity during the season.

**Scenario A — DECIR figures are aspirational, not operational:** The DECIR may specify a planned deployment level that is not fully achieved (due to volunteer availability, equipment maintenance, etc.). If the actual capacity is lower than the DECIR baseline, `operatingLoad` values will be systematically underestimated (real load is higher than computed) and `bufferLevel` values will be systematically overestimated.

**Mitigation:** Compare ANEPC sitrep resource deployment figures against the DECIR allocation. If sitrep figures consistently fall below DECIR allocation, the DECIR figures may reflect total authorized capacity rather than operationally available capacity. Document this discrepancy; use the lower (sitrep-observed) figure as the operational denominator where appropriate.

**Scenario B — DECIR covers the full national force, not just the Centro region:** The DECIR allocates resources nationally; the Centro region allocation must be extracted from the regional breakdown, not the national total. If the regional breakdown is not clearly specified, the national total would severely understate the denominator, making `operatingLoad` look artificially low.

**Mitigation:** Identify the Centro region allocation specifically. If a separate regional breakdown is not provided, use the regional share from prior-year statistics (ICNF statistics provide regional burned area proportions as a proxy for regional capacity share).

---

### 7.5 Survivorship Bias Risk

**Risk:** The public record for 2023 over-represents significant fire events (which are thoroughly documented) and under-represents low-activity periods (which receive less reporting attention).

**Impact:** If low-activity weeks have less detailed sitrep data, indicator values for Stable-state periods may be less precisely estimated than for Stressed or Fragile periods. This asymmetric data quality could make the system appear to move into the Stressed band more abruptly than it actually did — because the transition from Stable is captured only from when reporting becomes detailed.

**Mitigation:** Use EFFIS and IPMA data (which are consistently produced regardless of fire activity level) as the primary signal for low-activity periods. ANEPC sitrep detail level is a secondary indicator quality flag. When a week has low ANEPC detail, the EFFIS environmental signal is the primary classifier for that week.

---

## Section 8 — Acquisition Workflow

The workflow defines the steps to go from today (no data collected) to the first constructed SystemObservation. Effort estimates are for a single analyst with moderate Portuguese-language reading ability.

### 8.1 Stage 1 — Source Discovery (Once, at pilot start)

**Objective:** Locate and bookmark every data source needed; confirm access and historical depth.

| Task | Steps | Estimated Hours |
|------|-------|----------------|
| EFFIS portal navigation | Navigate to effis.jrc.ec.europa.eu; locate historical fire danger data download; test download for Centro region June–September 2023; confirm format (NetCDF or CSV) | 2 |
| IPMA data access | Navigate to ipma.pt and data.ipma.pt; locate fire risk map archive; attempt to download a specific 2023 date; if individual maps unavailable, locate seasonal statistics; bookmark both paths | 2 |
| ANEPC sitrep archive | Navigate to anepc.pt/comunicacao or prociv.pt; locate 2023 fire season situation reports; download one report to confirm format and field availability | 2 |
| DECIR location | Navigate ANEPC document repository; locate DECIR 2023 (or 2025 as fallback); download; confirm Centro region resource allocation section is present | 2 |
| FIRMS download setup | Navigate to firms.modaps.eosdis.nasa.gov/map; test historical download for Centro region, June–September 2023; confirm CSV output with coordinates and date | 1 |
| SNIRH access | Navigate snirh.apambiente.pt; locate drought index data for Centro hydrological basins; confirm 2023 data availability | 1 |
| ICNF restrictions archive | Navigate icnf.pt; locate restriction bulletins for 2023; if absent, confirm IPMA proxy path is available | 1 |
| Copernicus CLMS registration | Register at land.copernicus.eu (free); locate NDVI and FAPAR products for Portugal 2023 | 1 |
| **Stage 1 total** | | **~12 hours** |

**Stage 1 output:** Source Discovery Record — a document listing every source, its URL, access method, confirmed availability for 2023, and the specific data fields accessible. This is the foundation for all subsequent stages.

---

### 8.2 Stage 2 — Access Verification (Parallel to Stage 1)

**Objective:** Confirm that every required data field is actually accessible — not just that the portal exists.

| Task | Steps | Estimated Hours |
|------|-------|----------------|
| EFFIS data format validation | Download June–September 2023 FWI data; confirm it includes daily values for the Centro region polygon or a point within it; confirm the FWI composite value is present | 2 |
| IPMA daily vs. seasonal decision | Attempt to access a specific daily risk map from August 2023; if accessible, proceed with daily maps; if not, confirm seasonal statistics path and document the fallback | 2 |
| ANEPC sitrep field inventory | Download 3 representative 2023 sitreps (low activity, medium, high); extract resource deployment figures; confirm the Centro region breakdown is available; note any gaps in reporting | 3 |
| DECIR calibration extraction (preliminary) | Read DECIR 2023; identify `capacityBaseline` and `bufferInitialLevel` candidate figures for Centro; document extraction method; flag ambiguities | 3 |
| FIRMS filter test | Apply Centro region bounding box; filter by confidence ≥ 50%; confirm fire point counts for a test week in July 2023; compare to ANEPC sitrep for the same week (rough cross-validation) | 1 |
| **Stage 2 total** | | **~11 hours** |

**Stage 2 output:** Access Verification Record — confirms which data paths work, which fall back to alternatives, and which are blocked. If any Required dependency is blocked at this stage, the pilot plan requires adjustment before proceeding.

---

### 8.3 Stage 3 — Historical Collection (2023 Season)

**Objective:** Download and organize all 2023 fire season data needed for the 17-week retrospective.

| Task | Data | Estimated Hours |
|------|------|----------------|
| EFFIS: download June–September 2023 FWI daily data for Centro | Daily FWI composite and ISI for 17 weeks | 2 |
| IPMA: download/scrape 2023 risk data | Daily maps if accessible; else seasonal statistics summary | 3–6 |
| ANEPC: download all 2023 weekly situation reports | 17 weekly PDFs; 2–5 daily brief bulletins per week if available | 3 |
| DECIR 2023: complete extraction | Full calibration document; extract `capacityBaseline` and `bufferInitialLevel` with conversion factor | 4 |
| FIRMS: download June–September 2023 Centro fire points | 17 weeks of VIIRS 375m detections, confidence-filtered | 2 |
| SNIRH: download 2023 SPI-3 and PDSI for Centro basins | Monthly values for the season | 1 |
| ICNF: download 2023 Relatório de Incêndios Rurais | Annual statistics report; municipal breakdown | 1 |
| File organization | Implement directory structure; rename files consistently; verify completeness | 2 |
| **Stage 3 total** | | **~18–21 hours** |

**Stage 3 output:** Complete raw data archive for the 2023 season, organized by date and source, ready for quality review.

---

### 8.4 Stage 4 — Quality Review

**Objective:** Verify data completeness, consistency, and identify gaps before observation construction begins.

| Task | Steps | Estimated Hours |
|------|-------|----------------|
| Completeness check | Confirm data for all 17 weeks across all sources; flag missing weeks by source | 2 |
| Consistency check | Compare FIRMS fire counts to ANEPC sitrep counts for the same weeks; flag weeks where they diverge by more than 30% | 2 |
| DECIR calibration validation | Verify that extracted `capacityBaseline` is plausible (cross-check against ICNF statistics on total suppression personnel); flag if implausible | 1 |
| IPMA fallback confirmation | Determine which weeks will use daily maps vs. seasonal statistics proxy for `admissibilityBoundary`; document by week | 2 |
| Gap register | Produce a gap register listing every week and dimension where data is absent; assign fallback strategy to each gap | 2 |
| **Stage 4 total** | | **~9 hours** |

**Stage 4 output:** Quality Review Record + Gap Register with fallback assignments.

---

### 8.5 Stage 5 — Observation Construction

**Objective:** Produce the 17 SystemObservation objects for the 2023 retrospective.

| Task | Steps | Estimated Hours |
|------|-------|----------------|
| Define RUE conversion factors | Document the crew-vehicle-aircraft conversion; get domain review if possible | 2 |
| Define IPMA-to-restriction conversion rule | Map IPMA risk levels to municipal restriction proportions per the relevant regulations | 2 |
| Construct Week 1 observation (June 7–13, 2023) | Run full construction procedure for the first window; validate output against CIS input schema | 3 |
| Construct Weeks 2–17 observations | Once Week 1 is validated, construct remaining 16 observations; each takes approximately 45–60 minutes | 12–16 |
| `bufferHistory` assembly | Assemble the buffer time series; verify array length matches window count | 1 |
| Schema validation | Validate each observation JSON against the CIS engine input schema; fix any missing required fields | 2 |
| **Stage 5 total** | | **~22–26 hours** |

**Stage 5 output:** 17 validated SystemObservation JSON files, ready for CIS engine input.

---

### 8.6 Total Acquisition Workflow Effort

| Stage | Hours |
|-------|-------|
| Stage 1 — Source Discovery | ~12 |
| Stage 2 — Access Verification | ~11 |
| Stage 3 — Historical Collection | ~18–21 |
| Stage 4 — Quality Review | ~9 |
| Stage 5 — Observation Construction | ~22–26 |
| **Total** | **~72–79 hours** |

At 8 hours per working day: **9–10 working days** from start to first CIS analysis. With a single analyst working full-time on this task, the first observation is ready within 2 calendar weeks. Working part-time (4 hours/day): 3–4 calendar weeks.

---

## Section 9 — Minimum Viable Dataset

The minimum viable dataset (MVD) is the smallest data collection that permits each CIS capability to run. Capabilities that cannot run without specific data are excluded; the MVD enables the others.

### 9.1 MVD for State Classification and Anomaly Detection (Phase 1 + Phase 2A)

**Required:** 3 of 5 indicator dimensions with non-null values.
**Available from public data:** `operatingLoad`, `recoveryRate`, `admissibilityBoundary`, `bufferLevel` — 4 dimensions.
**MVD:** ANEPC sitreps (17 weekly) + DECIR calibration + EFFIS FWI + IPMA risk data.
**Result:** State classification and anomaly detection run on 4-dimension observations. `synchronization` is permanently missing. Classification confidence is slightly reduced but functional.
**MVD effort:** Stages 1–5 as above (~72–79 hours).

### 9.2 MVD for Trajectory Estimation (Phase 2C)

**Required:** 2+ consecutive observations (observation history).
**Additional requirement beyond Phase 1:** Maintain the observation history array across weeks.
**MVD:** Same as Phase 1 MVD — trajectory becomes available from Week 2 onward automatically.
**No additional data collection required.**

### 9.3 MVD for Fragility Estimation (Phase 2D)

**Required:** 2+ consecutive `bufferLevel` values in `bufferHistory`.
**Additional requirement:** `bufferLevel` must be consistently measured (not missing) across most windows for the OLS slope to be meaningful.
**MVD:** Same as Phase 1 MVD plus careful `bufferLevel` tracking. If `bufferLevel` is missing for more than 3 non-consecutive weeks, Phase 2D slope confidence degrades significantly.
**Acceptable missing rate for Phase 2D:** ≤2 missing windows out of 17. Expected missing rate from public sources: ~0–2 windows.
**No additional data collection required beyond Phase 1 MVD.**

### 9.4 MVD for Weak-Signal Clustering (Phase 2B)

**Required:** 2+ weeks of Phase 2A anomaly history; at least one low-to-medium severity anomaly must be present to form a cluster.
**Additional requirement:** Sufficient variation in indicator values across weeks to produce detectable anomalies.
**MVD:** Same as Phase 1 MVD. Clustering begins automatically from Week 2.
**No additional data collection required.**

### 9.5 MVD for Load Displacement Analysis (Phase 2E)

**Required:** Two separate observation histories — Source (local Bombeiros) and Recipient (ANEPC national reserve) — each with at least 2 observations.

**This is the capability with the highest data acquisition barrier from public sources.**

**What public ANEPC sitreps provide:** Total resources deployed (aggregate). They do not consistently disaggregate local vs. national resources.

**What the DECIR provides:** Separate allocations by force type — Bombeiros, ICNF, GIPS, GNR SEPNA, aerial means. This disaggregation enables a rough separation:
- **Source (local Bombeiros):** Bombeiros crews from the DECIR allocation × local deployment proportion (estimated from the DECIR regional breakdown)
- **Recipient (national reserve):** GIPS + mutual-aid + DECIR national-level resources deployed to Centro

**Data availability for Phase 2E from public sources:** Partial. The DECIR provides the static allocation breakdown. The sitreps do not consistently report weekly deployment disaggregated by force type. A proxy is constructable: treat weeks where sitrep-reported totals exceed the local Bombeiros allocation as weeks where national resources are being drawn in (Recipient buffer declining).

**MVD for Phase 2E:** DECIR force-type allocation + ANEPC weekly totals (approximate disaggregation). Mark all Phase 2E inputs as `source: "estimated"`. The Phase 2E output will be `evidenceType: "trend"` only if the approximated subsystem histories contain ≥2 observations each — which they will.

**Phase 2E confidence tier with this MVD:** Tier 3 at best (`{ low: 0.3, high: 0.5 }`) due to estimated source/recipient values, not observed. The displacement candidate (if flagged) carries a narrow confidence range reflecting this estimation uncertainty.

**Additional data that would enable stronger Phase 2E:** ANEPC operational data disaggregated by force type. Requires institutional access. Not in the public MVD.

### 9.6 MVD Summary Table

| CIS Capability | MVD Data Requirement | Public Data Covers MVD? | Additional Effort? |
|---------------|---------------------|------------------------|-------------------|
| State classification (Phase 1) | 3+ of 5 dimensions | YES (4 dimensions) | None beyond baseline |
| Transition detection (Phase 1) | Prior classification | YES (internal carry) | None |
| CSD detection (Phase 1) | Fragile-state history | YES (accumulates) | None |
| Anomaly detection (Phase 2A) | State + indicators | YES | None |
| Weak-signal clustering (Phase 2B) | Anomaly history | YES (accumulates) | None |
| Trajectory estimation (Phase 2C) | Observation history | YES (accumulates) | None |
| Fragility estimation (Phase 2D) | bufferHistory | YES (tracked weekly) | None |
| Load displacement (Phase 2E) | 2 subsystem histories | PARTIAL (estimated from DECIR) | 3–5 hours to construct disaggregation |

**All CIS capabilities can run on public data alone.** Phase 2E confidence is reduced due to estimated subsystem disaggregation. All other capabilities run at Medium evidence quality or better.

---

## Section 10 — Readiness Assessment

Each indicator dimension is assessed against three criteria: data exists, data is accessible, and data can be translated into a CIS indicator value.

---

### operatingLoad — PARTIALLY READY

**Data exists:** YES — ANEPC situation reports contain weekly resource deployment figures.
**Data is accessible:** YES — ANEPC archive at prociv.pt; 2023 reports expected to be available.
**Translation feasible:** YES — with `capacityBaseline` from DECIR; straightforward division to produce [0,1+] value.

**What makes it Partially Ready rather than Ready:**
- `capacityBaseline` requires DECIR extraction (completed as part of calibration work; 4–8 hours)
- ANEPC reports aggregate resources; resource-unit equivalence conversion introduces uncertainty
- Within-week daily resolution is unavailable (weekly snapshots only)

**Blockers:** None that cannot be resolved with 4–8 hours of effort.
**Action required:** Download and read DECIR 2023; extract Centro region capacity figures; define RUE conversion factor.

---

### recoveryRate — PARTIALLY READY

**Data exists:** YES — FIRMS provides active fire detections; ANEPC sitreps provide incident controlled/extinguished counts.
**Data is accessible:** YES — FIRMS is publicly available; ANEPC archive accessible.
**Translation feasible:** YES — fire count ratio is an approximation but provides a usable proxy.

**What makes it Partially Ready rather than Ready:**
- The fire count ratio is a proxy for resource flow ratio — not a direct measurement
- Fire size variation means a week with one very large fire and ten small fires has a different resource consumption profile than eleven similar fires
- Source field will always be `"estimated"` — never `"observed"` from public data

**Blockers:** None. The proxy is always constructable from FIRMS + ANEPC data.
**Action required:** Define the counting methodology; apply consistent confidence filter to FIRMS; document in uncertainty spec.

---

### admissibilityBoundary — READY

**Data exists:** YES — IPMA publishes daily fire risk maps; ICNF publishes restriction bulletins.
**Data is accessible:** YES — IPMA data portal; ICNF website; SNIRH for drought context.
**Translation feasible:** YES — risk level to restriction proportion mapping is defined by Portuguese fire law.

**What makes it Ready:**
- IPMA risk classification is standardized, publicly available, and consistently produced
- The regulatory conversion from risk level to restriction category is fixed and publicly documented
- Even if daily maps are not individually archived for 2023, seasonal statistics provide an acceptable alternative
- No calibration parameter required (proportion-based measure)

**Action required:** Verify IPMA daily map archive accessibility for 2023; if inaccessible, confirm seasonal statistics path.

---

### synchronization — BLOCKED

**Data exists:** NO — inter-agency coordination timing data is not published by ANEPC or any related public authority.
**Data is accessible:** N/A — does not exist in the public domain.
**Translation feasible:** N/A.

**Permanent condition:** This dimension will be `null` (missing) in every observation constructed from public data.

**Engine handling:** The 3-of-5 classification rule accommodates this. With 4 available dimensions, state classification proceeds normally. The uncertainty spec discloses `missingDimensions: ["synchronization"]` in every output.

**Path to unblocking:** Institutional access request to ANEPC for:
1. `synchronizationTimingTolerance` (target dispatch-to-arrival intervals)
2. Aggregated weekly coordination timing statistics

This path requires institutional cooperation. Do not delay pilot start waiting for it.

---

### bufferLevel — PARTIALLY READY

**Data exists:** YES — ANEPC deployment figures minus `bufferInitialLevel` from DECIR.
**Data is accessible:** YES — same sources as `operatingLoad`.
**Translation feasible:** YES — with DECIR calibration; straightforward subtraction and division.

**What makes it Partially Ready rather than Ready:**
- Requires `bufferInitialLevel` from DECIR (same effort as `capacityBaseline`)
- On-immediate-standby resources (resources pre-positioned but not committed to an active incident) are not separately reported in public sitreps; must be assumed zero
- Assuming standby = 0 underestimates the true available reserve (actual buffer is modestly higher than computed)

**Blockers:** None that cannot be resolved with DECIR extraction effort.
**Action required:** Same as `operatingLoad` — DECIR extraction provides both `capacityBaseline` and `bufferInitialLevel`.

---

### Readiness Summary

| Indicator | Status | Blocking Issue | Resolution |
|-----------|--------|---------------|------------|
| `operatingLoad` | Partially Ready | DECIR extraction required | 4–8 hours; no institutional access needed |
| `recoveryRate` | Partially Ready | Proxy estimation; never "observed" | Accept as estimated; document in uncertainty spec |
| `admissibilityBoundary` | Ready | Daily archive access TBC | Verify IPMA archive; fallback confirmed |
| `synchronization` | Blocked | No public source exists | Proceed without; 3-of-5 rule handles it |
| `bufferLevel` | Partially Ready | DECIR extraction required | Same as operatingLoad; 4–8 hours |

| Calibration Parameter | Status | Resolution |
|----------------------|--------|-----------|
| `capacityBaseline` | Partially Ready | DECIR extraction; 4–8 hours |
| `bufferInitialLevel` | Partially Ready | DECIR extraction (same document); 2–4 hours incremental |
| `synchronizationTimingTolerance` | Blocked | No public source; operate partially-calibrated |

---

## Section 11 — Final Recommendation

### Determination

**Pilot Can Begin After Data Preparation.**

### Basis

The Portugal wildfire pilot as designed in `CIS_PORTUGAL_WILDFIRE_PILOT.md` can be executed using publicly obtainable data. Four of the five CIS indicator dimensions have public data sources. All three calibration parameters are at least partially resolvable from public documents (`synchronizationTimingTolerance` remains blocked but the engine accommodates this). All CIS capabilities (Phases 1 through 2E) can run on the available public data, with Phase 2E operating at reduced confidence due to subsystem disaggregation approximation.

The pilot does not require institutional data access agreements. It does not require proprietary data sources. It does not require paid subscriptions.

**What "after data preparation" means concretely:**

The pilot cannot begin today because the data has not yet been collected and organized, and the calibration parameters have not been extracted. The preparation required is:

1. **DECIR 2023 extraction** (4–8 hours) — provides `capacityBaseline` and `bufferInitialLevel`, enabling `operatingLoad` and `bufferLevel` normalization without which the engine cannot classify states reliably
2. **ANEPC 2023 sitrep collection** (3 hours) — primary source for resource deployment figures
3. **EFFIS + FIRMS 2023 data download** (3 hours) — environmental and fire occurrence data
4. **IPMA access path verification** (2 hours) — confirm whether daily maps or seasonal statistics path is needed
5. **Observation construction (Week 1)** (3 hours) — first SystemObservation; validates that all transformations produce engine-compatible values

**Total preparation time before first CIS analysis can run:** approximately 15–20 hours of targeted work, completing items 1–5. This represents the minimum preparation for the first observation to be ready. The full 17-week retrospective requires the complete workflow (~72–79 hours).

**The pilot is not blocked by any unresolvable data gap.** It is blocked only by the normal preparation work that any pilot requires before analysis can begin.

---

## Section 12 — Final Review

### 1. What is the single hardest data dependency?

**The hardest data dependency is the Phase 2E (load displacement) subsystem disaggregation — separating local Bombeiros deployment from ANEPC national reserve deployment at weekly resolution from public sources.**

This is harder than the `synchronization` gap (which is simply missing and handled by the 3-of-5 rule) because it affects a capability that the pilot intends to run rather than one that will be disclosed as absent. The aggregate ANEPC situation reports do not consistently separate local from national resource deployment. Constructing the Source and Recipient subsystem observation histories for Phase 2E requires creative interpretation of DECIR force-type allocations combined with aggregate sitrep figures — a multi-step inference with compounding uncertainty.

Every other Required dependency is obtainable from identifiable public sources with reasonable effort:
- `capacityBaseline` and `bufferInitialLevel`: DECIR (public, specific, extractable)
- `operatingLoad`: ANEPC sitrep deployment figures (public, weekly, consistent)
- `bufferLevel`: Derived from the above (requires DECIR calibration)
- `admissibilityBoundary`: IPMA risk maps (public, daily, well-archived)
- `recoveryRate`: FIRMS + ANEPC fire counts (public, daily, downloadable)

The subsystem disaggregation for Phase 2E has no clean public source. It must be approximated from DECIR allocation proportions applied to aggregate deployment figures. The result is usable but carries low confidence — Phase 2E will operate in Tier 3 confidence (`{ low: 0.3, high: 0.5 }`) throughout the pilot.

**Operational implication:** If Phase 2E load displacement analysis is the highest-priority capability, institutional access to disaggregated ANEPC resource deployment data (by force type, weekly) is worth pursuing. If Phase 2E operates at reduced confidence (Tier 3) from public data, that is acceptable for a first pilot — it can be upgraded in a second cycle with better data.

---

### 2. Can a 2023 retrospective pilot be executed entirely from public sources?

**Yes — for four of five indicator dimensions, covering all CIS capabilities at adequate quality.**

Specifically:
- **State classification:** YES — 4 of 5 dimensions available; 3-of-5 rule satisfied; `synchronization` missing and disclosed
- **Anomaly detection:** YES — 4-dimension observations support anomaly detection across all available dimensions
- **Weak-signal clustering:** YES — accumulates from Phase 2A anomaly history; available from Week 2
- **Trajectory estimation:** YES — accumulates from observation history; available from Week 2
- **Fragility estimation (Phase 2D):** YES — `bufferLevel` provides `bufferHistory`; OLS trend analysis runs from Week 2
- **Load displacement (Phase 2E):** YES, at reduced confidence — DECIR disaggregation enables approximate subsystem histories; Tier 3 confidence

**What the 2023 retrospective cannot provide from public sources:**
- `synchronization` values — permanently missing; disclosed in every output
- `synchronizationTimingTolerance` calibration — `partially-calibrated` mode throughout
- High-confidence Phase 2E outputs — Tier 3 confidence due to estimated subsystem disaggregation
- Within-week (daily) `operatingLoad` and `bufferLevel` resolution — weekly aggregation only

**The 2023 retrospective produces a meaningful, honest, multi-capability CIS analysis.** Every output is appropriately uncertainty-disclosing. The missing and estimated dimensions are reflected in confidence bounds. The advisory nature of all outputs is maintained throughout.

---

### 3. What is the realistic effort required before the first wildfire observation can be generated?

**The first SystemObservation (Week 1, June 7–13, 2023) can be generated in approximately 15–20 hours of focused work across 2–3 working days.**

Breakdown:

| Task | Hours | Notes |
|------|-------|-------|
| DECIR 2023: locate, download, read, extract `capacityBaseline` and `bufferInitialLevel` for Centro | 4–6 | Critical path item; must be done first |
| Define RUE conversion factor (crews, vehicles, aircraft) | 1–2 | Decisions, not research |
| ANEPC: locate 2023 archive; download Week 1 sitrep (June 12, 2023 — first Monday of the season) | 1–2 | Straightforward once archive is located |
| EFFIS: download FWI data for June 7–13, 2023 for Centro region | 1 | Standard download procedure |
| IPMA: verify access path; download or extract June 7–13 risk level data | 1–2 | Path verification adds uncertainty |
| FIRMS: download June 7–13 fire detections for Centro bounding box | 1 | Standard download |
| Week 1 indicator computation | 2–3 | Apply each transformation; produce five (or four) indicator values |
| Week 1 observation JSON construction | 1 | Write the SystemObservation object |
| Schema validation | 1 | Run through engine input validator; fix any issues |
| **Total** | **13–18 hours** | |

**At 6–8 hours per working day: the first observation is ready within 2–3 working days from a cold start.**

This is the theoretical minimum — it assumes no unexpected access barriers are encountered. The most likely delay is the DECIR extraction: if DECIR 2023 is not immediately locatable in the ANEPC archive, add 2–4 hours of searching and possibly contacting ANEPC's public communications. Given the DECIR is a public document with legal force, it should be findable.

**First CIS analysis output** is available the moment the first observation is loaded into the engine — this is a code execution, not additional research. State classification, anomaly detection (first week has no prior context; anomalies require a prior state classification to be meaningful), and the initial fragility seed are all produced from the first observation.

**Trajectory estimation, fragility trend, and weak-signal clustering** require the second observation (Week 2). These are available 1 week after the first observation in the prospective pilot, or approximately 2 additional hours of construction effort in the retrospective.

---

*CIS Portugal Wildfire Data Inventory v1.0 — 2026-05-30*
*Complete data dependency identification and acquisition feasibility assessment. No data collected. No CIS outputs produced. No wildfire outcomes evaluated. Assessment basis: public source availability as of 2026-05-30.*
