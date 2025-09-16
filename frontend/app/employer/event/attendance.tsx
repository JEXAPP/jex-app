
import React from 'react';
import { Image, Keyboard, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View, } from 'react-native';
import { attendanceStyles as styles } from '../../../styles/app/employer/event/attendanceStyles';
import { useAttendance } from '@/hooks/employer/event/useAttendance';
import { CameraView } from 'expo-camera';
import { Button } from '@/components/button/Button';
import { TempWindow } from '@/components/window/TempWindow';
import { tempWindowStyles1 } from '@/styles/components/window/tempWindowStyles1';
import { buttonStyles2 } from '@/styles/components/button/buttonStyles/buttonStyles2';

export default function AttendanceScreen() {
const {
    isScannerOpen,
    scanState,
    showConfirm,
    setShowConfirm,
    startScan,
    stopScan,
    onBarcodeScanned,
} = useAttendance();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
                <Text style={styles.title}>Asistencia</Text>
            </View>

            <TouchableOpacity
                style={styles.card}
                onPress={startScan}>
                <View>
                    <Image source={require('@/assets/images/jex/Jex-Escanear.png')} style={styles.jex}/>            
                </View>
                <View style={styles.qrRight}>
                    <Text style={styles.text}>Escaneá</Text>
                </View>
            </TouchableOpacity>

         </ScrollView>

        {isScannerOpen && (
        <>
        <CameraView
            facing="back"
            style={{ position:'absolute', inset:0 }}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={onBarcodeScanned}
        />
        <Button
            texto="Cerrar"
            onPress={stopScan}
            styles={buttonStyles2}
        />

        </>
      )}

      <TempWindow
        visible={showConfirm}
        onClose={() => setShowConfirm(false)}
        duration={800} // 0.8 segundos, ajustá a gusto
        styles={tempWindowStyles1}
        icono={scanState.kind === 'ok' ? 'checkmark-circle' : 'close-circle'}
    />
        </View>
    </TouchableWithoutFeedback>
        



    )}