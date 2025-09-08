import { useRouter, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { useHomeEmployer } from "../useHomeEmployer"; 

type VacancyState =
  | "Activa"
  | "En Borrador"
  | "Oculta"
  | "Llena"
  | "Vencida"
  | "Eliminada";

const SELECTABLE_STATES: VacancyState[] = [
  "Activa",
  "En Borrador",
  "Oculta",
  "Llena",
  "Vencida",
];

export const useVacancies = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // usamos el hook original
  const {
    events,
    loading,
    goToCreateVacancy,
    goToVacancyDetail,
    search,
    setSearch,
  } = useHomeEmployer();

  const [selectedState, setSelectedState] = useState<VacancyState | null>(null);

  const currentEvent = events.find((e) => e.id === Number(id));

  const filteredVacantes = useMemo(() => {
    if (!currentEvent) return [];

    const bySearch = (v: any) =>
      v.nombre?.toLowerCase().includes(search.toLowerCase());

    const byState = (v: any) => {
      if (search.trim().length > 0) return true;
      if (!selectedState) return true;
      return v.estado === selectedState;
    };

    return currentEvent.vacantes
      .filter(bySearch)
      .filter(byState)
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [currentEvent, search, selectedState]);

  return {
    currentEvent,
    filteredVacantes,
    loading,
    search,
    setSearch,
    selectableStates: SELECTABLE_STATES,
    selectedState,
    setSelectedState,
    goToCreateVacancy,
    goToVacancyDetail,
  };
};
