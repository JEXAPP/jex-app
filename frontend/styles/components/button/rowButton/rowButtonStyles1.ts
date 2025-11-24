import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";

export const rowButtonStyles1 = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
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
