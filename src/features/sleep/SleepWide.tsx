import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';

type Source = 'watch' | 'phoneSchedule' | 'thirdParty' | 'none';
type SleepStage = 'DEEP' | 'CORE' | 'REM' | 'AWAKE';

type Segment = {
  /** minutes from 11:00 PM */
  startMin: number;
  /** minutes from 11:00 PM */
  endMin: number;
  stage: SleepStage;
};

type Props = {
  width: number;
  height: number;
  onPress?: () => void;

  // (optional real data; ignored for this sample demo)
  bedtime?: string;
  wakeTime?: string;
  inBedMins?: number;
  asleepMins?: number;
  source?: Source;

  /** optional override of sample segments */
  segments?: Segment[];
};

/* ----------------------- SAMPLE DATA (11pm → 8am) ----------------------- */

const WINDOW_START = 0;           // 11:00 PM
const WINDOW_END = 9 * 60;        // 8:00 AM (540 mins)
const STAGES: SleepStage[] = ['DEEP', 'CORE', 'REM', 'AWAKE'];

const SAMPLE_SEGMENTS: Segment[] = [
  // before midnight
  { startMin: 10,  endMin: 35,  stage: 'AWAKE' },
  { startMin: 36,  endMin: 70,  stage: 'DEEP'  },
  { startMin: 70,  endMin: 95,  stage: 'DEEP'  },
  { startMin: 95,  endMin: 130, stage: 'CORE'  },
  // around 1–3am
  { startMin: 135, endMin: 155, stage: 'REM'   },
  { startMin: 155, endMin: 200, stage: 'CORE'  },
  { startMin: 205, endMin: 225, stage: 'REM'   },
  { startMin: 225, endMin: 270, stage: 'CORE'  },
  // brief awake spike ~5am
  { startMin: 360, endMin: 366, stage: 'AWAKE' },
  { startMin: 366, endMin: 420, stage: 'CORE'  },
  { startMin: 420, endMin: 450, stage: 'REM'   },
  { startMin: 450, endMin: 495, stage: 'CORE'  },
  // wind-down to 8am
  { startMin: 500, endMin: 520, stage: 'CORE'  },
];

/* ---------------------------- VISUAL CONSTANTS --------------------------- */

const COLORS: Record<SleepStage, string> = {
  DEEP:  '#4338ca',   // indigo-700
  CORE:  '#2563eb',   // blue-600
  REM:   '#38bdf8',   // sky-400
  AWAKE: '#ef4444',   // red-500
};

export default function SleepWide({
  width,
  height,
  onPress,
  segments,
}: Props) {
  const Card = onPress ? Pressable : View;

  // Layout
  const PAD = 16;
  const chartW = width - PAD * 2;
  const chartH = Math.min(130, height - 68); // leave room for titles
  const lanes = STAGES.length;
  const laneGap = 8;
  const laneH = (chartH - laneGap * (lanes - 1)) / lanes;

  // Scale helpers (11pm → 8am)
  const domain = WINDOW_END - WINDOW_START;
  const x = (min: number) => (min - WINDOW_START) / domain * chartW;

  // Ticks at 11 PM, 2 AM, 5 AM, 8 AM
  const tickMins = [0, 180, 360, 540];
  const tickLabels = ['11 PM', '2 AM', '5 AM', '8 AM'];

  const segs = segments ?? SAMPLE_SEGMENTS;

  return (
    <Card style={[styles.box, { width, height }]} onPress={onPress} disabled={!onPress}>
      <Text style={styles.title}>Sleep</Text>
      <Text style={styles.subtitle}>Last night</Text>

      <View style={{ height: chartH, marginTop: 10 }}>
        <Svg width={chartW} height={chartH}>
          {/* horizontal lane guides + labels */}
          {STAGES.map((stg, i) => {
            const y = i * (laneH + laneGap) + laneH; // bottom of lane
            const yMid = y - laneH / 2;
            return (
              <React.Fragment key={stg}>
                <Line x1={0} y1={y} x2={chartW} y2={y} stroke="#ffffff16" strokeWidth={1} />
                <SvgText
                  x={0}
                  y={yMid - 6}
                  fill="#94a3b8"
                  fontSize="11"
                >
                  {labelFor(stg)}
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* vertical time grid */}
          {tickMins.map((m, i) => (
            <React.Fragment key={m}>
              <Line
                x1={x(m)} y1={0}
                x2={x(m)} y2={chartH}
                stroke="#ffffff10"
                strokeDasharray="4 6"
                strokeWidth={1}
              />
              <SvgText x={x(m) + 4} y={chartH - 6} fill="#9ca3af" fontSize="10">
                {tickLabels[i]}
              </SvgText>
            </React.Fragment>
          ))}

          {/* stage rectangles */}
          {segs.map((s, idx) => {
            const laneIndex = STAGES.indexOf(s.stage);
            if (laneIndex < 0) return null;
            const yTop = laneIndex * (laneH + laneGap);
            const w = Math.max(1, x(s.endMin) - x(s.startMin));
            return (
              <Rect
                key={idx}
                x={x(s.startMin)}
                y={yTop + laneH * 0.12}
                width={w}
                height={laneH * 0.76}
                rx={6}
                fill={COLORS[s.stage]}
                opacity={s.stage === 'AWAKE' ? 0.8 : 0.7}
              />
            );
          })}
        </Svg>
      </View>
    </Card>
  );
}

function labelFor(s: SleepStage) {
  switch (s) {
    case 'DEEP':  return 'Deep';
    case 'CORE':  return 'Core';
    case 'REM':   return 'REM';
    case 'AWAKE': return 'Awake';
  }
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#121212',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 16,
    overflow: 'hidden',
  },
  title:    { color: '#9ca3af', fontSize: 12, fontWeight: '600' },
  subtitle: { color: '#9ca3af', marginTop: 2 },
});
