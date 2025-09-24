// hooks/employer/panel/qualification/useQuali.ts
import { useState, useMemo } from "react";
import { useRouter } from "expo-router";

type Worker = {
  id: string;
  name: string;
  role: string;
  image: string;
  linked: boolean;
};

type RatingData = {
  rating: number;
  comment: string;
};

export const useQuali = () => {
  const router = useRouter();

  const roles = ["Fotógrafo", "Cantante", "DJ", "Catering"];

  const allWorkers: Worker[] = [
    {
      id: "1",
      name: "Martina Salvo",
      role: "Fotógrafo",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      linked: true,
    },
    {
      id: "2",
      name: "Juan García",
      role: "Fotógrafo",
      image: "https://randomuser.me/api/portraits/men/46.jpg",
      linked: false,
    },
    {
      id: "3",
      name: "Luna Costas",
      role: "Fotógrafo",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      linked: false,
    },
    {
      id: "4",
      name: "Diego López",
      role: "Cantante",
      image: "https://randomuser.me/api/portraits/men/12.jpg",
      linked: true,
    },
    {
      id: "5",
      name: "Paula Méndez",
      role: "DJ",
      image: "https://randomuser.me/api/portraits/women/22.jpg",
      linked: false,
    },
  ];

  const [selectedRole, setSelectedRole] = useState<string>(roles[0]);
  const [ratings, setRatings] = useState<Record<string, RatingData>>({});
  const [workersState, setWorkersState] = useState<Worker[]>(allWorkers);

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
      prev.map((w) =>
        w.id === workerId ? { ...w, linked: !w.linked } : w
      )
    );
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
  };

  // 👉 Navegar a la pantalla de sanción
  const handleSanction = (workerId: string) => {
    router.push({
      pathname: "/employer/panel/qualification/sanction",
      params: { workerId },
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
    handleSanction, // 👈 nuevo
    ratedCount,
    totalCount,
  };
};
