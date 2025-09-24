// styles/app/employer/panel/qualification/qualiStyles.ts
import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";

export const qualiStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 40,
    fontFamily: "titulos",
    color: Colors.violet4,
    marginBottom: 20,
  },

  // Tabs de roles
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: Colors.gray12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  filterButtonActive: {
    backgroundColor: Colors.violet4,
  },
  filterText: {
    fontSize: 15,
    color: Colors.violet4,
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#fff",
  },

  // Card trabajador
  workerCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 3,
  },
  workerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  workerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 14,
  },
  workerName: {
    fontSize: 18,
    fontFamily: "interBold",
    color: Colors.violet4,
  },
  workerRole: {
    fontSize: 14,
    color: Colors.gray3,
    marginTop: 2,
    fontFamily: "interMedium",
  },

  // Chips
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  chipActive: {
    backgroundColor: Colors.violet4,
  },
  chipDisabled: {
    backgroundColor: Colors.gray1,
    borderWidth: 1,
    borderColor: Colors.gray3,
  },
  chipOutline: {
    borderWidth: 1,
    borderColor: Colors.violet4,
    backgroundColor: "#fff",
  },
  chipText: {
    fontSize: 13,
    fontFamily: "interSemiBold",
  },
  chipTextActive: {
    color: "#fff",
  },
  chipTextDisabled: {
    color: Colors.gray3,
  },

  // Rating
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingValue: {
    marginLeft: 6,
    fontSize: 13,
    color: Colors.gray3,
    fontFamily: "interMedium",
  },

  // Comentarios
  commentBox: {
    marginTop: 8,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: Colors.gray2,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    minHeight: 40,
    maxHeight: 120,
    textAlignVertical: "top",
    backgroundColor: Colors.gray1,
  },
  commentCounter: {
    fontSize: 11,
    color: Colors.gray3,
    textAlign: "right",
    marginTop: 4,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  progressBarBackground: {
    height: 6,
    borderRadius: 4,
    backgroundColor: Colors.gray2,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressBarFill: {
    height: 6,
    borderRadius: 4,
    backgroundColor: Colors.violet4,
  },
  footerText: {
    fontSize: 13,
    fontFamily: "interMedium",
    color: Colors.gray3,
  },
  registerButton: {
    backgroundColor: Colors.violet4,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 16,
  },
  registerButtonText: {
    fontSize: 16,
    fontFamily: "interBold",
    color: "#fff",
  },
});
