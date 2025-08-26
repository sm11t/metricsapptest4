// src/features/hrv/HRVSquare.tsx
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

type HRVPoint = { ts: string; ms: number };

type Props = {
  onPress: () => void;
  size: number;
  value?: number | null;         // current HRV (ms)
  history?: HRVPoint[] | null;   // 7–30d history
};

const Line: any = LineChart;

export default function HRVSquare({
  onPress,
  size,
  value = 0,
  history = [],
}: Props) {
  const safeHistory = Array.isArray(history) ? history : [];
  const vals = safeHistory.map(h => Number(h.ms)).filter(v => Number.isFinite(v));
  const current = Number.isFinite(value as number) ? (value as number) : (vals.at(-1) ?? 0);

  const data = useMemo(() => safeHistory.map(h => ({ value: h.ms })), [safeHistory]);

  const avg7d = useMemo(() => {
    if (!vals.length) return Math.round(current || 0);
    const sum = vals.reduce((s, x) => s + x, 0);
    return Math.round(sum / vals.length);
  }, [vals, current]);

  const { yMin, yMax, mostNegativeValue } = useMemo(() => {
    if (!vals.length && !Number.isFinite(current)) {
      return { yMin: 0, yMax: 1, mostNegativeValue: 0 };
    }
    const lo = Math.min(...(vals.length ? vals : [current, current])) - 5;
    const hi = Math.max(...(vals.length ? vals : [current, current])) + 5;
    const min = Math.max(0, Number.isFinite(lo) ? lo : 0);
    const max = Number.isFinite(hi) ? hi : Math.max(1, current + 5);
    return { yMin: min, yMax: max, mostNegativeValue: min };
  }, [vals, current]);

  return (
    <Pressable style={[styles.square, { width: size, height: size }]} onPress={onPress}>
      <View style={styles.squareTop}>
        <Text style={styles.squareTitle}>HRV</Text>
      </View>

      <View style={styles.centerRow}>
        <Text style={styles.big}>{Number.isFinite(current) ? Math.round(current) : '—'}</Text>
        <Text style={styles.unit}>ms</Text>
      </View>

      <Text style={styles.sub} numberOfLines={1}>7d avg {avg7d} ms</Text>

      <View style={styles.chart}>
        <Line
          areaChart
          curved
          data={data}
          maxValue={yMax}
          minValue={yMin}
          mostNegativeValue={mostNegativeValue}
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
