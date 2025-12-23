import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Path, G, ClipPath, Defs, Rect } from 'react-native-svg';
import { scale } from '../utils/scaling';

type MetricType = 'steps' | 'heartRate' | 'spo2';

interface SmallHealthMetricBoxProps {
  type: MetricType;
  value: string;
  unit?: string;
}

const StepsIcon = () => (
  <Svg width={scale(14)} height={scale(14)} viewBox="0 0 14 14" fill="none">
    <Path
      d="M2.33371 9.33268V7.94435C2.33371 6.70768 1.73287 6.12435 1.75037 4.66602C1.76787 3.07935 2.61954 1.16602 4.37537 1.16602C5.46621 1.16602 5.83371 2.21602 5.83371 3.20768C5.83371 5.02185 4.66704 6.50935 4.66704 8.27102V9.33268C4.66704 9.6421 4.54413 9.93885 4.32533 10.1576C4.10654 10.3764 3.80979 10.4993 3.50037 10.4993C3.19096 10.4993 2.89421 10.3764 2.67542 10.1576C2.45662 9.93885 2.33371 9.6421 2.33371 9.33268Z"
      stroke="#264150"
      strokeWidth="1.36"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.667 11.6667V10.2783C11.667 9.04167 12.2678 8.45833 12.2503 7C12.2328 5.41333 11.3812 3.5 9.62533 3.5C8.53449 3.5 8.16699 4.55 8.16699 5.54167C8.16699 7.35583 9.33366 8.84333 9.33366 10.605V11.6667C9.33366 11.9761 9.45658 12.2728 9.67537 12.4916C9.89416 12.7104 10.1909 12.8333 10.5003 12.8333C10.8097 12.8333 11.1065 12.7104 11.3253 12.4916C11.5441 12.2728 11.667 11.9761 11.667 11.6667Z"
      stroke="#264150"
      strokeWidth="1.36"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.33301 9.91602H11.6663"
      stroke="#264150"
      strokeWidth="1.36"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2.33301 7.58398H4.66634"
      stroke="#264150"
      strokeWidth="1.36"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const HeartRateIcon = () => (
  <Svg width={scale(14)} height={scale(14)} viewBox="0 0 14 14" fill="none">
    <G clipPath="url(#clip0_579_10707)">
      <Path
        d="M9.29808 10.791C8.47412 11.3959 7.64899 11.8372 7.00033 12.0528C4.95866 11.3743 1.16699 8.45768 1.16699 5.24935C1.16699 3.47747 2.60345 2.04102 4.37533 2.04102C5.46033 2.04102 6.41991 2.57972 7.00033 3.40427C7.29617 2.98287 7.6892 2.63896 8.14613 2.40166C8.60306 2.16436 9.11045 2.04065 9.62533 2.04102C11.3972 2.04102 12.8337 3.47747 12.8337 5.24935C12.8337 5.75889 12.738 6.26085 12.5691 6.74764"
        stroke="#264150"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7.875 8.45768H9.04167L9.91667 7.29102L10.7917 9.62435L11.6556 8.45768H12.8333"
        stroke="#264150"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_579_10707">
        <Rect width="14" height="14" fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);

const SpO2Icon = () => (
  <Svg width={scale(16)} height={scale(16)} viewBox="0 0 16 16" fill="none">
    <Path
      d="M5.65698 8.99023C4.55248 8.99023 3.65698 9.88573 3.65698 10.9902C3.65698 12.0947 4.55248 12.9902 5.65698 12.9902C6.76148 12.9902 7.65698 12.0947 7.65698 10.9902C7.65698 9.88573 6.76148 8.99023 5.65698 8.99023ZM5.65698 11.9902C5.10498 11.9902 4.65698 11.5422 4.65698 10.9902C4.65698 10.4382 5.10498 9.99023 5.65698 9.99023C6.20898 9.99023 6.65698 10.4382 6.65698 10.9902C6.65698 11.5422 6.20948 11.9902 5.65698 11.9902Z"
      fill="#264150"
    />
    <Path
      d="M9.30249 0.5C7.09349 0.5 5.30249 2.291 5.30249 4.5C5.30249 6.709 7.09349 8.5 9.30249 8.5C11.5115 8.5 13.3025 6.709 13.3025 4.5C13.3025 2.291 11.5115 0.5 9.30249 0.5ZM9.30249 7.5C7.64799 7.5 6.30249 6.1545 6.30249 4.5C6.30249 2.8455 7.64799 1.5 9.30249 1.5C10.957 1.5 12.3025 2.8455 12.3025 4.5C12.3025 6.1545 10.957 7.5 9.30249 7.5Z"
      fill="#264150"
    />
    <Path
      d="M9.59448 16C10.1468 16 10.5945 15.5523 10.5945 15C10.5945 14.4477 10.1468 14 9.59448 14C9.0422 14 8.59448 14.4477 8.59448 15C8.59448 15.5523 9.0422 16 9.59448 16Z"
      fill="#264150"
    />
    <Path
      d="M7.30249 4.5H8.30249C8.30249 3.9485 8.75099 3.5 9.30249 3.5V2.5C8.19799 2.5 7.30249 3.3955 7.30249 4.5Z"
      fill="#264150"
    />
  </Svg>
);

const getIcon = (type: MetricType) => {
  switch (type) {
    case 'steps':
      return <StepsIcon />;
    case 'heartRate':
      return <HeartRateIcon />;
    case 'spo2':
      return <SpO2Icon />;
  }
};

const getLabel = (type: MetricType) => {
  switch (type) {
    case 'steps':
      return 'Steps';
    case 'heartRate':
      return 'Heart Rate';
    case 'spo2':
      return 'SpO2';
  }
};

export const SmallHealthMetricBox: React.FC<SmallHealthMetricBoxProps> = ({
  type,
  value,
  unit,
}) => {
  return (
    <View style={styles.container}>
      {/* Icon */}
      <View style={styles.iconContainer}>
        {getIcon(type)}
      </View>

      {/* Label */}
      <Text style={styles.label}>{getLabel(type)}</Text>

      {/* Value */}
      <View style={styles.valueContainer}>
        <Text style={[styles.value, type === 'heartRate' && styles.heartRateValue]}>
          {value}
          {unit && <Text style={styles.unit}> {unit}</Text>}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(90),
    height: scale(86),
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: '#E7E7E7',
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(188, 188, 188, 0.20)',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 1,
    shadowRadius: scale(4),
    elevation: 2,
    paddingTop: scale(15),
    paddingLeft: scale(15),
    paddingBottom: scale(15),
  },
  iconContainer: {
    marginBottom: scale(5),
  },
  label: {
    color: '#264150',
    fontFamily: 'SF Pro Text',
    fontSize: scale(12),
    fontWeight: '500',
    letterSpacing: -0.2,
    textTransform: 'capitalize',
    marginBottom: scale(4),
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    color: '#000000',
    fontFamily: 'SF Pro Text',
    fontSize: scale(15),
    fontWeight: '700',
    lineHeight: scale(20),
  },
  heartRateValue: {
    fontFamily: 'Inter',
  },
  unit: {
    color: 'rgba(159, 158, 158, 0.93)',
    fontFamily: 'Inter',
    fontSize: scale(10),
    fontWeight: '400',
    lineHeight: scale(20),
  },
});
