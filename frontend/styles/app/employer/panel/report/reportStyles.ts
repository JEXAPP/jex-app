import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const eventReportStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray1 },
  header: {
    paddingTop: 10, paddingHorizontal: 20, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  title: { fontSize: 40,
    fontFamily: 'titulos',
    color: Colors.violet4,
    alignSelf: 'center',
    marginTop: 30,
 
  },
  subtitle: { 
    marginBottom: 5, 
    paddingHorizontal: 20, 
    color: Colors.gray3, 
    fontFamily: 'interLightItalic', 
    fontSize: 24 
  },
  scrollContent: { 
    padding: 16, 
    paddingBottom: 36 
  },
  // KPIs
  kpiRow: { 
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 12 
  },
  kpiCard: { 
    flex: 1, 
    padding: 14, 
    borderRadius: 16, 
  },
  kpiLabel: { 
    fontSize: 12, 
    color: Colors.violet4, 
    fontFamily: 'interSemiBold' 
  },
  kpiValue: { 
    fontSize: 28, 
    color: Colors.violet4, 
    fontFamily: 'interBold', 
    marginTop: 4 
  },
  kpiHint: { 
    marginTop: 2, 
    fontSize: 12, color: 
    Colors.gray3, 
    fontFamily: 'interItalic' 
  },

  // Cards
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 18, 
    padding: 16, 
    marginTop: 12 
  },
  cardTitle: { 
    fontSize: 16, 
    color: Colors.violet4, 
    fontFamily: 'titulos', 
    marginBottom: 10 
  },
  emptyText: { 
    color: Colors.gray3, 
    fontFamily: 'interMedium' 
  },

  // Pie + leyenda
  pieRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 18 
  },
  pieLegend: { 
    flex: 1, 
    gap: 8 
  },
  legendItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  legendDot: { 
    width: 10, 
    height: 10, 
    borderRadius: 6 
  },
  legendText: { 
    flex: 1, color: 
    Colors.gray3, 
    fontFamily: 'interMedium' 
  },
  legendQty: { 
    color: Colors.gray3, 
    fontFamily: 'interBold' 
  },

  // Línea
  rowBetween: { 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 15 
  },
  axisLabel: { 
    fontFamily: 'interMedium', 
    color: Colors.gray3, 
    fontSize: 11 
  },
  axisHint: { 
    fontSize: 11, 
    color: Colors.gray3, 
    fontFamily: 'interMedium' 
  },
  chartLegendRow: { 
    marginTop: 10, 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  avgBadge: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6,
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 999,
    backgroundColor: '#FFF7DB', 
  },
  avgText: { 
    fontFamily: 'interBold', 
    color: '#7A5E00', 
    fontSize: 13 
  },

  // Barras horizontales duales por rol
  roleBlock: {
    backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#EFEFEF',
    borderRadius: 12, padding: 12,
  },
  roleLabel: { fontFamily: 'interBold', color: Colors.gray3, marginBottom: 8 },
  dualRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  dualLegendLeft: { width: 70, fontFamily: 'interMedium', color: Colors.gray3, fontSize: 12 },
  dualBarTrack: { flex: 1, height: 12, backgroundColor: '#EDEDED', borderRadius: 999, overflow: 'hidden' },
  dualBarFill: { height: '100%', borderRadius: 999 },
  dualLegendRight: { width: 28, textAlign: 'right', fontFamily: 'interBold', color: Colors.gray3 },

  // Tap hint
  tapHint: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: '#F3F0F9', borderWidth: 1, borderColor: '#E7E0F3' },
  tapHintText: { fontSize: 11, color: Colors.violet4, fontFamily: 'interBold' },

  // —— MODALES centrados ——
  modalBackdropCenter: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center', justifyContent: 'center', padding: 16,
  },
  modalCardCenter: {
    width: '92%', maxHeight: '70%', backgroundColor: '#fff',
    borderRadius: 18, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 16, elevation: 6,
  },
  modalHeader: { 
    flexDirection: 
    'row', alignItems: 
    'center', marginBottom: 8 
  },
  modalTitle: { 
    flex: 1, 
    fontFamily: 'interBold', 
    fontSize: 16, color: 
    Colors.violet4,
    marginBottom: 10
  },
  modalClose: {
    width: 32, 
    height: 32, 
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  modalListContent: { paddingBottom: 4 },

  separator: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 8 },

  // Person row
  personRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  personName: { fontFamily: 'interBold', color: Colors.violet4, fontSize: 14 },
  personRole: { fontFamily: 'interMediumItalic', color: Colors.gray3, fontSize: 12, marginTop: 2 },
  personRight: { fontFamily: 'interBold', color: Colors.violet4 },

  // Grupos dentro del modal de roles (estilos faltantes en tu error)
  detailGroup: { marginBottom: 14, gap: 5 },
  detailGroupTitle: { fontFamily: 'interBoldItalic', fontSize:16,  color: Colors.black, marginBottom: 6 },

  errorText: { marginTop: 10, color: Colors.red, fontFamily: 'interMedium', textAlign: 'center' },
  footerSpace: { height: 24 },
});
