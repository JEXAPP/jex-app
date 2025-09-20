import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';


export const attendanceStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 100,
    marginBottom: 10,
    marginLeft: 15

  },
  image: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 40,
    fontFamily: 'titulos',
    color: Colors.violet4,
    flexShrink: 1,
    marginRight: 20,
  },
  scroll: {
    paddingHorizontal: 26,
    gap: 10,
  },
  card: {
    backgroundColor: Colors.violet4,
    flexDirection: 'row',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15
  },
  text: {
    fontSize: 25,
    fontFamily: 'interBold',
    color: Colors.gray1,
    flexShrink: 1,
  },
  qrRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jex: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    opacity: 0.9,
  },
  error: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#f44336',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  cardList: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e8e8e8',
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.gray3,
    paddingVertical: 16,
  },
  tag: {
    backgroundColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  tagSelected: {
    backgroundColor: Colors.violet4,
  },
  tagContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagsContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    // opcional: un paddingRight extra para que el último chip no quede pegado
    paddingRight: 8,
  },
  tagItem: {
    marginRight: 10, // separador entre chips
  },
  tagText: {
    color: Colors.gray3,
    fontSize: 14,
    fontWeight: '600',
  },
  tagTextSelected: {
    color: Colors.white,
  },
  tagSubtitle: {
    marginTop: 2,
    fontSize: 11,
    color: Colors.gray3,
  },
  tagSubtitleSelected: {
    color: Colors.white,
    opacity: 0.9,
  },
})