import { suggestCargosESCO, suggestDisciplinasOpenAlex, suggestUniversidadesHipolabs } from '@/services/external/sugerencias/useSuggestSources';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { useUploadImageServ } from '@/services/external/cloudinary/useUploadImage';
import useBackendConection from '@/services/internal/useBackendConection';

type UploadableImage = { uri: string; name: string; type: string };

export type Experiencia = {
  cargo: string;
  tipoTrabajo: string;
  empresa: string;
  fechaInicio: Date | null;
  fechaFin: Date | null;
  descripcion: string;
  fotosUris: string[];
  fotosFiles: (UploadableImage | null)[];
};

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

// helpers
const isNonEmpty = (s?: string | null) => !!s && s.trim().length > 0;
const isDate = (d: Date | null) => d instanceof Date && !isNaN(d.getTime());
const startLEEnd = (a: Date, b: Date) => a.getTime() <= b.getTime();

// ⬇️ NUEVO: formateo dd/mm/yyyy
const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const toDDMMYYYY = (d: Date | null): string | null =>
  d ? `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}` : null;

export const useOnboardingExperience = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();
  const { uploadImage } = useUploadImageServ();
  // listas
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [estudios, setEstudios] = useState<Educacion[]>([]);

  // ---- NAV ----
  const goStep = (n: number) => {
    if (n === 1) router.replace('/auth/additional-info/step-one');
    if (n === 2) router.replace('/auth/additional-info/step-two');
    if (n === 3) router.replace('/auth/additional-info/step-three');
    if (n === 4) router.replace('/auth/additional-info/step-four');
  };
  const omitir = () => router.replace('/employee');

  const siguiente = async () => {
    try {
      const payload = {
        experiences: await Promise.all(
          experiencias.map(async (e) => {
            let image_url: string | null = null;
            let image_id: string | null = null;

            const firstUri = e.fotosUris?.[0] ?? null;
            if (firstUri) {
              const res: any = await uploadImage(firstUri, 'work-experiences-docs');
              image_url = res?.image_url ?? res?.secure_url ?? res?.url ?? null;
              image_id = res?.image_id ?? res?.public_id ?? null;
            }

            return {
              title: e.cargo,
              work_type: e.tipoTrabajo,
              company_or_event: e.empresa,
              start_date: toDDMMYYYY(e.fechaInicio),
              end_date: toDDMMYYYY(e.fechaFin),
              description: e.descripcion || null,
              image_url,
              image_id,
            };
          })
        ),

        studies: await Promise.all(
          estudios.map(async (s) => {
            let image_url: string | null = null;
            let image_id: string | null = null;

            const firstUri = s.fotosUris?.[0] ?? null;
            if (firstUri) {
              const res: any = await uploadImage(firstUri, 'certificates-docs');
              image_url = res?.image_url ?? res?.secure_url ?? res?.url ?? null;
              image_id = res?.image_id ?? res?.public_id ?? null;
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
        ),
      };

      await requestBackend('/api/auth/employee/work-experience/', payload.experiences, 'POST');
      await requestBackend('/api/auth/employee/education/', payload.studies, 'POST');
      router.replace('/auth/additional-info/step-three');
    } catch (e) {
      console.log(e);
    }
  };

  // ---- MODAL EXPERIENCIA ----
  const [expModalAbierto, setExpModalAbierto] = useState(false);
  const [editIdxExp, setEditIdxExp] = useState<number | null>(null);
  const [formErrorExp, setFormErrorExp] = useState<string>('');

  const [expForm, setExpForm] = useState<{
    cargo: string;
    tipoTrabajo: string;
    empresa: string;
    descripcion: string;
    fotosUris: string[];
    fotosFiles: (UploadableImage | null)[];
  }>({
    cargo: '',
    tipoTrabajo: '',
    empresa: '',
    descripcion: '',
    fotosUris: [],
    fotosFiles: [],
  });

  const [fechaInicioExp, setFechaInicioExp] = useState<Date | null>(null);
  const [fechaFinExp, setFechaFinExp] = useState<Date | null>(null);

  // types en el hook
  type Option = { id: string; name: string };

  const tiposTrabajoOptions: Option[] = [
    'Parcial', 'Completo', 'Independiente', 'Prácticas', 'Temporal', 'Contrato', 'Freelance',
  ].map((t, i) => ({ id: String(i + 1), name: t }));

  const tipoTrabajoToOption = (name: string): Option | null =>
    tiposTrabajoOptions.find(o => o.name === name) ?? null;

  const abrirModalExp = () => { setEditIdxExp(null); resetExpForm(); setExpModalAbierto(true); };
  const cerrarModalExp = () => { setExpModalAbierto(false); setFormErrorExp(''); };

  const resetExpForm = () => {
    setExpForm({ cargo: '', tipoTrabajo: '', empresa: '', descripcion: '', fotosUris: [], fotosFiles: [] });
    setFechaInicioExp(null);
    setFechaFinExp(null);
    setFormErrorExp('');
  };

  const setExpFormField = (k: string, v: any) => {
    if (k === 'fotos') {
      setExpForm((p) => ({ ...p, fotosFiles: v.files, fotosUris: v.uris }));
    } else {
      setExpForm((p) => ({ ...p, [k]: v }));
    }
  };

  const validarExp = (): boolean => {
    if (!isNonEmpty(expForm.cargo)) { setFormErrorExp('El cargo es obligatorio.'); return false; }
    if (!isNonEmpty(expForm.tipoTrabajo)) { setFormErrorExp('El tipo de trabajo es obligatorio.'); return false; }
    if (!isNonEmpty(expForm.empresa)) { setFormErrorExp('La empresa/evento es obligatoria.'); return false; }
    if (!isDate(fechaInicioExp)) { setFormErrorExp('La fecha de inicio es obligatoria.'); return false; }
    if (!isDate(fechaFinExp)) { setFormErrorExp('La fecha de fin es obligatoria.'); return false; }
    if (!startLEEnd(fechaInicioExp!, fechaFinExp!)) { setFormErrorExp('La fecha de inicio debe ser anterior o igual a la fecha de fin.'); return false; }
    if (!isNonEmpty(expForm.descripcion)) { setFormErrorExp('La descripción es obligatoria.'); return false; }
    setFormErrorExp('');
    return true;
  };

  const guardarExp = (): boolean => {
    if (!validarExp()) return false;

    const item: Experiencia = {
      cargo: expForm.cargo.trim(),
      tipoTrabajo: expForm.tipoTrabajo.trim(),
      empresa: expForm.empresa.trim(),
      fechaInicio: fechaInicioExp,
      fechaFin: fechaFinExp,
      descripcion: expForm.descripcion.trim(),
      fotosUris: expForm.fotosUris,
      fotosFiles: expForm.fotosFiles,
    };

    if (editIdxExp !== null) {
      const next = [...experiencias];
      next[editIdxExp] = item;
      setExperiencias(next);
    } else {
      setExperiencias((p) => [...p, item]);
    }
    cerrarModalExp();
    return true;
  };

  const editarExp = (idx: number) => {
    const e = experiencias[idx];
    setExpForm({
      cargo: e.cargo,
      tipoTrabajo: e.tipoTrabajo,
      empresa: e.empresa,
      descripcion: e.descripcion,
      fotosUris: e.fotosUris,
      fotosFiles: e.fotosFiles,
    });
    setFechaInicioExp(e.fechaInicio);
    setFechaFinExp(e.fechaFin);
    setEditIdxExp(idx);
    setFormErrorExp('');
    setExpModalAbierto(true);
  };

  const eliminarExp = (idx: number) => {
    setExperiencias((p) => p.filter((_, i) => i !== idx));
  };

  // ---- SUGERENCIAS EXP (ESCO cargos) ----
  const [cargoSug, setCargoSug] = useState<SugItem[]>([]);
  const cargoTimer = useRef<any>(null);

  const clearCargoSug = () => setCargoSug([]);

  const onChangeCargo = (txt: string) => {
    setExpFormField('cargo', txt);
    if (cargoTimer.current) clearTimeout(cargoTimer.current);
    cargoTimer.current = setTimeout(async () => {
      if (!txt?.trim()) return setCargoSug([]);
      const rows = await suggestCargosESCO(txt, { limit: 8 });
      setCargoSug(rows.map(r => ({ descripcion: r.label, placeId: r.id })));
    }, DEBOUNCE_MS);
  };

  // ---- MODAL EDUCACIÓN ----
  const [eduModalAbierto, setEduModalAbierto] = useState(false);
  const [editIdxEdu, setEditIdxEdu] = useState<number | null>(null);
  const [formErrorEdu, setFormErrorEdu] = useState<string>('');

  const [eduForm, setEduForm] = useState<{
    institucion: string;
    titulo: string;
    disciplina: string;
    descripcion: string;
    fotosUris: string[];
    fotosFiles: (UploadableImage | null)[];
  }>({
    institucion: '',
    titulo: '',
    disciplina: '',
    descripcion: '',
    fotosUris: [],
    fotosFiles: [],
  });

  const [fechaInicioEdu, setFechaInicioEdu] = useState<Date | null>(null);
  const [fechaFinEdu, setFechaFinEdu] = useState<Date | null>(null);

  const abrirModalEdu = () => { setEditIdxEdu(null); resetEduForm(); setEduModalAbierto(true); };
  const cerrarModalEdu = () => { setEduModalAbierto(false); setFormErrorEdu(''); };

  const resetEduForm = () => {
    setEduForm({ institucion: '', titulo: '', disciplina: '', descripcion: '', fotosUris: [], fotosFiles: [] });
    setFechaInicioEdu(null);
    setFechaFinEdu(null);
    setFormErrorEdu('');
  };

  const setEduFormField = (k: string, v: any) => {
    if (k === 'fotos') {
      setEduForm((p) => ({ ...p, fotosFiles: v.files, fotosUris: v.uris }));
    } else {
      setEduForm((p) => ({ ...p, [k]: v }));
    }
  };

  const validarEdu = (): boolean => {
    if (!isNonEmpty(eduForm.institucion)) { setFormErrorEdu('La institución es obligatoria.'); return false; }
    if (!isNonEmpty(eduForm.titulo)) { setFormErrorEdu('El título/certificación es obligatorio.'); return false; }
    if (!isNonEmpty(eduForm.disciplina)) { setFormErrorEdu('La disciplina es obligatoria.'); return false; }
    if (!isDate(fechaInicioEdu)) { setFormErrorEdu('La fecha de inicio es obligatoria.'); return false; }
    if (!isDate(fechaFinEdu)) { setFormErrorEdu('La fecha de fin (o prevista) es obligatoria.'); return false; }
    if (!startLEEnd(fechaInicioEdu!, fechaFinEdu!)) { setFormErrorEdu('La fecha de inicio debe ser anterior o igual a la fecha de fin.'); return false; }
    if (!isNonEmpty(eduForm.descripcion)) { setFormErrorEdu('La descripción es obligatoria.'); return false; }
    setFormErrorEdu('');
    return true;
  };

  const guardarEdu = (): boolean => {
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
      setEstudios((p) => [...p, item]);
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
    setFormErrorEdu('');
    setEduModalAbierto(true);
  };

  const eliminarEdu = (idx: number) => {
    setEstudios((p) => p.filter((_, i) => i !== idx));
  };

  // ---- SUGERENCIAS EDU ----
  const [instSug, setInstSug] = useState<SugItem[]>([]);
  const [discSug, setDiscSug] = useState<SugItem[]>([]);
  const instTimer = useRef<any>(null);
  const discTimer = useRef<any>(null);

  const clearInstSug = () => setInstSug([]);
  const clearDiscSug = () => setDiscSug([]);

  const onChangeInst = (txt: string) => {
    setEduFormField('institucion', txt);
    if (instTimer.current) clearTimeout(instTimer.current);
    instTimer.current = setTimeout(async () => {
      if (!txt?.trim()) return setInstSug([]);
      const rows = await suggestUniversidadesHipolabs(txt, { country: 'Argentina', limit: 8 });
      setInstSug(rows.map(r => ({ descripcion: r.label, placeId: r.id })));
    }, DEBOUNCE_MS);
  };

  const onChangeDisc = (txt: string) => {
    setEduFormField('disciplina', txt);
    if (discTimer.current) clearTimeout(discTimer.current);
    discTimer.current = setTimeout(async () => {
      if (!txt?.trim()) return setDiscSug([]);
      const rows = await suggestDisciplinasOpenAlex(txt, { limit: 8 });
      setDiscSug(rows.map(r => ({ descripcion: r.label, placeId: r.id })));
    }, DEBOUNCE_MS);
  };

  // Wrapper: asegurar zIndex bajo en inputs normales (para que Suggestions flote arriba)
  const empresaWrapStyleZ = { position: 'relative', zIndex: 1 };

  return {
    // nav
    goStep,
    omitir,
    siguiente,

    // lists
    experiencias, estudios,
    editarExp, eliminarExp,
    editarEdu, eliminarEdu,

    // modals
    abrirModalExp, cerrarModalExp, expModalAbierto,
    abrirModalEdu, cerrarModalEdu, eduModalAbierto,

    // forms exp
    expForm, setExpFormField, guardarExp,
    cargoSug, onChangeCargo, empresaWrapStyleZ,
    fechaInicioExp, setFechaInicioExp, fechaFinExp, setFechaFinExp,
    formErrorExp,
    tiposTrabajoOptions, // <- para el Picker

    // forms edu
    eduForm, setEduFormField, guardarEdu,
    instSug, onChangeInst,
    discSug, onChangeDisc,
    fechaInicioEdu, setFechaInicioEdu, fechaFinEdu, setFechaFinEdu,
    tipoTrabajoToOption,
    formErrorEdu,

    // helpers sugerencias
    clearCargoSug, clearInstSug, clearDiscSug,
  };
};
