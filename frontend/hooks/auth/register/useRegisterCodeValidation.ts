// useRegisterCodeValidation.ts
import useBackendConection from '@/services/internal/useBackendConection';
import { Colors } from '@/themes/colors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Animated, Keyboard, NativeSyntheticEvent, TextInput, TextInputKeyPressEventData, Vibration } from 'react-native';

export const useRegisterCodeValidation = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();

  const { phone, google, gAt, gCode } = useLocalSearchParams<{ phone?: string; google?: string; gAt?: string; gCode?: string }>();
  const desdeGoogle = google === '1';

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

    if (text.length === 1 && index < inputs.length - 1) inputsRef[index + 1]?.focus();
    if (index === inputs.length - 1 && text.length === 1) {
      Keyboard.dismiss();
      codeValidation(newInputs.join(''));
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      const newInputs = [...inputs];
      if (newInputs[index] !== '') {
        newInputs[index] = '';
        setInputs(newInputs);
      } else if (index > 0) {
        inputsRef[index - 1]?.focus();
        newInputs[index - 1] = '';
        setInputs(newInputs);
        const newColors = [...borderColors];
        newColors[index - 1] = Colors.gray2;
        setBorderColors(newColors);
      }
    }
  };

  const codeValidation = async (codigo: string) => {
    try {
      if (!phone) throw new Error('Teléfono no encontrado');
      const res = await requestBackend('/api/auth/verify/check-code/', { phone, code: codigo }, 'POST');
      if (!res) throw new Error('Código incorrecto');

      if (desdeGoogle) {
        const qs = new URLSearchParams({
          google: '1',
          phone,
          ...(gAt ? { gAt } : {}),
          ...(gCode ? { gCode } : {}),
        }).toString();
        router.push(`./type-user?${qs}`);
      } else {
        const qs = new URLSearchParams({ phone, google: '0' }).toString();
        router.push(`./account?${qs}`); // Paso 3 (solo no-Google)
      }
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
    }
  };

  return { inputs, inputsRef, handleChange, handleKeyPress, borderColors, shakeAnim, desdeGoogle };
};
