# CIS System Architecture

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Backend | Node.js + Express + TypeScript + Prisma |
| Database | PostgreSQL 16 (Railway managed) |
| AI | Anthropic SDK — server-side only |
| Background jobs | node-cron (analytics refresh, significance decay, SHG trigger) |
| Deploy | Railway (API + DB) + Vercel (frontend) |
| CI/CD | GitHub Actions |

## Repository Structure

```
cis/
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── prisma.ts
│   │   │   ├── routes/
│   │   │   │   ├── cases.ts
│   │   │   │   ├── domains.ts
│   │   │   │   ├── signals.ts          # intake, admission, lifecycle
│   │   │   │   ├── hypotheses.ts       # create, evidence, plausibility
│   │   │   │   ├── contradictions.ts   # quarantine, resolution
│   │   │   │   ├── briefings.ts        # generate + retrieve
│   │   │   │   └── analytics.ts
│   │   │   ├── services/
│   │   │   │   ├── ai.ts               # Anthropic — SI scoring, SHG, plausibility
│   │   │   │   ├── si-scorer.ts        # SI dimension scoring (rule-based fallback)
│   │   │   │   ├── significance.ts     # NL4-B 6-criterion scoring
│   │   │   │   ├── sls.ts              # Signal lifecycle state machine
│   │   │   │   ├── shg.ts              # Hypothesis generation trigger logic
│   │   │   │   ├── reasoning.ts        # Plausibility update, competition sets
│   │   │   │   ├── briefing.ts         # Cognitive briefing assembly
│   │   │   │   └── lp-monitor.ts       # Loss point detection and flagging
│   │   │   ├── jobs/
│   │   │   │   ├── significance-decay.ts   # Run hourly: decay stale signals
│   │   │   │   ├── shg-trigger.ts          # Run on new signal: check SHG conditions
│   │   │   │   └── analytics-refresh.ts    # Run hourly
│   │   │   └── middleware/
│   │   │       ├── cors.ts
│   │   │       └── error.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   ├── Dockerfile
│   │   └── package.json
│   └── web/
│       ├── src/
│       │   ├── pages/
│       │   │   ├── Start.tsx
│       │   │   ├── Dashboard.tsx           # Case overview
│       │   │   ├── SignalPool.tsx           # All signals with status
│       │   │   ├── SignalIntake.tsx         # Submit new signal
│       │   │   ├── HypothesisBoard.tsx     # Active hypotheses
│       │   │   ├── ContradictionLedger.tsx # Quarantined signals
│       │   │   ├── CognitiveBriefing.tsx   # Current briefing
│       │   │   ├── DomainManager.tsx       # Manage domains
│       │   │   └── Analytics.tsx
│       │   ├── components/
│       │   │   ├── signal/
│       │   │   │   ├── SignalCard.tsx
│       │   │   │   ├── SignalStatus.tsx     # Lifecycle state badge
│       │   │   │   ├── SIScoreBar.tsx      # Visual SI score
│       │   │   │   └── AdmissionDecision.tsx
│       │   │   ├── hypothesis/
│       │   │   │   ├── HypothesisCard.tsx
│       │   │   │   ├── PlausibilityBar.tsx
│       │   │   │   ├── EvidencePanel.tsx
│       │   │   │   └── CompetitionSet.tsx
│       │   │   ├── contradiction/
│       │   │   │   ├── QuarantineCard.tsx
│       │   │   │   └── ResolutionModal.tsx
│       │   │   ├── briefing/
│       │   │   │   ├── BriefingSection.tsx
│       │   │   │   └── LossPointAlert.tsx
│       │   │   └── shared/
│       │   │       ├── StatusBadge.tsx
│       │   │       ├── DomainTag.tsx
│       │   │       └── ExportButton.tsx
│       │   ├── hooks/
│       │   │   ├── useCase.ts
│       │   │   ├── useSignals.ts
│       │   │   ├── useHypotheses.ts
│       │   │   └── useAnalytics.ts
│       │   └── api/client.ts
│       └── package.json
├── .github/workflows/
│   ├── deploy-api.yml
│   └── deploy-web.yml
├── railway.json
└── README.md
```

## Core Service Logic

### SLS State Machine (sls.ts)

Valid transitions:
```
CANDIDATE → ADMITTED | EXPIRED (LP-1 rejection recorded)
ADMITTED → RETAINED | EXPIRED (significance < threshold, LP-2 if before min retention)
RETAINED → CONNECTED | QUARANTINED | ELEVATED | ASSESSED | EXPIRED
CONNECTED → ASSESSED | QUARANTINED
QUARANTINED → RETAINED (if resolved) | RESOLVED
ELEVATED → ASSESSED | RESOLVED
ASSESSED → RESOLVED | RETAINED (if reassessed)
RESOLVED → ARCHIVED
ARCHIVED → CANDIDATE (recurrence — new signal matching archived signal)
```

Every transition creates a `signal_events` record: from_state, to_state, reason, timestamp.

LP monitoring: before any expiry transition, check WSP minimum retention. Before any state change, check if AP-v1 protections apply.

### SI Scorer (si-scorer.ts)

Rule-based scoring on 4 dimensions (0.0–1.0 each):
- **Rate incongruence:** rate of change inconsistent with classified state dynamics
- **Directional incongruence:** monotonic movement where bidirectional expected
- **Relationship incongruence:** decoupled from indicators it should track
- **Configuration incongruence:** multiple dimensions simultaneously approaching boundaries

Composite SI = weighted mean of 4 dimensions. Default weights: rate 0.2, direction 0.2, relationship 0.25, configuration 0.35 (configuration weighted highest per EE theory).

AI fallback: if ANTHROPIC_API_KEY set, AI can score based on signal content analysis.

### NL4-B Significance Scoring (significance.ts)

6 criteria, each 0.0–1.0:
1. SI score (from si-scorer)
2. Persistence (how many observation periods this pattern has held)
3. Corroboration (signals from other domains supporting same conclusion)
4. Proximity to constraint boundary
5. Rarity (how unusual relative to classified state)
6. Relevance (connection to active hypothesis or pattern)

SIG = weighted mean of 6 criteria.
SIG_threshold = 0.55 (above: Admitted)
SI_min = 0.25 (below: Candidate rejected, LP-1 recorded)

### SHG Trigger (shg.ts)

After each new Connected signal pair, evaluate:
1. Are the two domains independent? (check domain independence matrix)
2. Do their signals share mismatch type, dimension, direction, or temporal pattern?
3. What is the probability of independent co-occurrence given the correspondence strength?

If P(independent) < threshold (default 0.15): generate structural hypothesis via SHG.

SHG prompt to AI: given these two signal descriptions from independent domains, generate a structural hypothesis about the shared cause. Return: hypothesis text, hypothesis type (HCL | SI_CLUSTER | PATTERN), initial plausibility estimate, evidence required for confirmation.

### Reasoning (reasoning.ts)

Evidence types: SUPPORTING | CONTRADICTING | CONTEXTUAL
Plausibility update: Bayesian-style — supporting evidence increases, contradicting decreases, contextual does not change.

Competition set management: when multiple hypotheses compete to explain the same signals, normalise their plausibilities so sum ≤ 1.0.

Resolution: automated when plausibility crosses thresholds. Investigator can force resolve at any time with reason.

### Briefing Assembly (briefing.ts)

Briefing sections:
1. POOL STATUS — total signals by state
2. ACTIVE SIGNALS — top 5 by significance, not yet resolved
3. ACTIVE HYPOTHESES — all non-archived hypotheses, sorted by plausibility desc
4. QUARANTINED — all signals in quarantine with contradiction description
5. LOSS POINTS — any LP flags since last briefing
6. RESOLVED — what has been resolved since last briefing
7. OPEN QUESTIONS — signals with high SI but no assigned hypothesis

## Environment Variables

### API
```
DATABASE_URL
ANTHROPIC_API_KEY
CORS_ORIGIN
PORT=3000
NODE_ENV=production
SI_MIN_THRESHOLD=0.25
SIG_THRESHOLD=0.55
SHG_INDEPENDENCE_THRESHOLD=0.15
MIN_RETENTION_PERIODS=2
```

### Web
```
VITE_API_URL
```
