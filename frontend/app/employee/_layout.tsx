import { Stack, router, useSegments, usePathname } from 'expo-router';
import React from "react";
import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FooterNavEmployee from "@/constants/navigation/FooterNavEmployee";
import { Colors } from "@/themes/colors";
import { transitionFade } from "@/constants/transitions";

const FOOTER_HEIGHT = 68;

export default function EmployeeLayout() {
  const pathname = usePathname(); // p.ej: ["(employee)","chats","threads","123"]

  // quita grupos como "(employee)"
  const hideFooter = pathname.startsWith('/employee/chats/threads');

  console.log(hideFooter)
  console.log(pathname)

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
        <Stack.Screen name="vacancy/search-vacancy" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="offers/index" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="jobs/index" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="chats/index" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="chats/threads" options={{ ...transitionFade, headerShown: false }} />
      </Stack>

      {!hideFooter && (
        <>
          <View style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
            <FooterNavEmployee basePath="/employee" />
          </View>
          <View style={{ height: FOOTER_HEIGHT }} />
        </>
      )}
    </View>
  );
}
