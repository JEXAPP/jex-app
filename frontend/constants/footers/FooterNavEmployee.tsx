import React, { memo } from 'react';
import { View, Pressable } from 'react-native';
import { usePathname, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { footerNavStyles1 as s } from '@/styles/constants/footerNavStyles1';
import { Colors } from '@/themes/colors';
import { iconos } from '../iconos';

type Props = {
  basePath: '/employee';
  styles?: typeof s;
};

const ICON_SIZE = 24;

const FooterNavEmployee: React.FC<Props> = ({ basePath }) => {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // Activar
  const isActive = (slot: number) => {
    if (slot === 0) return pathname === basePath || pathname.startsWith(`${basePath}/vacancy`);
    if (slot === 1) return pathname.startsWith(`${basePath}/offers`);
    if (slot === 2) return pathname.startsWith(`${basePath}/jobs/activeJobs`);
    return false;
  };

  // Navegar
  const onPress = (slot: number) => {
    if (slot === 0) router.replace(basePath);
    if (slot === 1) router.push(`${basePath}/offers`);
    if (slot === 2) router.push(`${basePath}/jobs/activeJobs`);
  };

  // Deshabilitar
  const isDisabled = (slot: number) => {
    // ahora habilitamos 0 (home) y 1 (inbox/offers)
    return slot > 2;
  };

  return (
    <View style={[s.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {/* 1) Home */}
      <Pressable
        accessibilityRole="button"
        hitSlop={8}
        onPress={() => onPress(0)}
        disabled={isDisabled(0)}
        style={s.item}
      >
        {isActive(0) 
          ? iconos.footer_home(true, ICON_SIZE, Colors.white)
          : iconos.footer_home(false, ICON_SIZE, Colors.white)
        }
      </Pressable>

      <Pressable
        accessibilityRole="button"
        hitSlop={8}
        onPress={() => onPress(1)}
        disabled={isDisabled(1)}
        style={s.item}
      >
        {isActive(1)
          ? iconos.footer_inbox(true, ICON_SIZE, Colors.white)
          : iconos.footer_inbox(false, ICON_SIZE, Colors.white)
        }
      </Pressable>

      {/* 3) Briefcase (MaterialCommunityIcons) */}
      <Pressable
        accessibilityRole="button"
        hitSlop={8}
        onPress={() => onPress(2)}
        disabled={isDisabled(2)}
        style={s.item}
      >
        {isActive(2)
          ? iconos.footer_briefcase(true, ICON_SIZE, Colors.white)
          : iconos.footer_briefcase(false, ICON_SIZE, Colors.white)
        }
      </Pressable>

      {/* 4) Chat (MaterialIcons) */}
      <Pressable
        accessibilityRole="button"
        hitSlop={8}
        onPress={() => onPress(3)}
        disabled={isDisabled(3)}
        style={s.item}
      >
        {iconos.footer_chat(false, ICON_SIZE, Colors.white)}
      </Pressable>

      {/* 5) Person (Octicons) */}
      <Pressable
        accessibilityRole="button"
        hitSlop={8}
        onPress={() => onPress(4)}
        disabled={isDisabled(4)}
        style={s.item}
      >
        {iconos.footer_person(false, ICON_SIZE, Colors.white)}
      </Pressable>
    </View>
  );
};

export default memo(FooterNavEmployee);
