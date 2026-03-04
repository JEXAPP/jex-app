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
};

const RowButton: React.FC<Props> = ({
  title,
  icon,
  onPress,
  styles,
  rightIcon,
}) => {
  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.7}
      onPress={onPress}
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
