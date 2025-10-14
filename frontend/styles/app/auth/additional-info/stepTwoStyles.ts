import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const stepTwoAdditionalInfoStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    paddingHorizontal: 20,
    paddingBottom: 26,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 50,
    fontFamily: 'titulos',
    color: Colors.violet4,
    textAlign: 'left',
    lineHeight: 50,
  },
  actionBtnRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.gray2,
    width: '48%', // queda “a la mitad”
  },
  actionIconImg: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: Colors.gray1,
    marginRight: 10
  },

  /* Cards */
  cardsRow: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 26,
  },
  card: {
    flex: 1,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 12,
  },
  cardList: { 
    flex: 1 
  },
  cardListContent: { 
    paddingBottom: 6 
  },
  cardEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmptyText: {
    fontFamily: 'interMedium',
    fontSize: 14,
    color: Colors.gray3,
  },
  cardScroll: {
    flex: 1,
  },

  /* Ítems dentro de la card */
  itemRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray1,
    paddingVertical: 10,
    gap: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontFamily: 'interSemiBold',
    fontSize: 15,
    color: Colors.violet4,
    marginBottom: 2,
  },
  itemSub: {
    fontFamily: 'interMedium',
    fontSize: 13,
    color: Colors.gray3,
    marginBottom: 2,
  },
  itemDates: {
    fontFamily: 'interMedium',
    fontSize: 12,
    color: Colors.gray3,
    marginBottom: 6,
  },
  itemDesc: {
    fontFamily: 'interRegular',
    fontSize: 12,
    color: Colors.gray3,
  },

  /* Acciones a la derecha (con separador) */
  itemActions: {
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: Colors.gray2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsInner: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  },
  iconGhost: {
    // círculo invisible (background transparente), tamaño lo maneja el componente
  },
  iconGhostTxt: {},

  /* Modal base */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: 350,
    maxWidth: 720,
    maxHeight: '88%',
    backgroundColor: Colors.gray1,
    borderRadius: 16,
    padding: 16,
    overflow: 'visible',
  },
  modalTitle: {
    fontFamily: 'interBold',
    fontSize: 20,
    color: Colors.violet4,
    marginBottom: 20,
  },
  /* Campos y filas */
  fieldWrapSuggest: {
    marginBottom: 12,
    position: 'relative',
    zIndex: 30,            // <— más alto que el resto
  },
  fieldWrap: {
    marginBottom: 12,
    position: 'relative',
    zIndex: 1,             // <— explícitamente bajo
  },
  row2: {
    flexDirection: 'row',
    gap: 12,
    zIndex: 1,             // <— bajo para que Suggestions lo tape
  },
  label: {
    fontFamily: 'interSemiBold',
    fontSize: 13,
    color: Colors.violet4,
    marginBottom: 6,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  tagChip: {
    borderWidth: 1,
    borderColor: Colors.gray2,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: Colors.white,
  },
  tagChipActive: {
    borderColor: Colors.violet4,
    backgroundColor: '#efe9ff',
  },
  tagChipText: {
    fontFamily: 'interMedium',
    fontSize: 12,
    color: Colors.gray3,
  },
  tagChipTextActive: {
    color: Colors.violet4,
  },

  /* Botonera inferior */
  footer: {
    flexDirection: 'row',
    gap: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Botonera de los modales */
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
    marginBottom: 6,
  },
  skipButton: {
    fontSize: 18,
  },
  nextButton: {
    fontSize: 20,
    fontFamily: 'interBold',
    color: Colors.violet4
  }
});
