import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/themes/colors';

interface Option {
  name: string;
  id: string;
}

export interface DropDownProps {
  name: string;
  options: Option[];
  id: string;
  onValueChange: (id: string) => void;
  styles: {
    input: StyleProp<ViewStyle>;
    modalOverlay: StyleProp<ViewStyle>;
    modalContent: StyleProp<ViewStyle>;
    modalHeader?: StyleProp<ViewStyle>;
    modalTitle?: StyleProp<TextStyle>;
    option: StyleProp<ViewStyle>;
    optionSelected?: StyleProp<ViewStyle>;
    optionText: StyleProp<TextStyle>;
    optionTextSelected?: StyleProp<TextStyle>;
    checkIcon?: StyleProp<ViewStyle>;
    divider?: StyleProp<ViewStyle>;
    label: StyleProp<TextStyle>;
    placeholder: StyleProp<TextStyle>;
  };
  placeholder?: string;
  title?: string;
}

export const DropDown2: React.FC<DropDownProps> = ({
  options, id, onValueChange, styles, placeholder = 'Seleccionar', title,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedLabel = options.find(opt => opt.id === id)?.name || placeholder;
  const isPlaceholder = !options.some(opt => opt.id === id);

  return (
    <View>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={isPlaceholder ? styles.placeholder : styles.label}>
          {selectedLabel}
        </Text>
        <Ionicons name="chevron-down" size={18} color={Colors.gray2} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            {title && (
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{title}</Text>
              </View>
            )}
            <FlatList
              data={options}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const selected = item.id === id;
                return (
                  <TouchableOpacity
                    style={[styles.option, selected && styles.optionSelected]}
                    onPress={() => {
                      onValueChange(item.id);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={selected && styles.optionTextSelected ? styles.optionTextSelected : styles.optionText}>
                      {item.name}
                    </Text>
                    {styles.checkIcon && (
                      <View style={styles.checkIcon}>
                        {selected && <Ionicons name="checkmark" size={16} color={Colors.violet4} />}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={styles.divider ? () => <View style={styles.divider} /> : undefined}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};