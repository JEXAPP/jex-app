import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import useBackendConection from "@/services/internal/useBackendConection";

type Worker = {
  id: string;
  name: string;
  role: string;
  linked: boolean;
  penalized: boolean;
  image: string | null;
  hasShown: boolean;
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

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const closeError = () => {
    setShowError(false);
    setErrorMessage("");
  };

  const closeSuccess = () => {
    setShowSuccess(false);
  };

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
          hasShown: emp.has_shown ?? false,
        }));
        setWorkersState(mapped);
      } else {
        setWorkersState([]);
      }
    } catch (err) {
      console.log("Error cargando empleados:", err);
      setWorkersState([]);
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
    () =>
      workersState.filter(
        (w) => w.role === selectedRole
      ),
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
      setErrorMessage("No seleccionaste ninguna calificación.");
      setShowError(true);
      return;
    }

    try {
      await requestBackend("/api/rating/rate/", dataToSend, "POST");

      // limpiar ratings y recargar datos para que no quede la misma calificación disponible
      setRatings({});
      await fetchWorkers();
      await fetchRoles();

      setShowSuccess(true);
    } catch (err: any) {
      console.log("Error enviando calificaciones:", err);
      const backendMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "No se pudieron enviar las calificaciones.";
      setErrorMessage(backendMsg);
      setShowError(true);
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
    showError,
    errorMessage,
    showSuccess,
    closeError,
    closeSuccess,
  };
};
