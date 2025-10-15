import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type CalendarStatsProps = {
  bookedHours: number;
  completedHours: number;
  upcomingHours: number;
};

export const CalendarStats: React.FC<CalendarStatsProps> = ({
  bookedHours,
  completedHours,
  upcomingHours,
}) => {
  return (
    <View style={styles.container}>
      {/* Icon */}
      <Text style={styles.icon}>📊</Text>

      {/* Stats Text */}
      <Text style={styles.text}>
        This month you've booked{' '}
        <Text style={styles.bold}>{bookedHours} Hrs</Text>, completed{' '}
        <Text style={styles.bold}>{completedHours} Hrs</Text> and have another{' '}
        <Text style={styles.bold}>{upcomingHours} Hrs</Text> upcoming.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 16,
  },
  icon: {
    fontSize: 16,
    marginTop: 2,
  },
  text: {
    flex: 1,
    color: '#8A8A8A',
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16,
  },
  bold: {
    color: '#000000',
    fontWeight: '700',
  },
});
