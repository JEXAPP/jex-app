import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Input } from '@/components/Input';
import { Boton } from '@/components/Boton';
import { useValidarCodigoSMS } from '@/hooks/registro/useValidarCodigoSMS';
import { validarCodigoStyles as styles } from '@/styles/app/registro/validarCodigoStyles';
import { inputStyles1 } from '@/styles/components/input/inputStyles1';
import { botonStyles1 } from '@/styles/components/boton/botonStyles1';
import { ModalTemporal } from '@/components/ModalTemporal';
import { modalTemporalStyles } from '@/styles/components/modalTemporalStyles';
import { useRegistroTelefono } from '@/hooks/registro/useRegistroTel';
import { botonStyles4 } from '@/styles/components/boton/botonStyles4';
import { ModalConTexto } from '@/components/ModalConTexto';
import { modalConTextoStyles } from '@/styles/components/modalConTextoStyles';
import { Colors } from '@/themes/colors';
import { iconos } from '@/constants/iconos';



export default function ValidarCodigoSMS() {
  const { codigo, setCodigo, handleValidar,  showError,    errorMessage, closeError, showSuccess,   closeSuccess, continuarHabilitado   } = useValidarCodigoSMS();

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

        <Text style={styles.texto}>Paso 2: Ingresá el código que te enviamos por SMS</Text>

        {/* NUEVA VIEW que controla layout verticalmente */}
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <View style={styles.opcionesContainer}>
            <Input
              placeholder="Código de Validación..."
              keyboardType="numeric"
              value={codigo}
              onChangeText={setCodigo}
              styles={inputStyles1}
            />
          </View>

          <View style={{ marginBottom: 155}}>
          <Boton
            texto="Validar Código"
            onPress={handleValidar}
            styles={continuarHabilitado ? botonStyles1 : botonStyles4}
            disabled={!continuarHabilitado}
             />
          </View>
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
