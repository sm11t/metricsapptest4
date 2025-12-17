import React from 'react';
import { Text, StyleSheet } from 'react-native';

type MonthNavigationProps = {
  currentDate: Date;
};

export const MonthNavigation: React.FC<MonthNavigationProps> = ({
  currentDate,
}) => {
  const monthYear = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return <Text style={styles.monthText}>{monthYear}</Text>;
};

const styles = StyleSheet.create({
  monthText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '600',
  },
});
