// src/hooks/employer/profile/rating/useEmployerRatings.ts
import { useEffect, useState } from "react";
import useBackendConection from "@/services/internal/useBackendConection";

export type EmployerRating = {
  id: string;
  employeeName: string;
  employeeImageUrl: string | null;
  eventName: string;
  jobType: string;
  score: number;
  comment: string;
  createdAt: string; // "dd/mm/yyyy"
};

type APIResponseItem = {
  id: number;
  employee_name: string;
  employee_image_url: string | null;
  event_name: string;
  job_type: string;
  score: number;
  comment: string;
  created_at: string;
};

type APIPaginated = {
  count: number;
  next: string | null;
  previous: string | null;
  results: APIResponseItem[];
};

export const useEmployerRatings = () => {
  const { requestBackend } = useBackendConection();

  const [ratings, setRatings] = useState<EmployerRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchRatings = async () => {
      try {
        setLoading(true);
        setError(null);

        const res: APIPaginated = await requestBackend(
          "/api/rating/employer/ratings",
          null,
          "GET"
        );

        if (!mounted) return;

        const mapped: EmployerRating[] = (res?.results ?? []).map((r) => ({
          id: String(r.id),
          employeeName: r.employee_name,
          employeeImageUrl: r.employee_image_url ?? null,
          eventName: r.event_name,
          jobType: r.job_type,
          score: r.score,
          comment: r.comment,
          createdAt: r.created_at,
        }));

        setRatings(mapped);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || "Error al cargar las calificaciones.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchRatings();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    ratings,
    loading,
    error,
  };
};
