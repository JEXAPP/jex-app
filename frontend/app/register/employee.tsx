import DatePicker from '@/components/DatePicker';
import PlaceSuggestions from '@/components/PlaceSuggestions';
import { iconos } from '@/constants/iconos';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles1';
import { buttonStyles4 } from '@/styles/components/button/buttonStyles4';
import { clickWindowStyles1 } from '@/styles/components/clickWindowStyles1';
import { inputStyles1 } from '@/styles/components/input/inputStyles1';
import { placeSuggestionsStyles1 } from '@/styles/components/placeSuggestionsStyles1';
import { tempWindowStyles1 } from '@/styles/components/tempWindowStyles1';
import { Colors } from '@/themes/colors';
import React from 'react';
import { Image, Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Button } from '../../components/Button';
import { ClickWindow } from '../../components/ClickWindow';
import { Input } from '../../components/Input';
import { TempWindow } from '../../components/TempWindow';
import { useRegisterEmployee } from '../../hooks/register/useRegisterEmployee';
import { registerEmployeeStyles as styles } from '../../styles/app/register/registerEmployeeStyles';
import { datePickerStyles1 } from '@/styles/components/datePickerStyles1';



export default function RegisterEmployeeScreen() {
  const {
    nombre,
    apellido,
    continuarHabilitado,
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
  } = useRegisterEmployee();


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

          <PlaceSuggestions 
            sugerencias={sugerencias} 
            onSeleccionar={seleccionarUbicacion} 
            styles={placeSuggestionsStyles1}
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

          <DatePicker
            label="Fecha de nacimiento"
            date={fechaNacimiento}
            setDate={setFechaNacimiento}
            maximumDate={new Date()}
            styles={datePickerStyles1}
          />

        </View>

        <Button 
          texto="Registrarse" 
          onPress={handleRegistrarEmpleado} 
          styles={continuarHabilitado ? buttonStyles1 : buttonStyles4}
          disabled={!continuarHabilitado}
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

      </View>

    </TouchableWithoutFeedback>

  );
}
