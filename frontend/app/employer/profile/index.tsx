// src/app/employer/profile/index.tsx (o donde tengas este screen)
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";

import { Colors } from "@/themes/colors";
import { termsAndConditionsText } from "@/assets/legal/terms_and_conditions";
import { useProfile } from "@/hooks/employer/profile/useProfileEmployer";
import { profileEmployerStyles as styles } from "@/styles/app/employer/profile/profileEmployerStyles";

import RowButton from "@/components/button/RowButton";
import { rowButtonStyles1 } from "@/styles/components/button/rowButton/rowButtonStyles1";
import { iconos } from "@/constants/iconos";
import { DotsLoader } from "@/components/others/DotsLoader";

export default function EmployerProfileScreen() {
  const {
    user,
    options,
    handleLogout,
    goToProfileDetails,
    goToRatingsScreen,
    goToEventsHistory,
  } = useProfile();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // modal terms
  const [termsVisible, setTermsVisible] = useState(false);
  const [termsContent, setTermsContent] = useState("");

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "center",
            marginTop: 40,
          }}
        >
          <DotsLoader />
        </View>
      </SafeAreaView>
    );
  }

  const onLogoutPress = async () => {
    try {
      setIsLoggingOut(true);
      await handleLogout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const loadTerms = () => {
    setTermsContent(termsAndConditionsText);
    setTermsVisible(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        <Text style={styles.title}>Perfil</Text>

        {/* Card principal: foto + nombre (tappable para editar) */}
        <TouchableOpacity
          style={styles.profileCard}
          activeOpacity={0.8}
          onPress={goToProfileDetails}
        >
          <Image
            source={
              user.image
                ? { uri: user.image }
                : require("@/assets/images/jex/Jex-FotoPerfil.webp")
            }
            style={styles.avatar}
          />
          <Text style={styles.name}>{user.name}</Text>
        </TouchableOpacity>

        {/* Row de cards: calificaciones + historial de eventos */}
        <View style={styles.summaryRow}>
          {/* Calificaciones */}
          <TouchableOpacity
            style={styles.summaryCard}
            activeOpacity={0.8}
            onPress={goToRatingsScreen}
          >
            <Text style={styles.ratingValue}>
              {user.rating != null ? user.rating.toFixed(1) : "0.0"}
            </Text>

            <View style={styles.ratingRow}>
              <View style={styles.starsRow}>
                {[...Array(5)].map((_, index) => {
                  const score = user.rating ?? 0;
                  const filled = index + 1 <= Math.floor(score);
                  const half = score - index >= 0.5 && score - index < 1;

                  return (
                    <Ionicons
                      key={index}
                      name={filled ? "star" : half ? "star-half" : "star-outline"}
                      size={25}
                      color={Colors.violet4}
                      style={{ marginRight: 2 }}
                    />
                  );
                })}
              </View>
            </View>

            <Text style={styles.summaryCardSubtitle}>
              Promedio de calificaciones ({user.ratingCount})
            </Text>
          </TouchableOpacity>

          {/* Historial de eventos */}
          <TouchableOpacity
            style={styles.summaryCard2}
            activeOpacity={0.8}
            onPress={goToEventsHistory}
          >
            <View style={styles.historyIconWrapper}>
              {iconos.work_history(30, Colors.violet4)}
            </View>
            <Text style={styles.summaryCardSubtitleCentered}>
              Consultá tu historial de eventos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Opciones (Editar perfil + Legal) */}
        <View style={styles.optionsContainer}>
          {options.map((opt, idx) => {
            const iconElement = (
              <Feather
                name={opt.icon as any}
                size={22}
                color={Colors.gray3}
              />
            );

            const handlePress =
              opt.label === "Legal" ? loadTerms : opt.onPress ?? (() => {});

            return (
              <RowButton
                key={`${opt.label}-${idx}`}
                title={opt.label}
                icon={iconElement}
                onPress={handlePress}
                styles={rowButtonStyles1}
              />
            );
          })}
        </View>
      </ScrollView>

      {/* Logout */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={styles.logoutRow}
          activeOpacity={0.7}
          onPress={onLogoutPress}
          disabled={isLoggingOut}
        >
          {iconos.logout(28, Colors.gray3)}
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
          {isLoggingOut && (
            <ActivityIndicator
              size="small"
              color="#444"
              style={{ marginLeft: 10 }}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Modal de Términos (igual que empleado) */}
      <Modal visible={termsVisible} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              margin: 20,
              borderRadius: 12,
              paddingVertical: 18,
              maxHeight: "82%",
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontFamily: "interBold",
                marginLeft: 20,
                marginBottom: 8,
                color: Colors.violet3,
              }}
            >
              Términos y Condiciones
            </Text>

            <ScrollView style={{ marginBottom: 12, paddingHorizontal: 20 }}>
              {termsContent.split(/\n(?=\d+\.)/).map((section, index) => {
                const match = section.match(/^(\d+\.\s*[^\n]*)\n?(.*)$/s);
                const subtitle = match ? match[1].trim() : "";
                const body = match ? match[2].trim() : section.trim();

                return (
                  <View key={index} style={{ marginBottom: 12 }}>
                    {subtitle.length > 0 && (
                      <Text
                        style={{
                          fontFamily: "interBold",
                          color: Colors.black,
                          fontSize: 16,
                          marginBottom: 4,
                        }}
                      >
                        {subtitle}
                      </Text>
                    )}

                    {body.length > 0 && (
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: "interRegular",
                          color: "#333",
                          lineHeight: 22,
                          textAlign: "justify",
                        }}
                      >
                        {body}
                      </Text>
                    )}
                  </View>
                );
              })}
            </ScrollView>

            <View
              style={{ flexDirection: "row", justifyContent: "flex-end" }}
            >
              <TouchableOpacity
                onPress={() => setTermsVisible(false)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  marginRight: 8,
                  backgroundColor: "#efefef",
                }}
              >
                <Text>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
