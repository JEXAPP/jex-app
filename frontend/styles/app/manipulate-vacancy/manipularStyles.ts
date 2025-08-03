import { StyleSheet } from 'react-native';
import { Colors } from '../../../themes/colors';

export const manipularStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
  },
  scroll:{
    paddingHorizontal: 26, 
    paddingBottom: 26
  },
  header: {
    backgroundColor: Colors.violet5,
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    gap: 12,
    marginBottom: 20,
  },
  headerTop: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',   
      alignItems: 'center',
      paddingHorizontal: 16,
      gap: 20,
      width: '100%',              
},
  })