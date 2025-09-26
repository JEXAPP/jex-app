import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';
import { Borders } from '@/themes/borders';

export const searchResultsStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray1 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: Colors.gray1,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 28,
    fontFamily: 'interBold',
    color: Colors.violet4,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 4,
    gap: 12,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.white,
    borderRadius: Borders.soft,
    padding: 14,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 60,
  },
  name: {
    fontSize: 20,
    fontFamily: 'interSemiBold',
    color: Colors.violet4,
    marginBottom: 6,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: Colors.softgreen, 
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Borders.rounded,
  },
  locationText: {
    color: Colors.darkgreen,
    fontSize: 13,
    fontFamily: 'interMedium',
    maxWidth: 220,
  },
  center: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  emptyText: { 
    color: Colors.gray3, 
    fontSize: 16, 
    fontWeight: '600' 
  },
  errorBox: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: '#fee',
    borderColor: '#f99',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
  },
  errorText: { 
    color: '#900', 
    textAlign: 'center' 
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.gray1,
    borderRadius: Borders.soft,
    width: 120,
    marginBottom: 8
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'interSemiBold',
    color: Colors.gray3,
  },
  starsRow: {
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});
