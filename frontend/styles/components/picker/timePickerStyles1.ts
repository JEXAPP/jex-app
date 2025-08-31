import { StyleSheet } from 'react-native';
import { Borders } from '@/themes/borders';
import { Colors } from '@/themes/colors';

const itemHeight = 40;

export const timePickerStyles1 = StyleSheet.create({
  selector: {
    padding: 17,
    alignSelf: 'center',
    width: 350,
    borderRadius: Borders.soft,
    backgroundColor: Colors.white,
  },
  timeText: {
    fontSize: 16,
    fontFamily: 'interMedium',
    color: Colors.black,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: Borders.semirounded,
    padding: 20,
    width: '65%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'interBold',
    color: Colors.violet4,
    marginBottom: 20,
  },
  pickerWrapper: {
    position: 'relative',
    height: itemHeight * 5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  scrollPicker: {
    height: itemHeight * 5,
    width: 70,
  },
  pickerItem: {
    textAlign: 'center',
    height: itemHeight,
    fontSize: 18,
    fontFamily: 'interMedium',
    color: Colors.gray3,
  },
  divider: {
    fontSize: 20,
    color: Colors.black,
    fontFamily: 'interSemiBold',
    marginBottom: 15,
  },
  selectionOverlay: {
    position: 'absolute',
    top: itemHeight * 2,
    height: itemHeight,
    width: '100%',
    zIndex: 2,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.gray2,
  },
  fadeTop: {
    position: 'absolute',
    top: 0,
    height: itemHeight * 2,
    width: '100%',
    zIndex: 3,
  },
  fadeBottom: {
    position: 'absolute',
    bottom: 0,
    height: itemHeight * 2,
    width: '100%',
    zIndex: 3,
  },

  // === Acciones ===
  actionsRow: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 14,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.gray12,
    justifyContent: 'center',
    height: 40,
    borderRadius: Borders.semirounded,
  },
  cancelText: {
    color: Colors.gray3,
    fontSize: 16,
    fontFamily: 'interMedium',
    textAlign: 'center',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: Colors.violet4,
    justifyContent: 'center',
    borderRadius: Borders.semirounded,
  },
  confirmText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: 'interBold',
    textAlign: 'center',
  },

  selectedItem: {
    fontSize: 22,
    fontFamily: 'interSemiBold',
    color: Colors.black,
  },
});
