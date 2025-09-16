// hooks/employee/jobs/useActiveJobs.ts
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import useBackendConection from "@/services/internal/useBackendConection";

export type Job = {
  id: number;
  eventName: string;
  category: string;   // 👈 nuevo
  date: string;
  role: string;
  salary: string;
  startDate: string;
  image: any;
  daysRemaining: number;
};


export const useActiveJobs = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();
  const [jobs, setJobs] = useState<Job[]>([]);

  const parseDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
};

  const formatDate = (d: Date) => {
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
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
    today.setHours(0, 0, 0, 0); // 👈 reseteamos hora para comparar solo días

    const data = await requestBackend("/api/applications/employee-jobs/", null, "GET");
    if (!mounted) return;

    const normalized: Job[] = (data ?? [])
      .map((item: any) => {
        const startDateStr = item.shift?.start_date ?? "";
        const start = startDateStr ? parseDate(startDateStr) : null;

        let diffDays = 0;
        if (start) {
          const diffMs = start.getTime() - today.getTime();
          diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        }

        return {
          id: `${item.event?.id ?? "noevent"}-${item.shift?.job_type ?? "norole"}-${item.shift?.start_date ?? "nodate"}-${item.shift?.start_time ?? "nostart"}-${item.shift?.end_time ?? "noend"}`,
          eventName: item.event?.name ?? "Evento sin nombre",
          category: item.event?.category ?? "",
          date: start ? formatDate(start) : "Sin fecha",
          role: item.shift?.job_type ?? "Sin rol",
          salary: formatNumberAR(item.shift?.payment ?? 0),
          startDate: startDateStr,
          image: require("@/assets/images/Publicidad1.png"),
          daysRemaining: diffDays,
        };
      })
      // 👇 filtro: solo mostrar trabajos que faltan hoy o más adelante
      .filter((job: Job) => job.daysRemaining >= 0);

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
