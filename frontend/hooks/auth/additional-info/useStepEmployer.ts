import { useRouter } from 'expo-router';
import { useState } from 'react';

import { useUploadImageServ } from '@/services/external/cloudinary/useUploadImage';
import useBackendConection from '@/services/internal/useBackendConection';
import { useTokenValidations } from '@/services/internal/useTokenValidations';

type AdditionalInfoPayload = {
  description: string | null;
  profile_image_url: string | null;
  profile_image_id: string | null;
};

type UploadableImage = {
  uri: string;
  name: string;
  type: string;
};

export const useStepEmployer = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();
  const { validateToken } = useTokenValidations();
  const { uploadImage } = useUploadImageServ();

  const [sobreMi, setSobreMi] = useState('');
  const [imagenPerfil, setImagenPerfil] = useState<string | null>(null);
  const [imagenFile, setImagenFile] = useState<UploadableImage | null>(null);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const omitir = () => {
    router.replace('/employer');
  };

  const siguiente = async () => {

    const payload: AdditionalInfoPayload = {
      description: sobreMi.trim() !== '' ? sobreMi.trim() : null,
      profile_image_url: null,
      profile_image_id: null,
    };

    try {
      await validateToken('employer');

      if (imagenFile) {
        const upload = await uploadImage(imagenFile.uri, 'user-profiles-images')
        payload.profile_image_url = upload.image_url;
        payload.profile_image_id = upload.image_id;
      }

      await requestBackend('/api/auth/employer/profile-description/', payload, 'PUT');

      router.replace('/employer');

    } catch (err) {
      console.log(err);
      setErrorMessage('Ocurrió un error al guardar tu perfil. Intentá nuevamente.');
      setShowError(true);
    } 
  };

  const closeError = () => setShowError(false);

  return {
    // state
    sobreMi,
    setSobreMi,
    imagenPerfil,
    setImagenPerfil,
    setImagenFile,

    // nav / actions
    omitir,
    siguiente,

    // ventanas
    showError,
    errorMessage,
    closeError,
  };
};
