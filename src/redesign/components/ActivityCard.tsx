import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { MonthNavigation } from './MonthNavigation';
import { CalendarGrid } from './CalendarGrid';
import { CalendarLegend } from './CalendarLegend';
import { CalendarStats } from './CalendarStats';
import { ConnectWearableCard } from './ConnectWearableCard';

export const ActivityCard: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const handleDayPress = (date: Date) => {
    console.log('Selected date:', date);
  };

  const handleDownloadPress = () => {
    console.log('Download MyYogaTeacher App pressed');
  };

  return (
    <View style={styles.container}>
      {/* Month Navigation */}
      <MonthNavigation
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />

      {/* Calendar Grid */}
      <View style={styles.calendarWrapper}>
        <CalendarGrid
          currentDate={currentDate}
          onDayPress={handleDayPress}
        />
      </View>

      {/* Legend */}
      <CalendarLegend />

      {/* Stats */}
      <CalendarStats
        bookedHours={6}
        completedHours={4}
        upcomingHours={2}
      />

      {/* Connect Wearable */}
      <View style={styles.wearableWrapper}>
        <ConnectWearableCard onDownloadPress={handleDownloadPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    padding: 8,
    // Shadow
    shadowColor: 'rgba(188, 188, 188, 0.12)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  calendarWrapper: {
    marginTop: 12,
  },
  wearableWrapper: {
    marginTop: 16,
    alignItems: 'center',
  },
});
