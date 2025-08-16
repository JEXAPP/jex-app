import { View, Text } from 'react-native';
import React, { useEffect, useMemo } from 'react';

interface Props {
  password: string;
  styles: {
    container?: any;
    label?: any;
    barBackground?: any;
    barFill?: any;
  };
  onStrengthChange?: (strength: number) => void; 
}

export const PasswordStrengthBar: React.FC<Props> = ({ password, styles, onStrengthChange}) => {

    const strength = useMemo(() => {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return Math.min(score, 5);
  }, [password]);

  const percentage = (strength / 5) * 100;

  useEffect(() => {
    if (onStrengthChange) {
      onStrengthChange(strength);
    }
  }, [strength, onStrengthChange]);

  const strengthLabels = ['Muy débil', 'Débil', 'Media', 'Buena', 'Fuerte'];
  const label = strengthLabels[strength - 1] || '';

  return (
    <View style={[styles.container, styles.container]}>
      <Text style={[styles.label, styles.label]}>{label}</Text>

      <View style={[styles.barBackground, styles.barBackground]}>
        <View style={[styles.barFill, styles.barFill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
};
