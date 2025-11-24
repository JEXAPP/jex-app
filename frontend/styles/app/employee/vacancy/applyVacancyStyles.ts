// src/styles/app/employee/vacancy/applyVacancyStyles.ts
import { Borders } from '@/themes/borders';
import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const applyVacancyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
  },
  scroll:{ 
    paddingBottom: 100
  },
  role: {
    paddingHorizontal: 26,
  },
  backBtnHero: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: Colors.violet4,
    paddingTop: 8,
    paddingBottom: 22,
    paddingHorizontal: 26,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 5
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
    height: 60,
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
    marginTop: 10
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
    textAlign: 'justify',
    marginBottom: 10
  },
  containerText3: {
    fontSize: 17,
    fontFamily: 'interItalic',
    color: Colors.gray3,
    paddingVertical: 5,
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
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
    gap:3
  },
  applyBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.gray1,
    paddingHorizontal: 20,
    paddingTop: 15,
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
    color: Colors.violet4,
    fontFamily: 'interBold', 
  },
  deadline: {
    fontSize: 14,
    fontFamily: 'interLightItalic',
    color: Colors.gray3,
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
    backgroundColor: Colors.gray12,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 6,
    alignSelf: 'center',
  },
  organizerNameText: {
    fontWeight: '600',
    fontSize: 14,
    color: Colors.violet4,
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
    color: Colors.violet4,
  },
  organizerInfoLabel: {
    fontSize: 12,
    color: Colors.gray3,
  },
  multiple: {
    gap: 5
  },
  image: {
    borderRadius: Borders.soft,
    marginTop: 3,
    marginBottom: 4,
    alignSelf: 'center'
  },

  /* ==== MODAL CALIFICACIONES ORGANIZADOR ==== */
  ratingsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  ratingsModalCard: {
    backgroundColor: Colors.gray1,
    borderRadius: 20,
    maxHeight: '80%',
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  ratingsModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  ratingsModalTitle: {
    fontSize: 20,
    fontFamily: 'interBold',
    color: Colors.violet4,
  },
  ratingsModalLoading: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingsModalError: {
    fontFamily: 'interMedium',
    fontSize: 14,
    color: Colors.violet4,
    textAlign: 'center',
    marginTop: 10,
  },
  ratingsModalEmpty: {
    fontFamily: 'interRegular',
    fontSize: 14,
    color: Colors.gray3,
    textAlign: 'center',
    marginTop: 10,
  },
  ratingsModalList: {
    marginTop: 8,
  },

  ratingCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  ratingCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  ratingCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingAvatar: {
    marginRight: 8,
  },
  ratingRaterName: {
    fontFamily: 'interBold',
    fontSize: 15,
    color: Colors.violet4,
  },
  ratingDatePill: {
    backgroundColor: Colors.gray1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  ratingDateText: {
    fontFamily: 'interRegular',
    fontSize: 11,
    color: Colors.gray3,
  },
  ratingEventName: {
    fontFamily: 'interMediumItalic',
    fontSize: 14,
    color: Colors.black,
    marginBottom: 6,
  },
  ratingStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingStarsInner: {
    flexDirection: 'row',
    marginRight: 6,
  },
  ratingValueText: {
    fontFamily: 'interBold',
    fontSize: 14,
    color: Colors.gray3,
  },
  ratingCommentBubble: {
    backgroundColor: '#f3f3f5',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  ratingCommentText: {
    fontFamily: 'interRegular',
    fontSize: 14,
    color: Colors.gray3,
  },
});
