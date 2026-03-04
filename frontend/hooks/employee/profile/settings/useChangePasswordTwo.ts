import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  NativeSyntheticEvent,
  TextInput,
  TextInputKeyPressEventData,
  Vibration,
} from "react-native";
import * as SecureStore from "expo-secure-store";

import useBackendConection from "@/services/internal/useBackendConection";
import { Colors } from "@/themes/colors";

type Params = {
  method?: string; // "sms" | "mail"
  phone?: string;
};

export const useChangePasswordTwo = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();
  const { method, phone } = useLocalSearchParams<Params>();

  const [inputs, setInputs] = useState<string[]>(Array(6).fill(""));
  const [borderColors, setBorderColors] = useState<string[]>(
    Array(6).fill(Colors.gray2)
  );
  const inputsRef = useRef<TextInput[]>([]).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false);

  const iniciarAnimacion = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleChange = (text: string, index: number) => {
    const newInputs = [...inputs];
    newInputs[index] = text;
    setInputs(newInputs);

    const newColors = [...borderColors];
    newColors[index] = Colors.violet4;
    setBorderColors(newColors);

    if (text.length === 1 && index < inputs.length - 1) {
      inputsRef[index + 1]?.focus();
    }

    if (index === inputs.length - 1 && text.length === 1) {
      Keyboard.dismiss();
      codeValidation(newInputs.join(""));
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === "Backspace") {
      const newInputs = [...inputs];

      if (newInputs[index] !== "") {
        newInputs[index] = "";
        setInputs(newInputs);
      } else if (index > 0) {
        inputsRef[index - 1]?.focus();
        newInputs[index - 1] = "";
        setInputs(newInputs);

        const newColors = [...borderColors];
        newColors[index - 1] = Colors.gray2;
        setBorderColors(newColors);
      }
    }
  };

  const resetInputsWithError = () => {
    Vibration.vibrate(200);
    iniciarAnimacion();
    setBorderColors(Array(6).fill(Colors.red));

    setTimeout(() => {
      setInputs(Array(6).fill(""));
      setBorderColors(Array(6).fill(Colors.gray2));
      inputsRef[0]?.focus();
    }, 1000);
  };

  const codeValidation = async (codigo: string) => {
    setLoading(true);
    try {
      if (method === "sms") {
        if (!phone) {
          throw new Error("Teléfono no encontrado");
        }

        const res = await requestBackend(
          "/api/auth/verify/check-code/",
          { phone, code: codigo },
          "POST"
        );

        if (!res) {
          throw new Error("Código incorrecto");
        }

        router.push("/employee/profile/settings/change-password-three");
      } else {
        const email = await SecureStore.getItemAsync("email-password-reset");
        if (!email) {
          throw new Error("Email no encontrado");
        }

        const res = await requestBackend(
          "/api/auth/password-reset-verify/",
          { email, otp_code: codigo },
          "POST"
        );

        if (!res) {
          throw new Error("Código incorrecto");
        }

        await SecureStore.setItemAsync("code", codigo);
        router.push("/employee/profile/settings/change-password-three");
      }
    } catch (error) {
      console.log("El código no es válido:", error);
      resetInputsWithError();
    } finally {
      setLoading(false);
    }
  };

  // Enviar el código al entrar a la pantalla
  useEffect(() => {
    const sendCode = async () => {
      try {
        if (method === "sms") {
          if (!phone) {
            console.warn("Teléfono no disponible para enviar código");
            return;
          }

          await requestBackend(
            "/api/auth/verify/send-code/",
            { phone },
            "POST"
          );
        } else {
          const data = await requestBackend(
            "/api/auth/view-mail-and-phone/",
            null,
            "GET"
          );

          const email = data?.email;
          if (!email) {
            console.warn("Email no disponible para enviar código");
            return;
          }

          await requestBackend(
            "/api/auth/password-reset/",
            { email },
            "POST"
          );

          await SecureStore.setItemAsync("email-password-reset", email);
        }
      } catch (e: any) {
        console.warn("Error enviando código de cambio de contraseña:", e.message);
      }
    };

    sendCode();
  }, []);

  const subtitle =
    method === "sms"
      ? "Ingresá el código que te enviamos por SMS"
      : "Ingresá el código que te enviamos por correo electrónico";

  return {
    inputs,
    inputsRef,
    handleChange,
    handleKeyPress,
    borderColors,
    shakeAnim,
    subtitle,
    loading,
  };
};
