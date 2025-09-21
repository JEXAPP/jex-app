import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";

export const adminPanelStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
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
    marginBottom: 10,
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
    backgroundColor: Colors.gray12,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'center',
    marginBottom: 10
  },
  eventEstadoText: {
    color: Colors.gray3,
    fontSize: 11,
    fontFamily: 'interBold',
  },

  cardText: {
    fontSize: 17,
    marginLeft: 12,
    fontFamily: 'interSemiBold',
    color: Colors.violet4,
  },
  noEventsCard: {
    height: 500,
    width: 350,
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
