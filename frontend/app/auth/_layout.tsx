import { exitHeader } from '@/constants/headers';
import { transitionFade } from '@/constants/transitions';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { Pressable } from 'react-native';
import { Colors } from '@/themes/colors';
import React from 'react';

export default function AuthLayout() {
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
      <Stack.Screen
        name="additional-info/step-one"
        options={{ ...transitionFade, headerShown: false }}
      />
      <Stack.Screen
        name="additional-info/step-two"
        options={{ ...transitionFade, headerShown: false }}
      />
      <Stack.Screen
        name="additional-info/step-three"
        options={{ ...transitionFade, headerShown: false }}
      />
      <Stack.Screen
        name="additional-info/step-employer"
        options={{ ...transitionFade, headerShown: false }}
      />
      <Stack.Screen
        name="reset-password/index"
        options={{ ...exitHeader('/'), ...transitionFade }}
      />
      <Stack.Screen
        name="reset-password/code-validation"
        options={{ ...exitHeader('/'), ...transitionFade }}
      />
      <Stack.Screen
        name="reset-password/new-password"
        options={{ ...exitHeader('/'), ...transitionFade }}
      />
    </Stack>
  );
}