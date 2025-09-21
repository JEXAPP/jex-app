import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';
import { Borders } from '@/themes/borders';

export const chooseCandidatesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    marginHorizontal: 20,
   },
  title: {
    fontSize: 50,
    lineHeight: 60,
    fontFamily: 'titulos',
    color: Colors.violet4,
    marginRight: 10,
    marginBottom: 15,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 350,
    marginTop: 20,   
    marginBottom: 20,
  },
  sideSlot: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerSlot: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,  
  },
  eventName: {
    fontSize: 24,
    fontFamily: 'interBold',
    textAlign: 'center',
    color: Colors.violet4,
  },
  roleAnchor: {
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  roleAnchorText: {
    fontSize: 16,
    color: Colors.gray3,
    fontWeight: '600',
  },

  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 8,
  },

  // Badge wrapper para notificaciones del turno (si las agregaras)
  badgeContainer: { position: 'relative' },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#C63A25',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: Colors.white, fontSize: 11, fontWeight: '700' },

  loadingBox: { paddingVertical: 8 },
  error: { color: '#B00020', marginBottom: 8 },

  column: {
    gap: 12,
    justifyContent: 'space-between',
  },

  card: {
    // Antes probablemente tenías flex: 1; quitalo:
    width: '48%',                // 2 columnas
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },

  avatarWrap: { alignItems: 'center', marginBottom: 8, justifyContent: 'center' },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.gray2 },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.violet4,
    textAlign: 'center',
    marginBottom: 6,
  },
  emptyBox: { 
    height: 500,
    width: 350,
    backgroundColor: Colors.white,
    borderRadius: 12,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 60, 
  },
  emptyBox2: { 
    height: 500,
    width: 350,
    backgroundColor: Colors.white,
    borderRadius: 12,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20, 
  },
  emptyBox3: { 
    height: 300,
    width: 350,
    backgroundColor: Colors.white,
    borderRadius: 12,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20, 
  },
  emptyImage: {
    width: 250,
    height: 250,
    marginBottom: 55,
    marginTop: 65,
    alignSelf: 'center',
  },
  emptyImage2: {
    width: 200,
    height: 200,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
  emptyImage3: {
    width: 180,
    height: 180,
    marginBottom: 10,
    marginTop: 20,
    alignSelf: 'center',
  },
  emptyTitle: { 
    fontSize: 20,
    fontFamily: 'interBold',
    color: Colors.violet4,
    textAlign: 'center',
  },
  emptySubtitle: { 
    fontSize: 14,
    fontFamily: 'interItalic',
    color: Colors.gray3,
    textAlign: 'center',
  },
    // --- rating ---
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.gray12,
    borderRadius: Borders.soft,
    width: 120
  },
  starsRow: {
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingPill: {

  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'interSemiBold',
    color: Colors.gray3,
  },
  topInfoRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
  gap: 12,
},

scheduleCard: {
  flex: 1,
  backgroundColor: Colors.white,
  borderRadius: 16,
  paddingVertical: 10,
  paddingHorizontal: 16,
  // sombra si usás
},
scheduleCardSplit: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},
scheduleCol: {
  flex: 1,
  alignItems: 'center',
},
scheduleTitle: {
  fontFamily: 'interBold',
  fontSize: 16,
  color: Colors.gray3,
  textAlign: 'center',
},
scheduleTimesRow: {
  marginTop: 6,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},
scheduleTime: {
  fontFamily: 'interSemiBold',
  fontSize: 14,
  color: Colors.gray3,
},
scheduleDash: {
  marginHorizontal: 5,
  fontSize: 14,
  color: Colors.gray3,
},
offersCard: {
  width: 140,
  backgroundColor: Colors.violet2, // tu gris oscuro del mock
  borderRadius: 16,
  paddingVertical: 10,
  paddingHorizontal: 16,
  alignItems: 'center',
  justifyContent: 'center',
},
offersMain: {
  fontFamily: 'interBold',
  fontSize: 18,
  color: Colors.white,
},
offersSub: {
  marginTop: 4,
  fontFamily: 'interItalic', // o interMedium + fontStyle:'italic'
  fontSize: 12,
  color: Colors.white,
},
});
