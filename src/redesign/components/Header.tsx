import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, layout } from '../theme';
import { TopLogo } from '../assets/TopLogo';
import { HamburgerIcon } from '../assets/HamburgerIcon';

type HeaderProps = {
  onBookClass?: () => void;
  onMenuPress?: () => void;
};

export const Header: React.FC<HeaderProps> = ({ onBookClass, onMenuPress }) => {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <TopLogo width={36} height={22} />
      </View>

      {/* Book a Class Button */}
      <Pressable
        style={({ pressed }) => [
          styles.bookButton,
          pressed && styles.bookButtonPressed,
        ]}
        onPress={onBookClass}
      >
        <Text style={styles.bookButtonText}>Book a Class</Text>
      </Pressable>

      {/* Menu Icon */}
      <Pressable
        style={({ pressed }) => [
          styles.menuButton,
          pressed && styles.menuButtonPressed,
        ]}
        onPress={onMenuPress}
      >
        <HamburgerIcon width={26} height={16} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: layout.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  logoContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFF9F5', // Light peachy background from Figma
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFE0CB',
  },
  bookButtonPressed: {
    opacity: 0.7,
  },
  bookButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600', // iOS supports 100-900, using 600 for semibold
    lineHeight: 20,
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButtonPressed: {
    opacity: 0.5,
  },
});
