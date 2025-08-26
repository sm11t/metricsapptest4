// src/features/hrv/useHRV.ts
import { useCallback, useEffect, useState } from 'react';
import AppleHealthKit, { HealthValue } from 'react-native-health';

export type HRVSample = { ts: string; ms: number };

export function useHRV(days = 7) {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HRVSample[]>([]);
  const [ms, setMs] = useState<number | null>(null);
  const [lastSyncAt, setLastSyncAt] = useState<number | null>(null);

  const fetchHRV = useCallback(async (windowDays = days) => {
    setLoading(true);
    try {
      const now = new Date();
      const startDate = new Date(now.getTime() - windowDays * 24 * 60 * 60 * 1000).toISOString();
      const endDate = now.toISOString();
      const options = { startDate, endDate, unit: 'ms' as const };

      await new Promise<void>((resolve, reject) => {
        // RNAppleHealthKit API name for HRV SDNN:
        // getHeartRateVariabilitySamples(options, cb)
        (AppleHealthKit as any).getHeartRateVariabilitySamples(
          options,
          (err: string, results: HealthValue[] | any[]) => {
            if (err) return reject(new Error(err));
            const mapped = (results || [])
              .map(r => ({ ts: (r as any).endDate, ms: Number((r as any).value) }))
              .filter(s => Number.isFinite(s.ms));

            setHistory(mapped);
            setMs(mapped.length ? mapped[mapped.length - 1].ms : null);
            setLastSyncAt(Date.now());
            resolve();
          },
        );
      });
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchHRV(days);
  }, [days, fetchHRV]);

  const refresh = useCallback((windowDays?: number) => fetchHRV(windowDays ?? days), [fetchHRV, days]);

  return { loading, ms, history, lastSyncAt, refresh };
}
