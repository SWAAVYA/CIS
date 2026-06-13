/**
 * CIS Frame Graph Service
 *
 * Manages frame_entity (nodes) and frame_relationship (edges) in the Frame Graph.
 * Called after sealAdmission — audit chain write always precedes Frame Graph write.
 *
 * Classification event flow (EE_CIS_AUDIT_CHAIN_v1.0 Section 2.2):
 *   Step 3: sealAdmission → admission_audit_sealed (returns sealedRecordId)
 *   Step 4: createClassifiesEdge → frame_relationship (audit_record_id = sealedRecordId)
 *   Step 5: updateCaseFrameEntity → frame_entity (c_value, r_state if changed)
 */

import type { Prisma } from '@prisma/client';
import { RTT_THEORY_VERSION } from './constraint-registry.js';

// The CIS node is a singleton — one frame_entity record representing CIS itself.
// Level: implementation. R-state: R2 (operators recognise the gap between
// CIS v1 implementation and RTT v1.9 theory requirements).
const CIS_IDENTITY = 'CIS v1 — RTT-based frame classification system';

/**
 * Get or create the singleton CIS frame entity.
 * CIS is the source node of every classifies edge.
 */
export async function getOrCreateCisFrameEntity(
  tx: Prisma.TransactionClient
): Promise<string> {
  const existing = await tx.$queryRaw<Array<{ id: string }>>`
    SELECT id FROM frame_entity WHERE identity = ${CIS_IDENTITY} LIMIT 1
  `;
  if (existing.length > 0) return existing[0]!.id;

  const created = await tx.$queryRaw<Array<{ id: string }>>`
    INSERT INTO frame_entity (identity, level, r_state, r_confidence, rtt_theory_version)
    VALUES (
      ${CIS_IDENTITY},
      'implementation',
      'R2',
      0.65,
      ${RTT_THEORY_VERSION}
    )
    ON CONFLICT DO NOTHING
    RETURNING id
  `;
  if (created.length > 0) return created[0]!.id;

  // Race condition: concurrent insert won — re-fetch
  const refetch = await tx.$queryRaw<Array<{ id: string }>>`
    SELECT id FROM frame_entity WHERE identity = ${CIS_IDENTITY} LIMIT 1
  `;
  return refetch[0]!.id;
}

/**
 * Get or create the frame entity for a CIS case.
 * Each case maps to one frame_entity node (the domain frame under investigation).
 * Identity: 'case:<caseId>' — stable, queryable, does not depend on case title.
 * Level defaults to 'organization' — the most common CIS investigation domain.
 */
export async function getOrCreateCaseFrameEntity(
  tx: Prisma.TransactionClient,
  caseId: string
): Promise<string> {
  const identity = `case:${caseId}`;

  const existing = await tx.$queryRaw<Array<{ id: string }>>`
    SELECT id FROM frame_entity WHERE identity = ${identity} LIMIT 1
  `;
  if (existing.length > 0) return existing[0]!.id;

  const created = await tx.$queryRaw<Array<{ id: string }>>`
    INSERT INTO frame_entity (identity, level, rtt_theory_version)
    VALUES (
      ${identity},
      'organization',
      ${RTT_THEORY_VERSION}
    )
    ON CONFLICT DO NOTHING
    RETURNING id
  `;
  if (created.length > 0) return created[0]!.id;

  const refetch = await tx.$queryRaw<Array<{ id: string }>>`
    SELECT id FROM frame_entity WHERE identity = ${identity} LIMIT 1
  `;
  return refetch[0]!.id;
}

/**
 * Create a classifies edge from the CIS node to the case frame entity.
 * audit_record_id is the FK to admission_audit_sealed — signal payload stays
 * in the hash chain, the edge is the bridge.
 */
export async function createClassifiesEdge(
  tx: Prisma.TransactionClient,
  params: {
    cisFrameId: string;
    caseFrameId: string;
    auditRecordId: string;
  }
): Promise<void> {
  await tx.$executeRaw`
    INSERT INTO frame_relationship (
      source_frame_id,
      target_frame_id,
      relationship_type,
      direction,
      audit_record_id,
      rtt_theory_version
    ) VALUES (
      ${params.cisFrameId}::uuid,
      ${params.caseFrameId}::uuid,
      'classifies',
      'source_to_target',
      ${params.auditRecordId}::uuid,
      ${RTT_THEORY_VERSION}
    )
  `;
}
