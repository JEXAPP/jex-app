import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { Alert } from "react-native";
import useBackendConection from "@/services/internal/useBackendConection";

type Worker = {
  id: string;
  name: string;
  role: string;
  linked: boolean;
  penalized: boolean;
  image: string | null;
  hasShown: boolean; // ✅ nuevo campo
};

type RatingData = {
  rating: number;
  comment: string;
};

export const useQuali = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  const [roles, setRoles] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [ratings, setRatings] = useState<Record<string, RatingData>>({});
  const [workersState, setWorkersState] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchWorkers();
    }, [eventId])
  );

  const fetchRoles = async () => {
    try {
      const data = await requestBackend(
        `/api/vacancies/by-employer/${eventId}/`,
        null,
        "GET"
      );
      if (data && Array.isArray(data.vacancies)) {
        const vacancyRoles = data.vacancies.map((v: any) =>
          v.job_type?.name === "Otro" && v.specific_job_type
            ? v.specific_job_type
            : v.job_type?.name ?? v.name
        );
        setRoles(vacancyRoles);
        if (vacancyRoles.length > 0) setSelectedRole(vacancyRoles[0]);
      }
    } catch (err) {
      console.log("Error cargando roles:", err);
    }
  };

  const fetchWorkers = async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      const data = await requestBackend(
        `/api/events/${eventId}/employee/`,
        null,
        "GET"
      );
      if (Array.isArray(data)) {
        const mapped: Worker[] = data.map((emp: any) => ({
          id: String(emp.employee_id),
          name: emp.name,
          role: emp.job_type,
          linked: emp.is_linked,
          penalized: emp.is_penalized,
          image: emp.image ?? null,
          hasShown: emp.has_shown ?? false, // ✅ se guarda el nuevo campo
        }));
        setWorkersState(mapped);
      }
    } catch (err) {
      console.log("Error cargando empleados:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchRoles();
    }
  }, [eventId]);

  const workers = useMemo(
    () => workersState.filter((w) => w.role === selectedRole),
    [selectedRole, workersState]
  );

  const handleRating = (workerId: string, rating: number) => {
    setRatings((prev) => ({
      ...prev,
      [workerId]: { ...(prev[workerId] || {}), rating },
    }));
  };

  const handleComment = (workerId: string, comment: string) => {
    setRatings((prev) => ({
      ...prev,
      [workerId]: { ...(prev[workerId] || {}), comment },
    }));
  };

  const handleToggleLinked = (workerId: string) => {
    setWorkersState((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, linked: !w.linked } : w))
    );
  };

  const ratedCount = useMemo(
    () => workers.filter((w) => ratings[w.id]?.rating > 0).length,
    [ratings, workers]
  );

  const totalCount = workers.length;

  const handleSubmit = async () => {
    if (!eventId) return;

    const dataToSend = workers
      .map((w) => ({
        employee: Number(w.id),
        rating: ratings[w.id]?.rating ?? null,
        comments: ratings[w.id]?.comment ?? "",
        event: Number(eventId),
        link: w.linked,
      }))
      .filter((entry) => entry.rating !== null);

    if (dataToSend.length === 0) {
      Alert.alert("Aviso", "No seleccionaste ninguna calificación.");
      return;
    }

    try {
      await requestBackend("/api/rating/rate/", dataToSend, "POST");
      Alert.alert("Calificaciones Enviadas");
      fetchWorkers();
      fetchRoles();
    } catch (err) {
      console.log("❌ Error enviando calificaciones:", err);
      Alert.alert("Error", "No se pudieron enviar las calificaciones.");
    }
  };

  const handleSanction = (workerId: string) => {
    router.push({
      pathname: "/employer/panel/qualification/sanction",
      params: { workerId, eventId },
    });
  };

  return {
    roles,
    selectedRole,
    setSelectedRole,
    workers,
    ratings,
    handleRating,
    handleComment,
    handleSubmit,
    handleToggleLinked,
    handleSanction,
    ratedCount,
    totalCount,
    loading,
  };
};
