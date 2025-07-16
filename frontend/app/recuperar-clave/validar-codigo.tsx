
import { Input } from '@/components/Input';
import { useCodigoValidacion } from '@/services/useCodigoValidacion';
import { validarCodigoStyles as styles } from '@/styles/app/recuperar-clave/validarCodigoStyles';
import { inputStyles2 } from '@/styles/components/input/inputStyles2';
import React from 'react';
import { Animated, Image, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';

export default function ValidarCodigo() {
  const {
    inputs,
    inputsRef,
    handleChange,
    borderColors,
    shakeAnim,
    handleKeyPress
  } = useCodigoValidacion('./nueva-clave', 'email');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      
      <View style={styles.container}>

        <View style={styles.header}>
          
          <Image source={require('@/assets/images/jex/Jex-Olvidadizo.png')} style={styles.image} />
          
          <Text style={styles.title}>Recuperá tu contraseña</Text>
        
        </View>
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoidingView}>
        
          <Text style={styles.texto}>Ingresá el código enviado</Text>

          <Animated.View style={[inputStyles2.inputContainer, { transform: [{ translateX: shakeAnim }]} ]}>
            
            {inputs.map((value, index) => (

              <Input
                key={index}
                ref={(ref: TextInput) => (inputsRef[index] = ref)}
                value={value}
                onChangeText={(text) => handleChange(text, index)}
                keyboardType="numeric"
                autoCapitalize="characters"
                maxLength={1}
                onKeyPress={e => handleKeyPress(e, index)}
                styles={{
                  input: [
                    inputStyles2.input,
                    { borderColor: borderColors[index] }
                  ]
                }}
              />
            ))}

          </Animated.View>

        </KeyboardAvoidingView>

      </View>

    </TouchableWithoutFeedback>
    
  );
}
