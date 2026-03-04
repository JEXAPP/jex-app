// src/styles/app/employer/profile/events-history/employerEventsHistoryStyles.ts
import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";

export const employerEventsHistoryStyles = StyleSheet.create({
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
    fontFamily: "titulos",
    color: Colors.violet4,
    alignSelf: "center",
    marginLeft: 20,
    marginTop: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  listContent: {},

  // Card general
  card: {
    backgroundColor: "#fff",
    borderRadius: 26,
    marginBottom: 18,
    overflow: "hidden",
  },

  // Header morado del card (imagen + nombre del evento)
  cardHeader: {
    backgroundColor: Colors.violet4,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },

  eventRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  eventLogo: {
    marginRight: 10,
    borderRadius: 12,
  },

  eventName: {
    fontSize: 20,
    fontFamily: "interBold",
    color: "#ffffff",
    flexShrink: 1,
  },

  // Cuerpo blanco del card (descripción)
  body: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  descriptionText: {
    fontSize: 14,
    fontFamily: "interRegular",
    color: Colors.gray3,
    lineHeight: 21,
  },

  errorText: {
    marginTop: 10,
    textAlign: "center",
    color: Colors.violet4,
    fontFamily: "interMedium",
  },
});
