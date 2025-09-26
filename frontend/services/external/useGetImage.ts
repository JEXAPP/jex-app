import { useMemo } from 'react';
import useBackendConection from '@/services/internal/useBackendConection';

type GetImageOpts = {
  width?: number;
  height?: number;
  quality?: number | 'auto';
  crop?: 'fill' | 'fit' | 'scale' | 'thumb' | 'limit';
  format?: 'jpg' | 'png' | 'webp' | 'auto';
};

type Input = {
  image_id?: string | null;
  image_url?: string | null;
};

export default function useGetImage() {
  const { requestBackend } = useBackendConection();

  const getImageUrl = async (
    { image_id, image_url }: Input,
    opts: GetImageOpts = {}
  ): Promise<string | null> => {
    // 1) si ya tengo secure_url, lo devuelvo
    if (image_url) return image_url;

    // 2) si tengo public_id, construyo URL
    if (image_id) {
      // Reutilizo el endpoint de sign para conocer el cloud_name (no necesito nueva firma)
      const { cloud_name } = await requestBackend('/media/cloudinary/sign/', null, 'GET');

      const parts: string[] = [];
      // transformaciones: f_auto para mejor compatibilidad, q_auto por defecto
      const f = opts.format ?? 'auto';
      const q = opts.quality ?? 'auto';
      parts.push(`f_${f}`, `q_${q}`);

      if (opts.crop) parts.push(`c_${opts.crop}`);
      if (opts.width) parts.push(`w_${opts.width}`);
      if (opts.height) parts.push(`h_${opts.height}`);

      const transformation = parts.join(',');

      // Nota: si tu image_id tiene carpetas, Cloudinary lo maneja igual.
      const base = `https://res.cloudinary.com/${cloud_name}/image/upload`;
      const url = transformation
        ? `${base}/${transformation}/${image_id}`
        : `${base}/${image_id}`;

      // Si se especificó un formato explícito (no 'auto'), lo agrego como extensión
      if (opts.format && opts.format !== 'auto') {
        return `${url}.${opts.format}`;
      }
      return url;
    }

    // 3) no hay datos
    return null;
  };

  return useMemo(() => ({ getImageUrl }), []);
}
