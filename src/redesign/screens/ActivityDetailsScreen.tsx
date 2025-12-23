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
import { WeeklyGoalSetter } from '../components/WeeklyGoalSetter';
import { WeeklyGoalStatus } from '../components/WeeklyGoalStatus';
import { SessionDetailsCard } from '../components/SessionDetailsCard';
import { SmallHealthMetricBox } from '../components/SmallHealthMetricBox';
import { WeekNavigation } from '../components/WeekNavigation';
import { SessionEngagementCard } from '../components/SessionEngagementCard';
import { HealthMetricBox } from '../components/HealthMetricBox';
import { scale } from '../utils/scaling';

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
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('daily');

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
  };

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
          {selectedPeriod === 'daily' && (
            <>
              {/* Date Header */}
              <Text style={styles.dateHeader}>{getCurrentDate()}</Text>

              {/* Weekly View */}
              <View style={styles.weeklyViewWrapper}>
                <WeeklyView currentDate={new Date()} />
              </View>

              {/* Calendar Legend */}
              <CalendarLegend showNoBookings={true} />

              {/* Calendar Stats - 22px below legend */}
              <View style={styles.dailyStatsWrapper}>
                <CalendarStats
                  bookedHours={6}
                  completedHours={4}
                  upcomingHours={2}
                />
              </View>

              {/* This Week's Goal Title */}
              <Text style={styles.goalTitle}>This Week's Goal</Text>

              {/* Weekly Goal Status */}
              <View style={styles.weeklyGoalStatusWrapper}>
                <WeeklyGoalStatus
                  completedSessions={4}
                  goalSessions={4}
                  status="Met"
                  message="Goal achieved! Keep the momentum going - book your next session to stay consistent 🔥"
                />
              </View>

              {/* Activity Overview Title */}
              <Text style={styles.activityOverviewTitle}>Activity Overview</Text>

              {/* Session Details Card */}
              <View style={styles.sessionDetailsWrapper}>
                <SessionDetailsCard />
              </View>

              {/* Health Trends or Connect Wearable */}
              {isDeviceConnected ? (
                <>
                  {/* Health Trends Title */}
                  <Text style={styles.healthTrendsTitle}>Health Trends</Text>

                  {/* Last Sync Text */}
                  <Text style={styles.lastSyncText}>Last sync at 5:00 PM, 12 Dec 25</Text>

                  {/* Small Health Metric Boxes Row */}
                  <View style={styles.smallMetricsRow}>
                    <SmallHealthMetricBox type="steps" value="7200" />
                    <SmallHealthMetricBox type="heartRate" value="73" unit="bpm" />
                    <SmallHealthMetricBox type="spo2" value="92%" />
                  </View>

                  {/* Large Health Metric Boxes */}
                  <View style={styles.largeMetricsWrapper}>
                    <HealthMetricBox type="calories" />
                  </View>
                  <View style={styles.largeMetricsWrapper}>
                    <HealthMetricBox type="hrv" />
                  </View>
                  <View style={styles.largeMetricsWrapper}>
                    <HealthMetricBox type="rhr" />
                  </View>
                  <View style={styles.largeMetricsWrapper}>
                    <HealthMetricBox type="stress" />
                  </View>
                  <View style={styles.largeMetricsWrapperLast}>
                    <HealthMetricBox type="sleep" />
                  </View>
                </>
              ) : (
                <View style={styles.wearableWrapper}>
                  <ConnectWearableCard />
                </View>
              )}
            </>
          )}

          {selectedPeriod !== 'daily' && (
            <>
              {/* Week Navigation */}
              <View style={styles.weekNavigationWrapper}>
                <WeekNavigation
                  startDate={new Date(2025, 0, 1)}
                  endDate={new Date(2025, 2, 24)}
                  onPreviousPress={() => console.log('Previous')}
                  onNextPress={() => console.log('Next')}
                />
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Session & Engagement Title */}
              <Text style={styles.sessionEngagementTitle}>Session & Engagement</Text>

              {/* Session Engagement Card */}
              <View style={styles.sessionEngagementWrapper}>
                <SessionEngagementCard
                  totalHours={36}
                  avgHoursPerWeek={5}
                  bookedHours={36}
                  completedHours={32}
                  upcomingHours={1}
                />
              </View>

              {/* This Week's Goal Title */}
              <Text style={styles.goalTitle}>This Week's Goal</Text>

              {/* Weekly Goal Status */}
              <View style={styles.weeklyGoalStatusWrapper}>
                <WeeklyGoalStatus
                  completedSessions={4}
                  goalSessions={4}
                  status="Met"
                  message="Goal achieved! Keep the momentum going - book your next session to stay consistent 🔥"
                />
              </View>

              {/* Activity Overview Title */}
              <Text style={styles.activityOverviewTitle}>Activity Overview</Text>

              {/* Session Details Card */}
              <View style={styles.sessionDetailsWrapper}>
                <SessionDetailsCard />
              </View>

              {/* Health Trends or Connect Wearable */}
              {isDeviceConnected ? (
                <>
                  {/* Health Trends Title */}
                  <Text style={styles.healthTrendsTitle}>Health Trends</Text>

                  {/* Last Sync Text */}
                  <Text style={styles.lastSyncText}>Last sync at 5:00 PM, 12 Dec 25</Text>

                  {/* Small Health Metric Boxes Row */}
                  <View style={styles.smallMetricsRow}>
                    <SmallHealthMetricBox type="steps" value="7200" />
                    <SmallHealthMetricBox type="heartRate" value="73" unit="bpm" />
                    <SmallHealthMetricBox type="spo2" value="92%" />
                  </View>

                  {/* Large Health Metric Boxes */}
                  <View style={styles.largeMetricsWrapper}>
                    <HealthMetricBox type="calories" />
                  </View>
                  <View style={styles.largeMetricsWrapper}>
                    <HealthMetricBox type="hrv" />
                  </View>
                  <View style={styles.largeMetricsWrapper}>
                    <HealthMetricBox type="rhr" />
                  </View>
                  <View style={styles.largeMetricsWrapper}>
                    <HealthMetricBox type="stress" />
                  </View>
                  <View style={styles.largeMetricsWrapperLast}>
                    <HealthMetricBox type="sleep" />
                  </View>
                </>
              ) : (
                <View style={styles.wearableWrapper}>
                  <ConnectWearableCard />
                </View>
              )}
            </>
          )}
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
    paddingHorizontal: scale(25),
    paddingTop: scale(24),
    paddingBottom: scale(24),
  },
  toggleContainer: {
    alignItems: 'center',
    marginBottom: scale(21),
  },
  cardContainer: {
    width: scale(325),
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: '#F2F2F2',
    paddingVertical: scale(1),
    paddingHorizontal: scale(8),
    shadowColor: 'rgba(188, 188, 188, 0.12)',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 1,
    shadowRadius: scale(4),
    elevation: 2,
    gap: scale(10),
  },
  dateHeader: {
    fontSize: scale(13),
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'SF Pro Text',
    marginTop: scale(16.64),
    marginLeft: scale(12),
  },
  weeklyViewWrapper: {
    marginLeft: -scale(8),
    marginRight: -scale(8),
  },
  statsWrapper: {
    alignItems: 'center',
  },
  dailyStatsWrapper: {
    marginTop: scale(22),
    marginLeft: -scale(8),
    marginRight: -scale(8),
  },
  goalTitle: {
    color: '#000000',
    fontFamily: 'Inter',
    fontSize: scale(14),
    fontWeight: '600',
    marginTop: scale(20),
    marginLeft: scale(12),
  },
  weeklyGoalStatusWrapper: {
    marginTop: scale(10),
    alignItems: 'center',
  },
  activityOverviewTitle: {
    color: '#000000',
    fontFamily: 'SF Pro Text',
    fontSize: scale(14),
    fontWeight: '600',
    marginTop: scale(20),
    marginLeft: scale(12),
    alignSelf: 'stretch',
  },
  sessionDetailsWrapper: {
    marginTop: scale(10),
    alignItems: 'center',
  },
  healthTrendsTitle: {
    color: '#000000',
    fontFamily: 'Inter',
    fontSize: scale(14),
    fontWeight: '600',
    marginTop: scale(20),
    marginLeft: scale(12),
  },
  lastSyncText: {
    color: '#999A9E',
    fontFamily: 'Inter',
    fontSize: scale(13),
    fontWeight: '500',
    lineHeight: scale(17),
    marginTop: scale(5),
    marginLeft: scale(12),
  },
  smallMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(10),
    marginLeft: scale(12),
    marginRight: scale(12),
    gap: scale(7.5),
  },
  largeMetricsWrapper: {
    marginTop: scale(10),
    alignItems: 'center',
  },
  largeMetricsWrapperLast: {
    marginTop: scale(10),
    marginBottom: scale(20),
    alignItems: 'center',
  },
  weekNavigationWrapper: {
    marginTop: scale(16.64),
    marginBottom: scale(15),
  },
  divider: {
    width: scale(324),
    height: 1,
    borderRadius: scale(8),
    backgroundColor: '#F2F2F2',
    alignSelf: 'center',
    marginBottom: scale(15),
  },
  sessionEngagementTitle: {
    color: '#000000',
    fontFamily: 'SF Pro Text',
    fontSize: scale(14),
    fontWeight: '600',
    marginLeft: scale(12),
    marginBottom: scale(10),
  },
  sessionEngagementWrapper: {
    alignItems: 'center',
  },
  goalSetterWrapper: {
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
    marginBottom: -scale(8),
    marginLeft: -scale(8),
    marginRight: -scale(8),
  },
  healthMetricWrapper: {
    alignItems: 'center',
  },
});
