// src/styles/app/employer/profile/rating/employerRatingsStyles.ts
import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";

export const employerRatingsStyles = StyleSheet.create({
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
    textAlign: "left",
    marginLeft: 20,
    marginTop: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  listContent: {},

  // Card de calificación
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    marginRight: 10,
  },

  name: {
    fontSize: 18,
    fontFamily: "interBold",
    color: Colors.violet4,
  },

  datePill: {
    backgroundColor: Colors.gray1,
    borderRadius: 18,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },

  dateText: {
    fontSize: 12,
    fontFamily: "interRegular",
    color: Colors.gray3,
  },

  role: {
    fontSize: 14,
    fontFamily: "interRegular",
    color: Colors.black,
    marginBottom: 10,
  },

  eventName: {
    fontSize: 16,
    fontFamily: "interMediumItalic",
    color: Colors.black,
    marginBottom: 8,
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
    marginTop: 2,
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

  errorText: {
    color: Colors.violet4,
    fontFamily: "interMedium",
    textAlign: "center",
    marginBottom: 12,
  },
});
