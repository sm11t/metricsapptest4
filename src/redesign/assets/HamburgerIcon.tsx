import React from 'react';
import Svg, { Rect } from 'react-native-svg';

type HamburgerIconProps = {
  width?: number;
  height?: number;
  color?: string;
};

export const HamburgerIcon: React.FC<HamburgerIconProps> = ({
  width = 26,
  height = 16,
  color = '#000000'
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 26 16" fill="none">
      <Rect width="26" height="2" rx="1" fill={color} />
      <Rect y="7" width="26" height="2" rx="1" fill={color} />
      <Rect y="14" width="26" height="2" rx="1" fill={color} />
    </Svg>
  );
};
