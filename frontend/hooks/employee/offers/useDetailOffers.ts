import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import useBackendConection from "@/services/internal/useBackendConection";

type OfferDetail = {
  id: number;
  salary: string;
  role: string;
  date: string;
  startTime: string;
  endTime: string;
  company: string;
  eventImage: any;
  expirationDate: string;
  expirationTime: string;
  location: string;
  requirements: string[];
  comments: string;
};

export const useDetailOffers = () => {
  const { id } = useLocalSearchParams();
  const { requestBackend } = useBackendConection();
  const router = useRouter();
  const [accepting, setAccepting] = useState(false);

  const [offer, setOffer] = useState<OfferDetail | null>(null);
  const [loading, setLoading] = useState(true); 
  const [showRejected, setShowRejected] = useState(false); // 👈 para ClickWindow

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
        if (!mounted) return;

        const shift = data.application?.shift;
        const vacancy = shift?.vacancy;

        const mapped: OfferDetail = {
          id: data.id,
          salary: formatNumber(shift?.payment || 0),
          role: vacancy?.job_type?.name || "Sin rol",
          date: shift?.start_date || "",
          startTime: shift?.start_time || "",
          endTime: shift?.end_time || "",
          company: vacancy?.event?.name || "Evento sin nombre",
          eventImage: require("@/assets/images/jex/Jex-Evento-Default.png"),
          expirationDate: data.expiration_date || "",
          expirationTime: data.expiration_time || "",
          location: vacancy?.event?.location || "Ubicación no definida",
          requirements: vacancy?.requirements?.map((r: any) => r.description) || [],
          comments: vacancy?.description || data.additional_comments || "",
        };

        setOffer(mapped);
      } catch (e) {
        console.log("❌ Error al traer detalle de oferta:", e);
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
  if (rejected) setShowRejected(true); // mostrar modal inmediatamente

  try {
    const body = { rejected };
    const resp = await requestBackend(`/api/applications/offers/${id}/decide/`, body, "POST");
    console.log("🔹 Respuesta al decidir oferta:", resp);

    if (!rejected && onAccepted) onAccepted(); // animación match
  } catch (err) {
    console.log("❌ Error al decidir la oferta:", err);
    if (rejected) setShowRejected(false); // cerrar modal si hubo error
    alert("No se pudo procesar la decisión.");
  }
};

  const handleAccept = (onAccepted: () => void) => {
  setAccepting(true); // start spinner
  decideOffer(false, () => {
    onAccepted();
    setAccepting(false); // stop spinner después de iniciar animación
  }).finally(() => setAccepting(false)); // por si falla
};
  const handleReject = () => decideOffer(true);
  const closeRejected = () => {
    setShowRejected(false);
    router.replace("/employee/offers/check-offers"); // 👈 vuelve a la pantalla anterior
  };

  return { 
    offer, 
    loading, 
    handleAccept, 
    handleReject, 
    showRejected, 
    closeRejected,
    accepting
  };
};
