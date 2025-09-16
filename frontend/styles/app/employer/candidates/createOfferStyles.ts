// styles/app/employer/offers/createOfferStyles.ts
import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const createOfferStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray1 },
  headerRow: { paddingHorizontal: 16, paddingTop: 6 },
  backBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: 16, paddingBottom: 40, gap: 16 },

  // modal previo
  modalOverlay: { flex:1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems:'center', justifyContent:'center' },
  modalCard: { width: '90%', backgroundColor: Colors.white, borderRadius: 18, padding: 16, gap: 12 },
  modalTitle: { fontFamily: 'interBold', fontSize: 18, color: Colors.violet4, marginBottom: 4 },
  modalBtn: { backgroundColor: Colors.violet4, height: 50, borderRadius: 16, alignItems:'center', justifyContent:'center' },
  modalBtnText: { color: Colors.white, fontFamily: 'interBold', fontSize: 16 },

  hero: { backgroundColor: Colors.violet4, borderRadius: 18, padding: 16, flexDirection:'row', alignItems:'center', gap: 10 },
  heroAvatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.2)', alignItems:'center', justifyContent:'center' },
  heroName: { color: Colors.white, fontFamily: 'interBold', fontSize: 18 },

  card: { backgroundColor: Colors.white, borderRadius: 18, padding: 16, gap: 8 },
  roleTitle: { color: Colors.violet4, fontFamily: 'interBold', fontSize: 22 },
  roleDesc: { color: Colors.black, fontFamily: 'interMedium', fontSize: 16 },
  reqItem: { color: Colors.black, opacity: .85, marginTop: 2 },

  sectionTitle: { marginTop: 8, color: Colors.violet4, fontSize: 18, fontFamily: 'interBold' },

  shiftItem: { backgroundColor: '#E7E7EA', borderRadius: 16, padding: 12, marginTop: 8 },
  shiftItemActive: { borderWidth: 2, borderColor: Colors.violet4 },
  shiftTime: { fontFamily: 'interBold', fontSize: 17, color: Colors.black },
  shiftPay: { fontFamily: 'interBold', fontSize: 15, color: Colors.black, opacity: .9, marginTop: 2 },
  shiftDate: { color: Colors.black, opacity: .7, marginTop: 2 },

  ctaBtn: { backgroundColor: Colors.violet4, height: 55, borderRadius: 18, alignItems:'center', justifyContent:'center', flexDirection:'row' },
  ctaIcon: { marginRight: 10 },
  ctaText: { color: Colors.white, fontFamily: 'interBold', fontSize: 16 },

  errorText: { color: Colors.violet4, fontFamily: 'interMedium' },
  loadingText: { color: Colors.black, opacity: .7 },
});
