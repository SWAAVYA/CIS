# CIS API Specification

Base URL: `https://api.cis.railway.app`
All responses JSON. All timestamps ISO 8601 UTC. Errors: `{error, code, status}`.

---

## Cases
`POST /api/cases` — `{title, description?}` → `{id, title, access_code, created_at}`
`GET /api/cases/:id` — full case object with domains, signal counts by status
`GET /api/cases/by-code/:code` — retrieve by access code
`PATCH /api/cases/:id/close`

---

## Domains
`POST /api/cases/:id/domains` — `{name, description?}` → domain object
`GET /api/cases/:id/domains` → array of domains
`POST /api/cases/:id/domains/independence` — `{domain_a_id, domain_b_id, is_independent, independence_basis}` — declare independence relationship

---

## Signals

### POST /api/cases/:id/signals
Submit a new observation. System scores SI and significance. Creates Candidate, runs admission evaluation.

**Request:**
```json
{
  "content": "ECG shows ST depression in V1-V4 with dominant R wave in V1-V2.",
  "domain_id": "uuid",
  "observation_period": 2
}
```

**Response 201:**
```json
{
  "signal": {
    "id": "uuid",
    "content": "...",
    "status": "ADMITTED",
    "si_score": 0.73,
    "si_subcriteria": "SI-1",
    "si_rate": 0.60, "si_direction": 0.70, "si_relationship": 0.80, "si_configuration": 0.82,
    "significance": 0.68,
    "sig_si": 0.73, "sig_persistence": 0.50, "sig_corroboration": 0.60,
    "sig_proximity": 0.70, "sig_rarity": 0.75, "sig_relevance": 0.80,
    "admission_reason": "SI score 0.73 above SI_min 0.25. Significance 0.68 above threshold 0.55.",
    "admitted_at": "..."
  },
  "admission": {
    "decision": "ADMITTED",
    "si_threshold": 0.25,
    "sig_threshold": 0.55
  },
  "connections": [],       // any new signal connections detected
  "hypotheses": [],        // any hypotheses triggered by this signal
  "lp_flags": []           // any loss points this signal was at risk of
}
```

### GET /api/cases/:id/signals
Query params: `status`, `domain_id`, `min_si`, `min_significance`, `sort` (significance|created_at)

### PATCH /api/signals/:id/status
Manual lifecycle transition by investigator.
```json
{ "to_status": "ELEVATED", "reason": "Cross-domain match confirmed by domain expert." }
```

### PATCH /api/signals/:id/scores
Override AI/rule-based scores with investigator assessment.
```json
{ "si_score": 0.85, "significance": 0.72, "reason": "..." }
```

---

## Contradictions

### POST /api/cases/:id/contradictions
Register a contradiction between two signals. Both enter Quarantine.
```json
{ "signal_a_id": "uuid", "signal_b_id": "uuid", "description": "Signal A asserts X; Signal B asserts not-X." }
```
Response includes updated signal statuses (both → QUARANTINED).

### GET /api/cases/:id/contradictions — filter by status

### POST /api/contradictions/:id/resolve
```json
{
  "resolution_type": "RC-3",
  "resolution_basis": "Domain expert with direct observational access confirmed Signal A describes the actual structural condition.",
  "resolved_signal_id": "uuid"
}
```

### POST /api/cases/:id/released-options
```json
{ "text": "posterior MI not disconfirmed", "signal_id": "uuid" }
```

### GET /api/cases/:id/released-options — active options
### PATCH /api/released-options/:id/flag — mark as matched

---

## Hypotheses

### POST /api/cases/:id/hypotheses
Investigator-initiated hypothesis (SHG creates hypotheses automatically).
```json
{
  "title": "Shared unit convention mismatch",
  "description": "AMD and JPL navigation systems are using incompatible unit conventions...",
  "hypothesis_type": "HCL",
  "connection_id": "uuid"
}
```

### GET /api/cases/:id/hypotheses — filter by status, type

### POST /api/hypotheses/:id/evidence
```json
{
  "content": "AMD software documentation confirms use of imperial units throughout.",
  "evidence_type": "SUPPORTING",
  "weight": 0.85,
  "signal_id": "uuid"
}
```
Response includes updated plausibility and plausibility delta.

### PATCH /api/hypotheses/:id/resolve
```json
{
  "status": "CONFIRMED",
  "resolution_basis": "Direct examination of AMD software confirmed unit mismatch."
}
```

### POST /api/cases/:id/competition-sets
```json
{
  "hypothesis_ids": ["uuid-a", "uuid-b"],
  "description": "Competing explanations for the navigation residuals"
}
```

---

## Briefings

### POST /api/cases/:id/briefings
Generate a cognitive briefing. System assembles pool state, active hypotheses, quarantines, LP flags. AI generates narrative summary.
```json
{} // no body required
```

**Response 201:**
```json
{
  "id": "uuid",
  "pool_status": {
    "candidate": 2, "admitted": 5, "retained": 8, "connected": 3,
    "quarantined": 1, "elevated": 2, "assessed": 4, "resolved": 7, "archived": 3, "expired": 1
  },
  "lp_flags": ["LP-3"],
  "summary": "...",
  "content": {
    "active_signals": [ { "id":"uuid","content":"...","significance":0.82,"status":"RETAINED" } ],
    "active_hypotheses": [ { "id":"uuid","title":"...","plausibility":0.71,"type":"HCL" } ],
    "quarantined": [ { "id":"uuid","description":"..." } ],
    "open_questions": [ { "id":"uuid","content":"...","si_score":0.79,"significance":0.61 } ],
    "resolved": [],
    "lp_detail": [ { "lp": "LP-3", "signal_id":"uuid", "description":"Signal from domain B not connected to domain A investigation." } ]
  },
  "generated_at": "..."
}
```

### GET /api/cases/:id/briefings — all briefings for case, newest first
### GET /api/briefings/:id — single briefing

---

## Analytics

### GET /api/analytics
Latest snapshot. No case content.
```json
{
  "snapshot_at": "...",
  "total_cases": 89,
  "total_signals_submitted": 1847,
  "total_signals_admitted": 1203,
  "admission_rate": 0.651,
  "total_hypotheses": 156,
  "total_hypotheses_confirmed": 43,
  "hcl_confirmation_rate": 0.276,
  "total_contradictions": 67,
  "total_contradictions_resolved": 41,
  "shg_trigger_rate": 0.34,
  "lp_distribution": { "LP-1": 312, "LP-2": 89, "LP-3": 45, "LP-4": 23, "LP-5": 67, "LP-6": 12, "LP-7": 34 },
  "avg_si_score": 0.41,
  "avg_significance": 0.52
}
```
