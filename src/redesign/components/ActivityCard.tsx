import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { MonthNavigation } from './MonthNavigation';
import { CalendarGrid } from './CalendarGrid';
import { CalendarLegend } from './CalendarLegend';
import { CalendarStats } from './CalendarStats';
import { ConnectWearableCard } from './ConnectWearableCard';
import { ViewToggle } from './ViewToggle';
import { WeeklyView } from './WeeklyView';
import { WeeklyStats } from './WeeklyStats';
import { HealthTrend } from './HealthTrend';
import { scale } from '../utils/scaling';

type ViewMode = 'week' | 'month';

interface ActivityCardProps {
  isDeviceConnected?: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ isDeviceConnected = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');

  const handleDayPress = (date: Date) => {
    console.log('Selected date:', date);
  };

  const handleDownloadPress = () => {
    console.log('Download MyYogaTeacher App pressed');
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setDate(currentDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() + 1);
    } else {
      newDate.setDate(currentDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  return (
    <View style={styles.container}>
      {/* Month/Year and View Toggle */}
      <View style={styles.header}>
        <MonthNavigation
          currentDate={currentDate}
          onPreviousPress={handlePreviousMonth}
          onNextPress={handleNextMonth}
          viewMode={viewMode}
        />
        <ViewToggle
          selectedView={viewMode}
          onViewChange={setViewMode}
        />
      </View>

      {/* Calendar Grid (monthly) or Weekly View */}
      {viewMode === 'month' ? (
        <View style={styles.calendarWrapper}>
          <CalendarGrid
            currentDate={currentDate}
            onDayPress={handleDayPress}
          />
        </View>
      ) : (
        <View style={styles.weeklyWrapper}>
          <WeeklyView currentDate={currentDate} />
        </View>
      )}

      {/* Legend */}
      <CalendarLegend showNoBookings={viewMode === 'week'} />

      {/* Stats */}
      {viewMode === 'month' ? (
        <View style={styles.weeklyStatsWrapper}>
          <CalendarStats
            bookedHours={6}
            completedHours={4}
            upcomingHours={2}
          />
        </View>
      ) : (
        <View style={styles.weeklyStatsWrapper}>
          <WeeklyStats
            bookedHours={6}
            completedHours={4}
            upcomingHours={2}
          />
        </View>
      )}

      {/* Connect Wearable or Health Trend */}
      <View style={[styles.wearableWrapper, isDeviceConnected && styles.healthTrendWrapper]}>
        {isDeviceConnected ? (
          <HealthTrend />
        ) : (
          <ConnectWearableCard onDownloadPress={handleDownloadPress} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(325),
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: '#F2F2F2',
    padding: scale(8),
    shadowColor: 'rgba(188, 188, 188, 0.12)',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 1,
    shadowRadius: scale(4),
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarWrapper: {
    marginTop: scale(12),
  },
  weeklyWrapper: {
    marginTop: scale(12),
  },
  weeklyStatsWrapper: {
    marginTop: scale(12),
    marginLeft: scale(-8),
    marginRight: scale(-8),
    alignItems: 'center',
  },
  wearableWrapper: {
    marginTop: scale(16),
    alignItems: 'center',
  },
  healthTrendWrapper: {
    marginTop: 0,
    marginLeft: scale(-8),
    marginRight: scale(-8),
    marginBottom: scale(-8),
    alignItems: 'stretch',
  },
});
