import { StyleSheet } from 'react-native';
import { Colors } from '../../themes/colors';

export const modalTemporalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'interBold',
    color: Colors.violet5,
    marginLeft: 10
  },
  message: {
    fontFamily: 'interRegular',
    color: Colors.gray3,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.violet3,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'interBold',
  },
});
