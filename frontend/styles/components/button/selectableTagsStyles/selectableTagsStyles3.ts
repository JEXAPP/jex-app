import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';
import { Borders } from '@/themes/borders';

export const selectableTagStyles3 = StyleSheet.create({
  tag: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Borders.rounded,

    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,

    overflow: 'hidden',
    backfaceVisibility: 'hidden',
  },

  tagSelected: {
    backgroundColor: Colors.violet4,
    paddingVertical: 8,
    borderRadius: Borders.rounded,
  },

  tagContent: {
    flexDirection: 'column',
    gap: 4,
  },

  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  tagText: {
    fontSize: 16,
    fontFamily: 'interSemiBold',
    color: Colors.white,
  },

  tagTextSelected: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'interBold',
  },

  tagSubtitle: {
    fontSize: 13,
    fontFamily: 'interSemiBold',
    color: Colors.white,
  },

  tagSubtitleSelected: {
    color: Colors.white,
    fontSize: 13,
    fontFamily: 'interSemiBold',
  },
});