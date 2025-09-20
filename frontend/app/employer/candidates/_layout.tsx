// app/employer/candidates/_layout.tsx
import React from 'react';
import { View, StatusBar } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderNav from '@/constants/navigation/HeaderNav';
import { Colors } from '@/themes/colors';

export default function EmployerCandidatesLayout() {
  const pathname = usePathname();

  const isDetail =
    pathname?.startsWith('/employer/candidates/detail') ||
    pathname?.startsWith('/employer/candidates/offer');

  const bg = isDetail ? Colors.violet4 : Colors.gray1;

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      {/* StatusBar NO translúcida y igual color */}
      <StatusBar translucent={false} backgroundColor={bg}
        barStyle={isDetail ? 'light-content' : 'dark-content'} />

      <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={['top','bottom']}>
        {!isDetail && (
          <HeaderNav
            title="Empleados"
            pages={[
              { label: 'Postulaciones', route: '/employer/candidates' },
              { label: 'Búsqueda', route: '/employer/candidates/search' },
            ]}
            activeRoute={pathname}
            aliases={{
              '/employer/candidates/search': [
                '/employer/candidates/search/results', // tu ruta de resultados
              ],
            }}
            bgColor={bg}
            underlineColor={Colors.violet2}
          />


        )}

        <View style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: bg }, // 👈 mismo fondo en el stack
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
