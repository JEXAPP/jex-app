import React, { useMemo, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/themes/colors';
import { IconButton } from '@/components/button/IconButton'; // ajustá el path si varía
import { uploadImagesGridStyles1 as styles } from '@/styles/components/image/uploadImagesGridStyles1';
import { iconos } from '@/constants/iconos';

type UploadableImage = {
  uri: string;
  name: string;
  type: string;
};

type Item = {
  uri: string;                 // siempre hay URI de preview
  file: UploadableImage | null; // null si vino “precargada” por URL
};

type Props = {
  /** Máximo de imágenes permitidas */
  max?: number;                // default 6
  /** Tamaño del thumbnail (cuadrado) en px */
  thumbSize?: number;          // default 96
  /** Forma del thumbnail */
  shape?: 'square' | 'circle'; // default 'square'
  /** Callback principal: arrays alineados (mismo orden/longitud) */
  onChange: (files: (UploadableImage | null)[], uris: string[]) => void;
  /** (Opcional) Callback de compatibilidad con UploadImage: último cambio */
  onChangeLast?: (file: UploadableImage | null, uri: string | null) => void;
  /** Lista inicial de URLs (por ejemplo, ya guardadas en Cloudinary) */
  initialUrls?: string[];
  /** Llamado cuando se intenta superar el límite */
  onLimitReached?: () => void;

  /** Estilos opcionales del contenedor principal */
  containerStyle?: any;
};

export const UploadImagesGrid: React.FC<Props> = ({
  max = 6,
  thumbSize = 96,
  shape = 'square',
  onChange,
  onChangeLast,
  initialUrls = [],
  onLimitReached,
  containerStyle,
}) => {
  const [items, setItems] = useState<Item[]>(
    (initialUrls ?? []).map((u) => ({ uri: u, file: null }))
  );

  const isMax = items.length >= max;

  const borderRadiusStyle = useMemo(
    () => (shape === 'circle' ? { borderRadius: thumbSize } : { borderRadius: 10 }),
    [shape, thumbSize]
  );

  const emitChange = (next: Item[], last?: { file: UploadableImage | null; uri: string | null }) => {
    setItems(next);
    onChange(
      next.map((i) => i.file),
      next.map((i) => i.uri)
    );
    if (onChangeLast) onChangeLast(last?.file ?? null, last?.uri ?? null);
  };

  const pickImage = async () => {
    if (isMax) {
      onLimitReached?.();
      return;
    }

    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],   // si querés no forzar 1:1, cambiá esto
        quality: 0.8,
        // allowsMultipleSelection: false  // agregás 1 por vez
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const name = uri.split('/').pop() || `image-${Date.now()}.jpg`;
        const type = getMimeType(uri);
        const file: UploadableImage = { uri, name, type };

        const next = [...items, { uri, file }];
        emitChange(next, { file, uri });
      }
    } catch (e) {
      console.log('Error al seleccionar imagen:', e);
    }
  };

  const removeAt = (index: number) => {
    const next = items.filter((_, i) => i !== index);
    emitChange(next, { file: null, uri: null });
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Thumbnails existentes */}
      {items.map((it, idx) => (
        <View
          key={`${it.uri}-${idx}`}
          style={[
            styles.thumbWrapper,
            { width: thumbSize, height: thumbSize },
          ]}
        >
          <Image
            source={{ uri: it.uri }}
            style={[styles.thumbImage, { width: thumbSize, height: thumbSize }, borderRadiusStyle]}
            resizeMode="cover"
          />

          {/* Botón eliminar (abajo-izquierda) */}
          <View style={styles.trashBtnWrapper}>
            <IconButton
              onPress={() => removeAt(idx)}
              icon={iconos.trash(14, Colors.gray2)}
              sizeContent={14}
              sizeButton={26}
              backgroundColor="rgba(0,0,0,0.5)"
              styles={{
                button: styles.trashBtn,
                text: styles.trashText,
              }}
              accessibilityLabel={`Eliminar imagen ${idx + 1}`}
            />
          </View>
        </View>
      ))}

      {/* Botón Agregar (se reubica al final del flujo con wrap) */}
      <Pressable
        onPress={pickImage}
        disabled={isMax}
        style={[
          styles.addCard,
          { width: thumbSize, height: thumbSize },
          borderRadiusStyle,
          isMax && styles.addCardDisabled,
        ]}
        accessibilityRole="button"
        accessibilityLabel={isMax ? 'Límite alcanzado' : 'Agregar foto'}
      >
        <Ionicons name="image" size={22} color={Colors.gray3} />
        <Text style={styles.addText}>{isMax ? 'Límite' : 'Agregar foto'}</Text>
      </Pressable>
    </View>
  );
};

function getMimeType(uri: string): string {
  const ext = uri.split('.').pop()?.toLowerCase();
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'heic') return 'image/heic';
  return 'image/jpeg';
}
