import { Boton } from '@/components/Boton';
import { Input } from '@/components/Input';
import { ModalConTexto } from '@/components/ModalConTexto';
import { ModalTemporal } from '@/components/ModalTemporal';
import { useRegistroEmpleador } from '@/hooks/registro/useRegistroEmpleador';
import { regitroEmpleadorStyles as styles } from '@/styles/app/registro/regitroEmpleadorStyles';
import { botonStyles1 } from '@/styles/components/boton/botonStyles1';
import { inputStyles1 } from '@/styles/components/input/inputStyles1';
import { modalConTextoStyles } from '@/styles/components/modalConTextoStyles';
import { modalTemporalStyles } from '@/styles/components/modalTemporalStyles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Image, Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Colors } from '@/themes/colors';
import { iconos } from '@/constants/iconos';


export default function RegistroEmpleador() {

  const {
    nombreEmpresa,
    handleRegistrarEmpleador,
    setNombreEmpresa,
    showError,
    errorMessage,
    showSuccess,
    closeError,
    closeSuccess,
  } = useRegistroEmpleador();

  return (

    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

      <View style={styles.container}>

        <View style={styles.header}>

          <Image source={require('@/assets/images/jex/Jex-Registrandose.png')} style={styles.image} />

          <Text style={styles.title}>Registrate{'\n'}en JEX</Text>

        </View>

        <Text style={styles.texto}>Paso 4: Completa tus datos</Text>

        <View style={styles.opcionesContainer}>

          <Input 
            placeholder="Nombre Empresa" 
            value={nombreEmpresa} 
            onChangeText={setNombreEmpresa} 
            styles={inputStyles1}
          />
          
        </View>

        <Boton 
          texto="Registrarse" 
          onPress={handleRegistrarEmpleador} 
          styles={botonStyles1} 
        />

        <ModalConTexto 
          title='Error'
          visible={showError} 
          message={errorMessage} 
          onClose={closeError} 
          styles={modalConTextoStyles} 
          icono={<MaterialIcons size={24} color={ Colors.violet5 } />}
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
