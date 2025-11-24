import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import useBackendConection from "@/services/internal/useBackendConection";
import { Animated, Easing } from "react-native";
import { Offer } from "@/constants/interfaces";

type Coords = { latitude: number; longitude: number };

const toNum = (v: any) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

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

  const [locationAddress, setLocationAddress] = useState<string | null>(null);
  const [locationCoords, setLocationCoords] = useState<Coords | null>(null);

  const [isMpAssociated, setIsMpAssociated] = useState<boolean>(true);
  const [showMpModal, setShowMpModal] = useState(false);

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
  }, []);

  const formatNumber = (value: string | number) => {
    const num = Number(value);
    if (isNaN(num)) return String(value);
    return new Intl.NumberFormat("es-AR").format(num);
  };

  const formatDate = (date: Date) => {
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  useEffect(() => {
    let mounted = true;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await requestBackend(
          `/api/applications/offers/${id}/detail/`,
          null,
          "GET"
        );
        if (!mounted) return;

        const shift = data?.application?.shift ?? data?.shift;
        const vacancy = shift?.vacancy;
        const ev = vacancy?.event ?? {};

        const expirationDate = data?.expiration_date ?? "";
        const expirationTime = data?.expiration_time ?? "";

        const mapped: Offer = {
          id: data?.id ?? 0,
          salary: formatNumber(shift?.payment ?? 0),
          role: vacancy?.job_type ?? "Sin rol",
          date: shift?.start_date ?? "",
          startTime: shift?.start_time ?? "",
          endTime: shift?.end_time ?? "",
          company: vacancy?.event?.name ?? "Evento sin nombre",
          eventImage:
            data?.event_image_url && typeof data.event_image_url === "string"
              ? { uri: data.event_image_url }
              : require("@/assets/images/jex/Jex-Evento-Default.webp"),
          expirationDate,
          expirationTime,
          location: vacancy?.event?.location ?? "Ubicación no definida",
          requirements:
            vacancy?.requirements?.map((r: any) => r.description) ?? [],
          comments: data?.additional_comments ?? "-",
        };

        setOffer(mapped);

        const topLevelAddr: string | null =
          typeof data?.address === "string" && data.address.trim().length > 0
            ? data.address.trim()
            : null;
        const eventAddr: string | null =
          typeof ev?.location === "string" && ev.location.trim().length > 0
            ? ev.location.trim()
            : null;

        const topLat = toNum(data?.latitude);
        const topLng = toNum(data?.longitude);
        const evLat = toNum(ev?.latitude);
        const evLng = toNum(ev?.longitude);

        setLocationAddress(topLevelAddr || eventAddr || mapped.location || null);
        setLocationCoords(
          topLat !== null && topLng !== null
            ? { latitude: topLat, longitude: topLng }
            : evLat !== null && evLng !== null
            ? { latitude: evLat, longitude: evLng }
            : null
        );

        setIsMpAssociated(Boolean(data?.is_mp_associated));
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
  }, []);

  const decideOffer = async (rejected: boolean, onAccepted?: () => void) => {
    if (rejected) setShowRejected(true);
    try {
      const body = { rejected };
      await requestBackend(
        `/api/applications/offers/${id}/decide/`,
        body,
        "POST"
      );
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

  const openConfirmReject = () => setConfirmRejectVisible(true);
  const closeConfirmReject = () => setConfirmRejectVisible(false);
  const confirmReject = async () => {
    setConfirmRejectVisible(false);
    await handleReject();
  };

  const openMpModal = () => setShowMpModal(true);
  const closeMpModal = () => setShowMpModal(false);
  const goToAssociateMp = () => {
    setShowMpModal(false);
    router.push("/employee/profile/settings/associate-mp");
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

    locationAddress,
    locationCoords,

    isMpAssociated,
    showMpModal,
    openMpModal,
    closeMpModal,
    goToAssociateMp,
  };
};
