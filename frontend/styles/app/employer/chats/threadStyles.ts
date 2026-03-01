import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const threadStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: Colors.violet4,
    borderBottomWidth: 1
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
  },
  inputContainer: {
    paddingBottom:0,
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 26
  },
  headerTitleWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: Colors.violet4,
    fontFamily: 'titulos'
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.gray3 ?? '#8E8E93',
    marginTop: 2,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 120, // espacio para que no tape el botón fijo
  },

  /* ---------- Separador de fecha ---------- */
  dateDivider: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dateDividerText: {
    fontSize: 13,
    color: Colors.gray3 ?? '#8E8E93',
  },

  /* ---------- Mensaje (tarjeta/burbuja) ---------- */
  messageCard: {
    backgroundColor: Colors.violet4,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    // sombra sutil
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  messageHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  messageAuthor: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: Colors.violet4 ?? '#4C1D95',
  },
  messageTime: {
    fontSize: 12,
    color: Colors.gray3 ?? '#8E8E93',
    marginLeft: 8,
  },
  messageText: {
    fontSize: 16,
    color: Colors.black ?? '#111111',
    lineHeight: 22,
  },

  /* ---------- Empty state ---------- */
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray3 ?? '#8E8E93',
  },

  /* ---------- Botón fijo “Anunciar” ---------- */
  announceBarWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingBottom: 24, // si usás SafeAreaView con edges, suele alcanzar
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  announceButton: {
    height: 56,
    borderRadius: 20,
    backgroundColor: Colors.violet4 ?? '#4C1D95',
    alignItems: 'center',
    justifyContent: 'center',
  },
  announceButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
