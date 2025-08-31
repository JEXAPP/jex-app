import React, { useMemo, useRef, useState } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { Dropdown, DropdownOption } from '@/components/picker/DropDown';
import { orderButtonStyles1 as s } from '@/styles/components/button/orderButtonStyles1';

interface OrderButtonProps {
  options: string[];
  onSelect: (order: number) => void; 
  defaultOption?: string;
  defaultIndex?: number;
  dropdownVisibleCount?: number;     
  dropdownPlacement?: 'auto'|'above'|'below';
  dropdownWidth?: number;
}

export const OrderButton: React.FC<OrderButtonProps> = ({
  options,
  onSelect,
  defaultOption,
  defaultIndex,
  dropdownVisibleCount = 4,    
  dropdownPlacement = 'below',
  dropdownWidth = 280,  
}) => {
  const initialIndex = useMemo(() => {
    if (typeof defaultIndex === 'number' && defaultIndex >= 0 && defaultIndex < options.length) return defaultIndex;
    if (defaultOption) {
      const found = options.indexOf(defaultOption);
      if (found !== -1) return found;
    }
    return 0;
  }, [defaultIndex, defaultOption, options]);

  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(initialIndex);

  const anchorRef = useRef<View>(null);
  const rotation = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const to = open ? 0 : 1;
    setOpen(!open);
    Animated.timing(rotation, { toValue: to, duration: 200, useNativeDriver: true }).start();
  };

  const spin = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  const mapped: DropdownOption<number>[] = options.map((label, i) => ({ label, value: i + 1 }));

  return (
    <View ref={anchorRef}>
      <TouchableOpacity style={s.button} onPress={toggleMenu}>
        <Animated.Text style={[s.buttonText, { transform: [{ rotate: spin }] }]}>
          {open ? '×' : '≡'}
        </Animated.Text>
      </TouchableOpacity>

      <Dropdown
        visible={open}
        onClose={() => setOpen(false)}
        options={mapped}
        selectedValue={selectedIndex + 1}
        onSelect={(opt, idx) => { setSelectedIndex(idx); onSelect(opt.value); }}
        anchorRef={anchorRef}
        width={dropdownWidth}
        itemHeight={44}
        visibleCount={dropdownVisibleCount}   
        placement={dropdownPlacement}          
        maxHeight={320}                       
      />
    </View>
  );
};
