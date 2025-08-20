import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

export default function SpO2Detail({
  route,
}: {
  route?: { params?: { latest?: number; dayAvg?: number; lastSyncAt?: string | null } };
}) {
  const latest = route?.params?.latest;
  const dayAvg = route?.params?.dayAvg;
  const lastSyncAt = route?.params?.lastSyncAt;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Blood Oxygen</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Latest</Text>
        <Text style={styles.val}>{Number.isFinite(latest as number) ? `${latest?.toFixed(1)} %` : '—'}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Today avg</Text>
        <Text style={styles.val}>{Number.isFinite(dayAvg as number) ? `${dayAvg?.toFixed(1)} %` : '—'}</Text>
      </View>

      <Text style={styles.meta}>
        {lastSyncAt ? `Updated ${new Date(lastSyncAt).toLocaleString()}` : '—'}
      </Text>
      <Text style={styles.note}>Pulled from Apple Health → Oxygen Saturation.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  h1: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  label: { color: '#9ca3af', fontSize: 16 },
  val: { color: '#fff', fontSize: 16, fontWeight: '600' },
  meta: { color: '#9ca3af', marginTop: 12 },
  note: { color: '#9ca3af', marginTop: 4, fontSize: 12, opacity: 0.7 },
});
