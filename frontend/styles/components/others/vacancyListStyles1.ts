import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const vacancyListStyles1 = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',  
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'interBold',
    color: Colors.violet4,
  },
  arrow: {
    fontSize: 18,
    fontFamily: 'interBold',
    color: Colors.violet4,
    marginLeft: 10
  },
  cardWrapper: {
    marginRight: 15,
  },
});
