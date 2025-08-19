import type { HRVDay } from './math';
import { deltaPct } from './math';

export type Badge = 'RECOVER' | 'MAINTAIN' | 'TRAIN';

export function decideBadge(days: HRVDay[], base: { baseline?: number }[]) {
  if (!days.length) return { badge: 'MAINTAIN' as Badge, reason: 'No data yet' };
  const last = days[days.length - 1]?.hrv;
  const b = base[base.length - 1]?.baseline;
  const dp = deltaPct(last, b);

  const low = (v?: number) => v !== undefined && v <= -5;
  const high = (v?: number) => v !== undefined && v >= 3;

  if (low(dp)) return { badge: 'RECOVER' as Badge, reason: `HRV ${dp!.toFixed(1)}% below baseline` };
  if (high(dp)) return { badge: 'TRAIN' as Badge, reason: `HRV ${dp!.toFixed(1)}% above baseline` };
  return { badge: 'MAINTAIN' as Badge, reason: 'Within normal range' };
}
