import FooterNavEmployer from '@/constants/navigation/FooterNavEmployer';
import { transitionFade } from '@/constants/transitions';
import { Pressable, View } from 'react-native';
import { router, Stack } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/themes/colors';

const FOOTER_HEIGHT = 68;

export default function EmployerLayoutRoot() {
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
        )}}>
        {/* Rutas RELATIVAS a /employer */}
        <Stack.Screen name="index" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="candidates" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="offers/index" options={{ ...transitionFade, headerShown: false }} />
      </Stack>

      {/* Footer fijo */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <FooterNavEmployer basePath="/employer" />
      </View>

      {/* Espaciador para no tapar contenido */}
      <View style={{ height: FOOTER_HEIGHT }} />
    </View>
  );
}
