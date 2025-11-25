import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ImageSourcePropType } from "react-native";
import { clearTokens } from "@/services/internal/api";
import useBackendConection from "@/services/internal/useBackendConection";
import * as SecureStore from "expo-secure-store";
import { disconnectStream } from "@/services/stream/streamClient";
import { iconos } from "@/constants/iconos";
import { Colors } from "@/themes/colors";

type UserProfile = {
  name: string;
  description: string | null;
  image: string | null;
  rating: number;
  ratingCount: number;
};

type MpModalConfig = {
  title: string;
  subtitle?: string;
  texto?: string;
  imageSource?: ImageSourcePropType;
};

export const useProfile = () => {
  const { requestBackend } = useBackendConection();

  const [user, setUser] = useState<UserProfile | null>(null);

  const params = useLocalSearchParams<{
    status?: string | string[];
    reason?: string | string[];
    detail?: string | string[];
    user_id?: string | string[];
  }>();

  const [mpModalVisible, setMpModalVisible] = useState(false);
  const [mpModalConfig, setMpModalConfig] = useState<MpModalConfig | null>(
    null
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await requestBackend(
          "/api/auth/user/profile/",
          null,
          "GET"
        );

        if (data) {
          setUser({
            name: data.user_name ?? "Usuario",
            description: data.description ?? null,
            image: data.image_url ?? null,
            rating:
              data.rating !== null && !isNaN(data.rating)
                ? Number(data.rating)
                : 0,
            ratingCount: data.rating_count ?? 0,
          });
        }
      } catch (e: any) {
        console.warn("Error cargando perfil:", e.message);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const rawStatus = params.status;
    const rawReason = params.reason;
    const rawDetail = params.detail;

    const status = Array.isArray(rawStatus) ? rawStatus[0] : rawStatus;
    const reason = Array.isArray(rawReason) ? rawReason[0] : rawReason;
    const detail = Array.isArray(rawDetail) ? rawDetail[0] : rawDetail;

    if (!status) return;

    if (status === "success") {
      setMpModalConfig({
        title: "Cuenta Asociada",
        imageSource: require("@/assets/images/jex/Jex-Asociado.webp"),
        subtitle: "Se conectó correctamente tu cuenta de Mercado Pago.",})
      setMpModalVisible(true);
      return;
    }

    if (status === "error") {
      let subtitle =
        "No pudimos completar la vinculación con Mercado Pago. Intentá devuelta más tarde";
      switch (reason) {
        case "missing_code_or_state":
          subtitle =
            "No recibimos todos los datos necesarios desde Mercado Pago. Intentá devuelta más tarde";
          break;

        case "invalid_state":
          subtitle = "Detectamos un problema de seguridad en el proceso. Intentá devuelta más tarde";
          break;

        case "token_exchange_failed":
          subtitle = "Mercado Pago no respondió correctamente. Intentá devuelta más tarde";
          break;

        case "db_error":
          subtitle = "Algo falló al guardar la información en JEX. Intentá devuelta más tarde";
          break;

        default:
          subtitle = "Ocurrió un problema al asociar tu cuenta. Intentá devuelta más tarde";
      }

      setMpModalConfig({
        title: "Ocurrió un error inesperado",
        imageSource: require("@/assets/images/jex/Jex-Olvidadizo.webp"),
        subtitle,
      });
      setMpModalVisible(true);
    }
  }, [params.status, params.reason, params.detail]);

  const closeMpModal = () => {
    setMpModalVisible(false);
  };

  const debugTokens = async () => {
    const access = await SecureStore.getItemAsync("access");
    const refresh = await SecureStore.getItemAsync("refresh");
    console.log("ACCESS:", access);
    console.log("REFRESH:", refresh);
  };

  const goToProfileDetails = () => {
    router.push("/employee/profile/view-profile");
  };

  const goToRatingsScreen = () => {
    router.push("/employee/profile/rating");
  };

  const goToWorkHistory = () => {
    router.push("/employee/profile/work-history");
  };

  const goToAccountSettings = () => {
    router.push("/employee/profile/settings");
  };

  const goToQualify = () => {
    router.push("/employee/profile/qualify-list")
  };

  const options = [
    {
      label: "Calificá a los organizadores",
      icon: "star",
      onPress: goToQualify,
    },
    {
      label: "Configuración de la cuenta",
      icon: "settings",
      onPress: goToAccountSettings,
    },
    {
      label: "Legal",
      icon: "file-text",
    },
    
  ];

  const handleLogout = async () => {
    try {
      const refresh = await SecureStore.getItemAsync("refresh");

      if (refresh) {
        await requestBackend("/api/auth/logout/", { refresh }, "POST");
        console.log("Sesión cerrada en backend");
      }

      try {
        await disconnectStream();
        console.log("Stream desconectado correctamente");
      } catch (err) {
        console.warn("Error al desconectar Stream:", err);
      }
    } catch (e: any) {
      console.warn("Error general al cerrar sesión:", e.message);
    } finally {
      await clearTokens();
      router.replace("/");
    }
  };

  return {
    user,
    options,
    handleLogout,
    goToProfileDetails,
    goToRatingsScreen,
    goToWorkHistory,
    mpModalVisible,
    mpModalConfig,
    closeMpModal,
  };
};
