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
    fontSize: 16,
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
    fontSize: 17,
  },

  /* ===== RESTO ===== */
  scroll: {
    padding: 20,
    paddingBottom: 24,
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
    elevation: 1,
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
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  locationText: {
    color: Colors.darkgreen,
    fontFamily: 'interSemiBoldItalic',
    fontSize: 15,
  },

  /* Shifts */
  sectionTitle: {
    marginTop: 8,
    marginBottom: 6,
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
    fontFamily: 'interRegular',
  },

  /* Acciones fijas abajo */
  actionsRow: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.gray1,
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

  /* Idiomas */
  languagesCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    gap: 8,
  },
  languageItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
  },
  languageName: {
    fontFamily: 'interBold',
    fontSize: 14,
    color: Colors.violet4,
  },
  languageLevelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: Colors.gray1,
  },
  languageLevelText: {
    fontFamily: 'interSemiBold',
    fontSize: 11,
    color: Colors.gray3,
  },

  /* Timeline experiencia + educación */
  timelineContainer: {
    marginTop: 4,
    gap: 12,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineCol: {
    width: 26,
    alignItems: 'center',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.violet4,
    marginTop: 4,
  },
  timelineLine: {
    flex: 1,
    width: 3,
    backgroundColor: Colors.violet3,
    marginTop: 2,
    borderRadius: 999,
    shadowColor: Colors.violet4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 4,
  },
  timelineCardWrapper: {
    flex: 1,
    marginLeft: 4,
  },
  timelineCardInner: {
    borderRadius: 12,
    padding: 10,
  },
  timelineTextCol: {
    flex: 1,
  },
  timelineTitle: {
    fontFamily: 'interBold',
    fontSize: 16,
    color: Colors.violet4,
    marginBottom: 2,
  },
  timelineSub: {
    fontFamily: 'interLightItalic',
    fontSize: 12,
    color: Colors.black,
    marginBottom: 2,
  },
  timelineDates: {
    fontFamily: 'interMedium',
    fontSize: 11,
    color: Colors.black,
    marginBottom: 4,
  },
  timelineDesc: {
    fontFamily: 'interMediumItalic',
    fontSize: 12,
    color: Colors.black,
  },
  timelineImagesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  timelineImageThumb: {
    borderRadius: 8,
    overflow: 'hidden',
  },

  /* Viewer de imagen */
  imageViewerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewerImage: {
    width: '90%',
    height: '80%',
  },
  imageViewerClose: {
    position: 'absolute',
    top: 40,
    right: 24,
    zIndex: 10,
  },
  editButtonTop: {
    position: "absolute",
    right: 16,
    top: 8,
    padding: 6,
  },
    timelineTypeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: Colors.gray1,
    marginBottom: 4,
  },
  timelineTypeBadgeText: {
    fontFamily: 'interSemiBold',
    fontSize: 11,
    color: Colors.violet4,
  },
  ratingButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ratingButtonDisabled: {
    opacity: 0.6,
  },
  ratingStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingButtonText: {
    color: Colors.white,
    fontFamily: 'interBold',
    fontSize: 16,
  },

  // --- Modal de calificaciones ---
  ratingModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  ratingModalCard: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: Colors.gray1,
    borderRadius: 20,
    padding: 16,
  },
  ratingModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ratingModalTitle: {
    fontSize: 22,
    fontFamily: 'interBold',
    color: Colors.violet4,
  },
  ratingModalClose: {
    padding: 4,
  },
  ratingModalList: {
    paddingBottom: 8,
  },
  ratingEmptyText: {
    textAlign: 'center',
    color: Colors.gray3,
    fontFamily: 'interMedium',
    marginTop: 16,
  },

  // Card de rating
  ratingCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    paddingVertical: 14,
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
  ratingName: {
    fontSize: 16,
    fontFamily: 'interBold',
    color: Colors.violet4,
  },
  ratingDatePill: {
    backgroundColor: Colors.gray1,
    borderRadius: 14,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  ratingDateText: {
    fontSize: 11,
    fontFamily: 'interRegular',
    color: Colors.gray3,
  },
  ratingEventName: {
    fontSize: 13,
    fontFamily: 'interMediumItalic',
    color: Colors.gray3,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingStarsSmall: {
    flexDirection: 'row',
    marginRight: 6,
  },
  ratingValue: {
    fontSize: 14,
    fontFamily: 'interBold',
    color: Colors.gray3,
  },
  ratingCommentBubble: {
    backgroundColor: '#f3f3f5',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  ratingCommentText: {
    fontSize: 13,
    fontFamily: 'interRegular',
    color: Colors.gray3,
  },
});
