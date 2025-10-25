import { Text, TouchableOpacity, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/button/Button';
import { iconos } from '@/constants/iconos';
import { useStepThree } from '@/hooks/auth/additional-info/useStepThree';
import { stepThreeAdditionalInfoStyles as styles } from '@/styles/app/auth/additional-info/stepThreeStyles';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles/buttonStyles1';
import { Colors } from '@/themes/colors';
import { buttonStyles5 } from '@/styles/components/button/buttonStyles/buttonStyles5';
import { ClickWindow } from '@/components/window/ClickWindow';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';

export default function OnboardingMercadoPagoScreen() {
  const {
    // estado MP
    status, busy, info, 

    // nav
    omitir, siguiente,

    // acciones
    vincular, reintentarVerificacion,

    // feedback
    showError, errorMessage, closeError,
  } = useStepThree();

  const linked = status === 'linked';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
          <Text style={styles.title}>Vinculá con Mercado Pago</Text>         
      </View>

      {/* Cuerpo */}
      <View style={styles.body}>

        {!linked && (
          <View style={styles.card}>
            <Image
                source={require("@/assets/images/jex/Jex-Mercado-Pago.webp")}
                style={styles.image}
                resizeMode="contain"
              />

            <Text style={styles.cardText}>
              Para recibir pagos, necesitás vincular tu cuenta de Mercado Pago.
            </Text>

          </View>
        )}

        <Button
          texto="Vincular con Mercado Pago"
          onPress={vincular}
          styles={{...buttonStyles1, boton: {...buttonStyles1.boton, borderRadius: 50}}}
          loading={busy || status === 'opening'}
        />

        <Button 
          onPress={reintentarVerificacion} 
          disabled={busy}
          styles={{boton:{...buttonStyles5.boton, width: 200, alignItems: 'flex-start'}, texto:{...buttonStyles5.texto, ...styles.helpLinkText}}} 
          texto="Ya autoricé, verificar ahora"
        />

        {linked && info && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Cuenta vinculada</Text>
            <Text style={styles.cardLine}>
              Usuario: {info.nickname ?? info.email ?? info.mp_user_id}
            </Text>
            <Text style={styles.cardMuted}>ID: {info.mp_user_id}</Text>
          </View>
        )}
      </View>

      {/* Footer: Siguiente */}
      <View style={styles.footer}>
        <Button 
          onPress={omitir} 
          styles={{boton:{...buttonStyles5.boton, width: 100, alignItems: 'flex-start'}, texto:{...buttonStyles5.texto, ...styles.skipButton}}} 
          texto="Omitir"
        />
        <Button
          texto="Siguiente"
          onPress={siguiente}
          styles={{boton:{...buttonStyles5.boton, width: 100}, texto:{...buttonStyles5.texto, ...styles.nextButton}}}
        />
      </View>

      <ClickWindow
        title='Error'
        visible={showError} 
        message={errorMessage} 
        onClose={closeError} 
        styles={clickWindowStyles1} 
        icono={iconos.error_outline(30, Colors.white)}
        buttonText='Entendido'
      />

    </SafeAreaView>
  );
}
