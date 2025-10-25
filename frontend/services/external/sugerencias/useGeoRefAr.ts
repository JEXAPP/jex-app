import axios from 'axios';

const GEOREF = 'https://apis.datos.gob.ar/georef/api';

export type Sugerencia = { descripcion: string; placeId: string };
export type DireccionNormalizada = {
  calle: string;
  altura?: number | null;
  localidad: string;
  provincia: string;
  canonical: string; // "Calle Altura, Localidad, Provincia, Argentina"
  lat?: number | null;
  lon?: number | null;
};

// Util: debouncer opcional para tus onChangeText
export const debounce = <F extends (...a: any[]) => void>(fn: F, ms = 250) => {
  let t: any; return (...args: Parameters<F>) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
};

// ---------- Catálogos ----------
export async function listarProvincias(): Promise<{ id: string; nombre: string }[]> {
  const { data } = await axios.get(`${GEOREF}/provincias`, { params: { campos: 'id,nombre', max: 100 } });
  return data?.provincias ?? [];
}

export async function buscarLocalidades(provinciaId: string, q: string): Promise<Sugerencia[]> {
  if (!provinciaId || q.trim().length < 2) return [];
  const { data } = await axios.get(`${GEOREF}/localidades`, {
    params: { provincia: provinciaId, nombre: q, max: 10, campos: 'id,nombre,provincia' },
  });
  const locs = data?.localidades ?? [];
  return locs.map((l: any) => ({
    descripcion: `${l.nombre}, ${l.provincia?.nombre ?? ''}`,
    placeId: `loc:${l.id}|prov:${l.provincia?.id ?? ''}|locName:${l.nombre}|provName:${l.provincia?.nombre ?? ''}`,
  }));
}

export async function buscarCalles(opts: {
  provinciaId: string;
  localidadId?: string;           // si la tenés, mejora precisión
  localidadNombre?: string;       // útil para mostrar
  q: string;
}): Promise<Sugerencia[]> {
  const { provinciaId, localidadId, localidadNombre, q } = opts;
  if (!provinciaId || q.trim().length < 2) return [];
  const params: any = { nombre: q, provincia: provinciaId, max: 10 };
  // La API acepta filtros por departamento/localidad_censal; usamos localidad_censal cuando la tengas
  if (localidadId) params.localidad_censal = localidadId;

  const { data } = await axios.get(`${GEOREF}/calles`, { params });
  const calles = data?.calles ?? [];
  return calles.map((c: any) => {
    const prov = c.provincia?.nombre ?? '';
    const loc  = c.localidad_censal?.nombre ?? localidadNombre ?? '';
    const desc = `${c.nombre}, ${loc}, ${prov}, Argentina`;
    return {
      descripcion: desc,
      // codificamos lo necesario para normalizar después:
      placeId: `calleId:${c.id}|calleName:${c.nombre}|locId:${c.localidad_censal?.id ?? ''}|locName:${loc}|provId:${c.provincia?.id ?? ''}|provName:${prov}`,
    };
  });
}

// ---------- Normalización + geocodificación (forward) ----------
export async function normalizarDireccion(params: {
  calleNombre: string;
  altura?: string | number;
  provinciaNombre?: string;
  localidadNombre?: string; // o localidad_censal
}): Promise<DireccionNormalizada | null> {
  const { calleNombre, altura, provinciaNombre, localidadNombre } = params;
  // armamos "direccion" como espera la API
  const direccion = altura ? `${calleNombre} ${altura}` : `${calleNombre}`;

  const { data } = await axios.get(`${GEOREF}/direcciones`, {
    params: {
      direccion,
      provincia: provinciaNombre,
      localidad_censal: localidadNombre,
      max: 1,
      aplanar: true, // campos *_nombre, *_id directos
    },
  });

  const d = data?.direcciones?.[0];
  if (!d) return null;

  const alturaVal = d?.altura?.valor ?? null;
  const calle     = d?.calle?.nombre ?? calleNombre;
  const loc       = d?.localidad_censal_nombre ?? localidadNombre ?? '';
  const prov      = d?.provincia_nombre ?? provinciaNombre ?? '';
  const lat       = d?.ubicacion?.lat ?? null;
  const lon       = d?.ubicacion?.lon ?? null;

  // formato consistente:
  const canonicalParts = [calle, alturaVal].filter(Boolean).join(' ');
  const canonical = `${canonicalParts}, ${loc}, ${prov}, Argentina`;

  return { calle, altura: alturaVal, localidad: loc, provincia: prov, canonical, lat, lon };
}
