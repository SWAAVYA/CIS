/**
 * Residual Population Layer (EE_CIS_POPULATION_v1.0)
 *
 * Orthogonal to the Residual Graph (v1.3). Shared object: residual_instance.
 * Answers: how does a residual type spread? (not: what happens to this residual?)
 *
 * Critical path: propagation event capture — every interesting population
 * quantity (birth rate, reproduction rate, challenge lag, extinction rate)
 * depends on this event stream existing.
 */
import prisma from '../prisma.js';

export type PropagationChannel =
  | 'publication' | 'documentary' | 'lecture' | 'citation'
  | 'derivative_work' | 'social_media' | 'other';

export type AttributionCategory = 'direct' | 'indirect' | 'independent';

export type EvidenceBasis =
  | 'same_author' | 'shared_framework' | 'temporal_ordering'
  | 'explicit_reference' | 'explicit_citation' | 'shared_channel'
  | 'structural_similarity' | 'derivative_work';

export type EcologyClass = 'compelled' | 'incentivized' | 'voluntary' | 'none';

// ── Propagation Events ───────────────────────────────────────────────────────

export async function recordPropagationEvent(data: {
  source_instance_id: string;
  target_instance_id: string;
  propagation_channel: PropagationChannel;
  attribution_confidence: number;
  attribution_category: AttributionCategory;
  evidence_basis?: EvidenceBasis[];
  occurred_at?: Date;
  recorded_by?: string;
  notes?: string;
}) {
  if (data.source_instance_id === data.target_instance_id) {
    throw new Error('source and target instance must differ');
  }
  if (data.attribution_confidence < 0 || data.attribution_confidence > 1) {
    throw new Error('attribution_confidence must be in [0, 1]');
  }
  return prisma.residual_propagation_event.create({
    data: { ...data, evidence_basis: data.evidence_basis ?? [] },
  });
}

export async function listPropagationEvents(opts: {
  source_instance_id?: string;
  target_instance_id?: string;
  min_confidence?: number;
  category?: AttributionCategory;
}) {
  return prisma.residual_propagation_event.findMany({
    where: {
      ...(opts.source_instance_id && { source_instance_id: opts.source_instance_id }),
      ...(opts.target_instance_id && { target_instance_id: opts.target_instance_id }),
      ...(opts.min_confidence !== undefined && {
        attribution_confidence: { gte: opts.min_confidence },
      }),
      ...(opts.category && { attribution_category: opts.category }),
    },
    include: {
      source_instance: { include: { residual_type: true } },
      target_instance: { include: { residual_type: true } },
    },
    orderBy: { occurred_at: 'desc' },
  });
}

// ── Population Stats ─────────────────────────────────────────────────────────

export interface PopulationStats {
  type_id: string;
  code: string;
  name: string;
  type_weight: number;
  population_size: number;
  births_30d: number;
  deaths_30d: number;
  weighted_births_30d: number;
  mean_instance_weight: number | null;
  total_open_debt: number | null;
  total_instances_ever: number;
  net_growth_rate_30d: number;
  population_state: 'growing' | 'stable' | 'declining' | 'extinct';
}

const GROWTH_THRESHOLD = 0.1; // instances/month

export async function getPopulationStats(typeId?: string): Promise<PopulationStats[]> {
  const rows = await prisma.$queryRaw<Array<{
    type_id: string;
    code: string;
    name: string;
    type_weight: number;
    population_size: bigint;
    births_30d: bigint;
    deaths_30d: bigint;
    weighted_births_30d: number | null;
    mean_instance_weight: number | null;
    total_open_debt: number | null;
    total_instances_ever: bigint;
  }>>`
    SELECT * FROM residual_population_stats
    ${typeId ? prisma.$queryRaw`WHERE type_id = ${typeId}::uuid` : prisma.$queryRaw``}
    ORDER BY code
  `;

  return rows.map(r => {
    const births = Number(r.births_30d);
    const deaths = Number(r.deaths_30d);
    const netGrowth = births - deaths;
    const popSize = Number(r.population_size);

    let population_state: PopulationStats['population_state'];
    if (popSize === 0) {
      population_state = 'extinct';
    } else if (netGrowth > GROWTH_THRESHOLD) {
      population_state = 'growing';
    } else if (netGrowth < -GROWTH_THRESHOLD) {
      population_state = 'declining';
    } else {
      population_state = 'stable';
    }

    return {
      type_id: r.type_id,
      code: r.code,
      name: r.name,
      type_weight: Number(r.type_weight),
      population_size: popSize,
      births_30d: births,
      deaths_30d: deaths,
      weighted_births_30d: Number(r.weighted_births_30d ?? 0),
      mean_instance_weight: r.mean_instance_weight !== null ? Number(r.mean_instance_weight) : null,
      total_open_debt: r.total_open_debt !== null ? Number(r.total_open_debt) : null,
      total_instances_ever: Number(r.total_instances_ever),
      net_growth_rate_30d: netGrowth,
      population_state,
    };
  });
}

// ── Reproduction Dynamics ─────────────────────────────────────────────────────

export interface ReproductionDynamics {
  type_id: string;
  code: string;
  propagation_edge_count: number;
  // Same-type edges only (reproduction proper)
  reproduction_edge_count: number;
  // Cross-type edges (propagation-derived innovation)
  innovation_edge_count: number;
  mean_reproduction_interval_days: number | null;
  median_reproduction_interval_days: number | null;
  // challenge_lag: mean days from instance birth to first intervention
  mean_challenge_lag_days: number | null;
  // reproduction_advantage = reproduction_interval / challenge_lag
  // > 1: reproduces faster than challenged (population growing under intervention pressure)
  // < 1: challenged faster than it reproduces (population contracting)
  // null: insufficient data
  reproduction_advantage: number | null;
}

export async function getReproductionDynamics(typeId: string): Promise<ReproductionDynamics> {
  const type = await prisma.residual_type.findUniqueOrThrow({ where: { id: typeId } });

  // All propagation events where source is of this type
  const edges = await prisma.$queryRaw<Array<{
    source_type_id: string;
    target_type_id: string;
    occurred_at: Date | null;
    source_created_at: Date;
    target_created_at: Date;
  }>>`
    SELECT
      src_rt.id   AS source_type_id,
      tgt_rt.id   AS target_type_id,
      rpe.occurred_at,
      src_ri.created_at AS source_created_at,
      tgt_ri.created_at AS target_created_at
    FROM residual_propagation_event rpe
    JOIN residual_instance src_ri ON src_ri.id = rpe.source_instance_id
    JOIN residual_instance tgt_ri ON tgt_ri.id = rpe.target_instance_id
    JOIN residual_type src_rt ON src_rt.id = src_ri.residual_type_id
    JOIN residual_type tgt_rt ON tgt_rt.id = tgt_ri.residual_type_id
    WHERE src_ri.residual_type_id = ${typeId}::uuid
    AND rpe.attribution_category IN ('direct', 'indirect')
  `;

  const reproEdges = edges.filter(e => e.source_type_id === e.target_type_id);
  const innovEdges = edges.filter(e => e.source_type_id !== e.target_type_id);

  // Reproduction interval: days between source birth and target birth (or occurrence date)
  const intervals = reproEdges.map(e => {
    const ref = e.occurred_at ?? e.target_created_at;
    return (ref.getTime() - e.source_created_at.getTime()) / 86_400_000;
  }).filter(d => d > 0);

  const meanInterval = intervals.length > 0
    ? intervals.reduce((a, b) => a + b, 0) / intervals.length
    : null;

  const sorted = [...intervals].sort((a, b) => a - b);
  const medianInterval = sorted.length > 0
    ? sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)]
    : null;

  // Challenge lag: days from instance birth to first intervention attempt for instances of this type
  const lagRows = await prisma.$queryRaw<Array<{ lag_days: number }>>`
    SELECT EXTRACT(EPOCH FROM (ri2.attempted_at - ri.created_at)) / 86400 AS lag_days
    FROM residual_instance ri
    JOIN residual_intervention ri2 ON ri2.residual_instance_id = ri.id
    WHERE ri.residual_type_id = ${typeId}::uuid
    ORDER BY ri.id, ri2.attempted_at
  `;

  const meanChallengeLag = lagRows.length > 0
    ? lagRows.reduce((sum, r) => sum + Number(r.lag_days), 0) / lagRows.length
    : null;

  const reproductionAdvantage = (meanInterval !== null && meanChallengeLag !== null && meanChallengeLag > 0)
    ? meanInterval / meanChallengeLag
    : null;

  return {
    type_id: typeId,
    code: type.code,
    propagation_edge_count: edges.length,
    reproduction_edge_count: reproEdges.length,
    innovation_edge_count: innovEdges.length,
    mean_reproduction_interval_days: meanInterval,
    median_reproduction_interval_days: medianInterval,
    mean_challenge_lag_days: meanChallengeLag,
    reproduction_advantage: reproductionAdvantage,
  };
}

// ── Ecology Class Patch ───────────────────────────────────────────────────────

export async function setInterventionEcologyClass(
  interventionId: string,
  ecologyClass: EcologyClass,
) {
  return prisma.residual_intervention.update({
    where: { id: interventionId },
    data: { ecology_class: ecologyClass },
  });
}
