import 'react-native-gesture-handler';
import React, { useMemo, useEffect, useRef, useCallback, useState } from 'react';

import {
  Platform, SafeAreaView, View, Text, ScrollView, Pressable, StyleSheet, Dimensions, AppState,
} from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LineChart } from 'react-native-gifted-charts';

import { resampleLinear } from './src/ui/chartSafe';
import { BadgeChip } from './src/ui/BadgeChip';

// Heart rate & HRV detail
import { useHeartRate } from './src/features/heart-rate/useHeartRate';
import HRDetail from './src/screens/HRDetail';
import HRVDetail from './src/screens/HRVDetail';

// Readiness
import ReadinessWide from './src/features/readiness/ReadinessWide';
import ReadinessDetail from './src/screens/ReadinessDetail';

// Sleep (mock/wide) + detail
import SleepWide from './src/features/sleep/SleepWide';
import SleepDetail from './src/screens/SleepDetail';

// Activity (real HealthKit data)
import ActivitySquare from './src/features/activity/ActivitySquare';
import ActivityDetail from './src/screens/ActivityDetail';
import { useActivity } from './src/features/activity/useActivity';

// Mindfulness (minutes)
import MeditationSquare from './src/features/mindfulness/MeditationSquare';
import MeditationDetail from './src/screens/MeditationDetail';
import { useMindfulness } from './src/features/mindfulness/useMindfulness';

// SpO₂ (Blood Oxygen)
import SpO2Square from './src/features/spo2/SpO2Square';
import SpO2Detail from './src/screens/SpO2Detail';
import { useSpO2 } from './src/features/spo2/useSpO2';

// (optional) foreground auto-ingestion runner
import { startAutoIngestion } from './src/lib/ingestion/auto';

import AppleHealthKit, { HealthKitPermissions } from 'react-native-health';
import HRVSquare from './src/features/hrv/HRVSquare';

const Line: any = LineChart;

type HRPoint = { value: number; dataPointColor?: string; dataPointRadius?: number };

const { width: SCREEN_W } = Dimensions.get('window');
const PAD_H = 16;
const GAP = 12;
const CARD = Math.floor((SCREEN_W - PAD_H * 2 - GAP) / 2);
const CHART_H = Math.round(CARD * 0.5);
const CARD_WIDE = CARD * 2 + GAP;

// ---------- helpers ----------
const toMs = (iso: string) => new Date(iso).getTime();
const mean = (a: number[]) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : NaN);
const nowMs = () => Date.now();
const minsSince = (t: number) => Math.floor((nowMs() - t) / 60_000);

function last30MinSeries(samples: { ts: string; bpm: number }[]) {
  const end = samples.length ? new Date(samples[samples.length - 1].ts).getTime() : Date.now();
  const start = end - 30 * 60_000;

  const byMin = new Map<number, number[]>();
  for (const s of samples) {
    const t = new Date(s.ts).getTime();
    if (t < start || t > end || !Number.isFinite(s.bpm)) continue;
    const m = Math.floor(t / 60_000) * 60_000;
    (byMin.get(m) ?? byMin.set(m, []).get(m)!).push(s.bpm);
  }

  const raw = [...byMin.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([t, arr]) => ({ t, v: arr.reduce((s, x) => s + x, 0) / arr.length }))
    .filter(p => Number.isFinite(p.v));

  const series = raw.length ? raw : [{ t: start, v: 60 }, { t: end, v: 60 }];
  const smooth = resampleLinear(series, 24);

  const data: HRPoint[] = smooth.map((p, i) => ({
    value: p.v,
    dataPointRadius: i === smooth.length - 1 ? 3 : 0,
    dataPointColor: i === smooth.length - 1 ? '#ffffff' : 'transparent',
  }));

  let lo = Math.min(...smooth.map(p => p.v));
  let hi = Math.max(...smooth.map(p => p.v));
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || hi - lo < 1) { lo = 59.5; hi = 60.5; }

  const startLabel = new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endLabel   = new Date(end).toLocaleTimeString([],   { hour: '2-digit', minute: '2-digit' });

  return { startLabel, endLabel, data, yMin: Math.max(0, lo), yMax: hi };
}

function HeartRateSquare({
  onPress,
  samples,
  badge,
}: {
  onPress: () => void;
  samples: { ts: string; bpm: number }[];
  badge?: { badge: 'RECOVER' | 'MAINTAIN' | 'TRAIN'; reason: string };
}) {
  const { data, startLabel, endLabel, yMin, yMax } = useMemo(() => last30MinSeries(samples), [samples]);

  const stats = useMemo(() => {
    if (!samples.length) return { avg: NaN, min: NaN, max: NaN };
    const end = toMs(samples[samples.length - 1].ts);
    const start = end - 30 * 60_000;
    const vals = samples
      .filter(s => {
        const t = toMs(s.ts);
        return t >= start && t <= end && Number.isFinite(s.bpm);
      })
      .map(s => s.bpm);
    const avg = mean(vals);
    return {
      avg,
      min: vals.length ? Math.min(...vals) : avg,
      max: vals.length ? Math.max(...vals) : avg,
    };
  }, [samples]);

  const avgDisplay = Number.isFinite(stats.avg) ? Math.round(stats.avg as number).toString() : '—';
  const sub =
    Number.isFinite(stats.min) && Number.isFinite(stats.max)
      ? `min ${Math.round(stats.min as number)} · max ${Math.round(stats.max as number)}`
      : '—';

  return (
    <Pressable style={styles.square} onPress={onPress}>
      <View style={styles.squareTop}>
        <Text style={styles.squareTitle}>Heart</Text>
        {badge && <BadgeChip label={badge.badge} />}
      </View>

      <View style={styles.squareCenter}>
        <Text numberOfLines={1} style={styles.squareBig}>{avgDisplay}</Text>
        <Text style={styles.squareUnit}>bpm</Text>
      </View>

      <Text style={styles.squareSub} numberOfLines={1}>{sub}</Text>

      <View style={styles.squareChart}>
        <Line
          areaChart
          curved
          data={data}
          thickness={2}
          startFillColor="#f59e0b33"
          endFillColor="#f59e0b06"
          color="#f59e0b"
          startOpacity={1}
          endOpacity={0}
          showDataPoints
          yAxisLabelWidth={0}
          xAxisThickness={0}
          yAxisThickness={0}
          noOfSections={3}
          rulesType="dashed"
          rulesColor="#ffffff16"
          maxValue={yMax}
          minValue={yMin}
          mostNegativeValue={yMin}
        />
        <View style={styles.xLabelsRow}>
          <Text style={styles.xLabel}>{startLabel}</Text>
          <Text style={styles.xLabel}>{endLabel}</Text>
        </View>
      </View>
    </Pressable>
  );
}

// ---------- Overview with safe auto-refresh + “Updated X mins ago” ----------
function OverviewScreen({ navigation }: any) {
  // Heart
  const { loading, samples, badge, refresh, lastSyncAt } = useHeartRate(365);

  // Mindfulness
  const {
    loading: loadingMind,
    minutesToday,
    history: mindHistory,
    lastSyncAt: mindLastSync,
  } = useMindfulness();

  // Activity (HealthKit)
  const {
    steps,
    activeEnergyKcal,
    loading: loadingActivity,
    badge: activityBadge,
    lastSyncAt: lastActivitySyncAt,
  } = useActivity();

  // SpO₂ (HealthKit)
  const {
    loading: loadingSpO2,
    percent: spo2Percent,
    history: spo2History,
    lastSyncAt: spo2LastSyncAt,
    refresh: refreshSpO2,
  } = useSpO2();

  // Track last “overview” refresh completion and force a render every minute
  const [lastOverviewUpdatedAt, setLastOverviewUpdatedAt] = useState<number | null>(null);
  const [minuteTick, setMinuteTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setMinuteTick(t => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  // Debounced/safe auto-refresh
  const lastAutoRef = useRef(0);
  const refreshingRef = useRef(false);
  const safeRefresh = useCallback(async () => {
    const now = Date.now();
    if (refreshingRef.current) return;          // don't overlap
    if (now - lastAutoRef.current < 7000) return; // debounce ~7s
    lastAutoRef.current = now;
    refreshingRef.current = true;
    try {
      await Promise.all([
        refresh?.(2),     // HR: last 2 days (fast)
        refreshSpO2?.(2), // SpO₂: last 2 days (fast)
      ]);
      setLastOverviewUpdatedAt(Date.now());     // mark “updated” when completes
    } finally {
      refreshingRef.current = false;
    }
  }, [refresh, refreshSpO2]);

  // On mount + when screen gains focus
  useEffect(() => {
    const t = setTimeout(() => { void safeRefresh(); }, 500); // allow HK init
    return () => clearTimeout(t);
  }, [safeRefresh]);

  useFocusEffect(
    useCallback(() => {
      void safeRefresh();
      return () => {};
    }, [safeRefresh]),
  );

  // Whenever app returns to foreground
  useEffect(() => {
    const sub = AppState.addEventListener('change', s => {
      if (s === 'active') setTimeout(() => { void safeRefresh(); }, 300);
    });
    return () => sub.remove();
  }, [safeRefresh]);

  // ---- SpO₂ fallback demo ----
  const demoSpO2History = useMemo(() => {
    const now = Date.now();
    const start = now - 8 * 60 * 60 * 1000;
    const vals = [96, 97, 98, 97, 96, 95, 96, 97, 98, 97, 96, 97, 98, 99, 98, 97];
    return vals.map((v, i) => ({
      ts: new Date(start + i * 30 * 60 * 1000).toISOString(),
      percent: v,
    }));
  }, []);
  const hasRealSpO2 =
    Number.isFinite(spo2Percent as number) && !!(spo2History && spo2History.length > 0);
  const showSpO2Value = hasRealSpO2
    ? (spo2Percent as number)
    : demoSpO2History[demoSpO2History.length - 1].percent;
  const showSpO2History = hasRealSpO2 ? spo2History : demoSpO2History;
  const showSpO2LastSync = hasRealSpO2 ? spo2LastSyncAt : Date.now();

  // HRV demo series
  const demoHRVHistory = useMemo(() => {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const start = now - 6 * day;
    const vals = [48, 52, 60, 55, 58, 50, 56];
    return vals.map((v, i) => ({
      ts: new Date(start + i * day).toISOString(),
      ms: v,
    }));
  }, []);
  const demoHRVValue = demoHRVHistory[demoHRVHistory.length - 1].ms;

  // Status: “Updating …” while loading; otherwise “Updated X mins ago”.
  const status = useMemo(() => {
    if (loading) return 'Updating from Health…';
    if (lastOverviewUpdatedAt != null) {
      const mins = minsSince(lastOverviewUpdatedAt);
      return `Updated ${mins} min${mins === 1 ? '' : 's'} ago`;
    }
    if (lastSyncAt) {
      const mins = minsSince(lastSyncAt);
      return `Updated ${mins} min${mins === 1 ? '' : 's'} ago`;
    }
    return '—';
  }, [loading, lastOverviewUpdatedAt, lastSyncAt, minuteTick]);

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.h1}>Activity</Text>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            {/* DEV: quick nav to the ingestion debug screen */}
            <Pressable
              style={styles.refreshBtn}
              onPress={() => navigation.navigate('IngestionDebug')}
            >
              <Text style={[styles.refreshText]}>Debug</Text>
            </Pressable>

            <Pressable style={styles.refreshBtn} onPress={() => refresh?.(365)} disabled={loading}>
              <Text style={[styles.refreshText, loading && { opacity: 0.6 }]}>
                {loading ? 'Refreshing…' : 'Refresh'}
              </Text>
            </Pressable>
          </View>
        </View>
        <Text style={styles.statusText}>{status}</Text>

        <View style={styles.grid}>
          <ReadinessWide
            width={CARD_WIDE}
            height={CARD}
            onPress={() => navigation.navigate('ReadinessDetail')}
          />
          <SleepWide
            width={CARD_WIDE}
            height={CARD}
            onPress={() => navigation.navigate('SleepDetail')}
          />
          <ActivitySquare
            onPress={() =>
              navigation.navigate('ActivityDetail', {
                steps,
                kcal: activeEnergyKcal,
                lastSyncAt: lastActivitySyncAt,
              })
            }
            size={CARD}
            steps={steps}
            kcal={activeEnergyKcal}
            loading={loadingActivity}
            badge={activityBadge}
            lastSyncAt={lastActivitySyncAt}
          />
          <MeditationSquare
            onPress={() => navigation.navigate('MeditationDetail', { history: mindHistory })}
            size={CARD}
            minutes={minutesToday}
            loading={loadingMind}
            lastSyncAt={mindLastSync}
          />
          <HeartRateSquare
            onPress={() => navigation.navigate('HRDetail')}
            samples={samples}
            badge={badge}
          />
          <HRVSquare
            onPress={() => navigation.navigate('HRVDetail', { history: demoHRVHistory })}
            size={CARD}
            value={demoHRVValue}
            history={demoHRVHistory}
          />
          <SpO2Square
            onPress={() => navigation.navigate('SpO2Detail', { history: showSpO2History })}
            size={CARD}
            value={showSpO2Value}
            loading={loadingSpO2 && !hasRealSpO2}
            lastSyncAt={showSpO2LastSync}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  // HealthKit init once (quiet)
  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    const perms: HealthKitPermissions = {
      permissions: {
        read: [
          AppleHealthKit.Constants.Permissions.HeartRate,
          AppleHealthKit.Constants.Permissions.OxygenSaturation,
        ],
        write: [],
      },
    };
    AppleHealthKit.initHealthKit(perms, (err: string) => {
      if (err) console.log('HealthKit init error:', err);
    });
  }, []);

  // Optional: foreground auto-ingestion (does not affect hook loading)
  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    const runner = startAutoIngestion?.({
      user_id: 'u_dev',
      source: 'apple_health',
      device_id: 'ios_device',
      intervalMs: 60_000,           // 1 min; adjust as needed
      windowHours: 6,               // ingest only recent window
    });
    return () => runner?.stop?.();
  }, []);

  if (Platform.OS !== 'ios') {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.container}><Text style={styles.h1}>iOS only for Apple Health</Text></View>
      </SafeAreaView>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#0b0b0b' }, headerTintColor: '#fff' }}>
        <Stack.Screen name="Overview" component={OverviewScreen} options={{ title: 'Activity' }} />
        <Stack.Screen name="HRDetail" component={HRDetail} options={{ title: 'Heart Rate' }} />
        <Stack.Screen name="ReadinessDetail" component={ReadinessDetail} options={{ title: 'Readiness' }} />
        <Stack.Screen name="HRVDetail" component={HRVDetail} options={{ title: 'HRV' }} />
        <Stack.Screen name="MeditationDetail" component={MeditationDetail} options={{ title: 'Mindfulness' }} />
        <Stack.Screen name="SleepDetail" component={SleepDetail} options={{ title: 'Sleep' }} />
        <Stack.Screen name="ActivityDetail" component={ActivityDetail} options={{ title: 'Activity' }} />
        <Stack.Screen name="SpO2Detail" component={SpO2Detail} options={{ title: 'Blood Oxygen' }} />
        <Stack.Screen
          name="IngestionDebug"
          component={require('./src/dev/IngestionDebug').default}
          options={{ title: 'Ingestion Debug' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0b0b0b' },
  container: { paddingHorizontal: PAD_H, paddingTop: 12, paddingBottom: 16 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 10,
  },
  h1: { color: '#fff', fontSize: 22, fontWeight: '700' },
  refreshBtn: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#1a1a1a' },
  refreshText: { color: '#60a5fa', fontWeight: '700' },
  statusText: { color: '#9ca3af', marginTop: 6, marginBottom: 10 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP, zIndex: 0 },

  square: {
    width: CARD,
    height: CARD,
    backgroundColor: '#121212',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 12,
    overflow: 'hidden',
  },
  squareTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  squareTitle: { color: '#9ca3af', fontSize: 12, fontWeight: '600' },
  squareCenter: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 6 },
  squareBig: { color: '#fff', fontSize: 28, fontWeight: '800', marginRight: 6 },
  squareUnit: { color: '#cfcfcf', marginBottom: 4 },
  squareSub: { color: '#9ca3af', fontSize: 12, marginTop: 4 },

  squareChart: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    height: CHART_H,
  },
  xLabelsRow: {
    position: 'absolute',
    bottom: -2,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  xLabel: { color: '#9ca3af', fontSize: 10 },

  badge: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 999, borderWidth: 1 },
  badgeText: { fontWeight: '700', fontSize: 10, letterSpacing: 0.4 },
});
