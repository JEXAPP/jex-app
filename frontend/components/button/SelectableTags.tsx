import { Colors } from '@/themes/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';

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
    <View
      style={[
        styles.tagContent,
        subtitle
          ? {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 10
            }
          : null
      ]}
    >
      <View
        style={[
          styles.labelRow,
          subtitle
            ? { flexShrink: 1 }
            : null
        ]}
      >
        {iconName && (
          <Ionicons
            name={iconName as any}
            size={16}
            color={selected ? Colors.white : Colors.gray3}
            style={{ marginRight: 4 }}
          />
        )}

        <Text
          numberOfLines={subtitle ? 1 : undefined}
          adjustsFontSizeToFit={!!subtitle}
          minimumFontScale={0.7}
          style={[
            styles.tagText,
            selected && styles.tagTextSelected,
            subtitle ? { flexShrink: 1 } : null
          ]}
        >
          {title}
        </Text>
      </View>

      {subtitle && (
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          style={[
            styles.tagSubtitle,
            selected && styles.tagSubtitleSelected,
            {
              textAlign: 'right',
              flexShrink: 1
            }
          ]}
        >
          {subtitle}
        </Text>
      )}
    </View>
  </TouchableOpacity>
);
}