// src/lib/ingestion/map.ts
import type { MetricRow } from './shapes';
import { toClickHouseTsUTC, dayFromUTC } from './shapes';

type HRSample = { ts: string; bpm: number };

type Ctx = {
  user_id: string;
  source: 'apple_health' | 'google_fit' | 'demo';
  device_id: string;
};

export function mapHeartRate(samples: HRSample[], ctx: Ctx): MetricRow[] {
  return samples
    .filter(s => Number.isFinite(s.bpm))
    .map(s => ({
      user_id: ctx.user_id,
      metric: 'heart_rate',
      ts: toClickHouseTsUTC(s.ts),
      value: s.bpm,
      unit: 'bpm',
      source: ctx.source,
      device_id: ctx.device_id,
      day: dayFromUTC(s.ts),
    }));
}

export function mapSpO2(samples: { ts: string; percent: number }[], ctx: Ctx): MetricRow[] {
  return samples
    .filter(s => Number.isFinite(s.percent))
    .map(s => {
      const pct = s.percent <= 1 ? s.percent * 100 : s.percent; // <-- safety
      return {
        user_id: ctx.user_id,
        metric: 'spo2',
        ts: toClickHouseTsUTC(s.ts),
        value: pct,
        unit: '%',
        source: ctx.source,
        device_id: ctx.device_id,
        day: dayFromUTC(s.ts),
      };
    });
}
