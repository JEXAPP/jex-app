import React, { memo } from 'react';
import { View, Pressable } from 'react-native';
import { usePathname, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { footerNavStyles2 as s } from '@/styles/constants/footerNavStyles2';
import { Colors } from '@/themes/colors';
import { iconos } from '../iconos';

type Props = {
  basePath: '/employee';
  styles?: typeof s;
};

const ICON_SIZE = 24;
const FOOTER_HEIGHT = 65;

const FooterNavEmployee: React.FC<Props> = ({ basePath }) => {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isActive = (slot: number) => {
    if (slot === 0) return pathname === basePath || pathname.startsWith(`${basePath}/vacancy`);
    if (slot === 1) return pathname.startsWith(`${basePath}/offers`);
    if (slot === 2) return pathname.startsWith(`${basePath}/jobs`);
    if (slot === 4) return pathname.startsWith(`${basePath}/profile`);
    if (slot === 3) return pathname.startsWith(`${basePath}/chats`);
    return false;
  };

  const onPress = (slot: number) => {
    if (slot === 0) router.replace(basePath);
    if (slot === 1) router.push(`${basePath}/offers`);
    if (slot === 2) router.push(`${basePath}/jobs`);
    if (slot === 4) router.push(`${basePath}/profile` as any);
    if (slot === 3) router.push(`${basePath}/chats`);
  };

  const isDisabled = (slot: number) => slot > 4;

  return (
    <View
      style={[
        s.container,
        {
          bottom: insets.bottom,
          height: FOOTER_HEIGHT,
        },
      ]}
    >
      <Pressable accessibilityRole="button" hitSlop={8} onPress={() => onPress(0)} disabled={isDisabled(0)} style={s.item}>
        {isActive(0)
          ? iconos.footer_home(true, ICON_SIZE, Colors.violet4)
          : iconos.footer_home(false, ICON_SIZE, Colors.violet4)}
      </Pressable>

      <Pressable accessibilityRole="button" hitSlop={8} onPress={() => onPress(1)} disabled={isDisabled(1)} style={s.item}>
        {isActive(1)
          ? iconos.footer_inbox(true, ICON_SIZE, Colors.violet4)
          : iconos.footer_inbox(false, ICON_SIZE, Colors.violet4)}
      </Pressable>

      <Pressable accessibilityRole="button" hitSlop={8} onPress={() => onPress(2)} disabled={isDisabled(2)} style={s.item}>
        {isActive(2)
          ? iconos.footer_briefcase(true, ICON_SIZE, Colors.violet4)
          : iconos.footer_briefcase(false, ICON_SIZE, Colors.violet4)}
      </Pressable>

      <Pressable accessibilityRole="button" hitSlop={8} onPress={() => onPress(3)} disabled={isDisabled(3)} style={s.item}>
        {isActive(3)
          ? iconos.footer_chat(true, ICON_SIZE, Colors.violet4)
          : iconos.footer_chat(false, ICON_SIZE, Colors.violet4)}
      </Pressable>

      <Pressable accessibilityRole="button" hitSlop={8} onPress={() => onPress(4)} disabled={isDisabled(4)} style={s.item}>
        {isActive(4)
          ? iconos.footer_person(true, ICON_SIZE, Colors.violet4)
          : iconos.footer_person(false, ICON_SIZE, Colors.violet4)}
      </Pressable>
    </View>
  );
};

export default memo(FooterNavEmployee);
export { FOOTER_HEIGHT };
