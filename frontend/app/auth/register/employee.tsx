import { Button } from '@/components/button/Button';
import PlaceSuggestions from '@/components/others/PlaceSuggestions';
import DatePicker from '@/components/picker/DatePicker';
import { ClickWindow } from '@/components/window/ClickWindow';
import { TempWindow } from '@/components/window/TempWindow';
import { iconos } from '@/constants/iconos';
import { useRegisterEmployee } from '@/hooks/auth/register/useRegisterEmployee';
import { registerEmployeeStyles as styles } from '@/styles/app/auth/register/registerEmployeeStyles';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles/buttonStyles1';
import { buttonStyles4 } from '@/styles/components/button/buttonStyles/buttonStyles4';
import { inputStyles1 } from '@/styles/components/input/inputStyles/inputStyles1';
import { datePickerStyles1 } from '@/styles/components/picker/datePickerStyles/datePickerStyles1';
import { placeSuggestionsStyles1 } from '@/styles/components/picker/placeSuggestionsStyles1';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';
import { tempWindowStyles1 } from '@/styles/components/window/tempWindowStyles1';
import { Colors } from '@/themes/colors';
import React from 'react';
import { Image, Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Input } from '@/components/input/Input';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stepper } from '@/components/others/Stepper';

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
    loading,
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

    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <View style={styles.container}>

          <View style={styles.header}>

            <Image 
              source={require('@/assets/images/jex/Jex-Registrandose.png')} 
              style={styles.image} 
            />

            <Text style={styles.title}>Registrate{'\n'}en JEX</Text>

          </View>

          <View style={styles.step}>

            <Stepper activeIndex={4} totalSteps={5} />

            <Text style={styles.texto}>Completá tus datos personales</Text>

          </View>

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
              minimumDate={new Date(1950, 1, 1)}
              styles={datePickerStyles1}
            />

          </View>

          <Button 
            texto="Registrarse" 
            onPress={handleRegistrarEmpleado} 
            styles={continuarHabilitado ? buttonStyles1 : buttonStyles4}
            disabled={!continuarHabilitado}
            loading={loading}
          />

          <ClickWindow 
            title='Error'
            visible={showError} 
            message={errorMessage} 
            onClose={closeError} 
            styles={clickWindowStyles1} 
            icono={iconos.error_outline(30, Colors.white)}
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

    </SafeAreaView>

  );
}
