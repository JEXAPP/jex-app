import { Button } from '@/components/button/Button';
import { Input } from '@/components/input/Input';
import { Stepper } from '@/components/others/Stepper';
import { ClickWindow } from '@/components/window/ClickWindow';
import { iconos } from '@/constants/iconos';
import { useRegisterPhone } from '@/hooks/auth/register/useRegisterPhone';
import { registerPhoneStyles as styles } from '@/styles/app/auth/register/registerPhoneStyles';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles/buttonStyles1';
import { buttonStyles4 } from '@/styles/components/button/buttonStyles/buttonStyles4';
import { inputStyles1 } from '@/styles/components/input/inputStyles/inputStyles1';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';
import { Colors } from '@/themes/colors';
import React from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Platform, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterPhoneScreen() {
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
    loading 
  } = useRegisterPhone();

   return (

    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
          
          <View style={styles.header}>

            <Image source={require('@/assets/images/jex/Jex-Registrandose.png')} style={styles.image}/>
            
            <Text style={styles.title}>Registrate{'\n'}en JEX</Text>
          
          </View>

          <View style={styles.step}>

            <Stepper activeIndex={0} totalSteps={5} />

            <Text style={styles.texto}>Ingresá tu número de teléfono:</Text>
          
          </View>

          {!desdeGoogle && (

            <View style={styles.opcionesContainer}>
              
              <View style={styles.row}>
                  
                <Input
                  placeholder="Cod. Área"
                  keyboardType="numeric"
                  maxLength={4}
                  value={codigoArea}
                  onChangeText={setCodigoArea}
                  styles={{ inputContainer: { ...inputStyles1.inputContainer, width: 115 }, input: inputStyles1.input }}
                />
                  
                <Input
                  placeholder="Teléfono"
                  keyboardType="numeric"
                  maxLength={8}
                  value={telefono}
                  onChangeText={setTelefono}
                  styles={{ inputContainer: { ...inputStyles1.inputContainer, width: 210}, input: inputStyles1.input  }}
                />
              
              </View>
            
            </View>
          
          )}

          <View style={{ marginTop: 190 }}>
            
            <Button
              texto="Continuar"
              loading={loading}
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
            icono={iconos.error_outline(30, Colors.white)}
            buttonText="Entendido"
          />

        </KeyboardAvoidingView>
      
      </TouchableWithoutFeedback>
  
    </SafeAreaView>

  );
}