import { useCallback, useEffect, useMemo, useState } from 'react';
import AppleHealthKit, { HealthKitPermissions } from 'react-native-health';

type SpO2Point = { ts: string; value: number }; // value in %

const permissions: HealthKitPermissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.OxygenSaturation],
    write: [],
  },
};

const dayMs = 24 * 60 * 60 * 1000;

export function useSpO2(days = 14) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [samples, setSamples] = useState<SpO2Point[]>([]);
  const [error, setError] = useState<null | string>(null);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);

  const requestAuth = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      AppleHealthKit.initHealthKit(permissions, (err) => {
        if (err) {
          setAuthorized(false);
          setError(String(err));
          return reject(err);
        }
        setAuthorized(true);
        resolve();
      });
    });
  }, []);

  const refresh = useCallback(async (daysArg = days) => {
    try {
      setLoading(true);
      setError(null);
      if (authorized !== true) {
        await requestAuth();
      }

      const end = new Date();
      const start = new Date(Date.now() - daysArg * dayMs);

      await new Promise<void>((resolve, reject) => {
        AppleHealthKit.getOxygenSaturationSamples(
          {
            startDate: start.toISOString(),
            endDate: end.toISOString(),
          },
          (err, results) => {
            if (err) {
              setError(String(err));
              return reject(err);
            }

            const mapped: SpO2Point[] = (results ?? [])
              .filter(r => Number.isFinite(r.value))
              .map(r => ({
                ts: r.endDate ?? r.startDate ?? new Date().toISOString(),
                value: Math.round((r.value as number) * 10000) / 100, // HealthKit is fraction (e.g., 0.97) → 97.00
              }))
              .sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime());

            setSamples(mapped);
            setLastSyncAt(new Date().toISOString());
            resolve();
          }
        );
      });
    } finally {
      setLoading(false);
    }
  }, [authorized, days, requestAuth]);

  useEffect(() => {
    // initial pull
    refresh().catch(() => {});
  }, []); // eslint-disable-line

  const latest = useMemo(() => (samples.length ? samples[samples.length - 1] : null), [samples]);

  const dayAvg = useMemo(() => {
    // average of the most recent calendar day with data
    if (!samples.length) return NaN;
    const last = new Date(samples[samples.length - 1].ts);
    const start = new Date(last); start.setHours(0, 0, 0, 0);
    const end = new Date(start.getTime() + dayMs);
    const dayVals = samples
      .filter(s => {
        const t = new Date(s.ts).getTime();
        return t >= start.getTime() && t < end.getTime();
      })
      .map(s => s.value);
    if (!dayVals.length) return NaN;
    return dayVals.reduce((a, b) => a + b, 0) / dayVals.length;
  }, [samples]);

  return {
    loading,
    samples,
    latest,       // { ts, value% }
    dayAvg,       // number (%)
    error,
    lastSyncAt,
    refresh,
  };
}
