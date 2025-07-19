
import { Input } from '@/components/Input';
import { useCodeValidation } from '@/hooks/reset-password/useCodeValidation';
import { codeValidationStyles as styles } from '@/styles/app/reset-password/codeValidationStyles';
import { inputStyles2 } from '@/styles/components/input/inputStyles2';
import React from 'react';
import { Animated, Image, Keyboard, KeyboardAvoidingView, Platform, Text, TouchableWithoutFeedback, View } from 'react-native';

export default function ResetCodeValidationScreen() {
  const {
    inputs,
    handleChange,
    borderColors,
    shakeAnim,
    handleKeyPress
  } = useCodeValidation('./nueva-clave', 'email');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      
      <View style={styles.container}>

        <View style={styles.header}>
          
          <Image source={require('@/assets/images/jex/Jex-Olvidadizo.png')} style={styles.image} />
          
          <Text style={styles.title}>Cambia tu contraseña</Text>
        
        </View>
        
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardAvoidingView}>
        
          <Text style={styles.texto}>Ingresá el código enviado:</Text>

          <Animated.View style={[inputStyles2.inputContainer, { transform: [{ translateX: shakeAnim }]} ]}>
            
            {inputs.map((value, index) => (

              <Input
                key={index}
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
