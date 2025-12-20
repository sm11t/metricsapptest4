import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 375; // Figma design width

/**
 * Scale a value from Figma design width to actual screen width
 * @param size - Size in pixels from Figma (based on 375px width)
 * @returns Scaled size for current screen
 */
export const scale = (size: number): number => {
  return (SCREEN_WIDTH / DESIGN_WIDTH) * size;
};

/**
 * Scale only for larger screens, keeps original size for smaller screens
 * Useful for fonts and small elements that shouldn't scale down too much
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

/**
 * Get screen dimensions
 */
export const screenWidth = SCREEN_WIDTH;
export const screenHeight = Dimensions.get('window').height;

/**
 * Common breakpoints
 */
export const isSmallDevice = SCREEN_WIDTH < 375;
export const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
export const isLargeDevice = SCREEN_WIDTH >= 414;
