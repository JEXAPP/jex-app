import React, { useState, useEffect } from 'react';
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
};

export const UploadImage = ({
  shape = 'square',
  onChange,
  imageStyle,
  containerStyle,
  defaultImage,
}: Props) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [defaultImageUri, setDefaultImageUri] = useState<string | null>(null);

  useEffect(() => {
    if (defaultImage) {
      const resolved = RNImage.resolveAssetSource(defaultImage);
      setDefaultImageUri(resolved.uri);
      if (!imageUri) {
        setImageUri(resolved.uri);
        onChange(null, resolved.uri);
      }
    }
  }, []);

  const isDefaultImage = imageUri && defaultImageUri && imageUri === defaultImageUri;

  const seleccionarImagen = async () => {
    try {
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
    if (defaultImageUri) {
      setImageUri(defaultImageUri);
      onChange(null, defaultImageUri);
    } else {
      setImageUri(null);
      onChange(null, null);
    }
  };

  const handlePress = () => {
    if (!imageUri || isDefaultImage) {
      seleccionarImagen();
    } else {
      eliminarImagen();
    }
  };

  return (
    <View style={containerStyle}>
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={[
            { width: 120, height: 120, marginBottom: 10 },
            shape === 'circle' ? { borderRadius: 120 } : { borderRadius: 8 },
            imageStyle,
          ]}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={handlePress}>
        <Ionicons
          name={!imageUri || isDefaultImage ? 'camera' : 'trash'}
          size={20}
          style={styles.icon}
          color={Colors.violet4}
        />
        <Text style={styles.addText}>
          {!imageUri || isDefaultImage ? 'Agregar' : 'Eliminar'}
        </Text>
      </TouchableOpacity>
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
