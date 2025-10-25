import { transitionFade } from '@/constants/transitions';
import fontMap from '@/themes/fonts';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useDeepLinkDebug } from '@/services/internal/useDeepLinkDebug';

WebBrowser.maybeCompleteAuthSession();

export default function RootLayout() {
    useDeepLinkDebug();

  const [fontsLoaded] = useFonts(fontMap);

  // Calienta el Custom Tab / SFSafariViewController y luego lo enfría
  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => { WebBrowser.coolDownAsync(); };
  }, []);

  // Debug de deep links: confirmá que llega jex://oauthredirect
  useEffect(() => {
    const sub = Linking.addEventListener('url', ({ url }) => {
      console.log('DEEPLINK capturado =>', url);
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ ...transitionFade, headerShown: false }} />
    </GestureHandlerRootView>
  );
}
