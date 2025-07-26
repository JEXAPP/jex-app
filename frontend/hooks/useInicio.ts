// src/hooks/useSplashLogic.ts
import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Animated } from 'react-native';

export const useInicio = () => {
    const router = useRouter();

    const scaleAnim = useRef(new Animated.Value(0.7)).current;

    useEffect(() => {
    // Animación de zoom in
    Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
    }).start();

    // Redirección después de 3 segundos
    const timer = setTimeout(() => {
        router.replace('/aditional-info');
    }, 3000);

    return () => clearTimeout(timer);
    }, [router, scaleAnim]);

    return { scaleAnim }
}