import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { scale } from '../utils/scaling';
import { ChevronLeft } from '../assets/ChevronLeft';
import { ChevronRight } from '../assets/ChevronRight';

type WeekNavigationProps = {
  startDate: Date;
  endDate: Date;
  onPreviousPress?: () => void;
  onNextPress?: () => void;
};

export const WeekNavigation: React.FC<WeekNavigationProps> = ({
  startDate,
  endDate,
  onPreviousPress,
  onNextPress,
}) => {
  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    return `${day}${day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} ${month}`;
  };

  const year = endDate.getFullYear();
  const displayText = `${formatDate(startDate)} - ${formatDate(endDate)} ${year}`;

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

      <Text style={styles.dateText}>{displayText}</Text>

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
    justifyContent: 'space-between',
    paddingHorizontal: scale(10),
  },
  chevronButton: {
    padding: scale(4),
  },
  chevronPressed: {
    opacity: 0.5,
  },
  dateText: {
    color: '#000000',
    fontFamily: 'SF Pro Text',
    fontSize: scale(13),
    fontWeight: '600',
  },
});
