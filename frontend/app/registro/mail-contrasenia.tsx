import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Image, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { Input } from '@/components/Input';
import { useRegistroMail } from '@/hooks/registro/useRegistroMail';
import { registroUsuarioStyles as styles } from '@/styles/app/registro/registroUsuarioStyles';
import { inputStyles1 } from '@/styles/components/input/inputStyles1';
import { Colors } from '@/themes/colors';
import { Boton } from '@/components/Boton';
import { botonStyles1 } from '@/styles/components/boton/botonStyles1';
import { botonStyles4 } from '@/styles/components/boton/botonStyles4';
import { ModalConTexto } from '@/components/ModalConTexto';
import { modalConTextoStyles } from '@/styles/components/modalConTextoStyles';
import { iconos } from '@/constants/iconos';
import { ModalTemporal } from '@/components/ModalTemporal';
import { modalTemporalStyles } from '@/styles/components/modalTemporalStyles';

export default function Registromail() {
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
    showSuccess,
    closeSuccess,
  } = useRegistroMail();

  // Estados para mostrar/ocultar contraseña
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmPassword, setMostrarConfirmPassword] = useState(false);
  

  const colorBarra =
    seguridad === 'Débil' ? Colors.violet1 :
    seguridad === 'Media' ? Colors.violet3 :
    seguridad === 'Fuerte' ? Colors.violet5 : 'transparent';

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <Image 
            source={require('@/assets/images/jex/Jex-Registrandose.png')} 
            style={styles.image}
          />
          <Text style={styles.title}>Registrate{'\n'}en JEX</Text>
        </View>

        <Text style={styles.texto}>Paso 3: Crea tu usuario con Email y Contraseña</Text>

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
              {iconos.ojoContra(
                mostrarPassword,
                Colors.violet5,
                Colors.violet3,
                () => setMostrarPassword(!mostrarPassword)
              )}
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

        <Boton
          texto="Continuar"
          onPress={handleContinue}
          styles={continuarHabilitado ? botonStyles1 : botonStyles4}
          disabled={!continuarHabilitado}
        />

        <ModalConTexto
          title="Error"
          visible={showError}
          message={errorMessage}
          onClose={closeError}
          styles={modalConTextoStyles}
          icono={iconos.error(24, Colors.violet4)}
          buttonText="Entendido"
        />
        <ModalTemporal 
          visible={showSuccess} 
          icono={iconos.exito(40, Colors.white)}
          onClose={closeSuccess} 
          styles={modalTemporalStyles} 
          duration={2000}
        />

      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
