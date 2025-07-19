import { Button } from '@/components/Button';
import { ClickWindow } from '@/components/ClickWindow';
import { Input } from '@/components/Input';
import { iconos } from '@/constants/iconos';
import { useNewPassword } from '@/hooks/reset-password/useNewPassword';
import { newPasswordStyles as styles } from '@/styles/app/reset-password/newPasswordStyles';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles1';
import { buttonStyles4 } from '@/styles/components/button/buttonStyles4';
import { clickWindowStyles1 } from '@/styles/components/clickWindowStyles1';
import { inputStyles1 } from '@/styles/components/input/inputStyles1';
import { Colors } from '@/themes/colors';
import React from 'react';
import { Image, Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';

export default function ResetNewPasswordScreen() {
  const {
    password,
    confirmPassword,
    setPassword,
    continuarHabilitado,
    setConfirmPassword,
    handleGuardar,
    showModal,
    closeModal,
  } = useNewPassword();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    
      <View style={styles.container}>

        <View style={styles.header}>

          <Image source={require('@/assets/images/jex/Jex-Olvidadizo.png')} style={styles.image} />

          <Text style={styles.title}>Cambia tu contraseña</Text>

        </View>

        <Text style={styles.texto}>Ingresá tu nueva contraseña</Text>

        <View style={styles.content}>

          <Input
            placeholder="Contraseña nueva" 
            secureTextEntry 
            value={password}  
            onChangeText={setPassword}
            styles={inputStyles1}
          />

          <Input
            placeholder="Confirmar contraseña"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            styles={inputStyles1}
          />

        </View>

        <Button 
          texto="Guardar" 
          onPress={handleGuardar} 
          styles={continuarHabilitado ? buttonStyles1 : buttonStyles4}
          disabled={!continuarHabilitado}
        />

        <ClickWindow 
          title='Éxito'
          visible={showModal} 
          message='¡Contraseña actualizada con éxito!' 
          onClose={closeModal} 
          styles={clickWindowStyles1} 
          icono={iconos.exito(40, Colors.white)}
          buttonText='Entendido'
        />

      </View>

    </TouchableWithoutFeedback>
    
  );
}
