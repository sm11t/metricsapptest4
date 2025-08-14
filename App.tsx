import 'react-native-gesture-handler';
import React, { useMemo, useState } from 'react';
import {
  Platform, SafeAreaView, View, Text, ScrollView, Pressable, StyleSheet, Dimensions,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LineChart } from 'react-native-gifted-charts';
import { useHeartRate } from './src/features/heart-rate/useHeartRate';

const Line: any = LineChart;

type HRPoint = { value: number };

const { width: SCREEN_W } = Dimensions.get('window');
const PAD_H = 16;
const GAP = 12;
const CARD = Math.floor((SCREEN_W - PAD_H * 2 - GAP) / 2); // two-up grid ready
const CHART_H = Math.round(CARD * 0.5);

// ---------- small badge ----------
function BadgeChip({ label }: { label: 'RECOVER' | 'MAINTAIN' | 'TRAIN' }) {
  const color = label === 'RECOVER' ? '#ef4444' : label === 'TRAIN' ? '#22c55e' : '#f59e0b';
  return (
    <View style={[styles.badge, { borderColor: color, backgroundColor: color + '22' }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

// ---------- helpers ----------
const nowMs = () => Date.now();
const toMs = (iso: string) => new Date(iso).getTime();
const mean = (a: number[]) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : NaN);

// Build a minute-level series for the last `mins` minutes.
// If not enough points, fall back to a flat line at the recent average.
function lastMinutesSeries(
  samples: { ts: string; bpm: number }[],
  mins = 30
): { data: HRPoint[]; avg?: number; min?: number; max?: number } {
  const end = nowMs();
  const start = end - mins * 60_000;
  const recent = samples.filter(s => {
    const t = toMs(s.ts);
    return t >= start && t <= end && Number.isFinite(s.bpm);
  });
  const vals = recent.map(r => r.bpm).filter(Number.isFinite);
  const avg = mean(vals);
  const safeAvg = Number.isFinite(avg) ? avg : 60;

  // dedupe identical timestamps, simple smoothing via 1-min bin
  const buckets = new Map<number, number[]>();
  for (const r of recent) {
    const m = Math.floor(toMs(r.ts) / 60_000) * 60_000;
    const arr = buckets.get(m) ?? [];
    arr.push(r.bpm);
    buckets.set(m, arr);
  }
  const points = [...buckets.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([t, arr]) => ({ t, v: mean(arr) }));

  let data: HRPoint[];
  if (points.length >= 2) {
    data = points.map(p => ({ value: p.v }));
  } else {
    // safe fallback (prevents Infinity/NaN chart crashes)
    data = [{ value: safeAvg }, { value: safeAvg }];
  }
  const min = vals.length ? Math.min(...vals) : safeAvg;
  const max = vals.length ? Math.max(...vals) : safeAvg;
  return { data, avg, min, max };
}

// ---------- compact HR card ----------
function HeartRateSquare({
  onPress,
  samples,
  badge,
}: {
  onPress: () => void;
  samples: { ts: string; bpm: number }[];
  badge?: { badge: 'RECOVER' | 'MAINTAIN' | 'TRAIN'; reason: string };
}) {
  const { data, avg, min, max } = useMemo(() => lastMinutesSeries(samples, 30), [samples]);

  const avgDisplay =
    Number.isFinite(avg as number) ? Math.round(avg as number).toString() : '—';
  const sub =
    Number.isFinite(min as number) && Number.isFinite(max as number)
      ? `min ${Math.round(min as number)} · max ${Math.round(max as number)}`
      : '—';

  return (
    <Pressable style={styles.square} onPress={onPress}>
      <View style={styles.squareTop}>
        <Text style={styles.squareTitle}>Heart</Text>
        {badge && <BadgeChip label={badge.badge} />}
      </View>

      <View style={styles.squareCenter}>
        <Text numberOfLines={1} style={styles.squareBig}>
          {avgDisplay}
        </Text>
        <Text style={styles.squareUnit}>bpm</Text>
      </View>

      <Text style={styles.squareSub} numberOfLines={1}>{sub}</Text>

      {/* flowing area chart in bottom half */}
      <View style={styles.squareChart}>
        <Line
          areaChart
          curved
          hideDataPoints
          data={data}
          thickness={2}
          startFillColor="#f59e0b33"
          endFillColor="#f59e0b06"
          color="#f59e0b"
          startOpacity={1}
          endOpacity={0}
          yAxisLabelWidth={0}
          xAxisThickness={0}
          yAxisThickness={0}
          noOfSections={3}             // subtle grid
          rulesType="dashed"
          rulesColor="#ffffff16"
        />
      </View>
    </Pressable>
  );
}

// ---------- overview ----------
function OverviewScreen({ navigation }: any) {
  const { loading, samples, badge, refresh } = useHeartRate(365);

  // last update status from most recent sample
  const lastTs = samples.length ? new Date(samples[samples.length - 1].ts) : undefined;
  const status = loading
    ? 'Updating from Health…'
    : lastTs
    ? `Updated ${lastTs.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : '—';

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header row with refresh */}
        <View style={styles.headerRow}>
          <Text style={styles.h1}>Activity</Text>
          <Pressable style={styles.refreshBtn} onPress={() => refresh(365)} disabled={loading}>
            <Text style={[styles.refreshText, loading && { opacity: 0.6 }]}>
              {loading ? 'Refreshing…' : 'Refresh'}
            </Text>
          </Pressable>
        </View>
        <Text style={styles.statusText}>{status}</Text>

        <View style={styles.grid}>
          <HeartRateSquare
            onPress={() => navigation.navigate('HRDetail')}
            samples={samples}
            badge={badge}
          />
          {/* add more squares later */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------- simple detail placeholder (kept for navigation) ----------
function HRDetailScreen() {
  return (
    <SafeAreaView style={styles.root}>
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center', height: 240 }]}>
        <Text style={styles.h1}>Heart Rate</Text>
        <Text style={{ color: '#cfcfcf' }}>Detailed view coming next.</Text>
      </View>
    </SafeAreaView>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
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
        <Stack.Screen name="HRDetail" component={HRDetailScreen} options={{ title: 'Heart Rate' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0b0b0b' },
  container: { paddingHorizontal: PAD_H, paddingTop: 12, paddingBottom: 16 },

  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  h1: { color: '#fff', fontSize: 22, fontWeight: '700' },
  refreshBtn: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#1a1a1a' },
  refreshText: { color: '#60a5fa', fontWeight: '700' },
  statusText: { color: '#9ca3af', marginTop: 6, marginBottom: 10 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP },

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

  badge: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 999, borderWidth: 1 },
  badgeText: { fontWeight: '700', fontSize: 10, letterSpacing: 0.4 },
});
