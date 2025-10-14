import { Keyboard, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/button/Button';
import { UploadImage } from '@/components/image/UploadImage';
import { Input } from '@/components/input/Input';
import { CharCounter } from '@/components/others/CharCounter';
import { ClickWindow } from '@/components/window/ClickWindow';
import { useStepOne } from '@/hooks/auth/additional-info/useStepOne';
import { stepOneAdditionalInfoStyles as styles } from '@/styles/app/auth/additional-info/stepOneStyles';
import { inputStyles1 } from '@/styles/components/input/inputStyles/inputStyles1';
import { charCounterStyles1 } from '@/styles/components/others/charCounterStyles1';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';
import { iconos } from '@/constants/iconos';
import { Colors } from '@/themes/colors';
import { buttonStyles5 } from '@/styles/components/button/buttonStyles/buttonStyles5';

export default function OnboardingProfileScreen() {
  const {
    sobreMi,
    setSobreMi,
    setImagenPerfil,
    setImagenFile,
    omitir,
    siguiente,
    showError,
    errorMessage,
    closeError,
  } = useStepOne();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        
        {/* Header */}
        <View style={styles.header}>
            <Text style={styles.title}>Información Adicional</Text>         
        </View>
                    
        {/* Foto */}
        <View style={styles.profileImageWrapper}>
          <UploadImage
            shape="circle"
            defaultImage={require('@/assets/images/jex/Jex-Postulantes-Default.png')}
            onChange={(file, uri) => {
              setImagenFile(file);
              setImagenPerfil(uri);
            }}
            containerStyle={{ alignItems: 'center' }}
            imageStyle={styles.profileImage}
          />
        </View>

        {/* Sobre mí */}
        <View>
          <Input
            value={sobreMi}
            onChangeText={setSobreMi}
            multiline
            numberOfLines={8}
            maxLength={200}
            placeholder="Escribí una breve descripción tuya"
            styles={{
                input: inputStyles1.input,
                inputContainer: {...inputStyles1.inputContainer, height: 200,
                    alignItems: 'flex-start', paddingTop: 10}
            }}
        />
          <CharCounter current={sobreMi.length} max={200} styles={charCounterStyles1} />
        </View>

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
          visible={showError}
          title='Error'
          icono={iconos.error(40, Colors.white)}
          onClose={closeError}
          styles={clickWindowStyles1}
          message={errorMessage}
          buttonText='Aceptar'
        />

      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
