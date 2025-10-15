import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

type CalendarDay = {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
};

type CalendarGridProps = {
  currentDate: Date;
  onDayPress?: (date: Date) => void;
};

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  onDayPress,
}) => {
  // Generate calendar days
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Get day of week (0 = Sunday, adjust to Monday = 0)
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6; // Sunday

    const daysInMonth = lastDay.getDate();
    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
    const todayDate = today.getDate();

    const days: CalendarDay[] = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Current month days
    for (let date = 1; date <= daysInMonth; date++) {
      const isToday = isCurrentMonth && date === todayDate;

      days.push({
        date,
        isCurrentMonth: true,
        isToday,
      });
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let date = 1; date <= remainingDays; date++) {
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return days;
  };

  const days = generateCalendarDays();

  return (
    <View style={styles.container}>
      {/* Weekday Headers */}
      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((day, index) => (
          <View key={index} style={styles.weekdayCell}>
            <Text style={styles.weekdayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Days */}
      <View style={styles.daysGrid}>
        {days.map((day, index) => (
          <Pressable
            key={index}
            style={[
              styles.dayCell,
              day.isToday && styles.todayCell,
            ]}
            onPress={() => {
              if (day.isCurrentMonth && onDayPress) {
                const selectedDate = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day.date
                );
                onDayPress(selectedDate);
              }
            }}
          >
            <Text
              style={[
                styles.dayText,
                !day.isCurrentMonth && styles.dayTextInactive,
                day.isToday && styles.todayText,
              ]}
            >
              {day.date}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    width: 24,
  },
  weekdayText: {
    color: '#8A8A8A',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 24,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 0,
  },
  dayCell: {
    width: '14.28%', // 100% / 7 days
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  todayCell: {
    backgroundColor: '#FFDFC8',
    borderRadius: 9,
  },
  dayText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  dayTextInactive: {
    color: '#8A8A8A',
  },
  todayText: {
    color: '#000000',
    fontWeight: '700',
  },
});
