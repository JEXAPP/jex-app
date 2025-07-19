import { iconos } from '@/constants/iconos';
import { useCreateEvent } from '@/hooks/create-event/useCreateEvent';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles1';
import { clickWindowStyles1 } from '@/styles/components/clickWindowStyles1';
import { inputStyles1 } from '@/styles/components/input/inputStyles1';
import { tempWindowStyles1 } from '@/styles/components/tempWindowStyles1';
import { Colors } from '@/themes/colors';
import React from 'react';
import { Keyboard, SafeAreaView, ScrollView, Text, TouchableWithoutFeedback, View, } from 'react-native';
import { Button } from '../../components/Button';
import { ClickWindow } from '../../components/ClickWindow';
import { Input } from '../../components/Input';
import { TempWindow } from '../../components/TempWindow';
import { createEventStyles as styles } from '../../styles/app/create-event/createEventStyles';
import DatePicker from '@/components/DatePicker';
import { datePickerStyles1 } from '@/styles/components/datePickerStyles1';

export default function CreateEventScreen() {
    
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
  } = useCreateEvent();

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
              keyboardType="numeric" 
              styles={{input:{...inputStyles1.input, height:120, textAlignVertical: 'top'}}} 
              multiline={true}
              maxLength={200}
            />

            <DatePicker
              label="Fecha de Inicio"
              date={fechaInicioEvento}
              setDate={setFechaInicioEvento}
              minimumDate={new Date()}
              styles={datePickerStyles1}
            />

            <DatePicker
              label="Fecha de Fin"
              date={fechaFinEvento}
              setDate={setFechaFinEvento}
              styles={datePickerStyles1}
            />

            <Input 
              placeholder="Ubicación" 
              value={ubicacionEvento} 
              onChangeText={setUbicacionEvento} 
              styles={inputStyles1} 
            />

            <Button 
              texto="Crear evento" 
              onPress={handleCrearEvento} 
              styles={buttonStyles1} 
            />

          </View>

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
          
        </ScrollView>

      </SafeAreaView>

    </TouchableWithoutFeedback>
  );
}
