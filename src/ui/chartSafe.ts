// src/ui/chartSafe.ts
export type HRPoint = { value: number; label?: string; dataPointRadius?: number; dataPointColor?: string };

// Ensure gifted-charts always gets finite data + non-zero Y range
export function makeChartSafe(points: HRPoint[], fallback = 60) {
  const series = points.filter(p => Number.isFinite(p.value));
  const safe = series.length >= 2 ? series : [{ value: fallback }, { value: fallback }];

  let lo = Math.min(...safe.map(p => p.value));
  let hi = Math.max(...safe.map(p => p.value));
  if (!(Number.isFinite(lo) && Number.isFinite(hi))) { lo = fallback - 1; hi = fallback + 1; }
  if (hi - lo < 1) { hi += 0.5; lo -= 0.5; } // avoid zero-height

  return {
    data: safe,
    maxValue: hi,
    mostNegativeValue: Math.max(0, lo), // no negatives for HR
  };
}

export const safeLabel = (x: unknown) => (typeof x === 'string' ? x : '');
export const safeBpm   = (x: unknown) => (Number.isFinite(Number(x)) ? `${Math.round(Number(x))} bpm` : '--');

// small helper for time labels
export const hhmm = (t: number) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// simple linear resample to N points (for smooth curves)
export function resampleLinear(series: { t: number; v: number }[], n: number) {
  if (series.length <= n) return series;
  const out: { t: number; v: number }[] = [];
  const step = (series.length - 1) / (n - 1);
  for (let i = 0; i < n; i++) {
    const idx = i * step;
    const j = Math.floor(idx);
    const frac = idx - j;
    const a = series[j], b = series[Math.min(series.length - 1, j + 1)];
    out.push({ t: a.t + (b.t - a.t) * frac, v: a.v + (b.v - a.v) * frac });
  }
  return out;
}
