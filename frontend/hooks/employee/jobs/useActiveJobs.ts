// hooks/employee/jobs/useActiveJobs.ts
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";

export type Job = {
  id: number;
  eventName: string;
  eventType: string;
  date: string;
  role: string;
  salary: string;
  startDate: string; // para calcular los días
  image: any;
  daysRemaining: number;
};

export const useActiveJobs = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Hardcodeo de prueba
    const today = new Date();

    const jobsMock: Job[] = [
      {
        id: 1,
        eventName: "Torneo Nacional Futbol 2021",
        eventType: "Deporte",
        date: "18 y 19 de Febrero del 2025",
        role: "Fotógrafo",
        salary: "90.000",
        startDate: "2025-09-18",
        image: require("@/assets/images/Publicidad1.png"),
        daysRemaining: 0,
      },
      {
        id: 2,
        eventName: "Vibras",
        eventType: "Festival",
        date: "28 de Febrero del 2025",
        role: "Técnico de Escenario",
        salary: "90.000",
        startDate: "2025-09-28",
        image: require("@/assets/images/Publicidad1.png"),
        daysRemaining: 0,
      },
    ];

    // calcular días restantes dinámicamente
    const withDays = jobsMock.map((job) => {
      const start = new Date(job.startDate);
      const diffMs = start.getTime() - today.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return { ...job, daysRemaining: diffDays };
    });

    setJobs(withDays);
  }, []);

  const goToJobDetail = (job: Job) => {
    router.push({
      pathname: "/employee/offers",
      params: { id: job.id },
    });
  };

  return { jobs, goToJobDetail };
};
