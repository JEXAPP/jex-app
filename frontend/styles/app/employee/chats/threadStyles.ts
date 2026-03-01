// styles/app/employee/chats/threadStyles.ts
import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const threadStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 15,
    backgroundColor: Colors.violet4,
  },
  backButton: {
    paddingRight: 4,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    marginLeft: 6,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerTitleWrap: {
    marginLeft: 10,
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'interSemiBold',
    color: Colors.white,
  },
  inputContainer: {
    backgroundColor: '#F3F3F3',
  },
});
