// hooks/useQuali.ts
import { useState, useMemo } from "react";

type Worker = {
  id: string;
  name: string;
  role: string;
  image: string;
};

type RatingData = {
  rating: number;
  comment: string;
};

export const useQuali = () => {
  // Hardcodeo de roles y trabajadores
  const roles = ["Fotógrafo", "Cantante", "DJ", "Catering"];

  const allWorkers: Worker[] = [
    {
      id: "1",
      name: "Martina Salvo",
      role: "Fotógrafo",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: "2",
      name: "Juan García",
      role: "Fotógrafo",
      image: "https://randomuser.me/api/portraits/men/46.jpg",
    },
    {
      id: "3",
      name: "Luna Costas",
      role: "Fotógrafo",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      id: "4",
      name: "Diego López",
      role: "Cantante",
      image: "https://randomuser.me/api/portraits/men/12.jpg",
    },
    {
      id: "5",
      name: "Paula Méndez",
      role: "DJ",
      image: "https://randomuser.me/api/portraits/women/22.jpg",
    },
  ];

  const [selectedRole, setSelectedRole] = useState<string>(roles[0]);
  const [ratings, setRatings] = useState<Record<string, RatingData>>({});

  const workers = useMemo(
    () => allWorkers.filter((w) => w.role === selectedRole),
    [selectedRole]
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

  const ratedCount = useMemo(
    () => workers.filter((w) => ratings[w.id]?.rating > 0).length,
    [ratings, workers]
  );

  const totalCount = workers.length;

  const handleSubmit = () => {
    const dataToSend = workers
      .map((w) => ({
        workerId: w.id,
        rating: ratings[w.id]?.rating ?? null,
        comment: ratings[w.id]?.comment ?? "",
      }))
      .filter((entry) => entry.rating !== null);

    console.log("📤 Enviando calificaciones:", dataToSend);
    // acá luego iría el requestBackend()
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
    ratedCount,
    totalCount,
  };
};
