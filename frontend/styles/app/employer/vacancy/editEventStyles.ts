import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const editEventStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
  },
  seccion: {
    height: 70,
    backgroundColor: Colors.gray1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
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
    marginTop: 15
  }, 
  description:{
    marginBottom: 5,
    marginTop: 15
  },
  button:{
    marginTop: 20
  }

});
