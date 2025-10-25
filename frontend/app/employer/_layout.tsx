// _layout.tsx
import FooterNavEmployer, { FOOTER_HEIGHT } from '@/constants/navigation/FooterNavEmployer';
import { transitionFade } from '@/constants/transitions';
import { Pressable, View } from 'react-native';
import { Stack, router, usePathname } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/themes/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EmployerLayoutRoot() {
  const pathname = usePathname();
  const hideFooter = pathname.startsWith('/employer/chats/thread');
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerTransparent: true,
          headerTitle: '',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 16 }}>
              <Ionicons name="arrow-back" size={28} color={Colors.violet4} />
            </Pressable>
          ),
        }}
      >
        <Stack.Screen name="index" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="candidates" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="offers/index" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="chats/index" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="chats/thread" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="profile/index" options={{ ...transitionFade, headerShown: false }} />
      </Stack>

      {!hideFooter && <FooterNavEmployer basePath="/employer" />}

      {!hideFooter && <View style={{ height: FOOTER_HEIGHT + insets.bottom }} />}
    </View>
  );
}
