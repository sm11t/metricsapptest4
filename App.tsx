import 'react-native-gesture-handler';
import React, { useMemo, useEffect, useRef, useCallback, useState } from 'react';
import {
  Platform, SafeAreaView, View, Text, ScrollView, Pressable, AppState,
} from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useHeartRate } from './src/features/heart-rate/useHeartRate';
import HRDetail from './src/screens/HRDetail';
import HRVDetail from './src/screens/HRVDetail';
import { useHRV } from './src/features/hrv/useHRV';

import ReadinessWide from './src/features/readiness/ReadinessWide';
import ReadinessDetail from './src/screens/ReadinessDetail';
import SleepWide from './src/features/sleep/SleepWide';
import SleepDetail from './src/screens/SleepDetail';

import ActivitySquare from './src/features/activity/ActivitySquare';
import ActivityDetail from './src/screens/ActivityDetail';
import { useActivity } from './src/features/activity/useActivity';

import MeditationSquare from './src/features/mindfulness/MeditationSquare';
import MeditationDetail from './src/screens/MeditationDetail';
import { useMindfulness } from './src/features/mindfulness/useMindfulness';

import SpO2Square from './src/features/spo2/SpO2Square';
import SpO2Detail from './src/screens/SpO2Detail';
import { useSpO2 } from './src/features/spo2/useSpO2';

import { startAutoIngestion } from './src/lib/ingestion/auto';
import AppleHealthKit, { HealthKitPermissions } from 'react-native-health';
import HRVSquare from './src/features/hrv/HRVSquare';

// NEW: split components & central styles
import CalendarStrip from './src/components/CalendarStrip';
import HeartRateSquare from './src/components/HeartRateSquare';
import styles, { CARD_WIDE } from './src/styles';

// REDESIGN: New UI
import { HomeScreen as RedesignHome } from './src/redesign/screens/HomeScreen';

const minsSince = (t: number) => Math.floor((Date.now() - t) / 60_000);

// ---------- Overview with safe auto-refresh + “Updated X mins ago” ----------
function OverviewScreen({ navigation }: any) {
  // Heart
  const { loading, samples, badge, refresh, lastSyncAt } = useHeartRate(365);

  // HRV (REAL)
  const {
    ms: hrvMs,
    history: hrvHistory,
    loading: loadingHRV,
    lastSyncAt: hrvLastSyncAt,
    refresh: refreshHRV,
  } = useHRV();

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

  // Calendar state
  const [selectedDate, setSelectedDate] = useState(new Date());

  // TEMP: demo class-counts by weekday to mirror the mock
  const getClassCount = useCallback((d: Date) => {
    const dow = d.getDay(); // Sun=0..Sat=6
    if (dow === 3 || dow === 4) return 1; // Wed/Thu
    if (dow === 5) return 3;              // Fri
    if (dow === 6) return 1;              // Sat
    return 0;                             // others => "Book"
  }, []);

  // Debounced/safe auto-refresh
  const lastAutoRef = useRef(0);
  const refreshingRef = useRef(false);
  const safeRefresh = useCallback(async () => {
    const now = Date.now();
    if (refreshingRef.current) return;            // don't overlap
    if (now - lastAutoRef.current < 7000) return; // debounce ~7s
    lastAutoRef.current = now;
    refreshingRef.current = true;
    try {
      await Promise.all([
        refresh?.(2),       // HR: last 2 days (fast)
        refreshSpO2?.(2),   // SpO₂: last 2 days (fast)
        refreshHRV?.(7),    // HRV: last 7 days (typical window)
      ]);
      setLastOverviewUpdatedAt(Date.now());       // mark “updated” when completes
    } finally {
      refreshingRef.current = false;
    }
  }, [refresh, refreshSpO2, refreshHRV]);

  // On mount + when screen gains focus
  useEffect(() => {
    const t = setTimeout(() => { void safeRefresh(); }, 500); // allow HK init
    return () => clearTimeout(t);
  }, [safeRefresh]);

  useFocusEffect(
    useCallback(() => {
      void safeRefresh();
      return () => { };
    }, [safeRefresh]),
  );

  // Whenever app returns to foreground
  useEffect(() => {
    const sub = AppState.addEventListener('change', s => {
      if (s === 'active') setTimeout(() => { void safeRefresh(); }, 300);
    });
    return () => sub.remove();
  }, [safeRefresh]);

  // ---- SpO₂ fallback demo (only if no real data yet) ----
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

  // Status: “Updating …” while any key stream is loading; otherwise “Updated X mins ago”.
  const anyLoading = loading || loadingSpO2 || loadingHRV || loadingActivity || loadingMind;
  const status = useMemo(() => {
    if (anyLoading) return 'Updating from Health…';
    if (lastOverviewUpdatedAt != null) {
      const mins = minsSince(lastOverviewUpdatedAt);
      return `Updated ${mins} min${mins === 1 ? '' : 's'} ago`;
    }
    if (lastSyncAt) {
      const mins = minsSince(lastSyncAt);
      return `Updated ${mins} min${mins === 1 ? '' : 's'} ago`;
    }
    return '—';
  }, [anyLoading, lastOverviewUpdatedAt, lastSyncAt, minuteTick]);

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.h1}>Activity</Text>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable
              style={styles.refreshBtn}
              onPress={() => navigation.navigate('IngestionDebug')}
            >
              <Text style={[styles.refreshText]}>Debug</Text>
            </Pressable>

            <Pressable style={styles.refreshBtn} onPress={() => void safeRefresh()} disabled={anyLoading}>
              <Text style={[styles.refreshText, anyLoading && { opacity: 0.6 }]}>
                {anyLoading ? 'Refreshing…' : 'Refresh'}
              </Text>
            </Pressable>
          </View>
        </View>
        <Text style={styles.statusText}>{status}</Text>

        {/* Calendar strip */}
        <CalendarStrip
          selected={selectedDate}
          onChange={setSelectedDate}
          getCount={getClassCount}
        />

        <View style={styles.grid}>
          <ReadinessWide
            width={CARD_WIDE}
            height={CARD_WIDE / 2}
            onPress={() => navigation.navigate('ReadinessDetail')}
          />
          <SleepWide
            width={CARD_WIDE}
            height={CARD_WIDE / 2}
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
            size={undefined as any} // size handled inside component
            steps={steps}
            kcal={activeEnergyKcal}
            loading={loadingActivity}
            badge={activityBadge}
            lastSyncAt={lastActivitySyncAt}
          />
          <MeditationSquare
            onPress={() => navigation.navigate('MeditationDetail', { history: mindHistory })}
            size={undefined as any}
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
            onPress={() => navigation.navigate('HRVDetail', { history: hrvHistory })}
            size={undefined as any}
            value={Number.isFinite(hrvMs as number) ? (hrvMs as number) : 0}
            history={hrvHistory ?? []}
          />
          <SpO2Square
            onPress={() => navigation.navigate('SpO2Detail', { history: showSpO2History })}
            size={undefined as any}
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
  // Gate the app on HealthKit authorization to avoid "Authorization not determined"
  const [hkReady, setHkReady] = useState<null | boolean>(null); // null = requesting

  const initHK = useCallback(() => {
    if (Platform.OS !== 'ios') return;

    const HRV_PERMISSION: any =
      (AppleHealthKit as any).Constants?.Permissions?.HeartRateVariabilitySDNN ??
      (AppleHealthKit as any).Constants?.Permissions?.HeartRateVariability;

    const perms: HealthKitPermissions = {
      permissions: {
        read: [
          AppleHealthKit.Constants.Permissions.HeartRate,
          AppleHealthKit.Constants.Permissions.OxygenSaturation,
          HRV_PERMISSION,
        ].filter(Boolean) as any,
        write: [],
      },
    };

    AppleHealthKit.initHealthKit(perms, (err: string) => {
      if (err) {
        console.log('HealthKit init error:', err);
        setHkReady(false);
      } else {
        setHkReady(true);
      }
    });
  }, []);

  useEffect(() => {
    if (Platform.OS === 'ios') initHK();
  }, [initHK]);

  // Start foreground auto-ingestion only after HK is authorized
  useEffect(() => {
    if (Platform.OS !== 'ios' || hkReady !== true) return;
    const runner = startAutoIngestion?.({
      user_id: 'u_dev',
      source: 'apple_health',
      device_id: 'ios_device',
      intervalMs: 60_000,
      windowHours: 6,
    });
    return () => runner?.stop?.();
  }, [hkReady]);

  if (Platform.OS !== 'ios') {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.container}><Text style={styles.h1}>iOS only for Apple Health</Text></View>
      </SafeAreaView>
    );
  }

  // While asking for permissions
  if (hkReady === null) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#9ca3af' }}>Requesting Health permissions…</Text>
        </View>
      </SafeAreaView>
    );
  }

  // If user denied or Health unavailable, show a help screen + retry
  if (hkReady === false) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={{ flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontWeight: '700', marginBottom: 8 }}>Health access is off</Text>
          <Text style={{ color: '#9ca3af', textAlign: 'center', marginBottom: 16 }}>
            Turn on “Blood Oxygen”, “Heart Rate” and “HRV” in the Health app:
            Health → Access &amp; Devices → Apps → metricsapptest4 → Allow.
          </Text>
          <Pressable onPress={initHK} style={{ padding: 10, backgroundColor: '#1a1a1a', borderRadius: 10 }}>
            <Text style={{ color: '#60a5fa', fontWeight: '700' }}>Try again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ✅ Authorized – render the app
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#0b0b0b' }, headerTintColor: '#fff' }}>
        {/* REDESIGN: New Home Screen - Set as initial route */}
        <Stack.Screen
          name="RedesignHome"
          component={RedesignHome}
          options={{ headerShown: false }}
        />

        {/* Original screens */}
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
