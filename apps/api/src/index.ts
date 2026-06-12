// build cache bust 2026-06-06
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import prisma from './prisma.js';
import casesRouter from './routes/cases.js';
import domainsRouter from './routes/domains.js';
import signalsRouter from './routes/signals.js';
import contradictionsRouter from './routes/contradictions.js';
import hypothesesRouter from './routes/hypotheses.js';
import briefingsRouter from './routes/briefings.js';
import analyticsRouter from './routes/analytics.js';
import intakeRouter from './routes/intake.js';
import auditRouter from './routes/audit.js';
import { startJobs } from './jobs/index.js';

const required = ['DATABASE_URL'];
const missing = required.filter(key => !process.env[key]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn('ANTHROPIC_API_KEY not set — AI features will be unavailable');
}

const app = express();
const PORT = parseInt(process.env.PORT ?? '3000', 10);

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN ?? '*' }));

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

app.use(express.json());

const casesLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false });
const signalsLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 60, standardHeaders: true, legacyHeaders: false });
const intakeLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });
const analyticsLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 60, standardHeaders: true, legacyHeaders: false });

app.post('/api/cases', casesLimiter);
app.post('/api/cases/:id/signals', signalsLimiter);
app.use('/api/cases/:id/intake', intakeLimiter);
app.get('/api/analytics', analyticsLimiter);

app.get('/health', async (_req, res) => {
  try {
    await prisma.$executeRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('[health] DB check failed:', err);
    res.status(503).json({ status: 'error', db: 'disconnected', error: String(err), timestamp: new Date().toISOString() });
  }
});

app.use('/api/cases', casesRouter);
app.use('/api/cases', domainsRouter);
app.use('/api/cases', signalsRouter);
app.use('/api/signals', signalsRouter);
app.use('/api/cases', contradictionsRouter);
app.use('/api/contradictions', contradictionsRouter);
app.use('/api/released-options', contradictionsRouter);
app.use('/api/cases', hypothesesRouter);
app.use('/api/hypotheses', hypothesesRouter);
app.use('/api/competition-sets', hypothesesRouter);
app.use('/api/cases', briefingsRouter);
app.use('/api/briefings', briefingsRouter);
app.use('/api/cases/:id/intake', intakeRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/audit', auditRouter);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    code: err.code || 'SERVER_ERROR',
    status: err.status || 500
  });
});

const server = app.listen(PORT, () => {
  console.log(`CIS API listening on port ${PORT}`);
  if (process.env.NODE_ENV !== 'test') startJobs();
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close();
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
