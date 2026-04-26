import React, { useEffect, useMemo } from 'react';
import { Dimensions, View, StatusBar, Pressable } from 'react-native';
import { Stack, usePathname, useRouter } from 'expo-router';
import HeaderNav from '@/constants/navigation/HeaderNav';
import { Colors } from '@/themes/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { transitionFade } from '@/constants/transitions';

const PAGES = [
  { label: 'Vigentes', route: '/employee/jobs' },
  { label: 'Finalizados', route: '/employee/jobs/history' },
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const TIMING_CFG = { duration: 180, easing: Easing.out(Easing.cubic) };
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.55;

export default function EmployeeJobsLayout() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const isDetail = pathname?.startsWith('/employee/jobs/job-details');
  const bg = Colors.gray1;

  const activeIndex = useMemo(() => {
    return pathname.startsWith('/employee/jobs/history') ? 1 : 0;
  }, [pathname]);

  const dragProgress = useSharedValue(0);
  const startProgress = useSharedValue(0);

  useEffect(() => {
    if (Math.abs(dragProgress.value - activeIndex) > 0.05) {
      dragProgress.value = withTiming(activeIndex, TIMING_CFG);
    }
  }, [activeIndex]);

  const navigateTo = (idx: number) => {
    if (idx === activeIndex) return;
    router.replace(PAGES[idx].route as any);
  };

  const handleTabPress = (idx: number) => {
    dragProgress.value = withTiming(idx, TIMING_CFG);
    router.replace(PAGES[idx].route as any);
  };

  const swipeGesture = Gesture.Pan()
    .enabled(!isDetail)
    .activeOffsetX([-10, 10])
    .failOffsetY([-15, 15])
    .onBegin(() => {
      startProgress.value = dragProgress.value;
    })
    .onUpdate((e) => {
      const delta = -e.translationX / SWIPE_THRESHOLD;
      const next = startProgress.value + delta;
      dragProgress.value = Math.max(0, Math.min(next, PAGES.length - 1));
    })
    .onEnd((e) => {
      const vel = -e.velocityX;
      const current = dragProgress.value;
      let target: number;

      if (vel > 300) {
        target = Math.min(Math.ceil(current - 0.1), PAGES.length - 1);
      } else if (vel < -300) {
        target = Math.max(Math.floor(current + 0.1), 0);
      } else {
        target = Math.round(current);
      }

      target = Math.max(0, Math.min(target, PAGES.length - 1));
      dragProgress.value = withTiming(target, TIMING_CFG);
      runOnJS(navigateTo)(target);
    });

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View style={{ height: insets.top, backgroundColor: bg }} />

      {!isDetail && (
        <HeaderNav
          title="Trabajos"
          pages={PAGES}
          activeRoute={pathname}
          bgColor={bg}
          underlineColor={Colors.gray2}
          dragProgress={dragProgress}
          onTabPress={handleTabPress}
        />
      )}

      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerTransparent: true,
              headerTitle: '',
              headerLeft: () => (
                <Pressable
                  onPress={() => router.back()}
                  style={{ paddingHorizontal: 10 }}
                >
                  <Ionicons name="arrow-back" size={28} color={Colors.violet4} />
                </Pressable>
              ),
              contentStyle: { backgroundColor: bg },
              statusBarTranslucent: true,
              statusBarBackgroundColor: 'transparent',
            }}
          >
            <Stack.Screen name="index" options={{ ...transitionFade, headerShown: false }} />
            <Stack.Screen name="history" options={{ ...transitionFade, headerShown: false }} />
          </Stack>
        </Animated.View>
      </GestureDetector>
    </>
  );
}
