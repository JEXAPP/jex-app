import { Borders } from '@/themes/borders';
import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const imageWindowStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontFamily: "titulos",
    color: Colors.violet4 ?? '#3A0A5E',
    textAlign: 'center',
    marginBottom: 10,
  },
  mediaBox: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
  },
  button: {
    width: '50%',
    alignSelf: 'center',
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: Colors.violet4 ?? '#3A0A5E',
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'interBold',
    fontSize: 16,
  },
  subtitle: {
  fontSize: 16,
  color: Colors.gray3,
  fontFamily: "interItalic",
  textAlign: 'center',
  marginHorizontal: 8,
  lineHeight: 20,
  marginBottom: 30
},
text:{
  fontSize: 15,
  color: Colors.gray3,
  fontFamily: "interMedium",
  textAlign: 'left',
  marginHorizontal: 8,
  lineHeight: 20,
  marginBottom: 20
}
});
