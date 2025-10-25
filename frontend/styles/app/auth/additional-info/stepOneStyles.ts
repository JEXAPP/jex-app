import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const stepOneAdditionalInfoStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    paddingHorizontal: 20,
    paddingBottom: 26,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 60,
    marginTop: 20,
  },
  titleWrapper: {
    flexShrink: 1,
  },
  step: {
    fontSize: 14,
    fontFamily: 'interMedium',
    color: Colors.gray3,
    marginBottom: 4,
  },
  title: {
    fontSize: 50,
    fontFamily: 'titulos',
    color: Colors.violet4,
    textAlign: 'left',
    lineHeight: 50,
  },
  skipButtonText: {
    fontSize: 18,
    fontFamily: 'interBold',
    color: Colors.gray3,
    textAlign: 'right',
  },
  containerTitle: {
    fontSize: 22,
    fontFamily: 'interSemiBold',
    color: Colors.violet4,
    textAlign: 'left',
    marginBottom: 8,
  },
  profileImageWrapper: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profileImage: {
    width: 130,
    height: 130,
    marginBottom: -10,
  },
  footer: {
    flexDirection: 'row',
    gap: 130,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 160
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
