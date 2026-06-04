# CIS — Cognitive Intelligence System

## What this is

Most investigation systems try to explain everything. CIS does something different — it specifically preserves and connects observations that resist explanation, because those are often where important discoveries are. The system manages observations through a lifecycle, scores each one for Structural Incongruence (SI — a measure of how much an observation deviates from what its context would predict), generates hypotheses about shared causes across independent domains using the Structural Hypothesis Generator (SHG), and produces auditable cognitive briefings that summarise the epistemic state of an investigation at any point. The goal is to prevent important anomalies from being silently dismissed and to make the reasoning trail fully inspectable.

## What it does

- Submit observations from multiple independent sources
- Score each observation for Structural Incongruence (SI) — how much does it deviate from what its context would predict
- Preserve observations that resist explanation in an open observation pool
- When observations from independent domains show the same structural pattern, detect the correspondence and generate a hypothesis about a shared hidden cause (Hidden Common Link — HCL — detection)
- Quarantine contradictions — they cannot be silently dismissed; every contradiction must be resolved with a typed resolution
- Maintain a full audit trail of every decision: what was submitted, how it was scored, what happened to it, why
- Generate cognitive briefings that summarise the investigation's epistemic state at any point

## Two operating modes

**AI mode** (requires AI API key)
Document intake — paste a paper or report and the system extracts structurally relevant observations automatically. Cross-field synthesis — compare documents from different fields and the system finds structural correspondence between them.

**Manual mode** (no API key needed)
All core features work without an API key. Observations are entered manually with optional structural tags (mismatch type, deviation direction). The Structural Hypothesis Generator uses tag matching instead of AI analysis.

## Running locally

**Prerequisites:** Node.js 20+, PostgreSQL 15+, Git

```bash
git clone <your-repo-url>
cd cis

# Install API dependencies
cd apps/api
npm install

# Set up environment
cp .env.example .env
# Edit .env — set DATABASE_URL (required) and ANTHROPIC_API_KEY (optional)

# Run database migrations
npx prisma migrate deploy

# Start API
npm run dev

# In a separate terminal, start the frontend
cd ../web
npm install
npm run dev
```

API runs at `http://localhost:3000`  
Frontend runs at `http://localhost:5173`

## Deploying

**API + Database — Railway**

1. Push your code to GitHub
2. Create a new Railway project, connect your repo
3. Add a PostgreSQL service — Railway sets `DATABASE_URL` automatically
4. Set environment variables: `ANTHROPIC_API_KEY`, `CORS_ORIGIN` (your Vercel frontend URL), `NODE_ENV=production`
5. Railway builds and deploys on push

**Frontend — Vercel**

1. Import your GitHub repo in Vercel
2. Set root directory to `apps/web`
3. Set environment variable: `VITE_API_URL` (your Railway API URL)
4. Vercel builds and deploys on push

## Data and privacy

CIS does not collect personal data. Cases are identified by a randomly generated access code — no accounts, no email addresses, no names are stored anywhere in the system.

The public analytics page shows aggregate patterns across all investigations (admission rates, hypothesis confirmation rates, loss point distribution). No case content is included in analytics.

## Architecture

CIS uses a three-layer architecture. **Layer 1 (Operational)** manages the signal pool, hypothesis generation via the Structural Hypothesis Generator (SHG), contradiction governance, and cognitive briefings. **Layer 2 (Telemetry)** preserves the complete audit trail — every admission decision, plausibility update, contradiction resolution, and score change is recorded and immutable. **Layer 3 (Meta-Governance)** is planned for a future version after the telemetry corpus has accumulated sufficient data to calibrate it empirically. The architectural rationale for all three layers is in `docs/CIS_ARCHITECTURE_LAYERS.md`.

## Tech stack

- **API:** Node.js, Express, TypeScript, Prisma, PostgreSQL
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, TanStack Query, Recharts
- **AI:** AI provider \(optional — system degrades gracefully without it)
