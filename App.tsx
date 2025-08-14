import 'react-native-gesture-handler';
import React, { useMemo } from 'react';
import {
  Platform, SafeAreaView, View, Text, ScrollView, Pressable, StyleSheet, Dimensions,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LineChart } from 'react-native-gifted-charts';
import { useHeartRate } from './src/features/heart-rate/useHeartRate';

// Gifted Charts types lag sometimes; alias as any so advanced props compile.
const Line: any = LineChart;

type HRPoint = { value: number; dataPointColor?: string; dataPointRadius?: number };

const { width: SCREEN_W } = Dimensions.get('window');
const PAD_H = 16;
const GAP = 12;
const CARD = Math.floor((SCREEN_W - PAD_H * 2 - GAP) / 2); // grid-ready square
const CHART_H = Math.round(CARD * 0.5);

// ---------- UI bits ----------
function BadgeChip({ label }: { label: 'RECOVER' | 'MAINTAIN' | 'TRAIN' }) {
  const color = label === 'RECOVER' ? '#ef4444' : label === 'TRAIN' ? '#22c55e' : '#f59e0b';
  return (
    <View style={[styles.badge, { borderColor: color, backgroundColor: color + '22' }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

// ---------- math helpers for the 30-minute flow ----------
const toMs = (iso: string) => new Date(iso).getTime();
const mean = (a: number[]) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : NaN);

// resample known points to N evenly-spaced times (simple linear interpolation)
function resampleLinear(points: Array<{ t: number; v: number }>, n: number) {
  if (points.length === 0) return [];
  if (points.length === 1) return Array.from({ length: n }, (_, i) => ({ t: points[0].t + i, v: points[0].v }));
  const start = points[0].t;
  const end = points[points.length - 1].t;
  const step = (end - start) / (n - 1);
  const out: Array<{ t: number; v: number }> = [];
  let j = 0;
  for (let i = 0; i < n; i++) {
    const x = start + step * i;
    while (j < points.length - 2 && points[j + 1].t < x) j++;
    const p1 = points[j], p2 = points[j + 1];
    const ratio = (x - p1.t) / Math.max(1, p2.t - p1.t);
    const y = p1.v + (p2.v - p1.v) * ratio;
    out.push({ t: x, v: y });
  }
  return out;
}

// Build smooth minute-level series for the *last 30 minutes ending at the latest sample time*.
function last30MinSeries(samples: { ts: string; bpm: number }[]) {
  // pick an end time: latest sample if available, otherwise "now"
  const end = samples.length ? new Date(samples[samples.length - 1].ts).getTime() : Date.now();
  const start = end - 30 * 60_000;

  // filter window and average by minute to stabilize
  const mins = new Map<number, number[]>();
  for (const s of samples) {
    const t = new Date(s.ts).getTime();
    if (t < start || t > end || !Number.isFinite(s.bpm)) continue;
    const m = Math.floor(t / 60_000) * 60_000;
    const arr = mins.get(m) ?? [];
    arr.push(s.bpm);
    mins.set(m, arr);
  }

  const raw = [...mins.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([t, arr]) => ({ t, v: arr.reduce((s, x) => s + x, 0) / arr.length }))
    .filter(p => Number.isFinite(p.v));

  // ensure we always have at least two points (prevents NaN/Infinity layout)
  const series = raw.length ? raw : [{ t: start, v: 60 }, { t: end, v: 60 }];

  // resample to a smooth curve
  const smooth = resampleLinear(series, 24);

  // LAST point is a small WHITE dot
  const data: HRPoint[] = smooth.map((p, i) => ({
    value: p.v,
    dataPointRadius: i === smooth.length - 1 ? 3 : 0,
    dataPointColor: i === smooth.length - 1 ? '#ffffff' : 'transparent',
  }));

  const startLabel = new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endLabel   = new Date(end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return { startLabel, endLabel, data };
}

// ---------- compact HR tile ----------
function HeartRateSquare({
  onPress,
  samples,
  badge,
}: {
  onPress: () => void;
  samples: { ts: string; bpm: number }[];
  badge?: { badge: 'RECOVER' | 'MAINTAIN' | 'TRAIN'; reason: string };
}) {
  const { data, startLabel, endLabel } = useMemo(() => last30MinSeries(samples), [samples]);

  // simple avg/min/max over the same 30-min window for the text
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

      {/* flowing curved area chart sits at bottom half */}
      <View style={styles.squareChart}>
        <Line
          areaChart
          curved
          data={data}
          thickness={2}
          startFillColor="#f59e0b33"  // gradient
          endFillColor="#f59e0b06"
          color="#f59e0b"
          startOpacity={1}
          endOpacity={0}
          hideRules={false}
          noOfSections={3}
          rulesType="dashed"
          rulesColor="#ffffff16"
          yAxisLabelWidth={0}
          xAxisThickness={0}
          yAxisThickness={0}
          showDataPoints     // we control radius/color per-point; only last has radius>0
        />
        {/* X axis labels */}
        <View style={styles.xLabelsRow}>
          <Text style={styles.xLabel}>{startLabel}</Text>
          <Text style={styles.xLabel}>{endLabel}</Text>
        </View>
      </View>
    </Pressable>
  );
}

// ---------- Overview with Refresh ----------
function OverviewScreen({ navigation }: any) {
  const { loading, samples, badge, refresh, lastSyncAt } = useHeartRate(365);
  const lastTs = samples.length ? new Date(samples[samples.length - 1].ts) : undefined;
  const status = loading
  ? 'Updating from Health…'
  : lastSyncAt
  ? `Updated ${new Date(lastSyncAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  : '—';

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------- Simple detail placeholder (we’ll flesh out later) ----------
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
