// src/features/heart-rate/useHeartRate.ts
import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import AppleHealthKit, { HealthKitPermissions } from 'react-native-health';
import { baseline28, deltaPct, toDaily, type HRSample } from './math';
import { decideBadge } from './insights';

const HK = AppleHealthKit.Constants.Permissions;
const READ = [
  HK.HeartRate,
  HK.RestingHeartRate,
  // HK.HeartRateVariabilitySDNN ?? (HK as any).HeartRateVariability,
  HK.SleepAnalysis,
].filter(Boolean);

const perms: HealthKitPermissions = { permissions: { read: READ as any, write: [] } };

export function useHeartRate(daysBackDefault = 90) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [samples, setSamples] = useState<HRSample[]>([]);
  const [lastSyncAt, setLastSyncAt] = useState<number | undefined>(undefined); // NEW
  const didInit = useRef(false);

  // init once
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    if (Platform.OS !== 'ios') return;

    AppleHealthKit.initHealthKit(perms, (err) => {
      if (err) { setAuthorized(false); return; }
      setAuthorized(true);
      refresh(daysBackDefault);
    });
  }, [daysBackDefault]);

  // fetch
  const refresh = (daysBack = daysBackDefault) => {
    if (!authorized) return;
    const end = new Date();
    const start = new Date(end.getTime() - daysBack * 24 * 60 * 60 * 1000);
    const options = {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      ascending: true,
      limit: 100000,
    };

    setLoading(true);
    AppleHealthKit.getHeartRateSamples(options, (err, res: any[] = []) => {
      setLoading(false);
      if (err) {
        console.error('getHeartRateSamples', err);
        setSamples([]);
        setLastSyncAt(Date.now()); // still mark sync completion
        return;
      }
      const list: HRSample[] = res.map(r => ({ ts: r.startDate, bpm: Number(r.value) || 0 }));
      setSamples(list);
      setLastSyncAt(Date.now());   // mark when we finished syncing
    });
  };

  // ---------- derivations ----------
  const daily = useMemo(() => toDaily(samples), [samples]);
  const baseline = useMemo(() => baseline28(daily), [daily]);

  const today = daily[daily.length - 1];
  const todayDelta = useMemo(
    () => deltaPct(today?.rhr, baseline[baseline.length - 1]?.baseline),
    [today, baseline]
  );

  const badge = useMemo(() => decideBadge(daily, baseline), [daily, baseline]);

  // sparkline: last 7 daily RHRs
  const sparkRhr = useMemo(
    () => daily.slice(-7).map(d => d.rhr ?? NaN).filter(n => Number.isFinite(n)),
    [daily]
  );

  return {
    authorized,
    loading,
    samples,
    daily,
    baseline,
    today,
    todayDelta,
    badge,
    sparkRhr,
    refresh,
    lastSyncAt, // expose
  };
}
