import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const passwordStrengthStyles1 = StyleSheet.create({
  container: {
    justifyContent: 'center'
  },
  listContainer: {
    gap: 0,
    marginLeft: 30
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: Colors.gray3,
    fontFamily: 'interLightItalic'
  },
  icon: {
    alignItems: 'center',
  },
  successContainer: {
    paddingVertical: 4,
    alignSelf: 'center'
  },
  successText: {
    fontSize: 15,
    color: Colors.violet3,
    fontFamily: 'interMediumItalic'
  },
  successIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
