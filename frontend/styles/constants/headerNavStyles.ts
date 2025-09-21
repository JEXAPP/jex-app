import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const headerNavStyles = StyleSheet.create({
  // Título grande opcional (pedido)
  title: {
    fontSize: 50,
    lineHeight: 60,
    fontFamily: 'titulos',
    color: Colors.violet4,
    marginRight: 10,
    paddingHorizontal: 16,
    marginTop: 20
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: Colors.gray1,
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
    height: 1,
    backgroundColor: Colors.gray12,
  },
  indicator: {
    position: 'absolute',
    height: 4,
    borderRadius: 4,
    backgroundColor: Colors.violet4,
    bottom: -2,
  },
});
