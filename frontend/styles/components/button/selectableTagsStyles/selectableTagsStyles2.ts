import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';
import { Borders } from '@/themes/borders';

export const selectableTagStyles2 = StyleSheet.create({
  tag: {
    backgroundColor: Colors.gray2,
    paddingVertical: 8,
    paddingHorizontal: 14,      
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Borders.rounded,
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
    color: Colors.gray2,
  },
  tagSubtitleSelected: {
    color: Colors.white,
    fontSize: 13,
    fontFamily: 'interSemiBold',
  },
});


