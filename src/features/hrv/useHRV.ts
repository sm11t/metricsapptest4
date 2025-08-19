import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import AppleHealthKit, { HealthKitPermissions } from 'react-native-health';
import { baseline28, deltaPct, toDaily, type HRVSample } from './math';
import { decideBadge } from './insights';

const HK = AppleHealthKit.Constants.Permissions as any;

// Some library versions expose HeartRateVariabilitySDNN; others use HeartRateVariability.
const HRV_CONST = HK?.HeartRateVariabilitySDNN ?? HK?.HeartRateVariability ?? null;
const READ = [HRV_CONST].filter(Boolean);
const perms: HealthKitPermissions = { permissions: { read: READ as any, write: [] } };

export function useHRV(daysBackDefault = 90) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [samples, setSamples] = useState<HRVSample[]>([]);
  const [lastSyncAt, setLastSyncAt] = useState<number | undefined>(undefined);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    if (Platform.OS !== 'ios') return;

    // Avoid the crash: if we have no readable types on this RN Health version, skip init.
    if (READ.length === 0) {
      console.warn('[useHRV] HRV HealthKit constant not found; skipping init');
      setAuthorized(false);
      return;
    }

    AppleHealthKit.initHealthKit(perms, (err) => {
      if (err) { setAuthorized(false); return; }
      setAuthorized(true);
      refresh(daysBackDefault);
    });
  }, [daysBackDefault]);

  const refresh = (daysBack = daysBackDefault) => {
    if (!authorized || READ.length === 0) return;

    const end = new Date();
    const start = new Date(end.getTime() - daysBack * 24 * 60 * 60 * 1000);

    // Ask for ms explicitly (harmless if the lib ignores it).
    const options: any = {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      ascending: true,
      limit: 100000,
      unit: 'ms',
    };

    setLoading(true);
    AppleHealthKit.getHeartRateVariabilitySamples(options, (err, res: any[] = []) => {
      setLoading(false);
      if (err) {
        console.error('getHeartRateVariabilitySamples', err);
        setSamples([]);
        setLastSyncAt(Date.now());
        return;
      }
      const list: HRVSample[] = res.map(r => ({ ts: r.startDate, ms: Number(r.value) || 0 }));
      setSamples(list);
      setLastSyncAt(Date.now());
    });
  };

  const daily = useMemo(() => toDaily(samples), [samples]);
  const baseline = useMemo(() => baseline28(daily), [daily]);

  const today = daily[daily.length - 1];
  const todayDelta = useMemo(() => deltaPct(today?.hrv, baseline[baseline.length - 1]?.baseline), [today, baseline]);

  // Use a longer window so users see something even if today/last 7d are empty.
  const spark = useMemo(() => {
    const d = daily.slice(-30).map(x => x.hrv ?? NaN).filter(n => Number.isFinite(n));
    return d;
  }, [daily]);

  const badge = useMemo(() => decideBadge(daily, baseline), [daily, baseline]);

  return { authorized, loading, samples, daily, baseline, today, todayDelta, badge, spark, refresh, lastSyncAt };
}
