import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const stepThreeAdditionalInfoStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    paddingHorizontal: 20,
    paddingBottom: 26,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    marginBottom: 30,
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
  scroll: {
    paddingBottom: 26,
  },
  title: {
    fontSize: 50,
    fontFamily: 'titulos',
    color: Colors.violet4,
    textAlign: 'left',
    lineHeight: 60,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'interItalic',
    color: Colors.gray3,
    marginBottom: 20  ,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
  },
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
