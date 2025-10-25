import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";

export const ChatItemListStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: Colors.white,
    marginBottom: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#5C1E74",
  },
  texts: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 20,
    fontFamily: 'titulos',
    color: Colors.violet4,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 16,
    color: Colors.gray3,
  },
});
