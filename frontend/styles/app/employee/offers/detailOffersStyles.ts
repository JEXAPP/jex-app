import { StyleSheet } from 'react-native';

export const detailOffersStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F7F5F8',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 26,
    marginTop: 45,
    marginLeft: 46,
    fontWeight: 'bold',
    color: '#4B164C',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  card2: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: "100%",
    height: "90%", // ajusta al alto que quieras
             
  },
  matchImage: {
  width: "100%",
  height: 400, // ajusta según el alto que quieras
  resizeMode: "cover", // esto hace que la imagen ocupe todo y no deje bordes
  borderRadius: 16,     // mismo redondeo que la card
},
  eventImage: {
    width: '50%',
    height: 120,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 12,
  },
  company: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  role: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  salaryContainer: {
    alignSelf: 'center',
    backgroundColor: '#4B164C',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 8,
  },
  salary: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  date: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 1,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 1,
  },
  location: {
    fontSize: 14,
    marginBottom: 8,
  },
  mapImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 16,
  },
  requirementsTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  requirement: {
    fontSize: 13,
    marginLeft: 8,
  },
  additionalTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 12,
    marginBottom: 4,
  },
  additional: {
    fontSize: 13,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  rejectButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#4B164C',
  },
  acceptButton: {
    backgroundColor: '#4B164C',
  },
  rejectText: {
    color: '#4B164C',
    fontWeight: '600',
  },
  acceptText: {
    color: 'white',
    fontWeight: '600',
  },
  expirationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    justifyContent: 'center',
  },
  expirationText: {
    fontSize: 14,
    marginLeft: 6,
    color: '#4B164C',
  },
});
