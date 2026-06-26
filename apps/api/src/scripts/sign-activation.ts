/**
 * Sign a constraint activation payload for the currently active constraint set.
 *
 * Reads the active constraint set from constraint-registry, builds the payload,
 * signs it with the offline governance key, and prints the JSON body ready to
 * POST to /api/audit/constraints/activate.
 *
 * Usage:
 *   # With private key in env (for scripted pipelines with a secret manager):
 *   CIS_GOVERNANCE_PRIVATE_KEY=<hex> npx tsx src/scripts/sign-activation.ts
 *
 *   # With private key piped from a secure source (preferred for interactive use):
 *   echo "<hex>" | npx tsx src/scripts/sign-activation.ts
 *
 * The CIS_GOVERNANCE_KEY_VERSION env var identifies which key signed this activation
 * (defaults to "v1"). Bump it when rotating keys.
 *
 * The output JSON is the body for POST /api/audit/constraints/activate.
 * Inspect it before submitting — the payload encodes the exact threshold values
 * and logic digest that will be sealed into the activation chain.
 */

import crypto from 'crypto';
import { buildActivationPayload, type SignedActivation } from '../services/constraint-activation.js';
import { stableSerialize } from '../services/audit-chain.js';

async function main(): Promise<void> {
  const privateKeyHex = process.env.CIS_GOVERNANCE_PRIVATE_KEY
    ?? (await readStdin()).trim();

  if (!privateKeyHex) {
    console.error(
      'ERROR: Private key not provided.\n' +
      '  Set CIS_GOVERNANCE_PRIVATE_KEY env var, or pipe the hex key via stdin.',
    );
    process.exit(1);
  }

  let privateKey: crypto.KeyObject;
  try {
    privateKey = crypto.createPrivateKey({
      key:    Buffer.from(privateKeyHex, 'hex'),
      format: 'der',
      type:   'pkcs8',
    });
  } catch {
    console.error('ERROR: Could not parse private key. Expected hex-encoded DER PKCS8.');
    process.exit(1);
  }

  const signer_key_version = process.env.CIS_GOVERNANCE_KEY_VERSION ?? 'v1';
  const payload   = buildActivationPayload();
  const message   = Buffer.from(stableSerialize(payload), 'utf8');
  const signature = crypto.sign(null, message, privateKey).toString('base64url');

  const result: SignedActivation = { payload, signature, signer_key_version };

  console.log(JSON.stringify(result, null, 2));
  console.error('\n[sign-activation] Payload ready. Review above before posting to /api/audit/constraints/activate');
}

async function readStdin(): Promise<string> {
  if (process.stdin.isTTY) return '';
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
  }
  return Buffer.concat(chunks).toString('utf8');
}

main().catch(err => {
  console.error('ERROR:', err instanceof Error ? err.message : err);
  process.exit(1);
});
