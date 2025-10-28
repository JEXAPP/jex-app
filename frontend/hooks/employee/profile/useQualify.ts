import { useState } from "react";
import useBackendConection from "@/services/internal/useBackendConection";
import { router, useLocalSearchParams } from "expo-router";

export const useQualify = () => {
  const { requestBackend } = useBackendConection();
  const params = useLocalSearchParams();

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleRating = (val: number) => {
    setRating(val);
    if (val === 0) setComment("");
  };

  const handleSubmit = async () => {
    if (!params.employerId || !params.eventId) return;

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

      console.log("✅ Calificación enviada:", body);
      router.back();
    } catch (err) {
      console.error("❌ Error al enviar calificación:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ se usa la imagen proveniente del backend o fallback local
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
    organizer: {
      name: params.employerName,
      event: params.eventName,
      date: params.date,
      time: params.time,
      image: imageSource
        ? imageSource
        : require("@/assets/images/jex/Jex-FotoPerfil.webp"), // ✅ fallback local
    },
    role: params.jobType,
  };
};
