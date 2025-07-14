import { botonStyles1 } from '@/styles/components/boton/botonStyles1';
import { inputStyles1 } from '@/styles/components/input/inputStyles1';
import { modalConTextoStyles } from '@/styles/components/modalConTextoStyles';
import { modalTemporalStyles } from '@/styles/components/modalTemporalStyles';
import React from 'react';
import { Image, Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Boton } from '../../components/Boton';
import { Input } from '../../components/Input';
import { ModalConTexto } from '../../components/ModalConTexto';
import { ModalTemporal } from '../../components/ModalTemporal';
import { useRegistroEmpleado } from '../../hooks/registro/useRegistroEmpleado';
import { paso4EmpleadoStyles as styles } from '../../styles/app/registro/paso4EmpleadoStyles';
import { iconos } from '@/constants/iconos';
import { Colors } from '@/themes/colors';



export default function RegistroEmpleadoScreen() {
  const {
    nombre,
    apellido,
    ubicacion,
    setNombre,
    setApellido,
    setUbicacion,
    handleRegistrarEmpleado,
    showError,
    errorMessage,
    showSuccess,
    closeError,
    closeSuccess,
  } = useRegistroEmpleado();


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

        <Text style={styles.texto}>Paso 4: Completa tus datos</Text>

        <View style={styles.opcionesContainer}>
        
          <Input 
            placeholder="Nombre" 
            value={nombre} 
            onChangeText={setNombre} 
            styles={inputStyles1}
          />

          <Input 
            placeholder="Apellido" 
            value={apellido} 
            onChangeText={setApellido} 
            styles={inputStyles1}
          />

          <Input 
            placeholder="Ubicación" 
            value={ubicacion} 
            onChangeText={setUbicacion} 
            styles={inputStyles1}
          />
          
        </View>

        <Boton 
          texto="Registrarse" 
          onPress={handleRegistrarEmpleado} 
          styles={botonStyles1} 
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

      </View>

    </TouchableWithoutFeedback>

  );
}
