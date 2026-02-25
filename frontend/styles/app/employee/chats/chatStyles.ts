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
    marginBottom: 5,
  },
  headerWrap: {
    paddingBottom: 8,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  titles: {
    fontSize: 50,
    lineHeight: 60,
    fontFamily: 'titulos',
    color: Colors.violet4,
    marginHorizontal: 10,
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
    marginHorizontal: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 5
  },
  dropdownAnchorText: { 
    fontSize: 16, 
    flex: 1 
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
    marginTop: 50,
    height: 500
  },
  noChatsTitle: {
    fontFamily: 'interBoldItalic',
    fontSize: 22,
    color: Colors.violet4,
    marginBottom: 60,
    textAlign: 'center'
  },
  noChatsImage: {
    width: 250,
    height: 250,
    marginBottom: 70
  },
});
