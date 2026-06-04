import type {
  Case,
  Domain,
  DomainIndependence,
  Signal,
  SignalSubmission,
  SignalSubmissionResult,
  SignalQueryParams,
  SignalDetail,
  ScoreUpdate,
  Contradiction,
  ResolutionPayload,
  ReleasedOption,
  ReleasedOptionUpdate,
  Hypothesis,
  HypothesisPayload,
  HypothesisQueryParams,
  EvidencePayload,
  EvidenceResult,
  PlausibilityHistory,
  CompetitionSet,
  Briefing,
  AnalyticsSnapshot,
  EventQueryParams,
  SignalEvent,
  LPFlagsResponse,
  SignalCandidate,
  SynthesisResult,
  ColumnDef,
  ConfirmedCandidate,
} from '../types'

const BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API error ${res.status}: ${text}`)
  }
  return res.json() as Promise<T>
}

// Cases
export const createCase = (title: string) =>
  request<Case>('/api/cases', { method: 'POST', body: JSON.stringify({ title }) })

export const getCase = (id: string) =>
  request<Case>(`/api/cases/${id}`)

export const getCaseByCode = (code: string) =>
  request<Case>(`/api/cases/by-code/${code}`)

export const closeCase = (id: string) =>
  request<Case>(`/api/cases/${id}/close`, { method: 'PATCH' })

// Domains
export const createDomain = (caseId: string, name: string, description?: string) =>
  request<Domain>(`/api/cases/${caseId}/domains`, {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  })

export const getDomains = (caseId: string) =>
  request<Domain[]>(`/api/cases/${caseId}/domains`)

export const declareIndependence = (
  caseId: string,
  domain_a_id: string,
  domain_b_id: string,
  is_independent: boolean,
  independence_basis?: string,
) =>
  request<DomainIndependence>(`/api/cases/${caseId}/domains/independence`, {
    method: 'POST',
    body: JSON.stringify({ domain_a_id, domain_b_id, is_independent, independence_basis }),
  })

// Signals
export const submitSignal = (caseId: string, data: SignalSubmission) =>
  request<SignalSubmissionResult>(`/api/cases/${caseId}/signals`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const getSignals = (caseId: string, params?: SignalQueryParams) => {
  const qs = params
    ? '?' + new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)]))
      ).toString()
    : ''
  return request<Signal[]>(`/api/cases/${caseId}/signals${qs}`)
}

export const getSignal = (id: string) =>
  request<SignalDetail>(`/api/signals/${id}`)

export const transitionSignal = (id: string, to_status: string, reason: string) =>
  request<Signal>(`/api/signals/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ to_status, reason }),
  })

export const updateSignalScores = (id: string, data: ScoreUpdate) =>
  request<Signal>(`/api/signals/${id}/scores`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

// Contradictions
export const createContradiction = (
  caseId: string,
  signal_a_id: string,
  signal_b_id: string,
  description: string,
) =>
  request<Contradiction>(`/api/cases/${caseId}/contradictions`, {
    method: 'POST',
    body: JSON.stringify({ signal_a_id, signal_b_id, description }),
  })

export const getContradictions = (caseId: string) =>
  request<Contradiction[]>(`/api/cases/${caseId}/contradictions`)

export const resolveContradiction = (id: string, data: ResolutionPayload) =>
  request<Contradiction>(`/api/contradictions/${id}/resolve`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

// Released Options
export const createReleasedOption = (caseId: string, text: string, signal_id?: string) =>
  request<ReleasedOption>(`/api/cases/${caseId}/released-options`, {
    method: 'POST',
    body: JSON.stringify({ text, signal_id }),
  })

export const getReleasedOptions = (caseId: string) =>
  request<ReleasedOption[]>(`/api/cases/${caseId}/released-options`)

export const updateReleasedOption = (id: string, data: ReleasedOptionUpdate) =>
  request<ReleasedOption>(`/api/released-options/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

// Hypotheses
export const createHypothesis = (caseId: string, data: HypothesisPayload) =>
  request<Hypothesis>(`/api/cases/${caseId}/hypotheses`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const getHypotheses = (caseId: string, params?: HypothesisQueryParams) => {
  const qs = params
    ? '?' + new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)]))
      ).toString()
    : ''
  return request<Hypothesis[]>(`/api/cases/${caseId}/hypotheses${qs}`)
}

export const addEvidence = (hypothesisId: string, data: EvidencePayload) =>
  request<EvidenceResult>(`/api/hypotheses/${hypothesisId}/evidence`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const getPlausibilityHistory = (hypothesisId: string) =>
  request<PlausibilityHistory[]>(`/api/hypotheses/${hypothesisId}/plausibility-history`)

export const resolveHypothesis = (
  hypothesisId: string,
  status: string,
  resolution_basis: string,
) =>
  request<Hypothesis>(`/api/hypotheses/${hypothesisId}/resolve`, {
    method: 'PATCH',
    body: JSON.stringify({ status, resolution_basis }),
  })

// Competition Sets
export const createCompetitionSet = (caseId: string, description: string, hypothesis_ids: string[]) =>
  request<CompetitionSet>(`/api/cases/${caseId}/competition-sets`, {
    method: 'POST',
    body: JSON.stringify({ description, hypothesis_ids }),
  })

export const normaliseCompetitionSet = (setId: string) =>
  request<{ hypotheses: Hypothesis[] }>(`/api/competition-sets/${setId}/normalise`, {
    method: 'POST',
  })

// Briefings
export const generateBriefing = (caseId: string) =>
  request<Briefing>(`/api/cases/${caseId}/briefings`, { method: 'POST' })

export const getBriefings = (caseId: string) =>
  request<Briefing[]>(`/api/cases/${caseId}/briefings`)

export const getBriefing = (id: string) =>
  request<Briefing>(`/api/cases/briefings/${id}`)

// Analytics
export const getAnalytics = () =>
  request<AnalyticsSnapshot>('/api/analytics')

// Events & LP Flags
export const getCaseEvents = (caseId: string, params?: EventQueryParams) => {
  const qs = params
    ? '?' + new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)]))
      ).toString()
    : ''
  return request<{ events: SignalEvent[]; page: number; limit: number }>(`/api/cases/${caseId}/events${qs}`)
    .then(r => r.events)
}

export const getLPFlags = (caseId: string, since?: string) => {
  const qs = since ? `?since=${encodeURIComponent(since)}` : ''
  return request<LPFlagsResponse>(`/api/cases/${caseId}/lp-flags${qs}`)
    .then(r => r.flags)
}

// Intake extension
export const extractFromDocument = (caseId: string, content: string) =>
  request<{ candidates: SignalCandidate[] }>(`/api/cases/${caseId}/intake/document`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })

export const analyzeData = (caseId: string, csv: string, column_definitions: ColumnDef[]) =>
  request<{ candidates: SignalCandidate[] }>(`/api/cases/${caseId}/intake/data`, {
    method: 'POST',
    body: JSON.stringify({ csv, column_definitions }),
  })

export const synthesizeFields = (
  caseId: string,
  domain_a: { domain_id: string; content: string },
  domain_b: { domain_id: string; content: string }
) =>
  request<SynthesisResult>(`/api/cases/${caseId}/intake/synthesize`, {
    method: 'POST',
    body: JSON.stringify({ domain_a, domain_b }),
  })

export const confirmCandidates = (caseId: string, candidates: ConfirmedCandidate[]) =>
  request<{ submitted: number; signals: Signal[]; lp_flags: string[][] }>(
    `/api/cases/${caseId}/intake/confirm`,
    { method: 'POST', body: JSON.stringify({ candidates }) }
  )
