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

type ViewMode = 'week' | 'month';

interface ActivityCardProps {
  isDeviceConnected?: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ isDeviceConnected = false }) => {
  const [currentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');

  const handleDayPress = (date: Date) => {
    console.log('Selected date:', date);
  };

  const handleDownloadPress = () => {
    console.log('Download MyYogaTeacher App pressed');
  };

  return (
    <View style={styles.container}>
      {/* Month/Year and View Toggle */}
      <View style={styles.header}>
        <MonthNavigation currentDate={currentDate} />
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
    width: 370,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    padding: 8,
    // Shadow: 0 2px 4px 0 rgba(188, 188, 188, 0.12)
    shadowColor: 'rgba(188, 188, 188, 0.12)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarWrapper: {
    marginTop: 12,
  },
  weeklyWrapper: {
    marginTop: 12,
  },
  weeklyStatsWrapper: {
    marginTop: 12,
    alignItems: 'center',
  },
  wearableWrapper: {
    marginTop: 16,
    alignItems: 'center',
  },
  healthTrendWrapper: {
    marginTop: 0,
    marginLeft: -8,
    marginRight: -8,
    marginBottom: -8,
    alignItems: 'stretch',
  },
});
