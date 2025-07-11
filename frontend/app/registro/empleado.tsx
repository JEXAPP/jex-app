import { botonStyles1 } from '@/styles/components/boton/botonStyles1';
import { inputStyles } from '@/styles/components/inputStyles';
import { modalConTextoStyles } from '@/styles/components/modalConTextoStyles';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { Boton } from '../../components/Boton';
import { Input } from '../../components/Input';
import { ModalConTexto } from '../../components/ModalConTexto';
import { ModalTemporal } from '../../components/ModalTemporal';
import { useRegistroEmpleado } from '../../hooks/registro/useRegistroEmpleado';
import { seleccionarTipoStyles as styles } from '../../styles/app/registro/seleccionarTipoStyles';
import { modalTemporalStyles } from '@/styles/components/modalTemporalStyles';

export default function RegistroEmpleadoScreen() {
  const {
    nombre,
    apellido,
    email,
    password,
    confirmPassword,
    setNombre,
    setApellido,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleRegistrarEmpleado,
    showError,
    errorMessage,
    showSuccess,
    closeError,
    closeSuccess,
  } = useRegistroEmpleado();


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('@/assets/images/jex/Jex-Registrandose.png')} style={styles.image} />
        <Text style={styles.title}>Registrate como Empleado</Text>
      </View>

      <Input placeholder="Nombre" value={nombre} onChangeText={setNombre} styles={inputStyles}/>
      <Input placeholder="Apellido" value={apellido} onChangeText={setApellido} styles={inputStyles}/>
      <Input placeholder="Correo electrónico" keyboardType="email-address" value={email} onChangeText={setEmail} styles={inputStyles}/>
      <Input placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} styles={inputStyles}/>
      <Input placeholder="Repetí la contraseña" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} styles={inputStyles}/>

      <Boton texto="Registrarse" onPress={handleRegistrarEmpleado} styles={botonStyles1} />

      <ModalConTexto visible={showError} message={errorMessage} onClose={closeError} styles={modalConTextoStyles}/>
      <ModalTemporal visible={showSuccess} message="¡Registro exitoso!" onClose={closeSuccess} styles={modalTemporalStyles} duration={2000}/>
    </View>
  );
}
