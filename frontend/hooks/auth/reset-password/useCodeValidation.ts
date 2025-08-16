import useBackendConection from '@/services/internal/useBackendConection';
import { Colors } from '@/themes/colors';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useRef, useState } from 'react';
import { Animated, Keyboard, NativeSyntheticEvent, TextInput, TextInputKeyPressEventData, Vibration } from 'react-native';

export const useCodeValidation = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { requestBackend } = useBackendConection();

  // Estado que almacena los caracteres del código
  const [inputs, setInputs] = useState(Array(6).fill(''));

  // Estado que controla el color de los bordes de los inputs
  const [borderColors, setBorderColors] = useState(Array(6).fill(Colors.gray2));

  // Referencias a cada input para poder enfocar programáticamente
  const inputsRef = useRef<TextInput[]>([]).current;

  // Animación de sacudida para error en código
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Ejecuta la animación de sacudida
  const iniciarAnimacion = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  // Maneja el cambio de texto en un input individual
  const handleChange = (text: string, index: number) => {
    const newInputs = [...inputs];
    newInputs[index] = text;
    setInputs(newInputs);

    const newColors = [...borderColors];
    newColors[index] = Colors.violet4;
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

  // Valida el código ingresado enviándolo al backend
  const codeValidation = async (codigo: string) => {
    setLoading(true)
    try {
      const email = await SecureStore.getItemAsync('email-password-reset');
      if (!email) throw new Error('Email no encontrado');

      const res = await requestBackend(
        '/api/auth/password-reset-verify/',
        { email, otp_code: codigo },
        'POST'
      );

      if (!res) throw new Error('Código incorrecto');

      await SecureStore.setItemAsync('code', codigo);

      router.push('/auth/reset-password/new-password');
    } catch (error) {
      console.log('El código no es válido:', error);
      Vibration.vibrate(200);
      iniciarAnimacion();
      setBorderColors(Array(6).fill(Colors.red));

      setTimeout(() => {
        setInputs(Array(6).fill(''));
        setBorderColors(Array(6).fill(Colors.gray2));
        inputsRef[0]?.focus();
      }, 1000);
    } finally {
      setLoading(false); 
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
