/**
 * CIS → DEL Anchor Client
 *
 * After sealing a CIS constraint activation, registers its hash with the DEL
 * storage chronology so it becomes independently verifiable outside the CIS host.
 *
 * Spec: CIS_DEL_WIRING_SPEC.md §2.1–2.2
 *
 * Environment:
 *   DEL_SERVICE_URL       — base URL of the DEL server (e.g. http://localhost:3002)
 *                           If unset, anchoring is skipped with a logged warning.
 *   DEL_ANCHOR_API_KEY    — pre-shared key matching CIS_ANCHOR_API_KEY on the DEL side.
 *                           Sent as X-CIS-Anchor-Key header. Required when DEL_SERVICE_URL is set.
 *   DEL_ANCHOR_TIMEOUT_MS — HTTP call timeout in ms (default 5000)
 */

export type DelAnchorStatus = 'anchored' | 'pending' | 'skipped';

export interface DelAnchorResult {
  status:               DelAnchorStatus;
  del_entry_id?:        string;
  del_chronology_hash?: string;
  anchored_at?:         number;
  error?:               string;
}

export interface DelAnchorEntry {
  del_entry_id:        string;
  del_chronology_hash: string;
  anchored_at:         number;
  cis_activation_hash: string;
  cis_seq:             number;
  constraint_version:  string;
  logic_digest:        string;
  activated_at:        string;
}

function resolveDelUrl(): string | null {
  const raw = process.env.DEL_SERVICE_URL?.trim();
  if (!raw) return null;
  // Reject non-http(s) schemes — file://, ftp://, etc. would be passed to fetch()
  // and either fail silently (caught as 'pending') or be exploitable as SSRF pivots.
  if (!/^https?:\/\//i.test(raw)) {
    console.error(`[del-anchor] DEL_SERVICE_URL has an invalid scheme (expected http:// or https://): ${raw}`);
    return null;
  }
  return raw.replace(/\/$/, '');
}

function resolveAnchorApiKey(): string | null {
  return process.env.DEL_ANCHOR_API_KEY?.trim() || null;
}

function resolveTimeout(): number {
  const raw = process.env.DEL_ANCHOR_TIMEOUT_MS?.trim();
  const n = raw ? parseInt(raw, 10) : NaN;
  const resolved = Number.isFinite(n) && n > 0 ? n : 5000;
  return Math.min(resolved, 30_000); // 30 s hard cap — prevents accidental multi-hour blocks
}

// ─── Anchor (write) ───────────────────────────────────────────────────────────

export async function anchorActivationInDEL(params: {
  cis_activation_hash: string;
  cis_seq:             number;
  constraint_version:  string;
  logic_digest:        string;
  activated_at:        string;
}): Promise<DelAnchorResult> {
  const baseUrl = resolveDelUrl();
  if (!baseUrl) {
    console.warn('[del-anchor] DEL_SERVICE_URL not configured — CIS activation not anchored in DEL chronology');
    return { status: 'skipped' };
  }

  const apiKey = resolveAnchorApiKey();
  if (!apiKey) {
    console.warn('[del-anchor] DEL_ANCHOR_API_KEY not configured — skipping DEL anchor (set alongside DEL_SERVICE_URL)');
    return { status: 'skipped' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), resolveTimeout());

  try {
    const resp = await fetch(`${baseUrl}/api/cis-anchor/activation`, {
      method:  'POST',
      headers: {
        'Content-Type':    'application/json',
        'X-CIS-Anchor-Key': apiKey,
      },
      body:    JSON.stringify(params),
      signal:  controller.signal,
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      console.warn(`[del-anchor] POST /api/cis-anchor/activation returned ${resp.status}: ${text}`);
      return { status: 'pending', error: `DEL responded ${resp.status}: ${text}` };
    }

    const json = await resp.json() as { anchor: DelAnchorEntry };
    const a = json.anchor;

    // Verify the DEL response actually references the hash we sent
    if (a.cis_activation_hash !== params.cis_activation_hash) {
      console.warn(`[del-anchor] DEL returned anchor for ${a.cis_activation_hash.slice(0, 12)}... but we sent ${params.cis_activation_hash.slice(0, 12)}...`);
      return { status: 'pending', error: 'DEL response hash mismatch' };
    }

    return {
      status:               'anchored',
      del_entry_id:         a.del_entry_id,
      del_chronology_hash:  a.del_chronology_hash,
      anchored_at:          a.anchored_at,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[del-anchor] POST /api/cis-anchor/activation failed: ${msg}`);
    return { status: 'pending', error: msg };
  } finally {
    clearTimeout(timer);
  }
}

// ─── Lookup (read) ────────────────────────────────────────────────────────────

export async function fetchDELAnchorForHash(cisHash: string): Promise<DelAnchorEntry | null> {
  const baseUrl = resolveDelUrl();
  if (!baseUrl) return null;
  const apiKey = resolveAnchorApiKey();
  if (!apiKey) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), resolveTimeout());

  try {
    const resp = await fetch(`${baseUrl}/api/cis-anchor/activation/${encodeURIComponent(cisHash)}`, {
      headers: { 'X-CIS-Anchor-Key': apiKey },
      signal: controller.signal,
    });
    if (resp.status === 404) return null;
    if (!resp.ok) {
      console.warn(`[del-anchor] GET /api/cis-anchor/activation/${cisHash} returned ${resp.status}`);
      return null;
    }
    const json = await resp.json() as { anchor: DelAnchorEntry };
    return json.anchor;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[del-anchor] GET failed for ${cisHash}: ${msg}`);
    return null;
  } finally {
    clearTimeout(timer);
  }
}
