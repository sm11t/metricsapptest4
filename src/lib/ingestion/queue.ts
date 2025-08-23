// src/lib/ingestion/queue.ts
import type { MetricRow } from './shapes';
import { insertRows } from './clickhouseClient';

export async function enqueue(rows: MetricRow[]): Promise<{ ok: true; sent: number }> {
  if (!rows?.length) return { ok: true, sent: 0 };
  const chunkSize = 200;
  for (let i = 0; i < rows.length; i += chunkSize) {
    await insertRows(rows.slice(i, i + chunkSize));
  }
  return { ok: true, sent: rows.length };
}
