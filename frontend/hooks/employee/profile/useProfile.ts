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
    description: string | null;
    image: string | null;
    rating: number;
    ratingCount: number;
  } | null>(null);

  // 👉 cargar datos del usuario desde el nuevo endpoint
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

  const options = [
    {
      label: "Calificar organizadores",
      icon: "star",
      onPress: () => router.push("/employee/profile/qualify-list"),
    },
    { label: "Legal", icon: "file-text" }, // lo abre ProfileScreen con loadTerms
  ];

  const handleLogout = async () => {
  try {
    const refresh = await SecureStore.getItemAsync("refresh");

    // 1️⃣ Cierra sesión en backend
    if (refresh) {
      await requestBackend("/api/auth/logout/", { refresh }, "POST");
      console.log("✅ Sesión cerrada en backend");
    }

    // 2️⃣ Desconecta del cliente Stream si está activo
    try {
      await disconnectStream();
      console.log("✅ Desconectado de Stream correctamente");
    } catch (err) {
      console.warn("⚠️ Error al desconectar Stream:", err);
    }
  } catch (e: any) {
    console.warn("⚠️ Error general al cerrar sesión:", e.message);
  } finally {
    // 3️⃣ Limpieza de tokens y navegación
    await clearTokens();
    await debugTokens();
    router.replace("/");
  }
};

  return {
    user,
    options,
    handleLogout,
  };
};
