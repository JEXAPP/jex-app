import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import useBackendConection from "@/services/internal/useBackendConection";

export const useChangePasswordOne = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();

  const [emailMasked, setEmailMasked] = useState<string | null>(null);
  const [phoneMasked, setPhoneMasked] = useState<string | null>(null);

  const [realEmail, setRealEmail] = useState<string | null>(null);
  const [realPhone, setRealPhone] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  const maskEmail = (email: string) => {
    const [local, domain] = email.split("@");
    const domainParts = domain.split(".");
    const domainName = domainParts[0];
    const extension = domainParts.slice(1).join(".");

    const maskedLocal =
      local.length > 2 ? local[0] + "***" + local[local.length - 1] : local[0] + "*";

    const maskedDomain =
      domainName.length > 2
        ? domainName[0] + "***" + domainName[domainName.length - 1]
        : domainName[0] + "*";

    return `${maskedLocal}@${maskedDomain}.${extension}`;
  };

  const maskPhone = (phone: string) => {
    const clean = phone.replace("+54", "");
    if (clean.length <= 4) return clean;
    return clean.slice(0, 3) + "*****" + clean.slice(-2);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await requestBackend("/api/auth/view-mail-and-phone/", null, "GET");

        if (data?.email) {
          setRealEmail(data.email);
          setEmailMasked(maskEmail(data.email));
        }

        if (data?.phone) {
          setRealPhone(data.phone);
          setPhoneMasked(maskPhone(data.phone));
        }
      } catch (e: any) {
        console.warn("Error obteniendo mail y teléfono:", e.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const goToEmailValidation = () => {
    router.push(
      "/employee/profile/settings/change-password-two?method=mail"
    );
  };

  const goToSmsValidation = () => {
    if (!realPhone) {
      console.warn("No hay teléfono disponible");
      return;
    }

    const query = new URLSearchParams({
      method: "sms",
      phone: realPhone,
    }).toString();

    router.push(`/employee/profile/settings/change-password-two?${query}`);
  };

  return {
    loading,
    emailMasked,
    phoneMasked,
    goToEmailValidation,
    goToSmsValidation,
  };
};
