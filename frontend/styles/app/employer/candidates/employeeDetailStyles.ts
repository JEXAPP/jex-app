import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const employeeDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
  },

  /* ===== TOP HERO VIOLETA ===== */
  topHero: {
    backgroundColor: Colors.violet4,
    paddingTop: 8,
    paddingBottom: 22,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  backBtnHero: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topHeroCenter: {
    alignItems: 'center',
    marginTop: 6,
  },
  avatarBig: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  linkedRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  linkedTextCenter: {
    color: Colors.white,
    fontFamily: 'interMediumItalic',
  },
  nameCenter: {
    fontSize: 32,
    color: Colors.white,
    fontFamily: 'interBold',
    textAlign: 'center',
  },
  ageCenter: {
    marginTop: 2,
    color: Colors.white,
    fontFamily: 'interRegular',
    fontSize: 16
  },
  pillsRow: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 20,
  },
  pillOutline: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  pillText: {
    color: Colors.white,
    fontFamily: 'interBold',
    fontSize: 17
  },
  /* ===== RESTO ===== */
  scroll: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  rowCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },
  rowCardTitle: {
    marginLeft: 8,
    color: Colors.violet4,
    fontFamily: 'interSemiBold' as any,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: Colors.gray12,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  tagText: {
    color: Colors.black,
    fontFamily: 'interMedium',
    fontSize: 15,
  },
  descCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
  },
  descText: {
    color: Colors.black,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'interMedium',
  },
  skeleton: {
    height: 80,
    backgroundColor: Colors.gray12,
  },
  errorText: {
    color: Colors.violet4,
    fontFamily: 'interMedium',
  },

  /* Ubicación */
  locationCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 1
  },
  locationBgImage: {
    borderRadius: 16,
  },
  locationInner: {
    margin: 8,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    color: Colors.darkgreen,
    fontFamily: 'interSemiBoldItalic',
    fontSize: 15,
  },

  /* Shifts */
  sectionTitle: {
    marginTop: 8,
    color: Colors.violet4,
    fontSize: 20,
    fontFamily: 'interBold',
  },
  shiftBlock: {
    backgroundColor: '#E7E7EA',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 4,
  },
  shiftRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shiftTime: {
    fontFamily: 'interSemiBold',
    fontSize: 18,
    color: Colors.black,
  },
  shiftPay: {
    fontFamily: 'interBold',
    fontSize: 16,
    color: Colors.black,
    opacity: 0.9,
  },
  shiftDateLine: {
    marginTop: 4,
    color: Colors.black,
    fontFamily: 'interRegular'
  },

  actionsRow: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnOutline: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.violet4,
    width: 150,
    height: 55,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutlineText: {
    color: Colors.violet4,
    fontFamily: 'interBold',
    fontSize: 16,
  },
  btnPrimary: {
    gap: 10,
    backgroundColor: Colors.violet4,
    width: 190,
    height: 55,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  btnPrimaryIcon: { marginRight: 12 },
  btnPrimaryText: {
    color: Colors.white,
    fontFamily: 'interBold',
    fontSize: 16,
  },
});
