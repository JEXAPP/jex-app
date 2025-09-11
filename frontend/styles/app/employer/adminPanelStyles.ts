import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";

export const adminPanelStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: "row",

    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 50,
    lineHeight: 60,
    fontFamily: 'titulos',
    color: Colors.violet4,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  noEventsText: {
    marginTop: 40,
    fontSize: 16,
    textAlign: "center",
    color: Colors.gray3,
  },
  loadingText: {
    marginTop: 40,
    fontSize: 16,
    textAlign: "center",
    color: Colors.gray3,
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
  cardsContainer: {
    marginTop: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 25,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventEstadoPill: {
  backgroundColor: Colors.gray2, // pill gris
  borderRadius: 12,
  paddingHorizontal: 8,
  paddingVertical: 4,
  marginLeft: 8,
  alignSelf: "center",
},
eventEstadoBadge: {
  position: "absolute",
  top: -25,       // 👈 lo subimos un poquito
  right: 70,     // 👈 lo pegamos a la derecha
  backgroundColor: Colors.gray12,
  borderRadius: 14,
  paddingHorizontal: 10,
  paddingVertical: 4,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  elevation: 3,
},
eventEstadoText: {
  color: Colors.gray3,
  fontSize: 11,
  fontWeight: "600",
  fontFamily: 'interBold',
},

  cardText: {
    fontSize: 17,
    marginLeft: 12,
    fontFamily: 'Bold',
    color: Colors.violet5,
    fontWeight: "500",
  },
  noEventsCard: {
    height: 500,
    width: '90%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  noEventsTitle: {
    fontSize: 20,
    fontFamily: 'interBold',
    color: Colors.violet4,
    marginBottom: 20,
    textAlign: 'center',
  },
  noEventsImage: {
    width: 250,
    height: 250,
    marginBottom: 55,
    marginTop: 45,
    alignSelf: 'center',
  },
  noEventsSubtitle: {
    fontSize: 14,
    fontFamily: 'interItalic',
    color: Colors.gray3,
    textAlign: 'center',
   },

});
