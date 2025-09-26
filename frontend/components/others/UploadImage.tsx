import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleProp,
  ImageStyle,
  ViewStyle,
  ImageSourcePropType,
  Image as RNImage
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageStyles1 as styles } from '@/styles/components/others/uploadImageStyles1';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/themes/colors';
import useGetImage from '@/services/external/useGetImage';

type UploadableImage = {
  uri: string;
  name: string;
  type: string;
};

type Props = {
  shape?: 'circle' | 'square';
  onChange: (file: UploadableImage | null, uri: string | null) => void;
  imageStyle?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  defaultImage?: ImageSourcePropType;

  /** Modo de uso: "create" (default) o "edit" */
  mode?: 'create' | 'edit';

  /** Imagen precargada (opcional): URL completa de Cloudinary */
  initialImageUrl?: string | null;

  /** Imagen precargada (opcional): public_id de Cloudinary */
  initialImageId?: string | null;

  /** Tamaño de vista previa (px) */
  size?: number; // default 120
};

export const UploadImage = ({
  shape = 'square',
  onChange,
  imageStyle,
  containerStyle,
  defaultImage,
  mode = 'create',
  initialImageUrl = null,
  initialImageId = null,
  size = 120,
}: Props) => {
  const { getImageUrl } = useGetImage();

  // uri REAL (elegida por el usuario o existente en Cloudinary). Nunca guardamos acá la default.
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [defaultImageUri, setDefaultImageUri] = useState<string | null>(null);
  const [hadInitial, setHadInitial] = useState<boolean>(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(false);

  // Resolver defaultImage (asset local)
  useEffect(() => {
    if (defaultImage) {
      const resolved = RNImage.resolveAssetSource(defaultImage);
      setDefaultImageUri(resolved?.uri ?? null);
    } else {
      setDefaultImageUri(null);
    }
  }, [defaultImage]);

  // Precarga inicial: URL directa o public_id de Cloudinary
  useEffect(() => {
    let alive = true;

    const loadInitial = async () => {
      // Si hay initial por URL o ID, intento resolver
      if (initialImageUrl || initialImageId) {
        setIsLoadingInitial(true);
        try {
          const url = await getImageUrl(
            { image_id: initialImageId ?? undefined, image_url: initialImageUrl ?? undefined },
            {}
          );
          if (!alive) return;

          if (url) {
            setImageUri(url);
            setHadInitial(true);
            // Hay imagen REAL existente
            onChange(null, url);
          } else {
            // No se pudo resolver -> no hay imagen real
            setImageUri(null);
            setHadInitial(false);
            onChange(null, null);
          }
        } finally {
          if (alive) setIsLoadingInitial(false);
        }
        return;
      }

      // Sin initial -> no hay imagen real
      setImageUri(null);
      setHadInitial(false);
      onChange(null, null);
    };

    loadInitial();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialImageUrl, initialImageId, mode]);

  // URI a mostrar: si no hay real, mostramos default (si existe)
  const displayUri = useMemo(() => imageUri ?? defaultImageUri ?? null, [imageUri, defaultImageUri]);
  const isShowingDefault = useMemo(() => !imageUri && !!defaultImageUri && displayUri === defaultImageUri, [imageUri, defaultImageUri, displayUri]);

  const seleccionarImagen = async () => {
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
        setImageUri(uri);
        onChange(file, uri);
      }
    } catch (error) {
      console.log('Error al seleccionar imagen:', error);
    }
  };

  const eliminarImagen = () => {
    // Eliminar deja SIN imagen real; si hay default se mostrará pero no se envía nada
    setImageUri(null);
    onChange(null, null);
    setHadInitial(false);
  };

  // --- Render helpers según modo y estado ---
  const renderButtons = () => {
    // MODO EDIT: si había imagen previa real (o ya hay una no-default)
    const hasCurrent = !!imageUri;

    if (mode === 'edit') {
      if (hasCurrent || hadInitial) {
        // Dos botones: Modificar / Eliminar (centrados)
        return (
          <View style={styles.buttonsContainer}>
            <View style={styles.row}>
              <TouchableOpacity style={styles.secondaryButton} onPress={seleccionarImagen}>
                <Ionicons name="camera" size={18} style={styles.icon} color={Colors.gray3} />
                <Text style={styles.addText}>Modificar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.dangerButton} onPress={eliminarImagen}>
                <Ionicons name="trash" size={18} style={styles.icon} color={Colors.gray3} />
                <Text style={styles.addText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }
      // No hay imagen previa → botón único “Agregar” (centrado)
      return (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.addButton} onPress={seleccionarImagen}>
            <Ionicons name="camera" size={18} style={styles.icon} color={Colors.gray3} />
            <Text style={styles.addText}>Agregar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // MODO CREATE: si está mostrando default o no hay imagen real -> "Agregar"; si hay real -> "Eliminar"
    const showAdd = !imageUri || isShowingDefault;
    return (
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.addButton} onPress={showAdd ? seleccionarImagen : eliminarImagen}>
          <Ionicons
            name={showAdd ? 'camera' : 'trash'}
            size={18}
            style={styles.icon}
            color={Colors.gray3}
          />
          <Text style={styles.addText}>{showAdd ? 'Agregar' : 'Eliminar'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={containerStyle}>
      {!!displayUri && (
        <Image
          source={{ uri: displayUri }}
          style={[
            { width: size, height: size, marginBottom: 10, alignSelf: 'center' },
            shape === 'circle' ? { borderRadius: size } : { borderRadius: 8 },
            imageStyle,
          ]}
          resizeMode="cover"
        />
      )}

      {isLoadingInitial ? (
        <View style={styles.buttonsContainer}>
          <View style={styles.loadingPill}>
            <Text style={styles.loadingText}>Cargando imagen…</Text>
          </View>
        </View>
      ) : (
        renderButtons()
      )}
    </View>
  );
};

const getMimeType = (uri: string): string => {
  const ext = uri.split('.').pop()?.toLowerCase();
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'heic') return 'image/heic';
  return 'image/jpeg';
};
