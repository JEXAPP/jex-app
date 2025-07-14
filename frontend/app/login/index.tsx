import { BotonConIcono } from '@/components/BotonConIcono';
import { SeparadorConTexto } from '@/components/SeparadorConTexto';
import { botonStyles5 } from '@/styles/components/boton/botonStyles5';
import { botonConIconoStyles } from '@/styles/components/botonConIconoStyles';
import { inputStyles1 } from '@/styles/components/input/inputStyles1';
import { separadorConTextoStyles } from '@/styles/components/separadorConTextoStyles';
import React from 'react';
import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Boton } from '../../components/Boton';
import { Input } from '../../components/Input';
import { ModalConTexto } from '../../components/ModalConTexto';
import { ModalTemporal } from '../../components/ModalTemporal';
import { useLogin } from '../../hooks/login/useLogin';
import { loginStyles as styles } from '../../styles/app/login/loginStyles';
import { botonStyles1 } from '../../styles/components/boton/botonStyles1';
import { botonStyles2 } from '../../styles/components/boton/botonStyles2';
import { modalConTextoStyles } from '../../styles/components/modalConTextoStyles';
import { modalTemporalStyles } from '../../styles/components/modalTemporalStyles';
import { iconos } from '@/constants/iconos';
import { Colors } from '@/themes/colors';

export default function IndexScreen() {
  const {
    email,
    password,
    setEmail,
    setPassword,
    handleLogin,
    handleNavigateToRegister,
    showError,
    errorMessage,
    closeError,
    showSuccess,
    closeSuccess,
    handleGoogleLogin,
    request,
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

        <Boton
          texto="Olvidé mi contraseña"
          onPress={handlePasswordForgot}
          styles={botonStyles5}
        />

        <Boton 
          texto="Continuar" 
          onPress={handleLogin} 
          styles={botonStyles1}
        />

        <Boton
          texto="¿No tenés cuenta? Regístrate"
          onPress={handleNavigateToRegister}
          styles={botonStyles2}
        />

        <ModalConTexto 
          title='Error'
          visible={showError} 
          message={errorMessage} 
          onClose={closeError} 
          styles={modalConTextoStyles} 
          icono={iconos.error(24, Colors.violet4)}
          buttonText='Entendido'
        />

        <ModalTemporal
          visible={showSuccess}
          icono={iconos.exito(40, Colors.white)}
          onClose={closeSuccess}
          styles={modalTemporalStyles}
          duration={2000}
        />

        <SeparadorConTexto 
          texto="o bien"
          styles={separadorConTextoStyles}  />
        
        <BotonConIcono
          texto="Continuar con Google"
          icono="google"
          styles={botonConIconoStyles}
          onPress={handleGoogleLogin}
          disabled={!request}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
