import { botonStyles1 } from '@/styles/components/boton/botonStyles1';
import { inputStyles1 } from '@/styles/components/input/inputStyles1';
import { modalConTextoStyles } from '@/styles/components/modalConTextoStyles';
import React from 'react';
import { Text, View, Keyboard, TouchableWithoutFeedback, SafeAreaView, ScrollView, Image  } from 'react-native';
import { Boton } from '../../components/Boton';
import { Input } from '../../components/Input';
import { ModalConTexto } from '../../components/ModalConTexto';
import { ModalTemporal } from '../../components/ModalTemporal';
import { crearEventoStyles as styles } from '../../styles/app/crear-evento/crearEventoStyles';
import { modalTemporalStyles } from '@/styles/components/modalTemporalStyles';
import { useCrearEvento } from '@/hooks/crear-evento/useCrearEvento';
import { SelectorFecha } from '@/components/SelectorFecha';
import { iconos } from '@/constants/iconos';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { selectorFechaStyles } from '../../styles/components/selectorFechaStyles';

export default function RegistroEventoScreen() {
    
  const {
    nombreEvento,
    descripcionEvento,
    fechaInicioEvento,
    fechaFinEvento,
    ubicacionEvento,
    setNombreEvento,
    setDescripcionEvento,
    setFechaInicioEvento,
    setFechaFinEvento,
    setUbicacionEvento,
    handleCrearEvento,
    showError,
    errorMessage,
    showSuccess,
    closeError,
    closeSuccess,
  } = useCrearEvento();

 return (   
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      
      <SafeAreaView style={styles.container}>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          
          <View style={styles.header}>

            <Text style={styles.title}>Crear Evento</Text>
          
          </View>

          <View style={styles.opcionesContainer}>

            <Input 
              placeholder="Nombre del evento" 
              value={nombreEvento} 
              onChangeText={setNombreEvento} 
              styles={inputStyles1} 
            />
            
            <Input 
              placeholder="Descripción del evento" 
              value={descripcionEvento} 
              onChangeText={setDescripcionEvento} 
              styles={{input:{...inputStyles1.input, height:120, textAlignVertical: 'top'}}} 
            />
            
            <SelectorFecha 
              label="Fecha de inicio" 
              value={fechaInicioEvento} 
              onChange={setFechaInicioEvento}
              styles={selectorFechaStyles} 
            />

            <SelectorFecha 
              label="Fecha de fin" 
              value={fechaFinEvento} 
              onChange={setFechaFinEvento} 
              styles={selectorFechaStyles} 
            />

            <Input 
              placeholder="Ubicación" 
              value={ubicacionEvento} 
              onChangeText={setUbicacionEvento} 
              styles={inputStyles1} 
            />

            <Image source={require('@/assets/images/maps.png')} style={styles.image} />

            <Boton 
              texto="Crear evento" 
              onPress={handleCrearEvento} 
              styles={botonStyles1} 
            />

          </View>

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
          
        </ScrollView>

      </SafeAreaView>

    </TouchableWithoutFeedback>
  );
}
