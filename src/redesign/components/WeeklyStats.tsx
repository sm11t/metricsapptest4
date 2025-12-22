import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, G, Rect, ClipPath, Defs } from 'react-native-svg';
import { scale } from '../utils/scaling';

interface WeeklyStatsProps {
  bookedHours: number;
  completedHours: number;
  upcomingHours: number;
}

const StatsIcon = () => (
  <Svg width={scale(16)} height={scale(14)} viewBox="0 0 16 14" fill="none">
    <G clipPath="url(#clip0_579_7050)">
      <Rect width="4" height="10" rx="1.5" fill="#565D64" />
      <Rect x="6" width="4" height="14" rx="1.5" fill="#565D64" />
      <Rect x="12" y="7" width="4" height="7" rx="1.5" fill="#565D64" />
    </G>
    <Defs>
      <ClipPath id="clip0_579_7050">
        <Rect width="16" height="14" fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);

export const WeeklyStats: React.FC<WeeklyStatsProps> = ({
  bookedHours,
  completedHours,
  upcomingHours,
}) => {
  return (
    <View style={styles.container}>
      <StatsIcon />
      <Text style={styles.text}>
        This week you've booked <Text style={styles.bold}>{bookedHours} Hrs</Text>, completed{' '}
        <Text style={styles.bold}>{completedHours} Hrs</Text> and have another{' '}
        <Text style={styles.bold}>{upcomingHours} Hrs</Text> upcoming.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: scale(66),
    paddingTop: scale(15),
    paddingBottom: scale(15),
    paddingLeft: scale(19),
    paddingRight: scale(20),
    backgroundColor: '#FBFBFB',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(12),
  },
  text: {
    flex: 1,
    color: '#8A9096',
    fontSize: scale(12),
    fontWeight: '500',
    fontFamily: 'Inter',
    lineHeight: scale(18),
  },
  bold: {
    fontWeight: '700',
    color: '#565D64',
    fontFamily: 'Inter',
  },
});
