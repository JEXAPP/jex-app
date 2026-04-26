import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const suggestionsStyles1 = StyleSheet.create({
  contenedor: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    marginBottom: 6,
    backgroundColor: '#fff',
    borderRadius: 14,
    shadowColor: Colors.violet4,
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 16,
    maxHeight: 260,
    zIndex: 20000,
    borderWidth: 1,
    borderColor: 'rgba(81,31,115,0.07)',
    overflow: 'hidden',
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(81,31,115,0.06)',
    marginHorizontal: 14,
  },
  texto: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'interMedium',
    color: Colors.gray3,
  },
});
