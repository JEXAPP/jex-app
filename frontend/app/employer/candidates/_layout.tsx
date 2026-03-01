// app/employer/candidates/_layout.tsx
import React from 'react';
import { View, StatusBar } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import HeaderNav from '@/constants/navigation/HeaderNav';
import { Colors } from '@/themes/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EmployerCandidatesLayout() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isDetail =
    pathname?.startsWith('/employer/candidates/detail') ||
    pathname?.startsWith('/employer/candidates/offer');

  const bg = isDetail ? Colors.violet4 : Colors.gray1;

  return (
    <>
      {/* StatusBar transparente, texto acorde al fondo */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDetail ? 'light-content' : 'dark-content'}
      />

      {/* SIEMPRE pintamos el área del notch / status bar */}
      <View style={{ height: insets.top, backgroundColor: bg}} />

      {/* Header solo en no-detail */}
      {!isDetail && (
        <HeaderNav
          title="Empleados"
          pages={[
            { label: 'Postulaciones', route: '/employer/candidates' },
            { label: 'Búsqueda', route: '/employer/candidates/search' },
          ]}
          activeRoute={pathname}
          aliases={{
            '/employer/candidates/search': ['/employer/candidates/results'],
          }}
          bgColor={bg}
          underlineColor={Colors.violet2}
        />
      )}

        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: bg },
            // Esto no pinta el status bar, solo mantiene coherencia
            statusBarStyle: isDetail ? 'light' : 'dark',
            statusBarTranslucent: true,
            statusBarBackgroundColor: 'transparent',
          }}
        />

    </>
  );
}
