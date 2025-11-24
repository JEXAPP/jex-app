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

import LocationMapCard from "@/components/others/LocationMapCard";
import ImageWindow from "@/components/window/ImageWindow";

export default function OfferDetailsScreen() {
  const {
    offer,
    loading,
    handleAccept,
    accepting,
    showMatch,
    fadeAnim,
    scaleAnim,
    setShowMatch,
    handleReject,
    showRejected,
    closeRejected,
    confirmRejectVisible,
    openConfirmReject,
    closeConfirmReject,
    confirmReject,

    locationAddress,
    locationCoords,

    isMpAssociated,
    showMpModal,
    openMpModal,
    goToAssociateMp,
  } = useDetailOffers();

  return (
    <View style={styles.screen}>
      <View style={styles.headerSpacing} />

      {loading || !offer ? (
        <OfferDetailsSkeleton />
      ) : (
        <>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
          >
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

              <LocationMapCard
                address={locationAddress || offer.location}
                coords={locationCoords || undefined}
                zoom={17}
                style={{ marginTop: 8 }}
              />

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
                  La oferta vence el {offer.expirationDate} a las{" "}
                  {offer.expirationTime}hs
                </Text>
              </View>

              <View style={styles.buttonsInScroll}>
                <Button
                  texto="Rechazar"
                  onPress={openConfirmReject}
                  styles={{
                    texto: buttonStyles2.texto,
                    boton: {
                      ...buttonStyles2.boton,
                      width: 140,
                      height: 45,
                    },
                  }}
                />

                <Button
                  texto="Aceptar"
                  onPress={() => {
                    if (!isMpAssociated) {
                      openMpModal();
                      return;
                    }
                    handleAccept(() => setShowMatch(true));
                  }}
                  styles={{
                    texto: buttonStyles1.texto,
                    boton: {
                      ...buttonStyles1.boton,
                      width: 140,
                      height: 45,
                    },
                  }}
                  disabled={accepting}
                  loading={accepting}
                />
              </View>
            </View>
          </ScrollView>

          {showMatch && (
            <Animated.View
              pointerEvents="auto"
              style={[
                styles.matchOverlay,
                { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
              ]}
            >
              <Image
                source={require("@/assets/images/jex/Jex-Match.webp")}
                style={styles.matchImage}
              />
              <Text style={styles.matchText}>¡Match!</Text>
            </Animated.View>
          )}
        </>
      )}

      <ClickWindow
        visible={confirmRejectVisible}
        title="¿Estás seguro?"
        message="Vas a rechazar esta oferta. Esta acción no puede deshacerse."
        buttonText="Rechazar"
        cancelButtonText="Cancelar"
        icono={
          <Ionicons name="alert-circle" size={28} color={Colors.violet4} />
        }
        onClose={confirmReject}
        onCancelPress={closeConfirmReject}
        styles={clickWindowStyles1}
      />

      <ClickWindow
        title="Oferta rechazada"
        visible={showRejected}
        message="Has rechazado la oferta."
        onClose={closeRejected}
        styles={clickWindowStyles1}
        icono={
          <Ionicons
            name="close-circle-outline"
            size={30}
            color={Colors.white}
          />
        }
        buttonText="Ok"
      />

      <ImageWindow
        visible={showMpModal}
        title="Antes de aceptar"
        buttonText="Vincular"
        onClose={goToAssociateMp}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            
            <Text
              style={{
                fontSize: 17,
                fontFamily: "interItalic",
                color: Colors.gray3,
                marginLeft: 10
              }}
            >
              Asociá tu cuenta de Mercado Pago, donde recibirás el pago una vez finalizado el trabajo.
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image source={require('@/assets/images/jex/Jex-Freno.webp')} style={{height: 200, width: 120}}/>
          </View>
        </View>
      </ImageWindow>
    </View>
  );
}
