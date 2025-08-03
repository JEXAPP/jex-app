import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Borders } from '@/themes/borders';
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
  styles?: {
    input?: any;
    label?: any;
    placeholder?: any; // estilo para el placeholder
  };
  placeholder?: string; // texto por defecto si no hay valor seleccionado
}

const DropDown: React.FC<DropDownProps> = ({
  name,
  options,
  id,
  onValueChange,
  styles,
  placeholder = 'Seleccionar',
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedLabel = options.find(opt => opt.id === id)?.name || placeholder;
  const isPlaceholder = !options.some(opt => opt.id === id);

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={[styles?.label, stylesDefault.label]}>{name}</Text>

      <TouchableOpacity
        style={[stylesDefault.input, styles?.input]}
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
          style={stylesDefault.modalOverlay}
          onPress={() => setModalVisible(false)}
          activeOpacity={1}
        >
          <View style={stylesDefault.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={stylesDefault.option}
                  onPress={() => {
                    onValueChange(item.id);
                    setModalVisible(false);
                  }}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const stylesDefault = StyleSheet.create({
  label: {
    fontFamily: 'interBold',
    fontSize: 18,
    color: Colors.violet5,
    textAlign: 'left',
    marginBottom: 20,
  },
  input: {
    fontFamily: 'interBold',
    fontSize: 18,
    color: Colors.violet5,
    textAlign: 'left',
    marginBottom: 20,
    backgroundColor: Colors.white,
    padding: 17,
    width: 350,
    alignSelf: 'center',
    borderRadius: Borders.soft,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000aa',
  },
  modalContent: {
    backgroundColor: '#fff',
    marginHorizontal: 40,
    borderRadius: 10,
    maxHeight: '60%',
  },
  option: {
    padding: 16,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default DropDown;