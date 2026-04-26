import { StyleSheet } from 'react-native';
import { Borders } from "@/themes/borders";
import { Colors } from "@/themes/colors";

export const dropdown2Styles1 = StyleSheet.create({
  input: {
    fontFamily: 'interSemiBold',
    fontSize: 16,
    color: Colors.violet4,
    textAlign: 'left',
    marginBottom: 20,
    backgroundColor: Colors.white,
    paddingVertical: 15,
    paddingHorizontal: 17,
    alignSelf: 'stretch',
    borderRadius: Borders.soft,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    marginHorizontal: 28,
    borderRadius: 18,
    maxHeight: '60%',
    overflow: 'hidden',
    shadowColor: Colors.violet4,
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  modalHeader: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(81,31,115,0.08)',
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'interSemiBold',
    color: Colors.violet4,
  },
  option: {
    paddingVertical: 15,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: Colors.violet0,
  },
  optionText: {
    flex: 1,
    color: Colors.gray3,
    fontSize: 15,
    fontFamily: 'interMedium',
  },
  optionTextSelected: {
    flex: 1,
    color: Colors.violet4,
    fontSize: 15,
    fontFamily: 'interSemiBold',
  },
  checkIcon: {
    width: 22,
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(81,31,115,0.06)',
    marginHorizontal: 14,
  },
  label: {
    color: Colors.black,
    fontSize: 15,
    fontFamily: 'interMedium',
  },
  placeholder: {
    color: Colors.gray2,
    fontFamily: 'interMedium',
    fontSize: 15,
  },
});