import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { scale } from '../utils/scaling';

interface WeeklyGoalStatusProps {
  completedSessions: number;
  goalSessions: number;
  status: 'Met' | 'Not Met' | 'Exceeded';
  message: string;
}

const GoalCircleIcon: React.FC<{ completedSessions: number; goalSessions: number }> = ({
  completedSessions,
  goalSessions
}) => (
  <View style={styles.circleContainer}>
    <Svg width="42" height="42" viewBox="0 0 42 42" fill="none">
      <Path
        d="M42 21C42 32.598 32.598 42 21 42C9.40202 42 0 32.598 0 21C0 9.40202 9.40202 0 21 0C32.598 0 42 9.40202 42 21ZM3.36 21C3.36 30.7423 11.2577 38.64 21 38.64C30.7423 38.64 38.64 30.7423 38.64 21C38.64 11.2577 30.7423 3.36 21 3.36C11.2577 3.36 3.36 11.2577 3.36 21Z"
        fill="#9BDCC9"
      />
      <Path
        d="M42 21C42 32.598 32.598 42 21 42C9.40202 42 0 32.598 0 21C0 9.40202 9.40202 0 21 0C32.598 0 42 9.40202 42 21ZM3.36 21C3.36 30.7423 11.2577 38.64 21 38.64C30.7423 38.64 38.64 30.7423 38.64 21C38.64 11.2577 30.7423 3.36 21 3.36C11.2577 3.36 3.36 11.2577 3.36 21Z"
        fill="#04A777"
      />
    </Svg>
    <Text style={styles.circleText}>{completedSessions}/{goalSessions}</Text>
  </View>
);

export const WeeklyGoalStatus: React.FC<WeeklyGoalStatusProps> = ({
  completedSessions,
  goalSessions,
  status,
  message,
}) => {
  return (
    <View style={styles.container}>
      {/* Circle Icon */}
      <GoalCircleIcon completedSessions={completedSessions} goalSessions={goalSessions} />

      {/* Goal Met Text */}
      <Text style={styles.statusText}>Goal {status}</Text>

      {/* Message */}
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(285),
    height: scale(157),
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: '#B4E7D8',
    backgroundColor: '#F0FFFB',
    paddingTop: scale(15),
    paddingLeft: scale(15),
    paddingBottom: scale(15),
    paddingRight: scale(40),
  },
  circleContainer: {
    width: scale(42),
    height: scale(42),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circleText: {
    position: 'absolute',
    color: '#000000',
    fontFamily: 'SF Pro Text',
    fontSize: scale(12),
    fontWeight: '700',
    lineHeight: scale(17),
  },
  statusText: {
    color: '#000000',
    fontFamily: 'SF Pro Text',
    fontSize: scale(14),
    fontWeight: '600',
    marginTop: scale(12),
  },
  messageText: {
    color: '#999A9E',
    fontFamily: 'SF Pro Text',
    fontSize: scale(12),
    fontWeight: '500',
    lineHeight: scale(17),
    marginTop: scale(5),
  },
});
