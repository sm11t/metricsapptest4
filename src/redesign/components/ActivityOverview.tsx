import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Circle } from 'react-native-svg';

type ActivityOverviewProps = {
  oneOnOne: number;
  group: number;
  finished: number;
  noShow: number;
};

export const ActivityOverview: React.FC<ActivityOverviewProps> = ({
  oneOnOne,
  group,
  finished,
  noShow,
}) => {
  const totalFinished = finished + noShow;
  const finishedPercentage = totalFinished > 0 ? (finished / totalFinished) * 100 : 0;

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Activity Overview</Text>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        {/* Finished Sessions */}
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Finished</Text>
          <View style={styles.statContent}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#6EC9A8' }]} />
              <Text style={styles.legendText}>1:1 {oneOnOne}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#F4A261' }]} />
              <Text style={styles.legendText}>Group {group}</Text>
            </View>
          </View>
        </View>

        {/* Finished vs No Show */}
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Finished vs No Show</Text>
          <View style={styles.pieContainer}>
            <Svg width="60" height="60" viewBox="0 0 60 60">
              <Circle
                cx="30"
                cy="30"
                r="25"
                fill="none"
                stroke="#E8E8E8"
                strokeWidth="10"
              />
              <Circle
                cx="30"
                cy="30"
                r="25"
                fill="none"
                stroke="#6EC9A8"
                strokeWidth="10"
                strokeDasharray={`${(finishedPercentage / 100) * 157} 157`}
                strokeDashoffset="0"
                transform="rotate(-90 30 30)"
              />
            </Svg>
            <View style={styles.pieCenter}>
              <Text style={styles.pieValue}>{finished}</Text>
              <Text style={styles.pieTotal}>/{totalFinished}</Text>
            </View>
          </View>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#6EC9A8' }]} />
              <Text style={styles.legendText}>Finished {finished}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#E8E8E8' }]} />
              <Text style={styles.legendText}>No Show {noShow}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 307,
    paddingVertical: 16,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    gap: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    gap: 8,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8A9096',
    textTransform: 'uppercase',
  },
  statContent: {
    gap: 6,
  },
  legendContainer: {
    gap: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '400',
    color: '#757575',
  },
  pieContainer: {
    position: 'relative',
    width: 60,
    height: 60,
    alignSelf: 'center',
    marginVertical: 8,
  },
  pieCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  pieValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  pieTotal: {
    fontSize: 12,
    fontWeight: '400',
    color: '#757575',
  },
});
