import { StyleSheet } from 'react-native';
import { Colors } from '../../../themes/colors';

export const createEventStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 70,
    marginBottom: 20,
    marginLeft: 50
  },
  image: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 34,
    fontFamily: 'titulos',
    color: Colors.violet5,
    flexShrink: 1,
    marginRight: 20,
  },
  scroll: {
    paddingHorizontal: 26,
    paddingBottom: 100,
    gap: 10,
  },
  row1: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: 30,
    marginBottom: 10,
    
  },
  row2: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: 30,
  }, 
  description:{
    marginBottom: 5
  },
  button:{
    marginTop: 20
  }

});
