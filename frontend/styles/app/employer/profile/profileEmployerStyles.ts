// src/styles/app/employer/profile/profileEmployerStyles.ts
import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";

export const profileEmployerStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.gray1,
  },

  title: {
    fontSize: 50,
    fontFamily: "titulos",
    color: Colors.violet4,
    marginBottom: 20,
  },

  // Card principal
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 30,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 14,
  },
  name: {
    fontSize: 28,
    fontFamily: "interBold",
    color: Colors.violet4,
    textAlign: "center",
  },
  description: {
    marginTop: 6,
    fontSize: 14,
    fontFamily: "interRegular",
    color: Colors.gray3,
    textAlign: "center",
  },

  // Row de tarjetas inferiores
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginHorizontal: 4,
    justifyContent: "center",
  },
  summaryCard2: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginHorizontal: 4,
    maxWidth: 140,
    justifyContent: "center",
  },

  // Rating
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  starsRow: {
    flexDirection: "row",
    marginRight: 6,
  },
  ratingValue: {
    fontSize: 28,
    fontFamily: "interBold",
    color: Colors.violet5,
  },

  summaryCardSubtitle: {
    fontSize: 14,
    fontFamily: "interLightItalic",
    textAlign: "right",
    color: Colors.gray3,
  },
  summaryCardSubtitleCentered: {
    fontSize: 14,
    fontFamily: "interLightItalic",
    color: Colors.gray3,
    textAlign: "center",
    marginTop: 8,
  },
  historyIconWrapper: {
    alignSelf: "center",
    marginBottom: 4,
  },

  // Opciones
  optionsContainer: {
    marginTop: 4,
    marginHorizontal: 5,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
  },
  optionIcon: {
    marginRight: 14,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontFamily: "interMedium",
    color: Colors.gray3,
  },

  // Logout
  logoutContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray2,
    paddingTop: 10,
    marginHorizontal: 5,
    marginBottom: 30,
  },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  logoutText: {
    fontSize: 17,
    fontFamily: "interBold",
    color: Colors.gray3,
    marginLeft: 10,
  },

  // (Opcional, por si más adelante querés algo parecido al placeholder del empleado)
  placeholderCard: {
    backgroundColor: Colors.violet2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    shadowColor: Colors.black,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: "interMedium",
    color: Colors.violet5,
    marginBottom: 12,
    textAlign: "center",
  },
  badgesRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  badgeEmpty: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.violet4,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
});
