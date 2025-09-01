import React from "react";
import { View, Text, Image, ScrollView, Animated } from "react-native";
import { detailOffersStyles as styles } from "@/styles/app/employee/offers/detailOffersStyles";
import { Ionicons } from "@expo/vector-icons";
import { useDetailOffers } from "@/hooks/employee/offers/useDetailOffers";
import OfferDetailsSkeleton from "@/constants/skeletons/employee/offers/detailOffersSkeleton";
import { ClickWindow } from "@/components/window/ClickWindow";
import { clickWindowStyles1 } from "@/styles/components/window/clickWindowStyles1";
import { iconos } from "@/constants/iconos";
import { Colors } from "@/themes/colors";
import { Button } from "@/components/button/Button";
import { buttonStyles1 } from "@/styles/components/button/buttonStyles/buttonStyles1"; 
import { buttonStyles2 } from "@/styles/components/button/buttonStyles/buttonStyles2";

export default function OfferDetailsScreen() {
  const {
    offer,
    loading,
    handleAccept,
    handleReject,
    showRejected,
    closeRejected,
    accepting,
    showMatch,
    fadeAnim,
    scaleAnim,
    setShowMatch,
  } = useDetailOffers();

  return (
    <View style={styles.screen}>
      <View style={styles.headerSpacing} />

      { (loading || !offer) 

       ? <OfferDetailsSkeleton /> :

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {showMatch ? (
            <Animated.View style={[styles.card2, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
              <Image source={require("@/assets/images/match.png")} style={styles.matchFill} />
            </Animated.View>
          ) : (
            <>
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

                  <Button 
                    texto="Rechazar" 
                    onPress={handleReject} 
                    styles={{texto: buttonStyles2.texto, boton: { ...buttonStyles2.boton, width: 140, height: 45 }}} 
                  />

                  <Button
                    texto="Aceptar"
                    onPress={() => handleAccept(() => setShowMatch(true))}
                    styles={{texto: buttonStyles1.texto, boton: { ...buttonStyles1.boton, width: 140, height: 45 }}}
                    disabled={accepting}
                    loading={accepting}
                  />

                </View>

              </View>

              
            </>
          )}
        </ScrollView>

      }

      <ClickWindow
        title="Oferta rechazada"
        visible={showRejected}
        message="Has rechazado la oferta."
        onClose={closeRejected}
        styles={clickWindowStyles1}
        icono={iconos.error_outline(30, Colors.white)}
        buttonText="Ok"
      />
    </View>
  );
}
