import { useFonts } from 'expo-font';
import { router, SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import fontMap from '../themes/fonts';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/themes/colors';
import { exitHeader } from '@/constants/headers';
import { transitionFade } from '@/constants/transitions';



export default function RootLayout() {
  const [fontsLoaded] = useFonts(fontMap);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerTitle: '',
        headerLeft: () => (
          <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 16 }}>
            <Ionicons name="arrow-back" size={28} color={Colors.violet5} />
          </Pressable>
        ),
      }}
    >
      {/* Solo personalizás las excepciones */}
      <Stack.Screen name="index" options={{ ...transitionFade, headerShown: false }} />
      <Stack.Screen name="login/index" options={{ ...transitionFade, headerShown: false }} />
      <Stack.Screen name="recuperar-clave/index" options={{ ...exitHeader('/login'), ...transitionFade, }} />
      <Stack.Screen name="recuperar-clave/validar-codigo" options={{ ...exitHeader('/login'), ...transitionFade, }} />
      <Stack.Screen name="recuperar-clave/nueva-clave" options={{ ...exitHeader('/login'), ...transitionFade, }} />
      <Stack.Screen name="registro/index" options={{ ...exitHeader('/login'), ...transitionFade, }} />
      
    </Stack>

  );
}
