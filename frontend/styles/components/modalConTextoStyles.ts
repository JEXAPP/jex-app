import { StyleSheet } from 'react-native';
import { Colors } from '../../themes/colors';

export const modalConTextoStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 14,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'interBold',
    fontSize: 22,
    color: Colors.violet5,
    marginLeft: 10
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
    borderRadius: 8,
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
  marginBottom: 8,
},
});
