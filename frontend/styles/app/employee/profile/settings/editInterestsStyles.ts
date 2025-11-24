// src/styles/app/employee/profile/editInterestsStyles.ts
import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";

export const editInterestsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 10,
    marginBottom: 24,
  },
  title: {
    fontSize: 40,
    fontFamily: 'titulos',
    color: Colors.violet4,
    marginTop: 25,
    textAlign: 'left',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "interItalic",
    color: Colors.gray3,
  },
  scroll: {
    paddingBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
  },
  footer: {
    marginTop: 20
  },
});
