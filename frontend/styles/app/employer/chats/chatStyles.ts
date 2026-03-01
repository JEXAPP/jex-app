import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const chatStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerWrap: {
    paddingBottom: 8,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  titles: {
    fontSize: 50,
    lineHeight: 60,
    fontFamily: 'titulos',
    color: Colors.violet4,
    marginBottom: 10,
  },
  tagContainer: {
    paddingHorizontal: 10,
    gap: 8,
    marginBottom: 20,
    marginLeft: 0,
  },
  carouselContent: {
    paddingHorizontal: 20,
  },
  dropdownAnchor: {
    marginTop: 8,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10
  },
  dropdownAnchorText: {
    fontSize: 16,
    fontFamily: 'interRegular',
    flex: 1,
  },
  statusText: {
    marginTop: 12,
    marginHorizontal: 16,
    fontSize: 14,
  },
  errorText: {
    marginTop: 12,
    marginHorizontal: 16,
    fontSize: 14,
    color: 'red',
  },
  emptyContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
  },
  noChatsCard: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    height: 500
  },
  noChatsTitle: {
    fontFamily: 'interBoldItalic',
    fontSize: 20,
    color: Colors.violet4,
    textAlign: 'center'
  },
  noChatsImage: {
    width: 300,
    height: 200,
    marginBottom: 60
  },
});
