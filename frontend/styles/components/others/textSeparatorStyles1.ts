import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const textSeparatorStyles1 = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 15,
  },
  line: {
    width: 140,
    height: 1,
    backgroundColor: Colors.gray2,
  },
  text: {
    marginHorizontal: 10,
    fontFamily: 'interRegular',
    color: Colors.gray3,
  },
});
