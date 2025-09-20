import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";

export const stateOffersStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 44,
    fontFamily: "titulos",
    color: Colors.violet4,
    marginBottom: 30,
    marginTop: 35,
  },

  /* -------------------- EVENT HEADER -------------------- */
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  eventNameContainer: {
    backgroundColor: "#E5E5E5",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginHorizontal: 8,
    maxWidth: "70%", // evita que tape los botones
    flexShrink: 1,   // permite que haga wrap
  },
    eventStateBadge: {
    position: "absolute",
    top: -25,
    right: 50,
    backgroundColor: "#E5E5E5",
    borderRadius: 14,
    paddingVertical: 3,
    paddingHorizontal: 10,
   
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  eventStateText: {
    fontSize: 12,
    color: "#444",
    fontStyle: "italic",
    fontWeight: "500",
  },
  eventName: {
    fontSize: 18,
    fontFamily: "titulos",
    fontWeight: "600",
    color: Colors.violet4,
    textAlign: "center",
    flexWrap: "wrap", // permite salto de línea
  },
  eventNavButton: {
    backgroundColor: "#E5E5E5",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  /* -------------------- FILTERS -------------------- */
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

  /* -------------------- OFFER CARD -------------------- */
  offerCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    marginTop: 12,
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
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
  statusText: { fontSize: 12, fontWeight: "600" },
  statusPendiente: { color: Colors.gray3 },
  statusAceptada: { color: Colors.violet4 },
  statusRechazada: { color: Colors.gray3 },

  offerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  employeeImage: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    marginRight: 12,
  },
  employeeName: { fontSize: 18, fontWeight: "700", marginBottom: 6 },

  rowPills: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap", // ✅ ahora se acomodan si no entran
  },
  rolePill: {
    backgroundColor: Colors.gray1,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 4, // cuando hace wrap, se separan bien
  },
  roleText: { fontSize: 14, color: "#333", fontWeight: "500" },
  salaryPill: {
    backgroundColor: Colors.violet4,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  salaryText: { fontSize: 14, color: "#fff", fontWeight: "700" },

  datePill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.gray1,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 8,
    alignSelf: "stretch",
  },
  date: { marginLeft: 6, fontSize: 13, color: Colors.gray3, textAlign: "center" },

  /* -------------------- EMPTY STATES -------------------- */
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
    backgroundColor: Colors.gray12,
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
  marginBottom: 10, // control del espacio entre texto e imagen
  textAlign: "center",
},
noEventsImage: {
  width: 250,  // un poco más chica
  height: 250,
  marginTop: 5, // control del espacio entre texto e imagen
}



});
