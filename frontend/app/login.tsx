import { Button } from '@/components/button/Button';
import { ButtonWithIcon } from '@/components/button/ButtonWithIcon';
import { Input } from '@/components/input/Input';
import { TextSeparator } from '@/components/others/TextSeparator';
import { ClickWindow } from '@/components/window/ClickWindow';
import { TempWindow } from '@/components/window/TempWindow';
import { iconos } from '@/constants/iconos';
import { useLogin } from '@/hooks/useLogin';
import { loginStyles as styles } from '@/styles/app/loginStyles';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles/buttonStyles1';
import { buttonStyles2 } from '@/styles/components/button/buttonStyles/buttonStyles2';
import { buttonStyles5 } from '@/styles/components/button/buttonStyles/buttonStyles5';
import { buttonWithIconStyles1 } from '@/styles/components/button/buttonWithIconStyles/buttonWithIconStyles1';
import { inputStyles1 } from '@/styles/components/input/inputStyles/inputStyles1';
import { textSeparatorStyles1 } from '@/styles/components/others/textSeparatorStyles1';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';
import { tempWindowStyles1 } from '@/styles/components/window/tempWindowStyles1';
import { Colors } from '@/themes/colors';
import React from 'react';
import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PanGestureHandler, PanGestureHandlerStateChangeEvent } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';

export default function LoginScreen() {

  const {
    email,
    password,
    loading,
    mostrarPassword,
    showSuccess,
    showError,
    errorMessage,
    setEmail,
    setPassword,
    handleLogin,
    handleNavigateToRegister,
    closeError,  
    closeSuccess,
    handleGoogle,
    setMostrarPassword,
    handlePasswordForgot
  } = useLogin();

  const SWIPE_THRESHOLD = 60;

  const router = useRouter();

  const onSwipe = (e: PanGestureHandlerStateChangeEvent) => {
    const { oldState, translationX } = e.nativeEvent as any;
    if (oldState === 4 || oldState === 5 || oldState === 2) {
      if (translationX >= SWIPE_THRESHOLD) {
        router.replace('/employer/candidates/search');
      }
    }
  };


  return (

    <PanGestureHandler
      onHandlerStateChange={onSwipe}
      activeOffsetY={[-12, 12]}  // evita conflictos con scroll vertical
    >
    
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          
          <View style={styles.container}>
            
            <View style={styles.header}>
              
              <Text style={styles.title}>Iniciar{'\n'}Sesión</Text>
            
            </View>

            <Input
              placeholder="Correo electrónico"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              styles={inputStyles1}
            />

            <View style={styles.passwordRow}>

              <Input
                placeholder="Contraseña"
                secureTextEntry={!mostrarPassword}
                value={password}
                onChangeText={setPassword}
                styles={inputStyles1}
              />

              {iconos.ojoContra(mostrarPassword, Colors.violet4, Colors.violet4,() => setMostrarPassword(!mostrarPassword))}
            
            </View>
          
            <Button
              texto="Olvidé mi contraseña"
              onPress={handlePasswordForgot}
              styles={buttonStyles5}
            />

            <Button 
              texto="Continuar" 
              onPress={handleLogin} 
              styles={buttonStyles1}
              loading={loading}
            />

            <Button
              texto="¿No tenés cuenta? Regístrate"
              onPress={handleNavigateToRegister}
              styles={buttonStyles2}
            />

            <ClickWindow
              title='Error'
              visible={showError} 
              message={errorMessage} 
              onClose={closeError} 
              styles={clickWindowStyles1} 
              icono={iconos.error_outline(30, Colors.white)}
              buttonText='Entendido'
            />

            <TempWindow
              visible={showSuccess}
              icono={iconos.exito(40, Colors.white)}
              onClose={closeSuccess}
              styles={tempWindowStyles1}
              duration={2000}
            />

            <TextSeparator 
              texto="o bien"
              styles={textSeparatorStyles1}  
            />
            
            <ButtonWithIcon
              texto="Continuar con Google"
              icono={iconos.google(24, Colors.violet4)}
              styles={buttonWithIconStyles1}
              onPress={handleGoogle}
            />
          
          </View>
        
        </TouchableWithoutFeedback>

      </SafeAreaView>

    </PanGestureHandler>
  
  );
  
}
