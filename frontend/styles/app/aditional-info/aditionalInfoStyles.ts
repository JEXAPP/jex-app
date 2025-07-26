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
    fontWeight: '800',
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
    color: Colors.violet5,
    fontWeight: '700',
    textAlign: 'right',
},
  containerTitle: {
    fontSize: 22,
    color: Colors.violet5,
    textAlign: 'left',
    fontWeight: '700',
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
  subtitleSection: {
    fontSize: 15,
    color: Colors.gray3,
    marginBottom: 20,
},
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
},
  tag: {
    backgroundColor: Colors.gray2,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
},

  tagText: {
    fontSize: 16,
    color: Colors.violet5,
    fontWeight: '600'
},

  tagSelected: {
    backgroundColor: Colors.violet5,
},

  tagTextSelected: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
},
  textArea: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 15,
    color: '#333',
},
  charCounter: {
    alignSelf: 'flex-end',
    marginTop: 4,
    fontSize: 12,
    color: Colors.gray2,
    marginRight: 4,
},

modalOverlay: {
  flex: 1,
  justifyContent: 'flex-end',
},

modalContent: {
  backgroundColor: Colors.gray1,
  padding: 20,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
},

modalOption: {
  fontSize: 16,
  paddingVertical: 12,
  color: Colors.violet5,
  fontWeight: 'bold'
},

modalCancel: {
  fontSize: 16,
  paddingVertical: 12,
  color: 'red',
  marginTop: 10,
  textAlign: 'center',
  fontWeight: 'bold'
},
})