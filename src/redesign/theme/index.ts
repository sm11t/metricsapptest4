// Unified Theme Export
export { colors } from './colors';
export { typography } from './typography';
export { spacing, layout } from './spacing';

// Combined theme object
import { colors } from './colors';
import { typography } from './typography';
import { spacing, layout } from './spacing';

export const theme = {
  colors,
  typography,
  spacing,
  layout,
} as const;

export type Theme = typeof theme;
