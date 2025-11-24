// styles/app/employee/profile/qualifyStyles.ts
import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";

export const qualifyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    paddingHorizontal: 20,
    paddingTop: 50,
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
    padding: 25,
    marginBottom: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginRight: 14,
  },
  name: {
    fontSize: 25,
    fontFamily: "interBold",
    color: Colors.violet4,
  },
  event: {
    fontSize: 18,
    fontFamily: "interMediumItalic",
    color: Colors.violet4,
  },
  eventDetail: {
    fontSize: 15,
    fontFamily: "interRegular",
    color: Colors.gray3,
    marginTop: 2,
  },

  // Rol
  sectionTitle: {
    fontSize: 23,
    fontFamily: "interBold",
    marginBottom: 4,
    color: Colors.violet4,
  },
  question: {
    fontSize: 16,
    fontFamily: "interRegular",
    color: Colors.gray3,
    marginBottom: 14,
  },

  // Estrellas
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  ratingValue: {
    fontSize: 20,
    marginLeft: 8,
    fontFamily: "interBold",
    color: Colors.violet4,
  },

  // Comentario
 // Comentario
commentBox: {
  marginTop: 12,
},
commentLabel: {
  fontSize: 16,            // 🔹 más grande
  fontFamily: "interMedium",
  color: Colors.violet4,
  marginBottom: 6,
},
commentInput: {
  borderWidth: 1,
  borderColor: Colors.gray12,
  borderRadius: 14,
  paddingHorizontal: 12,
  paddingVertical: 10,
  fontSize: 15,            // 🔹 un poco más grande
  fontFamily: "interRegular",
  minHeight: 40,
  maxHeight: 120,
  textAlignVertical: "top",
  backgroundColor: Colors.white,
},
commentCounter: {
  fontSize: 13,
  fontFamily: "interRegular",
  color: Colors.gray3,
  textAlign: "right",
  marginTop: 4,
},

// Botón
// Botón
button: {
  position: "absolute",    
  bottom: 20,              
  alignSelf: "center",     
  width: "50%",           
  borderRadius: 14,
  paddingVertical: 14,
  alignItems: "center",
  backgroundColor: Colors.violet4,         
},

  buttonOmit: {
    backgroundColor: Colors.violet4,
  },
  buttonSubmit: {
    backgroundColor: Colors.violet4,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "interBold",
  },
  buttonTextOmit: {
    color: "#fff",
  },
  buttonTextSubmit: {
    color: "#fff",
  },
});
