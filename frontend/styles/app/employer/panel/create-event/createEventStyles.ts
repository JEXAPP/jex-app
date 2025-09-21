import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const createEventStyles = StyleSheet.create({

  header: {
   
    marginBottom: 20,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 60,
    marginBottom: -10,
  },
  firstRow: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 40,
    fontFamily: 'titulos',
    color: Colors.violet4,
    flexShrink: 1,
    marginRight: 20,
  },
  scroll: {
    backgroundColor: Colors.gray1,
    paddingHorizontal: 20,
    paddingTop: 70,
  },
  row1: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: 30,
    marginBottom: 10,
    marginTop: 15
    
  },
  row2: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: 30,
  }, 
  description:{
    marginBottom: 5,
    marginTop: 15
  },
  button:{
    marginTop: 20
  }

});
