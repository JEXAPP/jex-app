import { useEffect, useState } from "react";
import useBackendConection from "@/services/internal/useBackendConection";

export type NormalizedExperience = {
  id: number | string;
  title: string;
  place: string;
  startDateLabel: string;
  endDateLabel: string;
  startTimestamp: number;
  description: string | null;
  imageUrls: string[];
};

export type NormalizedEducation = NormalizedExperience;

export type NormalizedLanguage = {
  id: string | number;
  name: string;
  level?: string | null;
};

export type MyPublicProfile = {
  fullName: string;
  dni: string;
  birthDate: string | null;
  age: number | null;

  address: string | null;

  description: string | null;
  profileImage: string | null;

  experiences: NormalizedExperience[];
  educations: NormalizedEducation[];
  languages: NormalizedLanguage[];
};

// Utilidad para convertir dd/mm/yyyy a timestamp
function ddmmyyyyToTimestamp(date: string) {
  if (!date) return 0;
  const [d, m, y] = date.split("/").map(Number);
  return new Date(y, m - 1, d).getTime();
}

// Calcula edad soportando "yyyy-mm-dd" e "dd/mm/yyyy"
function calculateAgeFromString(birthDate: string | null): number | null {
  if (!birthDate) return null;

  let date: Date | null = null;

  if (birthDate.includes("/")) {
    // dd/mm/yyyy
    const [d, m, y] = birthDate.split("/").map(Number);
    if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
      date = new Date(y, m - 1, d);
    }
  } else if (birthDate.includes("-")) {
    // yyyy-mm-dd
    const [y, m, d] = birthDate.split("-").map(Number);
    if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
      date = new Date(y, m - 1, d);
    }
  }

  if (!date || isNaN(date.getTime())) return null;

  const now = new Date();
  let age = now.getFullYear() - date.getFullYear();
  const monthDiff = now.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < date.getDate())) {
    age--;
  }
  return age;
}

export const useMyPublicProfileView = () => {
  const { requestBackend } = useBackendConection();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MyPublicProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);

        // 1) Perfil básico
        const basic = await requestBackend(
          "/api/auth/employee/view-profile-description/",
          null,
          "GET"
        );

        const fullName = `${basic.first_name} ${basic.last_name}`.trim();
        const birthDate: string | null = basic.birth_date ?? null;
        const age = calculateAgeFromString(birthDate);

        const address: string | null = basic.address ?? null;

        // 2) Experiencia
        const expRes: any[] = await requestBackend(
          "/api/auth/employee/view-work-experience/",
          null,
          "GET"
        );

        const experiences: NormalizedExperience[] = expRes.map((e) => {
          const startLabel = e.start_date;
          const endLabel = e.end_date;

          return {
            id: e.id,
            title: e.title,
            place: e.company_or_event,
            startDateLabel: startLabel,
            endDateLabel: endLabel,
            startTimestamp: ddmmyyyyToTimestamp(startLabel),
            description: e.description,
            imageUrls: e.image_url ? [e.image_url] : [],
          };
        });

        // 3) Educación
        const eduRes: any[] = await requestBackend(
          "/api/auth/employee/view-education/",
          null,
          "GET"
        );

        const educations: NormalizedEducation[] = eduRes.map((e) => {
          const startLabel = e.start_date;
          const endLabel = e.end_date;
          const place = `${e.institution} • ${e.discipline ?? ""}`.trim();

          return {
            id: e.id,
            title: e.title,
            place,
            startDateLabel: startLabel,
            endDateLabel: endLabel,
            startTimestamp: ddmmyyyyToTimestamp(startLabel),
            description: e.description,
            imageUrls: e.image_url ? [e.image_url] : [],
          };
        });

        // 4) Idiomas
        const langsRes: any[] = await requestBackend(
          "/api/auth/employee/languages/",
          null,
          "GET"
        );

        const languages: NormalizedLanguage[] = langsRes.map((l) => ({
          id: l.id,
          name: l.language,
          level: l.level?.name ?? null,
        }));

        const finalData: MyPublicProfile = {
          fullName,
          dni: basic.dni,
          birthDate,
          age,
          address,
          description: basic.description ?? null,
          profileImage: basic.profile_image_url ?? null,
          experiences,
          educations,
          languages,
        };

        if (mounted) setData(finalData);
      } catch (e: any) {
        if (mounted) setError(e.message || "Error al cargar perfil");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return {
    loading,
    data,
    error,
  };
};
