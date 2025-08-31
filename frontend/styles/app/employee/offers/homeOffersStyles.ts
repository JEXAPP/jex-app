import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const homeOffersStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    paddingTop: 40,
    paddingHorizontal: 20
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 50,
    fontFamily: 'titulos',
    color: Colors.violet4,
    marginBottom: 10
  },
  scroll: {
    paddingBottom: 40,
    gap: 20
  },
  offerCard: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 18,
  },
  offerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  offerImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10
  },
  offerInfo: {
    marginTop: 5,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  noOffersCard: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50
  },
  noOffersTitle: {
    fontFamily: 'interBold',
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
    fontFamily: 'interMedium',
    fontSize: 15,
    color: Colors.gray3,
    textAlign: 'center'
  },
  company: {
    fontFamily: 'interRegular',
    fontSize: 14,
    color: Colors.gray3
  },
  role: {
    fontFamily: 'interBold',
    fontSize: 22,
    marginBottom: 5,
    color: Colors.black
  },
  salary: {
    fontFamily: 'interBold',
    fontSize: 18,
    color: Colors.violet4,
    marginBottom: 5
  },
  date: {
    fontFamily: 'interMedium',
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
    fontFamily: 'interLightItalic',
    fontSize: 14,
    color: Colors.gray3
  }
});
