import { buttonStyles1 } from '@/styles/components/button/buttonStyles1';
import { buttonStyles2 } from '@/styles/components/button/buttonStyles2';
import { buttonStyles3 } from '@/styles/components/button/buttonStyles3';
import { buttonStyles4 } from '@/styles/components/button/buttonStyles4';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { useRegisterTypeUser } from '../../hooks/register/useRegisterTypeUser';
import { registerTypeUserStyles as styles } from '../../styles/app/register/registerTypeUserStyles';

export default function RegisterTypeUserScreen() {
  const {
    selected,
    setSelected,
    handleContinue,
    continuarHabilitado
  } = useRegisterTypeUser();

  return (
    
    <View>
      
      <View style={styles.header}>

        <Image 
          source={require('@/assets/images/jex/Jex-Registrandose.png')} 
          style={styles.image}
        />

        <Text style={styles.title}>Registrate{'\n'}en JEX</Text>
      
      </View>

      <View style={styles.opcionesContainer}>

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
  );
}
