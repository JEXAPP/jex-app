import { useEffect, useState } from "react";
import useBackendConection from "@/services/internal/useBackendConection";

type EmployerToRate = {
  employer_id: number;
  company_name: string;
  employer_full_name: string;
  job_type: string;
  event_id: number;
  event_name: string;
  event_start_date: string;
  event_start_time: string;
  event_end_date: string;
  event_end_time: string;
  already_rated: boolean;
  image_url: string | null;
};

export const useQualifyList = () => {
  const { requestBackend } = useBackendConection();
  const [employers, setEmployers] = useState<EmployerToRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const res = await requestBackend("/api/rating/employers/torating/", null, "GET");
        setEmployers(res);
      } catch (err: any) {
        console.error("❌ Error al traer empleadores:", err);
        setError("No se pudieron cargar los eventos.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployers();
  }, []);

  return { employers, loading, error };
};
