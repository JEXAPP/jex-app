import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import useBackendConection from "@/services/internal/useBackendConection";

export type Idioma = {
  idioma: string;
  nivel: string;
  nivelId: number | null;
  notas: string;
};

type LanguageLevel = { id: number; name: string };

const isNonEmpty = (s?: string | null) => !!s && s.trim().length > 0;

export const useEditLanguages = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();
  const [showSuccess, setShowSuccess] = useState(false);
  const [idiomas, setIdiomas] = useState<Idioma[]>([]);
  const [languageLevels, setLanguageLevels] = useState<LanguageLevel[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const [idiomaModalAbierto, setIdiomaModalAbierto] = useState(false);
  const [editIdxIdioma, setEditIdxIdioma] = useState<number | null>(null);
  const [formErrorIdioma, setFormErrorIdioma] = useState<string>("");

  const [idiomaForm, setIdiomaForm] = useState<{
    idioma: string;
    nivel: string;
    nivelId: number | null;
    notas: string;
  }>({
    idioma: "",
    nivel: "",
    nivelId: null,
    notas: "",
  });

  // cargar idiomas + niveles
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const [langsRes, levelsRes] = await Promise.all([
          requestBackend("/api/auth/employee/languages/", null, "GET"),
          requestBackend("/api/auth/language-levels/", null, "GET"),
        ]);

        if (!mounted) return;

        if (Array.isArray(levelsRes)) {
          setLanguageLevels(levelsRes);
        }

        if (Array.isArray(langsRes)) {
          const mapped: Idioma[] = langsRes.map((l: any) => ({
            idioma: l.language ?? "",
            nivel: l.level?.name ?? "",
            nivelId: l.level?.id ?? null,
            notas: l.notes ?? "",
          }));
          setIdiomas(mapped);
        }
      } catch (e) {
        console.log("Error cargando idiomas:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // helpers
  const abrirModalIdioma = () => {
    setEditIdxIdioma(null);
    resetIdiomaForm();
    setIdiomaModalAbierto(true);
  };

  const cerrarModalIdioma = () => {
    setIdiomaModalAbierto(false);
    setFormErrorIdioma("");
  };

  const resetIdiomaForm = () => {
    setIdiomaForm({ idioma: "", nivel: "", nivelId: null, notas: "" });
    setFormErrorIdioma("");
  };

  const setIdiomaFormField = (
    k: "idioma" | "nivel" | "notas" | "nivelId",
    v: any
  ) => {
    setIdiomaForm((p) => ({ ...p, [k]: v }));
  };

  const guardarIdiomaLocal = (): boolean => {
    if (!isNonEmpty(idiomaForm.idioma)) {
      setFormErrorIdioma("El idioma es obligatorio.");
      return false;
    }
    if (!isNonEmpty(idiomaForm.nivel) || idiomaForm.nivelId == null) {
      setFormErrorIdioma("El nivel es obligatorio.");
      return false;
    }

    const nuevoNombre = idiomaForm.idioma.trim().toLowerCase();

    const yaExiste = idiomas.some((l, idx) => {
      if (editIdxIdioma !== null && idx === editIdxIdioma) return false;
      return l.idioma.trim().toLowerCase() === nuevoNombre;
    });

    if (yaExiste) {
      setFormErrorIdioma("Ya cargaste este idioma.");
      return false;
    }

    const item: Idioma = {
      idioma: idiomaForm.idioma.trim(),
      nivel: idiomaForm.nivel.trim(),
      nivelId: idiomaForm.nivelId,
      notas: idiomaForm.notas.trim(),
    };

    if (editIdxIdioma !== null) {
      const next = [...idiomas];
      next[editIdxIdioma] = item;
      setIdiomas(next);
    } else {
      setIdiomas((prev) => [...prev, item]);
    }

    setFormErrorIdioma("");
    cerrarModalIdioma();
    return true;
  };

  const editarIdioma = (idx: number) => {
    const l = idiomas[idx];
    setIdiomaForm({
      idioma: l.idioma,
      nivel: l.nivel,
      nivelId: l.nivelId,
      notas: l.notas,
    });
    setEditIdxIdioma(idx);
    setFormErrorIdioma("");
    setIdiomaModalAbierto(true);
  };

  const eliminarIdioma = (idx: number) => {
    setIdiomas((prev) => prev.filter((_, i) => i !== idx));
  };

  const saveAll = async (): Promise<boolean> => {
    try {
      setSaving(true);

      const langsPayload = idiomas
        .map((l) => ({
          language: l.idioma,
          level: l.nivelId,
          notes: l.notas || "",
        }))
        .filter((l) => isNonEmpty(l.language) && l.level != null);

      if (langsPayload.length === 0) {
        // si no hay idiomas, igual podés decidir mandar [] si el backend lo soporta
        await requestBackend("/api/auth/employee/language/", [], "POST");
      } else {
        await requestBackend(
          "/api/auth/employee/language/",
          langsPayload,
          "PUT"
        );
      }
      setShowSuccess(true)
      return true;
      
    } catch (e) {
      console.log("Error guardando idiomas:", e);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    router.back();
  };

  return {
    idiomas,
    languageLevels,
    loading,
    saving,

    idiomaModalAbierto,
    abrirModalIdioma,
    cerrarModalIdioma,
    idiomaForm,
    setIdiomaFormField,
    formErrorIdioma,
    guardarIdiomaLocal,
    editarIdioma,
    eliminarIdioma,
    saveAll,
    goBack,
    showSuccess,
    closeSuccess,
  };
};
