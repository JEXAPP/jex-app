// ✅ Hook corregido
import { useEffect, useState } from "react";
import useBackendConection from "@/services/internal/useBackendConection";
import { Alert } from "react-native";

export const useSanction = (workerId: string, eventId?: string) => {
  const { requestBackend } = useBackendConection();

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [selectedType, setSelectedType] = useState<any | null>(null);
  const [customComment, setCustomComment] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [worker, setWorker] = useState<any>(null);
  

  // 🟣 Traer info del empleado
  const fetchWorker = async () => {
    if (!workerId || !eventId) return;
    try {
      const data = await requestBackend(`/api/events/${eventId}/employee/`, null, "GET");
      if (Array.isArray(data)) {
        const found = data.find((emp: any) => String(emp.employee_id) === String(workerId));
        if (found) {
          setWorker({
            id: found.employee_id,
            name: found.name,
            role: found.job_type,
            image: found.image_url || null,
          });
        }
      }
    } catch (err) {
      console.log("❌ Error cargando empleado:", err);
    }
  };

  // 🟣 Traer categorías de sanciones
  const fetchCategories = async () => {
  try {
    const data = await requestBackend("/api/rating/penalty/categories/", null, "GET");
    if (Array.isArray(data)) {
      const filtered = data.filter((cat) => cat.id !== 7);
      const withOther = [...filtered, { id: "otro", name: "Otro", types: [] }];

      const iconMap: Record<string | number, string> = {
        4: "time-outline",
        5: "briefcase-outline",
        6: "alert-circle-outline",
        otro: "create-outline",
      };

      const withIcons = withOther.map((cat) => ({
        ...cat,
        icon: iconMap[cat.id] || "alert-outline",
      }));

      setCategories(withIcons);
    }
  } catch (err) {
    console.log("❌ Error cargando categorías:", err);
    Alert.alert("Error", "No se pudieron cargar las categorías de sanciones.");
  }
};

  useEffect(() => {
    fetchWorker();
    fetchCategories();
  }, [workerId, eventId]);

  // 🟣 Seleccionar categoría o tipo
  const selectOption = (option: any) => {
    if (!selectedCategory) {
      setSelectedCategory(option);
      if (option.id === "otro") setSelectedType({ id: "otro" });
    } else if (selectedCategory && !selectedType && selectedCategory.id !== "otro") {
      setSelectedType(option);
    }
  };

  const goBackOption = () => {
  if (selectedCategory?.id === "otro") {
    setSelectedType(null);
    setSelectedCategory(null);
  } else if (selectedType) {
    setSelectedType(null);
  } else if (selectedCategory) {
    setSelectedCategory(null);
  }
};
  // 🟣 Registrar sanción
  const registerSanction = async () => {
    if (!workerId || !eventId) return;

    const isOther = selectedCategory?.id === "otro";
    if (isOther && !customComment.trim()) {
      Alert.alert("Aviso", "Debes escribir una descripción para la sanción.");
      return;
    }

    const body = {
      penalized_user: Number(workerId),
      event: Number(eventId),
      penalty_type: isOther ? null : selectedType?.id,
      comments: isOther ? customComment.trim() : selectedType?.name,
    };

    try {
      setLoading(true);
      const res = await requestBackend("/api/rating/penalty/create/", body, "POST");
      Alert.alert("Éxito", res?.message || "Sanción registrada correctamente");
    } catch (err) {
      console.log("❌ Error registrando sanción:", err);
      Alert.alert("Error", "No se pudo registrar la sanción.");
    } finally {
      setLoading(false);
    }
  };

  const currentOptions = !selectedCategory
    ? categories
    : selectedCategory.id !== "otro"
      ? selectedCategory.types
      : [];

  return {
    worker,
    currentOptions,
    selectedCategory,
    selectedType,
    selectOption,
    goBackOption,
    registerSanction,
    canGoBack: !!selectedCategory,
    customComment,
    setCustomComment,
    loading,
  };
};
