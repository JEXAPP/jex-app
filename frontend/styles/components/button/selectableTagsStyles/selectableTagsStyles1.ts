import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';
import { Borders } from '@/themes/borders';

export const selectableTagStyles1 = StyleSheet.create({
  tag: {
    backgroundColor: Colors.white,
    height: 40,
    justifyContent: 'center',
    borderRadius: Borders.soft,
    marginBottom: 5
  },
  tagContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  tagSelected: {
    backgroundColor: Colors.violet3,
  },
  tagText: {
    fontSize: 16,
    fontFamily: 'interSemiBold',
    color: Colors.gray3,
  },
  tagTextSelected: {
    color: Colors.white,
    fontFamily: 'interBold',
  },
  tagSubtitle: {
    fontSize: 18,
    fontFamily: 'interBold',
    color: Colors.gray3,
    textAlign: 'right'
  },
  tagSubtitleSelected: {
    color: Colors.white,
  },
});