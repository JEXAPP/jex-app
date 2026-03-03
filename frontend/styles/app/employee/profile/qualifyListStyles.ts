import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";

export const listStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    position: "relative",
  },
  backBtnHero: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerImage: {
    position: "absolute",
    top: 0,
    right: -20,
    width: 200,
    height: 200,
    opacity: 0.08,
  },

  title: {
    fontSize: 34,
    fontFamily: "titulos",
    color: Colors.violet4,
    marginBottom: 24,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 25,
    marginBottom: 18,
    shadowColor: Colors.black,
    borderLeftWidth: 4,
    borderLeftColor: Colors.violet4,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  cardIcon: {
    marginRight: 8,
  },

  cardDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  eventName: {
    fontSize: 19,
    fontFamily: "interBold",
    color: Colors.violet4,
    flexShrink: 1,
  },

  eventDetail: {
    fontSize: 14,
    fontFamily: "interLightItalic",
    color: Colors.gray3,
    marginTop: 2,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  error: {
    fontSize: 16,
    color: Colors.red,
    fontFamily: "interMedium",
  },

  empty: {
    fontSize: 16,
    fontFamily: "interMedium",
    color: Colors.gray3,
  },
});
