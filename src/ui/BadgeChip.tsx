import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export type BadgeLabel = 'RECOVER' | 'MAINTAIN' | 'TRAIN';

export function BadgeChip({ label }: { label: BadgeLabel }) {
  const color = label === 'RECOVER' ? '#ef4444' : label === 'TRAIN' ? '#22c55e' : '#f59e0b';
  return (
    <View style={[styles.badge, { borderColor: color, backgroundColor: color + '22' }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 999, borderWidth: 1 },
  badgeText: { fontWeight: '700', fontSize: 10, letterSpacing: 0.4 },
});
