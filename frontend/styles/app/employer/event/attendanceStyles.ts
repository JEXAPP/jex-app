import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';


export const attendanceStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 100,
    marginBottom: 10,
    marginLeft: 15

  },
  image: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 40,
    fontFamily: 'titulos',
    color: Colors.violet4,
    flexShrink: 1,
    marginRight: 20,
  },
  scroll: {
    paddingHorizontal: 26,
    gap: 10,
  },
  card: {
    backgroundColor: Colors.violet4,
    flexDirection: 'row',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15
  },
  text: {
    fontSize: 25,
    fontFamily: 'interBold',
    color: Colors.gray1,
    flexShrink: 1,
  },
  qrRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jex: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    opacity: 0.9,
  },
})