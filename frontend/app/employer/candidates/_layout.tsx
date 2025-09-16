import React from 'react';
import { Stack, usePathname } from 'expo-router';
import { View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderNav from '@/constants/navigation/HeaderNav';
import { Colors } from '@/themes/colors';

export default function EmployerCandidatesLayout() {
  const pathname = usePathname();
  const hideHeader = pathname?.startsWith('/employer/candidates/detail');

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: hideHeader ? Colors.violet4 : Colors.gray1,
      }}
      edges={['top']}
    >
      {/* 🔹 Status bar config */}
      <StatusBar
        translucent={false}
        backgroundColor={hideHeader ? Colors.violet4 : Colors.gray1}
        barStyle={hideHeader ? 'light-content' : 'dark-content'}
      />

      {!hideHeader && (
        <HeaderNav
          title="Empleados"
          pages={[
            { label: 'Postulaciones', route: '/employer/candidates' },
            { label: 'Búsqueda', route: '/employer/candidates/search' },
          ]}
        />
      )}

      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </SafeAreaView>
  );
}
