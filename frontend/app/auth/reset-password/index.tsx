import { Button } from '@/components/button/Button';
import { Input } from '@/components/input/Input';
import { Stepper } from '@/components/others/Stepper';
import { ClickWindow } from '@/components/window/ClickWindow';
import { iconos } from '@/constants/iconos';
import { useMailConfirmation } from '@/hooks/auth/reset-password/useMailConfirmation';
import { mailConfirmationStyles as styles } from '@/styles/app/auth/reset-password/mailConfirmationStyles';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles/buttonStyles1';
import { buttonStyles4 } from '@/styles/components/button/buttonStyles/buttonStyles4';
import { inputStyles1 } from '@/styles/components/input/inputStyles/inputStyles1';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';
import { Colors } from '@/themes/colors';
import React from 'react';
import { Image, Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MailConfirmationScreen() {
  const {
    email,
    showError,
    errorMessage,
    continuarHabilitado,
    loading,
    closeError,
    setEmail,
    handleEnviarCorreo,
  } = useMailConfirmation();

  return (

    <SafeAreaView edges={['top', 'left', 'right']}>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <View style={styles.container}>

          <View style={styles.header}>

              <Image source={require('@/assets/images/jex/Jex-Olvidadizo.png')} style={styles.image} />

              <Text style={styles.title}>Cambia tu contraseña</Text>

            </View>

          <View style={styles.inputContainer}>
            
            <Stepper activeIndex={0} totalSteps={3} />

            <Text style={styles.texto}>Confirmá tu correo</Text>

            <Input
              placeholder="Correo electrónico"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              styles={inputStyles1}
            />

          </View>

          <Button
            texto="Continuar"
            onPress={handleEnviarCorreo}
            loading={loading}
            styles={continuarHabilitado ? buttonStyles1 : buttonStyles4}
            disabled={!continuarHabilitado}
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

        </View>

      </TouchableWithoutFeedback>

    </SafeAreaView>
  );
}
