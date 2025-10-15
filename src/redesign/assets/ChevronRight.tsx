import React from 'react';
import Svg, { Path } from 'react-native-svg';

type ChevronRightProps = {
  width?: number;
  height?: number;
  color?: string;
};

export const ChevronRight: React.FC<ChevronRightProps> = ({
  width = 6,
  height = 10,
  color = '#7D4AC3'
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 6 10" fill="none">
      <Path
        d="M1 1L5 5L1 9"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
