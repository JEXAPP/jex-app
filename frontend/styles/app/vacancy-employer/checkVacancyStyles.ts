import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const checkVacancyStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.gray1,
  },
  headerRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 16,
  marginHorizontal: 15,
  position: 'relative', // para poder ubicar la imagen por encima
},
headerImage: {
  width: 80,
  height: 80,
  position: 'absolute',
  right: 50, // pegado al margen derecho
  top: -30, // un poco más arriba del header
},
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.violet4,
    marginRight: 8,
  },
  addEventButton: {
    backgroundColor: Colors.gray2,
    borderRadius: 50,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addEventButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.violet4,
    marginTop: -3,
  },
  eventCard: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginHorizontal: 15,
    position: 'relative',
  },
  eventTextContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  eventName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    color: Colors.violet4,
    marginBottom: 8,
  },
  eventDetail: {
    textAlign: 'left',
    color: Colors.gray3,
    fontSize: 15,
  },
  editEventButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  searchContainer: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginHorizontal: 15,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  searchInput: {
    marginVertical: 8,
    fontSize: 15,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginHorizontal: 15,
  },
  filterButton: {
    backgroundColor: Colors.gray2,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: Colors.violet4,
  },
  filterText: {
    color: Colors.violet4,
    fontWeight: 'bold',
  },
  filterTextActive: {
    color: Colors.white,
  },
  sortButton: {
    backgroundColor: Colors.gray2,
    borderRadius: 50,
    width: 30,
    fontWeight: 'bold',
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginLeft: 8,
  },
  addVacancyButton: {
    backgroundColor: Colors.violet4,
    borderRadius: 50,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noEventsCard: {
  backgroundColor: Colors.white,
  padding: 20,
  borderRadius: 12,
  alignItems: 'center',
  marginHorizontal: 15,
  marginTop: 40,
},
noEventsTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: Colors.violet4,
  marginBottom: 20,
  textAlign: 'center',
},
noEventsImageContainer: {
  width: 150,
  height: 150,
  marginBottom: 20,
  // Aquí vos cargas tu imagen (o podemos poner backgroundColor temporal)
},
noEventsImage: {
  width: 150,
  height: 150,
  marginBottom: 20,
},
noEventsSubtitle: {
  fontSize: 14,
  color: Colors.gray3,
  textAlign: 'center',
},
  addVacancyButtonText: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: -3,
    marginRight: -1,
  },
  vacancyCard: {
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 15,
  },
  vacancyInfo: {
    flexDirection: 'column',
  },
  vacancyEstadoBadge: {
    backgroundColor: Colors.gray2,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  vacancyEstadoText: {
    fontSize: 12,
    color: Colors.black,
  },
  vacancyNombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.violet4,
  },
});