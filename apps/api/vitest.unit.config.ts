import { defineConfig } from 'vitest/config';
import { config } from 'dotenv';

config({ path: '.env' });

// Unit test config — no database setup file.
// Run with: npm run test:unit
// Covers pure-logic tests (gate middleware, decision function, hash/sig primitives).
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.unit.test.ts', 'tests/invariants-activation-unit.test.ts'],
    testTimeout: 10000,
    hookTimeout: 10000,
    pool: 'forks',
    poolOptions: {
      forks: { singleFork: true }
    }
  }
});
