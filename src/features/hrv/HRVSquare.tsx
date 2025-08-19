import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { makeChartSafe } from '../../ui/chartSafe';
import { useHRV } from './useHRV';
import { BadgeChip } from '../../ui/BadgeChip';

const Line: any = LineChart;

export default function HRVSquare({ onPress, size }: { onPress: () => void; size: number }) {
  const { spark, today, todayDelta, badge, loading, refresh } = useHRV(365);
  const points = useMemo(() => spark.map(v => ({ value: v })), [spark]);
  const safe = useMemo(() => makeChartSafe(points, 60), [points]);

  const val = Math.round(today?.hrv ?? NaN);
  const deltaStr = todayDelta !== undefined ? `${todayDelta>0?'+':''}${todayDelta.toFixed(1)}%` : '—';

  return (
    <Pressable style={[styles.square, { width: size, height: size }]} onPress={onPress} disabled={loading}>
      <View style={styles.squareTop}>
        <Text style={styles.squareTitle}>HRV</Text>
        {badge && <BadgeChip label={badge.badge} />}
      </View>

      <View style={styles.centerRow}>
        <Text style={styles.big}>{Number.isFinite(val) ? val : '—'}</Text>
        <Text style={styles.unit}>ms</Text>
      </View>

      <Text style={styles.sub} numberOfLines={1}>{deltaStr} vs baseline</Text>

      <View style={styles.chart}>
        <Line
          areaChart
          curved
          data={safe.data}
          maxValue={safe.maxValue}
          minValue={safe.mostNegativeValue}
          mostNegativeValue={safe.mostNegativeValue}
          thickness={2}
          startFillColor="#38bdf833"
          endFillColor="#38bdf806"
          color="#38bdf8"
          startOpacity={1}
          endOpacity={0}
          yAxisLabelWidth={0}
          xAxisThickness={0}
          yAxisThickness={0}
          noOfSections={3}
          rulesType="dashed"
          rulesColor="#ffffff16"
          showDataPoints={false}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  square: {
    backgroundColor: '#121212',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 12,
    overflow: 'hidden',
  },
  squareTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  squareTitle: { color: '#9ca3af', fontSize: 12, fontWeight: '600' },
  centerRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 6 },
  big: { color: '#fff', fontSize: 28, fontWeight: '800', marginRight: 6 },
  unit: { color: '#cfcfcf', marginBottom: 4 },
  sub: { color: '#9ca3af', fontSize: 12, marginTop: 4 },
  chart: { position: 'absolute', bottom: 10, left: 10, right: 10, height: 100 },
});
