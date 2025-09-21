import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";

export const stateOffersStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    paddingHorizontal: 20,
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
    borderRadius: 16,
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
  },
  statusText: { 
    fontSize: 12, 
    fontFamily: "interMedium" 
  },
  statusPendiente: { 
    color: Colors.gray3 
  },
  statusAceptada: { 
    color: Colors.gray3
  },
  statusRechazada: { 
    color: Colors.gray3 
  },
  offerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  employeeImage: {
    width: 80,
    height: 80,
    borderRadius: 27.5,
    marginRight: 12,
    marginTop: 10
  },
  employeeName: { 
    fontSize: 22, 
    fontFamily: 'interBold', 
    marginBottom: 6,
    marginTop: 10,
    color: Colors.violet4
  },
  column: {
    flexDirection: 'column'
  },
  roleText: { 
    fontSize: 18, 
    color: Colors.black, 
    fontFamily: 'interSemiBold',
    marginLeft:5
  },
  salaryPill: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.violet4,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
    minWidth: 60,
  },
  salaryText: { 
    fontSize: 14, 
    color: Colors.white, 
    fontFamily: 'interBold' 
  },
  datePill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 12,
    paddingVertical: 6,
    alignSelf: "stretch",
    marginLeft:5
  },
  date: { 
    marginLeft: 10, 
    fontSize: 15, 
    fontFamily: 'interMediumItalic',
    color: Colors.gray3, 
    textAlign: "center" 
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
    fontFamily: 'interBold',
    textAlign: 'center',
    color: Colors.violet4,
  },
  tagsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
});
