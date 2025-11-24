import { Borders } from '@/themes/borders';
import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const createVacancyStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: Colors.gray1,
    paddingHorizontal: 20,
  },
  vacancyCard: {
    borderWidth: 2,
    borderColor: Colors.violet4,
    borderRadius: Borders.soft,
    padding: 20,
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 20,
    fontFamily: 'interBold',
    color: Colors.violet4,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  subtitleButtons: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 15,
    gap: 95,
  },
  title: {
    fontSize: 42,
    fontFamily: 'titulos',
    color: Colors.violet4,
    textAlign: 'left',
    flexShrink: 1,
  },
  image: {
    width: 130,
    height: 130,
    marginRight: 10,
    marginLeft: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50,
    gap: 10,
  },
  requerimientoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  turnoContainer: {
    borderRadius: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
    backgroundColor: Colors.violet2,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  shiftTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
    gap: 15,
  },
  turnoTitulo: {
    fontSize: 18,
    fontFamily: 'interBold',
    color: Colors.white,
  },
  shiftRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  lastButtons: {
    alignItems: 'center',
    gap: 10,
  },

  paymentButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 14,
    backgroundColor: Colors.white,
  },
  paymentButtonLabel: {
    fontFamily: 'interRegular',
    fontSize: 13,
    color: Colors.gray3,
    marginBottom: 4,
  },
  paymentButtonValue: {
    fontFamily: 'interMedium',
    fontSize: 16,
    color: Colors.gray3,
  },

  paymentModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentModalCard: {
    width: '85%',
    backgroundColor: Colors.gray1,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  paymentModalTitle: {
    fontFamily: 'interBold',
    fontSize: 18,
    color: Colors.violet4,
    marginBottom: 6,
  },
  paymentModalHint: {
    fontFamily: 'interLightItalic',
    fontSize: 15,
    color: Colors.gray3,
    marginBottom: 12,
  },
  paymentModalHint2: {
    fontFamily: 'interMedium',
    fontSize: 15,
    color: Colors.gray3,
    marginBottom: 12,
  },
  paymentModalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 10,
  },
  paymentModalLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 10,
  },
});
