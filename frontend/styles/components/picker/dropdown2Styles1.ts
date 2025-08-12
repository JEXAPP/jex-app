import { StyleSheet } from 'react-native';
import { Borders } from "@/themes/borders";
import { Colors } from "@/themes/colors";

export const dropdown2Styles1 = StyleSheet.create({
   input: {
    fontFamily: 'interBold',
    fontSize: 18,
    color: Colors.violet5,
    textAlign: 'left',
    marginBottom: 20,
    backgroundColor: Colors.white,
    padding: 17,
    width: 310,
    alignSelf: 'center',
    borderRadius: Borders.soft,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000aa',
  },
  modalContent: {
    backgroundColor: Colors.gray1,
    marginHorizontal: 40,
    borderRadius: 10,
    maxHeight: '60%',
  },
  optionText: {
    color: Colors.black, 
    fontSize: 16, 
    fontFamily: 'interMedium' 
  },
  option: {
    padding: 16,
    borderBottomColor: Colors.gray12,
    borderBottomWidth: 1,
  },
  label: { 
    color: Colors.black, 
    fontSize: 16, 
    fontFamily: 'interMedium' 
  },
  placeholder: { 
    color: Colors.gray3, 
    fontFamily: 'interMedium', 
    fontSize: 16 
  }
});