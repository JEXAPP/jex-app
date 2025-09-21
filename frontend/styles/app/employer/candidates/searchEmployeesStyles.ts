import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const searchEmpScreenStyles = StyleSheet.create({
  container: { 
    backgroundColor: Colors.gray1 
  },
  pagePadding: { 
    paddingHorizontal: 20, 
  },
  h1: { 
    fontSize: 28, 
    fontFamily: 'interBold', 
    color: Colors.violet4, 
    marginBottom: 10 
  },
  // Globos (sin borde)
  bubbleCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  // Header del globo (clickable, sin flechas ni imágenes)
  bubbleHeaderOnly: {
    paddingBottom: 8,
  },
  bubbleHeaderText: {
    fontSize: 16,
    fontFamily: 'interSemiBold',
    color: Colors.gray3,
  },
  // Hero (imagen + título violeta dentro del globo)
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  heroImg: { 
    width: 64, 
    height: 64, 
    resizeMode: 'contain' 
  },
  heroImg2: { 
    width: 90, 
    height: 90, 
    resizeMode: 'contain' 
  },
  heroImg3: { 
    width: 140, 
    height: 70, 
    resizeMode: 'contain' 
  },
  heroTitleViolet: { 
    fontSize: 20, 
    fontFamily: 'interBold', 
    color: Colors.violet4 
  },
  heroTitleVioletRight: {
    fontSize: 20, 
    fontFamily: 'interBold', 
    color: Colors.violet4, 
    textAlign: 'center', 
    maxWidth: 160, 
    marginTop: 8,
  },
  heroSubtitle: { 
    fontSize: 15, 
    fontFamily: 'interItalic',
    color: Colors.violet4, 
    marginTop: -4 
  },
  // Split disponibilidad (inputs a la izquierda, imagen + título a la derecha)
  splitRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },
  splitLeft: { 
    flex: 1, 
    gap: 12 
  },
  splitRight: { 
    width: 150, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  // Rating
  ratingControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  ratingNumber: { 
    minWidth: 22, 
    textAlign: 'center', 
    fontSize: 16, 
    fontWeight: '700', 
    color: Colors.violet4 
  },
  starsRight: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4, 
    marginLeft: 'auto' 
  },
  // Footer
  actionsRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clearAllText: { 
    fontSize: 16, 
    color: Colors.gray3, 
    fontWeight: '600' 
  },
});
