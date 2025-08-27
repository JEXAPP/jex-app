import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const chooseCandidatesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: Colors.violet4,
    marginBottom: 8,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sideSlot: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventName: {
    flexShrink: 1,
    fontSize: 28,
    fontWeight: '700',
    color: Colors.violet4,
    textAlign: 'center',
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

  // Estilos para SelectableTag (prop "styles")
  tagStyles: {
    tag: {
      backgroundColor: Colors.gray1,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
    },
    tagSelected: {
      backgroundColor: Colors.violet4,
    },
    tagContent: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    tagText: {
      fontSize: 16,
      color: Colors.gray3,
      fontWeight: '700',
    },
    tagTextSelected: {
      color: Colors.white,
    },
    tagSubtitle: {
      marginTop: 2,
      fontSize: 12,
      color: Colors.gray3,
      fontWeight: '600',
    },
    tagSubtitleSelected: {
      color: Colors.white,
      opacity: 0.9,
    },
  } as any,

  loadingBox: { paddingVertical: 8 },
  error: { color: '#B00020', marginBottom: 8 },

  column: { gap: 12, justifyContent: 'space-between' },
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  avatarWrap: { alignItems: 'center', marginBottom: 8 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.gray2 },
  name: { fontSize: 18, fontWeight: '800', color: Colors.violet4, textAlign: 'center' },

  emptyBox: { paddingVertical: 24, alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: Colors.gray3 },
  emptySubtitle: { fontSize: 13, color: Colors.gray3, marginTop: 4 },
});
