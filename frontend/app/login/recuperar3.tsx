import React from 'react';
import { View, Text, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Input } from '@/components/Input';
import { Boton } from '@/components/Boton';
import { useRecuperar3 } from '@/hooks/login/useRecuperar3';
import { recuperar3Styles as styles } from '@/styles/app/login/recuperar3Styles';
import { ModalConTexto } from '@/components/ModalConTexto';
import { modalConTextoStyles } from '@/styles/components/modalConTextoStyles';
import { botonStyles1 } from '@/styles/components/boton/botonStyles1';
import { inputStyles1 } from '@/styles/components/input/inputStyles1';
import { iconos } from '@/constants/iconos';
import { Colors } from '@/themes/colors';

export default function Recuperar3() {
  const {
    password,
    confirmPassword,
    setPassword,
    setConfirmPassword,
    handleGuardar,
    showModal,
    closeModal,
  } = useRecuperar3();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    
      <View style={styles.container}>

        <View style={styles.header}>

          <Image source={require('@/assets/images/jex/Jex-Olvidadizo.png')} style={styles.image} />

          <Text style={styles.title}>Recuperá tu contraseña</Text>

        </View>

        <Text style={styles.texto}>Ingresá tu nueva contraseña</Text>

        <View style={styles.content}>

          <Input
            placeholder="Contraseña nueva" 
            secureTextEntry 
            value={password}  
            onChangeText={setPassword}
            styles={inputStyles1}
          />

          <Input
            placeholder="Confirmar contraseña"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            styles={inputStyles1}
          />

        </View>

        <Boton 
          texto="Guardar" 
          onPress={handleGuardar} 
          styles={botonStyles1} 
        />

        <ModalConTexto 
          title='Éxito'
          visible={showModal} 
          message='¡Contraseña actualizada con éxito!' 
          onClose={closeModal} 
          styles={modalConTextoStyles} 
          icono={iconos.exito(40, Colors.white)}
          buttonText='Entendido'
        />

      </View>

    </TouchableWithoutFeedback>
    
  );
}
