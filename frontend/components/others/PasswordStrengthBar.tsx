import React, { useEffect, useMemo } from 'react';
import { View, Text } from 'react-native';
import { Colors } from '@/themes/colors';
import { iconos } from '@/constants/iconos';

interface PasswordStrengthProps {
  password: string;
  styles: {
    container?: any;
    listContainer?: any;
    itemRow?: any;
    itemText?: any;
    icon?: any;
    successContainer?: any;
    successText?: any;
    successIcon?: any;
  };
  onValidChange?: (isValid: boolean) => void; // << nuevo: booleano para el padre
}

export const PasswordStrengthBar: React.FC<PasswordStrengthProps> = ({
  password,
  styles,
  onValidChange,
}) => {

  const checks = useMemo(() => {
    const hasMinLength = password.length >= 6;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasLettersAndNumbers = /[A-Za-z]/.test(password) && /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_\-+={}[\]\\|:;"'<>,.?/~`]/.test(password);

    const hasLowerAndUpper = hasLower && hasUpper;

    return {
      hasMinLength,
      hasLowerAndUpper,
      hasLettersAndNumbers,
      hasSpecial,
    };
  }, [password]);

  const requirements = useMemo(
    () => [
      {
        key: 'length',
        label: 'Contiene al menos 6 caracteres',
        met: checks.hasMinLength,
      },
      {
        key: 'case',
        label: 'Varía minúsculas y mayúsculas',
        met: checks.hasLowerAndUpper,
      },
      {
        key: 'alnum',
        label: 'Contiene combinación de letras y números',
        met: checks.hasLettersAndNumbers,
      },
      {
        key: 'special',
        label:
          'Incluye un carácter especial @ # $ % & * , . / ? !',
        met: checks.hasSpecial,
      },
    ],
    [checks]
  );

  const isValid = useMemo(
    () => requirements.every(r => r.met),
    [requirements]
  );

  // Avisar al padre cuando cambie la validez
  useEffect(() => {
    if (onValidChange) {
      onValidChange(isValid);
    }
  }, [isValid, onValidChange]);

  // Si el usuario todavía no escribió nada, no mostrar nada
  if (!password || password.length === 0) {
    return null;
  }

  // Si cumple todos los requisitos → mensaje de éxito
  if (isValid) {
    return (
      <View style={styles.successContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={styles.successIcon}>
            {iconos.contraseña_segura(
              20,
              Colors.violet3
            )}
          </View>
          <Text style={styles.successText}>
            Contraseña apta para utilizar
          </Text>
        </View>
      </View>
    );
  }

  // Caso normal: mostrar lista de requisitos
  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        {requirements.map(req => (
          <View key={req.key} style={styles.itemRow}>
            <View style={styles.icon}>
              {req.met
                ? iconos.check(12, Colors.green)
                : iconos.uncheck(12, Colors.gray2)}
            </View>
            <Text style={styles.itemText}>{req.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
