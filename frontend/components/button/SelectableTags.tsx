import { Colors } from '@/themes/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

interface SelectableTagProps {
  title: string;
  subtitle?: string;
  iconName?: string; 
  selected: boolean;
  onPress: () => void;
  styles: {
    tag: StyleProp<ViewStyle>;
    tagSelected: StyleProp<ViewStyle>;
    tagContent: StyleProp<ViewStyle>;
    labelRow: StyleProp<ViewStyle>;
    tagText: StyleProp<TextStyle>;
    tagTextSelected: StyleProp<TextStyle>;
    tagSubtitle: StyleProp<TextStyle>;
    tagSubtitleSelected?: StyleProp<TextStyle>;
  };
  disabled?: boolean;
}

export const SelectableTag = ({
  title,
  subtitle,
  iconName,
  selected,
  onPress,
  styles,
  disabled = false
}: SelectableTagProps) => {

  if (disabled) return null;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.tag, selected && styles.tagSelected]}
    >
      <View style={styles.tagContent}>
        <View style={styles.labelRow}>
          {iconName && (
            <Ionicons
              name={iconName as any}
              size={16}
              color={selected ? Colors.white : Colors.gray3}
              style={{ marginRight: 4 }}
            />
          )}
          <Text style={[styles.tagText, selected && styles.tagTextSelected]}>
            {title}
          </Text>
        </View>
        {subtitle && (
          <Text
            style={[
              styles.tagSubtitle,
              selected && styles.tagSubtitleSelected,
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
