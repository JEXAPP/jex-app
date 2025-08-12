import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';
import { Borders } from '@/themes/borders';

export const selectableTagStyles1 = StyleSheet.create({
  tag: {
    backgroundColor: Colors.white,
    width: 350,
    height: 40,
    justifyContent: 'center',
    borderRadius: Borders.soft,
    marginBottom: 5
  },
  tagSelected: {
    backgroundColor: Colors.violet3,
  },
  tagContent: {
    marginLeft: 10, 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 100
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
  },
  tagSubtitleSelected: {
    color: Colors.white,
  },
  labelRow:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  }
});
