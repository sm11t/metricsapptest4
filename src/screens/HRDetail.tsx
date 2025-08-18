import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useHeartRate } from '../features/heart-rate/useHeartRate';
import { makeChartSafe, safeBpm, safeLabel } from '../ui/chartSafe';

const Line: any = LineChart;

const msMin = 60_000;
const toMs = (iso: string) => new Date(iso).getTime();
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function bucketAvg(
  samples: { ts: string; bpm: number }[],
  start: number,
  end: number,
  bucketMinutes: number
) {
  const size = Math.max(1, Math.ceil((end - start) / (bucketMinutes * msMin)));
  const bins = Array.from({ length: size }, (_, i) => ({ t: start + i * bucketMinutes * msMin, sum: 0, n: 0 }));
  for (const s of samples) {
    const t = toMs(s.ts);
    if (t < start || t >= end || !Number.isFinite(s.bpm)) continue;
    const idx = clamp(Math.floor((t - start) / (bucketMinutes * msMin)), 0, bins.length - 1);
    bins[idx].sum += s.bpm; bins[idx].n += 1;
  }
  return bins.map(b => ({ ts: b.t, value: b.n ? b.sum / b.n : NaN })).filter(p => Number.isFinite(p.value));
}

function fmt(ts: number) {
  return new Date(ts).toLocaleString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default function HRDetail() {
  const { samples, daily, baseline, today, todayDelta, badge, loading, refresh } = useHeartRate(365);
  const [range, setRange] = useState<'1D' | '3D' | '7D' | '30D' | '90D'>('7D');
  const intraday = range === '1D' || range === '3D';

  const chart = useMemo(() => {
    const now = samples.length ? toMs(samples[samples.length - 1].ts) : Date.now();

    if (intraday) {
      const days = range === '1D' ? 1 : 3;
      const start = now - days * 24 * 60 * 60 * 1000;
      const bucket = range === '1D' ? 5 : 15;
      const pts = bucketAvg(samples, start, now, bucket);

      const main = pts.map((p, i) => ({
        value: p.value,
        dataPointRadius: i === pts.length - 1 ? 3 : 0,
        dataPointColor: i === pts.length - 1 ? '#fff' : 'transparent',
        label: fmt(p.ts),
      }));

      return { label: `${range} · ${bucket}-min buckets`, main, base: undefined as any };
    } else {
      const days = range === '7D' ? 7 : range === '30D' ? 30 : 90;
      const rhr  = daily.slice(-days).map(d => ({ value: d.rhr ?? NaN, label: d.date })).filter(d => Number.isFinite(d.value));
      const base = baseline.slice(-days).map(b => ({ value: b.baseline ?? NaN, label: b.date })).filter(b => Number.isFinite(b.value));
      return { label: `${range} · daily RHR vs baseline`, main: rhr, base };
    }
  }, [samples, daily, baseline, range, intraday]);

  const mainSafe = useMemo(() => makeChartSafe(chart.main), [chart.main]);
  const baseSafe = useMemo(() => makeChartSafe(chart.base ?? []), [chart.base]);

  const avg = Math.round(today?.hrAvg ?? NaN);
  const min = Math.round(today?.hrMin ?? NaN);
  const max = Math.round(today?.hrMax ?? NaN);
  const deltaStr = todayDelta !== undefined ? `${todayDelta > 0 ? '+' : ''}${todayDelta!.toFixed(1)}% vs baseline` : '—';

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.h1}>Heart Rate</Text>
          <Pressable style={styles.refresh} onPress={() => refresh(365)} disabled={loading}>
            <Text style={[styles.refreshText, loading && { opacity: 0.6 }]}>{loading ? 'Refreshing…' : 'Refresh'}</Text>
          </Pressable>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statBig}>{Number.isFinite(avg) ? `${avg} bpm` : '—'}</Text>
          <Text style={styles.statSub}>{Number.isFinite(min) && Number.isFinite(max) ? `min ${min} • max ${max} • ${deltaStr}` : deltaStr}</Text>
        </View>
        {badge?.reason ? <Text style={styles.badgeReason}>{badge.reason}</Text> : null}

        <Text style={styles.caption}>{chart.label}</Text>

        <View style={styles.chart}>
          <Line
            areaChart
            curved
            data={mainSafe.data}
            maxValue={mainSafe.maxValue}
            minValue={mainSafe.mostNegativeValue}
            mostNegativeValue={mainSafe.mostNegativeValue}
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
            showDataPoints
            focusEnabled
            pointerConfig={{
              pointerStripUptoDataPoint: true,
              pointerStripColor: '#f59e0b66',
              pointerStripWidth: 2,
              radius: 4,
              pointerColor: '#f59e0b',
              showPointerStrip: true,
              pointerLabelWidth: 120,
              pointerLabelHeight: 52,
              pointerLabelComponent: (items: any[]) => {
                const it = items?.[0];
                return (
                  <View style={styles.tooltip}>
                    <Text style={styles.tooltipValue}>{safeBpm(it?.value)}</Text>
                    <Text style={styles.tooltipWhen} numberOfLines={1}>{safeLabel(it?.label)}</Text>
                  </View>
                );
              },
            }}
          />
          {chart.base && baseSafe.data.length >= 2 && (
            <View style={StyleSheet.absoluteFill}>
              <Line data={baseSafe.data} thickness={2} color="#ffffffcc" hideDataPoints />
            </View>
          )}
        </View>

        <View style={styles.seg}>
          {(['1D','3D','7D','30D','90D'] as const).map(k => (
            <Pressable key={k} onPress={() => setRange(k)} style={[styles.segBtn, range === k && styles.segBtnActive]}>
              <Text style={[styles.segText, range === k && styles.segTextActive]}>{k}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0b0b0b' },
  container: { padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  h1: { color: '#fff', fontSize: 22, fontWeight: '700' },
  refresh: { backgroundColor: '#171717', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10 },
  refreshText: { color: '#60a5fa', fontWeight: '700' },
  statRow: { marginTop: 10 },
  statBig: { color: '#fff', fontSize: 28, fontWeight: '800' },
  statSub: { color: '#cfcfcf', marginTop: 4 },
  badgeReason: { color: '#9ca3af', marginTop: 6 },
  caption: { color: '#9ca3af', marginTop: 10, marginBottom: 6 },
  chart: { height: 280, borderRadius: 12, overflow: 'hidden' },
  seg: { flexDirection: 'row', backgroundColor: '#171717', padding: 4, borderRadius: 12, marginTop: 12 },
  segBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  segBtnActive: { backgroundColor: '#f59e0b22' },
  segText: { color: '#cfcfcf' },
  segTextActive: { color: '#f59e0b', fontWeight: '700' },
  tooltip: { backgroundColor: '#1f2937', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 8, borderWidth: 1, borderColor: '#334155' },
  tooltipValue: { color: '#fff', fontWeight: '700' },
  tooltipWhen: { color: '#cfcfcf', fontSize: 12, marginTop: 2 },
});
