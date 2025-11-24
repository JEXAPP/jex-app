import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";
import { Borders } from "@/themes/borders";

export const rowButtonStyles2 = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: Colors.white,
    borderRadius: Borders.soft,
    padding: 10, 
    marginBottom: 20
  },
  iconWrapper: {
    width: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontFamily: "interMedium",
    color: Colors.gray3,
  },
  rightIconWrapper: {
    width: 24,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
