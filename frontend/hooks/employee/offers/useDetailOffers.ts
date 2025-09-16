import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import useBackendConection from "@/services/internal/useBackendConection";
import { Animated, Easing } from "react-native";
import { Offer } from "@/constants/interfaces";

export const useDetailOffers = () => {
  const { id } = useLocalSearchParams();
  const { requestBackend } = useBackendConection();
  const router = useRouter();

  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [showRejected, setShowRejected] = useState(false);
  const [showMatch, setShowMatch] = useState(false);

  // Animación de “match” y redirección
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

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

  const formatNumber = (value: string | number) => {
    const num = Number(value);
    if (isNaN(num)) return String(value);
    return new Intl.NumberFormat("es-AR").format(num);
  };

  useEffect(() => {
    let mounted = true;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await requestBackend(`/api/applications/offers/${id}/detail/`, null, "GET");
        console.log(data)
        if (!mounted) return;

        const shift = data?.application?.shift;
        const vacancy = shift?.vacancy;

        const mapped: Offer = {
          id: data?.id ?? 0,
          salary: formatNumber(shift?.payment ?? 0),
          role: vacancy?.job_type?.name ?? "Sin rol",
          date: shift?.start_date ?? "",
          startTime: shift?.start_time ?? "",
          endTime: shift?.end_time ?? "",
          company: vacancy?.event?.name ?? "Evento sin nombre",
          eventImage: require("@/assets/images/jex/Jex-Evento-Default.png"),
          expirationDate: data?.expiration_date ?? "",
          expirationTime: data?.expiration_time ?? "",
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
  };
};
