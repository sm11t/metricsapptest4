import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import styles from '../styles';
import { BadgeChip } from '../ui/BadgeChip';
import { resampleLinear } from '../ui/chartSafe';

const Line: any = LineChart;

type HRPoint = { value: number; dataPointColor?: string; dataPointRadius?: number };

const toMs = (iso: string) => new Date(iso).getTime();
const mean = (a: number[]) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : NaN);

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
  const endLabel = new Date(end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return { startLabel, endLabel, data, yMin: Math.max(0, lo), yMax: hi };
}

export default function HeartRateSquare({
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
