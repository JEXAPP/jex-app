// styles/app/qualiStyles.ts
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
    fontSize: 36,
    fontFamily: "titulos",
    color: Colors.violet4,
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: "#E5E5E5",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 6,
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
  workerCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  workerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  workerImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 12,
  },
  workerName: {
    fontSize: 20,
    fontFamily: "interSemiBold",
    color: Colors.violet4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ratingValue: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.violet4,
    fontFamily: "interMedium",
  },
  commentInput: {
    borderWidth: 1,
    borderColor: Colors.gray3,
    borderRadius: 12,
    padding: 10,
    fontSize: 14,
    minHeight: 40,
    textAlignVertical: "top",
    backgroundColor: "#FAFAFA",
  },
  footer: {
  position: "absolute",
  bottom: 0,
  left: 0,
  borderRadius: 16,
  right: 0,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingVertical: 14,
  paddingHorizontal: 20,
  backgroundColor: "#fff",
  shadowColor: Colors.black,
  shadowOffset: { width: 0, height: -1 },
  shadowOpacity: 0.05,
  shadowRadius: 3,
  elevation: 8,
},
scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  footerText: {
    fontSize: 16,
    fontFamily: "interBold",
    color: Colors.violet4,
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
