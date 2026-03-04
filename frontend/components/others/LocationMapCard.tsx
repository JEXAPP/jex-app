import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Linking, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { WebView } from 'react-native-webview';

import { Colors } from '@/themes/colors';
import { locationMapCardStyles1 as s } from '@/styles/components/others/locationMapCardStyles1';
import { config } from '@/config';
import { ClickWindow } from '@/components/window/ClickWindow';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';

type Coords = { latitude: number; longitude: number };

type Props = {
  address?: string | null;
  coords?: Coords | null;
  style?: any;
  zoom?: number;
  staticSize?: string;
};

const CUSTOM_MARKER_ICON = "https://tudominio.com/icons/jex-pin-96.png";

const formatAddress = (raw?: string | null) => {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;

  const parts = trimmed.split(',').map(p => p.trim()).filter(Boolean);
  if (parts.length >= 3) parts.pop(); // país afuera

  return parts.join(', ');
};

export default function LocationMapCard({
  address,
  coords,
  style,
  zoom,
  staticSize = '600x600',
}: Props) {

  const [modalVisible, setModalVisible] = useState(false);

  const formattedAddress = useMemo(
    () => formatAddress(address),
    [address]
  );

  const mapQuery = useMemo(() => {
    if (formattedAddress) return formattedAddress;
    if (coords) return `${coords.latitude},${coords.longitude}`;
    return "-38.4161,-63.6167";
  }, [formattedAddress, coords]);

  const resolvedZoom = typeof zoom === "number"
    ? zoom
    : (formattedAddress || coords ? 18 : 4);

  const staticMapUrl = useMemo(() => {
    if (!config?.google?.apiKey) return null;

    const key = config.google.apiKey;
    const center = encodeURIComponent(mapQuery);

    const marker = `&markers=icon:${encodeURIComponent(CUSTOM_MARKER_ICON)}|${encodeURIComponent(mapQuery)}`;

    return `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=${resolvedZoom}&size=${staticSize}${marker}&scale=2&key=${key}`;
  }, [mapQuery, resolvedZoom, staticSize]);

  const embedUrl = useMemo(() =>
    `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=${resolvedZoom}&output=embed`,
    [mapQuery, resolvedZoom]
  );

  const openUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  const onPressMap = () => Linking.openURL(openUrl);

  const copyAddress = async () => {
    const text = formattedAddress || (coords ? mapQuery : '');
    if (!text) return;

    await Clipboard.setStringAsync(text);

    // 🔥 Mostrar tu modal en vez del alert
    setModalVisible(true);
  };

  const visibleAddress =
    formattedAddress ||
    (coords ? `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}` : "Ubicación no especificada");

  return (
    <>
      <View style={[s.container, style]}>

        {/* MAPA */}
        <TouchableOpacity onPress={onPressMap} style={s.mapWrapper} activeOpacity={0.9}>
          {staticMapUrl ? (
            <Image source={{ uri: staticMapUrl }} style={s.map} resizeMode="cover" />
          ) : (
            <WebView
              source={{ uri: embedUrl }}
              style={s.map}
              scrollEnabled={false}
              bounces={false}
              javaScriptEnabled
            />
          )}
        </TouchableOpacity>

        {/* CARD DE TEXTO */}
        <TouchableOpacity onPress={copyAddress} style={s.infoCard} activeOpacity={0.8}>
          <Ionicons name="location" size={18} color={Colors.violet4} style={s.infoIcon} />
          <Text style={s.infoText} numberOfLines={2}>{visibleAddress}</Text>
        </TouchableOpacity>
      </View>

      {/* 🔥 CLICKWINDOW PARA MOSTRAR “COPIADO” */}
      <ClickWindow
        visible={modalVisible}
        title="Copiado"
        message="La dirección fue copiada al portapapeles."
        buttonText="Aceptar"
        onClose={() => setModalVisible(false)}
        styles={clickWindowStyles1}     // <<--- tus estilos
      />
    </>
  );
}
