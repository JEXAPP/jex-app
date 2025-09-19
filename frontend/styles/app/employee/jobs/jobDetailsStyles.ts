import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const jobDetailsStyles = StyleSheet.create({
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 35,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 26,
  },
  title: {
    fontSize: 24,            // más cercano al Figma
    fontFamily: 'titulos',
    color: Colors.gray3,
    marginBottom: 4,
    textAlign: 'center',
  },
  title2: {
    fontSize: 20,
    fontFamily: 'titulos',
    color: Colors.violet3,
  },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    marginBottom: 16,
    gap: 6,
  },

  card2: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    alignItems: 'center',
    minHeight: 84,
  },
  subCard: {
    marginLeft: 12,
    flex: 1,
  },
  subCard2: {
    flexDirection: 'column',
    alignItems: 'center',
  },

  // Contenedor derecha (dos píldoras en columna)
  sideCol: {
    width: 130,
    marginLeft: 12,
    gap: 12,
  },

  // Píldoras (Horario y Pago)
  pill: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  pillText: {
    fontFamily: 'interMedium',
    fontSize: 14,
    color: Colors.black,
  },
  pillMoneyAmount: {
    fontFamily: 'titulos',
    fontSize: 18,
    color: Colors.violet4,
  },
  pillMoneyCurrency: {
    marginLeft: 6,
    fontFamily: 'interMedium',
    fontSize: 12,
    color: Colors.black,
  },

  // Títulos y textos
  cardTitle: {
    fontSize: 18,
    fontFamily: 'titulos',
    color: Colors.violet4,
    marginBottom: 2,
  },
  text: {
    fontFamily: 'interMedium',
    fontSize: 14,
    color: Colors.gray3,
  },

  // Layout filas
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 12,
  },

  // Footer boton
  buttonSpace: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
});
