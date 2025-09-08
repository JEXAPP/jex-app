// hooks/employee/jobs/useActiveJobs.ts
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import useBackendConection from "@/services/internal/useBackendConection";

export type Job = {
  id: number;
  eventName: string;
  date: string;
  role: string;
  salary: string;
  startDate: string; // para calcular los días
  image: any;
  daysRemaining: number;
};

export const useActiveJobs = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();
  const [jobs, setJobs] = useState<Job[]>([]);

  const formatDate = (dateStr: string) => {
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const d = new Date(dateStr);
    return `${d.getDate()} de ${months[d.getMonth()]} del ${d.getFullYear()}`;
  };

  const formatNumberAR = (v: string | number) => {
    const n = Number(v);
    return isNaN(n) ? String(v) : new Intl.NumberFormat("es-AR").format(n);
  };

  useEffect(() => {
    let mounted = true;
    const fetchJobs = async () => {
      try {
        const today = new Date();
        const data = await requestBackend("/api/applications/employee-jobs/", null, "GET");
        if (!mounted) return;

        const normalized: Job[] = (data ?? []).map((item: any, idx: number) => {
          const startDate = item.shift?.start_date ?? "";
          const start = new Date(startDate);
          const diffMs = start.getTime() - today.getTime();
          const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

          return {
            id: item.event?.id ?? idx, // fallback si no viene id
            eventName: item.event?.name ?? "Evento sin nombre",
            date: startDate ? formatDate(startDate) : "Sin fecha",
            role: item.shift?.job_type ?? "Sin rol",
            salary: formatNumberAR(item.shift?.payment ?? 0),
            startDate,
            image: require("@/assets/images/Publicidad1.png"), // 👈 default por ahora
            daysRemaining: diffDays,
          };
        });

        setJobs(normalized);
      } catch (e) {
        console.log("Error cargando trabajos activos:", e);
      }
    };

    fetchJobs();
    return () => {
      mounted = false;
    };
  }, []);

  const goToJobDetail = (job: Job) => {
    router.push({
      pathname: "/employee/offers",
      params: { id: job.id },
    });
  };

  return { jobs, goToJobDetail };
};
