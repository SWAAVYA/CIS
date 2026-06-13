import prisma from '../prisma.js';
import { recomputeCaseFrameState } from './frame-graph.js';

const WSP_MIN_PERIODS = parseInt(process.env.WSP_MIN_PERIODS ?? '2', 10);
const SI_MIN_THRESHOLD = parseFloat(process.env.SI_MIN_THRESHOLD ?? '0.25');
const SIG_THRESHOLD = parseFloat(process.env.SIG_THRESHOLD ?? '0.55');

// Valid transitions — EXPIRED is terminal (enforced here, not in DB)
const VALID_TRANSITIONS: Record<string, string[]> = {
  CANDIDATE: ['ADMITTED', 'EXPIRED'],
  ADMITTED:  ['RETAINED', 'EXPIRED'],
  RETAINED:  ['ASSESSED', 'RESOLVED', 'EXPIRED'],
  ASSESSED:  ['RESOLVED', 'RETAINED'],
  RESOLVED:  ['ARCHIVED'],
  ARCHIVED:  ['CANDIDATE'],
  EXPIRED:   [],  // terminal — no transitions permitted
};

type TransitionResult =
  | { permitted: true }
  | { permitted: false; code: string; lp?: string; reason: string };

export async function transitionSignal(
  signalId: string,
  toStatus: string,
  reason: string,
  jobRunId?: string
): Promise<TransitionResult> {
  const signal = await prisma.signals.findUniqueOrThrow({ where: { id: signalId } });

  // Terminal state enforcement (INV-1.3)
  const allowed = VALID_TRANSITIONS[signal.lifecycle_status] ?? [];
  if (!allowed.includes(toStatus)) {
    return {
      permitted: false,
      code: 'INVALID_TRANSITION',
      reason: `${signal.lifecycle_status} → ${toStatus} is not a valid transition`,
    };
  }

  // Governance: quarantine blocks EXPIRED and RESOLVED (INV-3.1, INV-3.2)
  if (signal.is_quarantined && (toStatus === 'EXPIRED' || toStatus === 'RESOLVED')) {
    return {
      permitted: false,
      code: 'QUARANTINE_ACTIVE',
      reason: 'Signal is quarantined — resolve contradiction first',
    };
  }

  // Governance: WSP protection blocks EXPIRED (INV-2.1, INV-2.2)
  if (signal.is_wsp_protected && toStatus === 'EXPIRED') {
    // Count only actual lifecycle transitions: from_status IS NOT NULL (excludes initial CANDIDATE creation)
    // AND governance_change IS NULL (excludes flag-change events like is_connected, is_wsp_protected)
    const eventCount = await prisma.signal_events.count({
      where: { signal_id: signalId, from_status: { not: null }, governance_change: null },
    });
    if (eventCount < WSP_MIN_PERIODS) {
      return {
        permitted: false,
        code: 'WSP_PROTECTION_ACTIVE',
        lp: 'LP-2',
        reason: `Signal has only been through ${eventCount} observation period(s); minimum is ${WSP_MIN_PERIODS}`,
      };
    }
    // Minimum met — clear protection
    await prisma.signals.update({
      where: { id: signalId },
      data: { is_wsp_protected: false },
    });
    await prisma.signal_events.create({
      data: {
        signal_id: signalId,
        case_id: signal.case_id,
        from_status: signal.lifecycle_status,
        to_status: signal.lifecycle_status,
        governance_change: 'is_wsp_protected: TRUE → FALSE',
        reason: 'WSP minimum retention period met',
        job_run_id: jobRunId ?? null,
      },
    });
  }

  // Execute transition
  await prisma.signals.update({
    where: { id: signalId },
    data: { lifecycle_status: toStatus },
  });

  await prisma.signal_events.create({
    data: {
      signal_id: signalId,
      case_id: signal.case_id,
      from_status: signal.lifecycle_status,
      to_status: toStatus,
      reason,
      job_run_id: jobRunId ?? null,
    },
  });

  // When an admitted signal is manually expired, recompute frame state so
  // sig_counts and c_value reflect the current active signal population.
  const wasActive = ['ADMITTED', 'RETAINED', 'ASSESSED', 'RESOLVED'].includes(signal.lifecycle_status);
  if (toStatus === 'EXPIRED' && wasActive) {
    recomputeCaseFrameState(signal.case_id).catch(err =>
      console.warn('[sls] frame recompute after expire failed:', err instanceof Error ? err.message : err)
    );
  }

  return { permitted: true };
}

export async function resolveContradiction(
  contradictionId: string,
  params: {
    resolution_type: string | null;
    resolution_basis: string;
    resolved_signal_id: string;
  }
): Promise<void> {
  if (!params.resolution_type || !['RC-1', 'RC-2', 'RC-3'].includes(params.resolution_type)) {
    throw new Error('resolution_type required — must be RC-1, RC-2, or RC-3');
  }

  const contradiction = await prisma.contradictions.findUniqueOrThrow({
    where: { id: contradictionId },
  });

  if (contradiction.status === 'RESOLVED') {
    throw new Error('Contradiction is already resolved');
  }

  await prisma.$transaction(async (tx) => {
    await tx.contradictions.update({
      where: { id: contradictionId },
      data: {
        status: 'RESOLVED',
        resolution_type: params.resolution_type,
        resolution_basis: params.resolution_basis,
        resolved_signal_id: params.resolved_signal_id,
        resolved_at: new Date(),
      },
    });

    // Clear quarantine on both signals and record governance events
    for (const sigId of [contradiction.signal_a_id, contradiction.signal_b_id]) {
      const sig = await tx.signals.findUniqueOrThrow({ where: { id: sigId } });
      await tx.signals.update({
        where: { id: sigId },
        data: { is_quarantined: false },
      });
      await tx.signal_events.create({
        data: {
          signal_id: sigId,
          case_id: sig.case_id,
          from_status: sig.lifecycle_status,
          to_status: sig.lifecycle_status,
          governance_change: 'is_quarantined: TRUE → FALSE',
          reason: `Contradiction resolved via ${params.resolution_type}: ${params.resolution_basis}`,
        },
      });
    }
  });
}

export async function updateSignalScores(
  signalId: string,
  params: {
    si_score?: number;
    si_rate?: number;
    si_direction?: number;
    si_relationship?: number;
    si_configuration?: number;
    significance?: number;
    reason: string;
  }
): Promise<void> {
  if (!params.reason || params.reason.trim() === '') {
    throw new Error('reason required — reason cannot be empty');
  }

  const signal = await prisma.signals.findUniqueOrThrow({ where: { id: signalId } });

  await prisma.$transaction(async (tx) => {
    await tx.score_change_audit.create({
      data: {
        signal_id: signalId,
        case_id: signal.case_id,
        changed_by: 'INVESTIGATOR',
        before_si_score: signal.si_score,
        after_si_score:  params.si_score  ?? signal.si_score,
        before_si_rate:        signal.si_rate,
        after_si_rate:         params.si_rate        ?? signal.si_rate,
        before_si_direction:   signal.si_direction,
        after_si_direction:    params.si_direction   ?? signal.si_direction,
        before_si_relationship: signal.si_relationship,
        after_si_relationship:  params.si_relationship ?? signal.si_relationship,
        before_si_configuration: signal.si_configuration,
        after_si_configuration:  params.si_configuration ?? signal.si_configuration,
        before_significance: signal.significance,
        after_significance:  params.significance ?? signal.significance,
        reason: params.reason,
      },
    });

    const updates: Record<string, unknown> = {};
    if (params.si_score       !== undefined) updates.si_score       = params.si_score;
    if (params.si_rate        !== undefined) updates.si_rate        = params.si_rate;
    if (params.si_direction   !== undefined) updates.si_direction   = params.si_direction;
    if (params.si_relationship !== undefined) updates.si_relationship = params.si_relationship;
    if (params.si_configuration !== undefined) updates.si_configuration = params.si_configuration;
    if (params.significance   !== undefined) updates.significance   = params.significance;

    await tx.signals.update({ where: { id: signalId }, data: updates });
  });
}

