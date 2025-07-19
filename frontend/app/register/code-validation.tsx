import { Input } from '@/components/Input';
import { useRegisterCodeValidation } from '@/hooks/register/useRegisterCodeValidation';
import { codeValidationStyles as styles } from '@/styles/app/reset-password/codeValidationStyles';
import { inputStyles2 } from '@/styles/components/input/inputStyles2';
import React from 'react';
import { Animated, Image, Keyboard, KeyboardAvoidingView, Platform, Text, TouchableWithoutFeedback, View } from 'react-native';

export default function RegisterCodeValidationScreen() {
  const {
    inputs,
    handleChange,
    borderColors,
    shakeAnim,
    handleKeyPress
  } = useRegisterCodeValidation();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      
      <View style={styles.container}>

        <View style={styles.header}>
        
          <Image 
            source={require('@/assets/images/jex/Jex-Registrandose.png')} 
            style={styles.image} 
          />

          <Text style={styles.title}>Registrate{'\n'}en JEX</Text>

        </View>
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoidingView}>
        
          <Text style={styles.texto}>Ingresa el código enviado</Text>

          <Animated.View style={[inputStyles2.inputContainer, { transform: [{ translateX: shakeAnim }]} ]}>
            
            {inputs.map((value, index) => (

              <Input
                key={index}
                value={value}
                onChangeText={(text) => handleChange(text, index)}
                keyboardType="default"
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
