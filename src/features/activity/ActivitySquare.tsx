// src/features/activity/ActivitySquare.tsx
import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { BadgeChip } from '../../ui/BadgeChip';

type Props = {
  onPress: () => void;
  size: number; // square side in px (use your existing CARD)
  steps: number;
  kcal: number;
  loading?: boolean;
  badge?: { badge: 'RECOVER' | 'MAINTAIN' | 'TRAIN'; reason: string };
  lastSyncAt?: number;
};

export default function ActivitySquare({
  onPress,
  size,
  steps,
  kcal,
  loading,
  badge,
  lastSyncAt,
}: Props) {
  const status = loading
    ? 'Updating…'
    : lastSyncAt
    ? new Date(lastSyncAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '—';

  return (
    <Pressable style={[styles.card, { width: size, height: size }]} onPress={onPress}>
      <View style={styles.top}>
        <Text style={styles.title}>Activity</Text>
        {badge && <BadgeChip label={badge.badge} />}
      </View>

      <View style={styles.row}>
        <Text style={styles.big}>{steps || '—'}</Text>
        <Text style={styles.unit}>steps</Text>
      </View>

      <Text style={styles.sub} numberOfLines={1}>
        {kcal || '—'} kcal
      </Text>

      <Text style={styles.sync} numberOfLines={1}>
        {status}
      </Text>
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
  row: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 6 },
  big: { color: '#fff', fontSize: 28, fontWeight: '800', marginRight: 6 },
  unit: { color: '#cfcfcf', marginBottom: 4 },
  sub: { color: '#9ca3af', fontSize: 12, marginTop: 4 },
  sync: { color: '#6b7280', fontSize: 10, position: 'absolute', bottom: 10, right: 12 },
});
