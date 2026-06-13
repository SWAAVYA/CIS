/**
 * Residual Graph v1.3 — EE_CIS_RESIDUAL_v1.3
 *
 * TRANSFORMED is a terminal state: local resolution succeeded but generated
 * successor residuals. Explanatory debt is conserved — it changes form.
 *
 * Terminal states: ongoing | resolved | persistent | transformed
 * Optimization criterion: minimize expected residual weight, not resolution count.
 */
import prisma from '../prisma.js';

// ── Types ────────────────────────────────────────────────────────────────────

export type TerminalState = 'ongoing' | 'resolved' | 'persistent' | 'transformed';

export interface TransformationProduct {
  residual_instance_id: string;
  residual_type_id: string;
  causal_mechanism: string;
}

export interface OutcomeClass {
  label: 'true_resolution' | 'positive_transformation' | 'neutral_transformation' | 'negative_transformation' | 'persistence';
  terminal_state: TerminalState;
  net_debt_delta: number | null;
  description: string;
}

// ── Residual Type CRUD ───────────────────────────────────────────────────────

export async function createResidualType(data: {
  code: string;
  name: string;
  description?: string;
  weight?: number;
  domain?: string;
}) {
  return prisma.residual_type.create({ data });
}

export async function listResidualTypes(domain?: string) {
  return prisma.residual_type.findMany({
    where: domain ? { domain } : undefined,
    orderBy: { code: 'asc' },
  });
}

export async function getResidualType(id: string) {
  return prisma.residual_type.findUnique({ where: { id } });
}

// ── Residual Instance ────────────────────────────────────────────────────────

export async function openResidualInstance(data: {
  case_id: string;
  residual_type_id: string;
  signal_id?: string;
  description?: string;
  weight?: number;
}) {
  return prisma.$transaction(async (tx) => {
    const instance = await tx.residual_instance.create({
      data: { ...data, status: 'open' },
    });

    await tx.residual_lineage.create({
      data: {
        residual_instance_id: instance.id,
        case_id: data.case_id,
        terminal_state: 'ongoing',
        transformation_products: [],
      },
    });

    return instance;
  });
}

export async function getCaseResiduals(caseId: string, status?: string) {
  return prisma.residual_instance.findMany({
    where: { case_id: caseId, ...(status ? { status } : {}) },
    include: {
      residual_type: true,
      lineages: { orderBy: { opened_at: 'desc' }, take: 1 },
    },
    orderBy: { created_at: 'asc' },
  });
}

// ── Lineage Resolution ───────────────────────────────────────────────────────

/**
 * Close a lineage as RESOLVED — genuine elimination, no successors.
 * Updates instance status to terminal, trajectory counts.
 */
export async function resolveLineage(lineageId: string, note?: string) {
  return _closeLineage(lineageId, 'resolved', note);
}

/**
 * Close a lineage as PERSISTENT — all approaches exhausted.
 */
export async function persistLineage(lineageId: string, note?: string) {
  return _closeLineage(lineageId, 'persistent', note);
}

/**
 * Close a lineage as TRANSFORMED — local resolution succeeded but generated
 * successor residuals. Products must be created first; pass their instance IDs.
 *
 * Automatically opens new lineages for each successor instance.
 * Returns the closed lineage + all new successor instances.
 */
export async function transformLineage(
  lineageId: string,
  products: TransformationProduct[],
  note?: string
): Promise<{ lineage: object; successors: object[] }> {
  const lineage = await prisma.residual_lineage.findUniqueOrThrow({
    where: { id: lineageId },
    include: { residual_instance: { include: { residual_type: true } } },
  });

  // Compute transformation weight — sum of successor instance weights
  const successorInstances = await prisma.residual_instance.findMany({
    where: { id: { in: products.map(p => p.residual_instance_id) } },
    include: { residual_type: true },
  });

  const transformationWeight = successorInstances.reduce((sum, inst) => {
    const w = Number(inst.weight ?? inst.residual_type.weight);
    return sum + w;
  }, 0);

  const closed = await prisma.$transaction(async (tx) => {
    // Close this lineage
    const closed = await tx.residual_lineage.update({
      where: { id: lineageId },
      data: {
        terminal_state: 'transformed',
        transformation_products: products as unknown as import('@prisma/client').Prisma.InputJsonValue,
        transformation_weight: transformationWeight,
        closed_at: new Date(),
        closure_note: note ?? null,
      },
    });

    await tx.residual_instance.update({
      where: { id: lineage.residual_instance_id },
      data: { status: 'terminal', updated_at: new Date() },
    });

    // Open new lineages for each successor
    for (const product of products) {
      await tx.residual_lineage.create({
        data: {
          residual_instance_id: product.residual_instance_id,
          case_id: lineage.case_id,
          terminal_state: 'ongoing',
          transformation_products: [],
        },
      });
      await tx.residual_instance.update({
        where: { id: product.residual_instance_id },
        data: { status: 'open', updated_at: new Date() },
      });
    }

    return closed;
  });

  // Update trajectory + cluster stats asynchronously (fire-and-forget)
  _updateTrajectoryStats(lineage.residual_instance.residual_type_id, 'transformed', products)
    .catch(err => console.error('[residual-graph] trajectory update failed:', err));

  return { lineage: closed, successors: successorInstances };
}

// ── Intervention ─────────────────────────────────────────────────────────────

export async function recordIntervention(data: {
  lineage_id: string;
  residual_instance_id: string;
  case_id: string;
  intervention_type: string;
  intervention_note?: string;
  outcome_terminal_state?: string;
}) {
  return prisma.residual_intervention.create({ data });
}

// ── Greedy-Optimal Intervention ───────────────────────────────────────────────

/**
 * Section 3.2 — greedy optimization criterion.
 *
 * For a given open residual instance, returns the intervention recommendation:
 *   - greedy_optimal: intervention with lowest expected debt delta
 *   - dangerous: interventions with net_debt_delta > 0
 *   - robust: high RESOLVED probability, low transformation probability
 *
 * Uses cluster transformation data for known source→target pairs.
 * Falls back to type-level trajectory when no cluster data exists.
 */
export async function getInterventionRecommendation(residualInstanceId: string) {
  const instance = await prisma.residual_instance.findUniqueOrThrow({
    where: { id: residualInstanceId },
    include: { residual_type: true, lineages: { orderBy: { opened_at: 'desc' }, take: 1 } },
  });

  const trajectory = await prisma.residual_trajectory.findFirst({
    where: { residual_type_id: instance.residual_type_id, subtype_tag: null },
  });

  // Clusters where this type is the source
  const clusters = await prisma.$queryRaw<Array<{
    cluster_type: string;
    target_type_id: string;
    target_code: string;
    target_name: string;
    observation_count: number;
    transformation_probability: number | null;
    transformation_weight_expected: number | null;
    net_debt_delta: number | null;
    co_occurrence_probability: number | null;
  }>>`
    SELECT
      rc.cluster_type,
      rc.target_type_id,
      rt.code AS target_code,
      rt.name AS target_name,
      rc.observation_count,
      rc.transformation_probability::float,
      rc.transformation_weight_expected::float,
      rc.net_debt_delta::float,
      rc.co_occurrence_probability::float
    FROM residual_cluster rc
    JOIN residual_type rt ON rt.id = rc.target_type_id
    WHERE rc.source_type_id = ${instance.residual_type_id}::uuid
      AND rc.cluster_type = 'transformation'
    ORDER BY rc.net_debt_delta ASC NULLS LAST
  `;

  const totalCount = trajectory
    ? (trajectory.resolved_count + trajectory.persistent_count + trajectory.transformed_count)
    : 0;

  const resolvedProb = totalCount > 0
    ? trajectory!.resolved_count / totalCount
    : null;
  const transformedProb = totalCount > 0
    ? trajectory!.transformed_count / totalCount
    : null;
  const persistentProb = totalCount > 0
    ? trajectory!.persistent_count / totalCount
    : null;

  // Classify clusters into outcome classes
  const dangerous = clusters.filter(c => (c.net_debt_delta ?? 0) > 0);
  const positive = clusters.filter(c => (c.net_debt_delta ?? 0) < 0);

  return {
    residual_type: {
      id: instance.residual_type_id,
      code: instance.residual_type.code,
      name: instance.residual_type.name,
      weight: Number(instance.weight ?? instance.residual_type.weight),
    },
    terminal_state_distribution: trajectory ? {
      resolved: resolvedProb,
      transformed: transformedProb,
      persistent: persistentProb,
      observation_count: trajectory.observation_count,
    } : null,
    transformation_landscape: clusters,
    greedy_optimal: positive.length > 0
      ? { cluster: positive[0], rationale: 'lowest net_debt_delta (debt decreases)' }
      : null,
    dangerous_interventions: dangerous,
    robust_interventions: clusters.filter(
      c => (c.transformation_probability ?? 1) < 0.2 && (c.net_debt_delta ?? 0) <= 0
    ),
  };
}

// ── Outcome Class ────────────────────────────────────────────────────────────

/**
 * Section 3.1 — classify a closed lineage into one of four outcome classes.
 */
export function classifyOutcome(
  terminalState: TerminalState,
  netDebtDelta: number | null
): OutcomeClass {
  if (terminalState === 'resolved') {
    return {
      label: 'true_resolution',
      terminal_state: 'resolved',
      net_debt_delta: -1.0,
      description: 'Residual eliminated, no successor residuals generated.',
    };
  }
  if (terminalState === 'persistent') {
    return {
      label: 'persistence',
      terminal_state: 'persistent',
      net_debt_delta: 0,
      description: 'All approaches exhausted. Residual remains. Debt unchanged.',
    };
  }
  // transformed
  const delta = netDebtDelta ?? 0;
  if (delta < -0.05) {
    return {
      label: 'positive_transformation',
      terminal_state: 'transformed',
      net_debt_delta: delta,
      description: 'Successor residuals are easier. Net debt decreases.',
    };
  }
  if (delta > 0.05) {
    return {
      label: 'negative_transformation',
      terminal_state: 'transformed',
      net_debt_delta: delta,
      description: 'Successor residuals are harder. Net debt increases. Intervention made things worse globally.',
    };
  }
  return {
    label: 'neutral_transformation',
    terminal_state: 'transformed',
    net_debt_delta: delta,
    description: 'Successor residuals of equal difficulty. No net gain.',
  };
}

// ── Trajectory Update (internal) ─────────────────────────────────────────────

async function _closeLineage(lineageId: string, state: 'resolved' | 'persistent', note?: string) {
  const lineage = await prisma.residual_lineage.findUniqueOrThrow({
    where: { id: lineageId },
    include: { residual_instance: { include: { residual_type: true } } },
  });

  const closed = await prisma.$transaction(async (tx) => {
    const closed = await tx.residual_lineage.update({
      where: { id: lineageId },
      data: { terminal_state: state, closed_at: new Date(), closure_note: note ?? null },
    });
    await tx.residual_instance.update({
      where: { id: lineage.residual_instance_id },
      data: { status: 'terminal', updated_at: new Date() },
    });
    return closed;
  });

  _updateTrajectoryStats(lineage.residual_instance.residual_type_id, state, [])
    .catch(err => console.error('[residual-graph] trajectory update failed:', err));

  return closed;
}

async function _updateTrajectoryStats(
  typeId: string,
  terminalState: 'resolved' | 'persistent' | 'transformed',
  products: TransformationProduct[]
) {
  // Use separate upserts per terminal state to avoid dynamic field injection
  if (terminalState === 'resolved') {
    await prisma.$executeRaw`
      INSERT INTO residual_trajectory (residual_type_id, observation_count, resolved_count)
      VALUES (${typeId}::uuid, 1, 1)
      ON CONFLICT (residual_type_id) WHERE subtype_tag IS NULL
      DO UPDATE SET
        observation_count = residual_trajectory.observation_count + 1,
        resolved_count    = residual_trajectory.resolved_count + 1,
        last_updated      = now()
    `;
  } else if (terminalState === 'persistent') {
    await prisma.$executeRaw`
      INSERT INTO residual_trajectory (residual_type_id, observation_count, persistent_count)
      VALUES (${typeId}::uuid, 1, 1)
      ON CONFLICT (residual_type_id) WHERE subtype_tag IS NULL
      DO UPDATE SET
        observation_count = residual_trajectory.observation_count + 1,
        persistent_count  = residual_trajectory.persistent_count + 1,
        last_updated      = now()
    `;
  } else {
    await prisma.$executeRaw`
      INSERT INTO residual_trajectory (residual_type_id, observation_count, transformed_count)
      VALUES (${typeId}::uuid, 1, 1)
      ON CONFLICT (residual_type_id) WHERE subtype_tag IS NULL
      DO UPDATE SET
        observation_count = residual_trajectory.observation_count + 1,
        transformed_count = residual_trajectory.transformed_count + 1,
        last_updated      = now()
    `;

    for (const product of products) {
      await prisma.$executeRaw`
        INSERT INTO residual_cluster
          (cluster_type, source_type_id, target_type_id, observation_count, transformation_probability)
        VALUES ('transformation', ${typeId}::uuid, ${product.residual_type_id}::uuid, 1, 0.5)
        ON CONFLICT (cluster_type, source_type_id, target_type_id)
        DO UPDATE SET
          observation_count = residual_cluster.observation_count + 1,
          last_updated      = now()
      `;
    }
  }
}
