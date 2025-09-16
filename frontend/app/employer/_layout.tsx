import FooterNavEmployer from '@/constants/navigation/FooterNavEmployer';
import { transitionFade } from '@/constants/transitions';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import React from 'react';

const FOOTER_HEIGHT = 68;

export default function EmployerLayoutRoot() {
  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,     // <- sin header => no hay flecha atrás
        }}
      >
        {/* Rutas RELATIVAS a /employer */}
        <Stack.Screen name="index" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="vacancy/manipulate-vacancy" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="candidates" options={{ ...transitionFade, headerShown: false }} />
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
