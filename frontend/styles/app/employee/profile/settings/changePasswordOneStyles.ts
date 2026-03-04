import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";

export const changePasswordOneStyles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 40,
    fontFamily: "titulos",
    color: Colors.violet4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 20,
    marginTop: 20,
    fontFamily: "interMediumItalic",
    color: Colors.gray3,
  },
  body: {
    marginTop: 24,
  },
  optionsContainer: {
    marginTop: 8,
  },
});