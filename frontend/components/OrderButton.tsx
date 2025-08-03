import React, { useState, useRef } from 'react';
import { TouchableOpacity, Animated, View, Text } from 'react-native';
import { orderButtonStyles1 as styles } from '@/styles/components/orderButtonStyles1';

interface OrderButtonProps {
  options: string[];
  onSelect: (option: string) => void;
  defaultOption?: string;
}

export const OrderButton = ({ options, onSelect, defaultOption }: OrderButtonProps) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultOption || options[0]);
  const rotation = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const newOpen = !open;
    setOpen(newOpen);

    Animated.timing(rotation, {
      toValue: newOpen ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const handleSelect = (option: string) => {
    setSelected(option);
    onSelect(option);
    toggleMenu();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={toggleMenu}>
        <Animated.Text
          style={[
            styles.buttonText,
            { transform: [{ rotate: spin }] },
          ]}
        >
          {open ? '×' : '≡'}
        </Animated.Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdown}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dropdownItem,
                option === selected && { backgroundColor: '#F3F0FF' } // resalta selección
              ]}
              onPress={() => handleSelect(option)}
            >
              <Text
                style={[
                  styles.dropdownText,
                  option === selected && { color: '#64278C', fontWeight: 'bold' }
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};
