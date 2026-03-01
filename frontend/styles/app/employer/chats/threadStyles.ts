// styles/app/employer/chats/threadStyles.ts
import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const threadStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  /* ---------------- HEADER ---------------- */
  header: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.violet4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EDE0F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerTitleWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: Colors.white,
    fontFamily: 'titulos',
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'interLightItalic',
    color: Colors.white,
    marginTop: 2,
  },

  /* ---------------- CHAT WRAPPER ---------------- */
  chatWrapper: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  /* Lista de mensajes */
  messagesWrapper: {
    flex: 1,
    paddingTop: 4,
    paddingHorizontal: 4,
    backgroundColor: Colors.white,
  },

  /* ---------------- INPUT ---------------- */
  inputContainer: {
    backgroundColor: Colors.white,
  },

  /* ---------------- EMPTY STATE ---------------- */
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray3,
  },
});
