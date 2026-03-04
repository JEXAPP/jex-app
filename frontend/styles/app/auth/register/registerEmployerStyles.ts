// styles/app/auth/register/registerEmployerStyles.ts
import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const registerEmployerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
  },
  title: {
    fontSize: 42,
    fontFamily: 'titulos',
    color: Colors.violet4,
    textAlign: 'left',
    flexShrink: 1,
  },
  image: {
    width: 130,
    height: 130,
    marginRight: 10,
    marginLeft: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 60,
  },
  opcionesContainer: {
    gap: 2,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  texto: {
    fontFamily: 'interBold',
    fontSize: 18,
    color: Colors.violet4,
    textAlign: 'left',
    marginBottom: 20,
    marginTop: 10,
  },
  step: {
    paddingHorizontal: 20,
  },

  // mismos estilos que usaste en empleado
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  termsCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.violet4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: Colors.gray1,
  },
  termsCheckboxInner: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: Colors.violet4,
  },
  termsText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'interMedium',
    color: Colors.gray3,
  },
  termsLink: {
    fontFamily: 'interMedium',
    color: Colors.violet4,
    textDecorationLine: 'underline',
  },
});
