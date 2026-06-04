import prisma from '../prisma.js';

export async function generateBriefing(caseId: string) {
  const c = await prisma.cases.findUniqueOrThrow({ where: { id: caseId } });
  const lpCutoff = c.last_briefing_at ?? c.created_at;

  // Pool status counts — by lifecycle_status + governance flag counts
  const [byStatus, quarantined, connected] = await Promise.all([
    prisma.signals.groupBy({ by: ['lifecycle_status'], where: { case_id: caseId }, _count: true }),
    prisma.signals.count({ where: { case_id: caseId, is_quarantined: true } }),
    prisma.signals.count({ where: { case_id: caseId, is_connected: true } }),
  ]);

  const statusCounts: Record<string, number> = {};
  for (const row of byStatus) statusCounts[row.lifecycle_status] = row._count;

  // Top 5 active signals by significance
  const activeSignals = await prisma.signals.findMany({
    where: { case_id: caseId, lifecycle_status: { in: ['ADMITTED', 'RETAINED', 'ASSESSED'] } },
    orderBy: { significance: 'desc' },
    take: 5,
    select: { id: true, content: true, significance: true, lifecycle_status: true, domain_id: true, si_score: true },
  });

  // Active hypotheses sorted by plausibility
  const activeHypotheses = await prisma.hypotheses.findMany({
    where: { case_id: caseId, status: 'ACTIVE' },
    include: { evidence: { select: { evidence_type: true } } },
    orderBy: { plausibility: 'desc' },
  });

  // Quarantined contradictions
  const quarantinedContradictions = await prisma.contradictions.findMany({
    where: { case_id: caseId, status: 'ACTIVE' },
    select: { id: true, description: true, signal_a_id: true, signal_b_id: true, created_at: true },
  });

  // LP flags since last briefing
  const lpFlags = await prisma.signal_events.findMany({
    where: { case_id: caseId, lp_flag: { not: null }, created_at: { gte: lpCutoff } },
    select: { lp_flag: true, signal_id: true, reason: true, created_at: true },
    orderBy: { created_at: 'desc' },
  });

  // Open questions: high SI with no hypothesis
  const openQuestions = await prisma.signals.findMany({
    where: {
      case_id: caseId,
      lifecycle_status: { in: ['RETAINED', 'ASSESSED'] },
      si_score: { gte: 0.5 },
      is_connected: false,
    },
    orderBy: { si_score: 'desc' },
    take: 10,
    select: { id: true, content: true, si_score: true, significance: true, domain_id: true },
  });

  // Resolved since last briefing
  const resolvedSince = await prisma.signal_events.findMany({
    where: { case_id: caseId, to_status: 'RESOLVED', created_at: { gte: lpCutoff } },
    include: { signal: { select: { id: true, content: true } } },
  });

  // Optional AI narrative summary
  let summary: string | null = null;
  if (process.env.ANTHROPIC_API_KEY && process.env.SHG_MODE !== 'RULE_BASED') {
    try {
      summary = await generateAISummary({ activeSignals, activeHypotheses, lpFlags, quarantinedContradictions });
    } catch {
      // Non-fatal
    }
  }

  const content = {
    active_signals: activeSignals,
    active_hypotheses: activeHypotheses.map(h => ({
      id: h.id, title: h.title, plausibility: Number(h.plausibility), type: h.hypothesis_type,
      supporting: h.evidence.filter(e => e.evidence_type === 'SUPPORTING').length,
      contradicting: h.evidence.filter(e => e.evidence_type === 'CONTRADICTING').length,
    })),
    quarantined: quarantinedContradictions,
    open_questions: openQuestions,
    resolved: resolvedSince.map(e => ({ signal_id: e.signal_id, content: e.signal?.content, resolved_at: e.created_at })),
    lp_detail: lpFlags,
  };

  // Persist briefing
  const briefing = await prisma.briefings.create({
    data: {
      case_id: caseId,
      signals_candidate:   statusCounts['CANDIDATE']  ?? 0,
      signals_admitted:    statusCounts['ADMITTED']   ?? 0,
      signals_retained:    statusCounts['RETAINED']   ?? 0,
      signals_assessed:    statusCounts['ASSESSED']   ?? 0,
      signals_resolved:    statusCounts['RESOLVED']   ?? 0,
      signals_archived:    statusCounts['ARCHIVED']   ?? 0,
      signals_expired:     statusCounts['EXPIRED']    ?? 0,
      signals_quarantined: quarantined,
      signals_connected:   connected,
      lp_flags_since_last: [...new Set(lpFlags.map(f => f.lp_flag as string))],
      summary,
      content,
    },
  });

  // Update last_briefing_at on case
  await prisma.cases.update({
    where: { id: caseId },
    data: { last_briefing_at: new Date() },
  });

  return {
    id: briefing.id,
    pool_status: { ...statusCounts, quarantined, connected },
    lp_flags: [...new Set(lpFlags.map(f => f.lp_flag))],
    summary,
    content,
    generated_at: briefing.generated_at,
  };
}

async function generateAISummary(data: {
  activeSignals: { content: string; significance: number | unknown }[];
  activeHypotheses: { title: string; plausibility: unknown }[];
  lpFlags: { lp_flag: string | null }[];
  quarantinedContradictions: { description: string }[];
}): Promise<string> {
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const client = new Anthropic();

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: `Generate a brief cognitive briefing narrative (2-3 sentences) for an investigator.

Active signals: ${data.activeSignals.length} (top: ${data.activeSignals[0]?.content?.slice(0, 100) ?? 'none'})
Active hypotheses: ${data.activeHypotheses.map(h => `${h.title} (${h.plausibility})`).join(', ') || 'none'}
LP flags: ${data.lpFlags.map(f => f.lp_flag).join(', ') || 'none'}
Quarantined: ${data.quarantinedContradictions.length} contradictions

Write 2-3 sentences summarising the current investigation state. Be precise and factual.`
    }]
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}
