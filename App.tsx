import 'react-native-gesture-handler';
import React, { useMemo } from 'react';
import {
  Platform, SafeAreaView, View, Text, ScrollView, Pressable, StyleSheet, Dimensions,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LineChart } from 'react-native-gifted-charts';
import { useHeartRate } from './src/features/heart-rate/useHeartRate';
import HRDetail from './src/screens/HRDetail';
import { resampleLinear } from './src/ui/chartSafe';
import ReadinessWide from './src/features/readiness/ReadinessWide';
import ReadinessDetail from './src/screens/ReadinessDetail';
import { BadgeChip } from './src/ui/BadgeChip';

// Gifted Charts types lag sometimes; alias as any so advanced props compile.
const Line: any = LineChart;

type HRPoint = { value: number; dataPointColor?: string; dataPointRadius?: number };

const { width: SCREEN_W } = Dimensions.get('window');
const PAD_H = 16;
const GAP = 12;
const CARD = Math.floor((SCREEN_W - PAD_H * 2 - GAP) / 2); // grid-ready square
const CHART_H = Math.round(CARD * 0.5);
const CARD_WIDE = CARD * 2 + GAP; // span 2 columns

// ---------- math helpers for the 30-minute flow ----------
const toMs = (iso: string) => new Date(iso).getTime();
const mean = (a: number[]) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : NaN);

// Build smooth minute-level series for the *last 30 minutes ending at the latest sample time*.
function last30MinSeries(samples: { ts: string; bpm: number }[]) {
  // end = latest recorded sample; if there’s no data, use now
  const end = samples.length ? new Date(samples[samples.length - 1].ts).getTime() : Date.now();
  const start = end - 30 * 60_000;

  // bucket by minute and average (stabilizes spikes)
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

  // Always at least 2 points so the chart never breaks
  const series = raw.length ? raw : [{ t: start, v: 60 }, { t: end, v: 60 }];

  // Smooth to a nice curve (24 points across 30 min)
  const smooth = resampleLinear(series, 24);

  // white dot on the latest sample (last item)
  const data: HRPoint[] = smooth.map((p, i) => ({
    value: p.v,
    dataPointRadius: i === smooth.length - 1 ? 3 : 0,
    dataPointColor: i === smooth.length - 1 ? '#ffffff' : 'transparent',
  }));

  // safe y-range
  let lo = Math.min(...smooth.map(p => p.v));
  let hi = Math.max(...smooth.map(p => p.v));
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || hi - lo < 1) { lo = 59.5; hi = 60.5; }

  const startLabel = new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endLabel   = new Date(end).toLocaleTimeString([],   { hour: '2-digit', minute: '2-digit' });

  return { startLabel, endLabel, data, yMin: Math.max(0, lo), yMax: hi };
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
  const { data, startLabel, endLabel, yMin, yMax } = useMemo(() => last30MinSeries(samples), [samples]);

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
          startFillColor="#f59e0b33"   // gradient
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
          minValue={yMin}             // <- provide a safe lower bound
          mostNegativeValue={yMin}    // <- also safe for versions expecting this prop
        />
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
          {/* Wide Readiness hero */}
          <ReadinessWide
            width={CARD_WIDE}
            height={CARD}
            onPress={() => navigation.navigate('ReadinessDetail')}
          />

          {/* Heart tile */}
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
        <Stack.Screen name="HRDetail" component={HRDetail} options={{ title: 'Heart Rate' }} />
        <Stack.Screen name="ReadinessDetail" component={ReadinessDetail} options={{ title: 'Readiness' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0b0b0b' },
  container: { paddingHorizontal: PAD_H, paddingTop: 12, paddingBottom: 16 },

  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 10 },
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
