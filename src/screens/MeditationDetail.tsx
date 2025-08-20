// src/screens/MeditationDetail.tsx
import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

type Props = {
  route?: { params?: { history?: { date: string; minutes: number }[] } };
};

export default function MeditationDetail({ route }: Props) {
  const history = route?.params?.history ?? [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Mindfulness (Last 7 days)</Text>
      <View style={styles.tableHeader}>
        <Text style={[styles.cell, styles.bold]}>Date</Text>
        <Text style={[styles.cell, styles.bold, { textAlign: 'right' }]}>Minutes</Text>
      </View>
      {history.map((d, i) => (
        <View key={String(i)} style={styles.row}>
          <Text style={styles.cell}>
            {new Date(d.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </Text>
          <Text style={[styles.cell, { textAlign: 'right' }]}>{d.minutes}</Text>
        </View>
      ))}

      <Text style={styles.note}>
        This is mock data. When you’re ready, replace it by reading HealthKit’s
        <Text style={styles.mono}> mindfulSession</Text> samples.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#e5e7eb22', paddingBottom: 6 },
  row: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#e5e7eb11' },
  cell: { flex: 1, fontSize: 16, color: '#e5e7eb' },
  bold: { fontWeight: '700' },
  note: { marginTop: 16, fontSize: 12, opacity: 0.7 },
  mono: { fontFamily: 'Menlo', fontSize: 12 },
});
