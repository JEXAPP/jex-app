import FooterNavEmployee from '@/constants/footers/FooterNavEmployee';
import { transitionFade } from '@/constants/transitions';
import { Colors } from '@/themes/colors';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FOOTER_HEIGHT = 68;

export default function EmployeeLayout() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1 }}>
      {/* Navigator (solo screens como hijos) */}
      <Stack
        screenOptions={{
          headerTransparent: true,
          headerTitle: '',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 16 }}>
              <Ionicons name="arrow-back" size={28} color={Colors.violet4} />
            </Pressable>
          ),
          // SUGERENCIA: añade paddingBottom por defecto a pantallas que scrollean
          // pero si cada screen ya maneja su padding, podés omitirlo.
        }}
      >
        {/* Rutas RELATIVAS a /employee */}
        <Stack.Screen name="index" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="profile/aditional-info" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="vacancy/search-vacancy" options={{ ...transitionFade, headerShown: false }} />
      </Stack>

      {/* Footer fijo, por fuera del Stack */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <FooterNavEmployee basePath="/employee" />
      </View>

      {/* Espacio para no tapar contenido (si alguna screen no lo agrega) */}
      <View style={{ height: FOOTER_HEIGHT + insets.bottom }} />
    </View>
  );
}
