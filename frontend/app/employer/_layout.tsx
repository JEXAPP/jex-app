import FooterNavEmployer, { FOOTER_HEIGHT } from '@/constants/navigation/FooterNavEmployer';
import { transitionFade } from '@/constants/transitions';
import { Pressable, View, StatusBar } from 'react-native';
import { Stack, router, usePathname } from 'expo-router';
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/themes/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTokenValidations } from '@/services/internal/useTokenValidations';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';
import { useGlobalEventSelector, type GlobalEvent } from '@/hooks/employer/useGlobalEventSelector';

// ─── Global event context ─────────────────────────────────────────────────────

type GlobalEventCtx = {
  events: GlobalEvent[];
  currentEvent: GlobalEvent | null;
  setCurrentEvent: (id: number) => void;
  loading: boolean;
  refresh: () => void;
};

export const GlobalEventContext = createContext<GlobalEventCtx>({
  events: [],
  currentEvent: null,
  setCurrentEvent: () => {},
  loading: false,
  refresh: () => {},
});

export function useGlobalEvent() {
  return useContext(GlobalEventContext);
}

// ─────────────────────────────────────────────────────────────────────────────

export default function EmployerLayoutRoot() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { validateToken } = useTokenValidations();

  const { events, currentEvent, setCurrentEvent, loading, refresh } = useGlobalEventSelector();

  // SECURITY: RBAC guard — redirect to login if the token is missing or belongs
  // to a different role. Runs on every mount of the employer section.
  useEffect(() => {
    (async () => {
      const result = await validateToken('employer');
      if (!result.ok) {
        router.replace('/');
      }
    })();
  }, []);

  const globalCtxValue = useMemo(
    () => ({ events, currentEvent, setCurrentEvent, loading, refresh }),
    [events, currentEvent, setCurrentEvent, loading, refresh],
  );

  // Ocultar footer en pantalla de chat
  const hideFooter = pathname.startsWith('/employer/chats/thread');

  const isDetail =
    pathname.startsWith('/employer/profile/view-profile') ||
    pathname.startsWith('/employer/candidates/detail') ||
    pathname.startsWith('/employer/chats/thread');

  // Profile section uses a light background — keep dark status-bar icons there.
  // All other sections (Panel, Empleados, Chats) have the violet EventSelectorHeader
  // at the top, so status-bar icons must be white.
  const isProfile = pathname.startsWith('/employer/profile');
  const barStyle: 'light-content' | 'dark-content' =
    !isDetail && isProfile ? 'dark-content' : 'light-content';

  const bg = isDetail ? Colors.violet4 : Colors.gray1;

  return (
    <GlobalEventContext.Provider value={globalCtxValue}>
      {/* SECURITY: ErrorBoundary prevents render errors from crashing the entire employer section */}
      <ErrorBoundary>
      <View style={{ flex: 1 }}>

        {/* Barra de estado */}
        <StatusBar
          translucent
          barStyle={barStyle}
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
          <Stack.Screen name="panel/vacancy/manipulate-vacancy" options={{ ...transitionFade, headerShown: false }} />
          <Stack.Screen name="chats/index" options={{ ...transitionFade, headerShown: false }} />
          <Stack.Screen name="chats/thread" options={{ ...transitionFade, headerShown: false }} />
          <Stack.Screen name="profile/index" options={{ ...transitionFade, headerShown: false }} />
          <Stack.Screen name="profile/view-profile" options={{ ...transitionFade, headerShown: false }} />
        </Stack>

        {/* FOOTER */}
        {!hideFooter && <FooterNavEmployer basePath="/employer" />}
        {!hideFooter && <View style={{ height: FOOTER_HEIGHT + insets.bottom }} />}
      </View>
      </ErrorBoundary>
    </GlobalEventContext.Provider>
  );
}
