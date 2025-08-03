import { StyleSheet } from 'react-native';
import { Colors } from '../../../themes/colors';
import { Borders } from '@/themes/borders';

export const aditionalInfoStyles = StyleSheet.create({
  container: {
    flex: 1,  
    backgroundColor: Colors.gray1
},
  title: {
    fontSize: 38,
    fontFamily: 'titulos',
    color: Colors.violet5,
    textAlign: 'left',
    flexShrink: 1,
},
  header: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
},
  skipButtonText: {
    fontSize: 15,
    fontFamily: 'interBold',
    color: Colors.violet5,
    textAlign: 'right',
},
  containerTitle: {
    fontSize: 22,
    fontFamily: 'interSemiBold',
    color: Colors.violet5,
    textAlign: 'left',
    marginBottom: 8,
},
  profileImageWrapper: {
    alignItems: 'center',
    marginBottom: 24,
},
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 60,
    marginBottom: -10,
},
  section: {
    marginBottom: 0,
},
  saveButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  scroll:{
    paddingHorizontal: 26, 
    paddingBottom: 26
},
  sectionSubtitle: {
    fontSize: 15,
    fontFamily: 'interRegular',
    color: Colors.gray3,
    marginBottom: 20,
},
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 17,           
},
  textArea: {
    fontSize: 15,
    fontFamily: 'interRegular',
    color:Colors.gray3,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
},
})