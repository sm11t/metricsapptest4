import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Svg, Path } from 'react-native-svg';

interface ChevronIconProps {
  isExpanded: boolean;
}

const ChevronIcon: React.FC<ChevronIconProps> = ({ isExpanded }) => (
  <Svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }}
  >
    <Path
      d="M4 6L8 10L12 6"
      stroke="#8A9096"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const HealthTrend: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, isExpanded && styles.headerExpanded]}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Health Trend</Text>
          {isExpanded && <Text style={styles.date}>{getCurrentDate()}</Text>}
        </View>
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
          <ChevronIcon isExpanded={isExpanded} />
        </TouchableOpacity>
      </View>

      {/* Content - will be added later */}
      {isExpanded && (
        <View style={styles.content}>
          <Text style={styles.placeholder}>Health metrics will appear here</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 20,
    minHeight: 57,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 0,
  },
  headerExpanded: {
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  date: {
    fontSize: 10.5,
    fontWeight: '400',
    color: '#8A9096',
  },
  content: {
    minHeight: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8A9096',
  },
});
