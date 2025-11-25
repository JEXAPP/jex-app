import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

import useBackendConection from "@/services/internal/useBackendConection";
import { useUploadImageServ } from "@/services/external/cloudinary/useUploadImage";
import {
  suggestDisciplinasOpenAlex,
  suggestUniversidadesHipolabs,
} from "@/services/external/sugerencias/useSuggestSources";

export type UploadableImage = { uri: string; name: string; type: string };

export type Educacion = {
  id: number | null;
  institucion: string;
  titulo: string;
  disciplina: string;
  fechaInicio: Date | null;
  fechaFin: Date | null;
  descripcion: string;
  fotosUris: string[];
  fotosFiles: (UploadableImage | null)[];
  existingImgIds: (string | number | null)[];
  isNew: boolean;
  dirty: boolean;
};

type SugItem = { descripcion: string; placeId: string };

const DEBOUNCE_MS = 280;

const isNonEmpty = (s?: string | null) => !!s && s.trim().length > 0;
const isDate = (d: Date | null) => d instanceof Date && !isNaN(d.getTime());
const startLEEnd = (a: Date, b: Date) => a.getTime() <= b.getTime();

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

// Formato que espera el backend en input: DD/MM/YYYY
const toDDMMYYYY = (d: Date | null): string | null =>
  d
    ? `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`
    : null;

// Parseo flexible para lo que devuelve el backend: DD/MM/YYYY o YYYY-MM-DD
const parseBackendDate = (s: string | null | undefined): Date | null => {
  if (!s) return null;

  // DD/MM/YYYY
  if (s.includes("/")) {
    const [day, month, year] = s.split("/").map((p) => parseInt(p, 10));
    if (!year || !month || !day) return null;
    const d = new Date(year, month - 1, day);
    return isNaN(d.getTime()) ? null : d;
  }

  // YYYY-MM-DD
  if (s.includes("-")) {
    const [year, month, day] = s.split("-").map((p) => parseInt(p, 10));
    if (!year || !month || !day) return null;
    const d = new Date(year, month - 1, day);
    return isNaN(d.getTime()) ? null : d;
  }

  return null;
};

export const useEditEducation = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();
  const { uploadImage } = useUploadImageServ();

  const [showSuccess, setShowSuccess] = useState(false);
  const [estudios, setEstudios] = useState<Educacion[]>([]);
  const [deletedEstudios, setDeletedEstudios] = useState<Educacion[]>([]);
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
    fotosExistingIds: (string | number | null)[];
  }>({
    institucion: "",
    titulo: "",
    disciplina: "",
    descripcion: "",
    fotosUris: [],
    fotosFiles: [],
    fotosExistingIds: [],
  });

  const [fechaInicioEdu, setFechaInicioEdu] = useState<Date | null>(null);
  const [fechaFinEdu, setFechaFinEdu] = useState<Date | null>(null);

  // cargar estudios desde backend
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
          id: item.id ?? null,
          institucion: item.institution ?? "",
          titulo: item.title ?? "",
          disciplina: item.discipline ?? "",
          fechaInicio: parseBackendDate(item.start_date),
          fechaFin: parseBackendDate(item.end_date),
          descripcion: item.description ?? "",
          fotosUris: item.image_url ? [item.image_url] : [],
          fotosFiles: [],
          existingImgIds: item.image_id ? [item.image_id] : [],
          isNew: false,
          dirty: false,
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
      fotosExistingIds: [],
    });
    setFechaInicioEdu(null);
    setFechaFinEdu(null);
    setFormErrorEdu("");
  };

  const setEduFormField = (k: string, v: any) => {
    if (k === "fotos") {
      setEduForm((p) => ({
        ...p,
        fotosFiles: v.files,
        fotosUris: v.uris,
        fotosExistingIds: v.existingIds ?? [],
      }));
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

    if (editIdxEdu !== null) {
      const prev = estudios[editIdxEdu];
      if (!prev) return false;

      const updated: Educacion = {
        ...prev,
        institucion: eduForm.institucion.trim(),
        titulo: eduForm.titulo.trim(),
        disciplina: eduForm.disciplina.trim(),
        fechaInicio: fechaInicioEdu,
        fechaFin: fechaFinEdu,
        descripcion: eduForm.descripcion.trim(),
        fotosUris: eduForm.fotosUris,
        fotosFiles: eduForm.fotosFiles,
        existingImgIds: eduForm.fotosExistingIds,
        dirty: true,
      };

      const next = [...estudios];
      next[editIdxEdu] = updated;
      setEstudios(next);
    } else {
      const nuevo: Educacion = {
        id: null,
        institucion: eduForm.institucion.trim(),
        titulo: eduForm.titulo.trim(),
        disciplina: eduForm.disciplina.trim(),
        fechaInicio: fechaInicioEdu,
        fechaFin: fechaFinEdu,
        descripcion: eduForm.descripcion.trim(),
        fotosUris: eduForm.fotosUris,
        fotosFiles: eduForm.fotosFiles,
        existingImgIds: eduForm.fotosExistingIds,
        isNew: true,
        dirty: true,
      };
      setEstudios((prev) => [...prev, nuevo]);
    }

    cerrarModalEdu();
    return true;
  };

  const editarEdu = (idx: number) => {
    const e = estudios[idx];
    if (!e) return;

    setEduForm({
      institucion: e.institucion,
      titulo: e.titulo,
      disciplina: e.disciplina,
      descripcion: e.descripcion,
      fotosUris: e.fotosUris,
      fotosFiles: e.fotosFiles,
      fotosExistingIds: e.existingImgIds,
    });
    setFechaInicioEdu(e.fechaInicio);
    setFechaFinEdu(e.fechaFin);
    setEditIdxEdu(idx);
    setFormErrorEdu("");
    setEduModalAbierto(true);
  };

  const eliminarEdu = (idx: number) => {
    setEstudios((prev) => {
      const toDelete = prev[idx];
      if (toDelete && !toDelete.isNew && toDelete.id != null) {
        setDeletedEstudios((prevDel) => [...prevDel, toDelete]);
      }
      return prev.filter((_, i) => i !== idx);
    });
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

  // construir payload de una educación (PUT/POST)
  const buildEducationPayload = async (s: Educacion) => {
    let image_url: string | null = null;
    let image_id: string | null = null;

    const firstUri = s.fotosUris?.[0] ?? null;
    const firstFile = s.fotosFiles?.[0] ?? null;
    const firstExistingId = s.existingImgIds?.[0] ?? null;

    if (!firstUri) {
      image_url = null;
      image_id = null;
    } else if (firstFile) {
      try {
        const res: any = await uploadImage(firstFile.uri, "certificates-docs");
        image_url = res?.image_url ?? res?.secure_url ?? res?.url ?? null;
        image_id = res?.image_id ?? res?.public_id ?? null;
      } catch (e) {
        console.log("Error subiendo imagen educación:", e);
        image_url = null;
        image_id = null;
      }
    } else {
      image_url = firstUri;
      image_id =
        typeof firstExistingId === "string" || typeof firstExistingId === "number"
          ? String(firstExistingId)
          : null;
    }

    return {
      institution: s.institucion || null,
      title: s.titulo || null,
      discipline: s.disciplina || null,
      start_date: toDDMMYYYY(s.fechaInicio),
      end_date: toDDMMYYYY(s.fechaFin),
      description: s.descripcion || null,
      image_url,
      image_id,
    };
  };

  // guardar en backend
  const saveAll = async (): Promise<boolean> => {
    try {
      setSaving(true);

      // eliminar registros existentes marcados (mandando todo null)
      for (const edu of deletedEstudios) {
        if (!edu.id) continue;
        const url = `/api/auth/employee/update-education/${edu.id}/`;
        await requestBackend(
          url,
          {
            institution: null,
            title: null,
            discipline: null,
            start_date: null,
            end_date: null,
            description: null,
            image_url: null,
            image_id: null,
          },
          "PUT"
        );
      }

      // crear nuevos y actualizar modificados
      for (const s of estudios) {
        const body = await buildEducationPayload(s);

        if (s.isNew) {
          await requestBackend(
            "/api/auth/employee/education/",
            body,
            "POST"
          );
        } else if (s.dirty && s.id != null) {
          const url = `/api/auth/employee/update-education/${s.id}/`;
          await requestBackend(url, body, "PUT");
        }
      }

      setDeletedEstudios([]);
      setShowSuccess(true);
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

    editarEdu,
    eliminarEdu,

    instSug,
    onChangeInst,
    clearInstSug,
    discSug,
    onChangeDisc,
    clearDiscSug,

    saveAll,
    goBack,
    showSuccess,
    closeSuccess,
    editIdxEdu,
  };
};
