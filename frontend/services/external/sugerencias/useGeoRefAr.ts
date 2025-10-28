import axios from 'axios';

const GOOGLE_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ??
  process.env.GOOGLE_MAPS_API_KEY ??
  '';

const PLACES_AUTOCOMPLETE_V1 = 'https://places.googleapis.com/v1/places:autocomplete';
const GEOCODE_ENDPOINT = 'https://maps.googleapis.com/maps/api/geocode/json';
const GEOREF = 'https://apis.datos.gob.ar/georef/api';

// Rectángulo aproximado de Argentina (para limitar resultados)
const AR_BBOX = {
  low: { latitude: -55.25, longitude: -73.56 }, // sudoeste
  high: { latitude: -21.78, longitude: -53.63 }, // noreste
};

export type Sugerencia = { descripcion: string; placeId: string };
export type DireccionNormalizada = {
  calle: string;
  altura?: number | null;
  localidad: string;
  provincia: string;
  canonical: string;
  lat?: number | null;
  lon?: number | null;
};

export const debounce = <F extends (...a: any[]) => void>(fn: F, ms = 250) => {
  let t: any;
  return (...args: Parameters<F>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

const stripAccents = (s: string) =>
  s.normalize('NFD').replace(/\p{Diacritic}/gu, '');

const uniqueBy = <T, K extends string | number>(arr: T[], key: (x: T) => K) => {
  const seen = new Set<K>();
  const out: T[] = [];
  for (const it of arr) {
    const k = key(it);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(it);
    }
  }
  return out;
};

// ------------------------
// Provincias (cache local)
// ------------------------
type Provincia = { id: string; nombre: string };
const provinciasCache: { list: Provincia[] | null; byId: Map<string, string> } = {
  list: null,
  byId: new Map(),
};

async function cargarProvincias(): Promise<void> {
  if (provinciasCache.list) return;
  const { data } = await axios.get(`${GEOREF}/provincias`, {
    params: { campos: 'id,nombre', max: 100 },
  });
  const list: Provincia[] = (data?.provincias ?? []).sort((a: any, b: any) =>
    (a?.nombre ?? '').localeCompare(b?.nombre ?? '', 'es', { sensitivity: 'base' })
  );
  provinciasCache.list = list;
  provinciasCache.byId = new Map(list.map((p) => [p.id, p.nombre]));
}

function provinciaNombreDeId(id?: string | null): string | undefined {
  if (!id) return undefined;
  return provinciasCache.byId.get(id);
}

export async function listarProvincias(): Promise<Array<{ id: string; nombre: string }>> {
  await cargarProvincias();
  return provinciasCache.list ?? [];
}

// ------------------------
// Google Places - helpers
// ------------------------
function ensureApiKey() {
  if (!GOOGLE_API_KEY) {
    throw new Error('Falta GOOGLE MAPS API KEY (EXPO_PUBLIC_GOOGLE_MAPS_API_KEY)');
  }
}

type PlacesAutocompleteSuggestion = {
  placePrediction?: {
    placeId?: string;
    structuredFormat?: {
      mainText?: { text?: string };
      secondaryText?: { text?: string };
    };
  };
};

async function placesAutocomplete(body: any): Promise<PlacesAutocompleteSuggestion[]> {
  ensureApiKey();
  const { data } = await axios.post(PLACES_AUTOCOMPLETE_V1, body, {
    headers: {
      'X-Goog-Api-Key': GOOGLE_API_KEY,
    },
    timeout: 6000,
  });
  return (data?.suggestions ?? []) as PlacesAutocompleteSuggestion[];
}

// ------------------------------------
// Sugerencias: Localidades (solo AR)
// ------------------------------------
export async function buscarLocalidades(
  provinciaId: string,
  q: string,
  sessionToken?: string
): Promise<Sugerencia[]> {
  if (q.trim().length < 2) return [];

  let provinciaNombre: string | undefined;
  if (provinciaId) {
    await cargarProvincias();
    provinciaNombre = provinciaNombreDeId(provinciaId);
  }

  const input = provinciaNombre
    ? `${q}, ${provinciaNombre}, Argentina`
    : `${q}, Argentina`;

  const suggs = await placesAutocomplete({
    input,
    includedPrimaryTypes: ['locality'],
    languageCode: 'es',
    regionCode: 'AR',
    sessionToken,
    locationRestriction: { rectangle: AR_BBOX },
  });

  const mapped = suggs
    .map((s) => s.placePrediction)
    .filter((p): p is NonNullable<typeof p> => !!p && !!p.placeId)
    .map((p) => {
      const main = p.structuredFormat?.mainText?.text?.trim() || '';
      const placeId = p.placeId!;
      return {
        descripcion: main,
        placeId: `gpid:${placeId}|type:locality|locName:${main}|provName:${provinciaNombre ?? ''}`,
      } as Sugerencia;
    });

  return uniqueBy(mapped, (x) => stripAccents(x.descripcion.toLowerCase()));
}

// -------------------------------
// Sugerencias: Calles (solo AR)
// -------------------------------
export async function buscarCalles(opts: {
  provinciaId: string;
  localidadId?: string;
  localidadNombre?: string;
  q: string;
  sessionToken?: string;
}): Promise<Sugerencia[]> {
  const { provinciaId, localidadNombre, q, sessionToken } = opts;
  if (q.trim().length < 2) return [];

  let provinciaNombre: string | undefined;
  if (provinciaId) {
    await cargarProvincias();
    provinciaNombre = provinciaNombreDeId(provinciaId);
  }

  const contexto = [localidadNombre, provinciaNombre, 'Argentina'].filter(Boolean).join(', ');
  const input = `${q}, ${contexto}`;

  const suggs = await placesAutocomplete({
    input,
    includedPrimaryTypes: ['route'],
    languageCode: 'es',
    regionCode: 'AR',
    sessionToken,
    locationRestriction: { rectangle: AR_BBOX },
  });

  const mapped = suggs
    .map((s) => s.placePrediction)
    .filter((p): p is NonNullable<typeof p> => !!p && !!p.placeId)
    .map((p) => {
      const main = p.structuredFormat?.mainText?.text?.trim() || '';
      const placeId = p.placeId!;
      return {
        descripcion: main,
        placeId: `gpid:${placeId}|type:route|calleName:${main}|locName:${localidadNombre ?? ''}|provName:${provinciaNombre ?? ''}`,
      } as Sugerencia;
    });

  return uniqueBy(mapped, (x) => x.descripcion);
}

// ------------------------------------------------------
// Normalización local (sin API): arma el "canonical" UI
// ------------------------------------------------------
export function normalizarDireccion(params: {
  calleNombre: string;
  altura?: string | number;
  provinciaNombre?: string;
  localidadNombre?: string;
}): DireccionNormalizada {
  const { calleNombre, altura, provinciaNombre, localidadNombre } = params;
  const calleLower = calleNombre;

  const alturaVal =
    altura === undefined || altura === null || String(altura).trim() === ''
      ? null
      : Number(String(altura).trim());

  const loc = localidadNombre ?? '';
  const prov = provinciaNombre ?? '';

  const canonicalParts = [calleLower, alturaVal]
    .filter((x) => x !== null && x !== undefined && String(x).length > 0)
    .join(' ');

  const canonical = `${canonicalParts}${canonicalParts ? ', ' : ''}${loc}, ${prov}, Argentina`;

  return {
    calle: calleLower,
    altura: alturaVal,
    localidad: loc,
    provincia: prov,
    canonical,
    lat: undefined,
    lon: undefined,
  };
}

// --------------------------------------------------------
// Coordenadas aparte (cuando vos decidas): Google Geocoding
// --------------------------------------------------------
export async function obtenerCoordenadasDesdeDireccion(
  params:
    | { canonical: string }
    | { calle: string; altura?: number | null; localidad: string; provincia: string }
): Promise<{ lat: number | null; lon: number | null }> {
  ensureApiKey();

  const address =
    'canonical' in params
      ? params.canonical
      : `${params.calle}${params.altura ? ' ' + params.altura : ''}, ${params.localidad}, ${params.provincia}, Argentina`;

  const { data } = await axios.get(GEOCODE_ENDPOINT, {
    params: {
      address,
      components: 'country:AR',
      key: GOOGLE_API_KEY,
      language: 'es',
    },
    timeout: 7000,
  });

  const result = (data?.results ?? [])[0];
  if (!result?.geometry?.location) {
    return { lat: null, lon: null };
  }

  const round10 = (n: number | null) =>
    n == null ? null : Math.round(n * 1e10) / 1e10;

  const lat = round10(result.geometry.location.lat);
  const lon = round10(result.geometry.location.lng);
  return { lat, lon };
}
