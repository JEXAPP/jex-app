import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const headerNavStyles = StyleSheet.create({
  title: {
    fontSize: 50,
    lineHeight: 60,
    fontFamily: 'titulos',
    color: Colors.violet4,
    marginRight: 10,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  bar: {
    flexDirection: 'row',
    paddingTop: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 15,
    fontFamily: 'interMedium',
    color: Colors.gray3,
  },
  tabTextActive: {
    color: Colors.violet4,
    fontFamily: 'interBold',
    fontSize: 15,
  },
  baseLine: {
    height: StyleSheet.hairlineWidth, 
  },
  indicator: {
    position: 'absolute',
    height: 4,
    borderRadius: 4,
    backgroundColor: Colors.violet4,
    bottom: -2,
  },
});
