// hooks/employer/panel/qualification/useSanction.ts
import { useState } from "react";

const sanctionTree = [
  {
    label: "Compromiso y puntualidad",
    value: "leves",
    icon: "walk-outline",
    children: [
      { label: "Llega tarde", value: "tarde", icon: "time-outline" },
      { label: "No confirma asistencia", value: "no_confirma", icon: "help-circle-outline" },
      { label: "Trabaja desinteresadamente", value: "desinteres", icon: "remove-circle-outline" },
    ],
  },
  {
    label: "Responsabilidad laboral",
    value: "moderadas",
    icon: "alert-circle-outline",
    children: [
      { label: "No presentarse al turno", value: "no_presenta", icon: "close-circle-outline" },
      { label: "Abandonar turno", value: "abandona", icon: "exit-outline" },
      { label: "No cumplir funciones", value: "no_funciones", icon: "briefcase-outline" },
    ],
  },
  {
    label: "Conducta inadecuada",
    value: "graves",
    icon: "flame-outline",
    children: [
      { label: "Conducta violenta", value: "violenta", icon: "warning-outline" },
      { label: "Fraude", value: "fraude", icon: "cash-outline" },
      { label: "Robo", value: "robo", icon: "bag-handle-outline" },
    ],
  },
];

export const useSanction = (workerId: string) => {
  const mockWorkers = [
    {
      id: "1",
      name: "Martina Salvo",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: "2",
      name: "Juan García",
      image: "https://randomuser.me/api/portraits/men/46.jpg",
    },
    {
      id: "3",
      name: "Luna Costas",
      role: "Fotógrafo",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      linked: false,
    },
    {
      id: "4",
      name: "Diego López",
      role: "Cantante",
      image: "https://randomuser.me/api/portraits/men/12.jpg",
      linked: true,
    },
    {
      id: "5",
      name: "Paula Méndez",
      role: "DJ",
      image: "https://randomuser.me/api/portraits/women/22.jpg",
      linked: false,
    },
  ];

  const worker = mockWorkers.find((w) => w.id === workerId);

  const [path, setPath] = useState<any[]>([]);
  const [selectedSanction, setSelectedSanction] = useState<any>(null);

  const currentOptions =
    path.length === 0 ? sanctionTree : path[path.length - 1].children || [];

  const selectOption = (option: any) => {
    if (option.children) {
      setPath([...path, option]);
    } else {
      setSelectedSanction(option);
    }
  };

  const goBackOption = () => {
    if (path.length > 0) {
      setPath(path.slice(0, -1));
      setSelectedSanction(null);
    }
  };

  const registerSanction = () => {
    console.log("✅ Sanción registrada:", {
      workerId,
      sanction: selectedSanction,
    });
  };

  return {
    worker,
    currentOptions,
    selectedSanction,
    selectOption,
    goBackOption,
    registerSanction,
    canGoBack: path.length > 0,
  };
};
