// pickerStyles1.ts
import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';
import { Borders } from '@/themes/borders';

export const pickerStyles1 = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 100, // 🔥 Alto para que se superponga
    overflow: 'visible',
    marginBottom: 16,
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
    width: 350,
    alignSelf: 'center',
    backgroundColor: Colors.white,
    borderRadius: Borders.soft,
    borderWidth: 1,
    borderColor: Colors.gray2,
    zIndex: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  optionText: {
    padding: 15,
    fontSize: 16,
    color: Colors.black,
    fontFamily: 'interRegular',
  },
});
