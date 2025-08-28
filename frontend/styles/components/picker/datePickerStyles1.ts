import { Borders } from '@/themes/borders';
import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const datePickerStyles1 = StyleSheet.create({
  /* ---------- Selector cerrado ---------- */
  selector: {
    padding: 17,
    borderRadius: Borders.soft,
    backgroundColor: Colors.white,
  },
  selectorText: {
    fontSize: 16,
    fontFamily: 'interMedium',
    color: Colors.black,
  },

  /* ---------- Modal / contenedor ---------- */
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '92%',
    maxWidth: 420,
    backgroundColor: '#FFF',
    borderRadius: Borders.semirounded,
    padding: 16,
  },

  /* ---------- Tabs Date / Range ---------- */
  tabs: {
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.gray1,
    borderRadius: Borders.rounded,
    padding: 4,
    marginBottom: 10,
  },
  tabItem: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Borders.rounded,
  },
  tabItemActive: {
    backgroundColor: Colors.violet2,
  },
  tabText: {
    fontFamily: 'interMedium',
    color: Colors.gray3,
  },
  tabTextActive: {
    color: Colors.white,
    fontFamily: 'interSemiBold',
  },

  /* ---------- Header (Mes Año izq. + flechas der.) ---------- */
  // título principal (fallback si no usás headerRow)
  title: {
    fontSize: 20,
    fontFamily: 'interBold',
    color: Colors.violet5,
    textAlign: 'center',
    marginBottom: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 10,
    marginRight: 10
  },
  headerMonthText: {
    fontSize: 18,
    fontFamily: 'interSemiBold',
    color: Colors.violet4,
    marginLeft: 10
  },
  headerRowMonth: {
    flexDirection: 'row', 
    gap: 7, 
    alignItems:'center'
  },

  // flechas de navegación
  monthNav: {
    position: 'absolute',
    top: 16,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navBtn: { 
    fontSize: 30, 
    color: Colors.violet5, 
    padding: 6 
  },
  navBtnDisabled: { 
    color: Colors.gray3 
  },

  /* ---------- Year picker ---------- */
  yearList: {
    alignSelf: 'stretch',
    maxHeight: 260,
    marginVertical: 9
  },
  yearItem: {
    borderWidth: 1,
    borderColor: Colors.violet4,
    borderRadius: Borders.soft,
    height: 40,
    marginVertical: 6,
    justifyContent: 'center'
  },
  yearText: {
    textAlign: 'center',
    color: Colors.violet4,
    fontFamily: 'interSemiBold',
  },

  /* ---------- Month picker ---------- */
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    marginTop: 8,
    marginBottom: 6,
  },
  monthItem: {
    width: '30%',
    alignItems: 'center',
    height: 40,
    borderWidth: 1,
    borderColor: Colors.violet4,
    borderRadius: Borders.soft,
    backgroundColor: Colors.white,
    justifyContent: 'center'
  },
  monthItemDisabled: {
    opacity: 0.35,
  },
  monthText: {
    color: Colors.violet4,
    fontFamily: 'interMedium',
    fontSize: 15
  },

  /* ---------- Semana / Calendario ---------- */
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginTop: 10,
    marginBottom: 6,
  },
  weekCell: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontSize: 14,
    color: Colors.gray3,
    fontFamily: 'interMedium',
  },

  // contenedor general del calendario
  grid: {
    marginTop: 6,
    marginBottom: 12,
  },
  // fila dinámica (cuando ocultamos días fuera de rango)
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },

  dayCell: {
    width: 42,       // mantener consistencia visual aun con días ocultos
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  dayText: {
    fontSize: 14,
    fontFamily: 'interMedium',
    color: Colors.black,
  },
  daySelected: {
    backgroundColor: Colors.violet3,
  },
  dayInRange: {
    backgroundColor: Colors.violet2,
  },
  dayTextSelected: {
    color: '#fff',
    fontFamily: 'interSemiBold',
  },
  dayOutMonth: { opacity: 0.35 },
  dayTextOutMonth: { color: Colors.gray3 },
  dayDisabled: { opacity: 0.25 },
  dayTextDisabled: { color: Colors.gray3 },

  /* ---------- Footer ---------- */
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginHorizontal: 8,
    marginVertical: 10,
  },
  clearBtn: {
    height: 45,
    borderRadius: Borders.semirounded,
    backgroundColor: Colors.gray1,
    flexGrow: 1,
    justifyContent: 'center'
  },
  clearText: {
    textAlign: 'center',
    color: Colors.black,
    fontFamily: 'interSemiBold',
  },
  applyBtn: {
    height: 45,
    borderRadius: Borders.semirounded,
    backgroundColor: Colors.violet3,
    flexGrow: 1,
    justifyContent: 'center'
  },
  applyText: {
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'interBold',
  },
  dayRangeEdge: { 
    backgroundColor: Colors.violet3, 
    borderRadius: 8 
  },
  dayRangeMiddle: { 
    backgroundColor: Colors.gray1,   
    borderRadius: 0 
  },
});