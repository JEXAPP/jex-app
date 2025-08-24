import { useState, useRef, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Animated, Easing, ActivityIndicator } from "react-native";
import { detailOffersStyles as styles } from "@/styles/app/employee/offers/detailOffersStyles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useDetailOffers } from "@/hooks/employee/offers/useDetailOffers";

export default function OfferDetailsScreen() {
  const { offer, loading, handleAccept, handleReject } = useDetailOffers();
  const router = useRouter();
  const [showMatch, setShowMatch] = useState(false);

  // animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
  if (showMatch) {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 🔹 esperar 2 segundos antes de volver a la lista
      setTimeout(() => {
        router.replace("/employee/offers/check-offers");
      }, 3000); // 2000 ms = 2 segundos
    });
  }
}, [showMatch]);

  if (loading || !offer) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4B164C" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ofertas</Text>
      </View>

      {showMatch ? (
        <Animated.View
          style={[
            styles.card2,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image
            source={require("@/assets/images/match.png")}
            style={{
              width: "100%",
              height: "90%",
              resizeMode: "cover",
              borderRadius: 16,
              marginTop: 26,
            }}
          />
        </Animated.View>
      ) : (
        <View style={styles.card}>
          <Image source={offer.eventImage} style={styles.eventImage} />
          <Text style={styles.company}>{offer.company}</Text>
          <Text style={styles.role}>{offer.role}</Text>

          <View style={styles.salaryContainer}>
            <Text style={styles.salary}>{offer.salary} ARS</Text>
          </View>

          <Text style={styles.date}>
            {offer.date} {offer.startTime}hs - {offer.endTime}hs
          </Text>

          <Text style={styles.locationLabel}>Ubicación:</Text>
          <Text style={styles.location}>{offer.location}</Text>

          <Image source={require("@/assets/images/maps.png")} style={styles.mapImage} />

          <Text style={styles.requirementsTitle}>Requerimientos:</Text>
          {offer.requirements.map((req, index) => (
            <Text key={index} style={styles.requirement}>
              {index + 1}) {req}
            </Text>
          ))}

          <Text style={styles.additionalTitle}>Comentarios Adicionales:</Text>
          <Text style={styles.additional}>{offer.comments}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={handleReject}
            >
              <Text style={styles.rejectText}>Rechazar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={() => handleAccept(() => setShowMatch(true))}
            >
              <Text style={styles.acceptText}>Aceptar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.expirationContainer}>
            <Ionicons name="time-outline" size={16} color="#4B164C" />
            <Text style={styles.expirationText}>
              La oferta vence el {offer.expirationDate} a las {offer.expirationTime}hs
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
