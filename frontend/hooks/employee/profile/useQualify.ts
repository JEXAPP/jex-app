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
      image: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    role: params.jobType,
  };
};
