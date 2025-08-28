import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';
import { Borders } from '@/themes/borders';

export const homeEmployerStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: Colors.gray1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  addEventButton: {
    marginTop: 6
  },
  title: {
    fontSize: 50,
    lineHeight: 60,
    fontFamily: 'titulos',
    color: Colors.violet4,
    marginRight: 10
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',   
    marginBottom: 20,
  },
  sideSlot: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerSlot: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,  
  },
  eventName: {
    fontSize: 24,
    fontFamily: 'interBold',
    textAlign: 'center',
    color: Colors.violet4,
  },
  eventCard: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: Borders.soft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    position: 'relative',
  },
  eventTextContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  eventDetail: {
    textAlign: 'left',
    color: Colors.gray3,
    fontSize: 15,
    fontFamily: 'interMedium'
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
    justifyContent: 'flex-start'
  },
  filtersTags:{
    gap: 10,
    marginRight: 90,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20
  },
  noEventsCard: {
    height: 500,
    backgroundColor: Colors.white,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  noEventsTitle: {
    fontSize: 20,
    fontFamily: 'interBold',
    color: Colors.violet4,
    marginBottom: 20,
    textAlign: 'center',
  },
  noEventsImage: {
    width: 250,
    height: 250,
    marginBottom: 55,
    marginTop: 45,
  },
  noEventsSubtitle: {
    fontSize: 14,
    fontFamily: 'interItalic',
    color: Colors.gray3,
    textAlign: 'center',
  },
  vacancyCard: {
    padding: 15,
    backgroundColor: Colors.white,
    borderRadius: Borders.soft,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vacancyInfo: {
    flexDirection: 'column',
    gap: 5
  },
  vacancyEstadoBadge: {
    backgroundColor: Colors.gray12,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  vacancyEstadoText: {
    fontSize: 12,
    fontFamily: 'interMedium',
    color: Colors.gray3,
  },
  vacancyNombre: {
    fontSize: 20,
    fontFamily: 'interBold',
    color: Colors.violet4,
  },
});