import { SelectableTag } from '@/components/button/SelectableTags';
import { CharCounter } from '@/components/others/CharCounter';
import { ClickWindow } from '@/components/window/ClickWindow';
import { useAditionalInfo } from '@/hooks/employee/profile/useAditionalInfo';
import { aditionalInfoStyles as styles } from '@/styles/app/employee/profile/aditionalInfoStyles';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles/buttonStyles1';
import { Colors } from '@/themes/colors';
import { Button } from '@/components/button/Button';
import { Input } from '@/components/input/Input';
import { Ionicons } from '@expo/vector-icons';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';
import React from 'react';
import { Keyboard, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { inputStyles1 } from '@/styles/components/input/inputStyles/inputStyles1';
import { selectableTagStyles2 } from '@/styles/components/button/selectableTagsStyles/selectableTagsStyles2';
import { SafeAreaView } from 'react-native-safe-area-context';
import { charCounterStyles1 } from '@/styles/components/others/charCounterStyles1';
import { TempWindow } from '@/components/window/TempWindow';
import { tempWindowStyles1 } from '@/styles/components/window/tempWindowStyles1';
import { iconos } from '@/constants/iconos';
import { UploadImage } from '@/components/others/UploadImage';

export default function AditionalInfoScreen () {
    const {
        sobreMi,
        setSobreMi,
        intereses,
        interesesSeleccionados,
        guardar,
        handleToggleIntereses,
        showError,
        omitir,
        errorMessage,
        showSuccess,
        closeError,
        closeSuccess,
        imagenPerfil,
        showClickWindow,
        setShowClickWindow,
        setImagenFile,
        setImagenPerfil,
        loading
    } = useAditionalInfo();

return (   
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>

            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

                <View style={styles.header}>

                    <Text style={styles.title}>Mi Perfil</Text>

                    <TouchableOpacity onPress={omitir}>
                        <Text style={styles.skipButtonText}>Omitir</Text>
                    </TouchableOpacity>
                
                </View>

                <View style={styles.profileImageWrapper}>

                    <UploadImage
                        shape="circle"
                         defaultImage={require('@/assets/images/jex/Jex-FotoPerfil.png')}
                        onChange={(file, uri) => {
                        setImagenFile(file);
                        setImagenPerfil(uri);
                        }}
                        containerStyle={{ alignItems: 'center' }}
                        imageStyle={styles.profileImage}
                    />

                </View>

                <View>

                    <Text style={styles.containerTitle}>Sobre mí</Text>

                    <Input
                        value={sobreMi}
                        onChangeText={setSobreMi}
                        multiline
                        numberOfLines={4}
                        maxLength={200}
                        placeholder="Contanos algo sobre vos"
                        styles={{
                            input: {
                                ...inputStyles1.input,
                                height: 100,
                                textAlignVertical: 'top',
                            },
                            inputContainer: inputStyles1.inputContainer
                        }}
                    />

                    <CharCounter 
                        current={sobreMi.length}
                        max={200}
                        styles={charCounterStyles1}
                    />
                    
                </View>
                
                <View>

                    <Text style={styles.containerTitle}>Intereses</Text>

                    <Text style={styles.sectionSubtitle}>Elegí 3 intereses que quieras mostrar en tu perfil</Text>

                    <View style={styles.tagsContainer}>
                        {intereses.map((interes) => (
                            <SelectableTag
                                styles={selectableTagStyles2}
                                key={interes.id}
                                title={interes.name}
                                selected={interesesSeleccionados.includes(interes.id)}
                                onPress={() => handleToggleIntereses(interes.id)}
                            />
                        ))}
                    </View>

                </View>

                <ClickWindow
                    visible={showClickWindow}
                    onClose={() => setShowClickWindow(false)}
                    title='Faltan Datos'
                    message='Debes completar al menos un campo para guardar'
                    buttonText='Aceptar'
                    styles={ clickWindowStyles1 }
                    icono={
                        <Ionicons name="alert-circle" 
                        size={30}
                        color={Colors.violet4}/>
                    }
                />

            </ScrollView>

            <View style={styles.saveButton}>

                <Button 
                    texto="Guardar" 
                    onPress={guardar} 
                    styles={buttonStyles1}
                    loading={loading}
                />

            </View>

            <TempWindow
                visible={showSuccess}
                icono={iconos.exito(40, Colors.white)}
                onClose={closeSuccess}
                styles={tempWindowStyles1}
                duration={2000}
                />

        </SafeAreaView>
          
    </TouchableWithoutFeedback>
);
}