import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { scale } from '../utils/scaling';
import { HamburgerIcon } from '../assets/HamburgerIcon';
import { ConversationIcon } from '../assets/ConversationIcon';
import { NotificationBellIcon } from '../assets/NotificationBellIcon';

type HeaderProps = {
  onMenuPress?: () => void;
  onConversationPress?: () => void;
  onNotificationPress?: () => void;
};

export const Header: React.FC<HeaderProps> = ({
  onMenuPress,
  onConversationPress,
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

      {/* Right - Conversation and Notification Icons */}
      <View style={styles.rightContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.iconButtonPressed,
          ]}
          onPress={onConversationPress}
        >
          <ConversationIcon width={scale(21)} height={scale(22)} />
        </Pressable>

        {/* Divider */}
        <View style={styles.divider} />

        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.iconButtonPressed,
          ]}
          onPress={onNotificationPress}
        >
          <NotificationBellIcon width={scale(18)} height={scale(22)} />
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
    paddingLeft: scale(16),
    paddingRight: scale(25.35),
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
    gap: scale(23.49),
  },
  divider: {
    width: 1,
    height: scale(26),
    backgroundColor: '#000000',
    opacity: 0.1,
  },
});
