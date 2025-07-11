import { BotonConIcono } from '@/components/BotonConIcono';
import { SeparadorConTexto } from '@/components/SeparadorConTexto';
import { botonConIconoStyles } from '@/styles/components/botonConIconoStyles';
import { inputStyles } from '@/styles/components/inputStyles';
import { separadorConTextoStyles } from '@/styles/components/separadorConTextoStyles';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { Boton } from '../components/Boton';
import { Input } from '../components/Input';
import { ModalConTexto } from '../components/ModalConTexto';
import { ModalTemporal } from '../components/ModalTemporal';
import { useLoginInicio } from '../hooks/useLoginInicio';
import { loginStyles as styles } from '../styles/app/loginStyles';
import { botonStyles1 } from '../styles/components/boton/botonStyles1';
import { botonStyles2 } from '../styles/components/boton/botonStyles2';
import { modalConTextoStyles } from '../styles/components/modalConTextoStyles';
import { modalTemporalStyles } from '../styles/components/modalTemporalStyles';

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
    successMessage,
    closeSuccess,
    handleGoogleLogin,
    request
  } = useLoginInicio();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Iniciar{'\n'}Sesión</Text>
      </View>

      <Input
        placeholder="Correo electrónico"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        styles={inputStyles}
      />

      <Input
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        styles={inputStyles}
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

      <Image 
        source={require('../assets/images/jex/Jex-Mirando-Arriba-Cerca.png')} 
        style={styles.image} 
      />

      <ModalConTexto
        visible={showError}
        message={errorMessage}
        onClose={closeError}
        styles={modalConTextoStyles}
      />

      <ModalTemporal
        visible={showSuccess}
        message={successMessage}
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
  );
}
