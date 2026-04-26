import { logger } from '@/services/internal/logger';
import { termsAndConditionsText } from "@/assets/legal/terms_and_conditions";
import RowButton from "@/components/button/RowButton";
import { DotsLoader } from "@/components/others/DotsLoader";
import ImageWindow from "@/components/window/ImageWindow";
import { useProfile } from "@/hooks/employee/profile/useProfile";
import { profileStyles as styles } from "@/styles/app/employee/profile/profileStyles";
import { rowButtonStyles1 } from "@/styles/components/button/rowButton/rowButtonStyles1";
import { Colors } from "@/themes/colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const {
    user,
    options,
    handleLogout,
    goToProfileDetails,
    goToRatingsScreen,
    mpModalVisible,
    mpModalConfig,
    closeMpModal,
  } = useProfile();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [termsVisible, setTermsVisible] = useState(false);
  const [termsContent, setTermsContent] = useState("");

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
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
      logger.error("Error al cerrar sesión:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const loadTerms = async () => {
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

        <TouchableOpacity
          style={styles.summaryCard}
          activeOpacity={0.8}
          onPress={goToRatingsScreen}
        >
          <Text style={styles.ratingValue}>
            {user.rating?.toFixed(1) ?? "0.0"}
          </Text>

          <View style={styles.ratingRow}>
            <View style={styles.starsRow}>
              {[...Array(5)].map((_, index) => {
                const filled = index + 1 <= Math.floor(user.rating);
                const half =
                  user.rating - index >= 0.5 && user.rating - index < 1;

                return (
                  <Ionicons
                    key={index}
                    name={
                      filled ? "star" : half ? "star-half" : "star-outline"
                    }
                    size={25}
                    color={Colors.violet4}
                    style={{ marginRight: 2 }}
                  />
                );
              })}
            </View>
          </View>

          <Text style={styles.summaryCardSubtitle}>
            Mirá los comentarios que te hicieron
          </Text>
        </TouchableOpacity>

        <View style={styles.optionsContainer}>
          {options.map((opt, idx) => {
            const iconElement = (
              <Feather
                name={opt.icon as any}
                size={22}
                color={Colors.gray3}
              />
            );

            const isLogout = opt.label === "Cerrar Sesión";
            const handlePress = opt.label === "Legal"
              ? loadTerms
              : isLogout
              ? onLogoutPress
              : opt.onPress ?? (() => {});

            return (
              <RowButton
                key={`${opt.label}-${idx}`}
                title={opt.label}
                icon={iconElement}
                onPress={handlePress}
                styles={rowButtonStyles1}
                disabled={isLogout && isLoggingOut}
                rightIcon={isLogout && isLoggingOut
                  ? <DotsLoader size={7} color={Colors.gray3} />
                  : undefined
                }
              />
            );
          })}
        </View>
      </ScrollView>

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

      {mpModalConfig && (
        <ImageWindow
          visible={mpModalVisible}
          title={mpModalConfig.title}
          subtitle={mpModalConfig.subtitle}
          texto={mpModalConfig.texto}
          imageSource={mpModalConfig.imageSource}
          buttonText="Aceptar"
          onClose={closeMpModal}
        />
      )}
    </SafeAreaView>
  );
}
