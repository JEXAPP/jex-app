import { exitHeader } from '@/constants/headers';
import { transitionFade } from '@/constants/transitions';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { Pressable } from 'react-native';
import { Colors } from '@/themes/colors';

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