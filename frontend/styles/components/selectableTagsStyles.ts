import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const selectableTagStyles = StyleSheet.create({
  tag: {
    backgroundColor: Colors.gray2,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'flex-start'
  },
  tagSelected: {
    backgroundColor: Colors.violet5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
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
    color: Colors.violet5,
  },
  tagTextSelected: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'interSemiBold',
  },
  tagSubtitle: {
    fontSize: 13,
    fontFamily: 'interSemiBold',
    color: Colors.gray3,
  },
  tagSubtitleSelected: {
    color: Colors.white,
    fontSize: 13,
    fontFamily: 'interSemiBold',
  },
});


