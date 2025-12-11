// File: src/example.ts
import { DBMaticClient } from './dbmatic-client';
import { fetchAllMeasurementsForVessel } from './fetch-all';

async function main() {
  const client = new DBMaticClient({
    baseUrl: process.env.DBMATIC_API_URL ?? 'https://{base-url}/api/v1',
    token: process.env.DBMATIC_TOKEN ?? ''
  });

  // 1) Get a vessel (journal)
  const journals = await client.listJournals();
  const vessel = journals[0];
  if (!vessel) throw new Error('No journals available');
  const journalId = vessel.journal_id;

  // 2) Timewindow (last 10 minutes)
  const stop = Math.floor(Date.now() / 1000);
  const start = stop - 10 * 60;

  // 3) Fetch ALL devices + ALL measurements, normalized
  const { results } = await fetchAllMeasurementsForVessel(client, journalId, start, stop, 6);

  // 4) Fan-out by kind, or store directly
  const all = results.flatMap(r => r.normalized);
  const byKind = all.reduce<Record<string, number>>((acc, m) => {
    acc[m.kind] = (acc[m.kind] ?? 0) + 1;
    return acc;
  }, {});

  console.log('Counts by kind:', byKind);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
