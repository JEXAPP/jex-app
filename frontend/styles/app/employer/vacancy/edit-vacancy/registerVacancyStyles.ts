import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const registerVacancyStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
    backgroundColor: Colors.gray1,
  },
  subtitulo: {
  fontSize: 20,
  fontWeight: 'bold',
  color: Colors.violet4,
  marginBottom: 5,
  marginLeft: -6,
  marginTop: 10, // ajustá según tu paleta de colores
},
  title: {
    fontSize: 42,
    fontFamily: 'titulos',
    color: Colors.violet4,
    textAlign: 'left',
    flexShrink: 1,
  },
  image: {
    width: 130,
    height: 130,
    marginRight: 10,
    marginLeft: 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 70,
  },
  opcionesContainer: {
    gap: 2,
    marginBottom: 375
  },
  texto: {
    fontFamily: 'interBold',
    fontSize: 18,
    color: Colors.violet5,
    textAlign: 'left',
    marginBottom: 20
  },
  turnoContainer: {
    borderWidth: 1,
    borderColor: Colors.violet4,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: Colors.white
  },
  scrollContainer: {
  flexGrow: 1,
  paddingBottom: 20,
},
turnoTitulo: {
  fontSize: 18,
  fontWeight: 'bold',
  color: Colors.violet4,
  marginBottom: 5,
  marginTop: 10,
}
});