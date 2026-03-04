import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const stepTwoAdditionalInfoStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    paddingHorizontal: 20,
    paddingBottom: 26,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 50,
    fontFamily: 'titulos',
    color: Colors.violet4,
    textAlign: 'left',
    lineHeight: 50,
  },

  // Column de botones "Agregar ..."
  actionsColumn: {
    marginTop: 10,
    marginBottom: 16,
    gap: 10,
  },

  // Cards
  cardsRow: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 26,
  },
  card: {
    height: 340, // ventana blanca fija
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 12,
  },
  cardScroll: {
    flex: 1,
  },
  cardListContent: {
    paddingBottom: 6,
  },
  cardEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  cardEmptyText: {
    fontFamily: 'interMedium',
    fontSize: 14,
    color: Colors.gray3,
    textAlign: 'center',
  },

  // Ítems genéricos (no timeline, no idiomas)
  itemRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray1,
    paddingVertical: 10,
    gap: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontFamily: 'interSemiBold',
    fontSize: 15,
    color: Colors.violet4,
    marginBottom: 2,
  },
  itemSub: {
    fontFamily: 'interMedium',
    fontSize: 13,
    color: Colors.gray3,
    marginBottom: 2,
  },
  itemDates: {
    fontFamily: 'interMedium',
    fontSize: 12,
    color: Colors.gray3,
    marginBottom: 6,
  },
  itemDesc: {
    fontFamily: 'interRegular',
    fontSize: 12,
    color: Colors.gray3,
  },

  itemActions: {
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: Colors.gray2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsInner: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  },
  iconGhost: {},
  iconGhostTxt: {},

  // ----- IDIOMAS -----
  languageItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  languageInfo: {
    flex: 1,
    marginRight: 8,
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
    marginRight: 8,
  },
  languageLevelText: {
    fontFamily: 'interSemiBold',
    fontSize: 11,
    color: Colors.gray3,
  },

  separatorDotted: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.gray3,
    marginVertical: 12,
  },

  // ----- TIMELINE -----
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
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
  timelineContentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineTextCol: {
    flex: 1,
  },
  timelineActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: 8,
    gap: 6,
  },
  timelineTitle: {
    fontFamily: 'interSemiBold',
    fontSize: 14,
    color: Colors.violet4,
    marginBottom: 2,
  },
  timelineSub: {
    fontFamily: 'interMedium',
    fontSize: 12,
    color: Colors.gray3,
    marginBottom: 2,
  },
  timelineDates: {
    fontFamily: 'interMedium',
    fontSize: 11,
    color: Colors.gray3,
    marginBottom: 4,
  },
  timelineDesc: {
    fontFamily: 'interRegular',
    fontSize: 12,
    color: Colors.gray3,
  },

  // Modal base
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: 350,
    maxWidth: 720,
    maxHeight: '88%',
    backgroundColor: Colors.gray1,
    borderRadius: 16,
    padding: 16,
    overflow: 'visible',
  },
  modalTitle: {
    fontFamily: 'interBold',
    fontSize: 20,
    color: Colors.violet4,
    marginBottom: 20,
  },

  fieldWrapSuggest: {
    marginBottom: 12,
    position: 'relative',
    zIndex: 30,
  },
  fieldWrap: {
    marginBottom: 12,
    position: 'relative',
    zIndex: 1,
  },
  row2: {
    flexDirection: 'row',
    gap: 12,
    zIndex: 1,
  },
  label: {
    fontFamily: 'interSemiBold',
    fontSize: 13,
    color: Colors.violet4,
    marginBottom: 6,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  tagChip: {
    borderWidth: 1,
    borderColor: Colors.gray2,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: Colors.white,
  },
  tagChipActive: {
    borderColor: Colors.violet4,
    backgroundColor: '#efe9ff',
  },
  tagChipText: {
    fontFamily: 'interMedium',
    fontSize: 12,
    color: Colors.gray3,
  },
  tagChipTextActive: {
    color: Colors.violet4,
  },

  footer: {
    flexDirection: 'row',
    gap: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
    marginBottom: 6,
  },
  modalButtons2: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 10,
    marginBottom: 6,
  },
  skipButton: {
    fontSize: 18,
  },
  nextButton: {
    fontSize: 20,
    fontFamily: 'interBold',
    color: Colors.violet4,
  },
});
