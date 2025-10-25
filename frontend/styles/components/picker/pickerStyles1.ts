import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';
import { Borders } from '@/themes/borders';

export const pickerStyles1 = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 100, 
    overflow: 'visible',
    marginBottom: 10,
  },
  selector: {
    padding: 17,
    width: 350,
    alignSelf: 'center',
    backgroundColor: Colors.white,
    borderRadius: Borders.soft,
  },
  labelText: {
    fontSize: 16,
    fontFamily: 'interMedium',
    color: Colors.gray3,
  },
  selectedText: {
    fontSize: 16,
    fontFamily: 'interMedium',
    color: Colors.black,
  },
  dropdown: {
    position: 'relative',
    maxHeight: 200,
    width: 310,
    alignSelf: 'center',
    backgroundColor: Colors.white,
    borderRadius: Borders.soft,
    zIndex: 100,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  optionText: {
    padding: 15,
    fontSize: 16,
    color: Colors.black,
    fontFamily: 'interRegular',
  },
  label: {
    fontFamily: 'interBold',
    fontSize: 18,
    color: Colors.violet5,
    textAlign: 'left',
    marginBottom: 20,
  },
});
