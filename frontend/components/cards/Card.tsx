import React from "react";
import { TouchableOpacity, View, Text, GestureResponderEvent } from "react-native";
import { adminPanelStyles as styles } from "@/styles/app/employer/adminPanelStyles";
import { iconos } from "@/constants/iconos";
import { Colors } from "@/themes/colors";

type Props = {
  label: string;
  leftIcon: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: (e: GestureResponderEvent) => void;
  disabled?: boolean;
};

export const Card: React.FC<Props> = ({
  label,
  leftIcon,
  rightIcon,
  onPress,
  disabled,
}) => {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      hitSlop={8}
      disabled={disabled}
      onPress={onPress}
      style={[styles.card, disabled && { opacity: 0.5 }]}
    >
      <View style={styles.cardContent}>
        {leftIcon}
        <Text style={styles.cardText}>{label}</Text>
      </View>
      {rightIcon ?? iconos.flechaDerecha(22, Colors.violet4)}
    </TouchableOpacity>
  );
};
