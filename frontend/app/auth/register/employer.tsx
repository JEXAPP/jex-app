import { Button } from '@/components/button/Button';
import { Input } from '@/components/input/Input';
import { Stepper } from '@/components/others/Stepper';
import { ClickWindow } from '@/components/window/ClickWindow';
import { TempWindow } from '@/components/window/TempWindow';
import { iconos } from '@/constants/iconos';
import { useRegisterEmployer } from '@/hooks/auth/register/useRegisterEmployer';
import { registerEmployerStyles as styles } from '@/styles/app/auth/register/registerEmployerStyles';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles/buttonStyles1';
import { buttonStyles4 } from '@/styles/components/button/buttonStyles/buttonStyles4';
import { inputStyles1 } from '@/styles/components/input/inputStyles/inputStyles1';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';
import { tempWindowStyles1 } from '@/styles/components/window/tempWindowStyles1';
import { Colors } from '@/themes/colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Image, Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterEmployerScreen() {

  const {
    nombreEmpresa,
    continuarHabilitado,
    handleRegistrarEmpleador,
    setNombreEmpresa,
    showError,
    errorMessage,
    showSuccess,
    closeError,
    closeSuccess,
    loading
  } = useRegisterEmployer();

  return (

    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <View style={styles.container}>

          <View style={styles.header}>

            <Image source={require('@/assets/images/jex/Jex-Registrandose.png')} style={styles.image} />

            <Text style={styles.title}>Registrate{'\n'}en JEX</Text>

          </View>

          <View style={styles.step}>

            <Stepper activeIndex={4} totalSteps={5} />

            <Text style={styles.texto}>Completá los datos de tu empresa</Text>

          </View>

          <View style={styles.opcionesContainer}>

            <Input 
              placeholder="Nombre Empresa" 
              value={nombreEmpresa} 
              onChangeText={setNombreEmpresa} 
              styles={inputStyles1}
            />
            
          </View>

          <Button 
            texto="Registrarse" 
            loading={loading}
            onPress={handleRegistrarEmpleador} 
            styles={continuarHabilitado ? buttonStyles1 : buttonStyles4}
            disabled={!continuarHabilitado}
          />

          <ClickWindow 
            title='Error'
            visible={showError} 
            message={errorMessage} 
            onClose={closeError} 
            styles={clickWindowStyles1} 
            icono={<MaterialIcons size={24} color={ Colors.violet5 } />}
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
