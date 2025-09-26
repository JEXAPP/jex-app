import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { dropdownStyles1 as s } from '@/styles/components/picker/dropdownStyles1';

export type DropdownOption<T = any> = { label: string; value: T };
type Placement = 'auto' | 'above' | 'below';
type WidthMode = number | 'anchor' | 'auto';

type DropdownProps<T = any> = {
  visible: boolean;
  onClose: () => void;
  options: DropdownOption<T>[];
  selectedValue?: T;
  onSelect: (option: DropdownOption<T>, index: number) => void;
  anchorRef: React.RefObject<View | null>;
  onOpened?: () => void;

  width?: WidthMode;
  maxWidth?: number;
  itemHeight?: number;
  maxHeight?: number;
  visibleCount?: number;
  placement?: Placement;
  offset?: number;
  backdropColor?: string;
};

export function Dropdown<T = any>({
  visible,
  onClose,
  options,
  selectedValue,
  onSelect,
  anchorRef,
  width = 'anchor',
  maxWidth = 350,
  itemHeight = 44,
  maxHeight,
  visibleCount,
  placement = 'auto',
  offset = 8,
  backdropColor = 'rgba(0,0,0,0.1)',
}: DropdownProps<T>) {
  const [anchorBox, setAnchorBox] = useState<{ x: number; y: number; w: number; h: number } | null>(
    null
  );
  const [anchorW, setAnchorW] = useState(0);
  const [maxLabelW, setMaxLabelW] = useState(0);
  const { height: screenH, width: screenW } = useWindowDimensions();

  const scale = useRef(new Animated.Value(0.95)).current;
  const fade = useRef(new Animated.Value(0)).current;

  // medir anchor al abrir
  useEffect(() => {
    if (visible && anchorRef.current && 'measureInWindow' in (anchorRef.current as any)) {
      (anchorRef.current as any).measureInWindow((x: number, y: number, w: number, h: number) => {
        setAnchorBox({ x, y, w, h });
        setAnchorW(w);
      });
      Animated.parallel([
        Animated.timing(scale, { toValue: 1, duration: 140, useNativeDriver: true }),
        Animated.timing(fade, { toValue: 1, duration: 140, useNativeDriver: true }),
      ]).start();
    } else {
      setAnchorBox(null);
      setMaxLabelW(0);
      fade.setValue(0);
      scale.setValue(0.95);
    }
  }, [visible, anchorRef]);

  const desiredHeight = useMemo(() => {
    const byCount = visibleCount ? visibleCount * itemHeight : undefined;
    const contentH = options.length * itemHeight;
    const cap = (h?: number) => (typeof h === 'number' ? Math.min(h, contentH) : contentH);
    const withCount = cap(byCount);
    return typeof maxHeight === 'number' ? Math.min(withCount, maxHeight) : withCount;
  }, [visibleCount, itemHeight, maxHeight, options.length]);

  const H_PADDING = 24;
  const desiredWidth = useMemo(() => {
    if (typeof width === 'number') return Math.min(width, maxWidth);
    if (width === 'anchor') return Math.min(anchorW, maxWidth);
    const byText = maxLabelW + H_PADDING;
    return Math.min(Math.max(anchorW, byText), maxWidth);
  }, [width, anchorW, maxLabelW, maxWidth]);

  const layout = useMemo(() => {
    if (!anchorBox) return null;

    const desiredW = desiredWidth || anchorBox.w;
    const desiredH = desiredHeight ?? Math.min(options.length * itemHeight, 260);

    let topBelow = anchorBox.y + anchorBox.h + offset;
    let topAbove = anchorBox.y - desiredH - offset;
    const left = Math.min(anchorBox.x, screenW - desiredW - offset);

    let top = topBelow;
    if (placement === 'above') top = Math.max(8, topAbove);
    else if (placement === 'below') top = Math.min(topBelow, screenH - desiredH - 8);
    else {
      const fitsBelow = topBelow + desiredH <= screenH - 8;
      top = fitsBelow ? topBelow : Math.max(8, topAbove);
    }

    return { top, left, w: desiredW, h: desiredH };
  }, [anchorBox, desiredWidth, desiredHeight, placement, offset, itemHeight, options.length, screenH, screenW]);

  const renderItem = ({ item, index }: { item: DropdownOption<T>; index: number }) => {
    const selected = selectedValue !== undefined && item.value === selectedValue;
    return (
      <TouchableOpacity
        onPress={() => {
          onSelect(item, index);
          onClose();
        }}
        style={[s.item, selected && s.itemSelected, { height: itemHeight }]}
      >
        <Text
          style={[s.itemText, selected && s.itemTextSelected]}
          onLayout={(e) => {
            const w = e.nativeEvent.layout.width;
            if (w > maxLabelW) setMaxLabelW(w);
          }}
          numberOfLines={1}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={s.backdrop} onPress={onClose} />
      {layout && (
        <Animated.View
          pointerEvents="box-none"
          style={[
            s.menu,
            {
              top: layout.top,
              left: layout.left,
              width: layout.w,
              maxWidth,
              maxHeight: layout.h,
              transform: [{ scale }],
              opacity: fade,
            },
          ]}
        >
          <FlatList
            data={options}
            keyExtractor={(it, i) => `${it.label}-${i}`}
            renderItem={renderItem}
            style={{ maxHeight: layout.h }}
            bounces={false}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="none"
          />
        </Animated.View>
      )}
    </Modal>
  );
}
