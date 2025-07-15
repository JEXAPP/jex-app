import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

// Lista de códigos de área válidos de Argentina
const codigosValidos = [
  '11', '221', '223', '261', '264', '266', '280', '291', '294', '297',
  '341', '342', '343', '345', '351', '358', '362', '370', '376', '379',
  '381', '383', '385', '387', '388'
];

export const useRegistroTelefono = (desdeGoogle = false) => {
  const router = useRouter();

  const [codigoArea, setCodigoArea] = useState('');
  const [telefono, setTelefono] = useState('');
  const [continuarHabilitado, setContinuarHabilitado] = useState(false);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Nuevo estado para controlar el modal de éxito
  const [showSuccess, setShowSuccess] = useState(false);

  const handleTelefonoChange = (value: string) => {
    const limpio = value.replace(/[^0-9]/g, '');
    if (limpio.length <= 7) {
      const conGuion = limpio.length > 3 ? limpio.slice(0, 3) + '-' + limpio.slice(3) : limpio;
      setTelefono(conGuion);
    }
  };

  const normalizarCodigo = (codigo: string) => {
    return codigo.replace(/^0+/, ''); // Elimina ceros a la izquierda
  };

  const handleContinue = async () => {
    const telefonoLimpio = telefono.replace('-', '');
    const codigoNormalizado = normalizarCodigo(codigoArea);
    const codigoValido = codigosValidos.includes(codigoNormalizado);

    if (codigoArea.length < 1) {
      setErrorMessage('Debés ingresar un código de área');
      setShowError(true);
      return;
    }

    if (!codigoValido) {
      setErrorMessage('Código de Área no válido');
      setShowError(true);
      return;
    }

    if (telefonoLimpio.length < 7) {
      setErrorMessage('El número de teléfono debe tener al menos 7 dígitos');
      setShowError(true);
      return;
    }

    try {
      /*
      const telefonoCompleto = `${codigoNormalizado}${telefonoLimpio}`;
      const response = await fetch('https://tu-backend.com/api/enviar-sms-registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telefono: telefonoCompleto }),
      });

      if (!response.ok) {
        throw new Error('No se pudo enviar el SMS');
      }

      const { token } = await response.json();
      await SecureStore.setItemAsync('registro-token', token);

      const datosParciales = { telefono: telefonoCompleto };
      await SecureStore.setItemAsync('registro-parcial', JSON.stringify(datosParciales));
      */

      // Mostrar modal de éxito antes de navegar
      setShowSuccess(true);

      // Esperar un poco para que el usuario vea el modal
      setTimeout(() => {
        setShowSuccess(false);
        router.push('/registro/mail-contrasenia');
      }, 1500);

    } catch (error: any) {
      console.log('Error al enviar SMS:', error);
      setErrorMessage(error.message || 'Ocurrió un error inesperado');
      setShowError(true);
    }
  };

  const closeError = () => {
    setErrorMessage('');
    setShowError(false);
  };

  // Nuevo método para cerrar modal éxito (si querés cerrarlo manualmente)
  const closeSuccess = () => {
    setShowSuccess(false);
  };

  useEffect(() => {
    const telefonoLimpio = telefono.replace('-', '');
    const habilitado = codigoArea.length > 0 && telefonoLimpio.length >= 7;
    setContinuarHabilitado(habilitado);
  }, [codigoArea, telefono]);

  return {
    codigoArea,
    setCodigoArea,
    telefono,
    setTelefono: handleTelefonoChange,
    desdeGoogle,
    continuarHabilitado,
    handleContinue,
    showError,
    errorMessage,
    closeError,
    showSuccess,      
    closeSuccess      
  };
};