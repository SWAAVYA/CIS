/**
 * Generate an Ed25519 governance key pair for constraint activation signing.
 *
 * Run ONCE, OFFLINE, before the first genesis activation.
 * Not invoked during normal process startup.
 *
 * Output:
 *   PUBLIC KEY HEX  — put this in CIS_GOVERNANCE_PUBLIC_KEY env var (safe to commit to config)
 *   PRIVATE KEY HEX — keep offline, pass to sign-activation.ts at signing time; never in env
 *
 * Usage:
 *   npx tsx src/scripts/generate-activation-key.ts
 */

import crypto from 'crypto';

const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
  publicKeyEncoding:  { type: 'spki',  format: 'der' },
  privateKeyEncoding: { type: 'pkcs8', format: 'der' },
});

console.log('=== CIS GOVERNANCE KEY PAIR ===\n');
console.log('PUBLIC KEY HEX (→ CIS_GOVERNANCE_PUBLIC_KEY in runtime env):');
console.log(publicKey.toString('hex'));
console.log();
console.log('PRIVATE KEY HEX (→ keep offline; never store in env or version control):');
console.log(privateKey.toString('hex'));
console.log();
console.log('WARNING: The private key authorizes constraint governance acts.');
console.log('         Store it offline. Losing it requires a key rotation activation.');
