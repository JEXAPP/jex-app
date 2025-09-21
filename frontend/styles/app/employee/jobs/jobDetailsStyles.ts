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
    fontSize: 18,            // más cercano al Figma
    fontFamily: 'interMedium',
    color: Colors.gray3,
    textAlign: 'center',
  },
  title2: {
    fontSize: 40,
    fontFamily: 'titulos',
    color: Colors.violet4,
  },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    gap: 6,
  },

  subCard2: {
    flexDirection: 'column',
    alignItems: 'center',
  },

  // Contenedor derecha (dos píldoras en columna)
  sideCol: {
    width: 150,
    marginLeft: 12,
    gap: 12,
  },
  pillText: {
    fontFamily: 'interBold',
    fontSize: 14,
    color: Colors.violet4,
    marginLeft: 5
  },

  // Títulos y textos
  cardTitle: {
    fontSize: 18,
    fontFamily: 'interBold',
    color: Colors.violet4,
    marginBottom: 2,
  },
  text: {
    fontFamily: 'interRegular',
    fontSize: 14,
    color: Colors.gray3,
  },


  // Footer boton
  buttonSpace: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  section: {
  marginHorizontal: 20,
},
row: {
  flexDirection: 'row',
  gap: 15,
  justifyContent: 'center'
},

// Card Ubicación (reutiliza tu card2)
card2: {
  alignSelf: 'center',
  backgroundColor: Colors.white,
  flexDirection: 'row',
  borderRadius: 16,
  padding: 14,
  alignItems: 'center',
  minHeight: 84,
  width: 350,
  marginTop: 5,
  marginBottom: 15
},
locationCard: {
  marginTop: 15,
},
subCard: {
  marginLeft: 12,
  flex: 1,
},

// Base píldoras
pill: {
  backgroundColor: Colors.white,
  borderRadius: 16,
  paddingVertical: 12,
  paddingHorizontal: 12,
  minHeight: 84,
  justifyContent: 'center',
  minWidth: 170
},

/** ===== Horario ===== */
pillTime: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: 8,
  
},
pillTimeContent: {
  flex: 1,
  paddingHorizontal: 5,
  paddingTop: 5
},
timeLabel: {
  fontFamily: 'interMedium',
  fontSize: 15,
  color: Colors.gray3,
},
timeValue: {
  fontFamily: 'interBold',
  fontSize: 18,
  color: Colors.violet4,
  alignSelf: 'flex-end',
  marginBottom: 5
},

/** ===== Sueldo ===== */
pillMoney: {
},
pillMoneyInner: {
  width: '100%',
  padding: 10
},
pillMoneyAmount: {
  fontFamily: 'interBold',
  fontSize: 24,
  lineHeight: 28,
  color: Colors.violet4,
  alignSelf: 'flex-end'
},
pillMoneyCurrency: {
  fontFamily: 'interSemiBold',
  fontSize: 12,
  color: Colors.violet4,
  marginTop: 4,
  alignSelf: 'flex-end', // abajo a la derecha
},

});
