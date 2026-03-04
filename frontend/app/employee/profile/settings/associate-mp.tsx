import { Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/button/Button';
import { iconos } from '@/constants/iconos';
import { useAssociateMP } from '@/hooks/employee/profile/settings/useAssociateMP';
import { associateMPStyles as styles } from '@/styles/app/employee/profile/settings/associateMPStyles';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles/buttonStyles1';
import { Colors } from '@/themes/colors';
import { ClickWindow } from '@/components/window/ClickWindow';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';

export default function OnboardingMercadoPagoScreen() {
  const {
    status,
    busy,
    info,
    isAssociated,
    vincular,
    showError,
    errorMessage,
    closeError,
  } = useAssociateMP();

  const linked = isAssociated;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Asociar tu Cuenta</Text>
      </View>

      <View style={styles.body}>
        {!linked && (
          <View style={styles.card}>
            <Image
              source={require('@/assets/images/jex/Jex-Mercado-Pago.webp')}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.cardText}>
              Para recibir pagos, necesitás vincular tu cuenta de Mercado Pago.
            </Text>
          </View>
        )}

        {linked && (
          <View style={styles.card}>
            
            <Text style={styles.cardTitle2}>Cuenta vinculada</Text>
            <Image
              source={require('@/assets/images/jex/Jex-Asociado.webp')}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.cardText2}>
              Tu cuenta de Mercado Pago ya se encuentra asociada a JEX.
            </Text>
            <Text style={styles.cardText3}>
              Ya podés recibir pagos por los trabajos que realices sin realizar ninguna acción adicional desde aquí.
            </Text>
          </View>
        )}

        {!linked && (
          <Button
            texto="Vincular cuenta de Mercado Pago"
            onPress={vincular}
            styles={{
              ...buttonStyles1,
              boton: { ...buttonStyles1.boton, borderRadius: 50 },
            }}
            loading={busy || status === 'opening'}
          />
        )}

        {status === 'linked' && info && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Cuenta vinculada</Text>
            <Text style={styles.cardLine}>
              Usuario: {info.nickname ?? info.email ?? info.mp_user_id}
            </Text>
            <Text style={styles.cardMuted}>ID: {info.mp_user_id}</Text>
          </View>
        )}
      </View>

      <ClickWindow
        title="Error"
        visible={showError}
        message={errorMessage}
        onClose={closeError}
        styles={clickWindowStyles1}
        icono={iconos.error_outline(30, Colors.white)}
        buttonText="Entendido"
      />
    </SafeAreaView>
  );
}
