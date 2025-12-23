import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { scale } from '../utils/scaling';

const SessionIcon = () => (
  <Svg width={scale(11)} height={scale(13)} viewBox="0 0 11 13" fill="none">
    <Path
      d="M5.26072 3.46268C6.21694 3.46268 6.99208 2.68752 6.99208 1.73134C6.99208 0.775141 6.21694 0 5.26072 0C4.3045 0 3.5294 0.775141 3.5294 1.73134C3.5294 2.68754 4.3045 3.46268 5.26072 3.46268ZM10.3571 8.53175L10.3549 8.52954C10.0606 8.23202 8.85815 6.9197 8.84897 6.90644C8.77008 6.79122 7.9109 4.50831 7.86855 4.42061C7.85258 4.38738 7.65205 3.95386 7.13519 3.95386C7.13519 3.95386 3.37938 3.95421 3.3765 3.95485C3.04708 3.96217 2.74055 4.16802 2.62107 4.49625L1.68692 6.87754L0.162447 8.53364C-0.0391095 8.73874 -0.0568939 9.06717 0.130356 9.29362C0.330359 9.53549 0.688606 9.56944 0.930478 9.36939C1.49872 8.89949 2.51252 8.07684 2.81372 7.66747C2.81372 7.66747 3.34948 6.71917 3.38853 6.64315C3.5683 7.63252 3.33395 8.41238 3.12824 8.73696C2.83627 9.19767 0.979609 9.8166 0.773678 10.9111C0.692456 11.3429 0.958675 12.2116 2.08318 12.2116H3.21902C3.08293 12.0029 2.95525 11.6883 2.98686 11.3118C3.01282 10.9964 3.14773 10.633 3.51361 10.3348C4.26141 9.72151 5.5615 9.76139 6.99278 9.71141C7.09245 9.70793 7.17607 9.78593 7.17955 9.88562C7.18281 9.97839 7.11542 10.0573 7.02575 10.0705L7.02437 10.0707C6.46094 10.1518 4.96532 10.3884 4.59303 10.5257C4.10351 10.7057 3.79551 10.9802 3.77705 11.3686C3.7559 11.8021 4.18305 12.1359 4.82919 12.2116H8.43831C9.56288 12.2116 9.8291 11.3429 9.74781 10.9111C9.54192 9.81663 7.68522 9.19767 7.39332 8.73696C7.1876 8.41238 6.95319 7.63249 7.13296 6.64315C7.31866 7.00481 7.49565 7.32476 7.70781 7.66749C8.00256 8.06809 9.08845 8.95379 9.59105 9.36941C9.81328 9.55189 10.144 9.54214 10.3529 9.33544C10.576 9.1147 10.5779 8.75486 10.3571 8.53175Z"
      fill="#264150"
    />
  </Svg>
);

const StatsIcon = () => (
  <Svg width={scale(11)} height={scale(13)} viewBox="0 0 11 13" fill="none">
    <Path
      d="M5.26072 3.46268C6.21694 3.46268 6.99208 2.68752 6.99208 1.73134C6.99208 0.775141 6.21694 0 5.26072 0C4.3045 0 3.5294 0.775141 3.5294 1.73134C3.5294 2.68754 4.3045 3.46268 5.26072 3.46268ZM10.3571 8.53175L10.3549 8.52954C10.0606 8.23202 8.85815 6.9197 8.84897 6.90644C8.77008 6.79122 7.9109 4.50831 7.86855 4.42061C7.85258 4.38738 7.65205 3.95386 7.13519 3.95386C7.13519 3.95386 3.37938 3.95421 3.3765 3.95485C3.04708 3.96217 2.74055 4.16802 2.62107 4.49625L1.68692 6.87754L0.162447 8.53364C-0.0391095 8.73874 -0.0568939 9.06717 0.130356 9.29362C0.330359 9.53549 0.688606 9.56944 0.930478 9.36939C1.49872 8.89949 2.51252 8.07684 2.81372 7.66747C2.81372 7.66747 3.34948 6.71917 3.38853 6.64315C3.5683 7.63252 3.33395 8.41238 3.12824 8.73696C2.83627 9.19767 0.979609 9.8166 0.773678 10.9111C0.692456 11.3429 0.958675 12.2116 2.08318 12.2116H3.21902C3.08293 12.0029 2.95525 11.6883 2.98686 11.3118C3.01282 10.9964 3.14773 10.633 3.51361 10.3348C4.26141 9.72151 5.5615 9.76139 6.99278 9.71141C7.09245 9.70793 7.17607 9.78593 7.17955 9.88562C7.18281 9.97839 7.11542 10.0573 7.02575 10.0705L7.02437 10.0707C6.46094 10.1518 4.96532 10.3884 4.59303 10.5257C4.10351 10.7057 3.79551 10.9802 3.77705 11.3686C3.7559 11.8021 4.18305 12.1359 4.82919 12.2116H8.43831C9.56288 12.2116 9.8291 11.3429 9.74781 10.9111C9.54192 9.81663 7.68522 9.19767 7.39332 8.73696C7.1876 8.41238 6.95319 7.63249 7.13296 6.64315C7.31866 7.00481 7.49565 7.32476 7.70781 7.66749C8.00256 8.06809 9.08845 8.95379 9.59105 9.36941C9.81328 9.55189 10.144 9.54214 10.3529 9.33544C10.576 9.1147 10.5779 8.75486 10.3571 8.53175Z"
      fill="#264150"
    />
  </Svg>
);

interface SessionEngagementCardProps {
  totalHours: number;
  avgHoursPerWeek: number;
  bookedHours: number;
  completedHours: number;
  upcomingHours: number;
}

export const SessionEngagementCard: React.FC<SessionEngagementCardProps> = ({
  totalHours,
  avgHoursPerWeek,
  bookedHours,
  completedHours,
  upcomingHours,
}) => {
  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        {/* Icon and Title */}
        <View style={styles.header}>
          <SessionIcon />
          <Text style={styles.title}>Total Sessions</Text>
        </View>

        {/* Stats Line */}
        <View style={styles.statsLine}>
          <Text style={styles.totalHours}>{totalHours} hrs</Text>
          <Text style={styles.separator}>|</Text>
          <Text style={styles.avgHours}>
            {avgHoursPerWeek} hrs{' '}
            <Text style={styles.avgLabel}>avg. per week</Text>
          </Text>
        </View>

        {/* Graph Placeholder */}
        <View style={styles.graphPlaceholder} />
      </View>

      {/* Bottom Stats Section */}
      <View style={styles.bottomStats}>
        <StatsIcon />
        <Text style={styles.statsText}>
          This week you've booked <Text style={styles.statsBold}>{bookedHours} Hrs</Text>,
          completed <Text style={styles.statsBold}>{completedHours} Hrs</Text> and have another{' '}
          <Text style={styles.statsBold}>{upcomingHours} Hr</Text> upcoming.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(285),
    height: scale(315),
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: '#E7E7E7',
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(188, 188, 188, 0.20)',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 1,
    shadowRadius: scale(4),
    elevation: 2,
    overflow: 'hidden',
  },
  topSection: {
    paddingTop: scale(15),
    paddingLeft: scale(15),
    paddingRight: scale(15),
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  title: {
    color: '#264150',
    fontFamily: 'SF Pro Text',
    fontSize: scale(12),
    fontWeight: '500',
    letterSpacing: -0.2,
    textTransform: 'capitalize',
  },
  statsLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(11),
    gap: scale(5),
  },
  totalHours: {
    color: '#000000',
    fontFamily: 'SF Pro Text',
    fontSize: scale(15),
    fontWeight: '700',
    lineHeight: scale(20),
  },
  separator: {
    color: '#888888',
    fontFamily: 'SF Pro Text',
    fontSize: scale(14),
    fontWeight: '400',
    lineHeight: scale(20),
  },
  avgHours: {
    color: '#000000',
    fontFamily: 'SF Pro',
    fontSize: scale(15),
    fontWeight: '700',
    lineHeight: scale(16),
  },
  avgLabel: {
    color: '#888888',
    fontFamily: 'SF Pro',
    fontSize: scale(14),
    fontWeight: '400',
    lineHeight: scale(16),
  },
  graphPlaceholder: {
    flex: 1,
    marginTop: scale(15),
    backgroundColor: '#F5F5F5',
  },
  bottomStats: {
    height: scale(84),
    paddingVertical: scale(15),
    paddingLeft: scale(15),
    paddingRight: scale(39),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    borderBottomLeftRadius: scale(7),
    borderBottomRightRadius: scale(7),
    backgroundColor: '#FBFBFB',
  },
  statsText: {
    flex: 1,
    color: '#8A9096',
    fontFamily: 'Inter',
    fontSize: scale(12),
    fontWeight: '500',
    lineHeight: scale(18),
  },
  statsBold: {
    fontWeight: '700',
    color: '#565D64',
    fontFamily: 'Inter',
  },
});
