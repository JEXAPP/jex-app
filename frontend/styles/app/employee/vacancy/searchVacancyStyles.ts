import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const searchVacancyStyles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    padding: 16,
  },
  tagsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
});
