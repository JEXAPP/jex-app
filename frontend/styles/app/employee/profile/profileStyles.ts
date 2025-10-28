import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 50,
    marginRight: 14
  },
  name: {
    fontSize: 28,
    fontFamily: "interBold",
    color: Colors.violet4,
    marginLeft: 4,
  },

  // Rating
  ratingCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 18,
    marginBottom: 30,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  starsRow: {
    flexDirection: "row",
    marginRight: 8,
  },
  ratingValue: {
    fontSize: 18,
    fontFamily: "interBold",
    color: Colors.violet5,
  },
  ratingComments: {
    fontSize: 14,
    fontFamily: "interMedium",
    fontStyle: "italic",
    color: Colors.gray3,
    marginRight: 6,
  },

  // Opciones
  optionsContainer: {
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
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
    borderTopColor: Colors.gray3,
    paddingTop: 12,
    marginBottom: 30,
  },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.gray12,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 17,
    fontFamily: "interBold",
    color: Colors.gray3,
    justifyContent: "center",
  },

  // ✨ Placeholder estético
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
