import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useMercadoPagoOAuth } from '@/services/external/useMercadoPagoOAuth';
import { testStyles as styles } from '@/styles/app/employee/testStyles';

export default function LinkMpScreen() {
  const {
    status, error, info, busy, authUrl,
    openAuthorization, refreshStatus, waitUntilLinked, loadLocal, clearLocal,
  } = useMercadoPagoOAuth();

  React.useEffect(() => { loadLocal(); }, [loadLocal]);

  const onPressLink = async () => {
    const res = await openAuthorization();
    if (!res.ok) Alert.alert('Mercado Pago', res.error);
  };

  const onPressIAlreadyAuthorized = async () => {
    const linked = await refreshStatus();
    if (!linked) Alert.alert('Mercado Pago', 'Aún no vemos la vinculación. Probá en unos segundos.');
  };

  const onPressAutoWait = async () => {
    const linked = await waitUntilLinked();
    if (!linked) Alert.alert('Mercado Pago', 'No se detectó la vinculación a tiempo (timeout).');
  };

  const onPressClearLocal = async () => { await clearLocal(); };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vincular Mercado Pago</Text>

      <Text style={styles.stateLine}>
        Estado: <Text style={styles.stateStrong}>{status.toUpperCase()}</Text>
      </Text>

      {!!authUrl && <Text style={styles.muted} numberOfLines={1}>Auth URL: {authUrl}</Text>}

      {status === 'opening' && (
        <View style={styles.row}>
          <ActivityIndicator />
          <Text style={styles.rowText}>Abriendo autorización…</Text>
        </View>
      )}

      {status !== 'linked' && status !== 'opening' && (
        <TouchableOpacity style={styles.primaryBtn} onPress={onPressLink}>
          <Text style={styles.primaryText}>Abrir Mercado Pago para vincular</Text>
        </TouchableOpacity>
      )}

      {status === 'waiting' && (
        <View style={styles.card}>
          <Text style={styles.cardText}>
            Cuando termines en Mercado Pago, volvé y confirmá:
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={onPressIAlreadyAuthorized} disabled={busy}>
              {busy ? <ActivityIndicator /> : <Text style={styles.secondaryText}>Ya autoricé</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.ghostBtn} onPress={onPressAutoWait} disabled={busy}>
              <Text style={styles.ghostText}>Esperar automáticamente</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {status === 'linked' && info && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cuenta vinculada</Text>
          <Text style={styles.cardLine}>Usuario: {info.nickname ?? info.email ?? info.mp_user_id}</Text>
          <Text style={styles.cardMuted}>ID: {info.mp_user_id}</Text>

          <TouchableOpacity style={styles.neutralBtn} onPress={onPressClearLocal}>
            <Text style={styles.neutralText}>Olvidar localmente</Text>
          </TouchableOpacity>
        </View>
      )}

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}
