import { useMemo, useState, useCallback } from 'react';

export type SleepStage = 'deep' | 'light' | 'rem' | 'awake';
export type StageSeg = { start: number; end: number; stage: SleepStage };

type Night = { start: number; end: number; stages: StageSeg[] };

export default function useSleepMock() {
  // keep one "last night" in state so UI is stable between renders
  const [night, setNight] = useState<Night>(() => mockNight());

  const totals = useMemo(() => {
    const totalMin = Math.round((night.end - night.start) / 60000);
    const asleepMin = Math.round(
      night.stages
        .filter(s => s.stage !== 'awake')
        .reduce((sum, s) => sum + (s.end - s.start), 0) / 60000
    );
    const efficiencyPct = totalMin ? (asleepMin / totalMin) * 100 : 0;
    return { minutesAsleep: asleepMin, efficiencyPct };
  }, [night]);

  const stagePct = useMemo(() => {
    const asleepMs = night.stages
      .filter(s => s.stage !== 'awake')
      .reduce((sum, s) => sum + (s.end - s.start), 0);
    const pct = (ms: number) => (asleepMs ? Math.round((ms / asleepMs) * 100) : 0);
    const sumMs = (stage: SleepStage) =>
      night.stages.filter(s => s.stage === stage).reduce((sum, s) => sum + (s.end - s.start), 0);

    return {
      deep: pct(sumMs('deep')),
      light: pct(sumMs('light')),
      rem: pct(sumMs('rem')),
      awake: pct(sumMs('awake')),
    };
  }, [night]);

  const segs = useMemo(() => {
    const span = night.end - night.start || 1;
    return night.stages.map(s => ({
      stage: s.stage,
      leftPct: ((s.start - night.start) / span) * 100,
      widthPct: ((s.end - s.start) / span) * 100,
    }));
  }, [night]);

  const refresh = useCallback(() => setNight(mockNight()), []);

  return {
    lastNight: night,
    totals,
    stagePct,
    segs,
    refresh,
  };
}

// ---------- mock generator ----------
function mockNight(): Night {
  // last night 11:20 PM to 7:10 AM
  const end = roundToMin(Date.now() - 60 * 60 * 1000); // pretend we woke an hour ago
  const start = end - (7 * 60 + 50) * 60 * 1000; // 7h50m span
  const blocks: Array<[SleepStage, number]> = [
    ['awake', 10],
    ['light', 35],
    ['deep', 70],
    ['light', 40],
    ['rem', 30],
    ['deep', 50],
    ['light', 60],
    ['rem', 35],
    ['light', 45],
    ['awake', 5],
  ];
  let t = start;
  const stages: StageSeg[] = blocks.map(([stage, minutes]) => {
    const seg = { stage, start: t, end: t + minutes * 60000 } as StageSeg;
    t = seg.end;
    return seg;
  });
  // clamp last segment to end
  stages[stages.length - 1].end = end;
  return { start, end, stages };
}

function roundToMin(ms: number) {
  const d = new Date(ms);
  d.setSeconds(0, 0);
  return d.getTime();
}
