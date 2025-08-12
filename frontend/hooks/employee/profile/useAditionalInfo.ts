import { useUploadImageServ } from '@/services/external/useUploadImage';
import useBackendConection from '@/services/internal/useBackendConection';
import { useTokenValidations } from '@/services/internal/useTokenValidations';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

type Interest = {id: number, name: string}

type AdditionalInfoPayload = {
  job_types: number[];
  description: string | null;
  profile_image_url: string | null;
  profile_image_id: string | null;
};

type UploadableImage = {
  uri: string;
  name: string;
  type: string;
};

export const useAditionalInfo = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection(); 
  const [loading, setLoading] = useState(false);
  const [imagenFile, setImagenFile] = useState<UploadableImage | null>(null);
  const { validateToken } = useTokenValidations()
  const [sobreMi, setSobreMi] = useState('');
  const [intereses, setIntereses] = useState<Interest[]>([]);
  const [interesesSeleccionados, setInteresesSeleccionados] = useState<number[]>([]);
  const [imagenPerfil, setImagenPerfil] = useState<string | null>(null);
  const [showClickWindow, setShowClickWindow] = useState(false);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const { uploadImage } = useUploadImageServ();

  useEffect(() => {
    const fetchIntereses = async () => {
      setLoading(true);
      try {
        await validateToken('employee');
        const data = await requestBackend('/api/vacancies/job-types/', null, 'GET');
        if (data) {
          setIntereses(data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchIntereses();
  }, []);

  const handleToggleIntereses = (id: number) => {
    
    const yaSeleccionado = interesesSeleccionados.includes(id);

    if (yaSeleccionado) {
        // Si ya está seleccionado, lo sacamos
        setInteresesSeleccionados(prev => prev.filter(i => i !== id));
    } else {
        // Si no está seleccionado, verificamos que no haya más de 3
        if (interesesSeleccionados.length >= 3) {
        setErrorMessage('Solo podés seleccionar hasta 3 intereses');
        setShowError(true);
        return;
        }
        // Si hay lugar, lo agregamos
        setInteresesSeleccionados(prev => [...prev, id]);
    }
  };

  //boton omitir (NO SE GUARDA NADA)
  const omitir = () => {
    router.replace('/employee'); // PONER RUTA DE PANTALLA SIGUIENTE
  };

  //boton guardar
  const guardar = async () => {
    if (!sobreMi.trim() && interesesSeleccionados.length === 0) {
      setShowClickWindow(true);
      return;
    }

    const payload: AdditionalInfoPayload = {
      job_types: interesesSeleccionados,
      description: sobreMi.trim() !== '' ? sobreMi : null,
      profile_image_url: null,
      profile_image_id: null,
    };

    setLoading(true);

    try {

      if (imagenFile) {
        const upload = await uploadImage(imagenFile.uri);
        payload.profile_image_url = upload.image_url;
        payload.profile_image_id = upload.image_id;
      }

      await requestBackend('/api/auth/employee/additional-info/', payload, 'PUT');
  
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.replace('/employee');
      }, 1500);

    } catch (err) {

      console.log(err)
      setErrorMessage('Ocurrió un error al subir la imagen o guardar los datos');
      setShowError(true);

    } finally {

      setLoading(false);
    }
  };
    
  const closeError = () => setShowError(false);
  const closeSuccess = () => setShowSuccess(false);

  return {
    sobreMi,
    setSobreMi,
    intereses,
    interesesSeleccionados,
    guardar,
    handleToggleIntereses,
    showError,
    omitir,
    errorMessage,
    showSuccess,
    closeError,
    closeSuccess,
    imagenPerfil,
    showClickWindow,
    setShowClickWindow,
    setImagenFile,
    setImagenPerfil,
    loading
  };
}
