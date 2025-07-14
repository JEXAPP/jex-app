import { StyleSheet } from 'react-native';
import { Colors } from '../../../themes/colors';
import { Borders } from '@/themes/borders';

export const crearEventoStyles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
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
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 100,
  },
  opcionesContainer: {
    gap: 10,
    marginBottom: 310
  },
  scroll:{
    paddingHorizontal: 26, 
    paddingBottom: 26
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: Borders.soft,
    resizeMode: 'cover',
    marginVertical: 12,
  },
})