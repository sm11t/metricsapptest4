import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const CalendarLegend: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Booked */}
      <View style={styles.item}>
        <View style={[styles.dot, styles.bookedDot]} />
        <Text style={styles.label}>Booked</Text>
      </View>

      {/* Completed */}
      <View style={styles.item}>
        <View style={[styles.dot, styles.completedDot]} />
        <Text style={styles.label}>Completed</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  bookedDot: {
    backgroundColor: '#B8E6D5',
  },
  completedDot: {
    backgroundColor: '#04A777',
  },
  label: {
    color: '#8A8A8A',
    fontSize: 11,
    fontWeight: '500',
  },
});
