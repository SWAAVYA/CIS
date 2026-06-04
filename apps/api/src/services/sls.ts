import prisma from '../prisma.js';

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

export async function admitSignal(
  signalId: string,
  params: {
    si_score: number;
    significance: number;
    si_threshold: number;
    sig_threshold: number;
  }
): Promise<{ decision: string; reason: string }> {
  const signal = await prisma.signals.findUniqueOrThrow({ where: { id: signalId } });

  // LP-1: SI below minimum — reject entirely
  if (params.si_score < params.si_threshold) {
    const rejectionReason = `SI score ${params.si_score} below SI_min ${params.si_threshold}`;

    await prisma.$transaction(async (tx) => {
      await tx.signals.update({
        where: { id: signalId },
        data: {
          si_score: params.si_score,
          significance: params.significance,
          lifecycle_status: 'EXPIRED',
          rejection_reason: rejectionReason,
          rejection_lp: 'LP-1',
        },
      });
      await tx.admission_audit.create({
        data: {
          signal_id: signalId,
          case_id: signal.case_id,
          decision: 'REJECTED',
          si_score: params.si_score,
          significance: params.significance,
          si_threshold: params.si_threshold,
          sig_threshold: params.sig_threshold,
          rejection_reason: rejectionReason,
        },
      });
      await tx.signal_events.create({
        data: {
          signal_id: signalId,
          case_id: signal.case_id,
          from_status: 'CANDIDATE',
          to_status: 'EXPIRED',
          reason: rejectionReason,
          lp_flag: 'LP-1',
        },
      });
    });

    return { decision: 'REJECTED', reason: rejectionReason };
  }

  // SI meets minimum — admit
  const meetsSignificance = params.significance >= params.sig_threshold;
  const newStatus = meetsSignificance ? 'ADMITTED' : 'ADMITTED'; // both paths admit; significance determines RETAINED
  const decision = meetsSignificance ? 'ADMITTED' : 'SUB_THRESHOLD_RETAINED';
  const admissionReason = meetsSignificance
    ? `SI score ${params.si_score} above SI_min ${params.si_threshold}. Significance ${params.significance} above threshold ${params.sig_threshold}.`
    : `SI score ${params.si_score} above SI_min ${params.si_threshold}. Significance ${params.significance} below threshold ${params.sig_threshold} — admitted per WSP sub-threshold preservation.`;

  await prisma.$transaction(async (tx) => {
    await tx.signals.update({
      where: { id: signalId },
      data: {
        si_score: params.si_score,
        significance: params.significance,
        lifecycle_status: 'ADMITTED',
        is_wsp_protected: true,
        admitted_at: new Date(),
        admission_reason: admissionReason,
      },
    });
    await tx.admission_audit.create({
      data: {
        signal_id: signalId,
        case_id: signal.case_id,
        decision,
        si_score: params.si_score,
        significance: params.significance,
        si_threshold: params.si_threshold,
        sig_threshold: params.sig_threshold,
      },
    });
    await tx.signal_events.create({
      data: {
        signal_id: signalId,
        case_id: signal.case_id,
        from_status: 'CANDIDATE',
        to_status: 'ADMITTED',
        reason: admissionReason,
      },
    });

    // Advance to RETAINED if significance met
    if (meetsSignificance) {
      await tx.signals.update({
        where: { id: signalId },
        data: { lifecycle_status: 'RETAINED' },
      });
      await tx.signal_events.create({
        data: {
          signal_id: signalId,
          case_id: signal.case_id,
          from_status: 'ADMITTED',
          to_status: 'RETAINED',
          reason: `Significance ${params.significance} meets threshold ${params.sig_threshold}`,
        },
      });
    }
  });

  return { decision, reason: admissionReason };
}
