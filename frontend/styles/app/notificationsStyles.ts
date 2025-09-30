import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';
import { Borders } from '@/themes/borders';

export const notificationsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    paddingTop: 40,
    },
  title: {
    fontSize: 40,
    fontFamily: 'titulos',
    color: Colors.violet4,
    marginBottom: 10,
    marginLeft: 20
  },
  markAll: {
    fontSize: 14,
    color: Colors.violet4,
    fontFamily: 'textos',
  },
  list: {
    paddingBottom: 16,
    marginHorizontal: 20
  },
  card: {
    borderRadius: Borders.soft,
    gap: 12,
    marginTop: 10,
    padding: 12,
  },
  information:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.gray1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  textWrap: { 
    flex: 1 
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notifTitle: {
    flex: 1,
    fontSize: 15,
    color: Colors.violet4,
    fontFamily: 'interBold',
  },
  time: {
    marginLeft: 8,
    fontSize: 12,
    color: Colors.gray3,
    fontFamily: 'interRegular',
  },
  message: {
    marginTop: 4,
    fontSize: 13,
    color: Colors.gray3,
    fontFamily: 'interMedium',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: Colors.violet4,
    marginLeft: 6,
  },
  emptyTitle: {
    fontSize: 18,
    color: Colors.gray3,
    fontFamily: 'interBold',
    textAlign: 'center',
  },
  emptyMsg: {
    marginTop: 6,
    fontSize: 14,
    color: Colors.gray3,
    textAlign: 'center',
    fontFamily: 'interMedium',
  },
  noNotificationsCard: {
    height: 500,
    width: 350,
    backgroundColor: Colors.white,
    borderRadius: 12,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  noNotificationsTitle: {
    fontSize: 24,
    fontFamily: 'interBold',
    color: Colors.violet4,
    marginBottom: 20,
    textAlign: 'center',
  },
  noNotificationsImage: {
    width: 250,
    height: 250,
    marginBottom: 55,
    marginTop: 45,
    alignSelf: 'center',
  },
  noNotificationsSubtitle: {
    fontSize: 14,
    fontFamily: 'interItalic',
    color: Colors.gray3,
    textAlign: 'center',
   },
});
