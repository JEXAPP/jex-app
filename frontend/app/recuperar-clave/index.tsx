import { Boton } from '@/components/Boton';
import { Input } from '@/components/Input';
import { ModalConTexto } from '@/components/ModalConTexto';
import { useConfirmarCorreo } from '@/hooks/recuperar-clave/useConfirmarCorreo';
import { confirmarCorreoStyles as styles } from '@/styles/app/recuperar-clave/confirmarCorreoStyles';
import { botonStyles1 } from '@/styles/components/boton/botonStyles1';
import { modalConTextoStyles } from '@/styles/components/modalConTextoStyles';
import React from 'react';
import { Image, Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';
import { inputStyles1 } from '../../styles/components/input/inputStyles1';
import { iconos } from '@/constants/iconos';
import { Colors } from '@/themes/colors';

export default function ConfirmarCorreo() {
  const {
    email,
    setEmail,
    showError,
    errorMessage,
    closeError,
    handleEnviarCorreo,
  } = useConfirmarCorreo();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

      <View style={styles.container}>

        <View style={styles.header}>

            <Image source={require('@/assets/images/jex/Jex-Olvidadizo.png')} style={styles.image} />

            <Text style={styles.title}>Recuperá tu contraseña</Text>

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

        <Boton
          texto="Continuar"
          onPress={handleEnviarCorreo}
          styles={botonStyles1}
        />

        <ModalConTexto 
          title='Error'
          visible={showError} 
          message={errorMessage} 
          onClose={closeError} 
          styles={modalConTextoStyles} 
          icono={iconos.error(24, Colors.violet4)}
          buttonText='Entendido'
        />

      </View>

    </TouchableWithoutFeedback>
  );
}
