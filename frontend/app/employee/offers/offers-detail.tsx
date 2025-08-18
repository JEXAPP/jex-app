import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { detailOffersStyles as styles } from '@/styles/app/employee/offers/detailOffersStyles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDetailOffers } from '@/hooks/employee/offers/useDetailOffers';

export default function OfferDetailsScreen() {
  const { params, handleAccept, handleReject } = useDetailOffers();
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ofertas</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Image
          source={require('@/assets/images/Publicidad1.png')}
          style={styles.eventImage}
        />

        <Text style={styles.company}>{params.company}</Text>
        <Text style={styles.role}>{params.role}</Text>

        <View style={styles.salaryContainer}>
          <Text style={styles.salary}>{params.salary} ARS</Text>
        </View>

        <Text style={styles.date}>
          {params.date}{' '}
          {params.startTime}hs - {params.endTime}hs
        </Text>

        <Text style={styles.locationLabel}>Ubicación:</Text>
        <Text style={styles.location}>{params.location}</Text>

        <Image
          source={require('@/assets/images/maps.png')} // 🔹 aquí pon la tuya
          style={styles.mapImage}
        />

        {/* Requerimientos */}
        <Text style={styles.requirementsTitle}>Requerimientos:</Text>
          {(() => {
            let requirements: string[] = [];

            if (Array.isArray(params.requirements)) {
              requirements = params.requirements;
            } else if (typeof params.requirements === "string") {
              requirements = params.requirements.split(","); // 👈 los separa
            }

            return requirements.map((req, index) => (
              <Text key={index} style={styles.requirement}>
                {index + 1}) {req.trim()}
              </Text>
            ));
          })()}


        <Text style={styles.additionalTitle}>Comentarios Adicionales:</Text>
        <Text style={styles.additional}>{params.comments}</Text>

        {/* Botones */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={handleReject}
          >
            <Text style={styles.rejectText}>Rechazar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={handleAccept}
          >
            <Text style={styles.acceptText}>Aceptar</Text>
          </TouchableOpacity>
        </View>

        {/* Expiration */}
        <View style={styles.expirationContainer}>
          <Ionicons name="time-outline" size={16} color="#4B164C" />
          <Text style={styles.expirationText}>
            La oferta vence el {params.expirationDate} a las {params.expirationTime}hs
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
