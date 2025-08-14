import 'react-native-gesture-handler';
import React, {
  useEffect, useMemo, useRef, useState, createContext, useContext,
} from 'react';
import {
  Platform, SafeAreaView, View, Text, ScrollView, Button,
  ActivityIndicator, StyleSheet, Pressable, Alert,
} from 'react-native';
import AppleHealthKit, { HealthKitPermissions } from 'react-native-health';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LineChart } from 'react-native-gifted-charts';

type HRSample = { startDate: string; value: number };
type HRPoint = { value: number; label?: string }; // for chart
type HRContextType = { samples: HRSample[]; refresh: (daysBack?: number) => void; loading: boolean; };
const HRContext = createContext<HRContextType>({ samples: [], refresh: () => {}, loading: false });
const useHR = () => useContext(HRContext);

// ----- helpers -----
const msPerMin = 60_000;
const toMs = (iso: string) => new Date(iso).getTime();
const startOfDay = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

function fmtTime(ts: number, granularityMin: number) {
  const d = new Date(ts);
  // short label based on bucket size
  if (granularityMin >= 1440) return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  if (granularityMin >= 60)   return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric' });
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

function bucketAvg(
  samples: HRSample[],
  start: Date,
  end: Date,
  bucketMinutes: number
): Array<{ ts: number; value: number }> {
  const startMs = start.getTime(), endMs = end.getTime();
  const size = Math.max(1, Math.ceil((endMs - startMs) / (bucketMinutes * msPerMin)));
  const bins = Array.from({ length: size }, (_, i) => ({ t: startMs + i * bucketMinutes * msPerMin, sum: 0, n: 0 }));
  for (const s of samples) {
    const t = toMs(s.startDate);
    if (t < startMs || t >= endMs) continue;
    const idx = Math.min(bins.length - 1, Math.floor((t - startMs) / (bucketMinutes * msPerMin)));
    bins[idx].sum += s.value; bins[idx].n += 1;
  }
  return bins.map(b => ({ ts: b.t, value: b.n ? b.sum / b.n : NaN })).filter(p => !Number.isNaN(p.value));
}

function downsample<T>(arr: T[], maxPoints = 400) {
  if (arr.length <= maxPoints) return arr;
  const step = Math.ceil(arr.length / maxPoints);
  const out: T[] = [];
  for (let i = 0; i < arr.length; i += step) out.push(arr[i]);
  return out;
}

function statsToday(samples: HRSample[]) {
  const s = startOfDay(), e = new Date();
  const values = samples.filter(x => {
    const t = toMs(x.startDate);
    return t >= s.getTime() && t <= e.getTime();
  }).map(x => x.value);
  if (!values.length) return { avg: 0, min: 0, max: 0, count: 0 };
  const sum = values.reduce((a, b) => a + b, 0);
  return { avg: sum / values.length, min: Math.min(...values), max: Math.max(...values), count: values.length };
}

// ----- Health perms (defensive) -----
const HK = AppleHealthKit.Constants.Permissions;
const READ_TYPES = [
  HK.HeartRate,
  HK.RestingHeartRate,
  HK.HeartRateVariabilitySDNN ?? (HK as any).HeartRateVariability,
  HK.SleepAnalysis,
  HK.RespiratoryRate,
  HK.MindfulSession,
].filter(Boolean);
const perms: HealthKitPermissions = { permissions: { read: READ_TYPES as any, write: [] } };

// ----- Overview (card + sparkline) -----
function OverviewScreen({ navigation }: any) {
  const { samples, refresh, loading } = useHR();
  const today = statsToday(samples);

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const spark: HRPoint[] = useMemo(() => {
    const pts = bucketAvg(samples, sevenDaysAgo, now, 60 * 24); // daily
    const ds = downsample(pts, 60);
    return ds.map(p => ({ value: p.value }));
  }, [samples]);

  const total = samples.length;
  const last = total ? new Date(samples[total - 1].startDate).toLocaleString() : '—';

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.h1}>Activity</Text>

        <Pressable style={styles.card} onPress={() => navigation.navigate('HRDetail')}>
          <View style={styles.cardTopRow}>
            <Text style={styles.cardTitle}>Heart Rate</Text>
            <Button title="Refresh" onPress={() => refresh(365)} disabled={loading} />
          </View>

          <Text style={styles.cardBig}>
            {today.count ? `${Math.round(today.avg)} bpm` : '--'}
          </Text>
          <Text style={styles.cardSub}>
            {today.count ? `Today · min ${Math.round(today.min)} / max ${Math.round(today.max)}` : 'No samples today'}
          </Text>

          <View style={styles.chartBox}>
            <LineChart
              areaChart
              curved
              hideDataPoints
              data={spark}
              thickness={2}
              startFillColor="#f59e0b33"
              endFillColor="#f59e0b06"
              color="#f59e0b"
              startOpacity={1}
              endOpacity={0}
              yAxisLabelWidth={0}
              xAxisThickness={0}
              yAxisThickness={0}
              noOfSections={4}
              rulesType="dashed"
              rulesColor="#ffffff22"
            />
          </View>

          {/* diagnostics below the chart so it never overlaps */}
          <Text style={[styles.cardSub, { marginTop: 8 }]}>
            Loaded: {total} samples · Last: {last}
          </Text>
        </Pressable>

        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator />
            <Text style={styles.msg}>Updating from Health…</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ----- Detail (interactive chart with pointer) -----
function HRDetailScreen() {
  const { samples, refresh, loading } = useHR();
  const [range, setRange] = useState<'1D' | '3D' | '7D' | '30D' | '90D'>('7D');

  const { points, label, bucket } = useMemo(() => {
    const now = new Date();
    const days = range === '1D' ? 1 : range === '3D' ? 3 : range === '7D' ? 7 : range === '30D' ? 30 : 90;
    const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const bucket =
      range === '1D' ? 5 :
      range === '3D' ? 15 :
      range === '7D' ? 60 :
      range === '30D' ? 120 : 1440;
    const pts = bucketAvg(samples, start, now, bucket);
    const ds = downsample(pts, 600);
    const withLabels: HRPoint[] = ds.map(p => ({ value: p.value, label: fmtTime(p.ts, bucket) }));
    return { points: withLabels, label: `${range} · bucket ${bucket}m`, bucket };
  }, [samples, range]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.h1}>Heart Rate</Text>

        <View style={styles.seg}>
          {(['1D','3D','7D','30D','90D'] as const).map(k => (
            <Pressable key={k} onPress={() => setRange(k)} style={[styles.segBtn, range === k && styles.segBtnActive]}>
              <Text style={[styles.segText, range === k && styles.segTextActive]}>{k}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.msg, { marginBottom: 8 }]}>{label}</Text>

        <View style={styles.chartTall}>
          <LineChart
            areaChart
            curved
            data={points}
            thickness={2}
            startFillColor="#f59e0b33"
            endFillColor="#f59e0b06"
            color="#f59e0b"
            startOpacity={1}
            endOpacity={0}
            yAxisLabelWidth={0}
            xAxisThickness={0}
            yAxisThickness={0}
            noOfSections={5}
            rulesType="dashed"
            rulesColor="#ffffff22"
            // show small round data points
            showDataPoints
            dataPointsColor="#f59e0b"
            dataPointsRadius={3}
            // interactive crosshair + label
            focusEnabled
            pointerConfig={{
              pointerStripUptoDataPoint: true,
              pointerStripColor: '#f59e0b66',
              pointerStripWidth: 2,
              radius: 4,
              pointerColor: '#f59e0b',
              showPointerStrip: true,
              // label bubble
              pointerLabelWidth: 90,
              pointerLabelHeight: 48,
              pointerLabelComponent: (items: any[]) => {
                const it = items?.[0];
                const v = it?.value ? Math.round(it.value) : '--';
                const when = it?.label ?? '';
                return (
                  <View style={styles.tooltip}>
                    <Text style={styles.tooltipValue}>{v} bpm</Text>
                    <Text style={styles.tooltipWhen}>{when}</Text>
                  </View>
                );
              },
            }}
          />
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
          <Button title="Refresh (30d)" onPress={() => refresh(30)} disabled={loading} />
          <Button title="Refresh (365d)" onPress={() => refresh(365)} disabled={loading} />
        </View>
      </View>
    </SafeAreaView>
  );
}

// ----- App shell & data provider -----
const Stack = createNativeStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [samples, setSamples] = useState<HRSample[]>([]);
  const didInit = useRef(false);

  useEffect(() => {
    if (Platform.OS !== 'ios') { setInitializing(false); return; }
    if (didInit.current) return; didInit.current = true;

    AppleHealthKit.initHealthKit(perms, (err) => {
      setInitializing(false);
      if (err) {
        setAuthorized(false);
        Alert.alert('Health Access', 'Please enable “Heart Rate” in Health → Profile → Apps → metricsapptest4.');
        return;
      }
      setAuthorized(true);
    });
  }, []);

  useEffect(() => { if (authorized) refresh(365); }, [authorized]);

  const refresh = (daysBack = 30) => {
    if (!authorized) return;
    const end = new Date();
    const start = new Date(end.getTime() - daysBack * 24 * 60 * 60 * 1000);
    const options = { startDate: start.toISOString(), endDate: end.toISOString(), ascending: false, limit: 10000 };

    setLoading(true);
    AppleHealthKit.getHeartRateSamples(options, (err, results: any[] = []) => {
      setLoading(false);
      if (err) { console.error('getHeartRateSamples error', err); Alert.alert('Health Error', String(err)); setSamples([]); return; }
      const list: HRSample[] = results.map(r => ({ startDate: r.startDate, value: Number(r.value) || 0 }));
      list.sort((a, b) => toMs(a.startDate) - toMs(b.startDate));
      setSamples(list);
      console.log(`Loaded ${list.length} HR samples. First: ${list[0]?.startDate ?? '—'}  Last: ${list[list.length-1]?.startDate ?? '—'}`);
    });
  };

  const value = useMemo(() => ({ samples, refresh, loading }), [samples, loading]);

  if (Platform.OS !== 'ios') {
    return <SafeAreaView style={styles.root}><View style={styles.container}><Text style={styles.h1}>iOS only for Apple Health</Text></View></SafeAreaView>;
  }

  if (initializing) {
    return <SafeAreaView style={styles.root}><View style={styles.container}><ActivityIndicator /><Text style={styles.msg}>Requesting Health access…</Text></View></SafeAreaView>;
  }

  return (
    <HRContext.Provider value={value}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#0b0b0b' }, headerTintColor: '#fff' }}>
          <Stack.Screen name="Overview" component={OverviewScreen} options={{ title: 'Activity' }} />
          <Stack.Screen name="HRDetail" component={HRDetailScreen} options={{ title: 'Heart Rate' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </HRContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0b0b0b' },
  container: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 },
  h1: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 12 },
  msg: { color: '#cfcfcf' },
  card: {
    backgroundColor: '#121212',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    overflow: 'hidden',         // <-- keeps the chart inside rounded corners
  },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { color: '#9ca3af', fontSize: 14 },
  cardBig: { color: '#fff', fontSize: 28, fontWeight: '700', marginTop: 6 },
  cardSub: { color: '#cfcfcf', marginTop: 4 },
  chartBox: { height: 120, marginTop: 8 }, // small sparkline
  chartTall: { height: 260, borderRadius: 12, overflow: 'hidden' },
  seg: { flexDirection: 'row', backgroundColor: '#171717', padding: 4, borderRadius: 12, marginBottom: 12 },
  segBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  segBtnActive: { backgroundColor: '#f59e0b22' },
  segText: { color: '#cfcfcf' },
  segTextActive: { color: '#f59e0b', fontWeight: '700' },

  // tooltip bubble
  tooltip: {
    backgroundColor: '#1f2937',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tooltipValue: { color: '#fff', fontWeight: '700' },
  tooltipWhen: { color: '#cfcfcf', fontSize: 12, marginTop: 2 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
});
