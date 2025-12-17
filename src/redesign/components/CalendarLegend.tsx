import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CalendarLegendProps {
  showNoBookings?: boolean;
}

export const CalendarLegend: React.FC<CalendarLegendProps> = ({
  showNoBookings = false
}) => {
  return (
    <View style={styles.container}>
      {/* No bookings - only shown in weekly view */}
      {showNoBookings && (
        <View style={styles.item}>
          <View style={[styles.dot, styles.noBookingsDot]} />
          <Text style={styles.label}>No bookings</Text>
        </View>
      )}

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
  noBookingsDot: {
    backgroundColor: '#D3D3D3',
  },
  label: {
    color: '#8A8A8A',
    fontSize: 11,
    fontWeight: '500',
  },
});
