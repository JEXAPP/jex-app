import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const footerNavStyles1 = StyleSheet.create({
  container: {
    backgroundColor: Colors.violet4,
    paddingHorizontal: 20,
    paddingTop: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    minHeight: 68,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6 as any, 
    paddingHorizontal: 4,
  },
});
