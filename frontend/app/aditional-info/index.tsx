import React from 'react';
import { Keyboard, SafeAreaView, ScrollView, Text, TouchableWithoutFeedback, View, Image, TouchableOpacity} from 'react-native';
import { aditionalInfoStyles as styles } from '@/styles/app/aditional-info/aditionalInfoStyles';
import { useAditionalInfo } from '@/hooks/aditional-info/useAditionalInfo';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles1';
import { charCounterStyles } from '@/styles/components/charCounterStyle';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { AddPhotoButton } from '../../components/AddPhotoButton';
import { CharCounter } from '@/components/CharCounter';
import { ClickWindow } from '@/components/ClickWindow';
import { Ionicons } from '@expo/vector-icons';
import { clickWindowStyles1 } from '../../styles/components/clickWindowStyles1';
import { Colors } from '@/themes/colors';
import { SelectableTag } from '@/components/SelectableTags';
import { inputStyles1 } from '../../styles/components/input/inputStyles1';

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
        seleccionarImagen,
        imagenPerfil,
        eliminarImagen,
        showClickWindow,
        setShowClickWindow
    } = useAditionalInfo();

return (   
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      
        <SafeAreaView style={styles.container}>

            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

                <View style={styles.header}>

                    <Text style={styles.title}>Mi Perfil</Text>

                    <TouchableOpacity onPress={omitir}>
                        <Text style={styles.skipButtonText}>Omitir</Text>
                    </TouchableOpacity>
                
                </View>

                <View style={styles.profileImageWrapper}>

                    <Image
                        source={
                            imagenPerfil
                            ? { uri: imagenPerfil }
                            : require('@/assets/images/jex/Jex-FotoPerfil.png') // imagen por defecto
                        }
                        style={styles.profileImage}
                    />
                    
                    <AddPhotoButton
                        hasImage={!!imagenPerfil}
                        onPress={imagenPerfil ? eliminarImagen : seleccionarImagen}
                    />

                </View>

                <View style={styles.section}>

                    <Text style={styles.containerTitle}>Sobre mí</Text>

                    <Input
                        value={sobreMi}
                        onChangeText={setSobreMi}
                        multiline
                        numberOfLines={4}
                        maxLength={200}
                        placeholder="Contanos algo sobre vos"
                        styles={inputStyles1}
                    />

                    <CharCounter 
                        current={sobreMi.length}
                        max={200}
                        styles={charCounterStyles}
                    />
                    
                </View>
                
                <View style={styles.section}>

                    <Text style={styles.containerTitle}>Intereses</Text>

                    <Text style={styles.sectionSubtitle}>Elegí 3 intereses que quieras mostrar en tu perfil</Text>

                    <View style={styles.tagsContainer}>
                        {intereses.map((interes) => (
                            <SelectableTag
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

                <Button 
                    texto="Guardar" 
                    onPress={guardar} 
                    styles={buttonStyles1}
                />

        </SafeAreaView>
          
    </TouchableWithoutFeedback>
);
}