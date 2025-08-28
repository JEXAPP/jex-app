import { useState, useRef, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Animated, Easing } from "react-native";
import { detailOffersStyles as styles } from "@/styles/app/employee/offers/detailOffersStyles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useDetailOffers } from "@/hooks/employee/offers/useDetailOffers";
import OfferDetailsSkeleton from "@/constants/skeletons/employee/detailOffersSkeleton";
import { ClickWindow } from "@/components/window/ClickWindow";
import { clickWindowStyles1 } from "@/styles/components/window/clickWindowStyles1";
import { iconos } from "@/constants/iconos";
import { Colors } from "@/themes/colors";
import { ActivityIndicator } from "react-native";

export default function OfferDetailsScreen() {
  const { offer, loading, handleAccept, handleReject, showRejected, closeRejected, accepting } = useDetailOffers();
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
          duration: 400,
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
        setTimeout(() => {
          router.replace("/employee/offers/check-offers");
        }, 3000); // 3 segundos mostrando el match
      });
    }
  }, [showMatch]);

  // skeleton SOLO en la carga inicial
  if (loading || !offer) {
    return <OfferDetailsSkeleton />;
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
              disabled={accepting} // opcional: evita múltiples taps
            >
              {accepting ? (
                <ActivityIndicator size="small" color="#fff" /> // spinner blanco
              ) : (
                <Text style={styles.acceptText}>Aceptar</Text>
              )}
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

      {/* 👈 Aquí agregamos el ClickWindow para el rechazo */}
      <ClickWindow
        title="Oferta rechazada"
        visible={showRejected}
        message="Has rechazado la oferta."
        onClose={closeRejected}
        styles={clickWindowStyles1}
        icono={iconos.error_outline(30, Colors.white)}
        buttonText="Ok"
      />
    </ScrollView>
  );
}
