import { StyleSheet } from 'react-native';
import { Colors } from '../../themes/colors';
import { Borders } from '@/themes/borders';

export const modalConTextoStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: Borders.soft,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'interBold',
    fontSize: 22,
    color: Colors.violet5,
    marginLeft: 20,
  },
  message: {
    fontFamily: 'interRegular',
    fontSize: 16,
    color: Colors.gray3,
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.violet4,
    borderRadius: Borders.soft,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'interSemiBold',
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginLeft: 70
  },
});
