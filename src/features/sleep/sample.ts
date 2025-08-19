// Mock sleep nights with Apple-like stage patterns

export type SleepStage = 'deep' | 'light' | 'rem' | 'awake';
export type SleepSegment = { start: number; end: number; stage: SleepStage };

export type SleepNight = {
  start: number;   // ms
  end: number;     // ms
  segments: SleepSegment[];
};

const mins = (n: number) => n * 60 * 1000;

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

export function buildMockLastNight(now = new Date()): SleepNight {
  // Start ~11:15 PM last night, end ~7:10 AM
  const end = new Date(now);
  end.setHours(7, 10, 0, 0);
  if (end.getTime() > now.getTime()) end.setDate(end.getDate() - 1); // if it's not yet morning, use previous day

  const start = new Date(end);
  start.setDate(start.getDate() - 1);
  start.setHours(23, 15, 0, 0);

  // Rough cycle builder: 4–5 cycles, Deep early, REM later
  const segs: SleepSegment[] = [];
  let t = start.getTime();

  // Settling/Awake small
  segs.push({ start: t, end: (t += mins(10)), stage: 'awake' });

  const cycles = 5;
  for (let c = 0; c < cycles; c++) {
    const deepDur = clamp(60 - c * 8 + rand(-10, 10), 15, 70);   // minutes
    const lightDur = clamp(70 + rand(-15, 15), 40, 90);
    const remDur = clamp(20 + c * 6 + rand(-8, 8), 10, 60);

    segs.push({ start: t, end: (t += mins(deepDur)), stage: 'deep' });
    segs.push({ start: t, end: (t += mins(lightDur)), stage: 'light' });
    segs.push({ start: t, end: (t += mins(remDur)), stage: 'rem' });

    // short awakening between cycles (except maybe last)
    if (c < cycles - 1) {
      const wakeDur = clamp(rand(1, 8), 1, 10);
      segs.push({ start: t, end: (t += mins(wakeDur)), stage: 'awake' });
    }
  }

  // Trim/fit to end window
  const hardEnd = end.getTime();
  const trimmed: SleepSegment[] = [];
  for (const s of segs) {
    const ss = Math.max(s.start, start.getTime());
    const ee = Math.min(s.end, hardEnd);
    if (ee > ss) trimmed.push({ start: ss, end: ee, stage: s.stage });
    if (ee >= hardEnd) break;
  }

  return { start: start.getTime(), end: hardEnd, segments: trimmed };
}

export function buildMockHistory(n = 21, now = new Date()): SleepNight[] {
  const out: SleepNight[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const night = buildMockLastNight(d);
    // add small variance to duration by random trimming at the end
    const shorten = mins(rand(-20, 20));
    out.push({
      start: night.start,
      end: night.end + shorten,
      segments: night.segments.map(s => ({
        ...s,
        end: s.end === night.end ? s.end + shorten : s.end,
      })),
    });
  }
  return out;
}

function rand(a: number, b: number) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
