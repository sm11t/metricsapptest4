import type { MetricRow } from './shapes';
import { toClickHouseTsUTC, dayFromUTC } from './shapes';

const base = (user_id: string, source: string, device_id: string) =>
  ({ user_id, source, device_id } as const);

export function hrToRows(
  samples: { ts: string; bpm: number }[],
  user_id: string,
  source = 'apple_health',
  device_id = 'ios_device',
): MetricRow[] {
  return samples
    .filter(s => Number.isFinite(s.bpm))
    .map(s => {
      const ts = toClickHouseTsUTC(s.ts);
      return {
        ...base(user_id, source, device_id),
        metric: 'heart_rate',
        ts,
        value: s.bpm,
        unit: 'bpm',
        day: dayFromUTC(s.ts),
      };
    });
}

export function spo2ToRows(
  history: { ts: string; percent: number }[],
  user_id: string,
  source = 'apple_health',
  device_id = 'ios_device',
): MetricRow[] {
  return history
    .filter(h => Number.isFinite(h.percent))
    .map(h => {
      const ts = toClickHouseTsUTC(h.ts);
      return {
        ...base(user_id, source, device_id),
        metric: 'spo2',
        ts,
        value: h.percent,
        unit: '%',
        day: dayFromUTC(h.ts),
      };
    });
}
