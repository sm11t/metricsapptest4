import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ChevronLeftProps {
  width?: number;
  height?: number;
  color?: string;
}

export const ChevronLeft: React.FC<ChevronLeftProps> = ({
  width = 8,
  height = 14,
  color = '#000000'
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 8 14" fill="none">
      <Path
        d="M7 1L1 7L7 13"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
