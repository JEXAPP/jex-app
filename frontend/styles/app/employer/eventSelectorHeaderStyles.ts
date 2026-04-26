import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const eventSelectorHeaderStyles = StyleSheet.create({
  // ── Header bar (violet, bottom corners rounded) ──────────
  headerContainer: {
    backgroundColor: Colors.violet4,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 16,
    gap: 10,
  },
  eventName: {
    flex: 1,
    fontSize: 17,
    fontFamily: 'interBold',
    color: Colors.white,
  },
  headerStatePill: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  headerStateText: {
    fontSize: 11,
    fontFamily: 'interBold',
    color: Colors.violet4,
  },

  // ── Bottom-sheet overlay ─────────────────────────────────
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  // ── Sheet card ───────────────────────────────────────────
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    maxHeight: '78%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.gray12,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 20,
    fontFamily: 'titulos',
    color: Colors.violet4,
  },
  closeBtn: {
    padding: 6,
  },

  // ── List items ───────────────────────────────────────────
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  createItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: Colors.violet0,
    borderRadius: 12,
    marginBottom: 10,
  },
  createItemText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'interBold',
    color: Colors.violet4,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray12,
    marginHorizontal: 4,
    marginBottom: 10,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: Colors.gray1,
  },
  eventItemSelected: {
    backgroundColor: Colors.violet1,
  },
  eventItemName: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'interSemiBold',
    color: Colors.black,
    marginRight: 8,
  },
  stateBadge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  stateBadgeText: {
    fontSize: 11,
    fontFamily: 'interBold',
  },
});
