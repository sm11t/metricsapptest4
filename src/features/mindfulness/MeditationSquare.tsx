// src/features/mindfulness/MeditationSquare.tsx
import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';

export default function MeditationSquare({
  onPress,
  size,
  minutes,
  loading,
  lastSyncAt,
}: {
  onPress: () => void;
  size: number;
  minutes: number;
  loading?: boolean;
  lastSyncAt?: string;
}) {
  const status = loading
    ? 'Updating…'
    : lastSyncAt
    ? `Updated ${new Date(lastSyncAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : '—';

  return (
    <Pressable style={[styles.square, { width: size, height: size }]} onPress={onPress}>
      <View style={styles.top}>
        <Text style={styles.title}>Mindfulness</Text>
      </View>

      <View style={styles.center}>
        <Text numberOfLines={1} style={styles.big}>{minutes}</Text>
        <Text style={styles.unit}>min</Text>
      </View>

      <Text style={styles.sub} numberOfLines={1}>today</Text>
      <Text style={styles.footer} numberOfLines={1}>{status}</Text>
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
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#9ca3af', fontSize: 12, fontWeight: '600' },
  center: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 6 },
  big: { color: '#fff', fontSize: 28, fontWeight: '800', marginRight: 6 },
  unit: { color: '#cfcfcf', marginBottom: 4 },
  sub: { color: '#9ca3af', fontSize: 12, marginTop: 4 },
  footer: { color: '#6b7280', fontSize: 10, marginTop: 2 },
});
