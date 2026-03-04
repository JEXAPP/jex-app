import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";

export const changePasswordTwoStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 65,
  },
  image: {
    width: 130,
    height: 130,
    marginRight: 10,
    marginLeft: 20,
  },
  title: {
    fontSize: 42,
    fontFamily: "titulos",
    color: Colors.violet4,
    textAlign: "left",
    flexShrink: 1,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "interBold",
    marginBottom: 25,
    color: Colors.violet4,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
  },
});
