import prisma from './src/prisma.js';

async function main() {
  // Find any connection with a hypothesis to understand the structure
  const withHyp = await prisma.signal_connections.findFirst({
    where: { shg_triggered: true, hypothesis_id: { not: null } },
    include: { signal_a: true, signal_b: true },
  });
  console.log('Connection with hypothesis:', withHyp?.id, '→ hypothesis:', withHyp?.hypothesis_id);

  // Find the stuck connection
  const conn = await prisma.signal_connections.findFirst({
    where: { shg_triggered: true, hypothesis_id: null },
    include: { signal_a: true, signal_b: true },
  });
  if (!conn) { console.log('No stuck connections'); await prisma.$disconnect(); return; }

  console.log('Stuck connection:', conn.id);
  console.log('case_id:', conn.case_id);
  console.log('mismatch_type:', conn.signal_a?.mismatch_type, '/', conn.signal_b?.mismatch_type);

  // Try to create hypothesis manually
  try {
    const h = await prisma.hypotheses.create({
      data: {
        case_id: conn.case_id,
        title: 'Test: Shared RATE incongruence across independent domains',
        description: `Signals from domain ${conn.domain_a_id} and domain ${conn.domain_b_id} exhibit RATE correspondence. A shared structural source may explain the concurrent deviation.`,
        hypothesis_type: 'HCL',
        plausibility: 0.50,
        status: 'ACTIVE',
        generated_by: 'SHG',
        connection_id: conn.id,
      },
    });
    console.log('Hypothesis created:', h.id);
  } catch (err: unknown) {
    console.error('Hypothesis create error:', (err as Error).message);
    console.error('Full error:', JSON.stringify(err, Object.getOwnPropertyNames(err as object)));
  }

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
