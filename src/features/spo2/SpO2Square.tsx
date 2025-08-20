import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';

export default function SpO2Square({
  size,
  onPress,
  value,           // % (e.g., 97.2)
  lastSyncAt,      // ISO string or null
  loading,
}: {
  size: number;
  onPress: () => void;
  value?: number | null;
  lastSyncAt?: string | null;
  loading?: boolean;
}) {
  const main = Number.isFinite(value as number) ? (value as number).toFixed(1) : '—';
  const sub =
    loading
      ? 'Syncing…'
      : lastSyncAt
      ? `Updated ${new Date(lastSyncAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      : '—';

  return (
    <Pressable style={[styles.card, { width: size, height: size }]} onPress={onPress}>
      <View style={styles.top}>
        <Text style={styles.title}>SpO₂</Text>
      </View>

      <View style={styles.center}>
        <Text style={styles.big}>{main}</Text>
        <Text style={styles.unit}>%</Text>
      </View>

      <Text style={styles.sub} numberOfLines={1}>{sub}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#121212',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 12,
    overflow: 'hidden',
  },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#9ca3af', fontSize: 12, fontWeight: '600' },
  center: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 6 },
  big: { color: '#fff', fontSize: 28, fontWeight: '800', marginRight: 6 },
  unit: { color: '#cfcfcf', marginBottom: 4 },
  sub: { color: '#9ca3af', fontSize: 12, marginTop: 4 },
});
