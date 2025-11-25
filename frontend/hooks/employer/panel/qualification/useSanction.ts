// ✅ Hook corregido con fix y modales
import { useEffect, useState } from "react";
import useBackendConection from "@/services/internal/useBackendConection";

export const useSanction = (workerId: string, eventId?: string) => {
  const { requestBackend } = useBackendConection();

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [selectedType, setSelectedType] = useState<any | null>(null);
  const [customComment, setCustomComment] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [worker, setWorker] = useState<any>(null);

  // 🔴 Modales de error / éxito
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const closeError = () => setShowError(false);
  const closeSuccess = () => setShowSuccess(false);

  // 🟣 Traer info del empleado
  const fetchWorker = async () => {
    if (!workerId || !eventId) return;
    try {
      const data = await requestBackend(
        `/api/events/${eventId}/employee/`,
        null,
        "GET"
      );
      if (Array.isArray(data)) {
        const found = data.find(
          (emp: any) => String(emp.employee_id) === String(workerId)
        );
        if (found) {
          setWorker({
            id: found.employee_id,
            name: found.name,
            role: found.job_type,
            image: found.image || null,
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
      const data = await requestBackend(
        "/api/rating/penalty/categories/",
        null,
        "GET"
      );
      if (Array.isArray(data)) {
        const filtered = data.filter((cat) => cat.id !== 7);
        const withOther = [
          ...filtered,
          { id: "otro", name: "Otro", types: [] },
        ];

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
      setErrorMessage("No se pudieron cargar las categorías de sanciones.");
      setShowError(true);
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
    } else if (
      selectedCategory &&
      !selectedType &&
      selectedCategory.id !== "otro"
    ) {
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

  // 🟣 Registrar sanción (FIX + modales)
  const registerSanction = async (): Promise<boolean> => {
    if (!workerId || !eventId) return false;

    const isOther = selectedCategory?.id === "otro";

    if (isOther && !customComment.trim()) {
      setErrorMessage("Debes escribir una descripción para la sanción.");
      setShowError(true);
      return false;
    }

    const body = {
      penalized_user: Number(workerId),
      event: Number(eventId),
      // ⭐ FIX: "Otro" manda penalty_type = 19
      penalty_type: isOther ? 19 : selectedType?.id,
      comments: isOther ? customComment.trim() : selectedType?.name,
    };

    try {
      setLoading(true);
      await requestBackend("/api/rating/penalty/create/", body, "POST");
      setShowSuccess(true);
      return true;
    } catch (err) {
      console.log("❌ Error registrando sanción:", err);
      setErrorMessage("No se pudo registrar la sanción.");
      setShowError(true);
      return false;
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

    // para modales
    showError,
    errorMessage,
    closeError,
    showSuccess,
    closeSuccess,
  };
};
