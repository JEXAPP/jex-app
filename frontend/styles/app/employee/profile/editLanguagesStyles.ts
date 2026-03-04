import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";

export const editLanguagesStyles = StyleSheet.create({
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

  languageItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray1,
  },
  languageInfo: {
    flex: 1,
    marginRight: 8,
  },
  languageName: {
    fontFamily: "interBold",
    fontSize: 14,
    color: Colors.violet4,
  },
  languageLevelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: Colors.gray1,
    marginRight: 8,
  },
  languageLevelText: {
    fontFamily: "interSemiBold",
    fontSize: 11,
    color: Colors.gray3,
  },
  languageActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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

  fieldWrap: {
    marginBottom: 12,
    position: "relative",
    zIndex: 1,
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 14
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 20,
    marginBottom: 6,
  },

  dropdown2Styles1: {
    container: {
      marginBottom: 8,
    },
    label: {
      fontFamily: "interSemiBold",
      fontSize: 13,
      color: Colors.violet4,
      marginBottom: 4,
    },
    selector: {
      height: 44,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: Colors.gray2,
      paddingHorizontal: 12,
      backgroundColor: Colors.white,
      width: 315,
    },
    valueText: {
      fontFamily: "interRegular",
      fontSize: 13,
      color: Colors.gray3,
    },
    placeholderText: {
      fontFamily: "interRegular",
      fontSize: 13,
      color: Colors.gray3,
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.35)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      width: 300,
      maxHeight: "70%",
      backgroundColor: Colors.white,
      borderRadius: 12,
      paddingVertical: 8,
    },
    option: {
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    optionText: {
      fontFamily: "interRegular",
      fontSize: 13,
      color: Colors.gray3,
    },
  } as any,
});
