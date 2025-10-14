import { useMercadoPagoOAuth } from '@/services/external/mercado-pago/useMercadoPagoOAuth';
import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';

export const useLinkMpScreen = () => {
  const {
    status, error, info, busy, authUrl,
    openAuthorization, refreshStatus, waitUntilLinked, loadLocal, clearLocal,
  } = useMercadoPagoOAuth();

  useEffect(() => {
    loadLocal();
  }, [loadLocal]);

  const onPressLink = useCallback(async () => {
    const res = await openAuthorization();
    if (!res.ok) Alert.alert('Mercado Pago', res.error);
  }, [openAuthorization]);

  const onPressIAlreadyAuthorized = useCallback(async () => {
    const linked = await refreshStatus();
    if (!linked) Alert.alert('Mercado Pago', 'Aún no vemos la vinculación. Probá en unos segundos.');
  }, [refreshStatus]);

  const onPressAutoWait = useCallback(async () => {
    const linked = await waitUntilLinked();
    if (!linked) Alert.alert('Mercado Pago', 'No se detectó la vinculación a tiempo (timeout).');
  }, [waitUntilLinked]);

  const onPressClearLocal = useCallback(async () => {
    await clearLocal();
  }, [clearLocal]);

  return {
    // estado
    status,
    error,
    info,
    busy,
    authUrl,

    // acciones
    onPressLink,
    onPressIAlreadyAuthorized,
    onPressAutoWait,
    onPressClearLocal,
  };
};
