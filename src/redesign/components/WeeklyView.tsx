import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface WeeklyViewProps {
  currentDate: Date;
}

export const WeeklyView: React.FC<WeeklyViewProps> = ({ currentDate }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get the start of the week (Monday)
  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  };

  // Generate 7 days starting from Monday
  const startOfWeek = getStartOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = (date: Date) => {
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate.getTime() === today.getTime();
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    return compareDate.getTime() === selected.getTime();
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {weekDays.map((date, index) => {
        const isTodayCard = isToday(date);
        const isSelectedCard = isSelected(date);

        // Mock data - will be replaced with actual data later
        const dayOfMonth = date.getDate();

        // Determine booking status and color based on date
        let hasBooking = false;
        let hours = 0;
        let progressBarColor = '#A1E5CF'; // Default green

        if (dayOfMonth === 16) {
          hasBooking = true;
          hours = 1.5;
          progressBarColor = '#C8F3E3'; // Light green
        } else if (dayOfMonth === 17 || dayOfMonth === 18) {
          hasBooking = true;
          hours = 1;
          progressBarColor = '#D9D9D9'; // Grey
        } else if (index === 0) {
          // Keep first card with booking for demo
          hasBooking = true;
          hours = 2;
          progressBarColor = '#A1E5CF'; // Green
        }

        return (
          <View key={index} style={styles.cardWrapper}>
            {/* Day Card */}
            <TouchableOpacity
              style={[
                styles.dayCard,
                isSelectedCard && styles.selectedCard,
              ]}
              onPress={() => setSelectedDate(date)}
              activeOpacity={0.7}
            >
              {/* Today Badge - positioned at top-left corner */}
              {isTodayCard && (
                <View style={styles.todayBadge}>
                  <Text style={styles.todayBadgeText}>Today</Text>
                </View>
              )}

              <Text style={styles.weekdayText}>{getDayName(date)}</Text>
              <Text style={[styles.dayText, isSelectedCard && styles.selectedDayText]}>
                {date.getDate()}
              </Text>
              {hasBooking && (
                <View style={[styles.progressBar, { backgroundColor: progressBarColor }]} />
              )}
              {hasBooking && <Text style={styles.hoursText}>{hours} Hrs</Text>}
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 131,
    paddingTop: 22,
    paddingBottom: 14,
    paddingLeft: 20,
    paddingRight: 12,
  },
  cardWrapper: {
    marginRight: 12,
    alignItems: 'center',
  },
  todayBadge: {
    position: 'absolute',
    top: -8,
    left: -8,
    paddingTop: 3,
    paddingBottom: 4,
    paddingHorizontal: 5,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#FFDFC8',
    backgroundColor: '#FFF3EA',
    zIndex: 10,
  },
  todayBadgeText: {
    color: '#EE731B',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 10,
    textAlign: 'center',
    fontFamily: 'SF Pro Text',
  },
  dayCard: {
    width: 78,
    height: 95,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    backgroundColor: '#FFFFFF',
    shadowColor: '#EFEFEF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 9,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    gap: 4,
    position: 'relative',
  },
  selectedCard: {
    borderColor: '#FFE8D8',
    backgroundColor: '#FFFCF9',
  },
  weekdayText: {
    width: 68,
    fontSize: 11,
    fontWeight: '500',
    color: '#B39F8A',
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  dayText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  selectedDayText: {
    color: '#EE731B',
  },
  progressBar: {
    width: 28,
    height: 6,
    borderRadius: 20,
    backgroundColor: '#A1E5CF',
  },
  hoursText: {
    width: 68,
    fontSize: 11,
    fontWeight: '500',
    color: '#B39F8A',
    textAlign: 'center',
    fontFamily: 'Inter',
  },
});
