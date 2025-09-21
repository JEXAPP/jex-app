// styles/components/others/uploadImageStyles1.ts
import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const uploadImageStyles1 = StyleSheet.create({
  icon: {
    marginRight: 6,
    color: Colors.violet5,
  },

  // contenedor para centrar SIEMPRE los botones bajo la imagen
  buttonsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'center', // centrado
  },
  addText: {
    fontSize: 16,
    color: Colors.gray3,
    fontWeight: '600',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  loadingPill: {
    backgroundColor: Colors.gray12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center', // centrado también
  },
  loadingText: {
    fontSize: 14,
    color: Colors.gray3,
  },
});
