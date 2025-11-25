import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

import useBackendConection from "@/services/internal/useBackendConection";
import { useUploadImageServ } from "@/services/external/cloudinary/useUploadImage";
import { suggestCargosESCO } from "@/services/external/sugerencias/useSuggestSources";

export type UploadableImage = { uri: string; name: string; type: string };

export type Experiencia = {
  id: number | null;
  cargo: string;
  tipoTrabajo: string;
  empresa: string;
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
type Option = { id: string; name: string };

const DEBOUNCE_MS = 280;

const isNonEmpty = (s?: string | null) => !!s && s.trim().length > 0;
const isDate = (d: Date | null) => d instanceof Date && !isNaN(d.getTime());
const startLEEnd = (a: Date, b: Date) => a.getTime() <= b.getTime();

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

// salida al backend: siempre DD/MM/YYYY
const toDDMMYYYY = (d: Date | null): string | null =>
  d ? `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}` : null;

// parseo flexible de lo que venga del backend: DD/MM/YYYY o YYYY-MM-DD
const parseBackendDate = (s: string | null | undefined): Date | null => {
  if (!s) return null;

  if (s.includes("/")) {
    const [day, month, year] = s.split("/").map((p) => parseInt(p, 10));
    if (!year || !month || !day) return null;
    const d = new Date(year, month - 1, day);
    return isNaN(d.getTime()) ? null : d;
  }

  if (s.includes("-")) {
    const [year, month, day] = s.split("-").map((p) => parseInt(p, 10));
    if (!year || !month || !day) return null;
    const d = new Date(year, month - 1, day);
    return isNaN(d.getTime()) ? null : d;
  }

  return null;
};

export const useEditExperience = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();
  const { uploadImage } = useUploadImageServ();

  const [showSuccess, setShowSuccess] = useState(false);
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [deletedExperiencias, setDeletedExperiencias] = useState<Experiencia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // ---- form experiencia ----
  const [expModalAbierto, setExpModalAbierto] = useState(false);
  const [editIdxExp, setEditIdxExp] = useState<number | null>(null);
  const [formErrorExp, setFormErrorExp] = useState<string>("");

  const [expForm, setExpForm] = useState<{
    cargo: string;
    tipoTrabajo: string;
    empresa: string;
    descripcion: string;
    fotosUris: string[];
    fotosFiles: (UploadableImage | null)[];
    fotosExistingIds: (string | number | null)[];
  }>({
    cargo: "",
    tipoTrabajo: "",
    empresa: "",
    descripcion: "",
    fotosUris: [],
    fotosFiles: [],
    fotosExistingIds: [],
  });

  const [fechaInicioExp, setFechaInicioExp] = useState<Date | null>(null);
  const [fechaFinExp, setFechaFinExp] = useState<Date | null>(null);

  // opciones tipo de trabajo
  const tiposTrabajoOptions: Option[] = [
    "Parcial",
    "Completo",
    "Independiente",
    "Prácticas",
    "Temporal",
    "Contrato",
    "Freelance",
  ].map((t, i) => ({ id: String(i + 1), name: t }));

  const tipoTrabajoToOption = (name: string): Option | null =>
    tiposTrabajoOptions.find((o) => o.name === name) ?? null;

  // zIndex para empresa (por si superpone sugerencias)
  const empresaWrapStyleZ = { position: "relative" as const, zIndex: 1 };

  // ---- cargar experiencias desde backend ----
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await requestBackend(
          "/api/auth/employee/view-work-experience/",
          null,
          "GET"
        );

        if (!mounted || !Array.isArray(res)) {
          setLoading(false);
          return;
        }

        const mapped: Experiencia[] = res.map((item: any) => ({
          id: item.id ?? null,
          cargo: item.title ?? "",
          tipoTrabajo: item.work_type ?? "",
          empresa: item.company_or_event ?? "",
          fechaInicio: parseBackendDate(item.start_date),
          fechaFin: parseBackendDate(item.end_date),
          descripcion: item.description ?? "",
          fotosUris: item.image_url ? [item.image_url] : [],
          fotosFiles: [],
          existingImgIds: item.image_id ? [item.image_id] : [],
          isNew: false,
          dirty: false,
        }));

        setExperiencias(mapped);
      } catch (e) {
        console.log("Error cargando experiencias:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // ---- helpers form experiencia ----
  const abrirModalExp = () => {
    setEditIdxExp(null);
    resetExpForm();
    setExpModalAbierto(true);
  };

  const cerrarModalExp = () => {
    setExpModalAbierto(false);
    setFormErrorExp("");
  };

  const resetExpForm = () => {
    setExpForm({
      cargo: "",
      tipoTrabajo: "",
      empresa: "",
      descripcion: "",
      fotosUris: [],
      fotosFiles: [],
      fotosExistingIds: [],
    });
    setFechaInicioExp(null);
    setFechaFinExp(null);
    setFormErrorExp("");
  };

  const setExpFormField = (k: string, v: any) => {
    if (k === "fotos") {
      setExpForm((p) => ({
        ...p,
        fotosFiles: v.files,
        fotosUris: v.uris,
        fotosExistingIds: v.existingIds ?? [],
      }));
    } else {
      setExpForm((p) => ({ ...p, [k]: v }));
    }
  };

  const validarExp = (): boolean => {
    if (!isNonEmpty(expForm.cargo)) {
      setFormErrorExp("El cargo es obligatorio.");
      return false;
    }
    if (!isNonEmpty(expForm.tipoTrabajo)) {
      setFormErrorExp("El tipo de trabajo es obligatorio.");
      return false;
    }
    if (!isNonEmpty(expForm.empresa)) {
      setFormErrorExp("La empresa/evento es obligatoria.");
      return false;
    }
    if (!isDate(fechaInicioExp)) {
      setFormErrorExp("La fecha de inicio es obligatoria.");
      return false;
    }
    if (!isDate(fechaFinExp)) {
      setFormErrorExp("La fecha de fin es obligatoria.");
      return false;
    }
    if (!startLEEnd(fechaInicioExp!, fechaFinExp!)) {
      setFormErrorExp(
        "La fecha de inicio debe ser anterior o igual a la fecha de fin."
      );
      return false;
    }

    setFormErrorExp("");
    return true;
  };

  const guardarExpLocal = (): boolean => {
    if (!validarExp()) return false;

    if (editIdxExp !== null) {
      const prev = experiencias[editIdxExp];
      if (!prev) return false;

      const updated: Experiencia = {
        ...prev,
        cargo: expForm.cargo.trim(),
        tipoTrabajo: expForm.tipoTrabajo.trim(),
        empresa: expForm.empresa.trim(),
        fechaInicio: fechaInicioExp,
        fechaFin: fechaFinExp,
        descripcion: expForm.descripcion.trim(),
        fotosUris: expForm.fotosUris,
        fotosFiles: expForm.fotosFiles,
        existingImgIds: expForm.fotosExistingIds,
        dirty: true,
      };

      const next = [...experiencias];
      next[editIdxExp] = updated;
      setExperiencias(next);
    } else {
      const nueva: Experiencia = {
        id: null,
        cargo: expForm.cargo.trim(),
        tipoTrabajo: expForm.tipoTrabajo.trim(),
        empresa: expForm.empresa.trim(),
        fechaInicio: fechaInicioExp,
        fechaFin: fechaFinExp,
        descripcion: expForm.descripcion.trim(),
        fotosUris: expForm.fotosUris,
        fotosFiles: expForm.fotosFiles,
        existingImgIds: expForm.fotosExistingIds,
        isNew: true,
        dirty: true,
      };
      setExperiencias((prev) => [...prev, nueva]);
    }

    cerrarModalExp();
    return true;
  };

  const editarExp = (idx: number) => {
    const e = experiencias[idx];
    if (!e) return;

    setExpForm({
      cargo: e.cargo,
      tipoTrabajo: e.tipoTrabajo,
      empresa: e.empresa,
      descripcion: e.descripcion,
      fotosUris: e.fotosUris,
      fotosFiles: e.fotosFiles,
      fotosExistingIds: e.existingImgIds,
    });
    setFechaInicioExp(e.fechaInicio);
    setFechaFinExp(e.fechaFin);
    setEditIdxExp(idx);
    setFormErrorExp("");
    setExpModalAbierto(true);
  };

  const eliminarExp = (idx: number) => {
    setExperiencias((prev) => {
      const toDelete = prev[idx];
      if (toDelete && !toDelete.isNew && toDelete.id != null) {
        setDeletedExperiencias((prevDel) => [...prevDel, toDelete]);
      }
      return prev.filter((_, i) => i !== idx);
    });
  };

  // ---- sugerencias ESCO ----
  const [cargoSug, setCargoSug] = useState<SugItem[]>([]);
  const cargoTimer = useRef<any>(null);

  const clearCargoSug = () => setCargoSug([]);

  const onChangeCargo = (txt: string) => {
    setExpFormField("cargo", txt);

    if (cargoTimer.current) clearTimeout(cargoTimer.current);
    cargoTimer.current = setTimeout(async () => {
      if (!txt?.trim()) return setCargoSug([]);
      try {
        const rows = await suggestCargosESCO(txt, { limit: 8 });
        setCargoSug(
          rows.map((r: any) => ({ descripcion: r.label, placeId: r.id }))
        );
      } catch (e) {
        console.log("Error buscando cargos ESCO:", e);
      }
    }, DEBOUNCE_MS);
  };

  // construir payload de una experiencia (PUT/POST)
  const buildExperiencePayload = async (e: Experiencia) => {
    let image_url: string | null = null;
    let image_id: string | null = null;

    const firstUri = e.fotosUris?.[0] ?? null;
    const firstFile = e.fotosFiles?.[0] ?? null;
    const firstExistingId = e.existingImgIds?.[0] ?? null;

    if (!firstUri) {
      // no hay imagen => borrar en el backend
      image_url = null;
      image_id = null;
    } else if (firstFile) {
      try {
        const res: any = await uploadImage(firstFile.uri, "work-experiences-docs");
        image_url = res?.image_url ?? res?.secure_url ?? res?.url ?? null;
        image_id = res?.image_id ?? res?.public_id ?? null;
      } catch (err) {
        console.log("Error subiendo imagen experiencia:", err);
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
      // mapeo igual que antes
      title: e.cargo,
      work_type: e.tipoTrabajo,
      company_or_event: e.empresa,
      start_date: toDDMMYYYY(e.fechaInicio),
      end_date: toDDMMYYYY(e.fechaFin),
      description: e.descripcion || null,
      image_url,
      image_id,
    };
  };

  // ---- guardar cambios en backend ----
  const saveAll = async (): Promise<boolean> => {
    try {
      setSaving(true);

      // 1) "Eliminar" experiencias existentes marcadas (mandando todo null)
      for (const exp of deletedExperiencias) {
        if (!exp.id) continue;
        const url = `/api/auth/employee/update-work-experience/${exp.id}/`;
        await requestBackend(
          url,
          {
            title: null,
            work_type: null,
            company_or_event: null,
            start_date: null,
            end_date: null,
            description: null,
            image_url: null,
            image_id: null,
          },
          "PUT"
        );
      }

      // 2) Crear nuevas y actualizar modificadas
      for (const e of experiencias) {
        const body = await buildExperiencePayload(e);

        if (e.isNew) {
          await requestBackend(
            "/api/auth/employee/work-experience/",
            body,
            "POST"
          );
        } else if (e.dirty && e.id != null) {
          const url = `/api/auth/employee/update-work-experience/${e.id}/`;
          await requestBackend(url, body, "PUT");
        }
      }

      setDeletedExperiencias([]);
      setShowSuccess(true);
      return true;
    } catch (e) {
      console.log("Error guardando experiencias:", e);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    router.back();
  };

  const goBack = () => {
    router.back();
  };

  return {
    experiencias,
    loading,
    saving,

    // modal / form
    expModalAbierto,
    abrirModalExp,
    cerrarModalExp,
    expForm,
    setExpFormField,
    fechaInicioExp,
    setFechaInicioExp,
    fechaFinExp,
    setFechaFinExp,
    formErrorExp,
    guardarExpLocal,

    // list actions
    editarExp,
    eliminarExp,

    // sugerencias
    cargoSug,
    onChangeCargo,
    clearCargoSug,

    // options
    tiposTrabajoOptions,
    tipoTrabajoToOption,

    // layout
    empresaWrapStyleZ,

    // guardar global
    saveAll,
    goBack,
    showSuccess,
    closeSuccess,
    editIdxExp,
  };
};
