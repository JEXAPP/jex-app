import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, LayoutChangeEvent } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { headerNavStyles as s } from '@/styles/constants/headerNavStyles';

type Page = { label: string; route: string };

type Props = {
  pages: Page[];
  fallbackIndex?: number;
  onIndexChange?: (index: number) => void;
  title?: string;
  activeRoute?: string;       // controla la ruta activa (opcional)
  bgColor?: string;           // fondo para evitar “gris”
  underlineColor?: string;    // color de línea inferior (opcional)
  aliases?: Record<string, Array<string | RegExp>>; // rutas extra que activan un tab
};

export default function HeaderNav({
  pages,
  fallbackIndex = 0,
  onIndexChange,
  title,
  activeRoute,
  bgColor,
  underlineColor,
  aliases,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const currentPath = activeRoute ?? pathname ?? '';

  // Índice activo con soporte de aliases y “match más específico”
  const routeIndex = useMemo(() => {
    let bestIdx = -1, bestScore = -1;

    const score = (matcher: string | RegExp, path: string): number => {
      if (typeof matcher === 'string') {
        const exact = path === matcher;
        const base = matcher.endsWith('/') ? matcher : matcher + '/';
        const nested = path.startsWith(base);
        if (exact) return matcher.length + 2; // exacto > nested
        if (nested) return matcher.length;    // por longitud
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

  // Animación del indicador
  const [activeIndex, setActiveIndex] = useState(routeIndex);
  const tabLayouts = useRef<{ x: number; w: number }[]>([]);
  const indicatorX = useRef(new Animated.Value(0)).current;
  const indicatorW = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (routeIndex !== activeIndex) {
      setActiveIndex(routeIndex);
      onIndexChange?.(routeIndex);
      animateTo(routeIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeIndex]);

  const onTabLayout = (i: number) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    tabLayouts.current[i] = { x, w: width };
    if (i === routeIndex) {
      indicatorX.setValue(x + width * 0.2);
      indicatorW.setValue(width * 0.6);
    }
  };

  const animateTo = (index: number) => {
    const lay = tabLayouts.current[index];
    if (!lay) return;
    Animated.parallel([
      Animated.timing(indicatorX, { toValue: lay.x + lay.w * 0.2, duration: 200, useNativeDriver: false }),
      Animated.timing(indicatorW, { toValue: lay.w * 0.6, duration: 200, useNativeDriver: false }),
    ]).start();
  };

  const goToIndex = (next: number) => {
    if (next < 0 || next >= pages.length) return;
    setActiveIndex(next); // optimista para animación
    onIndexChange?.(next);
    animateTo(next);
    router.replace(pages[next].route as any);
  };

  const onPressTab = (i: number) => {
    if (i === routeIndex) return;
    goToIndex(i);
  };

  return (
    <View style={{ backgroundColor: bgColor }}>
      {title ? <Text style={s.title}>{title}</Text> : null}

      <View style={[s.bar, { backgroundColor: bgColor }]}>
        {pages.map((p, i) => {
          const isActive = i === routeIndex;
          return (
            <Pressable
              key={p.route}
              style={s.tab}
              onPress={() => onPressTab(i)}
              onLayout={onTabLayout(i)}
            >
              <Text style={[s.tabText, isActive ? s.tabTextActive : null]}>
                {p.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={s.baseLine} />
      <Animated.View style={[s.indicator, { left: indicatorX, width: indicatorW }]} />
    </View>
  );
}
