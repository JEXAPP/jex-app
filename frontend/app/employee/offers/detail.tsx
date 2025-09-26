import React from "react";
import { View, Text, Image, ScrollView, Animated } from "react-native";
import { detailOffersStyles as styles } from "@/styles/app/employee/offers/detailOffersStyles";
import { Ionicons } from "@expo/vector-icons";
import { useDetailOffers } from "@/hooks/employee/offers/useDetailOffers";
import OfferDetailsSkeleton from "@/constants/skeletons/employee/offers/detailOffersSkeleton";
import { ClickWindow } from "@/components/window/ClickWindow";
import { clickWindowStyles1 } from "@/styles/components/window/clickWindowStyles1";
import { Colors } from "@/themes/colors";
import { Button } from "@/components/button/Button";
import { buttonStyles1 } from "@/styles/components/button/buttonStyles/buttonStyles1"; 
import { buttonStyles2 } from "@/styles/components/button/buttonStyles/buttonStyles2";

export default function OfferDetailsScreen() {
  const {
    offer,
    loading,

    // Aceptar (ya lo tenías)
    handleAccept,
    accepting,
    showMatch,
    fadeAnim,
    scaleAnim,
    setShowMatch,
    // Rechazar (nuevo flujo con confirmación)
    handleReject,               // tu rechazo real (no lo llamamos directo desde el botón)
    showRejected,
    closeRejected,
    confirmRejectVisible,
    openConfirmReject,
    closeConfirmReject,
    confirmReject,              // llama a handleReject por dentro
  } = useDetailOffers();

  return (
    <View style={styles.screen}>
      <View style={styles.headerSpacing} />

      {(loading || !offer) ? (
        <OfferDetailsSkeleton />
      ) : (
        <>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
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
                <Text key={`${index}-${req}`} style={styles.requirement}>
                  {`${index + 1}. ${req}`}
                </Text>
              ))}

              <Text style={styles.additionalTitle}>Comentarios Adicionales:</Text>
              <Text style={styles.additional}>{offer.comments}</Text>

              <View style={styles.expirationContainer}>
                <Ionicons name="time-outline" size={16} color={Colors.gray3} />
                <Text style={styles.expirationText}>
                  La oferta vence el {offer.expirationDate} a las {offer.expirationTime}hs
                </Text>
              </View>

              <View style={styles.buttonsInScroll}>
                {/* RECHAZAR: ahora abre confirmación */}
                <Button
                  texto="Rechazar"
                  onPress={openConfirmReject}
                  styles={{ texto: buttonStyles2.texto, boton: { ...buttonStyles2.boton, width: 140, height: 45 } }}
                />

                {/* ACEPTAR: dispara overlay Match */}
                <Button
                  texto="Aceptar"
                  onPress={() => handleAccept(() => setShowMatch(true))}
                  styles={{ texto: buttonStyles1.texto, boton: { ...buttonStyles1.boton, width: 140, height: 45 } }}
                  disabled={accepting}
                  loading={accepting}
                />
              </View>
            </View>
          </ScrollView>

          {/* OVERLAY MATCH: pantalla completa violeta con imagen y texto */}
          {showMatch && (
            <Animated.View
              pointerEvents="auto"
              style={[
                styles.matchOverlay,
                { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
              ]}
            >
              {/* Reemplazá la imagen por la tuya de JEX festejando */}
              <Image
                source={require("@/assets/images/jex/Jex-Match.png")}
                style={styles.matchImage}
              />
              <Text style={styles.matchText}>¡Match!</Text>
            </Animated.View>
          )}
        </>
      )}

      {/* ClickWindow de CONFIRMACIÓN de rechazo */}
      <ClickWindow
        visible={confirmRejectVisible}
        title="¿Estás seguro?"
        message="Vas a rechazar esta oferta. Esta acción no puede deshacerse."
        buttonText="Rechazar"
        cancelButtonText="Cancelar"
        icono={<Ionicons name="alert-circle" size={28} color={Colors.violet4} />}
        onClose={confirmReject}        // confirma y rechaza
        onCancelPress={closeConfirmReject}
        styles={clickWindowStyles1}
      />

      {/* ClickWindow informativo de RECHAZADO (el que ya tenías) */}
      <ClickWindow
        title="Oferta rechazada"
        visible={showRejected}
        message="Has rechazado la oferta."
        onClose={closeRejected}
        styles={clickWindowStyles1}
        icono={<Ionicons name="close-circle-outline" size={30} color={Colors.white} />}
        buttonText="Ok"
      />
    </View>
  );
}
