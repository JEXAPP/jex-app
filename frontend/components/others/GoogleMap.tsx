import React, { useMemo, useRef } from 'react';
import { View, Platform, Linking, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { googleMapStyles1 as s } from '@/styles/components/others/googleMapStyles1';

type Coords = { latitude: number; longitude: number };
type Props = {
  /** Coordenadas del evento (recomendado para render y deep-link) */
  coords?: Coords | null;
  /** Dirección legible (fallback para deep-link si no hay coords) */
  addressLabel?: string;
  /** Texto del pin */
  markerTitle?: string;
  /** Alto del mapa */
  height?: number; // default 180
  /** Radio del zoom inicial (en grados aprox) */
  delta?: number; // default 0.005
  /** Borde redondeado */
  borderRadius?: number; // default 12
  /** Deshabilitar gestos (mini-mapa clickeable) */
  interactive?: boolean; // default false
};

const buildRegion = (c: Coords, delta: number): Region => ({
  latitude: c.latitude,
  longitude: c.longitude,
  latitudeDelta: delta,
  longitudeDelta: delta,
});

const openExternalMaps = async (coords?: Coords | null, addressLabel?: string) => {
  try {
    let url = '';

    if (coords) {
      const { latitude, longitude } = coords;
      // URL universal de Google Maps (abre app si está, o navegador)
      url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      if (addressLabel) {
        url += `&query_place_id=&query=${encodeURIComponent(addressLabel)}%20(${latitude},${longitude})`;
      }
    } else if (addressLabel) {
      // Sin coords, solo con dirección
      const q = encodeURIComponent(addressLabel);
      url = `https://www.google.com/maps/search/?api=1&query=${q}`;
    } else {
      Alert.alert('Ubicación no disponible');
      return;
    }

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
      return;
    }

    // Fallback por plataforma (raro necesitarlo, pero por las dudas)
    if (coords) {
      const { latitude, longitude } = coords;
      if (Platform.OS === 'ios') {
        await Linking.openURL(`http://maps.apple.com/?ll=${latitude},${longitude}`);
      } else {
        await Linking.openURL(`geo:${latitude},${longitude}?q=${latitude},${longitude}`);
      }
    } else if (addressLabel) {
      if (Platform.OS === 'ios') {
        await Linking.openURL(`http://maps.apple.com/?q=${encodeURIComponent(addressLabel)}`);
      } else {
        await Linking.openURL(`geo:0,0?q=${encodeURIComponent(addressLabel)}`);
      }
    }
  } catch (e) {
    Alert.alert('No se pudo abrir el mapa');
  }
};

export default function GoogleMap({
  coords,
  addressLabel,
  markerTitle = 'Ubicación del evento',
  height = 180,
  delta = 0.005,
  borderRadius = 12,
  interactive = false,
}: Props) {
  const mapRef = useRef<MapView | null>(null);

  const region = useMemo(() => {
    if (!coords) return undefined;
    return buildRegion(coords, delta);
  }, [coords, delta]);

  return (
    <View style={[s.container, { height, borderRadius }]}>
      <MapView
        ref={(r) => (mapRef.current = r)}
        style={s.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        // UI/gestos (mini-mapa por defecto)
        scrollEnabled={interactive}
        zoomEnabled={interactive}
        rotateEnabled={interactive}
        pitchEnabled={interactive}
        toolbarEnabled={false}
        // visual
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        pointerEvents={interactive ? 'auto' : 'none'}
      >
        {coords && (
          <Marker
            coordinate={coords}
            title={markerTitle}
            description={addressLabel}
          />
        )}
      </MapView>

      {/* Overlay para capturar el tap y abrir Google/Apple Maps */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => openExternalMaps(coords, addressLabel)}
        style={s.tapCatcher}
      />
    </View>
  );
}
