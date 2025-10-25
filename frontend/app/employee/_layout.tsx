import { Stack, router, usePathname } from 'expo-router';
import React from "react";
import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FooterNavEmployee, { FOOTER_HEIGHT } from "@/constants/navigation/FooterNavEmployee";
import { Colors } from "@/themes/colors";
import { transitionFade } from "@/constants/transitions";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EmployeeLayout() {
  const pathname = usePathname();
  const hideFooter = pathname.startsWith('/employee/chats/thread');
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerTransparent: true,
          headerTitle: "",
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 16 }}>
              <Ionicons name="arrow-back" size={28} color={Colors.violet4} />
            </Pressable>
          ),
        }}
      >
        <Stack.Screen name="index" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="profile/aditional-info" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="offers/index" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="jobs/index" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="chats/index" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="chats/thread" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="profile/index" options={{ ...transitionFade, headerShown: false }} />
      </Stack>

      {!hideFooter && <FooterNavEmployee basePath="/employee" />}

      {!hideFooter && <View style={{ height: FOOTER_HEIGHT + insets.bottom }} />}
    </View>
  );
}