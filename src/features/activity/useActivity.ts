// src/features/activity/useActivity.ts
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AppleHealthKit, {
  HealthKitPermissions,
  HealthValue,
} from 'react-native-health';

type ActivityState = {
  loading: boolean;
  lastSyncAt?: number;
  steps: number;
  activeEnergyKcal: number;
  error?: string;
};

const permissions: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      // (optional but handy)
      // AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
    ],
    write: [],
  },
};

function startOfDayISO(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export function useActivity() {
  const [state, setState] = useState<ActivityState>({
    loading: true,
    steps: 0,
    activeEnergyKcal: 0,
  });
  const inited = useRef(false);

  const initHK = useCallback(async () => {
    return new Promise<void>((resolve) => {
      AppleHealthKit.initHealthKit(permissions, (err: string) => {
        if (err) {
          setState((s) => ({ ...s, loading: false, error: `HealthKit: ${err}` }));
        }
        resolve();
      });
    });
  }, []);

  const refresh = useCallback(async () => {
    try {
      setState((s) => ({ ...s, loading: true, error: undefined }));
      if (!inited.current) {
        await initHK();
        inited.current = true;
      }

      const startDate = startOfDayISO();
      const endDate = new Date().toISOString();

      // ---- Steps (sum of today's samples) ----
      const stepSamples: HealthValue[] = await new Promise((resolve, reject) => {
        AppleHealthKit.getDailyStepCountSamples(
          { startDate, endDate, ascending: true },
          (err, results) => (err ? reject(err) : resolve(results ?? [])),
        );
      });

      const todaySteps = stepSamples.reduce((sum, r: any) => {
        // library returns array; latest iOS often groups per-day bucket
        const v = Number(r.value ?? r.steps ?? 0);
        return sum + (Number.isFinite(v) ? v : 0);
      }, 0);

      // ---- Active Energy (kcal) ----
      // Many apps expose a convenience method:
      // AppleHealthKit.getActiveEnergyBurned()  (not on older versions)
      // To be robust, fall back to generic quantity samples:
      const energySamples: HealthValue[] = await new Promise((resolve, reject) => {
        // @ts-ignore — some versions expose getActiveEnergyBurned, others only getSamples
        const fn =
          (AppleHealthKit as any).getActiveEnergyBurned ??
          ((opts: any, cb: any) =>
            (AppleHealthKit as any).getSamples(
              { ...opts, type: 'ActiveEnergyBurned' },
              cb,
            ));

        fn({ startDate, endDate, ascending: true, unit: 'kcal' }, (err: any, results: any[]) =>
          err ? reject(err) : resolve(results ?? []),
        );
      });

      const kcal = energySamples.reduce((sum, s: any) => {
        const v = Number(s.value ?? 0);
        return sum + (Number.isFinite(v) ? v : 0);
      }, 0);

      setState({
        loading: false,
        steps: Math.max(0, Math.round(todaySteps)),
        activeEnergyKcal: Math.max(0, Math.round(kcal)),
        lastSyncAt: Date.now(),
      });
    } catch (e: any) {
      setState((s) => ({
        ...s,
        loading: false,
        error: String(e?.message || e) || 'Failed to read Activity',
      }));
    }
  }, [initHK]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const badge = useMemo(() => {
    // Tiny heuristic for demo (tweak if you like)
    if (state.steps >= 10000 || state.activeEnergyKcal >= 500) {
      return { badge: 'TRAIN' as const, reason: 'High activity' };
    }
    if (state.steps >= 5000 || state.activeEnergyKcal >= 250) {
      return { badge: 'MAINTAIN' as const, reason: 'Solid movement' };
    }
    return { badge: 'RECOVER' as const, reason: 'Low activity today' };
  }, [state.steps, state.activeEnergyKcal]);

  return { ...state, badge, refresh };
}
