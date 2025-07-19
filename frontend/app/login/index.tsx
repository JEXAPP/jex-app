import { ButtonWithIcon } from '@/components/ButtonWithIcon';
import { TextSeparator } from '@/components/TextSeparator';
import { iconos } from '@/constants/iconos';
import { buttonWithIconStyles1 } from '@/styles/components/buttonWithIconStyles1';
import { buttonStyles5 } from '@/styles/components/button/buttonStyles5';
import { inputStyles1 } from '@/styles/components/input/inputStyles1';
import { textSeparatorStyles1 } from '@/styles/components/textSeparatorStyles1';
import { Colors } from '@/themes/colors';
import React from 'react';
import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Button } from '../../components/Button';
import { ClickWindow } from '../../components/ClickWindow';
import { Input } from '../../components/Input';
import { TempWindow } from '../../components/TempWindow';
import { useLogin } from '../../hooks/login/useLogin';
import { loginStyles as styles } from '../../styles/app/login/loginStyles';
import { buttonStyles1 } from '../../styles/components/button/buttonStyles1';
import { buttonStyles2 } from '../../styles/components/button/buttonStyles2';
import { clickWindowStyles1 } from '../../styles/components/clickWindowStyles1';
import { tempWindowStyles1 } from '../../styles/components/tempWindowStyles1';

export default function LoginScreen() {
  const {
    email,
    password,
    loading,
    setEmail,
    setPassword,
    handleLogin,
    handleNavigateToRegister,
    showError,
    errorMessage,
    closeError,
    showSuccess,
    closeSuccess,
    handleGoogle,
    handlePasswordForgot
  } = useLogin();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      
      <View style={styles.container}>
        
        <View style={styles.header}>
          
          <Text style={styles.title}>Iniciar{'\n'}Sesión</Text>
        
        </View>

        <Input
          placeholder="Correo electrónico"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          styles={inputStyles1}
        />

        <Input
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          styles={inputStyles1}
        />

        <Button
          texto="Olvidé mi contraseña"
          onPress={handlePasswordForgot}
          styles={buttonStyles5}
        />

        <Button 
          texto="Continuar" 
          onPress={handleLogin} 
          styles={buttonStyles1}
          loading={loading}
        />

        <Button
          texto="¿No tenés cuenta? Regístrate"
          onPress={handleNavigateToRegister}
          styles={buttonStyles2}
        />

        <ClickWindow
          title='Error'
          visible={showError} 
          message={errorMessage} 
          onClose={closeError} 
          styles={clickWindowStyles1} 
          icono={iconos.error(24, Colors.violet4)}
          buttonText='Entendido'
        />

        <TempWindow
          visible={showSuccess}
          icono={iconos.exito(40, Colors.white)}
          onClose={closeSuccess}
          styles={tempWindowStyles1}
          duration={2000}
        />

        <TextSeparator 
          texto="o bien"
          styles={textSeparatorStyles1}  />
        
        <ButtonWithIcon
          texto="Continuar con Google"
          icono="google"
          styles={buttonWithIconStyles1}
          onPress={handleGoogle}
        />
      
      </View>
    
    </TouchableWithoutFeedback>
  
  );
  
}
