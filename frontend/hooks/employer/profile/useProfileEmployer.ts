// src/hooks/employer/profile/useProfileEmployer.ts
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { clearTokens } from "@/services/internal/api";
import useBackendConection from "@/services/internal/useBackendConection";
import * as SecureStore from "expo-secure-store";
import { disconnectStream } from "@/services/stream/streamClient";

export const useProfile = () => {
  const { requestBackend } = useBackendConection();

  const [user, setUser] = useState<{
    name: string;
    image: string | null;
    rating: number;
    ratingCount: number;
  } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await requestBackend(`/api/auth/user/profile/`, null, "GET");

        if (data) {
          const ratingNumber =
            data.rating !== null && data.rating !== undefined
              ? Number(data.rating)
              : 0;

          setUser({
            name: data.user_name ?? "Usuario",
            image: data.image_url ?? null,
            rating: ratingNumber,
            ratingCount: data.rating_count ?? 0,
          });
        }
      } catch (e: any) {
        console.warn("⚠️ Error cargando perfil:", e.message);
      }
    };

    fetchProfile();
  }, []);

  const debugTokens = async () => {
    const access = await SecureStore.getItemAsync("access");
    const refresh = await SecureStore.getItemAsync("refresh");
    console.log("ACCESS:", access);
    console.log("REFRESH:", refresh);
  };

  // Navegaciones (ajustá paths si los tuyos son otros)
  const goToProfileDetails = () => {
   router.push("/employer/profile/view-profile");
  };

  const goToRatingsScreen = () => {
    router.push("/employer/profile/employer-ratings");
  };

  const goToEventsHistory = () => {
    router.push("/employer/profile/events-history");
  };
  
  const goToEditProfile = () => {
    router.push("/employer/profile/edit-basic")
  }

  const options = [
    {
      label: "Editar perfil",
      icon: "user",
      onPress: goToEditProfile,
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
        console.log("✅ Sesión cerrada en backend");
      }
      await disconnectStream();
    } catch (e: any) {
      console.warn("⚠️ Error al cerrar sesión en backend:", e.message);
    } finally {
      await clearTokens();
      await debugTokens();
      router.replace("/");
    }
  };

  return {
    user,
    options,
    handleLogout,
    goToProfileDetails,
    goToRatingsScreen,
    goToEventsHistory,
  };
};
