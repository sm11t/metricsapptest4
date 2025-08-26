import { RELAY_BASE_URL } from '../config';
import type { MetricRow } from './shapes';

type Ok = { ok: true; sent: number };
type Err = { ok: false; error: string };

async function postChunk(rows: MetricRow[]): Promise<Ok | Err> {
  const res = await fetch(`${RELAY_BASE_URL}/metrics/insertRows`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rows }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return { ok: false, error: `HTTP ${res.status}: ${text}` };
  }
  const j = await res.json().catch(() => ({}));
  const sent = Number(j?.sent ?? rows.length);
  return { ok: true, sent };
}

/**
 * Insert rows in safe chunks (default 1000) to avoid huge payloads.
 */
export async function insertRows(
  rows: MetricRow[],
  chunkSize = 1000,
): Promise<Ok | Err> {
  if (!rows.length) return { ok: true, sent: 0 };
  let total = 0;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const r = await postChunk(chunk);
    if (!r.ok) return r;
    total += r.sent;
  }
  return { ok: true, sent: total };
}

export async function health(): Promise<boolean> {
  try {
    const r = await fetch(`${RELAY_BASE_URL}/health`);
    const j = await r.json().catch(() => ({}));
    return !!j?.ok;
  } catch {
    return false;
  }
}
