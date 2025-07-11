import { StyleSheet } from 'react-native';
import { Colors } from '../../themes/colors';

export const separadorConTextoStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
  },
  line: {
    width: 150,
    height: 1,
    backgroundColor: Colors.gray2,
  },
  text: {
    marginHorizontal: 10,
    fontFamily: 'interRegular',
    color: Colors.gray3,
  },
});
