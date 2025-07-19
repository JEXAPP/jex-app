import { Button } from '@/components/Button';
import { ClickWindow } from '@/components/ClickWindow';
import { Input } from '@/components/Input';
import { iconos } from '@/constants/iconos';
import { useMailConfirmation } from '@/hooks/reset-password/useMailConfirmation';
import { mailConfirmationStyles as styles } from '@/styles/app/reset-password/mailConfirmationStyles';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles1';
import { buttonStyles4 } from '@/styles/components/button/buttonStyles4';
import { clickWindowStyles1 } from '@/styles/components/clickWindowStyles1';
import { Colors } from '@/themes/colors';
import React from 'react';
import { Image, Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';
import { inputStyles1 } from '../../styles/components/input/inputStyles1';

export default function MailConfirmationScreen() {
  const {
    email,
    setEmail,
    showError,
    errorMessage,
    continuarHabilitado,
    closeError,
    handleEnviarCorreo,
  } = useMailConfirmation();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

      <View style={styles.container}>

        <View style={styles.header}>

            <Image source={require('@/assets/images/jex/Jex-Olvidadizo.png')} style={styles.image} />

            <Text style={styles.title}>Cambia tu contraseña</Text>

          </View>

        <View style={styles.inputContainer}>

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
          styles={continuarHabilitado ? buttonStyles1 : buttonStyles4}
          disabled={!continuarHabilitado}
        />

        <ClickWindow 
          title='Error'
          visible={showError} 
          message={errorMessage} 
          onClose={closeError} 
          styles={clickWindowStyles1} 
          icono={iconos.error(24, Colors.violet4)}
          buttonText='Entendido'
        />

      </View>

    </TouchableWithoutFeedback>
  );
}
