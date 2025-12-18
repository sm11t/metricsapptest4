import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type GoalProgressProps = {
  goalSessions: number;
  completedSessions: number;
  status: string;
  message: string;
};

export const GoalProgress: React.FC<GoalProgressProps> = ({
  goalSessions,
  completedSessions,
  status,
  message,
}) => {
  const progressPercentage = Math.min((completedSessions / goalSessions) * 100, 100);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Current Goal</Text>
        <Text style={styles.progressLabel}>
          {completedSessions}/{goalSessions}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
      </View>

      {/* Status */}
      <View style={styles.statusContainer}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      {/* Message */}
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 285,
    paddingVertical: 16,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EE731B',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#04A777',
    borderRadius: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#C9F1E5',
    backgroundColor: '#F3FFFB',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#04A777',
    textTransform: 'uppercase',
  },
  message: {
    fontSize: 12,
    fontWeight: '400',
    color: '#757575',
    lineHeight: 18,
  },
});
