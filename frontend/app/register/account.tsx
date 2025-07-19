import { Button } from '@/components/Button';
import { ClickWindow } from '@/components/ClickWindow';
import { Input } from '@/components/Input';
import { iconos } from '@/constants/iconos';
import { useRegisterAccount } from '@/hooks/register/useRegisterAccount';
import { registerAccountStyles as styles } from '@/styles/app/register/registerAccountStyles';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles1';
import { buttonStyles4 } from '@/styles/components/button/buttonStyles4';
import { clickWindowStyles1 } from '@/styles/components/clickWindowStyles1';
import { inputStyles1 } from '@/styles/components/input/inputStyles1';
import { Colors } from '@/themes/colors';
import React, { useState } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Platform, Text, TouchableWithoutFeedback, View, } from 'react-native';

export default function RegisterAccountScreen() {
  const {
    correo,
    setCorreo,
    password,
    handlePasswordChange,
    confirmPassword,
    setConfirmPassword,
    seguridad,
    desdeGoogle,
    continuarHabilitado,
    handleContinue,
    showError,
    errorMessage,
    closeError,
  } = useRegisterAccount();

  // Estados para mostrar/ocultar contraseña
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmPassword, setMostrarConfirmPassword] = useState(false);
  
  const colorBarra =
    seguridad === 'Débil' ? Colors.violet1 :
    seguridad === 'Media' ? Colors.violet3 :
    seguridad === 'Fuerte' ? Colors.violet5 : 'transparent';

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        
        <View style={styles.header}>

          <Image source={require('@/assets/images/jex/Jex-Registrandose.png')} style={styles.image}/>
          
          <Text style={styles.title}>Registrate{'\n'}en JEX</Text>
        
        </View>

        <Text style={styles.texto}>Crea tu usuario con Email y Contraseña</Text>

        {!desdeGoogle && (

          <View style={styles.opcionesContainer}>

            <Input
              placeholder="Correo electrónico"
              value={correo}
              onChangeText={setCorreo}
              styles={inputStyles1}
              keyboardType="email-address"
            />

            <View style={{ position: 'relative' }}>

              <Input
                placeholder="Contraseña"
                secureTextEntry={!mostrarPassword}
                value={password}
                onChangeText={handlePasswordChange}
                styles={inputStyles1}
              />

              {iconos.ojoContra(mostrarPassword, Colors.violet5, Colors.violet3,() => setMostrarPassword(!mostrarPassword))}
            
            </View>

            {seguridad && (

              <View style={styles.seguridadContainer}>

                <Text style={styles.textoSeguridad}>{seguridad}</Text>
                
                <View style={[styles.barrita, { backgroundColor: colorBarra }]} />
              </View>
            )}

            <View style={{ position: 'relative' }}>
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
          icono={iconos.error(24, Colors.violet4)}
          buttonText="Entendido"
        />
        
      </KeyboardAvoidingView>
    
    </TouchableWithoutFeedback>
  
  );
}
