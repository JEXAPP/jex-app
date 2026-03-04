// hooks/employer/profile/edit/useEditEmployerBasicInfo.ts
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import useBackendConection from "@/services/internal/useBackendConection";
import { useUploadImageServ } from "@/services/external/cloudinary/useUploadImage";

type UploadableImage = {
  uri: string;
  name: string;
  type: string;
};

const isNonEmpty = (s?: string | null) => !!s && s.trim().length > 0;

export const useEditEmployerBasicInfo = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();
  const { uploadImage } = useUploadImageServ();

  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] =
    useState<UploadableImage | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [canSave, setCanSave] = useState<boolean>(false);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Cargar info inicial del empleador
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const res: any = await requestBackend(
          "/api/auth/employer/view-profile-description/",
          null,
          "GET"
        );

        if (!mounted || !res) return;

        setCompanyName(res.company_name ?? "");
        setDescription(res.description ?? "");

        if (res.profile_image_url) {
          setImageUrl(res.profile_image_url);
        }
        if (res.profile_image_id) {
          setImageId(String(res.profile_image_id));
        }
      } catch (e) {
        console.log("Error cargando perfil de empleador:", e);
        setErrorMessage(
          "Ocurrió un error al cargar los datos del empleador. Intentá nuevamente."
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

  // habilitar botón guardar
  useEffect(() => {
    setCanSave(isNonEmpty(companyName));
  }, [companyName]);

  const validarCampos = (): boolean => {
    if (!isNonEmpty(companyName)) {
      setErrorMessage("El nombre de la empresa es obligatorio.");
      setShowError(true);
      return false;
    }
    return true;
  };

  const saveAll = async (): Promise<boolean> => {
    if (!validarCampos()) return false;

    setSaving(true);

    try {
      const payload: any = {
        company_name: companyName.trim(),
        description: description.trim() !== "" ? description.trim() : null,
        profile_image_url: imageUrl,
        profile_image_id: imageId,
      };

      if (profileImageFile) {
        const upload: any = await uploadImage(
          profileImageFile.uri,
          "user-profiles-images" // o carpeta específica para empleadores si la tenés
        );
        payload.profile_image_url =
          upload?.image_url ?? upload?.secure_url ?? upload?.url ?? null;
        payload.profile_image_id =
          upload?.image_id ?? upload?.public_id ?? null;
      }

      await requestBackend(
        "/api/auth/employer/update-profile-description/",
        payload,
        "PUT"
      );

      setShowSuccess(true);
      return true;
    } catch (e) {
      console.log("Error guardando perfil de empleador:", e);
      setErrorMessage(
        "Ocurrió un error al guardar los cambios. Intentá nuevamente."
      );
      setShowError(true);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const goBack = () => {
    router.push('/employer/profile/view-profile');
  };

  const closeError = () => {
    setShowError(false);
    setErrorMessage("");
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    router.push('/employer/profile');
  };

  return {
    companyName,
    description,
    setCompanyName,
    setDescription,
    imageUrl,
    setProfileImageFile,

    loading,
    saving,
    canSave,

    saveAll,
    goBack,

    showError,
    errorMessage,
    closeError,
    showSuccess,
    closeSuccess,
  };
};
