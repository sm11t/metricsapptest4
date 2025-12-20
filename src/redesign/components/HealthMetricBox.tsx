import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { scale } from '../utils/scaling';

type HealthMetricType = 'calories' | 'hrv' | 'rhr' | 'stress' | 'sleep';
type StatusType = 'good' | 'bad' | 'moderate';

interface HealthMetricBoxProps {
  type: HealthMetricType;
}

interface MetricData {
  value: string;
  unit: string;
  status: StatusType;
  statusLabel: string;
}

const CaloriesBurntIcon = () => (
  <Svg width={scale(14)} height={scale(14)} viewBox="0 0 14 14" fill="none">
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

const HRVIcon = () => (
  <Svg width={scale(14)} height={scale(14)} viewBox="0 0 14 14" fill="none">
    <Path
      d="M1.16663 5.54198C1.16664 4.89284 1.36356 4.25898 1.73137 3.72411C2.09919 3.18924 2.62059 2.77853 3.22673 2.54621C3.83287 2.31389 4.49522 2.2709 5.1263 2.42292C5.75738 2.57493 6.32751 2.91481 6.76138 3.39764C6.79193 3.43032 6.82888 3.45637 6.86992 3.47418C6.91096 3.49198 6.95522 3.50117 6.99996 3.50117C7.0447 3.50117 7.08896 3.49198 7.13 3.47418C7.17104 3.45637 7.20798 3.43032 7.23854 3.39764C7.67105 2.91167 8.2413 2.56894 8.87341 2.41508C9.50552 2.26121 10.1695 2.30351 10.777 2.53634C11.3844 2.76917 11.9066 3.18149 12.2739 3.71842C12.6413 4.25535 12.8364 4.89142 12.8333 5.54198C12.8333 6.87781 11.9583 7.87531 11.0833 8.75031L7.87963 11.8496C7.77093 11.9744 7.63692 12.0747 7.48649 12.1437C7.33605 12.2128 7.17265 12.2491 7.00713 12.2501C6.84161 12.2512 6.67775 12.217 6.52646 12.1498C6.37517 12.0827 6.23989 11.9841 6.12963 11.8606L2.91663 8.75031C2.04163 7.87531 1.16663 6.88364 1.16663 5.54198Z"
      stroke="#264150"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.25 7L5.54167 6.5L6.70833 8.75L7.875 5.25L8.75 7"
      stroke="#264150"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const RHRIcon = () => (
  <Svg width={scale(14)} height={scale(14)} viewBox="0 0 14 14" fill="none">
    <Path
      d="M2.19507 4.97473C2.19508 4.44003 2.35728 3.91791 2.66026 3.47733C2.96323 3.03675 3.39272 2.69844 3.892 2.50707C4.39129 2.31571 4.93687 2.2803 5.4567 2.40552C5.97654 2.53074 6.44616 2.81069 6.80354 3.20841C6.82871 3.23533 6.85914 3.25678 6.89295 3.27145C6.92675 3.28612 6.96321 3.29369 7.00006 3.29369C7.03691 3.29369 7.07337 3.28612 7.10718 3.27145C7.14098 3.25678 7.17142 3.23533 7.19659 3.20841C7.55285 2.80811 8.02258 2.5258 8.54325 2.39906C9.06393 2.27232 9.61085 2.30716 10.1112 2.49895C10.6116 2.69073 11.0417 3.03036 11.3443 3.47264C11.6469 3.91491 11.8076 4.43886 11.8051 4.97473C11.8051 6.07507 11.0843 6.89673 10.3636 7.61747L7.72466 10.1704C7.63512 10.2732 7.52473 10.3558 7.40082 10.4127C7.27691 10.4696 7.14231 10.4994 7.00597 10.5003C6.86962 10.5012 6.73466 10.473 6.61004 10.4177C6.48541 10.3624 6.37399 10.2812 6.28316 10.1795L3.63657 7.61747C2.91582 6.89673 2.19507 6.07988 2.19507 4.97473Z"
      stroke="#264150"
      strokeWidth="1.36"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M1.84663 12.153L12.1533 12.153"
      stroke="#264150"
      strokeWidth="1.36"
      strokeLinecap="round"
    />
  </Svg>
);

const StressIcon = () => (
  <Svg width={scale(14)} height={scale(14)} viewBox="0 0 14 14" fill="none">
    <Path
      d="M7 10.5003V2.91699"
      stroke="#264150"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.75 7.58333C8.2453 7.4358 7.80199 7.1287 7.4865 6.70804C7.17101 6.28738 7.00032 5.77582 7 5.25C6.99968 5.77582 6.82899 6.28738 6.5135 6.70804C6.19801 7.1287 5.7547 7.4358 5.25 7.58333"
      stroke="#264150"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10.2655 3.79207C10.3997 3.5596 10.4787 3.29938 10.4962 3.03152C10.5138 2.76366 10.4695 2.49534 10.3668 2.24734C10.2641 1.99934 10.1057 1.77829 9.90387 1.60129C9.70206 1.4243 9.46223 1.2961 9.20294 1.22662C8.94365 1.15715 8.67185 1.14825 8.40858 1.20062C8.1453 1.25299 7.8976 1.36523 7.68464 1.52865C7.47168 1.69206 7.29917 1.90228 7.18045 2.14304C7.06173 2.38379 6.99999 2.64863 7 2.91707C7.00001 2.64863 6.93827 2.38379 6.81955 2.14304C6.70083 1.90228 6.52832 1.69206 6.31536 1.52865C6.1024 1.36523 5.8547 1.25299 5.59142 1.20062C5.32815 1.14825 5.05635 1.15715 4.79706 1.22662C4.53777 1.2961 4.29794 1.4243 4.09612 1.60129C3.89431 1.77829 3.73591 1.99934 3.63319 2.24734C3.53047 2.49534 3.48618 2.76366 3.50375 3.03152C3.52132 3.29938 3.60027 3.5596 3.7345 3.79207"
      stroke="#264150"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const SleepIcon = () => (
  <Svg width={scale(14)} height={scale(14)} viewBox="0 0 14 14" fill="none">
    <Path
      d="M12.8334 7.58366C12.6876 8.82574 12.1246 9.97927 11.2444 10.8594C10.3641 11.7396 9.21062 12.3024 7.96854 12.4482C6.72646 12.594 5.47125 12.3148 4.40447 11.6563C3.33769 10.9978 2.51803 10.0 2.07656 8.82139C1.63509 7.64278 1.59621 6.35084 1.96611 5.14836C2.336 3.94588 3.09566 2.90182 4.11763 2.17736C5.13961 1.4529 6.36817 1.08675 7.61436 1.13681C8.86056 1.18686 10.0571 1.65024 11.0167 2.45449C10.3782 2.68255 9.80832 3.06574 9.35619 3.56914C8.90407 4.07253 8.58363 4.68043 8.4256 5.33738C8.26757 5.99433 8.27716 6.68072 8.45334 7.33288C8.62952 7.98505 8.96663 8.58256 9.43303 9.07247C9.89942 9.56238 10.4809 9.93052 11.126 10.1442C11.7711 10.3579 12.4607 10.4112 13.132 10.2991C12.9758 10.7642 12.7266 11.1948 12.3993 11.5659C12.0721 11.9371 11.6735 12.2413 11.2263 12.4608C10.7792 12.6804 10.2925 12.8108 9.79457 12.8444C9.29661 12.8779 8.79658 12.814 8.32337 12.6563"
      stroke="#264150"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const getStatusBadgeStyle = (status: StatusType) => {
  switch (status) {
    case 'good':
      return {
        borderColor: '#C9F1E5',
        backgroundColor: '#F3FFFB',
        textColor: '#04A777',
      };
    case 'bad':
      return {
        borderColor: '#FFE0C8',
        backgroundColor: '#FFF9F5',
        textColor: '#EE731B',
      };
    case 'moderate':
      return {
        borderColor: '#E0F7FA',
        backgroundColor: '#E0F7FA',
        textColor: '#00ACC1',
      };
  }
};

const getMetricInfo = (type: HealthMetricType) => {
  switch (type) {
    case 'calories':
      return {
        icon: CaloriesBurntIcon,
        label: 'Calories Burnt',
        data: { value: '1123', unit: 'kcal', status: 'good' as StatusType, statusLabel: 'GOOD' }
      };
    case 'hrv':
      return {
        icon: HRVIcon,
        label: 'Heart Rate Variability',
        data: { value: '45', unit: 'ms', status: 'good' as StatusType, statusLabel: 'GOOD' }
      };
    case 'rhr':
      return {
        icon: RHRIcon,
        label: 'Resting Heart Rate',
        data: { value: '55 - 88', unit: 'ms', status: 'good' as StatusType, statusLabel: 'GOOD' }
      };
    case 'stress':
      return {
        icon: StressIcon,
        label: 'Stress',
        data: { value: '38', unit: '%', status: 'moderate' as StatusType, statusLabel: 'MODERATE' }
      };
    case 'sleep':
      return {
        icon: SleepIcon,
        label: 'Sleep',
        data: { value: '7.5', unit: 'hrs', status: 'good' as StatusType, statusLabel: 'GOOD' }
      };
  }
};

export const HealthMetricBox: React.FC<HealthMetricBoxProps> = ({ type }) => {
  const { icon: Icon, label, data } = getMetricInfo(type);
  const badgeStyle = getStatusBadgeStyle(data.status);

  // Y-axis labels based on metric type
  const getYAxisLabels = () => {
    switch (type) {
      case 'calories':
        return ['1.4k', '1.2k', '1k', '800', '600', '400', '200', '0'];
      case 'hrv':
      case 'rhr':
      case 'stress':
        return ['100', '80', '60', '40', '20', '0'];
      case 'sleep':
        return ['8', '7', '6', '5', '4', '3', '2', '0'];
      default:
        return ['100', '80', '60', '40', '20', '0'];
    }
  };

  const yAxisLabels = getYAxisLabels();

  // X-axis labels for all graphs
  const xAxisLabels = [
    { time: '12', period: 'AM' },
    { time: '3', period: 'AM' },
    { time: '6', period: 'AM' },
    { time: '9', period: 'AM' },
    { time: '12', period: 'PM' },
    { time: '3', period: 'PM' },
    { time: '6', period: 'PM' },
    { time: '9', period: 'PM' },
    { time: '12', period: 'AM' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon />
        <Text style={styles.label}>{label}</Text>
      </View>

      {/* Value and Unit */}
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{data.value}</Text>
        <Text style={styles.unit}> {data.unit}</Text>
      </View>

      {/* Status Badge */}
      <View
        style={[
          styles.statusBadge,
          {
            borderColor: badgeStyle.borderColor,
            backgroundColor: badgeStyle.backgroundColor,
          },
        ]}
      >
        <Text style={[styles.statusText, { color: badgeStyle.textColor }]}>
          {data.statusLabel}
        </Text>
      </View>

      {/* Graph for Calories */}
      {type === 'calories' && (
        <View style={styles.graphContainer}>
          {/* Y-axis and Graph Area */}
          <View style={styles.graphRow}>
            {/* Y-axis */}
            <View style={styles.yAxis}>
              {yAxisLabels.map((label, index) => (
                <Text key={index} style={styles.yAxisLabel}>
                  {label}
                </Text>
              ))}
            </View>

            {/* Graph placeholder */}
            <View style={styles.graphArea}>
              {/* Graph will be added here */}
            </View>
          </View>

          {/* X-axis */}
          <View style={styles.xAxisContainer}>
            <View style={styles.xAxis}>
              {xAxisLabels.map((label, index) => (
                <View key={index} style={styles.xAxisLabelContainer}>
                  <Text style={styles.xAxisLabel}>{label.time}</Text>
                  <Text style={styles.xAxisLabel}>{label.period}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Graph for HRV */}
      {type === 'hrv' && (
        <View style={styles.graphContainer}>
          {/* Y-axis and Graph Area */}
          <View style={styles.graphRow}>
            {/* Y-axis */}
            <View style={styles.yAxis}>
              {yAxisLabels.map((label, index) => (
                <Text key={index} style={styles.yAxisLabel}>
                  {label}
                </Text>
              ))}
            </View>

            {/* Graph placeholder */}
            <View style={styles.graphArea}>
              {/* Bar chart will be added here */}
            </View>
          </View>

          {/* X-axis */}
          <View style={styles.xAxisContainer}>
            <View style={styles.xAxis}>
              {xAxisLabels.map((label, index) => (
                <View key={index} style={styles.xAxisLabelContainer}>
                  <Text style={styles.xAxisLabel}>{label.time}</Text>
                  <Text style={styles.xAxisLabel}>{label.period}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Graph for RHR */}
      {type === 'rhr' && (
        <View style={styles.graphContainer}>
          {/* Y-axis and Graph Area */}
          <View style={styles.graphRow}>
            {/* Y-axis */}
            <View style={styles.yAxis}>
              {yAxisLabels.map((label, index) => (
                <Text key={index} style={styles.yAxisLabel}>
                  {label}
                </Text>
              ))}
            </View>

            {/* Graph placeholder */}
            <View style={styles.graphArea}>
              {/* Bar chart will be added here */}
            </View>
          </View>

          {/* X-axis */}
          <View style={styles.xAxisContainer}>
            <View style={styles.xAxis}>
              {xAxisLabels.map((label, index) => (
                <View key={index} style={styles.xAxisLabelContainer}>
                  <Text style={styles.xAxisLabel}>{label.time}</Text>
                  <Text style={styles.xAxisLabel}>{label.period}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Graph for Stress */}
      {type === 'stress' && (
        <View style={styles.graphContainer}>
          {/* Y-axis and Graph Area */}
          <View style={styles.graphRow}>
            {/* Y-axis */}
            <View style={styles.yAxis}>
              {yAxisLabels.map((label, index) => (
                <Text key={index} style={styles.yAxisLabel}>
                  {label}
                </Text>
              ))}
            </View>

            {/* Graph placeholder */}
            <View style={styles.graphArea}>
              {/* Bar chart will be added here */}
            </View>
          </View>

          {/* X-axis */}
          <View style={styles.xAxisContainer}>
            <View style={styles.xAxis}>
              {xAxisLabels.map((label, index) => (
                <View key={index} style={styles.xAxisLabelContainer}>
                  <Text style={styles.xAxisLabel}>{label.time}</Text>
                  <Text style={styles.xAxisLabel}>{label.period}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Graph for Sleep */}
      {type === 'sleep' && (
        <View style={styles.graphContainer}>
          {/* Y-axis and Graph Area */}
          <View style={styles.graphRow}>
            {/* Y-axis */}
            <View style={styles.yAxis}>
              {yAxisLabels.map((label, index) => (
                <Text key={index} style={styles.yAxisLabel}>
                  {label}
                </Text>
              ))}
            </View>

            {/* Graph placeholder */}
            <View style={styles.graphArea}>
              {/* Timeline chart will be added here */}
            </View>
          </View>

          {/* X-axis */}
          <View style={styles.xAxisContainer}>
            <View style={styles.xAxis}>
              {xAxisLabels.map((label, index) => (
                <View key={index} style={styles.xAxisLabelContainer}>
                  <Text style={styles.xAxisLabel}>{label.time}</Text>
                  <Text style={styles.xAxisLabel}>{label.period}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(285),
    backgroundColor: '#FFFFFF',
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: '#E7E7E7',
    paddingTop: scale(15),
    paddingBottom: scale(15),
    paddingLeft: scale(15),
    paddingRight: scale(15),
    minHeight: scale(80),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  label: {
    fontSize: scale(12),
    fontWeight: '500',
    color: '#264150',
    fontFamily: 'SF Pro Text',
    textTransform: 'uppercase',
    letterSpacing: -0.2,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(6),
  },
  value: {
    fontSize: scale(15),
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Inter',
    lineHeight: scale(20),
  },
  unit: {
    fontSize: scale(14),
    fontWeight: '400',
    color: '#888888',
    fontFamily: 'Inter',
    lineHeight: scale(20),
  },
  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: scale(5),
    paddingVertical: scale(2),
    paddingHorizontal: scale(6),
    borderRadius: scale(7),
    borderWidth: 1,
  },
  statusText: {
    fontSize: scale(10),
    fontWeight: '600',
    fontFamily: 'Inter',
    textTransform: 'uppercase',
  },
  graphContainer: {
    marginTop: scale(10),
  },
  graphRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  yAxis: {
    width: scale(21),
    height: scale(147),
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  yAxisLabel: {
    fontSize: scale(9.5),
    fontWeight: '500',
    fontFamily: 'SF Pro Text',
    color: '#ACACAC',
  },
  graphArea: {
    flex: 1,
    height: scale(147),
    marginLeft: scale(6),
  },
  xAxisContainer: {
    marginTop: scale(4),
    marginLeft: scale(21 + 6), // Align with graph area (y-axis width + gap)
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  xAxisLabelContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 0,
  },
  xAxisLabel: {
    fontSize: scale(9.5),
    fontWeight: '500',
    fontFamily: 'SF Pro Text',
    color: '#ACACAC',
    textAlign: 'center',
    lineHeight: scale(9.5),
  },
});
