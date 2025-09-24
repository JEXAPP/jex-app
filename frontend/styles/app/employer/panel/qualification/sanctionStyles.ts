// styles/app/employer/panel/qualification/sanctionStyles.ts
import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";

export const sanctionStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: "titulos",
    color: Colors.violet4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.gray3,
    fontFamily: "interMedium",
    marginTop: 4,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
  },
  workerCard: {
    alignItems: "center",
    backgroundColor: Colors.gray1,
    borderRadius: 16,
    padding: 20,
    width: "100%",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  workerImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: Colors.violet4,
    marginBottom: 12,
  },
  workerName: {
    fontSize: 22,
    fontFamily: "interBold",
    color: Colors.violet4,
  },
  workerRole: {
    fontSize: 14,
    fontFamily: "interMedium",
    color: Colors.gray3,
    marginTop: 4,
  },
  goBackContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  goBack: {
    fontSize: 15,
    fontFamily: "interBold",
    color: Colors.violet4,
    marginLeft: 6,
  },
  optionsContainer: {
    width: "100%",
    marginBottom: 30,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.gray2,
    marginBottom: 12,
  },
  optionButtonActive: {
    backgroundColor: Colors.violet4,
    borderColor: Colors.violet4,
  },
  optionText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "interMedium",
  },
  optionTextActive: {
    color: "#fff",
  },
  footer: {
    padding: 15,
  },
  helperText: {
    textAlign: "center",
    fontSize: 13,
    color: Colors.gray3,
    marginBottom: 8,
  },
  registerButton: {
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.violet4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  registerButtonDisabled: {
    backgroundColor: Colors.gray2,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "interBold",
  },
  registerButtonTextDisabled: {
    color: Colors.gray3,
  },
});
