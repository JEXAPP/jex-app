// /services/external/suggestSources.ts
import axios from "axios";

/** Item básico normalizado para tus sugerencias */
export type SuggestItem = { id: string; label: string };

/** Normaliza strings para comparar sin acentos y sin mayúsculas */
function norm(s: string) {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/** Filtro: label debe EMPEZAR con el query (ignora acentos/mayúsculas) */
function prefixMatch(label: string, query: string) {
  const nl = norm(label);
  const nq = norm(query);
  return nl.startsWith(nq);
}

/** Utilidad para ordenar: primero los que matchean, luego por longitud/alfabético */
function sortForSuggest(a: SuggestItem, b: SuggestItem, q: string) {
  const an = norm(a.label);
  const bn = norm(b.label);
  const qn = norm(q);

  // ambos ya empiezan con q; desempatá por longitud y luego alfabético
  if (an.length !== bn.length) return an.length - bn.length;
  return an.localeCompare(bn, "es");
}

/** Caché simple en memoria para reducir llamadas repetidas (opcional) */
const cache = new Map<string, SuggestItem[]>();

/* ---------------------------------- ESCO ---------------------------------- */
/**
 * Sugerencias de CARGOS (ocupaciones) usando ESCO (EU).
 * - idioma: español
 * - solo ocupaciones (type=occupation)
 * - filtra en cliente por "empieza con"
 */
export async function suggestCargosESCO(
  texto: string,
  opts?: { limit?: number }
): Promise<SuggestItem[]> {
  const q = (texto ?? "").trim();
  const limit = opts?.limit ?? 10;
  if (q.length < 1) return [];

  const cacheKey = `esco:${q}:${limit}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  const url = `https://ec.europa.eu/esco/api/suggest2`;
  try {
    const { data } = await axios.get(url, {
      params: {
        language: "es",
        type: "occupation",
        text: q,
        offset: 0,
        limit: 25, // pedimos un poco más para filtrar por prefijo
      },
    });

    const raw: any[] = data?._embedded?.results ?? [];
    const mapped: SuggestItem[] = raw
      .map((r: any) => ({ id: r.uri as string, label: r.prefLabel as string }))
      .filter((it) => it.label && prefixMatch(it.label, q))
      .sort((a, b) => sortForSuggest(a, b, q))
      .slice(0, limit);

    cache.set(cacheKey, mapped);
    return mapped;
  } catch {
    return [];
  }
}

/* ------------------------------ Hipolabs Uni ------------------------------ */
/**
 * Sugerencias de UNIVERSIDADES usando Hipolabs.
 * - por defecto filtra por Argentina (podés cambiarlo con opts.country)
 * - filtra en cliente por "empieza con"
 */
export async function suggestUniversidadesHipolabs(
  texto: string,
  opts?: { country?: string; limit?: number }
): Promise<SuggestItem[]> {
  const q = (texto ?? "").trim();
  const limit = opts?.limit ?? 10;
  const country = opts?.country ?? "Argentina";
  if (q.length < 1) return [];

  const cacheKey = `hipo:${country}:${q}:${limit}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  const url = `http://universities.hipolabs.com/search`;
  try {
    const { data } = await axios.get(url, {
      params: { name: q, country },
    });

    const seen = new Set<string>();
    const mapped: SuggestItem[] = (data ?? [])
      .map((u: any) => ({ id: `${u.name}-${u.country}`, label: u.name as string }))
      .filter((it) => it.label && prefixMatch(it.label, q))
      .filter((it) => {
        const k = norm(it.label);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      .sort((a, b) => sortForSuggest(a, b, q))
      .slice(0, limit);

    cache.set(cacheKey, mapped);
    return mapped;
  } catch {
    return [];
  }
}

/* ------------------------------- OpenAlex --------------------------------- */
/**
 * Sugerencias de DISCIPLINAS (conceptos) usando OpenAlex Concepts.
 * - sin API key; conviene mandar User-Agent
 * - filtra en cliente por "empieza con"
 */
export async function suggestDisciplinasOpenAlex(
  texto: string,
  opts?: { limit?: number }
): Promise<SuggestItem[]> {
  const q = (texto ?? "").trim();
  const limit = opts?.limit ?? 10;
  if (q.length < 1) return [];

  const cacheKey = `openalex:${q}:${limit}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  const url = `https://api.openalex.org/concepts`;
  try {
    const { data } = await axios.get(url, {
      params: {
        search: q,
        "per-page": 25, // pedir un poco más para luego filtrar
        select: "id,display_name,level", // level no es obligatorio, pero útil si querés filtrar por granularidad
      },
      headers: {
        "User-Agent": "JEX/1.0 (contact: soporte@jex.app)",
      },
    });

    const raw: any[] = data?.results ?? [];
    const mapped: SuggestItem[] = raw
      .map((c: any) => ({ id: c.id as string, label: c.display_name as string }))
      .filter((it) => it.label && prefixMatch(it.label, q))
      .sort((a, b) => sortForSuggest(a, b, q))
      .slice(0, limit);

    cache.set(cacheKey, mapped);
    return mapped;
  } catch {
    return [];
  }
}
