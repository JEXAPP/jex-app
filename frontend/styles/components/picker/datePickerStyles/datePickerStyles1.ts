import { Borders } from '@/themes/borders';
import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

const itemHeight = 40;

export const datePickerStyles1 = StyleSheet.create({
  selector: {
    padding: 17,
    alignSelf: 'center',
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
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: Borders.semirounded,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'interBold',
    color: Colors.violet5,
    marginBottom: 30,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    height: itemHeight * 5,
    marginBottom: 20,
  },
  scrollPicker: {
    height: itemHeight * 5,
    width: 110,
    marginHorizontal: 0,
  },
  pickerItem: {
    textAlign: 'center',
    height: itemHeight,
    fontSize: 16,
    fontFamily: 'interMedium',
    color: Colors.gray3,
  },
  selectedItem: {
    fontFamily: 'interSemiBold',
    fontSize: 18,
    color: Colors.black,
  },
  fadeTop: {
    position: 'absolute',
    top: 0,
    height: itemHeight * 2,
    width: '100%',
    zIndex: 2,
  },
  fadeBottom: {
    position: 'absolute',
    bottom: 0,
    height: itemHeight * 2,
    width: '100%',
    zIndex: 2,
  },
  confirmButton: {
    marginTop: 10,
    backgroundColor: Colors.violet3,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: Borders.semirounded,
  },
  confirmText: {
    color: '#FFF',
    fontFamily: 'interBold',
    fontSize: 16,
  },
});
