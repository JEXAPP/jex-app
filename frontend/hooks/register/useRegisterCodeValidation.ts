import { useRef, useState } from 'react';
import {
  TextInput,
  Vibration,
  Keyboard,
  Animated,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { Colors } from '@/themes/colors';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import useBackendConection from '@/services/useBackendConection';

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

    // Si se ingresó un carácter y no es el último campo, enfoca el siguiente input
    if (text && index < 5) {
      inputsRef[index + 1]?.focus();
    }

    // Si se completó el último campo, cierra el teclado y valida
    if (index === 5 && text) {
      Keyboard.dismiss();
      codeValidation(newInputs.join('')); // une los caracteres del código
    }
  };

  // Maneja la tecla Backspace para retroceder si el campo está vacío
  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace' && inputs[index] === '') {
      if (index > 0) {
        const newInputs = [...inputs];
        newInputs[index - 1] = '';
        setInputs(newInputs);

        const newColors = [...borderColors];
        newColors[index - 1] = Colors.gray2;
        setBorderColors(newColors);

        inputsRef[index - 1]?.focus(); // enfoca el input anterior
      }
    }
  };

  // Envía el código al backend para validarlo
  const codeValidation = async (codigo: string) => {
    try {
      // Obtiene el teléfono almacenado previamente en SecureStore
      const phone = await SecureStore.getItemAsync('telefono-verificacion');
      if (!phone) throw new Error('Teléfono no encontrado');

      // Envía el código al backend (endpoint de validación)
      const res = await requestBackend('/api/auth/sms-verify/', {
        phone,
        code: codigo,
      }, 'POST');

      if (!res) throw new Error('Código incorrecto');

      // Si es exitoso, guarda el código y avanza a la siguiente pantalla
      await SecureStore.setItemAsync('sms-code', codigo);
      router.push('./type-user');

    } catch (error) {
      // Si falla, vibra, sacude el input, y resetea
      Vibration.vibrate(200);
      iniciarAnimacion();
      setBorderColors(Array(6).fill(Colors.red));

      setTimeout(() => {
        setInputs(Array(6).fill(''));
        setBorderColors(Array(6).fill(Colors.gray2));
        inputsRef[0]?.focus(); // vuelve al primer campo
      }, 1000);
    }
  };

  // Valores y funciones que expone el hook
  return {
    inputs,
    inputsRef,
    handleChange,
    handleKeyPress,
    borderColors,
    shakeAnim,
  };
};
