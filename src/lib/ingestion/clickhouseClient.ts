// src/lib/ingestion/clickhouseClient.ts
import { RELAY_BASE_URL } from '../../lib/config';
import type { MetricRow } from './shapes';

export async function insertRows(rows: MetricRow[]): Promise<void> {
  const r = await fetch(`${RELAY_BASE_URL}/metrics/insertRows`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rows }),
  });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new Error(`insertRows failed: ${r.status} ${text}`);
  }
}
