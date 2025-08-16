import { Input } from '@/components/input/Input';
import { useCodeValidation } from '@/hooks/auth/reset-password/useCodeValidation';
import { codeValidationStyles as styles } from '@/styles/app/auth/reset-password/codeValidationStyles';
import { inputStyles2 } from '@/styles/components/input/inputStyles/inputStyles2';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Animated, Image, Keyboard, KeyboardAvoidingView, Platform, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Stepper } from '@/components/others/Stepper';

export default function ResetCodeValidationScreen() {

  const {
    inputs,
    inputsRef,
    handleChange,
    borderColors,
    shakeAnim,
    handleKeyPress
  } = useCodeValidation();

  return (

    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        
        <View style={styles.container}>

          <View style={styles.header}>
            
            <Image source={require('@/assets/images/jex/Jex-Olvidadizo.png')} style={styles.image} />
            
            <Text style={styles.title}>Cambia tu contraseña</Text>
          
          </View>
          
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardAvoidingView}>

            <Stepper activeIndex={1} totalSteps={3} />
          
            <Text style={styles.texto}>Ingresá el código enviado:</Text>

            <Animated.View style={[inputStyles2.inputContainer, { transform: [{ translateX: shakeAnim }]} ]}>
              
              {inputs.map((value, index) => (
                <Input
                  key={index}
                  ref={ref => { if (ref) inputsRef[index] = ref; }}
                  value={value}
                  onChangeText={(text) => handleChange(text, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  onKeyPress={e => handleKeyPress(e, index)}
                  styles={{
                    input: [
                      inputStyles2.input,
                      { borderColor: borderColors[index] }
                    ],
                    inputContainer: inputStyles2.inputContainer
                  }}
                />
              ))}

            </Animated.View>

          </KeyboardAvoidingView>

        </View>

      </TouchableWithoutFeedback>

    </SafeAreaView>
    
  );
}
