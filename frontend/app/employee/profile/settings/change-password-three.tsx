import { Button } from '@/components/button/Button';
import { Input } from '@/components/input/Input';
import { PasswordStrengthBar } from '@/components/others/PasswordStrengthBar';
import { ClickWindow } from '@/components/window/ClickWindow';
import { TempWindow } from '@/components/window/TempWindow';
import { iconos } from '@/constants/iconos';
import { useChangePasswordThree } from '@/hooks/employee/profile/settings/useChangePasswordThree';
import { changePasswordThreeStyles as styles } from '@/styles/app/employee/profile/settings/changePasswordThreeStyles';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles/buttonStyles1';
import { buttonStyles4 } from '@/styles/components/button/buttonStyles/buttonStyles4';
import { inputStyles1 } from '@/styles/components/input/inputStyles/inputStyles1';
import { passwordStrengthStyles1 } from '@/styles/components/others/passwordStrengthBarStyles1';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';
import { tempWindowStyles1 } from '@/styles/components/window/tempWindowStyles1';
import { Colors } from '@/themes/colors';
import React from 'react';
import { Image, Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewPasswordFromProfileScreen() {
  const {
    password,
    loading,
    confirmPassword,
    showSuccess,
    showError,
    errorMessage,
    continuarHabilitado,
    mostrarPassword,
    mostrarConfirmPassword,
    setMostrarPassword,
    setMostrarConfirmPassword,
    setConfirmPassword,
    handleGuardar,
    setPassword,
    closeError,
    closeSuccess,
    setIsPasswordValid,
  } = useChangePasswordThree();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              source={require('@/assets/images/jex/Jex-Olvidadizo.webp')}
              style={styles.image}
            />
            <Text style={styles.title}>Cambiar contraseña</Text>
          </View>

          <Text style={styles.texto}>Ingresá tu nueva contraseña</Text>

          <View style={styles.content}>
            <View>
              <Input
                placeholder="Nueva contraseña"
                secureTextEntry={!mostrarPassword}
                value={password}
                onChangeText={setPassword}
                styles={inputStyles1}
              />

              {iconos.ojoContra(
                mostrarPassword,
                Colors.violet4,
                Colors.violet4,
                () => setMostrarPassword(!mostrarPassword)
              )}
            </View>

            <View style={styles.passwordBar}>
              <PasswordStrengthBar
                password={password}
                onValidChange={setIsPasswordValid}
                styles={passwordStrengthStyles1}
              />
            </View>

            <View>
              <Input
                placeholder="Confirmar nueva contraseña"
                secureTextEntry={!mostrarConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                styles={inputStyles1}
              />

              {iconos.ojoContra(
                mostrarConfirmPassword,
                Colors.violet5,
                Colors.violet3,
                () => setMostrarConfirmPassword(!mostrarConfirmPassword)
              )}
            </View>
          </View>

          <Button
            texto="Guardar"
            onPress={handleGuardar}
            loading={loading}
            styles={continuarHabilitado ? buttonStyles1 : buttonStyles4}
            disabled={!continuarHabilitado}
          />

          <ClickWindow
            title="Error"
            visible={showError}
            message={errorMessage}
            onClose={closeError}
            styles={clickWindowStyles1}
            icono={iconos.error_outline(30, Colors.white)}
            buttonText="Entendido"
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
