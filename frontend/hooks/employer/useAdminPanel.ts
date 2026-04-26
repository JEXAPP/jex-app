import { logger } from '@/services/internal/logger';
import useBackendConection from "@/services/internal/useBackendConection";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";

const ENABLED_LABELS_BY_STATE: Record<string, string[]> = {
  Borrador: ["Vacantes", "Editar Evento"],
  Publicado: ["Vacantes", "Contratación Tardía"],
  "En curso": ["Asistencia"],
  Finalizado: ["Calificaciones", "Reportes"],
};

export const useAdminPanel = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();

  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  const fetchHasNewNotifications = async () => {
    try {
      const response = await requestBackend(
        "/api/notifications/are-new-notifications/",
        null,
        "GET"
      );
      if (typeof response?.message === "boolean") {
        setHasNewNotifications(response.message);
      }
    } catch (err) {
      logger.log("Error consultando nuevas notificaciones:", err);
    }
  };

  useFocusEffect(useCallback(() => { fetchHasNewNotifications(); }, []));
  useEffect(() => { fetchHasNewNotifications(); }, []);

  const getOrderedButtons = (buttons: any[], stateName?: string) => {
    const enabledLabels = ENABLED_LABELS_BY_STATE[stateName ?? ''] ?? [];
    const enabled = buttons
      .filter(btn => enabledLabels.includes(btn.label))
      .sort((a, b) => a.label.localeCompare(b.label));
    const disabled = buttons
      .filter(btn => !enabledLabels.includes(btn.label))
      .sort((a, b) => a.label.localeCompare(b.label));
    return [...enabled, ...disabled];
  };

  const goToEditEvent = (id: number) =>
    router.push(`/employer/panel/edit-event?id=${id}`);

  const goToVacancies = (eventId: number) =>
    router.push({
      pathname: "/employer/panel/vacancy",
      params: { id: String(eventId) },
    });

  const goToNotifications = () => {
    setHasNewNotifications(false);
    router.push("/employer/panel/notifications");
  };

  const goToReports = (id: number) =>
    router.push({ pathname: "/employer/panel/report", params: { id: String(id) } });

  const goToAttendance = (id: number) =>
    router.push(`/employer/panel/attendance?id=${id}`);

  const goToQualifications = (eventId: number) =>
    router.push({
      pathname: "/employer/panel/qualification",
      params: { eventId: String(eventId) },
    });

  return {
    hasNewNotifications,
    getOrderedButtons,
    goToEditEvent,
    goToVacancies,
    goToNotifications,
    goToReports,
    goToAttendance,
    goToQualifications,
  };
};

export default useAdminPanel;
