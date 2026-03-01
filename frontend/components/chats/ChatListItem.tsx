import React from "react";
import {View, Text, Image, Pressable, ImageSourcePropType } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ChatItemListStyles as styles } from "@/styles/components/chats/chatItemListStyles"
import { Colors } from "@/themes/colors";

type Props = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  leftIcon?: React.ReactNode;
  leftImageSource?: ImageSourcePropType;
  avatarBg?: string;
  testID?: string;
};

export default function ChatListItem({
  title,
  subtitle,
  onPress,
  leftIcon,
  leftImageSource,
  avatarBg = "#F2ECF7",
  testID,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && { opacity: 0.9, transform: [{ scale: 0.998 }] },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle ?? ""}`}
      testID={testID}
    >

      <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
        {leftIcon ? (
          <View style={styles.iconWrapper}>{leftIcon}</View>
        ) : leftImageSource ? (
          <Image source={leftImageSource} style={styles.avatarImg} />
        ) : (
          <Text style={styles.avatarText}>
            {title?.trim()?.charAt(0)?.toUpperCase() ?? "?"}
          </Text>
        )}
      </View>

      <View style={styles.texts}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        {!!subtitle && (
          <Text numberOfLines={2} style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </View>

      <Ionicons name="chevron-forward-outline" size={22} color={Colors.violet4} />
    </Pressable>
  );
}

