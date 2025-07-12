import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export const transitionFade: NativeStackNavigationOptions = {
  animation: 'fade',
};

export const transitionSlideFromRight: NativeStackNavigationOptions = {
  animation: 'slide_from_right',
};

export const transitionSlideFromBottom: NativeStackNavigationOptions = {
  animation: 'slide_from_bottom',
};


export const transitionNone: NativeStackNavigationOptions = {
  animation: 'none',
};