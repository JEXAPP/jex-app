import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const selectableTagStyles1 = StyleSheet.create({
  tag: {
    backgroundColor: Colors.gray2,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
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
    fontWeight: '600',
    color: Colors.violet5,
  },
  tagTextSelected: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  tagSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.gray3,
  },
  tagSubtitleSelected: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '500',
  },
});


