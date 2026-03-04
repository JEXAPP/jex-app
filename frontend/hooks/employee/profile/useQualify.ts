import { useState } from "react";
import useBackendConection from "@/services/internal/useBackendConection";
import { router, useLocalSearchParams } from "expo-router";

export const useQualify = () => {
  const { requestBackend } = useBackendConection();
  const params = useLocalSearchParams();

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRating = (val: number) => {
    setRating(val);
    if (val === 0) setComment("");
  };

  const handleSubmit = async () => {
    if (!params.employerId || !params.eventId) {
      setErrorMessage("Faltan datos para calificar al organizador.");
      setShowError(true);
      return;
    }

    if (rating <= 0) {
      setErrorMessage("Debés elegir al menos una estrella para calificar.");
      setShowError(true);
      return;
    }

    setLoading(true);
    try {
      const body = [
        {
          employer: Number(params.employerId),
          event: Number(params.eventId),
          rating,
          comments: comment,
        },
      ];

      await requestBackend("/api/rating/rate-employer/", body, "POST");

      // limpiamos estado local
      setRating(0);
      setComment("");
      setShowSuccess(true);
    } catch (err: any) {
      console.error("Error al enviar calificación:", err);
      const backendMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "No se pudo enviar la calificación.";
      setErrorMessage(backendMsg);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    // volvemos a la pantalla anterior (lista de eventos / historial, etc.)
    router.replace('/employee/profile/qualify-list');
  };

  const closeError = () => {
    setShowError(false);
    setErrorMessage("");
  };

  const imageSource =
    typeof params.imageUrl === "string" && params.imageUrl.length > 0
      ? params.imageUrl
      : null;

  return {
    rating,
    comment,
    loading,
    handleRating,
    handleSubmit,
    setComment,
    showError,
    errorMessage,
    showSuccess,
    closeError,
    closeSuccess,
    organizer: {
      name: params.employerName,
      event: params.eventName,
      date: params.date,
      time: params.time,
      image: imageSource
        ? imageSource
        : require("@/assets/images/jex/Jex-FotoPerfil.webp"),
    },
    role: params.jobType,
  };
};
