import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const adminDashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 40,
    fontFamily: 'titulos',
    color: Colors.violet4,
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 40,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginHorizontal: 4,
  },
  summaryLabel: {
    fontSize: 16,
    fontFamily: 'interRegular',
    color: Colors.gray3,
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 25,
    fontFamily: 'interBold',
    color: Colors.violet4,
  },
  chartsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
    alignItems: 'center'
  },
  chartCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 12,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 12,
    justifyContent: 'center'
  },
  chartTitle: {
    fontSize: 20,
    fontFamily: 'interLightItalic',
    color: Colors.gray3,
    marginBottom: 20,
    marginLeft: 5,
  },
  emptyChartText: {
    fontSize: 13,
    fontFamily: 'interRegular',
    color: Colors.gray3,
    marginTop: 10,
    textAlign: 'center',
  },
  // Pie + leyenda
  pieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendContainer: {
    flex: 1,
    marginLeft: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 12,
    fontFamily: 'interRegular',
    color: Colors.gray3,
  },
  pieCenterNumber: {
    fontSize: 18,
    fontFamily: 'interBold',
    color: Colors.violet4,
    textAlign: 'center',
  },
  pieCenterLabel: {
    fontSize: 11,
    fontFamily: 'interRegular',
    color: Colors.gray3,
    textAlign: 'center',
  },
  filtersContainer: {
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'interBold',
    color: Colors.violet4,
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.gray3,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: Colors.violet4,
    borderColor: Colors.violet4,
  },
  filterChipText: {
    fontSize: 13,
    fontFamily: 'interMedium',
    color: Colors.gray3,
  },
  filterChipTextActive: {
    color: '#fff',
  },
  listSeparator: {
    height: 10,
  },
  complaintCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  complaintReason: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'interBold',
    color: Colors.violet4,
    marginRight: 8,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.gray1,
  },
  statusPillText: {
    fontSize: 11,
    fontFamily: 'interMedium',
    color: Colors.violet4,
  },
  complaintDate: {
    fontSize: 12,
    fontFamily: 'interLightItalic',
    color: Colors.gray3,
    marginBottom: 6,
  },
  partiesRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  partyColumn: {
    flex: 1,
  },
  partyLabel: {
    fontSize: 11,
    fontFamily: 'interMedium',
    color: Colors.gray3,
  },
  partyName: {
    fontSize: 14,
    fontFamily: 'interBold',
    color: Colors.black,
  },

  // NUEVO: contacto penalizado
  contactRow: {
    flexDirection: 'row',
    marginBottom: 8,
    marginTop: 4,
  },
  contactColumn: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 11,
    fontFamily: 'interMedium',
    color: Colors.gray3,
  },
  contactValue: {
    fontSize: 13,
    fontFamily: 'interRegular',
    color: Colors.black,
  },

  // NUEVO: evento (imagen + texto)
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 4,
  },
  eventImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: Colors.gray1,
  },
  eventInfoColumn: {
    flex: 1,
  },
  eventLabel: {
    fontSize: 11,
    fontFamily: 'interMedium',
    color: Colors.gray3,
    marginBottom: 2,
  },
  eventName: {
    fontSize: 14,
    fontFamily: 'interBold',
    color: Colors.black,
  },
  eventContext: {
    fontSize: 12,
    fontFamily: 'interRegular',
    color: Colors.gray3,
    marginTop: 2,
  },

  // NUEVO: comentarios
  complaintComments: {
    marginTop: 6,
    fontSize: 13,
    fontFamily: 'interItalic',
    color: Colors.gray3,
  },

  // Logout
  logoutContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray12,
    paddingTop: 10,
    marginHorizontal: 5,
    marginBottom: 30,
    marginTop: 40,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  logoutText: {
    fontSize: 17,
    fontFamily: 'interBold',
    color: Colors.gray3,
    marginLeft: 10,
  },
});
