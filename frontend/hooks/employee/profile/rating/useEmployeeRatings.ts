import { useEffect, useState } from "react";
import useBackendConection from "@/services/internal/useBackendConection";

export type EmployeeRating = {
  id: string;
  companyName: string;
  reviewerImageUrl?: string | null;
  jobType: string;
  jobDate: string;       // dd/mm/aaaa (tal cual viene del backend)
  score: number;         // 0..5
  comment: string;
  createdAt: string;     // dd/mm/aaaa
};

function parseDDMMYYYY(dateStr: string): Date {
  // dateStr = "20/11/2025"
  const [dd, mm, yyyy] = dateStr.split("/").map(Number);
  return new Date(yyyy, mm - 1, dd);
}

export const useEmployeeRatings = () => {
  const { requestBackend } = useBackendConection();

  const [ratings, setRatings] = useState<EmployeeRating[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);

        // GET api/rating/employee/ratings
        const data = await requestBackend(
          "/api/rating/employee/ratings/",
          null,
          "GET"
        );

        if (!Array.isArray(data)) {
          setRatings([]);
          return;
        }

        const mapped: EmployeeRating[] = data.map((raw: any) => ({
          id: String(raw.id),
          companyName: raw.company_name ?? "Organizador",
          reviewerImageUrl:
            raw.reviewerImageUrl !== undefined ? raw.reviewerImageUrl : null,
          jobType: raw.job_type ?? "",
          jobDate: raw.job_date,              // viene dd/mm/aaaa
          score: Number(raw.score ?? 0),
          comment: raw.comment ?? "",
          createdAt: raw.createdAt,           // viene dd/mm/aaaa
        }));

        // Ordenar de más nuevo a más viejo (comparando Dates reales)
        const ordered = [...mapped].sort(
          (a, b) =>
            parseDDMMYYYY(b.createdAt).getTime() -
            parseDDMMYYYY(a.createdAt).getTime()
        );

        setRatings(ordered);
      } catch (err: any) {
        console.warn("Error cargando calificaciones:", err?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  return {
    ratings,
    loading,
  };
};
