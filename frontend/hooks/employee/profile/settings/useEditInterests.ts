// src/hooks/employee/profile/useEditInterests.ts
import { useEffect, useMemo, useState } from "react";
import useBackendConection from "@/services/internal/useBackendConection";
import { useTokenValidations } from "@/services/internal/useTokenValidations";
import { useRouter } from "expo-router";

type Interest = { id: number; name: string };

export const useEditInterests = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();
  const { validateToken } = useTokenValidations();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [intereses, setIntereses] = useState<Interest[]>([]);
  const [interesesSeleccionados, setInteresesSeleccionados] = useState<number[]>([]);
  const [interesesIniciales, setInteresesIniciales] = useState<number[]>([]);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      try {
        await validateToken("employee");

        const [allTypes, userInterests] = await Promise.all([
          requestBackend("/api/vacancies/job-types/", null, "GET"),
          requestBackend("/api/auth/employee/view-interests/", null, "GET"),
        ]);

        if (!alive) return;

        if (Array.isArray(allTypes)) {
          setIntereses(allTypes);
        }

        const selectedFromBackend: number[] =
          userInterests?.job_types?.map((jt: any) => jt.id) ?? [];

        setInteresesSeleccionados(selectedFromBackend);
        setInteresesIniciales(selectedFromBackend);
      } catch (e) {
        if (!alive) return;
        setErrorMessage("No pudimos cargar tus intereses. Intentá nuevamente.");
        setShowError(true);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const handleToggleIntereses = (id: number) => {
    const yaSeleccionado = interesesSeleccionados.includes(id);

    if (yaSeleccionado) {
      setInteresesSeleccionados((prev) => prev.filter((x) => x !== id));
      return;
    }

    if (interesesSeleccionados.length >= 3) {
      setErrorMessage("Solo podés seleccionar hasta 3 intereses.");
      setShowError(true);
      return;
    }

    setInteresesSeleccionados((prev) => [...prev, id]);
  };

  const hasChanges = useMemo(() => {
    if (interesesSeleccionados.length !== interesesIniciales.length) {
      return true;
    }
    const a = [...interesesSeleccionados].sort();
    const b = [...interesesIniciales].sort();
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return true;
    }
    return false;
  }, [interesesSeleccionados, interesesIniciales]);

  const registrarCambios = async () => {
    if (!hasChanges || saving) return;

    const payload = { job_types: interesesSeleccionados };

    setSaving(true);
    try {
      await requestBackend("/api/auth/employee/interests/", payload, "PUT");
      setInteresesIniciales(interesesSeleccionados);
      router.back();
    } catch (e) {
      setErrorMessage("Ocurrió un error al guardar tus intereses.");
      setShowError(true);
    } finally {
      setSaving(false);
    }
  };

  const closeError = () => setShowError(false);

  return {
    intereses,
    interesesSeleccionados,
    handleToggleIntereses,
    loading,
    saving,
    hasChanges,
    registrarCambios,
    showError,
    errorMessage,
    closeError,
  };
};
