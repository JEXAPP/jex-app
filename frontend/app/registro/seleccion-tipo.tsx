// app/register.tsx
import { botonStyles1 } from '@/styles/components/boton/botonStyles1';
import { botonStyles2 } from '@/styles/components/boton/botonStyles2';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { Boton } from '../../components/Boton';
import { useSeleccionTipoUsuario } from '../../hooks/registro/useSeleccionTipoUsuario';
import { seleccionarTipoStyles as styles } from '../../styles/app/registro/seleccionarTipoStyles';
import { botonStyles3 } from '@/styles/components/boton/botonStyles3';
import { botonStyles4 } from '@/styles/components/boton/botonStyles4';

export default function SeleccionTipoUsuario() {
  const {
    selected,
    setSelected,
    handleContinue,
    continuarHabilitado
  } = useSeleccionTipoUsuario();

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

        <Text style={styles.texto}>Paso 3: Selecciona el tipo de usuario</Text>

        <Boton
          texto="Empleado"
          styles={selected === 'Empleado' ? {texto:{...botonStyles2.texto, marginLeft: 25}, boton:{...botonStyles2.boton,alignItems: 'baseline'}} : botonStyles3}
          onPress={() => setSelected('Empleado')}
        />

        <Boton
          texto="Empleador"
          styles={selected === 'Empleador' ? {texto:{...botonStyles2.texto, marginLeft: 25}, boton:{...botonStyles2.boton,alignItems: 'baseline'}} : botonStyles3}
          onPress={() => setSelected('Empleador')}
        />

      </View>

      <Boton
        texto="Continuar"
        onPress={handleContinue}
        styles={continuarHabilitado ? botonStyles1 : botonStyles4}
        disabled={!continuarHabilitado}
      />
      
    </View>
  );
}
