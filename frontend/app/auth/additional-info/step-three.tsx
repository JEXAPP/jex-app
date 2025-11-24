import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/button/Button';
import { SelectableTag } from '@/components/button/SelectableTags';
import { iconos } from '@/constants/iconos';
import { useStepThree } from '@/hooks/auth/additional-info/useStepThree';
import { stepThreeAdditionalInfoStyles as styles } from '@/styles/app/auth/additional-info/stepThreeStyles';
import { selectableTagStyles2 } from '@/styles/components/button/selectableTagsStyles/selectableTagsStyles2';
import { Colors } from '@/themes/colors';
import { ClickWindow } from '@/components/window/ClickWindow';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';
import { buttonStyles5 } from '@/styles/components/button/buttonStyles/buttonStyles5';

export default function OnboardingInterestsScreen() {
  const {
    omitir, siguiente,
    intereses, interesesSeleccionados, handleToggleIntereses,
    loading, showError, errorMessage, closeError,
  } = useStepThree();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header: Stepper + Omitir */}
      <View style={styles.header}>
          <Text style={styles.title}>Personalizá tu Algoritmo</Text>         
      </View>

      {/* Body */}
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.subtitle}>Elegí hasta 3 intereses para mejorar tus coincidencias</Text>

        <View style={styles.tagsContainer}>
          {intereses.map((interes) => (
            <SelectableTag
              key={interes.id}
              title={interes.name}
              selected={interesesSeleccionados.includes(interes.id)}
              onPress={() => handleToggleIntereses(interes.id)}
              styles={selectableTagStyles2}
            />
          ))}
        </View>

      </ScrollView>

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
