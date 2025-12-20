import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { WatchIcon } from '../assets/WatchIcon';

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
        <WatchIcon width={36} height={60} />
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
    width: 285,
    height: 196,
    paddingVertical: 20,
    paddingHorizontal: 15,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE0C8',
    backgroundColor: '#FFF9F5',
  },
  watchContainer: {
    alignSelf: 'center',
    marginBottom: 5,
  },
  title: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  description: {
    color: '#757575',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  button: {
    alignSelf: 'stretch',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#EE731B',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '600',
    lineHeight: 20,
    fontFamily: 'SF Pro Text',
  },
});
