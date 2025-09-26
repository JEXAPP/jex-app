import { Colors } from '@/themes/colors';
import { Dimensions, StyleSheet } from 'react-native';


const { height, width } = Dimensions.get("window");


export const detailOffersStyles = StyleSheet.create({
  screen: { 
    flex: 1, 
    backgroundColor: Colors.gray1 
  },
  headerSpacing: { 
    height: 80 
  },
  scroll: { 
    flex: 1 
  },
  scrollContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 24 
  },
  card: { 
    backgroundColor: Colors.white, 
    borderRadius: 16, 
    padding: 20 
  },
   card2: { 
    backgroundColor: Colors.white, 
    borderRadius: 16, 
    padding: 16, 
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height * 0.7,   // la card ocupa 70% de la pantalla
    width: '100%',
  },
  matchFill: {
    width: width * 0.9,        // 80% del ancho de la pantalla
    height: height * 0.7,      // 50% de la altura de la pantalla
    resizeMode: 'contain',
  },

  eventImage: { 
    width: '50%', 
    height: 120, 
    borderRadius: 12, 
    alignSelf: 'center', 
    marginBottom: 12, 
    marginTop: 10 
  },
  company: { 
    fontSize: 14, 
    fontFamily: 'interRegular', 
    color: Colors.gray3, 
    textAlign: 'center' 
  },
  role: { 
    fontSize: 24, 
    fontFamily: 'interBold', 
    textAlign: 'center', 
    marginBottom: 8 
  },
  salaryContainer: { 
    alignSelf: 'center', 
    backgroundColor: Colors.violet4, 
    borderRadius: 8, 
    paddingHorizontal: 12, 
    paddingVertical: 4, 
    marginBottom: 8 
  },
  salary: { 
    color: Colors.white, 
    fontFamily: 'interBold', 
    fontSize: 18 
  },
  date: { 
    fontSize: 16, 
    fontFamily: 'interMedium', 
    textAlign: 'center', 
    marginBottom: 5 
  },
  locationLabel: {
    fontSize: 16, 
    fontFamily: 'interSemiBold', 
    marginTop: 5 
  },
  location: { 
    fontSize: 15, 
    fontFamily: 'interRegular',
    marginBottom: 8 
  },
  mapImage: { 
    width: '100%', 
    height: 100,
    borderRadius: 12, 
    marginBottom: 16 
  },
  requirementsTitle: { 
    fontSize: 16, 
    fontFamily: 'interSemiBold', 
    marginBottom: 4 
  },
  requirement: { 
    fontSize: 15, 
    fontFamily: 'interRegular', 
    marginLeft: 8 
  },
  additionalTitle: { 
    fontSize: 16, 
    fontFamily: 'interSemiBold', 
    marginTop: 12, 
    marginBottom: 4 
  },
  additional: { 
    fontSize: 15, 
    fontFamily: 'interRegular' 
  },
  expirationContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 16, 
    justifyContent: 'center' 
  },
  expirationText: { 
    fontSize: 13, 
    fontFamily: 'interLightItalic', 
    marginLeft: 6, 
    color: Colors.gray3 
  },
  buttonsInScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 30
  },
  
  matchOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: Colors.violet4, 
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    zIndex: 999,
  },
  matchImage: {
    width: 260,
    height: 260,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  matchText: {
    fontFamily: 'interBlack',
    fontSize: 42,
    lineHeight: 48,
    color: Colors.white,
    letterSpacing: 0.5,
  },
});
