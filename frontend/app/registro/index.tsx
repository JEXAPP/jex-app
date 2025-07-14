import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Input } from '@/components/Input';
import { useRegistroUsuario } from '@/hooks/registro/useRegistroUsuario';
import { registroUsuarioStyles as styles } from '@/styles/app/registro/registroUsuarioStyles';
import { inputStyles1 } from '@/styles/components/input/inputStyles1';
import { Colors } from '@/themes/colors';
import { Boton } from '@/components/Boton';
import { botonStyles1 } from '@/styles/components/boton/botonStyles1';
import { botonStyles4 } from '@/styles/components/boton/botonStyles4';

export default function RegistroUsuario() {
  const {
    correo,
    setCorreo,
    codigoArea,
    setCodigoArea,
    telefono,
    setTelefono,
    password,
    handlePasswordChange,
    confirmPassword,
    setConfirmPassword,
    seguridad,
    desdeGoogle,
    continuarHabilitado,
    handleContinue
  } = useRegistroUsuario();

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

        <Text style={styles.texto}>Paso 1: Ingresá la información requerida</Text>

        {!desdeGoogle && (

          <View style={styles.opcionesContainer}>

            <Input
              placeholder="Correo electrónico"
              value={correo}
              onChangeText={setCorreo}
              styles={inputStyles1}
              keyboardType="email-address"
            />

            <View style={styles.row}>

              <View style={styles.inputArea}>

                <Input
                  placeholder="Cod. Área"
                  keyboardType="numeric"
                  maxLength={4}
                  value={codigoArea}
                  onChangeText={setCodigoArea}
                  styles={{input:{...inputStyles1.input, width: 120}}}
                />

              </View>

              <View style={styles.inputTelefono}>

                <Input
                  placeholder="Teléfono"
                  keyboardType="numeric"
                  maxLength={8}
                  value={telefono}
                  onChangeText={setTelefono}
                  styles={{input:{...inputStyles1.input, width: 215}}}
                />

              </View>

            </View>

            <Input
              placeholder="Contraseña"
              secureTextEntry
              value={password}
              onChangeText={handlePasswordChange}
              styles={inputStyles1}
            />

            {seguridad && (
              <View style={styles.seguridadContainer}>
                <Text style={styles.textoSeguridad}>{seguridad}</Text>
                <View style={[styles.barrita, { backgroundColor: colorBarra }]} />
              </View>
            )}

            <Input
              placeholder="Confirmar contraseña"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              styles={inputStyles1}
            />
          </View>
        )}

        <Boton
          texto="Continuar"
          onPress={handleContinue}
          styles={continuarHabilitado ? botonStyles1 : botonStyles4}
          disabled={!continuarHabilitado}
        />

      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
