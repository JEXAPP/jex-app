import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";

export const qualiStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 40,
    fontFamily: "titulos",
    color: Colors.violet4,
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: Colors.gray12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  filterButtonActive: {
    backgroundColor: Colors.violet4,
  },
  filterText: {
    fontSize: 15,
    color: Colors.violet4,
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#fff",
  },

  workerCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 3,
  },
  workerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  workerImageContainer: {
    position: "relative",
  },
  workerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 14,
  },

  // ✅ Ícono de asistencia
  attendanceIcon: {
    position: "absolute",
    bottom: -4,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  attendanceIconTrue: {
    backgroundColor: Colors.violet4,
  },
  attendanceIconFalse: {
    backgroundColor: Colors.red,
  },

  workerName: {
    fontSize: 18,
    fontFamily: "interBold",
    color: Colors.violet4,
  },
  workerRole: {
    fontSize: 14,
    color: Colors.gray3,
    marginTop: 2,
    fontFamily: "interMedium",
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  chipActive: {
    backgroundColor: Colors.violet4,
  },
  chipDisabled: {
    backgroundColor: Colors.gray1,
    borderWidth: 1,
    borderColor: Colors.gray3,
  },
  chipOutline: {
    borderWidth: 1,
    borderColor: Colors.violet4,
    backgroundColor: "#fff",
  },
  chipText: {
    fontSize: 13,
    fontFamily: "interSemiBold",
  },
  chipTextActive: {
    color: "#fff",
  },
  chipTextDisabled: {
    color: Colors.gray3,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingValue: {
    marginLeft: 6,
    fontSize: 16,
    color: Colors.violet4,
    fontFamily: "interMedium",
  },

  commentBox: {
    marginTop: 8,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: Colors.gray2,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    minHeight: 40,
    maxHeight: 120,
    textAlignVertical: "top",
    backgroundColor: Colors.gray1,
  },
  commentCounter: {
    fontSize: 11,
    color: Colors.gray3,
    textAlign: "right",
    marginTop: 4,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  progressBarBackground: {
    height: 6,
    borderRadius: 4,
    backgroundColor: Colors.gray2,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressBarFill: {
    height: 6,
    borderRadius: 4,
    backgroundColor: Colors.violet4,
  },
  footerText: {
    fontSize: 13,
    fontFamily: "interMedium",
    color: Colors.gray3,
  },
  registerButton: {
    backgroundColor: Colors.violet4,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 16,
  },
  registerButtonText: {
    fontSize: 16,
    fontFamily: "interBold",
    color: "#fff",
  },

  // 🟣 "Ya calificaste a todos"
  noEventsCard: {
    height: 500,
    width: 350,
    backgroundColor: Colors.white,
    borderRadius: 12,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  noEventsTitle: {
    fontSize: 20,
    fontFamily: "interBold",
    color: Colors.violet4,
    marginBottom: 20,
    textAlign: "center",
  },
  noEventsImage: {
    width: 210,
    height: 210,
    marginBottom: 55,
    marginTop: 25,
    alignSelf: "center",
  },
  noEventsSubtitle: {
    fontSize: 14,
    fontFamily: "interItalic",
    color: Colors.gray3,
    textAlign: "center",
  },
    qrIconContainer: {
  position: "absolute",
  bottom: -5,
  right: 10,
  alignSelf: "center",
  width: 24,
  height: 24,
  borderRadius: 21,
  backgroundColor: Colors.violet4,
  alignItems: "center",
  justifyContent: "center",
  shadowColor: Colors.black,
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.25,
  shadowRadius: 3.5,
  elevation: 6,
},
qrIconContainerInactive: {
  backgroundColor: Colors.violet4, // sigue violeta
  opacity: 0.9,
},
qrIcon: {
  fontSize: 16,
  color: "#fff",
},

// ❌ Cruz roja perfecta
crossOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  alignItems: "center",
  justifyContent: "center",
},
crossLine: {
  position: "absolute",
  width: 2,       // grosor de la línea
  height: 24,     // largo de la línea
  backgroundColor: Colors.red,
  borderRadius: 1,
},
crossLine1: {
  transform: [{ rotate: "45deg" }],
},
crossLine2: {
  transform: [{ rotate: "-45deg" }],
},

});
