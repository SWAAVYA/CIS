# Claude Code Prompt — Phase 7 (Production Hardening) + Phase 8 (README)

Do Phase 7 completely before starting Phase 8.

---

## Phase 7 — Production Hardening

The system is built and all tests pass. Harden it for production.

### 7a — Remove debug code

Search the entire codebase for any remaining debug lines and remove them:

- Any `console.log`, `process.stdout.write`, `process.stderr.write` that were added during debugging
- The debug middleware in `src/routes/intake.ts` if still present
- The file `src/debug-shg.ts` if it exists — delete it
- Any `// DEBUG` or `// TEMP` comments with associated code

Do not remove legitimate logging like startup messages or error logging.

---

### 7b — Error boundaries on all API routes

Every route must return consistent JSON errors. No route should ever return an unhandled exception or HTML error page.

Add a global error handler in `src/index.ts` at the very end, after all routes:

```typescript
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    code: err.code || 'SERVER_ERROR',
    status: err.status || 500
  });
});
```

Check every route file — any `try/catch` that currently does `console.error` and returns a generic 500 should use this pattern instead.

---

### 7c — Input validation on all routes

Use Zod for validation. Every POST and PATCH endpoint must validate its request body before processing.

Check these specifically:

**signals route** — `content` must be non-empty string, max 10000 chars. `domain_id` must be valid UUID if provided. `observation_period` must be positive integer if provided.

**contradictions route** — `signal_a_id` and `signal_b_id` must be valid UUIDs and must not be equal. `description` must be non-empty string.

**hypotheses route** — `title` non-empty, `description` non-empty, `hypothesis_type` must be one of the valid enum values.

**evidence route** — `evidence_type` must be SUPPORTING, CONTRADICTING, or CONTEXTUAL. `weight` must be between 0.0 and 1.0. `content` non-empty.

**score override route** — `reason` is required and must be non-empty string. Return 400 if absent or empty.

**intake routes** — `content` must be non-empty string for document mode. Both `domain_a` and `domain_b` must be present with valid `domain_id` UUIDs for synthesis mode.

Return 400 with `code: 'VALIDATION_ERROR'` and a human-readable `error` message for all validation failures.

---

### 7d — Rate limiting

Verify rate limiting is correctly applied. In `src/index.ts`, confirm these limits are active:

- `POST /api/cases` — 10 per hour per IP
- `POST /api/cases/:id/signals` — 60 per hour per IP  
- `POST /api/cases/:id/intake/*` — 20 per hour per IP (AI calls are expensive)
- `GET /api/analytics` — 60 per hour per IP

Use `express-rate-limit`. If not already installed, add it.

---

### 7e — Security headers

Confirm `helmet` is installed and applied in `src/index.ts`:

```typescript
import helmet from 'helmet';
app.use(helmet());
```

If not present, add it. Install helmet if needed.

---

### 7f — Request logging

Add `morgan` for request logging in production:

```typescript
import morgan from 'morgan';
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}
```

Install morgan if needed.

---

### 7g — Graceful shutdown

Add graceful shutdown handling in `src/index.ts`:

```typescript
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});
```

---

### 7h — Environment variable validation at startup

At the top of `src/index.ts`, before anything else, validate required environment variables:

```typescript
const required = ['DATABASE_URL'];
const missing = required.filter(key => !process.env[key]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn('ANTHROPIC_API_KEY not set — AI features will be unavailable');
}
```

---

### 7i — Frontend error boundaries

In `apps/web/src/App.tsx`, confirm there is an `ErrorBoundary` wrapping all routes. If not present, add one:

```typescript
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error?: Error}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', fontFamily: 'DM Mono, monospace', color: '#d0d0e8', background: '#080810', minHeight: '100vh' }}>
          <p style={{ color: '#c94f4f', letterSpacing: '0.1em', fontSize: '11px' }}>ERROR</p>
          <p style={{ marginTop: '12px', fontSize: '13px' }}>{this.state.error?.message || 'Something went wrong.'}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '24px', padding: '10px 20px', background: '#c8b87a', border: 'none', cursor: 'pointer', fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.1em' }}>
            RELOAD
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

---

### 7j — Empty states audit

Check every page and every list component. No page should ever render a blank white area. Every list that can be empty must have an empty state with explanatory text.

Check specifically:
- Signal Pool with no signals
- Hypothesis Board with no hypotheses  
- Contradiction Ledger with no contradictions
- Briefing page before any briefing is generated
- Analytics page with zero cases
- Domain Manager with no domains

---

### 7k — TypeScript strict check

Run:
```
cd apps/api && npx tsc --noEmit
cd apps/web && npx tsc --noEmit
```

Fix any TypeScript errors. Zero errors required before Phase 8.

---

### 7l — Run the full test suite one final time

```
cd apps/api && npm test
```

All 28 tests must still pass after all Phase 7 changes. If any fail, fix before proceeding to Phase 8.

---

## Phase 8 — README

Create `README.md` in the root `C:\cis\` directory.

The README must be clear to someone who has never heard of CIS. No jargon without explanation. No assumptions about prior knowledge.

Write it with these sections in this order:

---

### Section 1 — What this is (4-6 sentences)

CIS is a cognitive intelligence system for structured investigation. It manages observations through a defined lifecycle, detects structural patterns across independent information domains, generates hypotheses about shared causes, and produces auditable cognitive briefings.

Explain the core idea in plain language: most investigation systems try to explain everything they observe. CIS does something different — it specifically preserves and connects observations that resist explanation, because those are often where the important discoveries are.

---

### Section 2 — What it does (bullet list, plain language)

- Submit observations from multiple independent sources
- System scores each observation for structural incongruence — how much does it deviate from what its context would predict
- Observations that resist explanation are preserved and tracked
- When observations from independent domains show the same structural pattern, the system detects the correspondence and generates a hypothesis about a shared hidden cause
- Contradictions are quarantined and tracked — they cannot be silently dismissed
- Full audit trail of every decision: what was submitted, how it was scored, what happened to it, why
- Cognitive briefings summarise the current epistemic state of the investigation at any point

---

### Section 3 — Two operating modes

**AI mode** (requires Anthropic API key): Document intake — paste a paper or report and the system extracts structurally relevant observations automatically. Cross-field synthesis — compare documents from different fields and the system finds structural correspondence between them.

**Manual mode** (no API key needed): All core features work. Observations are entered manually with optional structural tags.

---

### Section 4 — How to run locally

Prerequisites: Node.js 20+, PostgreSQL 16, Git

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd cis

# Install dependencies
npm install

# Set up environment
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env and set DATABASE_URL and optionally ANTHROPIC_API_KEY

# Run database migrations
cd apps/api
npx prisma migrate deploy

# Start API (in one terminal)
npm run dev

# Start frontend (in another terminal)
cd apps/web
npm run dev
```

Frontend runs at `http://localhost:5173`
API runs at `http://localhost:3000`

---

### Section 5 — How to deploy

**API + Database:** Deploy to Railway. Connect your GitHub repository. Add a PostgreSQL service. Set environment variables: `DATABASE_URL` (auto-set by Railway), `ANTHROPIC_API_KEY`, `CORS_ORIGIN` (your Vercel URL).

**Frontend:** Deploy to Vercel. Connect your GitHub repository. Set root directory to `apps/web`. Set environment variable: `VITE_API_URL` (your Railway API URL).

---

### Section 6 — Data and privacy

CIS does not collect personal data. Cases are identified by a random access code — no accounts, no email addresses, no names stored.

The analytics page shows aggregate patterns across all investigations — admission rates, hypothesis confirmation rates, loss point distribution. No case content is included in analytics.

---

### Section 7 — Architecture (one paragraph)

Brief description: three-layer architecture. Layer 1 (operational) manages signals, hypotheses, contradictions, and briefings. Layer 2 (telemetry) preserves the full audit trail — every admission decision, every plausibility update, every contradiction resolution, every score change. Layer 3 (meta-governance) is planned for v2 after the telemetry corpus has accumulated enough data to calibrate it. See `docs/CIS_ARCHITECTURE_LAYERS.md` for the full architectural rationale.

---

After writing the README, verify:
1. A developer who has never seen this project can follow the local setup instructions without help
2. The deploy section matches what `DEPLOYMENT_CONFIG.md` specifies
3. No undefined acronyms (spell out CIS, SHG, HCL, SI on first use)

---

## Done when:

- `npx tsc --noEmit` passes in both apps with zero errors
- `npm test` passes 28/28 in apps/api
- No debug code remains in the codebase
- README exists at `C:\cis\README.md` and is complete
- All empty states render correctly in the browser
