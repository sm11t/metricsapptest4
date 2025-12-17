import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Alert, View } from 'react-native';
import { Header } from '../components/Header';
import { AlertBanner } from '../components/AlertBanner';
import { EmptySessionCard } from '../components/EmptySessionCard';
import { SectionHeader } from '../components/SectionHeader';
import { ActivityCard } from '../components/ActivityCard';
import { colors, spacing } from '../theme';

export const HomeScreen: React.FC = () => {
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
    Alert.alert('View Details', 'Navigate to activity details');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onBookClass={handleBookClass} onMenuPress={handleMenuPress} />
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <AlertBanner onPress={handleVideoPress} />
        <EmptySessionCard />

        {/* My Activity Section */}
        <SectionHeader
          title="My Activity"
          linkText="View details"
          onLinkPress={handleViewDetails}
        />

        {/* Activity Calendar */}
        <View style={styles.activityCardContainer}>
          <ActivityCard />
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
  activityCardContainer: {
    alignItems: 'center',
  },
});
