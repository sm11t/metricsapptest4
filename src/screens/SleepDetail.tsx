import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

type Props = {
  route?: { params?: { durationMins?: number; bedtime?: string; wakeTime?: string } };
};

export default function SleepDetail({ route }: Props) {
  const durationMins = route?.params?.durationMins ?? undefined;
  const bedtime = route?.params?.bedtime ?? undefined;
  const wakeTime = route?.params?.wakeTime ?? undefined;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Sleep Detail</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Duration</Text>
        <Text style={styles.value}>
          {durationMins !== undefined ? `${durationMins} min` : '—'}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Bedtime</Text>
        <Text style={styles.value}>{bedtime ?? '—'}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Wake time</Text>
        <Text style={styles.value}>{wakeTime ?? '—'}</Text>
      </View>

      <Text style={styles.note}>
        Note: Any strings or numbers must be inside {'<Text>'} elements.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  label: { fontSize: 16, opacity: 0.7 },
  value: { fontSize: 16, fontWeight: '500' },
  note: { marginTop: 16, fontSize: 12, opacity: 0.6 },
});
