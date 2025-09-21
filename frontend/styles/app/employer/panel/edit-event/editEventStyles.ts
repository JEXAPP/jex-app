import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const editEventStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    paddingTop: 40
  },
  header: {
    marginTop: 30,
    gap: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 40,
    fontFamily: 'titulos',
    color: Colors.violet4,
    flexShrink: 1,
    marginRight: 20,
  },
  scroll: {
    paddingHorizontal: 26,
    gap: 10,
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
  row3: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: 15,
    marginTop: 10
  }, 
  description:{
    marginBottom: 5,
    marginTop: 15
  },
  button:{
    marginTop: 20
  }

});
