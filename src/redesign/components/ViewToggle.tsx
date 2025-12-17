import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type ViewMode = 'week' | 'month';

interface ViewToggleProps {
  selectedView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  selectedView,
  onViewChange,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          selectedView === 'week' && styles.selectedButton,
        ]}
        onPress={() => onViewChange('week')}
      >
        <Text
          style={[
            styles.buttonText,
            selectedView === 'week' && styles.selectedText,
          ]}
        >
          Week
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          selectedView === 'month' && styles.selectedButton,
        ]}
        onPress={() => onViewChange('month')}
      >
        <Text
          style={[
            styles.buttonText,
            selectedView === 'month' && styles.selectedText,
          ]}
        >
          Month
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#EEEEEE',
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 3,
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 0,
    height: 23,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  selectedButton: {
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#666666',
    lineHeight: 23,
    fontFamily: 'SF Pro Text',
  },
  selectedText: {
    color: '#1A1919',
  },
});
