import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Image, Text } from 'react-native';

export default function OfferDetailsScreen() {
  const params = useLocalSearchParams();

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {/* ⚠️ Si eventImage es un require, no viaja bien por params; aquí puedes resolverlo según un nombre */}
      <Image 
        source={require('@/assets/images/Publicidad1.png')} 
        style={{ width: '100%', height: 200, borderRadius: 10 }} 
      />
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginTop: 16 }}>
        {params.company}
      </Text>
      <Text style={{ fontSize: 18, marginVertical: 8 }}>{params.role}</Text>
      <Text style={{ fontSize: 16 }}>Salario: {params.salary} ARS</Text>
      <Text style={{ fontSize: 16 }}>
        Fecha: {params.date} {params.startTime}hs - {params.endTime}hs
      </Text>
      <Text style={{ marginTop: 10, color: 'gray' }}>
        Vence el {params.expirationDate} a las {params.expirationTime}hs
      </Text>
    </ScrollView>
  );
}
