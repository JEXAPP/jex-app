import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const activeOffersStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    paddingTop: 90,
    paddingHorizontal: 20
  },
  title: {
    fontSize: 48,
    fontFamily: 'titulos',
    color: Colors.violet4,
    marginBottom: 10
  },
  sortContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20
  },
  sortText: {
    fontFamily: 'textos',
    fontSize: 16,
    color: Colors.gray3
  },
  scroll: {
    paddingBottom: 40,
    gap: 20
  },
  offerCard: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2
  },
  offerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  offerImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10
  },
  offerInfo: {
    flexDirection: 'column'
  },
  sortButton: {
  backgroundColor: Colors.violet4, // o el color que uses para botones
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 14,
  marginHorizontal: 4,
},
noOffersCard: {
  backgroundColor: Colors.white,
  borderRadius: 15,
  padding: 20,
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 2,
  marginTop: 50
},
noOffersTitle: {
  fontFamily: 'titulos',
  fontSize: 20,
  color: Colors.violet4,
  marginBottom: 10,
  textAlign: 'center'
},
noOffersImage: {
  width: 180,
  height: 180,
  marginBottom: 10
},
noOffersSubtitle: {
  fontFamily: 'textos',
  fontSize: 15,
  color: Colors.gray3,
  textAlign: 'center'
},
sortButtonText: {
  color: Colors.white,
  fontSize: 14,
  fontFamily: 'Poppins-Medium',
},
  company: {
    fontFamily: 'textos',
    fontSize: 14,
    color: Colors.gray3
  },
  role: {
    fontFamily: 'titulos',
    fontSize: 22,
    color: Colors.black
  },
  salary: {
    fontFamily: 'titulos',
    fontSize: 20,
    color: Colors.black,
    marginBottom: 5
  },
  date: {
    fontFamily: 'textos',
    fontSize: 15,
    color: Colors.gray3,
    marginBottom: 8
  },
  expirationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  expirationText: {
    fontFamily: 'textos',
    fontSize: 14,
    color: Colors.gray3
  }
});
