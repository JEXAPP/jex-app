import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";

export const footerNavStyles2 = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: Colors.gray1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    //borderWidth: 1,
    //borderColor: Colors.violet4,

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -2 },

    elevation: 14,
  },

  item: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
});