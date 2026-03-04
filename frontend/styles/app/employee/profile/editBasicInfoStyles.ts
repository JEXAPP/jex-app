// styles/app/employee/profile/edit/editBasicInfoStyles.ts
import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";

export const editBasicInfoStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },
  title: {
    fontSize: 40,
    fontFamily: "titulos",
    color: Colors.violet4,
    textAlign: "left",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "interMedium",
    color: Colors.gray3,
    marginTop: 6,
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  profileImageWrapper: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 999,
  },

  form: {
    gap: 14,
  },

  aboutWrapper: {
    marginTop: 20,
  },
  sectionLabel: {
    fontFamily: "interSemiBold",
    fontSize: 14,
    color: Colors.violet4,
    marginBottom: 6,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 26,
  },
  cancelText: {
    fontSize: 16,
    color: Colors.gray3,
  },
});
