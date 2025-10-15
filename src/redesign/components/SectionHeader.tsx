import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronRight } from '../assets/ChevronRight';

type SectionHeaderProps = {
  title: string;
  linkText?: string;
  onLinkPress?: () => void;
};

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  linkText,
  onLinkPress
}) => {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Link with Chevron */}
      {linkText && onLinkPress && (
        <Pressable
          style={({ pressed }) => [
            styles.link,
            pressed && styles.linkPressed
          ]}
          onPress={onLinkPress}
        >
          <Text style={styles.linkText}>{linkText}</Text>
          <ChevronRight width={6} height={10} color="#7D4AC3" />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '800',
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  linkPressed: {
    opacity: 0.6,
  },
  linkText: {
    color: '#7D4AC3',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: -0.226,
    textAlign: 'right',
  },
});
