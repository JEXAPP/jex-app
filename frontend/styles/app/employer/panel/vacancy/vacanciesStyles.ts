import { StyleSheet } from "react-native";
import { Colors } from "@/themes/colors";
import { Borders } from "@/themes/borders";

export const vacanciesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
   title: {
    fontSize: 50,
    lineHeight: 60,
    fontFamily: 'titulos',
    color: Colors.violet4,
    marginRight: 10,
    marginTop: 40
  },
  noEventsText: {
    marginTop: 40,
    fontSize: 16,
    textAlign: "center",
    color: Colors.gray3,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 15,
    gap: 8,
  },
  filtersTags: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  vacancyCard: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.white,
    borderRadius: Borders.soft,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vacancyInfo: {
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
  },
  vacancyEstadoBadge: {
    backgroundColor: Colors.gray12,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  vacancyEstadoText: {
    fontSize: 12,
    fontFamily: 'interMedium',
    alignItems: "center",
    color: Colors.gray3,
  },
  vacancyNombre: {
    fontSize: 18,
    fontFamily: 'interBold',
    color: Colors.violet4,
  },
});
