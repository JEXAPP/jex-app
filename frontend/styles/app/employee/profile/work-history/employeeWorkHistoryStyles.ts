import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";

export const workHistoryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 40,
    fontFamily: 'titulos',
    color: Colors.violet4,
    alignSelf: 'center',
    marginLeft: 20,
    marginTop: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  listContent: {
  },

  // Card general
  card: {
    backgroundColor: "#fff",
    borderRadius: 26,
    marginBottom: 18,
    overflow: "hidden",
  },

  // Header morado del card
  cardHeader: {
    backgroundColor: Colors.violet4,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
  },

  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  eventLogo: {
    marginRight: 10,
    borderRadius: 12,
  },

  eventName: {
    fontSize: 16,
    fontFamily: "interMediumItalic",
    color: "#ffffff",
  },

  datePill: {
    position: "absolute",
    right: 16,
    top: 18,
    backgroundColor: Colors.gray1,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },

  dateText: {
    fontSize: 12,
    fontFamily: "interMedium",
    color: Colors.gray3,
  },

  role: {
    marginTop: 8,
    fontSize: 22,
    fontFamily: "interBold",
    color: "#ffffff",
  },

  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  amountText: {
    fontSize: 18,
    fontFamily: "interBold",
    color: "#ffffff",
  },

  doneAtText: {
    marginLeft: 10,
    fontSize: 12,
    fontFamily: "interLightItalic",
    color: "#f0e8ff",
  },

  // Cuerpo blanco del card
  body: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  experienceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  experienceLabel: {
    fontSize: 14,
    fontFamily: "interItalic",
    color: Colors.gray3,
  },

  counterpartyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    flex: 1,
  },

  counterpartyAvatar: {
    marginRight: 8,
  },

  counterpartyName: {
    fontSize: 15,
    fontFamily: "interBold",
    color: Colors.violet4,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  starsRow: {
    flexDirection: "row",
    marginRight: 6,
  },

  ratingValue: {
    fontSize: 16,
    fontFamily: "interBold",
    color: Colors.gray3,
  },

  commentBubble: {
    backgroundColor: "#f3f3f5",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  commentText: {
    fontSize: 14,
    fontFamily: "interRegular",
    color: Colors.gray3,
  },
});
