import { Button } from '@/components/Button';
import { ClickWindow } from '@/components/ClickWindow';
import { Input } from '@/components/Input';
import { iconos } from '@/constants/iconos';
import { useRegisterPhone } from '@/hooks/register/useRegisterPhone';
import { registerPhoneStyles as styles } from '@/styles/app/register/registerPhoneStyles';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles1';
import { buttonStyles4 } from '@/styles/components/button/buttonStyles4';
import { clickWindowStyles1 } from '@/styles/components/clickWindowStyles1';
import { inputStyles1 } from '@/styles/components/input/inputStyles1';
import { Colors } from '@/themes/colors';
import React from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Platform, Text, TouchableWithoutFeedback, View } from 'react-native';

export default function RegisterScreen() {
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
    closeError 
  } = useRegisterPhone();

   return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        
        <View style={styles.header}>

          <Image source={require('@/assets/images/jex/Jex-Registrandose.png')} style={styles.image}/>
          
          <Text style={styles.title}>Registrate{'\n'}en JEX</Text>
        
        </View>

        <Text style={styles.texto}>Ingresá tu número de teléfono:</Text>

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
          
          <Button
            texto="Continuar"
            onPress={handleContinue}
            styles={continuarHabilitado ? buttonStyles1 : buttonStyles4}
            disabled={!continuarHabilitado}
          />
        
        </View>

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