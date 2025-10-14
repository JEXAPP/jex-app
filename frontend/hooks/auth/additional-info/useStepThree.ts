import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { useMercadoPagoOAuth } from '@/services/external/mercado-pago/useMercadoPagoOAuth';

export const useStepThree = () => {
  const router = useRouter();
  const {
    status, error, info, busy,
    openAuthorization, refreshStatus, loadLocal,
  } = useMercadoPagoOAuth();

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Cargar estado guardado localmente
  useEffect(() => {
    loadLocal();
  }, [loadLocal]);

  // Auto-verificar al enfocar la pantalla (cuando volvés de MP)
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      const check = async () => {
        // Sólo intentamos verificar si no está "linked" aún
        if (status !== 'linked') {
          const ok = await refreshStatus();
          if (cancelled) return;
          if (ok) {
            setTimeout(() => {
              router.replace('/auth/additional-info/step-four');
            }, 1000);
          }
        }
      };

      check();
      return () => { cancelled = true; };
    }, [refreshStatus, status, router])
  );

  // Acción: abrir flujo de autorización
  const vincular = useCallback(async () => {
    const res = await openAuthorization();
    if (!res.ok) {
      setErrorMessage(res.error ?? 'No se pudo abrir Mercado Pago.');
      setShowError(true);
    }
    // Al volver, la verificación automática se dispara por el focus effect
  }, [openAuthorization]);

  // Acción: pedir verificación inmediata (manual)
  const reintentarVerificacion = useCallback(async () => {
    const ok = await refreshStatus();
    if (ok) {
      setTimeout(() => {
        router.replace('/auth/additional-info/step-four');
      }, 1000);
    } else {
      setErrorMessage('Aún no vemos la vinculación. Probá nuevamente en unos segundos.');
      setShowError(true);
    }
  }, [refreshStatus, router]);

  const omitir = () => router.replace('/employee');

  const siguiente = async () => {
    // si ya está vinculado, avanza
    router.replace('/auth/additional-info/step-four');
  };

  const closeError = () => setShowError(false);

  return {
    // estado MP
    status, busy, info, error,

    // nav
    omitir, siguiente,

    // acciones
    vincular, reintentarVerificacion,

    // feedback
    showError, errorMessage, closeError,
  };
};
