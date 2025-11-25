// hooks/employer/profile/useViewEmployerProfile.ts
import { useEffect, useState } from "react";
import useBackendConection from "@/services/internal/useBackendConection";

export type EmployerProfile = {
  id: number | string;
  companyName: string;
  description: string | null;
  profileImageUrl: string | null;
};

export const useViewEmployerProfile = () => {
  const { requestBackend } = useBackendConection();

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<EmployerProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res: any = await requestBackend(
          "/api/auth/employer/view-profile-description/",
          null,
          "GET"
        );

        if (!mounted || !res) return;

        const mapped: EmployerProfile = {
          id: res.id,
          companyName: res.company_name ?? "",
          description: res.description ?? null,
          profileImageUrl: res.profile_image_url ?? null,
        };

        setData(mapped);
      } catch (e: any) {
        console.log("Error cargando perfil de empleador:", e);
        if (mounted) {
          setError(e?.message || "Error al cargar el perfil del empleador.");
        }
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
