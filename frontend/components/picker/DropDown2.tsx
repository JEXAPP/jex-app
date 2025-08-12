import React, { useState } from 'react';
import {Modal,View,Text,TouchableOpacity,FlatList, StyleProp, ViewStyle, TextStyle} from 'react-native';

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
      modalOverlay:StyleProp<ViewStyle>;
      modalContent: StyleProp<ViewStyle>;
      option:StyleProp<ViewStyle>;
      optionText: StyleProp<TextStyle>;
      label: StyleProp<TextStyle>;
      placeholder: StyleProp<TextStyle>;
  };
  placeholder?: string; 
}

export const DropDown2: React.FC<DropDownProps> = ({options, id, onValueChange, styles, placeholder = 'Seleccionar',}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedLabel = options.find(opt => opt.id === id)?.name || placeholder;
  const isPlaceholder = !options.some(opt => opt.id === id);

  return (

    <View>

      <TouchableOpacity
        style={[styles.input, styles?.input]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={isPlaceholder ? styles?.placeholder : styles?.label}>
          {selectedLabel}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onValueChange(item.id);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};