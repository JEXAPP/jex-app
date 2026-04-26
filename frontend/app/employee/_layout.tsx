import { Stack, router, usePathname } from 'expo-router';
import React, { useEffect } from "react";
import { View, Pressable, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FooterNavEmployee, { FOOTER_HEIGHT } from "@/constants/navigation/FooterNavEmployee";
import { Colors } from "@/themes/colors";
import { transitionFade } from "@/constants/transitions";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTokenValidations } from '@/services/internal/useTokenValidations';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';

export default function EmployeeLayout() {
  const pathname = usePathname();
  const hideFooter = pathname.startsWith('/employee/chats/thread');
  const insets = useSafeAreaInsets();
  const { validateToken } = useTokenValidations();

  // SECURITY: RBAC guard — redirect to login if the token is missing or belongs
  // to a different role. Runs on every mount of the employee section.
  useEffect(() => {
    (async () => {
      const result = await validateToken('employee');
      if (!result.ok) {
        router.replace('/');
      }
    })();
  }, []);

  const isDetail =
      pathname?.startsWith('/employee/vacancy/apply-vacancy') ||
      pathname?.startsWith('/employee/chats/thread')
  
  const bg = isDetail ? Colors.violet4 : Colors.gray1

  return (
    // SECURITY: ErrorBoundary prevents render errors from crashing the entire employee section
    <ErrorBoundary>
    <View style={{ flex: 1 }}>

      <StatusBar
        translucent
        barStyle={isDetail ? 'light-content' : 'dark-content'}
      />
      {isDetail ? (<View style={{ height: insets.top, backgroundColor: bg}} />) : <></>}
     <Stack
        screenOptions={{
          headerTransparent: true,
          headerTitle: "",
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 10 }}>
              <Ionicons name="arrow-back" size={28} color={Colors.violet4} />
            </Pressable>
          ),
        }}
      >
        <Stack.Screen name="index" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="vacancy/apply-vacancy" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="offers/index" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="jobs" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="chats/index" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="chats/thread" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="chats/threads" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="profile/index" options={{ ...transitionFade, headerShown: false }} />
        <Stack.Screen name="profile/view-profile" options={{ ...transitionFade, headerShown: false }} />
      </Stack>

      {!hideFooter && <FooterNavEmployee basePath="/employee" />}

      {!hideFooter && <View style={{ height: FOOTER_HEIGHT + insets.bottom }} />}
    </View>
    </ErrorBoundary>
  );
}