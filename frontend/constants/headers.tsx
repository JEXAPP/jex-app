// src/constants/headers.tsx
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/themes/colors';
import { router } from 'expo-router';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export const emptyHeader: NativeStackNavigationOptions = {
  headerShown: false,
};

export const backHeader: NativeStackNavigationOptions = {
  title: '',
  headerTransparent: true,
  headerLeft: () => (
    <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 16 }}>
      <Ionicons name="arrow-back" size={28} color={Colors.violet5} />
    </Pressable>
  ),
};

export const exitHeader = (to: `/`): NativeStackNavigationOptions => ({
  title: '',
  headerTransparent: true,
  headerLeft: () => (
    <Pressable onPress={() => router.push(to)} style={{ paddingHorizontal: 16 }}>
      <Ionicons name="close" size={28} color={Colors.violet5} />
    </Pressable>
  ),
});

