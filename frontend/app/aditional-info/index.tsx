import React from 'react';
import { Keyboard, SafeAreaView, ScrollView, Text, TouchableWithoutFeedback, View, } from 'react-native';
import { aditionalInfoStyles as styles } from '@/styles/app/aditional-info/aditionalInfoStyles';
import { useAditionalInfo } from '@/hooks/aditional-info/useAditionalInfo';
import { Image, TouchableOpacity } from 'react-native';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles1';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { AddPhotoButton } from '../../components/AddPhotoButton';
import { CharCounter } from '../../components/charCounter';

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
                        placeholder="Contanos algo sobre vos..."
                        styles={{ input: styles.textArea }}
                    />
                    
                    <CharCounter 
                        current={sobreMi.length} 
                        max={200} 
                    />

                </View>
                
                <View style={styles.section}>

                    <Text style={styles.containerTitle}>Intereses</Text>

                    <Text style={styles.subtitleSection}>Elegí 3 intereses que quieras mostrar en tu perfil</Text>

                    <View style={styles.tagsContainer}>

                        {intereses.map((interes, index) => {
                        const seleccionado = interesesSeleccionados.includes(interes);

                        return (
                            <TouchableOpacity
                            key={index}
                            onPress={() => handleToggleIntereses(interes)}
                            style={[
                                styles.tag,
                                seleccionado && styles.tagSelected
                            ]}
                            >
                                
                            <Text style={[
                                styles.tagText,
                                seleccionado && styles.tagTextSelected
                            ]}>
                                {interes}
                            </Text>

                            </TouchableOpacity>
                        );
                        })}

                    </View>

                </View>

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