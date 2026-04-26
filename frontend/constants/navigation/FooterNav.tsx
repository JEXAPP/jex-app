import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, Pressable, Text, View } from 'react-native';
import { usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Colors } from '@/themes/colors';

export interface NavTab {
  icon: (active: boolean, size: number, color: string) => React.ReactNode;
  label: string;
  isActive: (pathname: string, basePath: string) => boolean;
  navigate: (basePath: string) => void;
}

interface FooterNavProps {
  basePath: string;
  tabs: NavTab[];
}

const ICON_SIZE = 22;
export const FOOTER_HEIGHT = 80;
const PILL_INSET = 5;

// Para tap: timing rápido y determinista, sin cola de spring
const TAP_CFG = { duration: 180, easing: Easing.out(Easing.cubic) };
// Para drag release: spring que snappea naturalmente
const DRAG_SPRING = { damping: 40, stiffness: 420, overshootClamping: true };

const FooterNav: React.FC<FooterNavProps> = ({ basePath, tabs }) => {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const [tabWidthState, setTabWidthState] = useState(0);
  const tabWidth = useSharedValue(0);
  const pillX = useSharedValue(0);
  const startX = useSharedValue(0);
  const initialized = useRef(false);

  const activeIndex = tabs.findIndex((tab) => tab.isActive(pathname, basePath));
  const safeActive = activeIndex === -1 ? 0 : activeIndex;

  // Sólo para navegación externa (back, deep links) — no dispara al tocar
  useEffect(() => {
    if (tabWidthState <= 0) return;
    if (!initialized.current) {
      initialized.current = true;
      pillX.value = safeActive * tabWidthState;
    } else {
      pillX.value = withTiming(safeActive * tabWidthState, TAP_CFG);
    }
  }, [safeActive, tabWidthState]);

  const navigateTo = useCallback(
    (idx: number) => { tabs[idx]?.navigate(basePath); },
    [tabs, basePath],
  );

  // Tap: mueve el pill INMEDIATAMENTE al tocar, sin esperar el cambio de ruta
  const handleTabPress = useCallback(
    (idx: number) => {
      if (tabWidthState > 0) {
        pillX.value = withTiming(idx * tabWidthState, TAP_CFG);
      }
      tabs[idx].navigate(basePath);
    },
    [tabs, basePath, tabWidthState],
  );

  const panGesture = Gesture.Pan()
    .minDistance(8)
    .onBegin(() => {
      startX.value = pillX.value;
    })
    .onUpdate((e) => {
      const tw = tabWidth.value;
      if (tw <= 0) return;
      const next = startX.value + e.translationX;
      pillX.value = Math.max(0, Math.min(next, (tabs.length - 1) * tw));
    })
    .onEnd(() => {
      const tw = tabWidth.value;
      if (tw <= 0) return;
      const nearest = Math.round(pillX.value / tw);
      const clamped = Math.max(0, Math.min(nearest, tabs.length - 1));
      pillX.value = withSpring(clamped * tw, DRAG_SPRING);
      runOnJS(navigateTo)(clamped);
    });

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillX.value }],
  }));

  const pillWidth = tabWidthState > 0 ? tabWidthState - PILL_INSET * 2 : 0;

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: insets.bottom,
        height: FOOTER_HEIGHT,
        backgroundColor: Colors.gray1,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: -3 },
        elevation: 14,
      }}
      onLayout={(e: LayoutChangeEvent) => {
        const w = e.nativeEvent.layout.width / tabs.length;
        setTabWidthState(w);
        tabWidth.value = w;
      }}
    >
      {pillWidth > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              top: 7,
              bottom: 8,
              left: PILL_INSET,
              width: pillWidth,
              borderRadius: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.97)',
              shadowColor: Colors.violet3,
              shadowOpacity: 0.12,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 2 },
              elevation: 3,
            },
            pillStyle,
          ]}
        />
      )}

      <GestureDetector gesture={panGesture}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {tabs.map((tab, idx) => {
            const active = tab.isActive(pathname, basePath);
            const color = active ? Colors.violet4 : Colors.gray2;
            return (
              <Pressable
                key={idx}
                accessibilityRole="button"
                onPress={() => handleTabPress(idx)}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 10,
                  paddingBottom: 6,
                  gap: 3,
                }}
              >
                {tab.icon(active, ICON_SIZE, color)}
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 11,
                    fontFamily: active ? 'titulos' : 'titulos',
                    color,
                    letterSpacing: -0.1,
                  }}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </GestureDetector>
    </View>
  );
};

export default FooterNav;
