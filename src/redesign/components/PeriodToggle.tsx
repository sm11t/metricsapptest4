import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

type PeriodToggleProps = {
  selectedPeriod: Period;
  onPeriodChange: (period: Period) => void;
};

export const PeriodToggle: React.FC<PeriodToggleProps> = ({
  selectedPeriod,
  onPeriodChange,
}) => {
  const periods: { key: Period; label: string }[] = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'yearly', label: 'Yearly' },
  ];

  return (
    <View style={styles.container}>
      {periods.map((period) => (
        <Pressable
          key={period.key}
          style={[
            styles.button,
            selectedPeriod === period.key && styles.buttonSelected,
          ]}
          onPress={() => onPeriodChange(period.key)}
        >
          <Text
            style={[
              styles.buttonText,
              selectedPeriod === period.key && styles.buttonTextSelected,
            ]}
          >
            {period.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 325,
    height: 29,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    borderRadius: 7,
    padding: 3,
  },
  button: {
    flex: 1,
    height: 23,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonSelected: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8A9096',
  },
  buttonTextSelected: {
    fontWeight: '600',
    color: '#000000',
  },
});
