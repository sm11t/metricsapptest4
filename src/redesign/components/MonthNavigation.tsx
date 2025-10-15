import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

type MonthNavigationProps = {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

export const MonthNavigation: React.FC<MonthNavigationProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
}) => {
  const monthYear = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <View style={styles.container}>
      {/* Previous Month Button */}
      <Pressable
        onPress={onPrevMonth}
        style={({ pressed }) => [
          styles.chevronButton,
          pressed && styles.chevronPressed,
        ]}
      >
        <Text style={styles.chevron}>‹</Text>
      </Pressable>

      {/* Month and Year */}
      <Text style={styles.monthText}>{monthYear}</Text>

      {/* Next Month Button */}
      <Pressable
        onPress={onNextMonth}
        style={({ pressed }) => [
          styles.chevronButton,
          pressed && styles.chevronPressed,
        ]}
      >
        <Text style={styles.chevron}>›</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    gap: 8,
  },
  chevronButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronPressed: {
    opacity: 0.5,
  },
  chevron: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '600',
  },
  monthText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '600',
  },
});
