import React, { memo } from 'react';
import { View, Pressable } from 'react-native';
import { usePathname, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { footerNavStyles1 as s } from '@/styles/constants/footerNavStyles1';
import { Colors } from '@/themes/colors';
import { iconos } from '../iconos';

type Props = {
  basePath: '/employer';
  // opcional: override de estilos
  styles?: typeof s;
};

const ICON_SIZE = 24;

const FooterNavEmployer: React.FC<Props> = ({ basePath }) => {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // Activo si estamos exactamente en /employee o /employer (podés afinar lógica si querés)
  const isActive = (slot: number) => {
    if (slot === 0) return pathname === basePath || pathname === `${basePath}/`;
    if (slot === 1) return pathname.startsWith(`/${basePath}/candidates`);
    return false;
  };

  // Navega solo el primero; los otros quedan como no-op (disabled)
  const onPress = (slot: number) => {
    if (slot === 0) router.replace(basePath);
    if (slot === 1) router.replace(`/${basePath}/candidates`);
    // slots 2..4 aún sin navegación
  };

  // Para que visualmente el disabled no “rompa” accesibilidad/feedback
  const isDisabled = (slot: number) => {
    // ahora habilitamos 0 (home) y 1 (inbox/candidates)
    return slot > 1;
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
        {isActive(0) ? (
          iconos.footer_home(true, ICON_SIZE, Colors.white)
        ) : (
         iconos.footer_home(false, ICON_SIZE, Colors.white)
        )}
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
          : iconos.footer_inbox(false, ICON_SIZE, Colors.white)}
      </Pressable>

      {/* 3) Briefcase (MaterialCommunityIcons) */}
      <Pressable
        accessibilityRole="button"
        hitSlop={8}
        onPress={() => onPress(2)}
        disabled={isDisabled(2)}
        style={s.item}
      >
        {iconos.footer_briefcase(false, ICON_SIZE, Colors.white)}
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

export default memo(FooterNavEmployer);
