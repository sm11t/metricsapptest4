import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const WeeklyGoalSetter: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set your weekly goal</Text>
      {/* Additional content will be added next */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 285,
    height: 173,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F1F1',
    shadowColor: 'rgba(188, 188, 188, 0.20)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Inter',
    lineHeight: 17,
    alignSelf: 'stretch',
  },
});
