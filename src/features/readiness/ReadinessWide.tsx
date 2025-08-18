import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import useReadiness from './useReadiness';
import { makeChartSafe } from '../../ui/chartSafe';
import { BadgeChip } from '../../ui/BadgeChip';

const Line: any = LineChart;

type Props = { width: number; height: number; onPress: () => void };

export default function ReadinessWide({ width, height, onPress }: Props) {
  const { score, badge, drivers, reason, spark, loading } = useReadiness();

  const top3 = useMemo(
    () => drivers.slice().sort((a, b) => Math.abs(b.points) - Math.abs(a.points)).slice(0, 3),
    [drivers]
  );

  const sparkSafe = useMemo(() => makeChartSafe(spark, 50), [spark]);

  return (
    <Pressable style={[styles.card, { width, height }]} onPress={onPress} disabled={loading}>
      <View style={styles.row}>
        <Text style={styles.title}>Readiness</Text>
        <BadgeChip label={badge} />
      </View>

      <View style={styles.mainRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.score}>{Math.round(score)}</Text>
          <Text style={styles.sub}>/100</Text>
          {!!reason && (
            <Text style={styles.reason} numberOfLines={1}>
              Biggest driver: {reason}
            </Text>
          )}

          <View style={styles.chipsRow}>
            {top3.map(p => (
              <View key={p.driver} style={styles.chip}>
                <Text style={styles.chipText}>
                  {labelFor(p.driver)} {signed(Math.round(p.points))}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* IMPORTANT: stop the chart from overflowing & intercepting touches */}
        <View style={styles.sparkWrap} pointerEvents="none">
          <Line
            data={sparkSafe.data}
            maxValue={sparkSafe.maxValue}
            minValue={sparkSafe.mostNegativeValue}
            mostNegativeValue={sparkSafe.mostNegativeValue}
            areaChart
            curved
            thickness={3}
            startFillColor="#22c55e33"
            endFillColor="#22c55e06"
            color="#22c55e"
            startOpacity={1}
            endOpacity={0}
            yAxisLabelWidth={0}
            xAxisThickness={0}
            yAxisThickness={0}
            noOfSections={3}
            rulesType="dashed"
            rulesColor="#ffffff16"
            showDataPoints={false}   // hide black dots
          />
        </View>
      </View>
    </Pressable>
  );
}

function labelFor(k: string) {
  switch (k) {
    case 'hrv':
      return 'HRV';
    case 'rhr':
      return 'RHR';
    case 'sleepDur':
      return 'Sleep';
    case 'sleepEff':
      return 'Eff';
    case 'resp':
      return 'Resp';
    case 'strain':
      return 'Strain';
    default:
      return k;
  }
}
const signed = (n: number) => (n > 0 ? `+${n}` : `${n}`);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#121212',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 12,
    overflow: 'hidden',      // <-- clip SVG gradient to the card
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#9ca3af', fontSize: 12, fontWeight: '600' },
  mainRow: { flexDirection: 'row', marginTop: 6, gap: 12, alignItems: 'center' },
  score: { color: '#fff', fontSize: 40, fontWeight: '900', lineHeight: 44 },
  sub: { color: '#cfcfcf', marginTop: -2 },
  reason: { color: '#9ca3af', marginTop: 6, maxWidth: 220 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  chip: { backgroundColor: '#1a1a1a', borderColor: '#334155', borderWidth: 1, borderRadius: 999, paddingVertical: 4, paddingHorizontal: 8 },
  chipText: { color: '#cfcfcf', fontSize: 11, fontWeight: '600' },
  sparkWrap: {
    width: 140,
    height: 90,
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    overflow: 'hidden',      // extra safety around SVG overflow
    borderRadius: 12,
  },
});
