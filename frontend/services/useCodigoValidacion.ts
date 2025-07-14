import { useRef, useState } from 'react';
import { TextInput, Vibration, Keyboard, Animated, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { Colors } from '@/themes/colors';
import { RelativePathString, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export const useCodigoValidacion = (ruta: RelativePathString, tipo: 'email' | 'sms') => {
    const router = useRouter();

    const [inputs, setInputs] = useState(Array(6).fill(''));
    const [borderColors, setBorderColors] = useState(Array(6).fill(Colors.gray2));
    const inputsRef = useRef<TextInput[]>([]).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;

    const iniciarAnimacion = () => {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    };

    const handleChange = (text: string, index: number) => {
      const newInputs = [...inputs];
      newInputs[index] = text;
      setInputs(newInputs);

      const newColors = [...borderColors];
      newColors[index] = Colors.violet4;
      setBorderColors(newColors);

      if (text && index < 5) {
        inputsRef[index + 1]?.focus();
      }

      if (index === 5 && text) {
        Keyboard.dismiss();
        validarCodigo(newInputs.join(''));
      }
    };

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

          inputsRef[index - 1]?.focus();
        }
      }
    };

    const validarCodigo = async (codigo: string) => {
      try {
        const token = await SecureStore.getItemAsync('recuperar-token');
        if (!token) throw new Error('Token no encontrado');

        const response = await fetch('https://tu-backend.com/api/verificar-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            codigo,
            tipo,  // 'email' o 'sms'
          }),
        });

        if (!response.ok) throw new Error('Código incorrecto');

        // Si todo sale bien → redirigir
        router.push(ruta);

      } catch (error) {
        Vibration.vibrate(500);
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
