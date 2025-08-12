import { Button } from '@/components/button/Button';
import { Input } from '@/components/input/Input';
import { PasswordStrengthBar } from '@/components/others/PasswordStrengthBar';
import { Stepper } from '@/components/others/Stepper';
import { ClickWindow } from '@/components/window/ClickWindow';
import { iconos } from '@/constants/iconos';
import { useRegisterAccount } from '@/hooks/auth/register/useRegisterAccount';
import { registerAccountStyles as styles } from '@/styles/app/auth/register/registerAccountStyles';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles/buttonStyles1';
import { buttonStyles4 } from '@/styles/components/button/buttonStyles/buttonStyles4';
import { inputStyles1 } from '@/styles/components/input/inputStyles/inputStyles1';
import { passwordStrengthStyles1 } from '@/styles/components/others/passwordStrengthBarStyles1';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';
import { Colors } from '@/themes/colors';
import React from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Platform, Text, TouchableWithoutFeedback, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterAccountScreen() {
  const {
    correo,
    setCorreo,
    password,
    handlePasswordChange,
    confirmPassword,
    setConfirmPassword,
    desdeGoogle,
    continuarHabilitado,
    handleContinue,
    showError,
    errorMessage,
    closeError,
    mostrarPassword,
    setMostrarPassword,
    mostrarConfirmPassword,
    setMostrarConfirmPassword,    
    setPasswordStrength
  } = useRegisterAccount();

  return (

    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
          
          <View style={styles.header}>

            <Image source={require('@/assets/images/jex/Jex-Registrandose.png')} style={styles.image}/>
            
            <Text style={styles.title}>Registrate{'\n'}en JEX</Text>
          
          </View>

          <View style={styles.step}>

            <Stepper activeIndex={2} totalSteps={5} />

            <Text style={styles.texto}>Crea tu cuenta</Text>

          </View>

          {!desdeGoogle && (

            <View style={styles.opcionesContainer}>

              <Input
                placeholder="Correo electrónico"
                value={correo}
                onChangeText={setCorreo}
                styles={inputStyles1}
                keyboardType="email-address"
              />

              <View>

                <Input
                  placeholder="Contraseña"
                  secureTextEntry={!mostrarPassword}
                  value={password}
                  onChangeText={handlePasswordChange}
                  styles={inputStyles1}
                />

                {iconos.ojoContra(mostrarPassword, Colors.violet4, Colors.violet4,() => setMostrarPassword(!mostrarPassword))}

              </View>

              <View>

                {password && (

                  <View style={styles.passwordBar}>

                      <PasswordStrengthBar
                        password={password}
                        onStrengthChange={setPasswordStrength}
                        styles={passwordStrengthStyles1}
                      />

                  </View>
                )} 

                <View>

                  <Input
                    placeholder="Confirmar contraseña"
                    secureTextEntry={!mostrarConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    styles={inputStyles1}
                  />

                  {iconos.ojoContra(
                    mostrarConfirmPassword,
                    Colors.violet5,
                    Colors.violet3,
                    () => setMostrarConfirmPassword(!mostrarConfirmPassword)
                  )}

                </View>

              </View>
            
            </View>          
          
          )}

          <Button
            texto="Continuar"
            onPress={handleContinue}
            styles={continuarHabilitado ? buttonStyles1 : buttonStyles4}
            disabled={!continuarHabilitado}
          />

          <ClickWindow
            title="Error"
            visible={showError}
            message={errorMessage}
            onClose={closeError}
            styles={clickWindowStyles1}
            icono={iconos.error_outline(30, Colors.white)}
            buttonText="Entendido"
          />
          
        </KeyboardAvoidingView>
      
      </TouchableWithoutFeedback>

    </SafeAreaView>
  
  );
}
