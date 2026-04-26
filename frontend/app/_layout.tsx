import { transitionFade } from '@/constants/transitions';
import fontMap from '@/themes/fonts';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useDeepLinkDebug } from '@/services/internal/useDeepLinkDebug';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';
import { logger } from '@/services/internal/logger';

WebBrowser.maybeCompleteAuthSession();

export default function RootLayout() {
  useDeepLinkDebug();

  const [fontsLoaded] = useFonts(fontMap);

  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => { WebBrowser.coolDownAsync(); };
  }, []);

  useEffect(() => {
    const sub = Linking.addEventListener('url', ({ url }) => {
      // SECURITY: Deep-link URLs may contain OAuth codes — log only in dev
      logger.log('Deep link received:', url);
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    // SECURITY: ErrorBoundary wraps the entire app to prevent raw crashes
    // from exposing stack traces or internal state to the user
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ ...transitionFade, headerShown: false }} />
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
