import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  GestureResponderEvent,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/themes/colors";

type Props = {
  title: string;
  icon: React.ReactNode;
  onPress: (event: GestureResponderEvent) => void;
  styles: any;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
};

const RowButton: React.FC<Props> = ({
  title,
  icon,
  onPress,
  styles,
  rightIcon,
  disabled,
}) => {
  return (
    <TouchableOpacity
      style={[styles.row, disabled && { opacity: 0.5 }]}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.iconWrapper}>{icon}</View>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.rightIconWrapper}>
        {rightIcon ?? (
          <Feather
            name="chevron-right"
            size={20}
            color={Colors.gray3}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default RowButton;
