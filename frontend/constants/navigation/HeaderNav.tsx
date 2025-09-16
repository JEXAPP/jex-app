import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, LayoutChangeEvent } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { PanGestureHandler, PanGestureHandlerStateChangeEvent } from 'react-native-gesture-handler';
import { headerNavStyles as s } from '@/styles/constants/headerNavStyles';

type Page = { label: string; route: string };

type Props = {
  pages: Page[];
  /** Si la ruta no matchea, índice inicial */
  fallbackIndex?: number;
  /** Callback opcional al cambiar de índice */
  onIndexChange?: (index: number) => void;
  /** Título opcional (dentro del componente) */
  title?: string;
};

export default function HeaderNav({ pages, fallbackIndex = 0, onIndexChange, title }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  // Índice activo por ruta
  const routeIndex = useMemo(() => {
    const i = pages.findIndex(p => pathname?.startsWith(p.route));
    return i >= 0 ? i : fallbackIndex;
  }, [pathname, pages, fallbackIndex]);

  const [activeIndex, setActiveIndex] = useState(routeIndex);

  useEffect(() => {
    if (routeIndex !== activeIndex) {
      setActiveIndex(routeIndex);
      onIndexChange?.(routeIndex);
      animateTo(routeIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeIndex]);

  // Medición de tabs para indicador
  const tabLayouts = useRef<{ x: number; w: number }[]>([]);
  const indicatorX = useRef(new Animated.Value(0)).current;
  const indicatorW = useRef(new Animated.Value(0)).current;

  const onTabLayout = (i: number) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    tabLayouts.current[i] = { x, w: width };
    if (i === activeIndex) {
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
    setActiveIndex(next);
    onIndexChange?.(next);
    animateTo(next);
    router.replace(pages[next].route as any);
  };

  const onPressTab = (i: number) => {
    if (i === activeIndex) return;
    goToIndex(i);
  };

  // (Swipe de barra lo dejamos; el swipe de PANTALLA lo vemos después)
  const SWIPE_THRESHOLD = 30;
  const onGestureEvent = (e: PanGestureHandlerStateChangeEvent) => {
    const { oldState, translationX } = e.nativeEvent as any;
    if (oldState === 4 || oldState === 5 || oldState === 2) {
      if (translationX <= -SWIPE_THRESHOLD) goToIndex(activeIndex + 1);
      else if (translationX >= SWIPE_THRESHOLD) goToIndex(activeIndex - 1);
    }
  };

  return (
    <PanGestureHandler onHandlerStateChange={onGestureEvent}>
      <View>
        {title ? <Text style={s.title}>{title}</Text> : null}

        <View style={s.bar}>
          {pages.map((p, i) => (
            <Pressable
              key={p.route}
              style={s.tab}               // <- ocupa ancho igual (flex:1 en estilos)
              onPress={() => onPressTab(i)}
              onLayout={onTabLayout(i)}
            >
              <Text style={[s.tabText, i === activeIndex ? s.tabTextActive : null]}>
                {p.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={s.baseLine} />

        <Animated.View
          style={[
            s.indicator,
            { left: indicatorX, width: indicatorW },
          ]}
        />
      </View>
    </PanGestureHandler>
  );
}
