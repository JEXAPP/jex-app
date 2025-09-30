import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const testStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 14,
  },
  title: {
    fontSize: 50,
    fontFamily: 'titulos',
    color: Colors.violet4,
    marginBottom: 4,
  },
  stateLine: {
    fontSize: 14,
    color: Colors.gray3,
  },
  stateStrong: {
    color: Colors.violet4,
    fontWeight: '600',
  },
  muted: {
    fontSize: 12,
    color: Colors.gray3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowText: {
    fontSize: 14,
    color: Colors.gray3,
  },
  primaryBtn: {
    backgroundColor: Colors.violet4,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardText: {
    fontSize: 14,
    color: Colors.gray3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.gray3,
  },
  cardLine: {
    fontSize: 14,
    color: Colors.gray3,
  },
  cardMuted: {
    fontSize: 12,
    color: Colors.gray3,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: Colors.violet3,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryText: {
    color: 'white',
    fontWeight: '600',
  },
  ghostBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.violet3,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  ghostText: {
    color: Colors.violet3,
    fontWeight: '600',
  },
  neutralBtn: {
    marginTop: 8,
    backgroundColor: Colors.gray2,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  neutralText: {
    color: Colors.gray3,
    fontWeight: '600',
  },
  error: {
    color: 'crimson',
    marginTop: 8,
  },
});
