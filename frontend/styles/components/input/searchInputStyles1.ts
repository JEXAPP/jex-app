import { Borders } from '@/themes/borders';
import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const searchInputStyles1 = StyleSheet.create({
  container: {
    width: 350,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: Colors.white,
    height: 50
  },
  searchIcon: {
    marginRight: 8,
    marginLeft: 20
  },
  chip: {
    flexDirection: 'row',
    backgroundColor: Colors.violet1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Borders.rounded,
    justifyContent: 'center'
  },
  chipText: {
    color: Colors.black,
    fontFamily:'interMedium'
  },
  chipClose: {
    marginLeft: 4,
  },
  textInput: {
    flex: 1,
    minWidth: 80,
    paddingVertical: 8,
  },
  chipsRowScrollContainer: {
    flex: 1,
  },
  chipsRowScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },
  textInputInline: {
    flexGrow: 0,
    minWidth: 120, 
    paddingVertical: 8,
    fontSize: 15,
    fontFamily: 'interMedium',
    color: Colors.gray3,
  },
  dateSummaryWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',   
    gap: 8,
    paddingVertical: 6,
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,        
  },
  rangeSeparator: {
    marginHorizontal: 6,
  },
  clearRangeBtn: { 
    marginLeft: 6 
  },
  datePlaceholder: {
    color: Colors.gray2,
    fontSize: 15,
    fontFamily: 'interMedium'
  },
});