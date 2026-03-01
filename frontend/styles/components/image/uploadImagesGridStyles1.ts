import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const uploadImagesGridStyles1 = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12, // si tu RN no soporta gap en Android viejo, reemplazar por márgenes
    alignItems: 'flex-start',
  },

  /* Miniaturas */
  thumbWrapper: {
    position: 'relative',
    backgroundColor: Colors.white,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.gray2,
  },
  thumbImage: {
    backgroundColor: Colors.gray1,
  },
  trashBtnWrapper: {
    position: 'absolute',
    left: 6,
    bottom: 6,
  },
  trashBtn: {
    // el tamaño / radius lo setea el componente
    borderWidth: 0,
  },
  trashText: {},

  /* Card Agregar */
  addCard: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.gray3,
    backgroundColor: Colors.gray1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  addCardDisabled: {
    opacity: 0.5,
  },
  addText: {
    marginTop: 6,
    fontFamily: 'interMedium',
    fontSize: 12,
    color: Colors.gray3,
  },
});
