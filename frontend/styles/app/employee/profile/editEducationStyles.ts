import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";

export const editEducationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    paddingHorizontal: 20,
    paddingBottom: 26,
  },
  header: {
    marginTop: 40,
    marginBottom: 16,
  },
  title: {
    fontSize: 40,
    fontFamily: "titulos",
    color: Colors.violet4,
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: "interMediumItalic",
    color: Colors.gray3,
  },
  actionsColumn: {
    marginTop: 10,
    marginBottom: 16,
    gap: 10,
  },

  card: {
    flex: 1,
    marginTop: 4,
    marginBottom: 16,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 12,
  },
  cardScroll: {
    flex: 1,
  },
  cardListContent: {
    paddingBottom: 8,
  },
  cardEmpty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  cardEmptyText: {
    fontFamily: "interMedium",
    fontSize: 14,
    color: Colors.gray3,
    textAlign: "center",
  },

  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  timelineCol: {
    width: 26,
    alignItems: "center",
  },
  timelineDotEdu: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.violet2,
    marginTop: 4,
  },
  timelineLineEdu: {
    flex: 1,
    width: 3,
    backgroundColor: Colors.violet3,
    marginTop: 2,
    borderRadius: 999,
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
    flexDirection: "row",
    alignItems: "flex-start",
  },
  timelineTextCol: {
    flex: 1,
  },
  timelineActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginLeft: 8,
    gap: 6,
  },
  timelineTitle: {
    fontFamily: "interSemiBold",
    fontSize: 14,
    color: Colors.violet4,
    marginBottom: 2,
  },
  timelineSub: {
    fontFamily: "interMedium",
    fontSize: 12,
    color: Colors.gray3,
    marginBottom: 2,
  },
  timelineDates: {
    fontFamily: "interMedium",
    fontSize: 11,
    color: Colors.gray3,
    marginBottom: 4,
  },
  timelineDesc: {
    fontFamily: "interRegular",
    fontSize: 12,
    color: Colors.gray3,
  },

  iconGhost: {},
  iconGhostTxt: {},

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    width: 350,
    maxHeight: "88%",
    backgroundColor: Colors.gray1,
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontFamily: "interBold",
    fontSize: 20,
    color: Colors.violet4,
    marginBottom: 20,
  },

  fieldWrapSuggest: {
    marginBottom: 12,
    position: "relative",
    zIndex: 30,
  },
  fieldWrap: {
    marginBottom: 12,
    position: "relative",
    zIndex: 1,
  },
  row2: {
    flexDirection: "row",
    gap: 12,
    zIndex: 1,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 20,
    marginBottom: 6,
  },

  suggestionsStyles2: {
    container: {
      position: "absolute",
      top: 46,
      left: 0,
      right: 0,
      backgroundColor: Colors.white,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.gray2,
      maxHeight: 180,
      zIndex: 40,
    },
    item: {
      paddingVertical: 8,
      paddingHorizontal: 10,
    },
    itemText: {
      fontFamily: "interRegular",
      fontSize: 13,
      color: Colors.gray3,
    },
  } as any,
});
