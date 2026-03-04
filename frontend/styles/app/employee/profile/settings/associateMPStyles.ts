import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const associateMPStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    paddingHorizontal: 20,
    paddingBottom: 26,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
    marginTop: 20,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: Colors.violet4,
    borderColor: Colors.violet4,
  },
  stepDotText: {
    fontFamily: 'interSemiBold',
    fontSize: 14,
    color: Colors.gray3,
  },
  stepDotTextActive: {
    color: Colors.white,
  },
  skipText: {
    fontSize: 18,
    fontFamily: 'interBold',
    color: Colors.gray3,
  },

  /* Body */
  body: {
    flex: 1,
  },
  title: {
    fontSize: 50,
    fontFamily: 'titulos',
    color: Colors.violet4,
    textAlign: 'left',
    lineHeight: 60,
    marginTop: 20
  },
  stateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  stateLabel: {
    fontFamily: 'interMedium',
    fontSize: 14,
    color: Colors.gray3,
    marginRight: 6,
  },
  stateValue: {
    fontFamily: 'interSemiBold',
    fontSize: 14,
    color: Colors.gray3,
  },
  stateOk: { color: '#2e7d32' },
  stateWarn: { color: Colors.gray3 },

  /* Card */
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 20,
    paddingTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20
  },
  cardText: {
    fontFamily: 'interLightItalic',
    fontSize: 18,
    color: Colors.gray3,
    marginBottom: 14,
    textAlign: 'center'
  },
  cardText2: {
    fontFamily: 'interLight',
    fontSize: 18,
    color: Colors.gray3,
    marginBottom: 14,
    textAlign: 'center'
  },
  cardText3: {
    fontFamily: 'interLightItalic',
    fontSize: 15,
    color: Colors.gray3,
    marginBottom: 14,
    textAlign: 'center'
  },
  cardTitle: {
    fontFamily: 'interSemiBold',
    fontSize: 16,
    color: Colors.violet4,
    marginBottom: 6,
  },
  cardTitle2: {
    fontFamily: 'interBold',
    fontSize: 24,
    color: Colors.violet4,
    marginBottom: 6,
  },
  cardLine: {
    fontFamily: 'interMedium',
    fontSize: 14,
    color: Colors.gray3,
  },
  cardMuted: {
    fontFamily: 'interRegular',
    fontSize: 12,
    color: Colors.gray3,
    opacity: 0.9,
    marginTop: 2,
  },
  helpLink: { 
    marginTop: 12, 
    alignSelf: 'flex-start' 
  },
  helpLinkText: {
    fontFamily: 'interBold',
    fontSize: 16,
    color: Colors.violet4,
    textAlign: 'left',
    alignItems: 'flex-start',
    textDecorationLine: 'underline',
  },

  errorInline: {
    marginTop: 12,
    color: '#b00020',
    fontFamily: 'interMedium',
  },
  image: {
    width: 220,
    height: 220,
    marginBottom: 20,
  },
  /* Footer */
  footer: {
    flexDirection: 'row',
    gap: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    fontSize: 18,
  },
  nextButton: {
    fontSize: 20,
    fontFamily: 'interBold',
    color: Colors.violet4
  }
});
