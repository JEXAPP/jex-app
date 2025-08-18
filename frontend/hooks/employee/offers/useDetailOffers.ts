import { useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';

export const useDetailOffers = () => {
  const params = useLocalSearchParams();

  const handleAccept = () => {
    Alert.alert('Oferta aceptada', 'Has aceptado la oferta.');
    // Aquí podrías llamar a tu API o actualizar estado global
  };

  const handleReject = () => {
    Alert.alert('Oferta rechazada', 'Has rechazado la oferta.');
    // Aquí podrías llamar a tu API o actualizar estado global
  };

  return {
    params,
    handleAccept,
    handleReject,
  };
};
