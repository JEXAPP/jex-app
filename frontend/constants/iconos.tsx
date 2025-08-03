import { Feather, Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { TouchableOpacity } from 'react-native';

export const iconos = {
  error: (size: number, color: string) => (
    <MaterialIcons name="error" size={size} color={color} />
  ),
  ordenarFlechas: (size = 18, color = '#000') => (
    <Ionicons name="swap-vertical-outline" size={size} color={color} />
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
  flechaIzquierda: (size: number, color: string) => <Ionicons name="chevron-back" size={size} color={color} />,
  flechaDerecha: (size: number, color: string) => <Ionicons name="chevron-forward" size={size} color={color} />,
  editar: (size: number, color: string) => <Feather name="edit-3" size={size} color={color} />,
  mas: (size: number, color: string) => <Ionicons name="add" size={size} color={color} />,
  ordenar: (size: number, color: string) => <MaterialIcons name="sort-by-alpha" size={size} color={color} />,
};