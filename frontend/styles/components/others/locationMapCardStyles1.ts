import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';
import { Borders } from '@/themes/borders';

export const locationMapCardStyles1 = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
  },
  mapWrapper: {
    width: 100,
    height: 70,
    borderRadius: Borders.soft,
    overflow: 'hidden',
    backgroundColor: Colors.gray2,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  infoCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Borders.soft,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    flex: 1,
    color: Colors.gray3,
    fontFamily: 'interMediumItalic',
    fontSize: 14,
  },
});
