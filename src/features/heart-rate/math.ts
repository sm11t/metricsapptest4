// Pure helpers for HR math (no React / no RN imports)

export type HRSample = { ts: string; bpm: number };

// --- bucketing ---

const MS_MIN = 60_000;
const floorToMinute = (t: number) => Math.floor(t / MS_MIN) * MS_MIN;

// Average to 1-minute bins for stable rolling windows
export function toMinuteSeries(samples: HRSample[]) {
  const map = new Map<number, { sum: number; n: number }>();
  for (const s of samples) {
    const t = floorToMinute(new Date(s.ts).getTime());
    const m = map.get(t) ?? { sum: 0, n: 0 };
    m.sum += s.bpm; m.n += 1; map.set(t, m);
  }
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([t, { sum, n }]) => ({ t, bpm: sum / n }));
}

const median = (arr: number[]) => {
  const a = arr.slice().sort((x, y) => x - y);
  const mid = Math.floor(a.length / 2);
  return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
};
const percentile = (arr: number[], p: number) => {
  const a = arr.slice().sort((x, y) => x - y);
  if (!a.length) return NaN;
  const idx = Math.min(a.length - 1, Math.max(0, Math.round((p / 100) * (a.length - 1))));
  return a[idx];
};
const mean = (a: number[]) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : NaN);
const std = (a: number[]) => {
  if (a.length < 2) return NaN;
  const m = mean(a);
  const v = a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1);
  return Math.sqrt(v);
};

// --- daily aggregates ---

export type HRDay = {
  date: string;            // YYYY-MM-DD (local)
  rhr?: number;            // resting HR
  hrMin?: number; hrMax?: number; hrAvg?: number;
};

// lowest stable 5-min rolling median inside [00:00, 08:00) local (approx until sleep is integrated)
function computeRHR(minutes: { t: number; bpm: number }[]) {
  if (!minutes.length) return NaN;
  const d = new Date(minutes[0]?.t ?? Date.now());
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0).getTime();
  const end   = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 8, 0).getTime();

  const night = minutes.filter(m => m.t >= start && m.t < end);
  if (night.length < 5) return NaN;

  const med5: number[] = [];
  for (let i = 0; i <= night.length - 5; i++) {
    med5.push(median(night.slice(i, i + 5).map(x => x.bpm)));
  }
  // 10th percentile is more robust than pure min
  return percentile(med5, 10);
}

export function toDaily(samples: HRSample[]): HRDay[] {
  if (!samples.length) return [];
  // group by local date
  const byDay = new Map<string, HRSample[]>();
  for (const s of samples) {
    const d = new Date(s.ts);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    (byDay.get(key) ?? byDay.set(key, []).get(key)!).push(s);
  }

  const days: HRDay[] = [];
  for (const [date, arr] of [...byDay.entries()].sort(([a],[b]) => a.localeCompare(b))) {
    const mins = toMinuteSeries(arr);
    const rhr = computeRHR(mins);
    const values = arr.map(s => s.bpm);
    days.push({
      date,
      rhr: isFinite(rhr) ? rhr : undefined,
      hrMin: Math.min(...values),
      hrMax: Math.max(...values),
      hrAvg: mean(values),
    });
  }
  return days;
}

// --- baselines (28-day rolling median & ±1σ), shifted 1 day ---

export type HRBaselinePoint = {
  date: string; baseline?: number; sigma?: number;
};

export function baseline28(days: HRDay[]): HRBaselinePoint[] {
  const out: HRBaselinePoint[] = [];
  const window: number[] = []; // last 28 rhr values
  for (let i = 0; i < days.length; i++) {
    const d = days[i];
    // build window from previous days only
    const prev = days.slice(Math.max(0, i - 28), i).map(x => x.rhr).filter((x): x is number => isFinite(x as number));
    out.push({
      date: d.date,
      baseline: prev.length ? median(prev) : undefined,
      sigma: prev.length ? std(prev) : undefined,
    });
    // window managed via slice above; no need to push/pop here
  }
  return out;
}

// convenience for % delta vs baseline
export function deltaPct(today?: number, baseline?: number) {
  if (!isFinite(today!) || !isFinite(baseline!)) return undefined;
  return ((today! - baseline!) / baseline!) * 100;
}
