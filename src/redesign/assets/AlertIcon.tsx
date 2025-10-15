import React from 'react';
import Svg, { G, Path, Defs, ClipPath, Rect } from 'react-native-svg';

type AlertIconProps = {
  width?: number;
  height?: number;
  color?: string;
};

export const AlertIcon: React.FC<AlertIconProps> = ({
  width = 24,
  height = 24,
  color = '#EE731B'
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_439_316)">
        <Path
          d="M12 0.75C5.787 0.75 0.75 5.787 0.75 12C0.75 18.213 5.787 23.25 12 23.25C18.213 23.25 23.25 18.213 23.25 12C23.25 5.787 18.213 0.75 12 0.75ZM12 19.5C11.1713 19.5 10.5 18.8288 10.5 18C10.5 17.1712 11.1713 16.5 12 16.5C12.8287 16.5 13.5 17.1712 13.5 18C13.5 18.8288 12.8287 19.5 12 19.5ZM13.5 13.5C13.5 14.3287 12.8287 15 12 15C11.1713 15 10.5 14.3287 10.5 13.5V6C10.5 5.17125 11.1713 4.5 12 4.5C12.8287 4.5 13.5 5.17125 13.5 6V13.5Z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_439_316">
          <Rect width="24" height="24" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
