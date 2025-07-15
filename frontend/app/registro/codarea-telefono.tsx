import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Input } from '@/components/Input';
import { useRegistroTelefono } from '@/hooks/registro/useRegistroTel';
import { registroUsuarioStyles as styles } from '@/styles/app/registro/registroUsuarioStyles';
import { inputStyles1 } from '@/styles/components/input/inputStyles1';
import { Boton } from '@/components/Boton';
import { botonStyles1 } from '@/styles/components/boton/botonStyles1';
import { botonStyles4 } from '@/styles/components/boton/botonStyles4';
import { ModalConTexto } from '@/components/ModalConTexto';
import { modalConTextoStyles } from '@/styles/components/modalConTextoStyles';
import { Colors } from '@/themes/colors';
import { iconos } from '@/constants/iconos';
import { ModalTemporal } from '@/components/ModalTemporal';
import { modalTemporalStyles } from '@/styles/components/modalTemporalStyles';

export default function RegistroUsuario() {
  const {
    codigoArea,
    setCodigoArea,
    telefono,
    setTelefono,
    desdeGoogle,
    continuarHabilitado,
    handleContinue,
    showError,
    errorMessage,
    closeError,
    showSuccess,   
    closeSuccess   
  } = useRegistroTelefono();



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
            <View style={styles.row}>
              <View style={styles.inputArea}>
                <Input
                  placeholder="Cod. Área"
                  keyboardType="numeric"
                  maxLength={4}
                  value={codigoArea}
                  onChangeText={setCodigoArea}
                  styles={{ input: { ...inputStyles1.input, width: 120 } }}
                />
              </View>

              <View style={styles.inputTelefono}>
                <Input
                  placeholder="Teléfono"
                  keyboardType="numeric"
                  maxLength={8}
                  value={telefono}
                  onChangeText={setTelefono}
                  styles={{ input: { ...inputStyles1.input, width: 215 } }}
                />
              </View>
            </View>
          </View>
        )}

        <View style={{ marginTop: 190 }}>
          <Boton
            texto="Continuar"
            onPress={handleContinue}
            styles={continuarHabilitado ? botonStyles1 : botonStyles4}
            disabled={!continuarHabilitado}
          />
        </View>

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