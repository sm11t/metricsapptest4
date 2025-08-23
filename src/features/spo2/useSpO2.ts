import { useCallback, useEffect, useRef, useState } from 'react';
import AppleHealthKit from 'react-native-health';

type Sample = { ts: string; percent: number };

export function useSpO2(days: number = 2) {
  const [history, setHistory] = useState<Sample[]>([]);
  const [percent, setPercent] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<number | null>(null);
  const mounted = useRef(true);

  const refresh = useCallback(async (d: number = days) => {
    setLoading(true);
    try {
      const now = new Date();
      const startDate = new Date(now.getTime() - d * 24 * 60 * 60 * 1000).toISOString();
      const endDate = now.toISOString();

      const results: any[] = await new Promise((resolve, reject) => {
        AppleHealthKit.getOxygenSaturationSamples(
          { startDate, endDate },
          (err, res) => (err ? reject(err) : resolve(res ?? []))
        );
      });

      if (!mounted.current) return;

      const samples: Sample[] = results
        .map((r: any) => {
          const v = Number(r.value);
          const pct = v <= 1 ? v * 100 : v; // HK returns 0–1 → convert to %
          return { ts: r.endDate, percent: pct };
        })
        .filter(s => Number.isFinite(s.percent));

      // sort ascending by time for consistency
      samples.sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime());

      setHistory(samples);
      setPercent(samples.length ? samples[samples.length - 1].percent : null);
      setLastSyncAt(Date.now());
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    mounted.current = true;
    // assume permissions handled elsewhere (debug screen button)
    refresh(days).catch(() => {});
    return () => {
      mounted.current = false;
    };
  }, [days, refresh]);

  return { history, percent, loading, lastSyncAt, refresh };
}

export default useSpO2;
