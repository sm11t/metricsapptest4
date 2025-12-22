import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { scale } from '../utils/scaling';
import { HamburgerIcon } from '../assets/HamburgerIcon';

type HeaderProps = {
  onMenuPress?: () => void;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
};

export const Header: React.FC<HeaderProps> = ({
  onMenuPress,
  onSearchPress,
  onNotificationPress
}) => {
  return (
    <View style={styles.container}>
      {/* Left - Hamburger Menu */}
      <Pressable
        style={({ pressed }) => [
          styles.iconButton,
          pressed && styles.iconButtonPressed,
        ]}
        onPress={onMenuPress}
      >
        <HamburgerIcon width={scale(24)} height={scale(16)} />
      </Pressable>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Right - Search and Notification Icons */}
      <View style={styles.rightContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.iconButtonPressed,
          ]}
          onPress={onSearchPress}
        >
          <View style={styles.iconPlaceholder} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.iconButtonPressed,
          ]}
          onPress={onNotificationPress}
        >
          <View style={styles.iconPlaceholder} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(375),
    height: scale(60),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    paddingHorizontal: scale(16),
    paddingTop: scale(12),
    paddingBottom: scale(12),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F2F2F2',
    shadowColor: 'rgba(188, 188, 188, 0.12)',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 1,
    shadowRadius: scale(4),
    elevation: 2,
  },
  iconButton: {
    width: scale(24),
    height: scale(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonPressed: {
    opacity: 0.5,
  },
  spacer: {
    flex: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(16),
  },
  iconPlaceholder: {
    width: scale(24),
    height: scale(24),
    backgroundColor: '#E0E0E0',
    borderRadius: scale(4),
  },
});
