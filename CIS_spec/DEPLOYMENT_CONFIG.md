# Deployment Configuration

## Services

| Service | Platform | What it runs |
|---------|---------|-------------|
| API | Railway | Express + Prisma |
| Database | Railway (managed Postgres) | PostgreSQL 16 |
| Frontend | Vercel | React static build |

## Railway Setup

### 1. Create project
- New project → Deploy from GitHub repo
- Add PostgreSQL service to the project
- Railway auto-sets DATABASE_URL in API service

### 2. API service environment variables
```
DATABASE_URL          # set automatically by Railway Postgres
ANTHROPIC_API_KEY     # set manually — sk-ant-...
CORS_ORIGIN           # your Vercel URL — https://cr-governance.vercel.app
NODE_ENV              # production
PORT                  # 3000 (Railway sets this automatically)
```

### 3. railway.json (repo root)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "apps/api/Dockerfile"
  },
  "deploy": {
    "startCommand": "node dist/index.js",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 30,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### 4. apps/api/Dockerfile
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
RUN npm ci --workspace=apps/api
COPY apps/api ./apps/api
RUN cd apps/api && npx prisma generate && npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/prisma ./prisma
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

---

## Vercel Setup

### 1. Import GitHub repo to Vercel
- Root directory: `apps/web`
- Build command: `npm run build`
- Output directory: `dist`
- Framework: Vite

### 2. Environment variables
```
VITE_API_URL    # https://your-api.railway.app
```

---

## GitHub Actions

### .github/workflows/deploy-api.yml
```yaml
name: Deploy API

on:
  push:
    branches: [main]
    paths: ['apps/api/**', 'packages/shared/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Railway CLI
        run: npm install -g @railway/cli
      - name: Deploy to Railway
        run: railway up --service api
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### .github/workflows/deploy-web.yml
```yaml
name: Deploy Web

on:
  push:
    branches: [main]
    paths: ['apps/web/**', 'packages/shared/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: apps/web
          vercel-args: '--prod'
```

---

## GitHub Secrets Required

```
RAILWAY_TOKEN       # From Railway account settings → tokens
VERCEL_TOKEN        # From Vercel account settings → tokens
VERCEL_ORG_ID       # From Vercel project settings
VERCEL_PROJECT_ID   # From Vercel project settings
```

---

## Migrations

Prisma migrations run automatically on startup:

In `apps/api/src/index.ts` startup sequence:
```typescript
await prisma.$executeRaw`SELECT 1`; // health check
await exec('npx prisma migrate deploy'); // run pending migrations
```

Or via Railway deploy command:
```
npx prisma migrate deploy && node dist/index.js
```

---

## Analytics Refresh

Schedule via Railway cron or a simple setInterval in the API:
```typescript
// Refresh analytics snapshot every hour
setInterval(async () => {
  await prisma.$executeRaw`SELECT refresh_analytics_snapshot()`;
}, 60 * 60 * 1000);
```

---

## Health Check

`GET /health` returns:
```json
{ "status": "ok", "db": "connected", "timestamp": "..." }
```

Railway uses this for zero-downtime deploys.
