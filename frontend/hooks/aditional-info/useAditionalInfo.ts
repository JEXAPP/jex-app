import useBackendConection from '@/services/useBackendConection';
import { useValidateToken } from '@/services/useValidateToken';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

type Interest = {id: number, name: string}

export const useAditionalInfo = () => {
  const router = useRouter();
  const { requestBackend, loading } = useBackendConection();

  const [sobreMi, setSobreMi] = useState('');
  const [intereses, setIntereses] = useState<Interest[]>([]);
  const [interesesSeleccionados, setInteresesSeleccionados] = useState<number[]>([]);
  const [imagenPerfil, setImagenPerfil] = useState<string | null>(null);
  const [showClickWindow, setShowClickWindow] = useState(false);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useValidateToken()

//foto de perfil
  const eliminarImagen = () => {
    setImagenPerfil(null);
};
  const seleccionarImagen = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // cuadrado
        quality: 0.8,
      });

      if (!result.canceled) {
        setImagenPerfil(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error al seleccionar imagen:', error);
    }
};

//intereses
  useEffect(() => {
  const fetchIntereses = async () => {
  const data = await requestBackend('/api/vacancies/job-types/', null, 'GET'); // Cambiá la ruta si es distinta
  console.log('Respuesta del backend de intereses:', data); 
  if (data) {
    setIntereses(data);
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
    router.push('/employee'); // PONER RUTA DE PANTALLA SIGUIENTE
  };

//boton guardar
  const guardar = async () => {
    if (!sobreMi.trim() && interesesSeleccionados.length === 0) {
      setShowClickWindow(true);
      return;
    }
    const payload = {
      description: sobreMi,
      job_types: interesesSeleccionados,
      profile_image_url: null,
      profile_image_id: null
    };

    console.log('Payload a enviar al backend:', payload);

    const data = await requestBackend('/api/auth/employee/additional-info/', payload, 'PUT');
   
    if (data === 'Ok') {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push('/employee');
      }, 1500);
    } else {
      setErrorMessage('Ocurrió un error al guardar los datos');
      setShowError(true);
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
    seleccionarImagen,
    imagenPerfil,
    eliminarImagen,
    showClickWindow,
    setShowClickWindow
  };
}
