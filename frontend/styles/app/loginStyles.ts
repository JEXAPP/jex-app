// styles/loginStyles.ts
import { StyleSheet } from 'react-native';
import { Colors } from '../../themes/colors';

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.gray1,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontFamily: 'interBold',
    fontSize: 60,
    color: Colors.violet5,
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
    position: 'absolute',
    bottom: -40,
    right: -40,
    resizeMode: 'contain',
  },
});
