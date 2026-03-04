// src/styles/app/employee/profile/profileSettingsStyles.ts
import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";

export const profileSettingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 40,
    fontFamily: 'titulos',
    color: Colors.violet4,
    marginVertical: 20,
    textAlign: 'left'
  },
  listContainer: {
    marginTop: 4,
  },
});
