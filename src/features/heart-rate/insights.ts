import type { HRDay } from './math';
import { deltaPct } from './math';

export type Badge = 'RECOVER' | 'MAINTAIN' | 'TRAIN';

export function decideBadge(days: HRDay[], baselines: { baseline?: number; date: string }[]): {
  badge: Badge; reason: string;
} {
  if (!days.length) return { badge: 'MAINTAIN', reason: 'No data yet' };
  const last = days[days.length - 1];
  const base = baselines[baselines.length - 1]?.baseline;
  const dp = deltaPct(last.rhr, base);

  // Lookback previous day for consistency
  const prev = days[days.length - 2];
  const prevBase = baselines[baselines.length - 2]?.baseline;
  const prevDp = deltaPct(prev?.rhr, prevBase);

  const high = (v?: number) => v !== undefined && v >= 5;
  const low  = (v?: number) => v !== undefined && v <= -3;

  if ((high(dp) && high(prevDp)) || high(dp)) {
    return { badge: 'RECOVER', reason: `RHR ${dp!.toFixed(1)}% above baseline` };
  }
  if (low(dp)) {
    return { badge: 'TRAIN', reason: `RHR ${dp!.toFixed(1)}% below baseline` };
  }
  return { badge: 'MAINTAIN', reason: 'Within normal range' };
}
