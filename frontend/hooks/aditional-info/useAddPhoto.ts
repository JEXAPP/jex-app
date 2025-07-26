import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import useBackendConection from '@/services/useBackendConection';

export const useAddPhoto = () => {
  const { requestBackend } = useBackendConection();
  const [imagenPerfil, setImagenPerfil] = useState<string | null>(null); //URL de la foto (local o de backend)
  const [imagenFile, setImagenFile] = useState<any>(null); // guarda el archivo para mandarlo al backend

  // Eliminar imagen
  const eliminarImagen = () => {
    setImagenPerfil(null); //borramos la imagen de jex por default
    setImagenFile(null); //borra el archivo temporal que estaba listo para mandar al backend porque no tocaron guardar
  };

  // Seleccionar imagen
  const seleccionarImagen = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ //abre galeria 
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) { //si no toca cancelar
        const uri = result.assets[0].uri; //direccion local d ela imagen
        setImagenPerfil(uri); // setea la ddirección local en imagenPerfil

        // convertimos en archivo para backend - creamos un file porque no puede ir la dirección local al backend
        const fileName = uri.split('/').pop()!; //divide por / y guarda un array con palabra por palabra - el pop agarra la ultima palabra - !promete que nunca va a ser undefined
        const fileType = result.assets[0].type || 'image'; //avisa que el unico string del array armando antes es el nombre del archivo 

        const file = {
          uri,
          name: fileName,
          type: `${fileType}/${fileName.split('.').pop()}`,
        };

        setImagenFile(file); //guarda el file en ImagenFile para mandar al backend
      }
    } catch (error) {
      console.log('Error al seleccionar imagen:', error);
    }
  };

  // Subir imagen al backend cuando se toca el boton guardar
  const subirImagenAlBackend = async () => {
    if (!imagenFile) return; 

    const formData = new FormData(); //esto se manda al back
    formData.append('foto', imagenFile); // esto espera que el backend reciba un campo "foto" tiene que coincidir con el backend la palabra foto

    try {
      const response = await requestBackend('/api/usuario/subir-foto', formData, 'POST', {
        headers: {
          'Content-Type': 'multipart/form-data',
        }, //avisa que esta mandando archivos 
      });

      if (response?.url) { //si la respuesta es una URL 
        setImagenPerfil(response.url); // actualiza la imagen con la URL final
      }

    } catch (error) { //si la respuesta del servidor no es una URL
      console.log('Error al subir la imagen:', error);
    }
  };

  return {
    imagenPerfil,
    seleccionarImagen,
    eliminarImagen,
    subirImagenAlBackend,
  };
};
