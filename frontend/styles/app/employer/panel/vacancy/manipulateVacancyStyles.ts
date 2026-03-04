import { Borders } from '@/themes/borders';
import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const manipulateVacancyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
  },
  scroll: {
    paddingBottom: 120,
  },
  header: {
    backgroundColor: Colors.violet4,
    paddingTop: 40,
    paddingBottom: 22,
    paddingHorizontal: 26,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  backBtnHero: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 6,
  },
  headerText: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  image: {
    borderRadius: Borders.soft,
    alignSelf: 'center',
  },
  eventTitle: {
    fontSize: 25,
    fontFamily: 'titulos',
    color: Colors.gray1,
  },
  role: {
    paddingHorizontal: 26,
  },
  containerTitle: {
    fontSize: 30,
    fontFamily: 'titulos',
    color: Colors.violet4,
    marginBottom: 5,
    marginTop: 10,
  },
  containerText: {
    fontSize: 17,
    fontFamily: 'interRegular',
    color: Colors.gray3,
  },
  containerText2: {
    fontSize: 17,
    fontFamily: 'interRegular',
    color: Colors.gray3,
    marginBottom: 10,
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
    marginBottom: 5,
    marginTop: 10,
  },
  multiple: {
    gap: 5,
  },
  applyBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.gray1,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 8,
  },
});