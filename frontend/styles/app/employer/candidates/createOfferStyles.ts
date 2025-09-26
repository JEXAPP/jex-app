import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';
import { Borders } from '@/themes/borders';

export const createOfferStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
  },

  /* HEADER */
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.violet4,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerName: {
    color: Colors.white,
    fontFamily: 'interBold',
    fontSize: 22,
  },
  linkedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  linkedText: {
    marginLeft: 6,
    color: Colors.white,
    fontFamily: 'interLightItalic',
  },

  /* SCROLL */
  scroll: {
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  detailTitle: {
    color: Colors.violet4,
    fontFamily: 'interBold',
    fontSize: 35,
    marginBottom: 4,
  },
  detailDesc: {
    color: Colors.black,
    fontFamily: 'interLightItalic',
    fontSize: 18,
    marginBottom: 6,
  },
  detailReqTitle: {
    color: Colors.black,
    fontFamily: 'interMedium',
    fontSize: 18,
    marginBottom: 6,
  },
  detailReqItem: {
    color: Colors.black,
    fontFamily: 'interLightItalic',
    fontSize: 16,
    marginLeft: 10,
  },
  /* SECCIONES */
  sectionTitle: {
    color: Colors.violet4,
    fontFamily: 'interSemiBold',
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
  },
  sectionSubtitle: {
    color: Colors.gray3,
    fontFamily: 'interMedium',
    marginTop: 2,
    marginBottom: 6,
  },
  /* INPUT/DATE/TIME: estilos simples */
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray12,
    borderRadius: Borders.soft,
    minHeight: 64,
    paddingHorizontal: 14,
    paddingTop: 12,
    textAlignVertical: 'top',
    fontFamily: 'interMedium',
    color: Colors.black,
    marginTop: 8,
  },
  datePicker: { marginTop: 8 },
  timePicker: { marginTop: 8 },

  /* DROPDOWN2 (campo) */
  dd2Input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray12,
    borderRadius: Borders.soft,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
    fontFamily: 'interMedium',
    color: Colors.black,
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: Colors.gray1,
    borderRadius: Borders.soft,
    padding: 16,
  },
  modalTitle: {
    color: Colors.violet4,
    fontFamily: 'interBold',
    alignSelf: 'center',
    fontSize: 20,
    marginBottom: 20,
  },
  modalCancelBoton: {
    backgroundColor: Colors.gray12,
    borderRadius: Borders.soft,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  modalCancelTexto: {
    color: Colors.black,
    fontFamily: 'interBold',
  },
  shiftBlock: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 20,
    height: undefined,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    gap: 4,
  },
  shiftBlockSelected: {
    backgroundColor: Colors.violet3,
  },
  shiftRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shiftTime: {
    fontFamily: 'interSemiBold',
    fontSize: 16,
    color: Colors.black,
  },
  shiftTimeSelected: {
    color: Colors.white,
  },
  shiftPay: {
    fontFamily: 'interBold',
    fontSize: 15,
    color: Colors.black,
  },
  shiftPaySelected: {
    color: Colors.white,
  },
  shiftDateLine: {
    marginTop: 4,
    color: Colors.black,
    fontFamily: 'interRegular',
    fontSize: 14
  },
  shiftDateLineSelected: {
    color: Colors.white,
  },
  buttonRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
