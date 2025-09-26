// hooks/employee/useQualify.ts
import { useState } from "react";

type Organizer = {
  id: string;
  name: string;
  image: string;
  event: string;
  date: string;
  time: string;
};

export const useQualify = () => {
  // 🔹 Datos hardcodeados
  const organizer: Organizer = {
    id: "1",
    name: "Juan Lopez",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    event: "Festival Primavera",
    date: "14/09/2025",
    time: "18:00 - 23:00",
  };

  const role = "Fotógrafo"; // rol del empleado en ese evento

  // Estado local
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const handleRating = (val: number) => {
    setRating(val);
    if (val === 0) {
      setComment(""); // reset comentario si se resetea la puntuación
    }
  };

  const handleSubmit = () => {
    console.log("📤 Enviando evaluación:", {
      organizerId: organizer.id,
      rating,
      comment,
    });
  };

  return {
    organizer,
    role,
    rating,
    comment,
    setComment,
    handleRating,
    handleSubmit,
  };
};
