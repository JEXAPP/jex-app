import { Boton } from '@/components/Boton';
import { Input } from '@/components/Input';
import { ModalConTexto } from '@/components/ModalConTexto';
import { ModalTemporal } from '@/components/ModalTemporal';
import { useRegistroEmpleador } from '@/hooks/registro/useRegistroEmpleador';
import { seleccionarTipoStyles as styles } from '@/styles/app/registro/seleccionarTipoStyles';
import { botonStyles1 } from '@/styles/components/boton/botonStyles1';
import { inputStyles } from '@/styles/components/inputStyles';
import { modalConTextoStyles } from '@/styles/components/modalConTextoStyles';
import { modalTemporalStyles } from '@/styles/components/modalTemporalStyles';
import React from 'react';
import { Image, Text, View } from 'react-native';

export default function RegistroEmpleador() {
  const {
    razonSocial,
    cuit,
    telefono,
    email,
    password,
    confirmPassword,
    setRazonSocial,
    setCuit,
    setTelefono,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleRegistrarEmpleador,
    showError,
    errorMessage,
    showSuccess,
    closeError,
    closeSuccess,
  } = useRegistroEmpleador();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('@/assets/images/jex/Jex-Registrandose.png')} style={styles.image} />
        <Text style={styles.title}>Registro Empleador</Text>
      </View>

      <Input placeholder="Razón Social" value={razonSocial} onChangeText={setRazonSocial} styles={inputStyles}/>
      <Input placeholder="CUIT" keyboardType="numeric" value={cuit} onChangeText={setCuit} styles={inputStyles}/>
      <Input placeholder="Teléfono" keyboardType="phone-pad" value={telefono} onChangeText={setTelefono} styles={inputStyles}/>
      <Input placeholder="Correo electrónico" keyboardType="email-address" value={email} onChangeText={setEmail} styles={inputStyles}/>
      <Input placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} styles={inputStyles}/>
      <Input placeholder="Repetí la contraseña" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} styles={inputStyles}/>

      <Boton texto="Registrarse" onPress={handleRegistrarEmpleador} styles={botonStyles1} />

      <ModalConTexto visible={showError} message={errorMessage} onClose={closeError} styles={modalConTextoStyles}/>
      <ModalTemporal visible={showSuccess} message="¡Registro exitoso!" onClose={closeSuccess} styles={modalTemporalStyles} duration={2000}/>
    </View>
  );
}
