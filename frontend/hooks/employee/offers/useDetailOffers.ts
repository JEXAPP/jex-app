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
  const { id } = useLocalSearchParams(); // el id viene de goToOfferDetail
  const { requestBackend } = useBackendConection();
  const router = useRouter();

  const [offer, setOffer] = useState<OfferDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // helper para formatear salario con separador de miles
  const formatNumber = (value: string | number) => {
    const num = Number(value);
    if (isNaN(num)) return String(value);
    return new Intl.NumberFormat("es-AR").format(num);
  };

  // 🔹 trae detalle de la oferta
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

        console.log("🔹 Respuesta detalle backend:", JSON.stringify(data, null, 2));

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

  // ✅ aceptar/rechazar oferta
  const decideOffer = async (rejected: boolean, onAccepted?: () => void) => {
    try {
      setLoading(true);

      const body = { rejected };
      const resp = await requestBackend(
        `/api/applications/offers/${id}/decide/`,
        body,
        "POST"
      );

      console.log("🔹 Respuesta al decidir oferta:", resp);

      if (rejected) {
        alert("Has rechazado la oferta.");
        router.replace("/employee/offers/check-offers");
      } else {
        // dispara animación en pantalla
        if (onAccepted) onAccepted();
      }
    } catch (err) {
      console.log("❌ Error al decidir la oferta:", err);
      alert("No se pudo procesar la decisión.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = (onAccepted: () => void) => decideOffer(false, onAccepted);
  const handleReject = () => decideOffer(true);

  return { offer, loading, handleAccept, handleReject };
};
