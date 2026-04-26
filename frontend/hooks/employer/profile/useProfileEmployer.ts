// src/hooks/employer/profile/useProfileEmployer.ts
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { clearTokens } from "@/services/internal/api";
import useBackendConection from "@/services/internal/useBackendConection";
import { disconnectStream } from "@/services/stream/streamClient";
import { logger } from "@/services/internal/logger";

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
      } catch (e: unknown) {
        logger.warn("Error cargando perfil:", (e as Error).message);
      }
    };

    fetchProfile();
  }, []);

  // Navegaciones
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

  // COMPLIANCE: Ley 25.326 – user can request deletion of all personal data
  const handleDeleteAccount = async () => {
    try {
      await requestBackend("/api/auth/user/delete/", null, "DELETE");
    } finally {
      try { await disconnectStream(); } catch { /* stream already disconnected */ }
      await clearTokens();
      router.replace("/");
    }
  };

  const handleLogout = async () => {
    try {
      const { getToken } = await import("@/services/internal/useTokenStorage");
      const refresh = await getToken("refresh");

      if (refresh) {
        try {
          await requestBackend("/api/auth/logout/", { refresh }, "POST");
        } catch (e) {
          logger.warn("Logout backend falló, continuando:", (e as Error).message);
        }
      }

      try {
        await disconnectStream();
      } catch (e) {
        logger.warn("Error al desconectar Stream:", (e as Error).message);
      }

    } finally {
      await clearTokens();
      router.replace("/");
    }
  };

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
    {
      label: "Cerrar Sesión",
      icon: "log-out",
      onPress: handleLogout,
    },
  ];

  return {
    user,
    options,
    handleLogout,
    handleDeleteAccount,
    goToProfileDetails,
    goToRatingsScreen,
    goToEventsHistory,
  };
};
