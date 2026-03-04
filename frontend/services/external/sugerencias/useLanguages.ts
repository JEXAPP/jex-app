import { useEffect, useState } from 'react';
import axios from 'axios';

export type LanguageOption = { id: string; name: string };

// Cache en memoria para no pegarle siempre a la API
let cachedLanguages: LanguageOption[] | null = null;

// Traducciones de código ISO 639-2 -> nombre en español
const LANGUAGE_TRANSLATIONS: Record<string, string> = {
  spa: 'Español',
  eng: 'Inglés',
  fra: 'Francés',
  fre: 'Francés',      // alias
  deu: 'Alemán',
  ger: 'Alemán',       // alias
  por: 'Portugués',
  ita: 'Italiano',
  rus: 'Ruso',
  zho: 'Chino',
  jpn: 'Japonés',
  kor: 'Coreano',
  ara: 'Árabe',
  hin: 'Hindi',
  ben: 'Bengalí',
  nld: 'Neerlandés',
  swe: 'Sueco',
  nor: 'Noruego',
  fin: 'Finés',
  dan: 'Danés',
  pol: 'Polaco',
  ukr: 'Ucraniano',
  ell: 'Griego',
  grc: 'Griego',
  tur: 'Turco',
  heb: 'Hebreo',
};

export const fetchLanguages = async (): Promise<LanguageOption[]> => {
  if (cachedLanguages) return cachedLanguages;

  const resp = await axios.get('https://restcountries.com/v3.1/all?fields=languages');
  const set = new Set<string>();

  (resp.data || []).forEach((c: any) => {
    if (c?.languages && typeof c.languages === 'object') {
      Object.entries(c.languages).forEach(([code, _name]) => {
        const translated = LANGUAGE_TRANSLATIONS[code as string];
        // Solo agregamos los que tenemos traducidos al español
        if (translated) {
          set.add(translated);
        }
      });
    }
  });

  const arr = Array.from(set).sort((a, b) => a.localeCompare(b, 'es'));
  cachedLanguages = arr.map((name, idx) => ({ id: String(idx), name }));
  return cachedLanguages;
};

export const useLanguageOptions = () => {
  const [languageOptions, setLanguageOptions] = useState<LanguageOption[]>([]);
  const [loadingLanguages, setLoadingLanguages] = useState(true);
  const [languagesError, setLanguagesError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoadingLanguages(true);
        const data = await fetchLanguages();
        if (!cancelled) setLanguageOptions(data);
      } catch (e) {
        if (!cancelled) setLanguagesError('No se pudieron cargar los idiomas.');
      } finally {
        if (!cancelled) setLoadingLanguages(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { languageOptions, loadingLanguages, languagesError };
};
