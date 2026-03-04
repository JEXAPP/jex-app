// hooks/employee/profile/edit/useEditBasicInfo.ts
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import useBackendConection from "@/services/internal/useBackendConection";
import { useDataValidation } from "@/services/internal/useDataValidation";
import { obtenerCoordenadasDesdeDireccion } from "@/services/external/sugerencias/useGeoRefAr";
import { useUploadImageServ } from "@/services/external/cloudinary/useUploadImage";

type Coords = { lat: number; lng: number } | null;

type UploadableImage = {
  uri: string;
  name: string;
  type: string;
};

const isNonEmpty = (s?: string | null) => !!s && s.trim().length > 0;

const formatearFecha = (f: Date) => {
  const d = String(f.getDate()).padStart(2, "0");
  const m = String(f.getMonth() + 1).padStart(2, "0");
  const y = f.getFullYear();
  return `${d}/${m}/${y}`;
};

const parseBirthDate = (v: string | null | undefined): Date | null => {
  if (!v) return null;

  const ddmmyyyy = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/;

  if (ddmmyyyy.test(v)) {
    const [, d, m, y] = v.match(ddmmyyyy)!;
    return new Date(Number(y), Number(m) - 1, Number(d));
  }

  if (iso.test(v)) {
    const [, y, m, d] = v.match(iso)!;
    return new Date(Number(y), Number(m) - 1, Number(d));
  }

  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

const formatDniPretty = (raw: string | null | undefined): string => {
  if (!raw) return "";
  let limpio = String(raw).replace(/\D/g, "");
  if (limpio.length > 8) limpio = limpio.slice(0, 8);

  let conPuntos = limpio;
  if (limpio.length > 3 && limpio.length <= 6) {
    conPuntos = limpio.slice(0, limpio.length - 3) + "." + limpio.slice(-3);
  } else if (limpio.length > 6) {
    conPuntos =
      limpio.slice(0, limpio.length - 6) +
      "." +
      limpio.slice(limpio.length - 6, limpio.length - 3) +
      "." +
      limpio.slice(-3);
  }
  return conPuntos;
};

export const useEditBasicInfo = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();
  const { validateText, validateAge } = useDataValidation();
  const { uploadImage } = useUploadImageServ();

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<Coords>(null);

  const [aboutMe, setAboutMe] = useState("");
  const [profileImageFile, setProfileImageFile] =
    useState<UploadableImage | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageId, setImageId] = useState<string | null>(null); // <- id viejo

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const [canSave, setCanSave] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const res: any = await requestBackend(
          "/api/auth/employee/view-profile-description/",
          null,
          "GET"
        );

        if (!mounted || !res) return;

        setFirstName(res.first_name ?? "");
        setLastName(res.last_name ?? "");
        setDni(formatDniPretty(res.dni ?? ""));
        setBirthDate(parseBirthDate(res.birth_date));
        setAboutMe(res.description ?? "");

        if (res.address) setAddress(res.address);
        if (res.latitude != null && res.longitude != null) {
          const latNum = Number(res.latitude);
          const lngNum = Number(res.longitude);
          if (!Number.isNaN(latNum) && !Number.isNaN(lngNum)) {
            setCoords({ lat: latNum, lng: lngNum });
          }
        }

        if (res.profile_image_url) {
          setImageUrl(res.profile_image_url);
        }
        if (res.profile_image_id) {
          setImageId(String(res.profile_image_id));
        }
      } catch (e) {
        console.log("Error cargando perfil básico:", e);
        setErrorMessage(
          "Ocurrió un error al cargar tu información. Intentá nuevamente."
        );
        setShowError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const ok =
      isNonEmpty(firstName) &&
      isNonEmpty(lastName) &&
      isNonEmpty(dni) &&
      isNonEmpty(address) &&
      birthDate !== null;

    setCanSave(Boolean(ok));
  }, [firstName, lastName, dni, address, birthDate]);

  const handleAddress = (texto: string, coord: Coords) => {
    setAddress(texto);
    setCoords(coord);
  };

  const handleChangeDni = (text: string) => {
    let limpio = text.replace(/\D/g, "");
    if (limpio.length > 8) limpio = limpio.slice(0, 8);

    let conPuntos = limpio;
    if (limpio.length > 3 && limpio.length <= 6) {
      conPuntos = limpio.slice(0, limpio.length - 3) + "." + limpio.slice(-3);
    } else if (limpio.length > 6) {
      conPuntos =
        limpio.slice(0, limpio.length - 6) +
        "." +
        limpio.slice(limpio.length - 6, limpio.length - 3) +
        "." +
        limpio.slice(-3);
    }
    setDni(conPuntos);
  };

  const validarCampos = (): boolean => {
    if (!isNonEmpty(firstName) || !isNonEmpty(lastName) || !isNonEmpty(address)) {
      setErrorMessage("Nombre, apellido y ubicación son obligatorios.");
      setShowError(true);
      return false;
    }

    if (!validateText(firstName) || !validateText(lastName)) {
      setErrorMessage("Nombre o Apellido contienen caracteres inválidos.");
      setShowError(true);
      return false;
    }

    const dniNum = dni.replace(/\D/g, "");
    if (!dniNum || dniNum.length < 7) {
      setErrorMessage("El DNI no es válido.");
      setShowError(true);
      return false;
    }

    if (!birthDate) {
      setErrorMessage("Debés seleccionar tu fecha de nacimiento.");
      setShowError(true);
      return false;
    }

    if (!validateAge(birthDate)) {
      setErrorMessage("Debés tener al menos 16 años.");
      setShowError(true);
      return false;
    }

    return true;
  };

  const saveAll = async (): Promise<boolean> => {
    if (!validarCampos()) return false;

    setSaving(true);

    try {
      let lat = coords?.lat ?? null;
      let lng = coords?.lng ?? null;

      if ((!lat || !lng) && isNonEmpty(address)) {
        try {
          const { lat: lat2, lon: lon2 } = await obtenerCoordenadasDesdeDireccion({
            canonical: address,
          });
          lat = lat2 ?? null;
          lng = lon2 ?? null;
        } catch (e) {
          console.log("Error buscando coordenadas:", e);
        }
      }

      const dniNum = dni.replace(/\./g, "");

      const payload: any = {
        description: aboutMe.trim() !== "" ? aboutMe.trim() : null,
        birth_date: formatearFecha(birthDate!),
        address: address.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        profile_image_url: imageUrl,
        profile_image_id: imageId, // <- si no subís nueva, va el id viejo

        // extras que ya mandabas
        dni: dniNum,
        latitude: lat,
        longitude: lng,
      };

      // si el usuario cambió la foto, subimos y pisamos url + id
      if (profileImageFile) {
        const upload: any = await uploadImage(
          profileImageFile.uri,
          "user-profiles-images"
        );
        payload.profile_image_url =
          upload?.image_url ?? upload?.secure_url ?? upload?.url ?? null;
        payload.profile_image_id =
          upload?.image_id ?? upload?.public_id ?? null;
      }

      await requestBackend(
        "/api/auth/employee/profile-description/",
        payload,
        "PUT"
      );

      setShowSuccess(true);
      return true;
    } catch (e) {
      console.log("Error guardando información básica:", e);
      setErrorMessage(
        "Ocurrió un error al guardar tus datos. Intentá nuevamente."
      );
      setShowError(true);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  const closeError = () => {
    setShowError(false);
    setErrorMessage("");
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    router.back();
  };

  return {
    firstName,
    lastName,
    dni,
    birthDate,
    address,
    aboutMe,
    setFirstName,
    setLastName,
    handleChangeDni,
    setBirthDate,
    handleAddress,
    setAboutMe,
    setProfileImageFile,
    imageUrl,

    loading,
    saving,
    canSave,

    goBack,
    saveAll,

    showError,
    errorMessage,
    closeError,
    showSuccess,
    closeSuccess,
  };
};
