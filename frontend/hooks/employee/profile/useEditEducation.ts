import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

import useBackendConection from "@/services/internal/useBackendConection";
import { useUploadImageServ } from "@/services/external/cloudinary/useUploadImage";
import {
  suggestDisciplinasOpenAlex,
  suggestUniversidadesHipolabs,
} from "@/services/external/sugerencias/useSuggestSources";

type UploadableImage = { uri: string; name: string; type: string };

export type Educacion = {
  institucion: string;
  titulo: string;
  disciplina: string;
  fechaInicio: Date | null;
  fechaFin: Date | null;
  descripcion: string;
  fotosUris: string[];
  fotosFiles: (UploadableImage | null)[];
};

type SugItem = { descripcion: string; placeId: string };

const DEBOUNCE_MS = 280;

const isNonEmpty = (s?: string | null) => !!s && s.trim().length > 0;
const isDate = (d: Date | null) => d instanceof Date && !isNaN(d.getTime());
const startLEEnd = (a: Date, b: Date) => a.getTime() <= b.getTime();

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const toDDMMYYYY = (d: Date | null): string | null =>
  d ? `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}` : null;

const fromYYYYMMDD = (s: string | null | undefined): Date | null => {
  if (!s) return null;
  const [year, month, day] = s.split("-").map((p) => parseInt(p, 10));
  if (!year || !month || !day) return null;
  const d = new Date(year, month - 1, day);
  return isNaN(d.getTime()) ? null : d;
};

export const useEditEducation = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();
  const { uploadImage } = useUploadImageServ();
  const [showSuccess, setShowSuccess] = useState(false);
  const [estudios, setEstudios] = useState<Educacion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const [eduModalAbierto, setEduModalAbierto] = useState(false);
  const [editIdxEdu, setEditIdxEdu] = useState<number | null>(null);
  const [formErrorEdu, setFormErrorEdu] = useState<string>("");

  const [eduForm, setEduForm] = useState<{
    institucion: string;
    titulo: string;
    disciplina: string;
    descripcion: string;
    fotosUris: string[];
    fotosFiles: (UploadableImage | null)[];
  }>({
    institucion: "",
    titulo: "",
    disciplina: "",
    descripcion: "",
    fotosUris: [],
    fotosFiles: [],
  });

  const [fechaInicioEdu, setFechaInicioEdu] = useState<Date | null>(null);
  const [fechaFinEdu, setFechaFinEdu] = useState<Date | null>(null);

  // cargar estudios
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await requestBackend(
          "/api/auth/employee/view-education/",
          null,
          "GET"
        );
        if (!mounted || !Array.isArray(res)) {
          setLoading(false);
          return;
        }

        const mapped: Educacion[] = res.map((item: any) => ({
          institucion: item.institution ?? "",
          titulo: item.title ?? "",
          disciplina: item.discipline ?? "",
          fechaInicio: fromYYYYMMDD(item.start_date),
          fechaFin: fromYYYYMMDD(item.end_date),
          descripcion: item.description ?? "",
          fotosUris: item.image_url ? [item.image_url] : [],
          fotosFiles: [],
        }));

        setEstudios(mapped);
      } catch (e) {
        console.log("Error cargando educación:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // helpers form
  const abrirModalEdu = () => {
    setEditIdxEdu(null);
    resetEduForm();
    setEduModalAbierto(true);
  };

  const cerrarModalEdu = () => {
    setEduModalAbierto(false);
    setFormErrorEdu("");
  };

  const resetEduForm = () => {
    setEduForm({
      institucion: "",
      titulo: "",
      disciplina: "",
      descripcion: "",
      fotosUris: [],
      fotosFiles: [],
    });
    setFechaInicioEdu(null);
    setFechaFinEdu(null);
    setFormErrorEdu("");
  };

  const setEduFormField = (k: string, v: any) => {
    if (k === "fotos") {
      setEduForm((p) => ({ ...p, fotosFiles: v.files, fotosUris: v.uris }));
    } else {
      setEduForm((p) => ({ ...p, [k]: v }));
    }
  };

  const validarEdu = (): boolean => {
    if (!isNonEmpty(eduForm.institucion)) {
      setFormErrorEdu("La institución es obligatoria.");
      return false;
    }
    if (!isNonEmpty(eduForm.titulo)) {
      setFormErrorEdu("El título/certificación es obligatorio.");
      return false;
    }
    if (!isNonEmpty(eduForm.disciplina)) {
      setFormErrorEdu("La disciplina es obligatoria.");
      return false;
    }
    if (!isDate(fechaInicioEdu)) {
      setFormErrorEdu("La fecha de inicio es obligatoria.");
      return false;
    }
    if (!isDate(fechaFinEdu)) {
      setFormErrorEdu("La fecha de fin (o prevista) es obligatoria.");
      return false;
    }
    if (!startLEEnd(fechaInicioEdu!, fechaFinEdu!)) {
      setFormErrorEdu(
        "La fecha de inicio debe ser anterior o igual a la fecha de fin."
      );
      return false;
    }
    setFormErrorEdu("");
    return true;
  };

  const guardarEduLocal = (): boolean => {
    if (!validarEdu()) return false;

    const item: Educacion = {
      institucion: eduForm.institucion.trim(),
      titulo: eduForm.titulo.trim(),
      disciplina: eduForm.disciplina.trim(),
      fechaInicio: fechaInicioEdu,
      fechaFin: fechaFinEdu,
      descripcion: eduForm.descripcion.trim(),
      fotosUris: eduForm.fotosUris,
      fotosFiles: eduForm.fotosFiles,
    };

    if (editIdxEdu !== null) {
      const next = [...estudios];
      next[editIdxEdu] = item;
      setEstudios(next);
    } else {
      setEstudios((prev) => [...prev, item]);
    }

    cerrarModalEdu();
    return true;
  };

  const editarEdu = (idx: number) => {
    const e = estudios[idx];
    setEduForm({
      institucion: e.institucion,
      titulo: e.titulo,
      disciplina: e.disciplina,
      descripcion: e.descripcion,
      fotosUris: e.fotosUris,
      fotosFiles: e.fotosFiles,
    });
    setFechaInicioEdu(e.fechaInicio);
    setFechaFinEdu(e.fechaFin);
    setEditIdxEdu(idx);
    setFormErrorEdu("");
    setEduModalAbierto(true);
  };

  const eliminarEdu = (idx: number) => {
    setEstudios((prev) => prev.filter((_, i) => i !== idx));
  };

  // sugerencias
  const [instSug, setInstSug] = useState<SugItem[]>([]);
  const [discSug, setDiscSug] = useState<SugItem[]>([]);
  const instTimer = useRef<any>(null);
  const discTimer = useRef<any>(null);

  const clearInstSug = () => setInstSug([]);
  const clearDiscSug = () => setDiscSug([]);

  const onChangeInst = (txt: string) => {
    setEduFormField("institucion", txt);
    if (instTimer.current) clearTimeout(instTimer.current);
    instTimer.current = setTimeout(async () => {
      if (!txt?.trim()) return setInstSug([]);
      try {
        const rows = await suggestUniversidadesHipolabs(txt, {
          country: "Argentina",
          limit: 8,
        });
        setInstSug(
          rows.map((r: any) => ({ descripcion: r.label, placeId: r.id }))
        );
      } catch (e) {
        console.log("Error sug universidades:", e);
      }
    }, DEBOUNCE_MS);
  };

  const onChangeDisc = (txt: string) => {
    setEduFormField("disciplina", txt);
    if (discTimer.current) clearTimeout(discTimer.current);
    discTimer.current = setTimeout(async () => {
      if (!txt?.trim()) return setDiscSug([]);
      try {
        const rows = await suggestDisciplinasOpenAlex(txt, { limit: 8 });
        setDiscSug(
          rows.map((r: any) => ({ descripcion: r.label, placeId: r.id }))
        );
      } catch (e) {
        console.log("Error sug disciplinas:", e);
      }
    }, DEBOUNCE_MS);
  };

  // guardar en backend
  const saveAll = async (): Promise<boolean> => {
    try {
      setSaving(true);

      const payload = await Promise.all(
        estudios.map(async (s) => {
          let image_url: string | null = null;
          let image_id: string | null = null;

          const firstUri = s.fotosUris?.[0] ?? null;
          if (firstUri) {
            if (firstUri.startsWith("http")) {
              image_url = firstUri;
            } else {
              const res: any = await uploadImage(
                firstUri,
                "certificates-docs"
              );
              image_url =
                res?.image_url ?? res?.secure_url ?? res?.url ?? null;
              image_id = res?.image_id ?? res?.public_id ?? null;
            }
          }

          return {
            institution: s.institucion,
            title: s.titulo,
            discipline: s.disciplina,
            start_date: toDDMMYYYY(s.fechaInicio),
            end_date: toDDMMYYYY(s.fechaFin),
            description: s.descripcion || null,
            image_url,
            image_id,
          };
        })
      );

      await requestBackend("/api/auth/employee/update-education/", payload, "PUT");
      
      setShowSuccess(true)
      return true;
      
    } catch (e) {
      console.log("Error guardando educación:", e);
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
    estudios,
    loading,
    saving,

    // modal/form
    eduModalAbierto,
    abrirModalEdu,
    cerrarModalEdu,
    eduForm,
    setEduFormField,
    fechaInicioEdu,
    setFechaInicioEdu,
    fechaFinEdu,
    setFechaFinEdu,
    formErrorEdu,
    guardarEduLocal,

    // list actions
    editarEdu,
    eliminarEdu,

    // sugerencias
    instSug,
    onChangeInst,
    clearInstSug,
    discSug,
    onChangeDisc,
    clearDiscSug,

    // guardar global
    saveAll,
    goBack,
    showSuccess,
    closeSuccess,
  };
};
