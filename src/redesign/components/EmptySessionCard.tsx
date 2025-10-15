import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertIcon } from '../assets/AlertIcon';

export const EmptySessionCard: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Alert Icon */}
      <AlertIcon width={24} height={24} color="#EE731B" />

      {/* Main Text */}
      <Text style={styles.mainText}>
        You don't have any upcoming sessions
      </Text>

      {/* Subtitle Text */}
      <Text style={styles.subtitleText}>
        Choose from coaches below to book a 1-on-1 session
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    padding: 20,
    gap: 10,
    // Shadow for iOS
    shadowColor: '#BCBCBC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 2,
  },
  mainText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    width: 285,
  },
  subtitleText: {
    color: '#757575',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    width: 285,
  },
});
