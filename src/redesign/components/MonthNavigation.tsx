import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { scale } from '../utils/scaling';
import { ChevronLeft } from '../assets/ChevronLeft';
import { ChevronRight } from '../assets/ChevronRight';

type MonthNavigationProps = {
  currentDate: Date;
  onPreviousPress?: () => void;
  onNextPress?: () => void;
  viewMode?: 'month' | 'week';
};

export const MonthNavigation: React.FC<MonthNavigationProps> = ({
  currentDate,
  onPreviousPress,
  onNextPress,
  viewMode = 'month',
}) => {
  const displayText = viewMode === 'month'
    ? currentDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

  // In week view, only show today's date without chevrons
  if (viewMode === 'week') {
    return (
      <View style={styles.container}>
        <Text style={styles.monthText}>{displayText}</Text>
      </View>
    );
  }

  // In month view, show chevrons
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.chevronButton,
          pressed && styles.chevronPressed,
        ]}
        onPress={onPreviousPress}
      >
        <ChevronLeft width={scale(8)} height={scale(14)} color="#000000" />
      </Pressable>

      <Text style={styles.monthText}>{displayText}</Text>

      <Pressable
        style={({ pressed }) => [
          styles.chevronButton,
          pressed && styles.chevronPressed,
        ]}
        onPress={onNextPress}
      >
        <ChevronRight width={scale(8)} height={scale(14)} color="#000000" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(20),
  },
  chevronButton: {
    padding: scale(4),
  },
  chevronPressed: {
    opacity: 0.5,
  },
  monthText: {
    color: '#000000',
    fontSize: scale(13),
    fontWeight: '600',
    fontFamily: 'SF Pro Text',
  },
});
