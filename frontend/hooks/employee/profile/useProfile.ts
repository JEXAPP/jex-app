import { useState } from "react";
import { router } from "expo-router";
import { clearTokens } from "@/services/internal/api"; // 👈 importante
import * as SecureStore from "expo-secure-store";



export const useProfile = () => {
  const [user] = useState({
    name: "Martina Salvo",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5.0,
  });

  const debugTokens = async () => {
  const access = await SecureStore.getItemAsync("access");
  const refresh = await SecureStore.getItemAsync("refresh");
  console.log("ACCESS:", access);
  console.log("REFRESH:", refresh);
};

  const options = [
    { label: "Configuración de la cuenta", icon: "settings" },
    { label: "Consultá tu perfil", icon: "user" },
    { label: "Privacidad", icon: "lock" },
    { label: "Invitá a un trabajador", icon: "user-plus" },
    { label: "Legal", icon: "file-text" },
  ];

  const handleLogout = async () => {
    // 👇 opcional: si tu backend tiene endpoint de logout, pegale antes
    // try { await requestBackend('/api/auth/logout/', {}, 'POST') } catch (e) {}

    await clearTokens();
    await debugTokens(); // 👈 debería imprimir null en ambos
    router.replace("/"); // 🔑 vuelve al login
  };

  return {
    user,
    options,
    handleLogout,
  };
};
