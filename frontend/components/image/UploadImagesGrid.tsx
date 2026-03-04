import React, { useMemo, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/themes/colors';
import { IconButton } from '@/components/button/IconButton';
import { uploadImagesGridStyles1 as styles } from '@/styles/components/image/uploadImagesGridStyles1';
import { iconos } from '@/constants/iconos';

export type UploadableImage = {
  uri: string;
  name: string;
  type: string;
};

type Item = {
  uri: string;                      // siempre hay URI de preview
  file: UploadableImage | null;     // null si vino “precargada” por URL
  existingId?: string | number | null; // id del backend si es imagen vieja
};

type ExistingImage = {
  id: string | number;
  url: string;
};

type Props = {
  max?: number;
  thumbSize?: number;
  shape?: 'square' | 'circle';

  /**
   * Callback principal:
   * - files: solo las nuevas tienen UploadableImage, las viejas vienen como null
   * - uris: todas las URIs actuales (viejas + nuevas)
   * - existingIds: ids de backend alineados al array (null si es nueva)
   */
  onChange: (
    files: (UploadableImage | null)[],
    uris: string[],
    existingIds?: (string | number | null)[]
  ) => void;

  onChangeLast?: (file: UploadableImage | null, uri: string | null) => void;

  /** Compatibilidad: solo URLs iniciales sin id */
  initialUrls?: string[];

  /** Imágenes iniciales con id+url traídas del backend */
  initialExisting?: ExistingImage[];

  onLimitReached?: () => void;
  containerStyle?: any;
};

export const UploadImagesGrid: React.FC<Props> = ({
  max = 6,
  thumbSize = 96,
  shape = 'square',
  onChange,
  onChangeLast,
  initialUrls = [],
  initialExisting = [],
  onLimitReached,
  containerStyle,
}) => {
  const [items, setItems] = useState<Item[]>(() => {
    if (initialExisting && initialExisting.length > 0) {
      return initialExisting.map((img) => ({
        uri: img.url,
        file: null,
        existingId: img.id,
      }));
    }
    return (initialUrls ?? []).map((u) => ({
      uri: u,
      file: null,
      existingId: null,
    }));
  });

  const isMax = items.length >= max;

  const borderRadiusStyle = useMemo(
    () =>
      shape === 'circle'
        ? { borderRadius: thumbSize }
        : { borderRadius: 10 },
    [shape, thumbSize]
  );

  const emitChange = (
    next: Item[],
    last?: { file: UploadableImage | null; uri: string | null }
  ) => {
    setItems(next);

    const filesArray = next.map((i) => i.file);
    const urisArray = next.map((i) => i.uri);
    const existingIdsArray = next.map((i) =>
      typeof i.existingId === 'undefined' ? null : i.existingId
    );

    onChange(filesArray, urisArray, existingIdsArray);

    if (onChangeLast) {
      onChangeLast(last?.file ?? null, last?.uri ?? null);
    }
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
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const name = uri.split('/').pop() || `image-${Date.now()}.jpg`;
        const type = getMimeType(uri);
        const file: UploadableImage = { uri, name, type };

        const next = [...items, { uri, file, existingId: null }];
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
            style={[
              styles.thumbImage,
              { width: thumbSize, height: thumbSize },
              borderRadiusStyle,
            ]}
            resizeMode="cover"
          />

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
        <Text style={styles.addText}>
          {isMax ? 'Límite' : 'Agregar foto'}
        </Text>
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
