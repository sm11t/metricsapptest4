import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { PeriodToggle } from '../components/PeriodToggle';
import { WeeklyView } from '../components/WeeklyView';
import { CalendarStats } from '../components/CalendarStats';
import { CalendarLegend } from '../components/CalendarLegend';
import { GoalProgress } from '../components/GoalProgress';
import { ActivityOverview } from '../components/ActivityOverview';
import { ConnectWearableCard } from '../components/ConnectWearableCard';
import { HealthTrend } from '../components/HealthTrend';

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

type ActivityDetailsScreenProps = {
  isDeviceConnected?: boolean;
  onBack?: () => void;
};

const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18L9 12L15 6"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ActivityDetailsScreen: React.FC<ActivityDetailsScreenProps> = ({
  isDeviceConnected = false,
  onBack,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('weekly');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <BackIcon />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>My Activity</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Period Toggle */}
        <View style={styles.toggleContainer}>
          <PeriodToggle
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        </View>

        {/* Card Container */}
        <View style={styles.cardContainer}>
          {/* Date Header */}
          <Text style={styles.dateHeader}>9 September</Text>

          {/* Weekly View */}
          <View style={styles.weeklyViewWrapper}>
            <WeeklyView currentDate={new Date()} />
          </View>

          {/* Calendar Legend */}
          <CalendarLegend showNoBookings={true} />

          {/* Calendar Stats */}
          <View style={styles.statsWrapper}>
            <CalendarStats
              bookedHours={6}
              completedHours={4}
              upcomingHours={2}
            />
          </View>

          {/* Goal Progress */}
          <View style={styles.goalWrapper}>
            <GoalProgress
              goalSessions={4}
              completedSessions={5}
              status="Exceeded"
              message="Outstanding! You're crushing it this week - keep the streak alive 🏆"
            />
          </View>

          {/* Activity Overview */}
          <View style={styles.overviewWrapper}>
            <ActivityOverview
              oneOnOne={1}
              group={1}
              finished={2}
              noShow={1}
            />
          </View>

          {/* Wearable Card or Health Trend */}
          <View style={styles.wearableWrapper}>
            {!isDeviceConnected ? (
              <ConnectWearableCard />
            ) : (
              <HealthTrend />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  headerSpacer: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 24,
    paddingBottom: 24,
  },
  toggleContainer: {
    alignItems: 'center',
    marginBottom: 21,
  },
  cardContainer: {
    width: 370,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    padding: 8,
    shadowColor: 'rgba(188, 188, 188, 0.12)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    gap: 10,
  },
  dateHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginTop: 8,
  },
  weeklyViewWrapper: {
    marginLeft: -8,
    marginRight: -8,
  },
  statsWrapper: {
    alignItems: 'center',
  },
  goalWrapper: {
    alignItems: 'center',
  },
  overviewWrapper: {
    alignItems: 'center',
  },
  wearableWrapper: {
    alignItems: 'center',
    marginBottom: -8,
    marginLeft: -8,
    marginRight: -8,
  },
});
