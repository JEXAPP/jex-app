import { StyleSheet } from 'react-native';
import { Colors } from '../../../themes/colors';

export const applyJobStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
  },
  scroll:{
    paddingHorizontal: 26, 
    paddingBottom: 26
  },
  header: {
    backgroundColor: Colors.violet5,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerText: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  logoWrapper: {
    width: 90,
    height: 90,
    borderRadius: 90,
    resizeMode: 'cover',
  },
  eventTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: Colors.gray1,
  },
  ratingWrapper: {
    flexDirection: 'row',
    backgroundColor: Colors.gray1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
    alignSelf: 'flex-start',
  },
  starsIcon: {
    color: Colors.violet5,
  },
  map: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginTop: 8,
    resizeMode: 'cover',
  },
  section: {
    marginBottom: 5,
  },
  containerTitle: {
    fontSize: 25,
    color: Colors.violet5,
    textAlign: 'left',
    fontWeight: '700',
    marginBottom: 5
  },
  containerText: {
    fontSize: 17,
    color: Colors.gray3,
    textAlign: 'justify'
  },
  containerSubtitle: {
    fontSize: 20,
    color: Colors.violet5,
    fontWeight: '700',
    textAlign: 'justify',
    marginBottom: 5
  },
  icon: {
    color: Colors.violet5,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end', 
    gap: 10,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray2,
    marginVertical: 10,
  },
  textArea: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 15,
    color: '#333',
  },
  applyBox: {
    position: 'absolute',
    bottom: 30,
    left: 10,
    right: 10,
    backgroundColor: Colors.gray1,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: '#ccc',
  },
  salary: {
    color: Colors.violet5,
    fontSize: 20,
    fontWeight: 'bold',
  },
  deadline: {
    color: Colors.gray3,
    fontSize: 14,
  },
  applyButton: {
    backgroundColor: Colors.violet5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  applyText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },

})