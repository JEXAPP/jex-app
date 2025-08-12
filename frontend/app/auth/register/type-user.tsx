import { Button } from '@/components/button/Button';
import { Stepper } from '@/components/others/Stepper';
import { useRegisterTypeUser } from '@/hooks/auth/register/useRegisterTypeUser';
import { registerTypeUserStyles as styles } from '@/styles/app/auth/register/registerTypeUserStyles';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles/buttonStyles1';
import { buttonStyles2 } from '@/styles/components/button/buttonStyles/buttonStyles2';
import { buttonStyles3 } from '@/styles/components/button/buttonStyles/buttonStyles3';
import { buttonStyles4 } from '@/styles/components/button/buttonStyles/buttonStyles4';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterTypeUserScreen() {
  const {
    selected,
    setSelected,
    handleContinue,
    continuarHabilitado
  } = useRegisterTypeUser();

  return (

    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
    
      <View>
        
        <View style={styles.header}>

          <Image 
            source={require('@/assets/images/jex/Jex-Registrandose.png')} 
            style={styles.image}
          />

          <Text style={styles.title}>Registrate{'\n'}en JEX</Text>
        
        </View>

        <View style={styles.opcionesContainer}>

          <Stepper activeIndex={3} totalSteps={5} />

          <Text style={styles.texto}>Selecciona el tipo de usuario</Text>

          <Button
            texto="Empleado"
            styles={selected === 'Empleado' ? {texto:{...buttonStyles2.texto, marginLeft: 25}, boton:{...buttonStyles2.boton,alignItems: 'baseline'}} : buttonStyles3}
            onPress={() => setSelected('Empleado')}
          />

          <Button
            texto="Empleador"
            styles={selected === 'Empleador' ? {texto:{...buttonStyles2.texto, marginLeft: 25}, boton:{...buttonStyles2.boton,alignItems: 'baseline'}} : buttonStyles3}
            onPress={() => setSelected('Empleador')}
          />

        </View>

        <Button
          texto="Continuar"
          onPress={handleContinue}
          styles={continuarHabilitado ? buttonStyles1 : buttonStyles4}
          disabled={!continuarHabilitado}
        />
        
      </View>

    </SafeAreaView>

  );
}
