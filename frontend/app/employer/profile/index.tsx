// ProfileScreen.tsx
import React, { useState } from "react";
import { Colors } from "@/themes/colors";
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
import { profileStyles as styles } from "@/styles/app/employee/profile/profileStyles";
import { useProfile } from "@/hooks/employer/profile/useProfileEmployer";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import { termsAndConditionsText } from "@/assets/legal/terms_and_conditions";

export default function ProfileScreen() {
  const { user, options, handleLogout } = useProfile();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // modal terms
  const [termsVisible, setTermsVisible] = useState(false);
  const [termsContent, setTermsContent] = useState("");
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const [checked, setChecked] = useState(false);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#000" />
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

  // Cargar el archivo de términos desde assets/legal/terms_and_conditions.txt
  const loadTerms = async () => {
  setTermsContent(termsAndConditionsText);
  setHasScrolledToEnd(false);
  setChecked(false);
  setTermsVisible(true);
};

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    // margen pequeño para considerar final
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
      setHasScrolledToEnd(true);
    }
  };

  const acceptEnabled = hasScrolledToEnd && checked;

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.header}>
        <Image
          source={
            user.image
              ? { uri: user.image }
              : require("@/assets/images/jex/Jex-FotoPerfil.webp") // imagen por defecto si no hay foto
          }
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.name}</Text>
      </View>

        {/* Rating */}
        <TouchableOpacity style={styles.ratingCard} activeOpacity={0.7}>
          <View style={styles.ratingRow}>
            <View style={styles.starsRow}>
              {[...Array(5)].map((_, index) => {
                const filled = index + 1 <= Math.floor(user.rating);
                const half = user.rating - index >= 0.5 && user.rating - index < 1;
                return (
                  <Ionicons
                    key={index}
                    name={filled ? "star" : half ? "star-half" : "star-outline"}
                    size={27}
                    color="#ffd103ff"
                    style={{ marginRight: 2 }}
                  />
                );
              })}
            </View>
            <Text style={styles.ratingValue}>{user.rating?.toFixed(1) ?? "0.0"}</Text>
          </View>
          <Text style={styles.ratingComments}>Promedio de Calificaciones Recibidas</Text>
        </TouchableOpacity>

        {/* Opciones */}
        <View style={styles.optionsContainer}>
          {options.map((opt, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.optionRow}
              activeOpacity={0.7}
              onPress={opt.label === "Legal" ? loadTerms : (opt as any).onPress}
            >
              <Feather
                name={opt.icon as React.ComponentProps<typeof Feather>["name"]}
                size={22}
                color="#444"
                style={styles.optionIcon}
              />
              <Text style={styles.optionLabel}>{opt.label}</Text>
              <Feather name="chevron-right" size={20} color="#aaa" />
            </TouchableOpacity>
          ))}
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
            <Feather name="log-out" size={22} color="#444" style={styles.optionIcon} />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
            {isLoggingOut && <ActivityIndicator size="small" color="#444" style={{ marginLeft: 10 }} />}
          </TouchableOpacity>
        </View>
      

      {/* Modal de Términos */}
      <Modal visible={termsVisible} animationType="slide" transparent>
  <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center" }}>
    <View
      style={{
        backgroundColor: "#fff",
        margin: 20,
        borderRadius: 12,
        padding: 18,
        maxHeight: "82%",
      }}
    >
      {/* Título principal */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: "700",
          marginBottom: 8,
          color: Colors.violet3,
        }}
      >
        Términos y Condiciones
      </Text>

      {/* Contenido scrollable */}
      <ScrollView onScroll={handleScroll} scrollEventThrottle={16} style={{ marginBottom: 12 }}>
        {termsContent.split(/\n(?=\d+\.)/).map((section, index) => {
          // separamos subtítulo (por ejemplo "1. Introducción")
          const match = section.match(/^(\d+\.\s*[^\n]*)\n?(.*)$/s);
          const subtitle = match ? match[1].trim() : "";
          const body = match ? match[2].trim() : section.trim();

          return (
            <View key={index} style={{ marginBottom: 12 }}>
              {subtitle.length > 0 && (
                <Text
                  style={{
                    fontWeight: "600",
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

    

      {/* Checkbox custom */}
      <TouchableOpacity
        onPress={() => setChecked((s) => !s)}
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
      >
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: "#999",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: checked ? Colors.violet3 : "#fff",
          }}
        >
          {checked && <Feather name="check" size={16} color="#fff" />}
        </View>
        <Text style={{ marginLeft: 10 }}>He leído los Términos y Condiciones</Text>
      </TouchableOpacity>

      {/* Botones */}
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
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

        <TouchableOpacity
          onPress={() => setTermsVisible(false)}
          disabled={!acceptEnabled}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 8,
            backgroundColor: acceptEnabled ? Colors.violet3 : "#ccc",
          }}
        >
          <Text style={{ color: acceptEnabled ? "#fff" : "#000" }}>Aceptar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
    </SafeAreaView>
  );
}
