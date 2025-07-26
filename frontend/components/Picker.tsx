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
    dropdown: StyleProp<ViewStyle>;
    optionText: StyleProp<TextStyle>;
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
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdown}>
          <ScrollView
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator
          >
            {options.map((option) => (
              <Pressable
                key={option.id.toString()}
                onPress={() => {
                  setValue(option);
                  setOpen(false);
                }}
              >
                <Text style={styles.optionText}>{option.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};
