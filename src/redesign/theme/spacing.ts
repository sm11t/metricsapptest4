// Design System - Spacing & Layout
// Note: Adjust these values to match exact Figma spacing

export const spacing = {
  // Base spacing unit (4px)
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,

  // Screen padding
  screenPadding: 16,

  // Section gaps
  sectionGap: 20,

  // Card padding
  cardPadding: 16,
} as const;

export const layout = {
  // Border radius
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 12,
    xl: 16,
    full: 9999,
  },

  // Header
  headerHeight: 64,

  // Icons
  iconSize: {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  },
} as const;
