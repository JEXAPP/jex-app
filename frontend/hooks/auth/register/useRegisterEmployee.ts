import useBackendConection from '@/services/internal/useBackendConection';
import { useDataValidation } from '@/services/internal/useDataValidation';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

export const useRegisterEmployee = () => {
  const router = useRouter();
  const { validateText, validateAge } = useDataValidation();
  const { requestBackend } = useBackendConection();
  const [loading, setLoading] = useState(false);

  const { phone, google, email, password, gAt, gCode } =
    useLocalSearchParams<{ phone?: string; google?: string; email?: string; password?: string; gAt?: string; gCode?: string }>();

  const desdeGoogle = google === '1';

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState<Date | null>(null);
  const [ubicacion, setUbicacion] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [continuarHabilitado, setContinuarHabilitado] = useState(false);

  const handleUbicacion = (texto: string, coord: {lat: number, lng: number}) => { setUbicacion(texto); setCoords(coord); };

  const formatearFecha = (f: Date) => {
    const d = String(f.getDate()).padStart(2, '0');
    const m = String(f.getMonth() + 1).padStart(2, '0');
    const y = f.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const handleChangeDni = (text: string) => {
    let limpio = text.replace(/\D/g, '');
    if (limpio.length > 8) limpio = limpio.slice(0, 8);
    let conPuntos = limpio;
    if (limpio.length > 3 && limpio.length <= 6) conPuntos = limpio.slice(0, limpio.length - 3) + '.' + limpio.slice(-3);
    else if (limpio.length > 6) conPuntos = limpio.slice(0, limpio.length - 6) + '.' + limpio.slice(limpio.length - 6, limpio.length - 3) + '.' + limpio.slice(-3);
    setDni(conPuntos);
  };

  useEffect(() => {
    const habilitado = nombre && apellido && dni && ubicacion && fechaNacimiento != null;
    setContinuarHabilitado(Boolean(habilitado));
  }, [nombre, apellido, dni, ubicacion, fechaNacimiento]);

  const validarCampos = () => {
    if (!nombre || !apellido || !ubicacion) { setErrorMessage('Todos los campos son obligatorios'); setShowError(true); return false; }
    if (!validateText(nombre) || !validateText(apellido)) { setErrorMessage('Nombre o Apellido contienen caracteres inválidos'); setShowError(true); return false; }
    if (!dni || dni.replace(/\D/g, '').length < 7) { setErrorMessage('El DNI no es válido'); setShowError(true); return false; }
    if (!fechaNacimiento) { setErrorMessage('Debés seleccionar tu fecha de nacimiento'); setShowError(true); return false; }
    if (!validateAge(fechaNacimiento)) { setErrorMessage('Debés tener al menos 16 años para registrarte'); setShowError(true); return false; }
    if (!phone) { setErrorMessage('Falta el teléfono verificado'); setShowError(true); return false; }
    return true;
  };

  const handleRegistrarEmpleado = async () => {
    if (!validarCampos()) return;

    const registroPrevio: any = { phone };
    if (!desdeGoogle) {
      if (!email || !password) {
        setErrorMessage('Faltan credenciales'); setShowError(true); return;
      }
      registroPrevio.email = email;
      registroPrevio.password = password;
    }

    const payload = {
      first_name: nombre,
      last_name: apellido,
      address: ubicacion,
      latitude: coords?.lat,
      longitude: coords?.lng,
      dni: dni.replace(/\./g, ''),
      birth_date: formatearFecha(fechaNacimiento!),
      ...registroPrevio,
    };

    setLoading(true);
    try {
      if (!desdeGoogle) {
        await requestBackend('/api/auth/register/employee/', payload, 'POST');
        // login automático
        const loginRes = await requestBackend('/api/auth/login/jwt/', { email, password }, 'POST');
        // guardamos tokens *solo* con abstracción (web/nativo)
        const { access, refresh } = loginRes;
        // reutilizamos tokenStorage
        const { setToken } = await import('@/services/internal/useTokenStorage')
        if (access) await setToken('access', access);
        if (refresh) await setToken('refresh', refresh);
      } else {
        // Registro por Google; enviamos el access de Google o el code si lo tuvimos
        await requestBackend('/api/auth/register/employee/social/', {
          google_access_token: gAt || undefined,
          google_code: gCode || undefined,
          datosAdicionales: payload,
        }, 'POST');
      }

      setLoading(false);
      setShowSuccess(true);
    } catch (error: any) {
      setLoading(false);
      const mensaje = error?.response?.data?.message || 'No se pudo completar el registro';
      setErrorMessage(mensaje);
      setShowError(true);
    }
  };

  const closeSuccess = () => { setShowSuccess(false); router.push('/employee/profile/aditional-info'); };
  const closeError = () => { setShowError(false); setErrorMessage(''); };

  return {
    nombre, apellido, continuarHabilitado, loading,
    setNombre, setApellido, handleRegistrarEmpleado,
    showError, errorMessage, showSuccess, closeError, closeSuccess,
    dni, fechaNacimiento, handleChangeDni, setFechaNacimiento,
    ubicacion, handleUbicacion,
    desdeGoogle,
  };
};
