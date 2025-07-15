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
import { registroEmpleadoStyles as styles } from '../../styles/app/registro/registroEmpleadoStyles';
import { iconos } from '@/constants/iconos';
import { Colors } from '@/themes/colors';
import { SelectorFecha } from '@/components/SelectorFecha';
import { selectorFechaStyles } from '../../styles/components/selectorFechaStyles';
import { listaSugerenciasStyles } from '@/styles/components/listaSugerenciasStyles';
import ListaSugerencias from '@/components/ListaSugerencias';



export default function RegistroEmpleadoScreen() {
  const {
    nombre,
    apellido,
    setNombre,
    setApellido,
    handleRegistrarEmpleado,
    showError,
    errorMessage,
    showSuccess,
    closeError,
    closeSuccess,
    dni,
    fechaNacimiento,
    handleChangeDni,
    setFechaNacimiento,
    ubicacion,
    handleUbicacion,
    seleccionarUbicacion,
    sugerencias,
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

        <Text style={styles.texto}>Completa tus datos personales</Text>

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

          <ListaSugerencias 
            sugerencias={sugerencias} 
            onSeleccionar={seleccionarUbicacion} 
            styles={listaSugerenciasStyles}
          />

          <Input 
            placeholder="Ubicación" 
            value={ubicacion} 
            onChangeText={handleUbicacion} 
            styles={inputStyles1}
          />

          <Input 
            placeholder="DNI" 
            value={dni}
            keyboardType="numeric"
            maxLength={10}
            onChangeText={handleChangeDni} 
            styles={inputStyles1}
          />

          <SelectorFecha
            label="Fecha de Nacimiento"
            value={fechaNacimiento}
            onChange={setFechaNacimiento}
            styles={selectorFechaStyles}
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
