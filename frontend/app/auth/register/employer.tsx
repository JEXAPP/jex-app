// app/auth/register/RegisterEmployerScreen.tsx
import { Button } from '@/components/button/Button';
import { Input } from '@/components/input/Input';
import { Stepper } from '@/components/others/Stepper';
import { ClickWindow } from '@/components/window/ClickWindow';
import { TempWindow } from '@/components/window/TempWindow';
import { iconos } from '@/constants/iconos';
import { useRegisterEmployer } from '@/hooks/auth/register/useRegisterEmployer';
import { registerEmployerStyles as styles } from '@/styles/app/auth/register/registerEmployerStyles';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles/buttonStyles1';
import { buttonStyles4 } from '@/styles/components/button/buttonStyles/buttonStyles4';
import { inputStyles1 } from '@/styles/components/input/inputStyles/inputStyles1';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';
import { tempWindowStyles1 } from '@/styles/components/window/tempWindowStyles1';
import { Colors } from '@/themes/colors';
import { termsAndConditionsText } from '@/assets/legal/terms_and_conditions';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import {
  Image,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterEmployerScreen() {
  const {
    nombreEmpresa,
    continuarHabilitado,
    handleRegistrarEmpleador,
    setNombreEmpresa,
    showError,
    errorMessage,
    showSuccess,
    closeError,
    closeSuccess,
    loading,
    termsAccepted,
    setTermsAccepted,
  } = useRegisterEmployer();

  const [termsVisible, setTermsVisible] = useState(false);
  const [termsContent, setTermsContent] = useState('');

  const openTerms = () => {
    setTermsContent(termsAndConditionsText);
    setTermsVisible(true);
  };

  const closeTerms = () => {
    setTermsVisible(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              source={require('@/assets/images/jex/Jex-Registrandose.webp')}
              style={styles.image}
            />
            <Text style={styles.title}>
              Registrate{'\n'}en JEX
            </Text>
          </View>

          <View style={styles.step}>
            <Stepper activeIndex={4} totalSteps={5} />
            <Text style={styles.texto}>Completá los datos de tu empresa</Text>
          </View>

          <View style={styles.opcionesContainer}>
            <Input
              placeholder="Nombre Empresa"
              value={nombreEmpresa}
              onChangeText={setNombreEmpresa}
              styles={inputStyles1}
            />
          </View>

          {/* Aceptación de Términos y Condiciones */}
          <View style={styles.termsRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setTermsAccepted(prev => !prev)}
              style={styles.termsCheckbox}
            >
              {termsAccepted && <View style={styles.termsCheckboxInner} />}
            </TouchableOpacity>

            <Text style={styles.termsText}>
              Acepto los{' '}
              <Text style={styles.termsLink} onPress={openTerms}>
                Términos y Condiciones
              </Text>
            </Text>
          </View>

          <Button
            texto="Registrarse"
            loading={loading}
            onPress={handleRegistrarEmpleador}
            styles={continuarHabilitado ? buttonStyles1 : buttonStyles4}
            disabled={!continuarHabilitado}
          />

          <ClickWindow
            title="Error"
            visible={showError}
            message={errorMessage}
            onClose={closeError}
            styles={clickWindowStyles1}
            icono={<MaterialIcons size={24} color={Colors.violet5} />}
            buttonText="Entendido"
          />

          <TempWindow
            visible={showSuccess}
            icono={iconos.exito(40, Colors.white)}
            onClose={closeSuccess}
            styles={tempWindowStyles1}
            duration={2000}
          />

          {/* Modal de Términos y Condiciones */}
          <Modal visible={termsVisible} animationType="slide" transparent>
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.6)',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  backgroundColor: '#fff',
                  margin: 20,
                  borderRadius: 12,
                  paddingVertical: 18,
                  maxHeight: '82%',
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontFamily: 'interBold',
                    marginLeft: 20,
                    marginBottom: 8,
                    color: Colors.violet3,
                  }}
                >
                  Términos y Condiciones
                </Text>

                <ScrollView style={{ marginBottom: 12, paddingHorizontal: 20 }}>
                  {termsContent.split(/\n(?=\d+\.)/).map((section, index) => {
                    const match = section.match(/^(\d+\.\s*[^\n]*)\n?(.*)$/s);
                    const subtitle = match ? match[1].trim() : '';
                    const body = match ? match[2].trim() : section.trim();

                    return (
                      <View key={index} style={{ marginBottom: 12 }}>
                        {subtitle.length > 0 && (
                          <Text
                            style={{
                              fontFamily: 'interBold',
                              color: Colors.black,
                              fontSize: 16,
                              marginBottom: 4,
                            }}
                          >
                            {subtitle}
                          </Text>
                        )}

                        {body.length > 0 && (
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: 'interRegular',
                              color: '#333',
                              lineHeight: 22,
                              textAlign: 'justify',
                            }}
                          >
                            {body}
                          </Text>
                        )}
                      </View>
                    );
                  })}
                </ScrollView>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    paddingHorizontal: 16,
                  }}
                >
                  <TouchableOpacity
                    onPress={closeTerms}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 16,
                      borderRadius: 8,
                      marginRight: 8,
                      backgroundColor: '#efefef',
                    }}
                  >
                    <Text>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
