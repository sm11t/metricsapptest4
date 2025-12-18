import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Alert, View, Switch, Text } from 'react-native';
import { Header } from '../components/Header';
import { AlertBanner } from '../components/AlertBanner';
import { EmptySessionCard } from '../components/EmptySessionCard';
import { SectionHeader } from '../components/SectionHeader';
import { ActivityCard } from '../components/ActivityCard';
import { ActivityDetailsScreen } from './ActivityDetailsScreen';
import { colors, spacing } from '../theme';

export const HomeScreen: React.FC = () => {
  const [isDeviceConnected, setIsDeviceConnected] = useState(false);
  const [showActivityDetails, setShowActivityDetails] = useState(false);

  const handleBookClass = () => {
    Alert.alert('Book a Class', 'Book a Class button pressed');
  };

  const handleMenuPress = () => {
    Alert.alert('Menu', 'Menu button pressed');
  };

  const handleVideoPress = () => {
    Alert.alert('Video', 'Play recording video');
  };

  const handleViewDetails = () => {
    setShowActivityDetails(true);
  };

  const handleBack = () => {
    setShowActivityDetails(false);
  };

  if (showActivityDetails) {
    return (
      <ActivityDetailsScreen
        isDeviceConnected={isDeviceConnected}
        onBack={handleBack}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header onBookClass={handleBookClass} onMenuPress={handleMenuPress} />
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <AlertBanner onPress={handleVideoPress} />
        <EmptySessionCard />

        {/* Temporary Device Connection Toggle */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Device Connected (Debug)</Text>
          <Switch
            value={isDeviceConnected}
            onValueChange={setIsDeviceConnected}
            trackColor={{ false: '#D3D3D3', true: '#EE731B' }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* My Activity Section */}
        <SectionHeader
          title="My Activity"
          linkText="View details"
          onLinkPress={handleViewDetails}
        />

        {/* Activity Calendar */}
        <View style={styles.activityCardContainer}>
          <ActivityCard isDeviceConnected={isDeviceConnected} />
        </View>

        {/* Other components will go here */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.screenPadding,
    gap: spacing.base,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  activityCardContainer: {
    alignItems: 'center',
  },
});
