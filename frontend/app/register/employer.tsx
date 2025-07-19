import { Button } from '@/components/Button';
import { ClickWindow } from '@/components/ClickWindow';
import { Input } from '@/components/Input';
import { TempWindow } from '@/components/TempWindow';
import { iconos } from '@/constants/iconos';
import { useRegisterEmployer } from '@/hooks/register/useRegisterEmployer';
import { registerEmployerStyles as styles } from '@/styles/app/register/registerEmployerStyles';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles1';
import { buttonStyles4 } from '@/styles/components/button/buttonStyles4';
import { clickWindowStyles1 } from '@/styles/components/clickWindowStyles1';
import { inputStyles1 } from '@/styles/components/input/inputStyles1';
import { tempWindowStyles1 } from '@/styles/components/tempWindowStyles1';
import { Colors } from '@/themes/colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Image, Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';


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
  } = useRegisterEmployer();

  return (

    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

      <View style={styles.container}>

        <View style={styles.header}>

          <Image source={require('@/assets/images/jex/Jex-Registrandose.png')} style={styles.image} />

          <Text style={styles.title}>Registrate{'\n'}en JEX</Text>

        </View>

        <Text style={styles.texto}>Completá los datos de tu empresa</Text>

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

  );
}
