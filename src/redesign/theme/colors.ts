// Design System - Colors
// Values from Figma inspection

export const colors = {
  // Primary
  primary: '#EE731B', // Orange - Book a Class button text and border
  primaryDark: '#D66417',
  primaryLight: '#FF8B3D',

  // Background
  background: '#FFFFFF',
  backgroundGray: '#FFF9F5', // Light background from Figma

  // Text
  textPrimary: '#1F2937', // Dark gray/black
  textSecondary: '#6B7280', // Medium gray
  textTertiary: '#9CA3AF', // Light gray

  // Accent Colors
  success: '#10B981', // Green - Completed
  teal: '#14B8A6', // Teal - Booked
  purple: '#7C3AED', // Purple - Links
  warning: '#F59E0B', // Amber - Warnings

  // UI Elements
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  white: '#FFFFFF',
  black: '#000000',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
} as const;

export type ColorKey = keyof typeof colors;
