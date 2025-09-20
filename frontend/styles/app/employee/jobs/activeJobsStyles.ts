// styles/app/employee/jobs/activeJobsStyles.ts
import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";

export const activeJobsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 48,
    fontFamily: "titulos",
    color: Colors.violet4,
    marginBottom: 20,
    marginTop: 60,
  },
  scroll: {
    paddingBottom: 40,
    gap: 20,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    backgroundColor: Colors.gray12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: -60,
    marginRight: -12,
  },
  daysPillText: {
    fontSize: 12,
    fontFamily: "interMedium",
    color: Colors.black,
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
    backgroundColor: Colors.gray2,
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
  marginTop: 30,
  marginBottom: 20,
},
  horizontalDivider: {
    height: 1,
    backgroundColor: Colors.gray2,
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
    fontFamily: "interRegular",
    color: Colors.gray3,
    marginRight: 10,
  },
  footerArrow: {
    fontSize: 20,
    color: Colors.black,
    fontFamily: "interBold",
  },
  noJobsCard: {
  backgroundColor: Colors.white,
  borderRadius: 15,
  padding: 20,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: -30
},
noJobsTitle: {
  fontSize: 22,
  fontFamily: "interBold",
  color: Colors.violet4,
  marginBottom: 10,
},
noJobsImage: {
  width: 220,
  height: 220,
  marginBottom: 15,
},
noJobsSubtitle: {
  fontSize: 16,
  fontFamily: "interRegular",
  color: Colors.gray3,
  textAlign: "center",
},

});
