import React, { useEffect, useState } from 'react';
import { Image, ImageSourcePropType, ImageStyle } from 'react-native';
import useGetImage from '@/services/external/useGetImage';

type Props = {
  imageId?: string | null;        // public_id
  imageUrl?: string | null;       // secure_url
  size: number;                   // px
  shape?: 'square' | 'circle';
  width?: number;
  height?: number;
  quality?: number | 'auto';
  crop?: 'fill' | 'fit' | 'scale' | 'thumb' | 'limit';
  format?: 'jpg' | 'png' | 'webp' | 'auto';
  style?: ImageStyle | ImageStyle[];
  fallback?: ImageSourcePropType; // imagen por defecto
};

const DEFAULT_FALLBACK = require('@/assets/images/jex/Jex-Evento-Default.png');

const ImageOnline: React.FC<Props> = ({
  imageId,
  imageUrl,
  size,
  shape = 'square',
  width,
  height,
  quality,
  crop,
  format,
  style,
  fallback = DEFAULT_FALLBACK,
}) => {
  const { getImageUrl } = useGetImage();
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    // ⚡ si ambos son nulos, no busco nada y uso fallback
    if (!imageId && !imageUrl) {
      setUri(null);
      return;
    }

    (async () => {
      const final = await getImageUrl(
        { image_id: imageId ?? undefined, image_url: imageUrl ?? undefined },
        { width, height, quality, crop, format }
      );
      if (alive) setUri(final);
    })();

    return () => { alive = false; };
  }, [imageId, imageUrl, width, height, quality, crop, format, getImageUrl]);

  const base =
    shape === 'circle'
      ? [{overflow: 'hidden', width: size, height: size, borderRadius: size / 2 }]
      : [{overflow: 'hidden', width: size, height: size }];

  if (!uri) {
    return <Image source={fallback} style={[...base, style as any]} resizeMode="cover" />;
  }

  return <Image source={{ uri }} style={[...base, style as any]} resizeMode="cover" />;
};

export default ImageOnline;
