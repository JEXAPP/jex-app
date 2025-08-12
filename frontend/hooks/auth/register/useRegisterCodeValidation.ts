import useBackendConection from '@/services/internal/useBackendConection';
import { Colors } from '@/themes/colors';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useRef, useState } from 'react';
import { Animated, Keyboard, NativeSyntheticEvent, TextInput, TextInputKeyPressEventData, Vibration } from 'react-native';

export const useRegisterCodeValidation = () => {
  const router = useRouter(); // Navegador de rutas
  const { requestBackend } = useBackendConection(); // Hook para requests

  // Estado que almacena los 6 caracteres del código
  const [inputs, setInputs] = useState(Array(6).fill(''));

  // Estado para controlar el color del borde de cada input
  const [borderColors, setBorderColors] = useState(Array(6).fill(Colors.gray2));

  // Refs para manejar el foco de los inputs
  const inputsRef = useRef<TextInput[]>([]).current;

  // Valor animado para efecto de "shake" al ingresar un código incorrecto
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Ejecuta la animación de sacudida (error)
  const iniciarAnimacion = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  // Maneja el ingreso de texto en un input (número del código)
  const handleChange = (text: string, index: number) => {
    const newInputs = [...inputs];
    newInputs[index] = text;
    setInputs(newInputs);

    const newColors = [...borderColors];
    newColors[index] = Colors.violet4; // cambia color si hay texto
    setBorderColors(newColors);

    // Avanzar solo si escribió 1 caracter
    if (text.length === 1 && index < inputs.length - 1) {
      inputsRef[index + 1]?.focus();
    }

    // Si completó el último input
    if (index === inputs.length - 1 && text.length === 1) {
      Keyboard.dismiss();
      codeValidation(newInputs.join(''));
    }
  };

  // Maneja el borrado con Backspace y mueve el foco al input anterior
  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace') {
      const newInputs = [...inputs];

      if (newInputs[index] !== '') {
        // Si hay algo escrito, lo borramos primero
        newInputs[index] = '';
        setInputs(newInputs);
      } else if (index > 0) {
        // Si ya estaba vacío, movemos el foco atrás
        inputsRef[index - 1]?.focus();

        newInputs[index - 1] = '';
        setInputs(newInputs);

        const newColors = [...borderColors];
        newColors[index - 1] = Colors.gray2;
        setBorderColors(newColors);
      }
    }
  };

  // Envía el código al backend para validarlo
  const codeValidation = async (codigo: string) => {
    try {
      // Obtiene el teléfono almacenado previamente en SecureStore
      const phone = await SecureStore.getItemAsync('registro-telefono');
      if (!phone) throw new Error('Teléfono no encontrado');

      // Envía el código al backend (endpoint de validación)
      const res = await requestBackend('/api/auth/verify/check-code/', {
        phone,
        code: codigo,
      }, 'POST');

      if (!res) throw new Error('Código incorrecto');

      // Si es exitoso, avanza a la siguiente pantalla
      router.push('./account');

    } catch (error) {

      // Si falla, vibra, sacude el input, y resetea
      console.log('El código no es válido:', error)
      Vibration.vibrate(200);
      iniciarAnimacion();
      setBorderColors(Array(6).fill(Colors.red));

      setTimeout(() => {
        setInputs(Array(6).fill(''));
        setBorderColors(Array(6).fill(Colors.gray2));
        inputsRef[0]?.focus(); 
      }, 1000);
    }
  };

  return {
    inputs,
    inputsRef,
    handleChange,
    handleKeyPress,
    borderColors,
    shakeAnim,
  };
};
