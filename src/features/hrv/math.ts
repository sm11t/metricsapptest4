// Pure helpers for HRV math (no RN imports)

export type HRVSample = { ts: string; ms: number };

const median = (arr: number[]) => {
  const a = arr.slice().sort((x, y) => x - y);
  const m = Math.floor(a.length / 2);
  return a.length ? (a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2) : NaN;
};
const std = (a: number[]) => {
  if (a.length < 2) return NaN;
  const mean = a.reduce((s, x) => s + x, 0) / a.length;
  const v = a.reduce((s, x) => s + (x - mean) ** 2, 0) / (a.length - 1);
  return Math.sqrt(v);
};

export type HRVDay = { date: string; hrv?: number };

const localKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// Group to daily median (robust)
export function toDaily(samples: HRVSample[]): HRVDay[] {
  if (!samples.length) return [];
  const byDay = new Map<string, number[]>();
  for (const s of samples) {
    const d = new Date(s.ts);
    const key = localKey(d);
    (byDay.get(key) ?? byDay.set(key, []).get(key)!).push(s.ms);
  }
  return [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, arr]) => ({ date, hrv: median(arr) || undefined }));
}

export type HRVBaselinePoint = { date: string; baseline?: number; sigma?: number };

export function baseline28(days: HRVDay[]): HRVBaselinePoint[] {
  return days.map((d, i) => {
    const prev = days.slice(Math.max(0, i - 28), i).map(x => x.hrv).filter((x): x is number => isFinite(x as number));
    return { date: d.date, baseline: prev.length ? median(prev) : undefined, sigma: prev.length ? std(prev) : undefined };
  });
}

export function deltaPct(today?: number, baseline?: number) {
  if (!isFinite(today!) || !isFinite(baseline!)) return undefined;
  return ((today! - baseline!) / baseline!) * 100;
}
