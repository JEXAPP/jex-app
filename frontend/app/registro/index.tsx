// app/register.tsx
import { botonStyles1 } from '@/styles/components/boton/botonStyles1';
import { botonStyles2 } from '@/styles/components/boton/botonStyles2';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { Boton } from '../../components/Boton';
import { ModalConTexto } from '../../components/ModalConTexto';
import { useSeleccionTipoUsuario } from '../../hooks/registro/useSeleccionTipoUsuario';
import { seleccionarTipoStyles as styles } from '../../styles/app/registro/seleccionarTipoStyles';
import { modalConTextoStyles } from '@/styles/components/modalConTextoStyles';

export default function RegisterScreen() {
  const {
    selected,
    setSelected,
    showError,
    setShowError,
    handleContinue,
  } = useSeleccionTipoUsuario();

  return (
    <View>
      <View style={styles.header}>
        <Image source={require('@/assets/images/jex/Jex-Registrandose.png')} style={styles.image} />
        <Text style={styles.title}>¿Qué tipo de usuario sos?</Text>
      </View>

      <View style={styles.opcionesContainer}>
        <Boton
          texto="Empleado"
          styles={selected === 'Empleado' ? botonStyles1 : botonStyles2}
          onPress={() => setSelected('Empleado')}
        />
        <Boton
          texto="Empleador"
          styles={selected === 'Empleador' ? botonStyles1 : botonStyles2}
          onPress={() => setSelected('Empleador')}
        />
      </View>

      <Boton
        texto="Continuar"
        onPress={handleContinue}
        styles={botonStyles1}
        disabled={!selected}
      />

      <ModalConTexto
        visible={showError}
        message="Debes seleccionar un tipo de usuario"
        styles={modalConTextoStyles}
        onClose={() => setShowError(false)
        }
      />
    </View>
  );
}
