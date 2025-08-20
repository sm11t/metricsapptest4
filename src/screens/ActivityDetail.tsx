// src/screens/ActivityDetail.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

type Props = {
  route?: { params?: { steps?: number; kcal?: number; lastSyncAt?: number } };
};

export default function ActivityDetail({ route }: Props) {
  const steps = route?.params?.steps ?? undefined;
  const kcal = route?.params?.kcal ?? undefined;
  const sync = route?.params?.lastSyncAt
    ? new Date(route?.params?.lastSyncAt).toLocaleString()
    : '—';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Activity</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Steps (today)</Text>
        <Text style={styles.value}>{steps ?? '—'}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Active Energy (kcal)</Text>
        <Text style={styles.value}>{kcal ?? '—'}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Last sync</Text>
        <Text style={styles.value}>{sync}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  h1: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 12 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1f2937',
  },
  label: { color: '#9ca3af', fontSize: 16 },
  value: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
