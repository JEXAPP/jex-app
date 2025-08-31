import { Borders } from '@/themes/borders';
import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

const BADGE_SIZE = 70; 

export const clickWindowStyles1 = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalWrapper: {
    position: 'relative',
    width: 300,
    alignItems: 'center',
    overflow: 'visible',
  },
  modal: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: Borders.soft,
    width: '100%',
    alignItems: 'center',
    paddingTop: 10 + BADGE_SIZE / 2,
    position: 'relative',
    zIndex: 1,
    elevation: 6,        
  },

  iconBadge: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    marginLeft: -(BADGE_SIZE / 2),
    borderRadius: BADGE_SIZE / 2,
    backgroundColor: Colors.violet4,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -(BADGE_SIZE / 2) }],
    zIndex: 3,            
    elevation: 10,        
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  title: {
    fontFamily: 'interBold',
    fontSize: 22,
    color: Colors.violet4,
  },
  message: {
    fontFamily: 'interRegular',
    fontSize: 16,
    color: Colors.gray3,
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.violet4,
    borderRadius: Borders.soft,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'interSemiBold',
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    marginBottom: 8,
    gap: 12,
  },
});
