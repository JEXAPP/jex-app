import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const manipulateVacancyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
  },
  scroll:{
    paddingHorizontal: 26, 
    paddingBottom: 26
  },
  header: {
    backgroundColor: Colors.violet5,
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    gap: 12,
    marginBottom: 20,
  },
  headerTop: {
    marginBottom: 10,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',   
      alignItems: 'center',
      paddingHorizontal: 16,
      gap: 20,
      width: '100%',              
  },
  headerText: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  logoWrapper: {
    width: 90,
    height: 90,
    borderRadius: 90,
    resizeMode: 'cover',
  },
  eventTitle: {
    fontSize: 25,
    fontFamily: 'titulos',
    color: Colors.gray1,
  },
  ratingWrapper: {
    flexDirection: 'row',
    backgroundColor: Colors.gray1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
    alignSelf: 'flex-start',
  },
  starsIcon: {
    color: Colors.violet4,
  },
  map: {
    width: '100%',
    height: 80,
    borderRadius: 16,
    marginTop: 4,
    resizeMode: 'cover',
  },
  containerTitle: {
    fontSize: 30,
    fontFamily: 'titulos',
    color: Colors.violet4,
    textAlign: 'left',
    marginBottom: 5,
  },
  containerText: {
    fontSize: 18,
    fontFamily: 'interRegular',
    color: Colors.gray3,
    textAlign: 'justify',
    marginBottom: 5
  },
  containerText2: {
    fontSize: 17,
    fontFamily: 'interRegular',
    color: Colors.gray3,
    textAlign: 'justify',
    marginBottom: 10
  },
  organizerArea: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  containerBulletPoints: {
    fontSize: 17,
    fontFamily: 'interRegular',
    color: Colors.gray3,
    flexShrink: 1,
  },
  bulletNumber: {
    marginLeft: 10,
    width: 20,
    fontSize: 17,
    fontFamily: 'interMedium',
    color: Colors.violet4,
  },
  containerSubtitle: {
    fontSize: 20,
    fontFamily: 'interBold',
    color: Colors.violet4,
    textAlign: 'left',
    marginBottom: 5,
    marginTop: 10,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray2,
    marginTop: 30,
    marginBottom:10,
  },
  applyBox2:{
    marginTop: 5,
    gap:3
  },
  applyBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.gray1,
    paddingHorizontal: 20,
    paddingVertical: 14,
    minHeight: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 8,
  },
  salary: {
    fontSize: 20,
    color: Colors.violet5,
    fontFamily: 'interBold', 
  },
  deadline: {
    fontSize: 14,
    fontFamily: 'interLightItalic',
    color: Colors.gray3,
  },
  applyButton: {
    backgroundColor: Colors.violet5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  applyText: {
    fontSize: 16,
    fontFamily: 'interBold', 
    color: Colors.white,
  },
  organizerContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  organizerAvatar: {
    width: 90,
    height: 90,
    borderRadius: 90,
    resizeMode: 'cover',
  },
  organizerNameTag: {
    backgroundColor: Colors.gray2,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 6,
    alignSelf: 'center',
  },
  organizerNameText: {
    fontWeight: '600',
    fontSize: 14,
    color: Colors.violet5,
  },
  organizerInfo: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: Colors.gray2,
    paddingLeft: 16,
    gap: 8, 
    alignItems: 'flex-start',
  },
  organizerInfoItem: {
    alignItems: 'flex-start',
  },
  organizerInfoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.violet5,
  },
  organizerInfoLabel: {
    fontSize: 12,
    color: Colors.gray3,
  },
  })