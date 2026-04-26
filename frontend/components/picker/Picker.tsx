import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleProp,
  TextStyle,
  ViewStyle,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/themes/colors';

interface Option {
  id: string | number;
  name: string;
}

interface PickerProps {
  label: string;
  value: Option | null;
  setValue: (val: Option) => void;
  options: Option[];
  styles: {
    container: StyleProp<ViewStyle>;
    selector: StyleProp<ViewStyle>;
    labelText: StyleProp<TextStyle>;
    selectedText: StyleProp<TextStyle>;
    chevron?: StyleProp<ViewStyle>;
    dropdown: StyleProp<ViewStyle>;
    optionText: StyleProp<TextStyle>;
    optionTextSelected?: StyleProp<TextStyle>;
    divider?: StyleProp<ViewStyle>;
  };
}

export const Picker: React.FC<PickerProps> = ({
  label,
  value,
  setValue,
  options,
  styles,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setOpen(!open)}
        activeOpacity={0.8}
      >
        <Text style={value ? styles.selectedText : styles.labelText}>
          {value?.name || label}
        </Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={Colors.gray2}
          style={styles.chevron as any}
        />
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdown}>
          <ScrollView
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {options.map((option, idx) => {
              const selected = value?.id === option.id;
              return (
                <React.Fragment key={option.id.toString()}>
                  {idx > 0 && styles.divider && (
                    <View style={styles.divider} />
                  )}
                  <Pressable
                    onPress={() => {
                      setValue(option);
                      setOpen(false);
                    }}
                  >
                    <Text style={selected && styles.optionTextSelected ? styles.optionTextSelected : styles.optionText}>
                      {option.name}
                    </Text>
                  </Pressable>
                </React.Fragment>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};
