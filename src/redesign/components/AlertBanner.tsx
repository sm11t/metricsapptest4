import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { colors, spacing } from '../theme';
import { PlayIcon } from '../assets/PlayIcon';

type AlertBannerProps = {
  onPress?: () => void;
};

export const AlertBanner: React.FC<AlertBannerProps> = ({ onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
      onPress={onPress}
    >
      {/* "New" Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>New</Text>
      </View>

      {/* Alert Text */}
      <Text style={styles.messageText}>
        You have a new recording of you last session available to watch
      </Text>

      {/* Video Thumbnail */}
      <View style={styles.videoContainer}>
        <Image
          source={require('../assets/your_video.png')}
          style={styles.videoThumbnail}
          resizeMode="cover"
        />
        {/* Play Button Overlay */}
        <View style={styles.playButtonContainer}>
          <View style={styles.playButton}>
            <PlayIcon width={31.73} height={31.73} color="#FFFFFF" />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    backgroundColor: '#FFFFFF',
    padding: 10,
    // Shadow for iOS
    shadowColor: '#BCBCBC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 2,
  },
  containerPressed: {
    opacity: 0.9,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#04A777',
    borderRadius: 16,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  messageText: {
    color: '#757575',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
    marginBottom: 10,
  },
  videoContainer: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  playButtonContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 39.661,
    height: 39.661,
    borderRadius: 31.729, // Makes it circular
    backgroundColor: '#F86624',
    borderWidth: 1,
    borderColor: 'rgba(248, 102, 36, 0.15)', // #F86624 with 15% opacity
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow from Figma
    shadowColor: 'rgba(248, 102, 36, 0.30)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
});
