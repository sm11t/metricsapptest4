// Simple mock pack we can swap for real hooks later.
export const sampleReadinessPack = {
  // today values
  today: {
    hrv: 65,            // ms
    rhr: 58,            // bpm
    sleepDurMin: 420,   // minutes
    sleepEff: 0.90,     // 0..1
    resp: 13.5,         // brpm
    strain: 600,        // kcal or training load proxy
  },
  // baselines (median) and sigma for prior 28d
  base: {
    hrv:      { baseline: 72,  sigma: 6   },
    rhr:      { baseline: 56,  sigma: 3   },
    sleepDur: { baseline: 400, sigma: 40  },
    sleepEff: { baseline: 0.88, sigma: 0.04 },
    resp:     { baseline: 13.0, sigma: 0.7 },
    strain:   { baseline: 500, sigma: 150 },
  },
  // last 7 readiness scores for spark (mock)
  trend7: [68, 70, 65, 71, 74, 73, 72],
};
export type Driver = 'hrv'|'rhr'|'sleepDur'|'sleepEff'|'resp'|'strain';
