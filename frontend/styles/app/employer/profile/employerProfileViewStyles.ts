// styles/app/employer/profile/employerProfileViewStyles.ts
import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";

export const employerProfileViewStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
  },

  // Header violeta
  topHero: {
    backgroundColor: Colors.violet4,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingTop: 40,
    paddingBottom: 26,
    paddingHorizontal: 20,
  },
  backBtnHero: {
    position: "absolute",
    left: 18,
    top: 44,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonTop: {
    position: "absolute",
    right: 18,
    top: 44,
  },
  topHeroCenter: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 10,
  },
  nameCenter: {
    fontSize: 30,
    fontFamily: "interBold",
    color: Colors.white,
    textAlign: "center",
  },

  // Contenido
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 30,
  },

  descCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  descTitle: {
    fontFamily: "interSemiBold",
    fontSize: 20,
    color: Colors.violet4,
    marginBottom: 8,
  },
  descText: {
    fontFamily: "interLightItalic",
    fontSize: 18,
    color: Colors.gray3,
  },

  // Estados simples
  centerFull: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontFamily: "interMedium",
    fontSize: 14,
    color: Colors.violet4,
    textAlign: "center",
  },
});
