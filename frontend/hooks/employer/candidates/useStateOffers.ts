import { useState, useEffect, useCallback } from "react";
import useBackendConection from "@/services/internal/useBackendConection";
import type { SharedEvent } from "./useSharedEventSelector";

export type OfferStatus =
  | "Pendiente"
  | "Aceptada"
  | "Rechazada"
  | "Vencida"
  | "A Pagar"
  | "Pagado";

export type FilterSimple = "Pendiente" | "Aceptadas" | "Otro";
export type FilterFinalized = "A_PAGAR" | "PAGADO";

export type PaymentState =
  | "NOT_PAYED"
  | "APPROVED"
  | "PENDING"
  | "FAILURE";

export type Offer = {
  id: number;
  employeeName: string;
  employeeImage: any;
  role: string;
  salary: string;
  fechaInicio: string;
  horaInicio: string;
  horaFin: string;
  expiryDate: string;
  expiryTime: string;
  status: OfferStatus;
  eventId: number;
  imageUrl: string;
  imageId: string;
  payment_state: PaymentState;
  payment_mp_id?: string | null;
  payment_date?: string | null;
};

type FeeDetails = {
  total_fee_percent?: number | string;
  mp_fee_percent?: number | string;
  app_fee_percent?: number | string;
};

const backendStateToStatus: Record<string, OfferStatus> = {
  PENDING: "Pendiente",
  ACCEPTED: "Aceptada",
  REJECTED: "Rechazada",
  EXPIRED: "Vencida",
  COMPLETED: "A Pagar",
  Completed: "A Pagar",
};

const filterToBackendIds: Record<FilterSimple, number[]> = {
  Pendiente: [1],
  Aceptadas: [2],
  Otro: [3, 5],
};

// currentEvent: evento seleccionado proveniente del selector compartido en el layout
export const useStateOffers = (currentEvent: SharedEvent | null) => {
  const { requestBackend } = useBackendConection();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [filter, setFilter] = useState<FilterSimple>("Aceptadas");
  const [finalizedFilter, setFinalizedFilter] = useState<FilterFinalized>("A_PAGAR");

  const [loading, setLoading] = useState(false);
  const [creatingPaymentId, setCreatingPaymentId] = useState<number | null>(null);
  const [feePercent, setFeePercent] = useState<number | null>(null);

  // Resetear filtros al cambiar de evento
  useEffect(() => {
    setFilter("Aceptadas");
    setFinalizedFilter("A_PAGAR");
  }, [currentEvent?.id]);

  useEffect(() => {
    const fetchFeeDetails = async () => {
      try {
        const data = (await requestBackend(
          "/api/payments/mercadopago/fee-details/",
          null,
          "GET"
        )) as FeeDetails;

        let percent = data?.total_fee_percent;
        let n = percent !== undefined ? Number(percent) : NaN;

        if (!Number.isFinite(n)) {
          const mp = Number(data?.mp_fee_percent ?? 0);
          const app = Number(data?.app_fee_percent ?? 0);
          n = mp + app;
        }

        if (!Number.isFinite(n)) n = 0;

        setFeePercent(n);
      } catch {
        setFeePercent(0);
      }
    };

    fetchFeeDetails();
  }, []);

  const fetchOffers = useCallback(async () => {
    if (!currentEvent || feePercent === null) return;

    setLoading(true);
    try {
      const isFinalized = currentEvent.state.name === "Finalizado";

      let all: any[] = [];

      if (isFinalized) {
        const paymentStatus = finalizedFilter === "A_PAGAR" ? 1 : 2;

        const data = await requestBackend(
          `/api/applications/offers/${currentEvent.id}/state/6/?payment_status=${paymentStatus}`,
          null,
          "GET"
        );

        all = Array.isArray(data) ? data : [];
      } else {
        const stateIds = filterToBackendIds[filter];

        const requests = stateIds.map((sid) =>
          requestBackend(
            `/api/applications/offers/${currentEvent.id}/state/${sid}/`,
            null,
            "GET"
          )
        );

        const results = await Promise.all(requests);
        all = results.flat().filter(Boolean);
      }

      const normalized: Offer[] = all.map((item: any) => {
        const backendName = item?.offer_state?.name;

        const status: OfferStatus = isFinalized
          ? finalizedFilter === "PAGADO"
            ? "Pagado"
            : "A Pagar"
          : backendStateToStatus[backendName] ?? "Pendiente";

        const basePayment = Number(item?.shift?.payment ?? 0);
        const factor = 1 + (feePercent ?? 0) / 100;
        const totalWithFee = basePayment * factor;

        return {
          id: item?.id ?? 0,
          employeeName: `${item?.employee_name ?? ""} ${
            item?.employee_lastname ?? ""
          }`.trim(),
          employeeImage: require("@/assets/images/jex/Jex-FotoPerfil.webp"),
          role: item?.job_type ?? "Sin rol",
          salary: new Intl.NumberFormat("es-AR").format(totalWithFee),
          fechaInicio: item?.shift?.start_date ?? "",
          horaInicio: item?.shift?.start_time ?? "",
          horaFin: item?.shift?.end_time ?? "",
          expiryDate: item?.expiration_date ?? "",
          expiryTime: item?.expiration_time ?? "",
          status,
          eventId: currentEvent.id,
          imageUrl: item?.profile_image,
          imageId: item?.profile_image_id,
          payment_state: (item?.payment_state as PaymentState) ?? "NOT_PAYED",
          payment_mp_id: item?.payment_mp_id ?? null,
          payment_date: item?.payment_date ?? null,
        };
      });

      setOffers(normalized);
    } finally {
      setLoading(false);
    }
  }, [currentEvent, filter, finalizedFilter, feePercent]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const refreshOffers = () => {
    fetchOffers();
  };

  const createPaymentLink = async (offerId: number) => {
    setCreatingPaymentId(offerId);
    try {
      let data: any = await requestBackend(
        `/api/payments/mercadopago/payments/${offerId}/`,
        null,
        "POST"
      );

      if (!data || typeof data !== "object") {
        data = await requestBackend(
          `/api/payments/mercadopago/payments/${offerId}/`,
          null,
          "GET"
        );
      }

      const url =
        data?.payment_url ||
        data?.init_point ||
        data?.sandbox_init_point ||
        data?.url ||
        data?.redirect_url ||
        data?.link;

      if (!url) {
        throw new Error("No se pudo obtener el link de pago");
      }

      return { url };
    } finally {
      setCreatingPaymentId(null);
    }
  };

  return {
    offers,
    filteredOffers: offers,
    filter,
    setFilter,
    finalizedFilter,
    setFinalizedFilter,
    loading,
    creatingPaymentId,
    createPaymentLink,
    refreshOffers,
  };
};
