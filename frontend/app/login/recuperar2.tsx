// app/recuperar2.tsx
import React from 'react';
import { Text, KeyboardAvoidingView, Platform, Animated, TextInput, TouchableWithoutFeedback, View, Image, Keyboard } from 'react-native';
import { useCodigoValidacion } from '@/services/useCodigoValidacion';
import { Input } from '@/components/Input';
import { inputStyles2 } from '@/styles/components/input/inputStyles2';
import { recuperar2Styles as styles } from '@/styles/app/login/recuperar2Styles';

export default function Recuperar2() {
  const {
    inputs,
    inputsRef,
    handleChange,
    borderColors,
    shakeAnim,
    handleKeyPress
  } = useCodigoValidacion('./recuperar3', 'email');

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
