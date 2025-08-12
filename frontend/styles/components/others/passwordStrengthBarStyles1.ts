import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const passwordStrengthStyles1 = StyleSheet.create({
  container: {
    flexDirection: 'row',          
    alignItems: 'center',   
    gap: 10,
    alignSelf: 'flex-end',
    marginRight: 40                        
  },
  label: {
    fontSize: 14,
    color: Colors.gray3,
  },
  barBackground: {
    width: 220,                    
    height: 6,
    backgroundColor: Colors.gray2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: 6,
    backgroundColor: Colors.violet3,
    borderRadius: 4,
  },
});
