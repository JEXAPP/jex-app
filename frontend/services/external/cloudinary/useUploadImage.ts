import useBackendConection from '@/services/internal/useBackendConection';

type UploadResult = { image_url: string; image_id: string };

const mimeFromUri = (uri: string) => {
  const ext = uri.split('.').pop()?.toLowerCase();
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'heic') return 'image/heic';
  return 'image/jpeg';
};

export function useUploadImageServ () {
  const { requestBackend } = useBackendConection();

  const uploadImage = async (fileUri: string): Promise<UploadResult> => {
    
    // 1) Pedir firma/credenciales al backend
    const respuesta =
      await requestBackend('/media/cloudinary/sign/', null, 'GET');

    const { timestamp, signature, api_key, cloud_name, folder } = respuesta


    // 2) Armar FormData para Cloudinary
    const form = new FormData();
    form.append('file', {
      uri: fileUri,
      name: `upload.${fileUri.split('.').pop() || 'jpg'}`,
      type: mimeFromUri(fileUri),
    } as any);
    form.append('api_key', api_key);
    form.append('timestamp', String(timestamp));
    form.append('signature', signature);
    if (folder) form.append('folder', folder);

    // 3) Subir a Cloudinary
    const url = `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`;
    const res = await fetch(url, { method: 'POST', body: form });
    if (!res.ok) throw new Error(`Cloudinary error: ${await res.text()}`);
    const json = await res.json();

    // 4) Devolver lo que necesita el front/backend
    return {
      image_url: json.secure_url as string,
      image_id: json.public_id as string,
    };
  };

  return { uploadImage };
}
