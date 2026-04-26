import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const dropdownStyles1 = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    inset: 0 as any,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  menu: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: Colors.violet4,
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(81,31,115,0.07)',
  },
  item: {
    paddingLeft: 14,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  itemSelected: {
    backgroundColor: Colors.violet0,
  },
  itemText: {
    flex: 1,
    color: Colors.gray3,
    fontFamily: 'interMedium',
    fontSize: 15,
  },
  itemTextSelected: {
    flex: 1,
    color: Colors.violet4,
    fontFamily: 'interSemiBold',
    fontSize: 15,
  },
  checkIcon: {
    width: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(81,31,115,0.06)',
    marginHorizontal: 10,
  },
});
