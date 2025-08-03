import { StyleSheet } from 'react-native';
import { Colors } from '../../../themes/colors';
import { Borders } from '@/themes/borders';

export const applyJobStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
  },
  scroll:{
    paddingHorizontal: 26, 
    paddingBottom: 100
  },
  header: {
    backgroundColor: Colors.violet5,
    borderRadius: 16,
    padding: 16,
    marginBottom: 7,
    gap: 12,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
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
    color: Colors.violet5,
  },
  map: {
    width: '100%',
    height: 100,
    borderRadius: 16,
    marginTop: 4,
    resizeMode: 'cover',
  },
  section: {
    marginBottom: 3,
  },
  containerTitle: {
    fontSize: 30,
    fontFamily: 'titulos',
    color: Colors.violet5,
    textAlign: 'left',
    marginBottom: 5,
  },
  containerText: {
    fontSize: 18,
    fontFamily: 'interRegular',
    color: Colors.gray3,
    textAlign: 'justify',
  },
  containerBulletPoints: {
    fontSize: 18,
    fontFamily: 'interRegular',
    color: Colors.gray3,
    flexShrink: 1,
  },
  containerSubtitle: {
    fontSize: 20,
    fontFamily: 'interBold',
    color: Colors.violet5,
    textAlign: 'left',
    marginBottom: 5,
  },
  icon: {
    color: Colors.violet5,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end', 
    gap: 10,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray2,
    marginTop: 10,
    marginBottom:10,
  },
  organizerArea: {
    backgroundColor: Colors.gray2,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap'
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
    alignItems: 'flex-start',
  },
  salary: {
    fontSize: 20,
    color: Colors.violet5,
    fontFamily: 'interBold', 
  },
  deadline: {
    fontSize: 14,
    fontFamily: 'interRegular',
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 10, 
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
    gap: 8, // espacio entre ítems
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