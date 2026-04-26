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
    paddingVertical: 15,
    paddingHorizontal: 17,
    alignSelf: 'stretch',
    backgroundColor: Colors.white,
    borderRadius: Borders.soft,
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'interMedium',
    color: Colors.gray3,
  },
  selectedText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'interMedium',
    color: Colors.black,
  },
  chevron: {
    marginLeft: 6,
  },
  dropdown: {
    position: 'relative',
    maxHeight: 220,
    alignSelf: 'stretch',
    backgroundColor: Colors.white,
    borderRadius: Borders.soft,
    zIndex: 100,
    elevation: 6,
    shadowColor: Colors.violet4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(81,31,115,0.07)',
    marginTop: 4,
  },
  optionText: {
    paddingVertical: 13,
    paddingHorizontal: 17,
    fontSize: 15,
    color: Colors.gray3,
    fontFamily: 'interRegular',
  },
  optionTextSelected: {
    paddingVertical: 13,
    paddingHorizontal: 17,
    fontSize: 15,
    color: Colors.violet4,
    fontFamily: 'interSemiBold',
    backgroundColor: Colors.violet0,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(81,31,115,0.06)',
    marginHorizontal: 12,
  },
  label: {
    fontFamily: 'interBold',
    fontSize: 18,
    color: Colors.violet5,
    textAlign: 'left',
    marginBottom: 20,
  },
});
