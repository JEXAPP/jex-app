import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, Linking, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { WebView } from 'react-native-webview';
import { Colors } from '@/themes/colors';
import { locationMapCardStyles1 as s } from '@/styles/components/others/locationMapCardStyles1';
import { config } from '@/config'; // { google: { apiKey?: string } }

type Coords = { latitude: number; longitude: number };

type Props = {
  address?: string | null;
  coords?: { latitude: number; longitude: number } | null;
  style?: any;
  zoom?: number;          // << nuevo: controla zoom (default 16 si hay coords, 4 si no)
  staticSize?: string;    // << opcional: tamaño solicitado a Static Maps, default "600x600"
};

export default function LocationMapCard({
  address,
  coords,
  style,
  zoom,
  staticSize = "600x600",
}: Props) {
  const hasCoords = !!coords;
  const query = useMemo(() => {
    if (address?.trim()) return address.trim();
    if (coords) return `${coords.latitude},${coords.longitude}`;
    return `-38.4161,-63.6167`; // Argentina
  }, [address, coords]);

  const resolvedZoom = typeof zoom === 'number'
    ? zoom
    : (hasCoords ? 17 : 4); // << cambia acá el default si querés

  const staticMapUrl = useMemo(() => {
    if (!config?.google?.apiKey) return null;
    const key = config.google.apiKey;
    const center = encodeURIComponent(query);
    const marker = hasCoords ? `&markers=color:red|${encodeURIComponent(query)}` : '';
    return `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=${resolvedZoom}&size=${staticSize}${marker}&scale=2&key=${key}`;
  }, [query, hasCoords, resolvedZoom, staticSize]);

  const embedUrl = useMemo(() => {
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${resolvedZoom}&output=embed`;
  }, [query, resolvedZoom]);

  // URL para abrir la app/website de Google Maps al tocar el mapa
  const openUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  const onPressMap = () => Linking.openURL(openUrl);

  const copyAddress = async () => {
    const text = (address && address.trim()) || (coords ? query : '');
    if (!text) return;
    await Clipboard.setStringAsync(text);
    Alert.alert('Copiado', 'La dirección se copió al portapapeles.');
  };

  const visibleAddress =
    (address && address.trim()) ||
    (coords ? `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}` : 'Ubicación no especificada');

  return (
    <View style={[s.container, style]}>
      {/* Mapa a la izquierda: si hay apiKey -> StaticMap (Image); si no -> WebView embed */}
      <TouchableOpacity activeOpacity={0.9} onPress={onPressMap} style={s.mapWrapper}>
        {staticMapUrl ? (
          <Image source={{ uri: staticMapUrl }} style={s.map} resizeMode="cover" />
        ) : (
          <WebView
            source={{ uri: embedUrl }}
            style={s.map}
            scrollEnabled={false}
            bounces={false}
            javaScriptEnabled
            // el touch lo maneja el TouchableOpacity
          />
        )}
      </TouchableOpacity>

      {/* Card blanca a la derecha: copia al portapapeles */}
      <TouchableOpacity activeOpacity={0.8} onPress={copyAddress} style={s.infoCard}>
        <Ionicons name="location" size={18} color={Colors.violet4} style={s.infoIcon} />
        <Text style={s.infoText} numberOfLines={2}>{visibleAddress}</Text>
      </TouchableOpacity>
    </View>
  );
}
