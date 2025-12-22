import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { WatchIcon } from '../assets/WatchIcon';
import { scale } from '../utils/scaling';

type ConnectWearableCardProps = {
  onDownloadPress?: () => void;
};

export const ConnectWearableCard: React.FC<ConnectWearableCardProps> = ({
  onDownloadPress
}) => {
  return (
    <View style={styles.container}>
      {/* Watch Icon */}
      <View style={styles.watchContainer}>
        <WatchIcon width={scale(36)} height={scale(60)} />
      </View>

      {/* Title */}
      <Text style={styles.title}>Connect your wearable</Text>

      {/* Description */}
      <Text style={styles.description}>
        Sync our app with your smartwatch to track your sessions and health.
      </Text>

      {/* Sync Button */}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={onDownloadPress}
      >
        <Text style={styles.buttonText}>Sync your Device</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(295),
    paddingVertical: scale(20),
    paddingHorizontal: scale(20),
    flexDirection: 'column',
    alignItems: 'center',
    gap: scale(10),
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: '#FFE0C8',
    backgroundColor: '#FFF9F5',
  },
  watchContainer: {
    alignSelf: 'center',
  },
  title: {
    color: '#000000',
    fontSize: scale(14),
    fontWeight: '600',
    fontFamily: 'SF Pro Text',
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  description: {
    color: '#757575',
    fontSize: scale(12),
    fontWeight: '500',
    fontFamily: 'SF Pro Text',
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  button: {
    alignSelf: 'center',
    paddingVertical: scale(10),
    paddingHorizontal: scale(15),
    backgroundColor: '#EE731B',
    borderRadius: scale(14),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(248, 102, 36, 0.15)',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 1,
    shadowRadius: scale(4),
    elevation: 2,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: scale(14.5),
    fontWeight: '600',
    lineHeight: scale(20),
    fontFamily: 'SF Pro Text',
  },
});
