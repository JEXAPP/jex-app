import { selectableTagStyles2 as styles} from '@/styles/components/selectableTagsStyles/selectableTagsStyles2';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SelectableTagProps {
  title: string;
  subtitle?: string;
  iconName?: string; // Ionicons name
  selected: boolean;
  onPress: () => void;
}

export const SelectableTag = ({
  title,
  subtitle,
  iconName,
  selected,
  onPress,
}: SelectableTagProps) => {
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
              color={selected ? '#fff' : styles.tagText.color}
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
