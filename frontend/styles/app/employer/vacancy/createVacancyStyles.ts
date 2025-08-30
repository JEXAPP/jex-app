import { Borders } from '@/themes/borders';
import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const createVacancyStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: Colors.gray1,
    paddingHorizontal: 20
  },
  vacancyCard: {
    borderWidth: 2,
    borderColor: Colors.violet4,
    borderRadius: Borders.soft,
    padding: 20,
    marginBottom: 20
  },
  subtitulo: {
    fontSize: 20,
    fontFamily: 'interBold',
    color: Colors.violet4,
  },
  subtitleRow:{
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20,
    marginTop: 10,
  },
  subtitleButtons: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 15,
    gap: 95
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
    marginLeft: 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50,
    gap: 10
  },
  requerimientoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  turnoContainer: {
    borderRadius: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
    backgroundColor: Colors.violet2
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  shiftTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
    gap: 15
  },
  turnoTitulo: {
    fontSize: 18,
    fontFamily: 'interBold',
    color: Colors.white,
  },
  shiftRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20
  },
  lastButtons: {
    alignItems: 'center',
    gap: 10
  }
});