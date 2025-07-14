// app/index.tsx
import { View, Animated } from 'react-native';
import { useInicio } from '@/hooks/useInicio';
import { inicioStyles as styles } from '@/styles/app/inicioStyles';

export default function SplashScreen() {
  const { scaleAnim } = useInicio();

  return (
    <View style={styles.container}>

      <Animated.Image
        source={require('@/assets/images/jex/Jex-Logo.png')}
        style={[styles.image, { transform: [{ scale: scaleAnim }] }]}
        resizeMode="contain"
      />

      <Animated.Text style={[styles.title, { transform: [{ scale: scaleAnim }] }]}>
        JEX
      </Animated.Text>

    </View>
    
  );
}
