import { Borders } from '@/themes/borders';
import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const datePickerStyles1 = StyleSheet.create({
  selector: {
    padding: 17,
    width: 350,
    borderRadius: Borders.soft,
    backgroundColor: Colors.white,
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'interMedium',
    color: Colors.black,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: Borders.soft,
    padding: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'interBold',
    color: Colors.violet5,
    marginBottom: 15,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scrollPicker: {
    height: 150,
    width: 90,
    marginHorizontal: 5,
  },
  pickerItem: {
    textAlign: 'center',
    paddingVertical: 8,
    fontFamily: 'interMedium',
    fontSize: 16,
    color: Colors.gray3,
  },
  selectedItem: {
    fontWeight: 'bold',
    color: Colors.violet3,
    fontSize: 17,
    textDecorationLine: 'underline',
  },
  confirmButton: {
    marginTop: 16,
    backgroundColor: Colors.violet3,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: Borders.soft,
  },
  confirmText: {
    color: '#FFF',
    fontFamily: 'interBold',
    fontSize: 16,
  },
});