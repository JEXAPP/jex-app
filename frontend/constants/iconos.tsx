import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { View, TouchableOpacity } from 'react-native';

export const iconos = {
  error: (size: number, color: string) => (
    <MaterialIcons name="error" size={size} color={color} />
  ),
  exito: (size: number, color: string) => (
    <Octicons name="check-circle" size={size} color={color} />
  ),
  ojoContra: (
    visible: boolean,
    colorVisible: string,
    colorOculto: string,
    onPress: () => void
  ) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        position: 'absolute',
        right: 15,
        top: 12,
        zIndex: 10,
        padding: 5,
      }}
      accessibilityLabel={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
    >
      <MaterialIcons
        name={visible ? 'visibility' : 'visibility-off'}
        size={20}
        color={visible ? colorVisible : colorOculto}
      />
    </TouchableOpacity>
  ),
};