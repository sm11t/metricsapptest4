import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Svg, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

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

const HRVIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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
  <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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
  <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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
    <Path
      d="M10.4983 2.98926C10.8412 3.07742 11.1595 3.24245 11.4292 3.47186C11.6988 3.70126 11.9127 3.98902 12.0547 4.31334C12.1967 4.63765 12.263 4.99003 12.2486 5.34377C12.2343 5.69752 12.1396 6.04335 11.9718 6.35509"
      stroke="#264150"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10.5 10.5005C11.0136 10.5005 11.5129 10.331 11.9204 10.0183C12.3279 9.7056 12.6208 9.2672 12.7537 8.77107C12.8867 8.27494 12.8522 7.74882 12.6556 7.27428C12.4591 6.79975 12.1115 6.40332 11.6667 6.14648"
      stroke="#264150"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.6475 10.1982C11.6883 10.5145 11.6639 10.8359 11.5758 11.1424C11.4876 11.4489 11.3375 11.7341 11.1348 11.9803C10.9321 12.2265 10.6811 12.4286 10.3972 12.574C10.1134 12.7194 9.80274 12.8051 9.48447 12.8258C9.1662 12.8464 8.84708 12.8016 8.54681 12.6941C8.24655 12.5866 7.97151 12.4187 7.73868 12.2007C7.50585 11.9827 7.32019 11.7193 7.19314 11.4268C7.0661 11.1342 7.00038 10.8188 7.00004 10.4998C6.9997 10.8188 6.93398 11.1342 6.80694 11.4268C6.67989 11.7193 6.49423 11.9827 6.2614 12.2007C6.02857 12.4187 5.75353 12.5866 5.45327 12.6941C5.153 12.8016 4.83388 12.8464 4.51561 12.8258C4.19734 12.8051 3.88669 12.7194 3.60283 12.574C3.31898 12.4286 3.06795 12.2265 2.86525 11.9803C2.66255 11.7341 2.51248 11.4489 2.42431 11.1424C2.33614 10.8359 2.31174 10.5145 2.35262 10.1982"
      stroke="#264150"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3.49998 10.5005C2.98635 10.5005 2.48708 10.331 2.0796 10.0183C1.67212 9.7056 1.3792 9.2672 1.24626 8.77107C1.11332 8.27494 1.1478 7.74882 1.34434 7.27428C1.54088 6.79975 1.88851 6.40332 2.33331 6.14648"
      stroke="#264150"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3.50179 2.98926C3.15891 3.07742 2.84058 3.24245 2.57093 3.47186C2.30127 3.70126 2.08735 3.98902 1.94537 4.31334C1.80339 4.63765 1.73707 4.99003 1.75143 5.34377C1.7658 5.69752 1.86048 6.04335 2.02829 6.35509"
      stroke="#264150"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const SleepIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <Path
      d="M12.2413 7.28357C12.1866 8.29632 11.8397 9.27156 11.2426 10.0914C10.6455 10.9112 9.82375 11.5405 8.87662 11.9033C7.92948 12.266 6.89754 12.3467 5.90555 12.1355C4.91357 11.9242 4.00399 11.4302 3.28679 10.7131C2.56958 9.99595 2.07545 9.08643 1.86413 8.09446C1.6528 7.1025 1.73333 6.07056 2.09598 5.12338C2.45863 4.1762 3.08787 3.35435 3.90764 2.75716C4.72741 2.15997 5.70261 1.81301 6.71535 1.75824C6.9516 1.7454 7.07527 2.02657 6.94985 2.22665C6.53037 2.89781 6.35075 3.69133 6.44031 4.47771C6.52987 5.26409 6.88331 5.9969 7.44296 6.55655C8.00261 7.1162 8.73542 7.46964 9.5218 7.5592C10.3082 7.64875 11.1017 7.46913 11.7729 7.04965C11.9735 6.92424 12.2541 7.04732 12.2413 7.28357Z"
      stroke="#264150"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

interface CaloriesGraphProps {
  data: number[];
}

const CaloriesGraph: React.FC<CaloriesGraphProps> = ({ data }) => {
  const width = 116;
  const height = 49;
  const points = data.length;

  // Find max value for scaling
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue;

  // Generate path data
  const pathPoints = data.map((value, index) => {
    const x = (index / (points - 1)) * width;
    const y = height - ((value - minValue) / range) * height;
    return { x, y };
  });

  // Create SVG path for area chart
  const linePath = pathPoints.map((point, index) =>
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Defs>
        <LinearGradient id="caloriesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#DDBAF0" stopOpacity="1" />
          <Stop offset="100%" stopColor="#FCFCFC" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Path
        d={areaPath}
        fill="url(#caloriesGradient)"
        stroke="#A176FF"
        strokeWidth="0.84"
      />
    </Svg>
  );
};

interface HRVBarChartProps {
  data: { min: number; max: number }[];
}

const HRVBarChart: React.FC<HRVBarChartProps> = ({ data }) => {
  const width = 95.85;
  const height = 70.7;
  const barCount = data.length;
  const barWidth = 3.93;
  const gap = (width - barWidth * barCount) / (barCount - 1);

  // Find overall max for scaling
  const maxValue = Math.max(...data.map(d => d.max));

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Defs>
        <LinearGradient id="hrvGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#EE731B" stopOpacity="1" />
          <Stop offset="100%" stopColor="#FFC195" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      {data.map((bar, index) => {
        const x = index * (barWidth + gap);
        const minHeight = (bar.min / maxValue) * height;
        const maxHeight = (bar.max / maxValue) * height;
        const barHeight = maxHeight - minHeight;
        const y = height - maxHeight;

        return (
          <Path
            key={index}
            d={`M ${x} ${y} L ${x} ${y + barHeight} L ${x + barWidth} ${y + barHeight} L ${x + barWidth} ${y} Z`}
            fill="url(#hrvGradient)"
            stroke="#EE731B"
            strokeWidth="0.98"
          />
        );
      })}
    </Svg>
  );
};

const RHRBarChart: React.FC<HRVBarChartProps> = ({ data }) => {
  const width = 95.85;
  const height = 70.7;
  const barCount = data.length;
  const barWidth = 3.93;
  const gap = (width - barWidth * barCount) / (barCount - 1);

  // Find overall max for scaling
  const maxValue = Math.max(...data.map(d => d.max));

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Defs>
        <LinearGradient id="rhrGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#FF7E9F" stopOpacity="1" />
          <Stop offset="100%" stopColor="#FFC4D4" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      {data.map((bar, index) => {
        const x = index * (barWidth + gap);
        const minHeight = (bar.min / maxValue) * height;
        const maxHeight = (bar.max / maxValue) * height;
        const barHeight = maxHeight - minHeight;
        const y = height - maxHeight;

        return (
          <Path
            key={index}
            d={`M ${x} ${y} L ${x} ${y + barHeight} L ${x + barWidth} ${y + barHeight} L ${x + barWidth} ${y} Z`}
            fill="url(#rhrGradient)"
            stroke="#FF7E9F"
            strokeWidth="0.98"
          />
        );
      })}
    </Svg>
  );
};

interface StressBarChartProps {
  data: number[];
}

const StressBarChart: React.FC<StressBarChartProps> = ({ data }) => {
  const width = 95.85;
  const height = 70.7;
  const barCount = data.length;
  const barWidth = 3.93;
  const gap = (width - barWidth * barCount) / (barCount - 1);

  // Find max value for scaling
  const maxValue = Math.max(...data);

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Defs>
        <LinearGradient id="stressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#8B7FFF" stopOpacity="1" />
          <Stop offset="100%" stopColor="#C4BFFF" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      {data.map((value, index) => {
        const x = index * (barWidth + gap);
        const barHeight = (value / maxValue) * height;
        const y = height - barHeight;

        return (
          <Path
            key={index}
            d={`M ${x} ${y} L ${x} ${height} L ${x + barWidth} ${height} L ${x + barWidth} ${y} Z`}
            fill="url(#stressGradient)"
            stroke="#8B7FFF"
            strokeWidth="0.98"
          />
        );
      })}
    </Svg>
  );
};

interface SleepTimelineProps {
  timeline: { percent: number; label: string; color: string }[];
}

const SleepTimeline: React.FC<SleepTimelineProps> = ({ timeline }) => {
  const width = 95.85;
  const height = 70.7;
  const barHeight = 12;
  const barY = (height - barHeight) / 2;

  // Color mapping
  const colorMap: { [key: string]: string } = {
    blue: '#7FB5FF',
    orange: '#FFB27F',
    purple: '#C4BFFF',
  };

  let currentX = 0;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {timeline.map((segment, index) => {
        const segmentWidth = (segment.percent / 100) * width;
        const x = currentX;
        currentX += segmentWidth;

        return (
          <Path
            key={index}
            d={`M ${x} ${barY} L ${x} ${barY + barHeight} L ${x + segmentWidth} ${barY + barHeight} L ${x + segmentWidth} ${barY} Z`}
            fill={colorMap[segment.color] || '#CCCCCC'}
            stroke="none"
          />
        );
      })}
    </Svg>
  );
};

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

            {/* Value and Status */}
            <View style={styles.caloriesValueRow}>
              <View style={styles.caloriesValueContainer}>
                <Text style={styles.caloriesValue}>1123</Text>
                <Text style={styles.caloriesUnit}>kcal</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>GOOD</Text>
              </View>
            </View>

            {/* Graph */}
            <View style={styles.graphContainer}>
              <CaloriesGraph data={[34, 28, 36, 24, 18, 25, 27, 22, 30, 26]} />
            </View>
          </View>

          {/* HRV and RHR Row */}
          <View style={styles.row}>
            {/* HRV Box */}
            <View style={styles.smallBox}>
              <View style={styles.metricHeader}>
                <HRVIcon />
                <Text style={styles.metricLabel}>HRV</Text>
              </View>

              <View style={styles.metricValueRow}>
                <Text style={styles.metricValue}>31</Text>
                <Text style={styles.metricUnit}>ms</Text>
              </View>

              <View style={[styles.statusBadge, styles.statusBadgeLow]}>
                <Text style={[styles.statusText, styles.statusTextLow]}>LOW</Text>
              </View>

              <View style={styles.graphFrame}>
                <HRVBarChart
                  data={[
                    { min: 18, max: 26 },
                    { min: 16, max: 22 },
                    { min: 14, max: 20 }
                  ]}
                />
              </View>
            </View>

            {/* RHR Box */}
            <View style={styles.smallBox}>
              <View style={styles.metricHeader}>
                <RHRIcon />
                <Text style={styles.metricLabel}>RHR</Text>
              </View>

              <View style={styles.metricValueRow}>
                <Text style={styles.metricValue}>72</Text>
                <Text style={styles.metricUnit}>bpm</Text>
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>GOOD</Text>
              </View>

              <View style={styles.graphFrame}>
                <RHRBarChart
                  data={[
                    { min: 18, max: 26 },
                    { min: 16, max: 22 },
                    { min: 14, max: 20 }
                  ]}
                />
              </View>
            </View>
          </View>

          {/* Stress and Sleep Row */}
          <View style={styles.row}>
            {/* Stress Box */}
            <View style={styles.smallBox}>
              <View style={styles.metricHeader}>
                <StressIcon />
                <Text style={styles.metricLabel}>STRESS</Text>
              </View>

              <View style={styles.metricValueRow}>
                <Text style={styles.metricValue}>26-50</Text>
              </View>

              <View style={[styles.statusBadge, styles.statusBadgeStress]}>
                <Text style={[styles.statusText, styles.statusTextStress]}>LOW STRESS</Text>
              </View>

              <View style={styles.graphFrame}>
                <StressBarChart data={[10, 18, 14, 12, 20, 16, 22, 18, 16, 24]} />
              </View>
            </View>

            {/* Sleep Box */}
            <View style={styles.smallBox}>
              <View style={styles.metricHeader}>
                <SleepIcon />
                <Text style={styles.metricLabel}>SLEEP</Text>
              </View>

              <View style={styles.metricValueRow}>
                <Text style={styles.metricValue}>7</Text>
                <Text style={styles.metricUnit}>hrs</Text>
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>GOOD</Text>
              </View>

              <View style={styles.graphFrame}>
                <SleepTimeline
                  timeline={[
                    { percent: 20, label: 'Light', color: 'blue' },
                    { percent: 45, label: 'Deep', color: 'orange' },
                    { percent: 35, label: 'REM', color: 'purple' }
                  ]}
                />
              </View>
            </View>
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
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    minHeight: 57,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 0,
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  caloriesBox: {
    width: 269,
    height: 74,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 10,
    overflow: 'hidden',
    position: 'relative',
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
  caloriesValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 10,
  },
  caloriesValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  caloriesValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Inter',
  },
  caloriesUnit: {
    fontSize: 9,
    fontWeight: '400',
    color: '#888888',
    fontFamily: 'SF Pro Text',
    letterSpacing: -0.2,
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#C9F1E5',
    backgroundColor: '#F3FFFB',
  },
  statusText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#04A777',
    fontFamily: 'SF Pro Text',
    textTransform: 'uppercase',
    lineHeight: 13,
  },
  graphContainer: {
    position: 'absolute',
    right: 14,
    bottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },
  smallBox: {
    width: 137,
    height: 144,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    position: 'relative',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '400',
    color: '#264150',
    fontFamily: 'SF Pro Text',
    textTransform: 'uppercase',
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Inter',
  },
  metricUnit: {
    fontSize: 9,
    fontWeight: '400',
    color: '#888888',
    fontFamily: 'SF Pro Text',
    letterSpacing: -0.2,
  },
  statusBadgeLow: {
    borderColor: '#FFEAEA',
    backgroundColor: '#FFEAEA',
    marginTop: 2,
    marginBottom: 7,
    alignSelf: 'flex-start',
  },
  statusTextLow: {
    color: '#FF3131',
  },
  statusBadgeStress: {
    borderColor: '#E0F7FA',
    backgroundColor: '#E0F7FA',
    marginTop: 2,
    marginBottom: 7,
    alignSelf: 'flex-start',
  },
  statusTextStress: {
    color: '#00ACC1',
  },
  graphFrame: {
    width: 95.85,
    height: 70.7,
    marginTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hrvGraphContainer: {
    position: 'absolute',
    bottom: 15,
    left: 15,
  },
});
