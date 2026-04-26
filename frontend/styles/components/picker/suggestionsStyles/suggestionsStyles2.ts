import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const suggestionsStyles2 = StyleSheet.create({
  contenedor: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 14,
    marginTop: 6,
    zIndex: 9999,
    elevation: 9999,
    overflow: 'hidden',
    shadowColor: Colors.violet4,
    shadowOpacity: 0.13,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: 'rgba(81,31,115,0.07)',
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
