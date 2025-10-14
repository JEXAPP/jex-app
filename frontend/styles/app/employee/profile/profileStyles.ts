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
    marginRight: 14,
    borderWidth: 1,
    borderColor: Colors.violet5,
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
    shadowColor: Colors.black,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
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
  commentsRow: {
    flexDirection: "row",
    alignItems: "center",
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
    paddingTop: 16,
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
});
