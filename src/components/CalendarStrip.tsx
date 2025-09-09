import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import styles from '../styles';

const toISO = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: Date, n: number) => {
  const x = new Date(d); x.setDate(x.getDate() + n); x.setHours(0,0,0,0); return x;
};
const startOfWeekMon = (d: Date) => {
  const x = new Date(d); const dow = x.getDay(); // Sun=0..Sat=6
  const diff = (dow + 6) % 7; x.setDate(x.getDate() - diff); x.setHours(0,0,0,0); return x;
};
const ordinal = (n: number) => {
  const s = ['th','st','nd','rd']; const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export type CalendarStripProps = {
  selected: Date;
  onChange: (d: Date) => void;
  getCount?: (d: Date) => number;
};

const CalendarStrip: React.FC<CalendarStripProps> = ({ selected, onChange, getCount = () => 0 }) => {
  const weekStart = React.useMemo(() => startOfWeekMon(selected), [selected]);
  const days = React.useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const title = `${ordinal(selected.getDate())} ${selected.toLocaleString('en-US',{month:'short'})} ${selected.getFullYear()}`;

  return (
    <View style={styles.calWrap}>
      <View style={styles.calHeader}>
        <Pressable onPress={() => onChange(addDays(selected, -7))} style={styles.chevBtn}>
          <Text style={styles.chevText}>‹</Text>
        </Pressable>
        <Text style={styles.calTitle}>{title}</Text>
        <Pressable onPress={() => onChange(addDays(selected, +7))} style={styles.chevBtn}>
          <Text style={styles.chevText}>›</Text>
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calRow}>
        {days.map((d) => {
          const isSel = toISO(d) === toISO(selected);
          const count = getCount(d) || 0;
          return (
            <Pressable key={toISO(d)} style={styles.calItem} onPress={() => onChange(d)}>
              <Text style={[styles.calDow, isSel && styles.calDowSelected]}>
                {d.toLocaleString('en-US', { weekday: 'short' })}
              </Text>
              <View style={[styles.calCircle, isSel && styles.calCircleSelected]}>
                <Text style={[styles.calDayNum, isSel && styles.calDayNumSelected]}>
                  {d.getDate()}
                </Text>
              </View>
              <Text style={styles.calSub}>
                {count === 0 ? 'Book' : count === 1 ? '1 Class' : `${count} Classes`}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default CalendarStrip;
