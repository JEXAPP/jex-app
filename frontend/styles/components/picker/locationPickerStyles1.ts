import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  modal: {
    width: 350,
    borderRadius: 16,
    padding: 16,
    backgroundColor: Colors.gray1,
    // sombra iOS
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    // sombra Android
    elevation: 12,
  },
  title: {
    fontFamily: 'titulos',
    fontSize: 22,
    color: Colors.violet4,
    marginBottom: 20,
  },
  block: {
  },
  suggestWrapper: {
    position: 'relative',
    zIndex: 1000,
    elevation: 8,
  },
  // Calle + Altura en fila
  rowCalleAltura: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 20
  },
  colGrow: { flex: 1, marginLeft: 10, zIndex: 90 },
  colAltura: { width: 110 },

  actions: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
  },
});
