import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";

export const activeJobsStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 70,
    backgroundColor: Colors.gray1,
  },
  title: {
    fontSize: 50,
    fontFamily: 'titulos',
    color: Colors.violet4,
    marginBottom: 10
  },
  scroll: {
    paddingBottom: 40,
    gap: 20,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  eventImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 18,
    fontFamily: "interBold",
    color: Colors.black,
  },
  eventType: {
    fontSize: 14,
    fontFamily: "interRegular",
    color: Colors.gray3,
  },
  daysPill: {
    backgroundColor: Colors.gray1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: -60,
    marginRight: -12,
  },
  daysPillText: {
    fontSize: 12,
    fontFamily: "interSemiBold",
    color: Colors.violet5,
  },
  dateRoleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dateBox: {
    flex: 1,
  },
  dateText: {
    fontSize: 14,
    fontFamily: "interMedium",
    color: Colors.black,
  },
  verticalDivider: {
    width: 1,
    height: "100%",
    backgroundColor: Colors.gray12,
    marginHorizontal: 12,
  },
  roleSalaryBox: {
    flex: 1,
  },
  role: {
    fontSize: 20,
    fontFamily: "interBold",
    color: Colors.violet4,
    marginBottom: 6,
  },
  salaryPill: {
    backgroundColor: Colors.violet4,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  salaryText: {
    fontSize: 14,
    fontFamily: "interBold",
    color: Colors.white,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  horizontalDivider: {
    height: 0.6,
    backgroundColor: Colors.gray12,
    marginVertical: 10,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "interLightItalic",
    color: Colors.gray3,
    marginRight: 15,
  },
  footerArrow: {
    fontSize: 20,
    color: Colors.black,
    fontFamily: "interBold",
    marginRight: 5
  },
  noJobsCard: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    height: 500
  },
  noJobsTitle: {
    fontFamily: 'interBold',
    fontSize: 22,
    color: Colors.violet4,
    marginBottom: 80,
    textAlign: 'center'
  },
  noJobsImage: {
   width: 200,
    height: 200,
    marginBottom: 70
  },
  noJobsSubtitle: {
   fontFamily: 'interMediumItalic',
    fontSize: 15,
    color: Colors.gray3,
    textAlign: 'center'
  },

});
