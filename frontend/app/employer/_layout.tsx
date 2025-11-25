// _layout.tsx
import FooterNavEmployer, { FOOTER_HEIGHT } from '@/constants/navigation/FooterNavEmployer';
import { transitionFade } from '@/constants/transitions';
import { Pressable, View, StatusBar } from 'react-native';
import { Stack, router, usePathname } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/themes/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EmployerLayoutRoot() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // Ocultar footer en pantalla de chat
  const hideFooter = pathname.startsWith('/employer/chats/thread');

  const isDetail =
    pathname.startsWith('/employer/profile/view-profile') ||
    pathname.startsWith('/employer/candidates/detail') ||
    pathname.startsWith('/employer/offers/') // agregá las que quieras

  const bg = isDetail ? Colors.violet4 : Colors.gray1;

  return (
    <View style={{ flex: 1 }}>
      
      {/* Barra de estado */}
      <StatusBar
        translucent
        barStyle={isDetail ? 'light-content' : 'dark-content'}
      />

      {/* Fondo violeta detrás del notch */}
      {isDetail && (
        <View style={{ height: insets.top, backgroundColor: bg }} />
      )}

      <Stack
        screenOptions={{
          headerTransparent: true,
          headerTitle: '',
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              style={{ paddingHorizontal: 16 }}
            >
              <Ionicons
                name="arrow-back"
                size={28}
                color={isDetail ? Colors.white : Colors.violet4}
              />
            </Pressable>
          ),
        }}
      >
        <Stack.Screen name="index" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="candidates" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="candidates/search" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="offers/index" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="chats/index" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="chats/thread" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="profile/index" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="profile/view-profile" options={{ ...transitionFade, headerShown: false }} />
      </Stack>

      {/* FOOTER */}
      {!hideFooter && <FooterNavEmployer basePath="/employer" />}
      {!hideFooter && <View style={{ height: FOOTER_HEIGHT + insets.bottom }} />}
    </View>
  );
}
