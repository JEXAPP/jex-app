import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const stepperStyles1 = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 3,
    width: '100%',
  },
  trackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  circleBase: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleCurrent: {
    backgroundColor: Colors.gray1,
    borderColor: Colors.violet4,
  },
  circlePast: {
    backgroundColor: Colors.violet4,
    borderColor: Colors.violet4,
  },
  circleFuture: {
    backgroundColor: Colors.gray1,
    borderColor: Colors.gray2,
  },
  circleDisabled: {
    opacity: 0.6,
  },
  numberBase: {
    fontSize: 14,
    lineHeight: 16,
    fontFamily: 'interBold'
  },
  numberCurrent: {
    color: Colors.violet4,
  },
  numberPast: {
    color: Colors.white,
  },
  numberFuture: {
    color: Colors.gray2,
  },
  numberDisabled: {
    color: Colors.gray2,
  },
  connectorBase: {
    height: 2.5,
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 1,
    backgroundColor: Colors.gray2,
  },
  connectorPast: {
    backgroundColor: Colors.violet3,
  },
  connectorFuture: {
    backgroundColor: Colors.gray12,
  },
  hitSlop: {
    top: 6, bottom: 6, left: 6, right: 6,
  } as any,
});
