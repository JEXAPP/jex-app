import { useEffect, useState } from "react";
import { router } from "expo-router";
import { clearTokens } from "@/services/internal/api";
import useBackendConection from "@/services/internal/useBackendConection";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { disconnectStream } from "@/services/stream/streamClient";

// Tipo del payload de tu JWT
type JwtPayload = {
  user_id: number; // asegurate que tu backend ponga el id acá
  exp: number;
};

export const useProfile = () => {
  const { requestBackend } = useBackendConection();

  const [user, setUser] = useState<{
    name: string;
    image: string | null; 
    rating: number;
  } | null>(null);

  // 👉 decodificar token para obtener id
  const getEmployeeId = async () => {
    const access = await SecureStore.getItemAsync("access");
    if (!access) throw new Error("No hay access token");
    const decoded: JwtPayload = jwtDecode(access);
    return decoded.user_id;
  };

  // 👉 cargar datos del empleado
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const employeeId = await getEmployeeId();
        const data = await requestBackend(
          `/api/rating/viewratings/${employeeId}/`,
          null,
          "GET"
        );

        if (data) {
          setUser({
            name: `${data.user_full_name}`,
            image: data.image_url ?? null, 
            rating:
              data.average_rating !== null
                ? Number(data.average_rating.toFixed(1))
                : 0,
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
  //{ label: "Configuración de la cuenta", icon: "settings" },
  //{ label: "Consultá tu perfil", icon: "user" },
  //{ label: "Privacidad", icon: "lock" },
  //{ label: "Invitá a un trabajador", icon: "user-plus" },
  {
    label: "Calificar organizadores",
    icon: "star",
    onPress: () => router.push("/employee/profile/qualify-list"),
  },
  { label: "Legal", icon: "file-text" }, // ahora lo abre ProfileScreen con loadTerms
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
