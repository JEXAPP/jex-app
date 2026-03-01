import { StyleSheet } from 'react-native';

export const googleMapStyles1 = StyleSheet.create({
  container: {
    overflow: 'hidden',
    width: '100%',
    backgroundColor: '#eaeaea',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  tapCatcher: {
    ...StyleSheet.absoluteFillObject,
  },
});
