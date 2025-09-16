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

  /** 🔹 Modo de uso: "create" (default) o "edit" */
  mode?: 'create' | 'edit';

  /** 🔹 Imagen precargada (opcional): URL completa de Cloudinary */
  initialImageUrl?: string | null;

  /** 🔹 Imagen precargada (opcional): public_id de Cloudinary */
  initialImageId?: string | null;

  /** 🔹 Tamaño de vista previa (px) */
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
  const { getImageUrl } = useGetImage()

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [defaultImageUri, setDefaultImageUri] = useState<string | null>(null);
  const [hadInitial, setHadInitial] = useState<boolean>(false); // hubo imagen previa real
  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(false);

  // Resolver defaultImage (asset local)
  useEffect(() => {
    if (defaultImage) {
      const resolved = RNImage.resolveAssetSource(defaultImage);
      setDefaultImageUri(resolved.uri);
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
            {} // sin transformaciones extra
          );
          if (alive) {
            setImageUri(url ?? null);
            setHadInitial(!!url);
            // En edición puede servir notificar el valor actual (file null, uri la existente)
            onChange(null, url ?? null);
          }
        } finally {
          if (alive) setIsLoadingInitial(false);
        }
        return;
      }

      // Si no hay initial y hay default, la uso solo en modo create
      if (!initialImageUrl && !initialImageId) {
        if (defaultImageUri && mode === 'create') {
          setImageUri(defaultImageUri);
          onChange(null, defaultImageUri);
        } else {
          setImageUri(null);
          onChange(null, null);
        }
      }
    };

    loadInitial();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialImageUrl, initialImageId, defaultImageUri, mode]);

  const isDefaultImage = useMemo(
    () => !!imageUri && !!defaultImageUri && imageUri === defaultImageUri,
    [imageUri, defaultImageUri]
  );

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
        // en edición, al seleccionar “modificar” se reemplaza la previa
        onChange(file, uri);
      }
    } catch (error) {
      console.log('Error al seleccionar imagen:', error);
    }
  };

  const eliminarImagen = () => {
    // En “eliminar”, dejamos la imagen en null
    setImageUri(null);
    onChange(null, null);
    // Si se elimina la existente en edit, ya no hay “hadInitial”
    setHadInitial(false);
  };

  // --- Render helpers según modo y estado ---
  const renderButtons = () => {
    // MODO EDIT: si había imagen previa real (o ya hay una no default)
    const hasCurrent =
      !!imageUri && (!defaultImageUri || imageUri !== defaultImageUri);

    if (mode === 'edit') {
      if (hasCurrent || hadInitial) {
        // Dos botones: Modificar / Eliminar
        return (
          <View style={styles.row}>
            <TouchableOpacity style={styles.secondaryButton} onPress={seleccionarImagen}>
              <Ionicons name="camera" size={20} style={styles.icon} color={Colors.violet4} />
              <Text style={styles.addText}>Modificar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dangerButton} onPress={eliminarImagen}>
              <Ionicons name="trash" size={20} style={styles.icon} color={Colors.violet4} />
              <Text style={styles.addText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        );
      }
      // No hay imagen previa → botón único “Agregar”
      return (
        <TouchableOpacity style={styles.addButton} onPress={seleccionarImagen}>
          <Ionicons name="camera" size={20} style={styles.icon} color={Colors.violet4} />
          <Text style={styles.addText}>Agregar</Text>
        </TouchableOpacity>
      );
    }

    // MODO CREATE (comportamiento previo: alterna entre Agregar/Eliminar si hay imagen)
    const showAdd = !imageUri || isDefaultImage;
    return (
      <TouchableOpacity style={styles.addButton} onPress={showAdd ? seleccionarImagen : eliminarImagen}>
        <Ionicons
          name={showAdd ? 'camera' : 'trash'}
          size={20}
          style={styles.icon}
          color={Colors.violet4}
        />
        <Text style={styles.addText}>{showAdd ? 'Agregar' : 'Eliminar'}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={containerStyle}>
      {!!imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={[
            { width: size, height: size, marginBottom: 10 },
            shape === 'circle' ? { borderRadius: size } : { borderRadius: 8 },
            imageStyle,
          ]}
          resizeMode="cover"
        />
      )}

      {/* si no hay imagen y estamos cargando initial (por public_id) no mostramos botón bloqueado; mantenemos UX simple */}
      {isLoadingInitial ? (
        <View style={styles.loadingPill}>
          <Text style={styles.loadingText}>Cargando imagen…</Text>
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
