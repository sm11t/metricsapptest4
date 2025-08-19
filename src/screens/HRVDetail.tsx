import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { makeChartSafe } from '../ui/chartSafe';
import { useHRV } from '../features/hrv/useHRV';

const Line: any = LineChart;

export default function HRVDetail() {
  const { daily, baseline, today, todayDelta, badge, loading, refresh } = useHRV(365);
  const [range, setRange] = useState<'7D'|'30D'|'90D'>('30D');

  const chart = useMemo(() => {
    const days = range === '7D' ? 7 : range === '30D' ? 30 : 90;
    const main = daily.slice(-days).map(d => ({ value: d.hrv ?? NaN, label: d.date })).filter(d => Number.isFinite(d.value));
    const base = baseline.slice(-days).map(b => ({ value: b.baseline ?? NaN, label: b.date })).filter(b => Number.isFinite(b.value));
    return { label: `${range} · daily HRV vs baseline`, main, base };
  }, [daily, baseline, range]);

  const mainSafe = useMemo(() => makeChartSafe(chart.main, 60), [chart.main]);
  const baseSafe = useMemo(() => makeChartSafe(chart.base ?? [], 60), [chart.base]);

  const val = Math.round(today?.hrv ?? NaN);
  const deltaStr = todayDelta !== undefined ? `${todayDelta>0?'+':''}${todayDelta!.toFixed(1)}% vs baseline` : '—';

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.h1}>HRV (SDNN)</Text>
          <Pressable style={styles.refresh} onPress={() => refresh(365)} disabled={loading}>
            <Text style={[styles.refreshText, loading && { opacity: 0.6 }]}>{loading ? 'Refreshing…' : 'Refresh'}</Text>
          </Pressable>
        </View>

        <Text style={styles.statBig}>{Number.isFinite(val) ? `${val} ms` : '—'}</Text>
        <Text style={styles.statSub}>{deltaStr}</Text>
        {badge?.reason ? <Text style={styles.badgeReason}>{badge.reason}</Text> : null}

        <Text style={styles.caption}>{chart.label}</Text>

        <View style={styles.chart}>
          <Line
            areaChart curved
            data={mainSafe.data}
            maxValue={mainSafe.maxValue}
            minValue={mainSafe.mostNegativeValue}
            mostNegativeValue={mainSafe.mostNegativeValue}
            thickness={2}
            startFillColor="#38bdf833"
            endFillColor="#38bdf806"
            color="#38bdf8"
            startOpacity={1}
            endOpacity={0}
            yAxisLabelWidth={0}
            xAxisThickness={0}
            yAxisThickness={0}
            noOfSections={5}
            rulesType="dashed"
            rulesColor="#ffffff22"
            showDataPoints
          />
          {chart.base && baseSafe.data.length >= 2 && (
            <View style={StyleSheet.absoluteFill}>
              <Line data={baseSafe.data} thickness={2} color="#ffffffcc" hideDataPoints />
            </View>
          )}
        </View>

        <View style={styles.seg}>
          {(['7D','30D','90D'] as const).map(k => (
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
  statBig: { color: '#fff', fontSize: 28, fontWeight: '800', marginTop: 10 },
  statSub: { color: '#cfcfcf', marginTop: 4 },
  badgeReason: { color: '#9ca3af', marginTop: 6 },
  caption: { color: '#9ca3af', marginTop: 10, marginBottom: 6 },
  chart: { height: 280, borderRadius: 12, overflow: 'hidden' },
  seg: { flexDirection: 'row', backgroundColor: '#171717', padding: 4, borderRadius: 12, marginTop: 12 },
  segBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  segBtnActive: { backgroundColor: '#38bdf822' },
  segText: { color: '#cfcfcf' },
  segTextActive: { color: '#38bdf8', fontWeight: '700' },
});
