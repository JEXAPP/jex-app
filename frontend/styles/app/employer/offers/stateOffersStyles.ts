import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";

export const stateOffersStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
  },
  title: {
    fontSize: 50,
    fontFamily: "titulos",
    color: Colors.violet4,
    marginBottom: 20,
    marginTop: 10,
  },
  filterButtonActive: { backgroundColor: Colors.violet4 },
  filterTextActive: { color: "#fff" },
  filterButton: {
    backgroundColor: "#E5E5E5",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  filterText: {
    fontSize: 15,
    color: Colors.violet4,
    fontWeight: "600",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    flexWrap: "wrap",
  },

  offerCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginTop: 15,
    position: "relative",
  },
  statusBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: Colors.gray1,
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 12,
    zIndex: 10,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "interMedium",
  },
  statusPendiente: {
    color: Colors.gray3,
  },
  statusAceptada: {
    color: Colors.gray3,
  },
  statusRechazada: {
    color: Colors.gray3,
  },

  offerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  avatar: {
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
    flexDirection: "column",
  },
  employeeName: {
    fontSize: 24,
    fontFamily: "interBold",
    color: Colors.violet4,
    marginBottom: 4,
  },
  roleText: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: "interSemiBold",
  },

  turnContainer: {
    marginTop: 14,
    paddingHorizontal: 6,
  },
  turnRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  turnText: {
    marginLeft: 10,
    fontSize: 15,
    fontFamily: "interMediumItalic",
    color: Colors.gray3,
  },
  paymentAmount: {
    fontSize: 28,
    fontFamily: "interBold",
    color: "#1B5E20",
  },
  paidRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  paymentSuccess: {
    fontSize: 16,
    fontFamily: "interBold",
    color: "#1B5E20",
  },

  receiptBox: {
    marginTop: 12,
    backgroundColor: "rgba(255,255,255,0.6)",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  receiptLabel: {
    fontSize: 12,
    fontFamily: "interRegular",
    color: "#1B5E20",
    marginRight: 8,
  },
  receiptValue: {
    fontSize: 14,
    fontFamily: "interBold",
    color: "#1B5E20",
    flexShrink: 1,
  },

  pendingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#EDEDED",
  },
  pendingText: {
    fontSize: 14,
    fontFamily: "interBold",
    color: Colors.gray3,
  },

  paymentHint: {
    fontSize: 13,
    fontFamily: "interMediumItalic",
    color: Colors.gray3,
    marginBottom: 10,
  },

  payButtonLarge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.violet4,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 10,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "interBold",
  },

  emptyContainer: {
    flex: 0,
    backgroundColor: Colors.gray12,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.violet4,
    marginBottom: 10,
    marginTop: 10,
    textAlign: "center",
  },
  emptyImage: { width: 250, height: 250, marginTop: 5 },

  generalEmptyContainer: {
    flex: 0,
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  generalEmptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.violet4,
    marginBottom: 10,
    marginTop: 10,
    textAlign: "center",
  },
  generalEmptyImage: { width: 250, height: 250, marginTop: 5 },

  noEventsContainer: {
    flex: 0,
    backgroundColor: Colors.gray12,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    marginTop: 10,
  },
  noEventsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.violet4,
    marginBottom: 10,
    textAlign: "center",
  },
  noEventsImage: {
    width: 250,
    height: 250,
    marginTop: 5,
  },

  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sideSlot: {
    flex: 1,
    alignItems: "center",
  },
  centerSlot: {
    flex: 3,
    alignItems: "center",
  },
  eventName: {
    fontSize: 24,
    fontFamily: "interBold",
    textAlign: "center",
    color: Colors.violet4,
  },
  tagsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  paymentBlock: {
    marginTop: 16,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: "#F1F1F1",
  },

  payRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  paymentAmountPending: {
    fontSize: 20,
    fontFamily: "interBold",
    color: Colors.violet4,
  },

  payButtonSmall: {
    backgroundColor: Colors.violet4,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 14,
  },
  paymentDateText: {
    marginTop: 6,
    fontSize: 14,
    fontFamily: "interLightItalic",
    color: "#1B5E20",
  },

  payButtonSmallText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "interBold",
  },

  paymentAmountApproved: {
    fontSize: 20,
    fontFamily: "interBold",
    color: "#1B5E20",
  },
});