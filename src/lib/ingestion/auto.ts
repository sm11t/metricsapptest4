// src/lib/ingestion/auto.ts
import { AppState, AppStateStatus } from 'react-native';
import AppleHealthKit, { HealthValue } from 'react-native-health';
import { enqueue } from './queue';
import { mapHeartRate, mapSpO2 } from './map';
import { getLastTs, setLastTs } from './state';

type Ctx = { user_id: string; source: 'apple_health' | 'google_fit' | 'demo'; device_id: string };

// ---- HealthKit fetchers ----
async function fetchHRSince(since: Date): Promise<{ ts: string; bpm: number }[]> {
  return new Promise((resolve, reject) => {
    AppleHealthKit.getHeartRateSamples(
      { startDate: since.toISOString(), endDate: new Date().toISOString(), unit: 'bpm' as const },
      (err: string, results: HealthValue[]) => {
        if (err) return reject(new Error(err));
        const out = (results || []).map(r => ({ ts: (r as any).endDate, bpm: Number((r as any).value) }))
                                   .filter(s => Number.isFinite(s.bpm));
        resolve(out);
      },
    );
  });
}

async function fetchSpO2Since(since: Date): Promise<{ ts: string; percent: number }[]> {
  return new Promise((resolve, reject) => {
    AppleHealthKit.getOxygenSaturationSamples(
      { startDate: since.toISOString(), endDate: new Date().toISOString() },
      (err: string, results: (HealthValue | any)[]) => {
        if (err) return reject(new Error(err));
        const out = (results || []).map(r => {
          const v = Number((r as any).value);
          const percent = v <= 1 ? v * 100 : v; // normalize 0–1 to %
          return { ts: (r as any).endDate, percent };
        }).filter(s => Number.isFinite(s.percent));
        resolve(out);
      },
    );
  });
}

// ---- Generic per-metric runner ----
async function runMetric<TSample>(
  metric: 'heart_rate' | 'spo2',
  fetcher: (since: Date) => Promise<TSample[]>,
  mapper: (samples: any[], ctx: Ctx) => any[],
  ctx: Ctx,
) {
  try {
    const since = await getLastTs(metric, 48);
    const raw = await fetcher(since);
    if (!raw.length) return;

    // Only send new ones strictly after our checkpoint
    const sinceMs = since.getTime();
    const fresh = raw.filter((s: any) => new Date(s.ts).getTime() > sinceMs);
    if (!fresh.length) return;

    const rows = mapper(fresh, ctx);
    const res = await enqueue(rows);
    // Advance checkpoint to the latest timestamp we just sent
    const maxTs = fresh.reduce((m, s: any) => (new Date(s.ts) > new Date(m) ? s.ts : m), fresh[0].ts);
    await setLastTs(metric, maxTs);

    console.log(`[ingest] ${metric}: sent=${res.sent} upTo=${maxTs}`);
  } catch (e) {
    console.log(`[ingest] ${metric} error`, e);
  }
}

// ---- Public API: start/stop foreground auto-ingestion ----
export function startAutoIngestion(ctx: Ctx = { user_id: 'u_dev', source: 'apple_health', device_id: 'ios_device' }) {
  let timer: any = null;
  let sub: { remove: () => void } | null = null;

  const runOnce = async () => {
    // You can gate by permission/availability if you like; we try and no-op if 0
    await runMetric('heart_rate', fetchHRSince, mapHeartRate as any, ctx);
    await runMetric('spo2',       fetchSpO2Since, mapSpO2 as any, ctx);
  };

  // Run immediately, then every 2 minutes while app is in foreground
  const startTimer = () => {
    if (timer) return;
    runOnce();
    timer = setInterval(runOnce, 2 * 60 * 1000);
    console.log('[ingest] timer started');
  };
  const stopTimer = () => {
    if (timer) clearInterval(timer);
    timer = null;
    console.log('[ingest] timer stopped');
  };

  // Follow app state (only run in foreground)
  const onState = (s: AppStateStatus) => (s === 'active' ? startTimer() : stopTimer());
  sub = AppState.addEventListener('change', onState);
  // If app is already active, start now
  if (AppState.currentState === 'active') startTimer();

  return {
    triggerOnce: runOnce,
    stop: () => {
      stopTimer();
      sub?.remove();
      sub = null;
    },
  };
}
