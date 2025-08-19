// src/features/sleep/SleepWide.tsx
import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';

type Props = {
  title?: string;
  subtitle?: string;
  score?: number | string;
  width?: number;
  height?: number;
  onPress?: () => void;
  children?: React.ReactNode;
};

export default function SleepWide({
  title = 'Sleep',
  subtitle = 'Last night',
  score,
  width,
  height,
  onPress,
  children,
}: Props) {
  const Container = onPress ? Pressable : View;

  // If someone does <SleepWide>Some text</SleepWide>, wrap it in <Text>
  const safeChildren =
    typeof children === 'string' || typeof children === 'number'
      ? <Text style={styles.body}>{children}</Text>
      : children;

  return (
    <Container
      style={[styles.card, width && { width }, height && { height }]}
      onPress={onPress}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {score !== undefined && (
        <Text style={styles.scoreLine}>
          <Text style={styles.scoreBig}>{String(score)}</Text>
          <Text style={styles.scoreUnit}> / 100</Text>
        </Text>
      )}

      {/* Simple right-side placeholder bar to balance the layout */}
      <View style={styles.placeholderWrap}>
        <View style={styles.placeholderBar} />
      </View>

      {safeChildren}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#121212',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 16,
    overflow: 'hidden',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: '#9ca3af', fontSize: 12, fontWeight: '600' },
  subtitle: { color: '#cfcfcf', marginTop: 6, fontSize: 28, fontWeight: '800' },

  scoreLine: { color: '#cfcfcf', marginTop: 8 },
  scoreBig: { color: '#fff', fontWeight: '800', fontSize: 20 },
  scoreUnit: { color: '#9ca3af', fontSize: 14 },

  body: { color: '#cfcfcf', marginTop: 8, fontSize: 16 },

  placeholderWrap: {
    position: 'absolute',
    right: 16,
    top: 16,
    bottom: 16,
    width: 140,
    justifyContent: 'flex-end',
  },
  placeholderBar: {
    height: '70%',
    borderRadius: 12,
    backgroundColor: '#22c55e33', // subtle green fill
    borderWidth: 1,
    borderColor: '#22c55e22',
  },
});
