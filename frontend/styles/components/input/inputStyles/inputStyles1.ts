import { Borders } from '@/themes/borders';
import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const inputStyles1 = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Borders.soft,
    width: 350,
    minHeight: 55,
    alignSelf: 'center',
    height: 55,
    paddingHorizontal: 15, 
  },
  input: {
    flex: 1,
    fontFamily: 'interMedium',
    fontSize: 16,
    color: Colors.black,  
  },
});
