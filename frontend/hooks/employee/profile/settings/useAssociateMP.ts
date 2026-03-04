import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { useMercadoPagoOAuth } from '@/services/external/mercado-pago/useMercadoPagoOAuth';
import useBackendConection from '@/services/internal/useBackendConection';

export const useAssociateMP = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();

  const {
    status,
    error,
    info,
    busy,
    openAuthorization,
    refreshStatus,
    loadLocal,
  } = useMercadoPagoOAuth();

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasAccount, setHasAccount] = useState<boolean | null>(null);

  useEffect(() => {
    loadLocal();
  }, [loadLocal]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      const check = async () => {
        try {
          const resp = await requestBackend(
            '/api/payments/mercadopago/associated/',
            null,
            'GET'
          );

          if (cancelled) return;

          if (resp && typeof resp.has_account === 'boolean') {
            setHasAccount(resp.has_account);
          } else {
            setHasAccount(false);
          }

          if (resp?.has_account) {
            return;
          }
        } catch (e: any) {
          console.warn('Error verificando asociación MP:', e.message);
          setHasAccount(false);
        }

        if (status !== 'linked') {
          const ok = await refreshStatus();
          if (cancelled) return;
          if (ok) {
            setTimeout(() => {
              router.replace('/employee/profile');
            }, 1000);
          }
        }
      };

      check();

      return () => {
        cancelled = true;
      };
    }, [requestBackend, refreshStatus, status, router])
  );

  const vincular = useCallback(async () => {
    const res = await openAuthorization();
    if (!res.ok) {
      setErrorMessage(res.error ?? 'No se pudo abrir Mercado Pago.');
      setShowError(true);
    }
  }, [openAuthorization]);

  const closeError = () => setShowError(false);

  const isAssociated = status === 'linked' || hasAccount === true;

  return {
    status,
    busy,
    info,
    error,
    isAssociated,
    vincular,
    showError,
    errorMessage,
    closeError,
  };
};
