import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import useBackendConection from "@/services/internal/useBackendConection";
import { Animated, Easing } from "react-native";
import { Offer } from "@/constants/interfaces";

export const useDetailOffers = () => {
  const { id } = useLocalSearchParams();
  const { requestBackend } = useBackendConection();
  const router = useRouter();

  const [confirmRejectVisible, setConfirmRejectVisible] = useState(false);
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [showRejected, setShowRejected] = useState(false);
  const [showMatch, setShowMatch] = useState(false);

  // Animaciones para pantalla de "match"
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Dispara animación de match y luego redirige
  useEffect(() => {
    if (showMatch) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => {
          router.replace("/employee/offers");
        }, 3000);
      });
    }
  }, [showMatch]);

  // Formatea números con locale es-AR
  const formatNumber = (value: string | number) => {
    const num = Number(value);
    if (isNaN(num)) return String(value);
    return new Intl.NumberFormat("es-AR").format(num);
  };

  // Devuelve dd/mm/yyyy
  const formatDate = (date: Date) => {
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  // Consulta detalle y normaliza a Offer (sin cambiar nombres)
  useEffect(() => {
    let mounted = true;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await requestBackend(`/api/applications/offers/${id}/detail/`, null, "GET");
        if (!mounted) return;

        const shift = data?.application?.shift;
        const vacancy = shift?.vacancy;

        // Calcula vencimiento restando 3 días a la fecha de inicio
        let expirationDate = "";
        if (shift?.start_date) {
          const [d, m, y] = shift.start_date.split("/").map(Number);
          const start = new Date(y, m - 1, d);
          start.setDate(start.getDate() - 3);
          expirationDate = formatDate(start);
        }

        const mapped: Offer = {
          id: data?.id ?? 0,
          salary: formatNumber(shift?.payment ?? 0),
          role: vacancy?.job_type ?? "Sin rol",
          date: shift?.start_date ?? "",
          startTime: shift?.start_time ?? "",
          endTime: shift?.end_time ?? "",
          company: vacancy?.event?.name ?? "Evento sin nombre",
          eventImage: require("@/assets/images/jex/Jex-Evento-Default.png"),
          expirationDate,
          expirationTime: "00:00",
          location: vacancy?.event?.location ?? "Ubicación no definida",
          requirements: vacancy?.requirements?.map((r: any) => r.description) ?? [],
          comments: vacancy?.description ?? data?.additional_comments ?? "",
        };

        setOffer(mapped);
      } catch (e) {
        console.log("Error al traer detalle de oferta:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (id) fetchDetail();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Envía decisión (aceptar/rechazar) y maneja estados asociados
  const decideOffer = async (rejected: boolean, onAccepted?: () => void) => {
    if (rejected) setShowRejected(true);
    try {
      const body = { rejected };
      await requestBackend(`/api/applications/offers/${id}/decide/`, body, "POST");
      if (!rejected && onAccepted) onAccepted();
    } catch (err) {
      console.log("Error al decidir la oferta:", err);
      if (rejected) setShowRejected(false);
      alert("No se pudo procesar la decisión.");
    }
  };

  const handleAccept = (onAccepted: () => void) => {
    setAccepting(true);
    decideOffer(false, onAccepted).finally(() => setAccepting(false));
  };

  const handleReject = () => decideOffer(true);

  const closeRejected = () => {
    setShowRejected(false);
    router.replace("/employee/offers");
  };

  // Control de confirmación de rechazo
  const openConfirmReject = () => setConfirmRejectVisible(true);
  const closeConfirmReject = () => setConfirmRejectVisible(false);
  const confirmReject = async () => {
    setConfirmRejectVisible(false);
    await handleReject();
  };

  return {
    offer,
    loading,
    accepting,
    handleAccept,
    handleReject,
    showRejected,
    closeRejected,
    showMatch,
    fadeAnim,
    scaleAnim,
    setShowMatch,
    confirmRejectVisible,
    openConfirmReject,
    closeConfirmReject,
    confirmReject,
  };
};
