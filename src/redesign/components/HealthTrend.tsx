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

const CaloriesBurntIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <Path
      d="M8.96115 3.04139C9.96732 3.49101 10.7887 4.27226 11.2882 5.25464C11.7877 6.23702 11.9349 7.36104 11.7054 8.43892C11.4758 9.51681 10.8833 10.4833 10.0269 11.1769C9.17052 11.8705 8.10204 12.2493 6.99999 12.2499C6.05721 12.25 5.13518 11.9731 4.34837 11.4537C3.56157 10.9343 2.94464 10.1953 2.5742 9.32834C2.20376 8.46139 2.09612 7.50473 2.26465 6.57714C2.43317 5.64955 2.87044 4.79189 3.52215 4.11064C3.97098 4.738 4.56342 5.24883 5.24999 5.60048C5.26201 4.82967 5.44396 4.07102 5.78285 3.37861C6.12175 2.6862 6.60924 2.0771 7.21057 1.59473C7.66951 2.21026 8.26971 2.70642 8.96057 3.04139H8.96115Z"
      stroke="#264150"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.00001 10.4999C7.55575 10.5008 8.091 10.2902 8.49707 9.91075C8.90314 9.53134 9.14957 9.01159 9.18633 8.45707C9.22308 7.90254 9.0474 7.35482 8.69496 6.92513C8.34253 6.49544 7.83976 6.216 7.28876 6.14355C6.68639 6.6826 6.28955 7.41382 6.16584 8.21264C5.71644 8.10252 5.29347 7.90402 4.92159 7.62872C4.81347 7.95733 4.78483 8.30689 4.83802 8.64871C4.89121 8.99054 5.02471 9.31487 5.22756 9.59509C5.43041 9.87531 5.69682 10.1034 6.00494 10.2607C6.31305 10.418 6.65407 10.5 7.00001 10.4999Z"
      stroke="#264150"
      strokeWidth="1.2"
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

      {/* Content */}
      {isExpanded && (
        <View style={styles.content}>
          {/* Calories Burnt */}
          <View style={styles.caloriesBox}>
            <View style={styles.caloriesHeader}>
              <CaloriesBurntIcon />
              <Text style={styles.caloriesLabel}>Calories Burnt</Text>
            </View>
          </View>

          {/* HRV and RHR Row */}
          <View style={styles.row}>
            <View style={styles.smallBox} />
            <View style={styles.smallBox} />
          </View>

          {/* Stress and Sleep Row */}
          <View style={styles.row}>
            <View style={styles.smallBox} />
            <View style={styles.smallBox} />
          </View>
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
    paddingTop: 14,
  },
  caloriesBox: {
    width: 285,
    height: 74,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  caloriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  caloriesLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#264150',
    fontFamily: 'SF Pro Text',
    textTransform: 'uppercase',
    letterSpacing: -0.2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  smallBox: {
    width: 138,
    height: 144,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    opacity: 0.6,
  },
});
