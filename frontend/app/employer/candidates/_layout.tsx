import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { Dimensions, View } from 'react-native';
import { Stack, usePathname, useRouter } from 'expo-router';
import HeaderNav from '@/constants/navigation/HeaderNav';
import { Colors } from '@/themes/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { SharedEvent } from '@/hooks/employer/candidates/useSharedEventSelector';
import { useGlobalEvent } from '@/app/employer/_layout';
import EventSelectorHeader from '@/components/employer/EventSelectorHeader';

const PAGES = [
  { label: 'Postulaciones', route: '/employer/candidates' },
  { label: 'Ofertas', route: '/employer/candidates/offers' },
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const TIMING_CFG = { duration: 180, easing: Easing.out(Easing.cubic) };
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.55;

type CandidatesEventCtx = {
  events: SharedEvent[];
  currentEvent: SharedEvent | null;
  currentEventIndex: number;
  loadingEvents: boolean;
};

const CandidatesEventContext = createContext<CandidatesEventCtx>({
  events: [],
  currentEvent: null,
  currentEventIndex: 0,
  loadingEvents: false,
});

export function useCandidatesEvent() {
  return useContext(CandidatesEventContext);
}

export default function EmployerCandidatesLayout() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { events, currentEvent, loading: loadingEvents } = useGlobalEvent();

  const currentEventIndex = useMemo(
    () => events.findIndex(e => e.id === currentEvent?.id),
    [events, currentEvent],
  );

  const isDetail =
    pathname?.startsWith('/employer/candidates/detail') ||
    (pathname?.startsWith('/employer/candidates/offer') &&
      !pathname.startsWith('/employer/candidates/offers'));

  const bg = isDetail ? Colors.violet4 : Colors.gray1;

  const activeIndex = useMemo(() => {
    return pathname.startsWith('/employer/candidates/offers') ? 1 : 0;
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

  const ctxValue = useMemo(
    () => ({
      events: events as SharedEvent[],
      currentEvent: currentEvent as SharedEvent | null,
      currentEventIndex,
      loadingEvents,
    }),
    [events, currentEvent, currentEventIndex, loadingEvents],
  );

  return (
    <CandidatesEventContext.Provider value={ctxValue}>
      {/* Top safe-area fill for detail screens (offer creation, etc.).
          Non-detail screens are covered by EventSelectorHeader's own paddingTop. */}
      {isDetail && <View style={{ height: insets.top, backgroundColor: bg }} />}

      {!isDetail && (
        <>
          <EventSelectorHeader />

          <HeaderNav
            pages={PAGES}
            activeRoute={pathname}
            bgColor={bg}
            underlineColor={Colors.gray2}
            dragProgress={dragProgress}
            onTabPress={handleTabPress}
          />
        </>
      )}

      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: bg, paddingTop: isDetail ? 0 : 10 },
              statusBarStyle: isDetail ? 'light' : 'dark',
              statusBarTranslucent: true,
              statusBarBackgroundColor: 'transparent',
            }}
          />
        </Animated.View>
      </GestureDetector>
    </CandidatesEventContext.Provider>
  );
}
