import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import useBackendConection from '@/services/useBackendConection';
import { useValidateToken } from '@/services/useValidateToken';

export const useAditionalInfo = () => {
  const router = useRouter();
  const { requestBackend, loading } = useBackendConection();

  const [sobreMi, setSobreMi] = useState('');
  const [intereses, setIntereses] = useState<string[]>(['Música', 'Cine', 'Viajes', 'Lectura', 'Deportes', 'Tecnología', 'Arte']);
  const [interesesSeleccionados, setInteresesSeleccionados] = useState<string[]>([]);
  const [imagenPerfil, setImagenPerfil] = useState<string | null>(null);
  const [showImageOptions, setShowImageOptions] = useState(false);

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
  const handleToggleIntereses = (interes: string) => {
    const yaSeleccionado = interesesSeleccionados.includes(interes);

    if (yaSeleccionado) {
        // Si ya está seleccionado, lo sacamos
        setInteresesSeleccionados(prev => prev.filter(i => i !== interes));
    } else {
        // Si no está seleccionado, verificamos que no haya más de 3
        if (interesesSeleccionados.length >= 3) {
        setErrorMessage('Solo podés seleccionar hasta 3 intereses');
        setShowError(true);
        return;
        }
        // Si hay lugar, lo agregamos
        setInteresesSeleccionados(prev => [...prev, interes]);
    }
  };

//boton omitir (NO SE GUARDA NADA)
  const omitir = () => {
    router.push('/'); // PONER RUTA DE PANTALLA SIGUIENTE
  };

//boton guardar
  const guardar = async () => {
    const payload = {
      aboutMe: sobreMi,
      interests: interesesSeleccionados,
      picture: imagenPerfil 
    }
    const data = await requestBackend('/api/auth/login/jwt/', { payload }); //cambiar ruta
    if (data?.access) {
    
      setShowSuccess(true);
    
      setTimeout(() => {
        setShowSuccess(false);
        router.push('/'); //aca tendria que ir a la pantalla siguiente
      }, 1500);
    
      } else {
        setErrorMessage('Correo o contraseña incorrectos');
        setShowError(true);
      };


    setShowSuccess(true);
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
    eliminarImagen
  };
}
