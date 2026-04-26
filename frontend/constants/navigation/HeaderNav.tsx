import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, Pressable, LayoutChangeEvent } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { headerNavStyles as s } from '@/styles/constants/headerNavStyles';

type Page = { label: string; route: string };

type Props = {
  pages: Page[];
  fallbackIndex?: number;
  onIndexChange?: (index: number) => void;
  title?: string;
  activeRoute?: string;
  bgColor?: string;
  underlineColor?: string;
  aliases?: Record<string, Array<string | RegExp>>;
  // Si se pasa desde el padre (para swipe), HeaderNav lo usa como fuente de verdad
  dragProgress?: SharedValue<number>;
  // El padre gestiona los taps cuando controla dragProgress
  onTabPress?: (idx: number) => void;
};

const TIMING_CFG = { duration: 180, easing: Easing.out(Easing.cubic) };

export default function HeaderNav({
  pages,
  fallbackIndex = 0,
  onIndexChange,
  title,
  activeRoute,
  bgColor,
  underlineColor,
  aliases,
  dragProgress,
  onTabPress,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const currentPath = activeRoute ?? pathname ?? '';

  const routeIndex = useMemo(() => {
    let bestIdx = -1, bestScore = -1;
    const score = (matcher: string | RegExp, path: string): number => {
      if (typeof matcher === 'string') {
        const exact = path === matcher;
        const base = matcher.endsWith('/') ? matcher : matcher + '/';
        const nested = path.startsWith(base);
        if (exact) return matcher.length + 2;
        if (nested) return matcher.length;
        return -1;
      }
      return matcher.test(path) ? 1 : -1;
    };
    pages.forEach((p, idx) => {
      const cands = [p.route, ...(aliases?.[p.route] ?? [])];
      const pageBest = cands.reduce((acc, m) => Math.max(acc, score(m, currentPath)), -1);
      if (pageBest > bestScore) { bestScore = pageBest; bestIdx = idx; }
    });
    return bestIdx >= 0 ? bestIdx : fallbackIndex;
  }, [currentPath, pages, fallbackIndex, aliases]);

  // Solo se usa cuando no hay dragProgress externo
  const internalProgress = useSharedValue(routeIndex);
  const progress = dragProgress ?? internalProgress;

  const barWidthShared = useSharedValue(0);
  const prevRouteIndex = useRef(routeIndex);

  useEffect(() => {
    if (routeIndex === prevRouteIndex.current) return;
    prevRouteIndex.current = routeIndex;
    onIndexChange?.(routeIndex);
    // Si no hay control externo, animamos internamente
    if (!dragProgress) {
      internalProgress.value = withTiming(routeIndex, TIMING_CFG);
    }
  }, [routeIndex]);

  // Indicador: posición = tabWidth * (progress + 0.2), ancho = tabWidth * 0.6
  const indicatorStyle = useAnimatedStyle(() => {
    const tw = barWidthShared.value / pages.length;
    if (tw <= 0) return { left: 0, width: 0 };
    return {
      left: tw * (progress.value + 0.2),
      width: tw * 0.6,
    };
  });

  const handlePressTab = (i: number) => {
    if (i === routeIndex) return;
    if (onTabPress) {
      // El padre controla la animación y navegación
      onTabPress(i);
    } else {
      internalProgress.value = withTiming(i, TIMING_CFG);
      onIndexChange?.(i);
      router.replace(pages[i].route as any);
    }
  };

  return (
    <View style={{ backgroundColor: bgColor ?? 'transparent' }}>
      {title ? <Text style={s.title}>{title}</Text> : null}

      <View
        style={[s.bar, { backgroundColor: bgColor ?? 'transparent' }]}
        onLayout={(e: LayoutChangeEvent) => {
          barWidthShared.value = e.nativeEvent.layout.width;
        }}
      >
        {pages.map((p, i) => (
          <Pressable
            key={p.route}
            style={s.tab}
            onPress={() => handlePressTab(i)}
          >
            <Text style={[s.tabText, i === routeIndex ? s.tabTextActive : null]}>
              {p.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={[s.baseLine, { backgroundColor: underlineColor ?? 'transparent' }]} />
      <Animated.View style={[s.indicator, indicatorStyle]} />
    </View>
  );
}
