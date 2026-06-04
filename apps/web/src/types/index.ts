export type LifecycleStatus = 'CANDIDATE' | 'ADMITTED' | 'RETAINED' | 'ASSESSED' | 'RESOLVED' | 'ARCHIVED' | 'EXPIRED'
export type EvidenceType = 'SUPPORTING' | 'CONTRADICTING' | 'CONTEXTUAL'
export type ResolutionType = 'RC-1' | 'RC-2' | 'RC-3'
export type HypothesisType = 'HCL' | 'SI_CLUSTER' | 'PATTERN' | 'INVESTIGATOR'
export type HypothesisStatus = 'ACTIVE' | 'CONFIRMED' | 'FALSIFIED' | 'ARCHIVED'
export type LPCode = 'LP-1' | 'LP-2' | 'LP-3' | 'LP-4' | 'LP-5' | 'LP-6' | 'LP-7'

export interface Case {
  id: string
  title: string
  access_code: string
  created_at: string
  last_briefing_at?: string
  stats?: CaseStats
}

export interface CaseStats {
  by_status: Record<string, number>  // lowercase keys: "candidate", "admitted", etc.
  quarantined: number
  connected: number
  wsp_protected: number
}

export interface CaseDetail extends Case {
  domains: Domain[]
  signals?: Signal[]
}

export interface Domain {
  id: string
  case_id: string
  name: string
  description?: string
  signal_count?: number
  independence?: DomainIndependence[]
  created_at: string
}

export interface DomainIndependence {
  domain_a_id: string
  domain_b_id: string
  is_independent: boolean
  independence_basis?: string
}

export interface Signal {
  id: string
  content: string
  case_id: string
  domain_id: string
  lifecycle_status: LifecycleStatus
  is_quarantined: boolean
  is_connected: boolean
  is_wsp_protected: boolean
  si_score: number
  si_rate: number
  si_direction: number
  si_relationship: number
  si_configuration: number
  significance: number
  sig_si: number
  sig_persistence: number
  sig_corroboration: number
  sig_proximity: number
  sig_rarity: number
  sig_relevance: number
  observation_period: number
  mismatch_type?: string
  deviation_direction?: string
  admission_reason?: string
  admitted_at?: string
  created_at: string
  updated_at: string
  domain?: Domain
}

export interface SignalSubmission {
  content: string
  domain_id: string
  observation_period: number
  mismatch_type?: string
  deviation_direction?: string
}

export interface SignalSubmissionResult {
  signal: Signal
  admission: { decision: string; si_threshold: number; sig_threshold: number }
  connections: unknown[]
  hypotheses: unknown[]
  lp_flags: string[]
}

export interface SignalQueryParams {
  status?: string
  domain_id?: string
  min_si?: number
  min_significance?: number
  sort?: string
}

export interface SignalDetail extends Signal {
  events?: SignalEvent[]
  connections?: unknown[]
  contradictions?: unknown[]
}

export interface TransitionResult {
  signal: Signal
}

export interface ScoreUpdate {
  si_score?: number
  significance?: number
  reason: string
}

export interface SignalEvent {
  id: string
  signal_id: string
  from_state?: string
  to_state: string
  reason: string
  lp_flag?: string
  governance_change?: string
  created_at: string
}

export interface Contradiction {
  id: string
  case_id: string
  signal_a_id: string
  signal_b_id: string
  signal_a?: Signal
  signal_b?: Signal
  description: string
  status: 'ACTIVE' | 'RESOLVED'
  resolution_type?: ResolutionType
  resolution_basis?: string
  resolved_signal_id?: string
  resolved_at?: string
  created_at: string
}

export interface ResolutionPayload {
  resolution_type: ResolutionType
  resolution_basis: string
  resolved_signal_id?: string
}

export interface ReleasedOption {
  id: string
  case_id: string
  text: string
  signal_id?: string
  is_active: boolean
  created_at: string
}

export interface ReleasedOptionUpdate {
  is_active?: boolean
  unflag_reason?: string
}

export interface HypothesisEvidence {
  id: string
  hypothesis_id: string
  evidence_type: EvidenceType
  content: string
  weight: number
  signal_id?: string
  plausibility_delta?: number
}

export interface Hypothesis {
  id: string
  case_id: string
  title: string
  description?: string
  hypothesis_type: HypothesisType
  status: HypothesisStatus
  plausibility: number
  connection_id?: string
  competition_set_id?: string
  competition_set_sum?: number | null
  evidence?: HypothesisEvidence[]
  generated_by: 'SHG' | 'INVESTIGATOR'
  created_at: string
  updated_at: string
}

export interface HypothesisPayload {
  title: string
  description?: string
  hypothesis_type: HypothesisType
  connection_id?: string
}

export interface HypothesisQueryParams {
  status?: string
  type?: string
}

export interface EvidencePayload {
  content: string
  evidence_type: EvidenceType
  weight: number
  signal_id?: string
}

export interface EvidenceResult {
  evidence: unknown
  hypothesis: Hypothesis
  plausibility_delta: number
}

export interface PlausibilityHistory {
  id: string
  hypothesis_id: string
  plausibility: number
  reason: string
  recorded_at: string
}

export interface CompetitionSet {
  id: string
  case_id: string
  description: string
  hypothesis_ids: string[]
}

export interface Briefing {
  id: string
  case_id: string
  signals_candidate?: number
  signals_admitted?: number
  signals_retained?: number
  signals_assessed?: number
  signals_resolved?: number
  signals_archived?: number
  signals_expired?: number
  signals_quarantined?: number
  signals_connected?: number
  lp_flags_since_last?: string[]
  summary?: string
  content?: {
    active_signals: Partial<Signal>[]
    active_hypotheses: Partial<Hypothesis>[]
    quarantined: unknown[]
    open_questions: unknown[]
    resolved: unknown[]
    lp_detail: unknown[]
  }
  generated_at: string
}

export interface AnalyticsSnapshot {
  snapshot_at: string
  total_cases: number
  total_signals_submitted: number
  total_signals_admitted: number
  admission_rate: number
  total_hypotheses: number
  total_hypotheses_confirmed: number
  hcl_confirmation_rate: number
  total_contradictions: number
  total_contradictions_resolved: number
  shg_trigger_rate: number
  lp_distribution: Record<string, number>
  avg_si_score: number
  avg_significance: number
}

export interface EventQueryParams {
  signal_id?: string
  lp_flag?: string
  from?: string
  to?: string
}

export interface LPFlagsResponse {
  flags: SignalEvent[]
  since: string
}

export interface SignalCandidate {
  id: string
  text: string
  si_dimension: 'RATE' | 'DIRECTION' | 'RELATIONSHIP' | 'CONFIGURATION' | null
  deviation_direction: 'UP' | 'DOWN' | 'DIVERGING' | 'CONVERGING' | 'STABLE' | null
  observation_period: number | null
  domain_id: string | null
  source_section?: string
  structural_note?: string
  included: boolean
}

export interface Correspondence {
  observation_a: string
  observation_b: string
  correspondence_type: string
  correspondence_strength: number
  structural_note: string
  candidate_shared_cause: string
  observation_period_match: boolean
}

export interface SynthesisResult {
  candidates_a: SignalCandidate[]
  candidates_b: SignalCandidate[]
  correspondences: Correspondence[]
}

export interface ColumnDef {
  column_name: string
  type: 'TIME' | 'MEASUREMENT' | 'IGNORE'
  label?: string
  expected_range?: { min: number; max: number }
}

export interface ConfirmedCandidate {
  text: string
  si_dimension: string
  deviation_direction: string
  observation_period: number
  domain_id: string
  mismatch_type: string
}
