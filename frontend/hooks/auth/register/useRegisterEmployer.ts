import useBackendConection from '@/services/internal/useBackendConection';
import { useDataValidation } from '@/services/internal/useDataValidation';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

export const useRegisterEmployer = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();
  const { validateText } = useDataValidation();

  const { phone, google, email, password, gAt, gCode } =
    useLocalSearchParams<{ phone?: string; google?: string; email?: string; password?: string; gAt?: string; gCode?: string }>();
  const desdeGoogle = google === '1';

  const [loading, setLoading] = useState(false);
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [continuarHabilitado, setContinuarHabilitado] = useState(false);

  const validarCampos = () => {
    if (!nombreEmpresa.trim()) { setErrorMessage('El nombre de la Empresa es obligatorio'); setShowError(true); return false; }
    if (!validateText(nombreEmpresa)) { setErrorMessage('El nombre contiene caracteres inválidos'); setShowError(true); return false; }
    if (!phone) { setErrorMessage('Falta el teléfono verificado'); setShowError(true); return false; }
    if (!desdeGoogle && (!email || !password)) { setErrorMessage('Faltan credenciales'); setShowError(true); return false; }
    return true;
  };

  const handleRegistrarEmpleador = async () => {
    if (!validarCampos()) return;
    const registroPrevio: any = { phone };
    if (!desdeGoogle) { registroPrevio.email = email; registroPrevio.password = password; }
    const payload = { company_name: nombreEmpresa, ...registroPrevio };

    setLoading(true);
    try {
      if (desdeGoogle) {
        await requestBackend('/api/auth/register/employer/social/', {
          google_access_token: gAt || undefined,
          google_code: gCode || undefined,
          datosAdicionales: payload,
        }, 'POST');
      } else {
        await requestBackend('/api/auth/register/employer/', payload, 'POST')
        // login automático
        const loginRes = await requestBackend('/api/auth/login/jwt/', { email, password }, 'POST');
        // guardamos tokens *solo* con abstracción (web/nativo)
        const { access, refresh } = loginRes;
        // reutilizamos tokenStorage
        const { setToken } = await import('@/services/internal/useTokenStorage')
        if (access) await setToken('access', access);
        if (refresh) await setToken('refresh', refresh);;
      }
      setLoading(false);
      setShowSuccess(true);
    } catch (err) {
      console.log('Hubo un error al completar el registro:', err);
      setErrorMessage('No se pudo completar el registro');
      setShowError(true);
      setLoading(false);
    }
  };

  const closeSuccess = () => { setShowSuccess(false); router.push('/auth/additional-info/step-employer'); };
  const closeError = () => { setShowError(false); setErrorMessage(''); };

  useEffect(() => { setContinuarHabilitado(nombreEmpresa.length > 0); }, [nombreEmpresa]);

  return {
    nombreEmpresa, setNombreEmpresa,
    continuarHabilitado, handleRegistrarEmpleador,
    showError, errorMessage, showSuccess, closeError, closeSuccess,
    loading, desdeGoogle,
  };
};
