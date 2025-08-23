// src/lib/ingestion/queue.ts
import type { MetricRow } from './shapes';
import { insertRows } from './clickhouseClient';

type Key = string;

// build a stable dedupe key per row
function keyOf(r: MetricRow): Key {
  return [
    r.user_id,
    r.metric,
    r.ts,
    r.value,
    r.unit,
    r.source,
    r.device_id,
    r.day,
  ].join('|');
}

let _pending: MetricRow[] = [];
let _pendingSet = new Set<Key>();
let _flushing = false;
let _retryDelayMs = 0;

const MAX_CHUNK = 200;
const BACKOFF_STEPS = [2000, 5000, 15000, 60000]; // 2s, 5s, 15s, 60s
let _backoffIndex = 0;
let _retryTimer: any = null;

function scheduleRetry() {
  if (_retryTimer) return;
  _retryDelayMs = BACKOFF_STEPS[Math.min(_backoffIndex, BACKOFF_STEPS.length - 1)];
  _backoffIndex++;
  _retryTimer = setTimeout(() => {
    _retryTimer = null;
    void flushNow();
  }, _retryDelayMs);
}

async function attemptOnce(): Promise<void> {
  const chunk = _pending.slice(0, MAX_CHUNK);
  await insertRows(chunk);
  chunk.forEach(r => _pendingSet.delete(keyOf(r)));
  _pending = _pending.slice(chunk.length);
  _backoffIndex = 0; // reset backoff on success
  _retryDelayMs = 0;
}

export async function enqueue(rows: MetricRow[]): Promise<{ ok: true; queued: number }> {
  if (!rows?.length) return { ok: true, queued: 0 };
  let added = 0;
  for (const r of rows) {
    const k = keyOf(r);
    if (_pendingSet.has(k)) continue;
    _pending.push(r);
    _pendingSet.add(k);
    added++;
  }
  // try flushing (non-blocking to caller)
  void flushNow();
  return { ok: true, queued: added };
}

export async function flushNow(): Promise<{ ok: boolean; pending: number }> {
  if (_flushing) return { ok: true, pending: _pending.length };
  _flushing = true;
  try {
    while (_pending.length > 0) {
      await attemptOnce();
    }
    return { ok: true, pending: 0 };
  } catch {
    scheduleRetry();
    return { ok: false, pending: _pending.length };
  } finally {
    _flushing = false;
  }
}

export function queueStats() {
  return {
    pending: _pending.length,
    retryDelayMs: _retryDelayMs,
    flushing: _flushing,
  };
}
