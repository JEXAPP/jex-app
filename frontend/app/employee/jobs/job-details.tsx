import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, View} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/themes/colors';
import { jobDetailsStyles as styles } from '@/styles/app/employee/jobs/jobDetailsStyles';
import StaticWeekCalendar from '@/components/others/StaticWeekCalendar';
import { Button } from '@/components/button/Button';
import { useJobDetails } from '@/hooks/employee/jobs/useJobDetails';
import QRCode from 'react-native-qrcode-svg';
import ImageWindow from '@/components/window/ImageWindow';
import { NumberedList } from '@/components/list/NumberedList';
import { buttonStyles6 } from '@/styles/components/button/buttonStyles/buttonStyles6';
import { IconButton } from '@/components/button/IconButton';
import JobDetailsSkeleton from '@/constants/skeletons/employee/jobs/jobDetailsSkeleton';
import { DotsLoader } from '@/components/others/DotsLoader';
import { iconos } from '@/constants/iconos';

export default function JobDetailScreen() {
  const {
    job,
    attendanceEnabled,
    generateQR,
    generating,
    qrValue,
    loading,
    timeLabel
  } = useJobDetails();

  const [showInfo, setShowInfo] = useState(false);
  const [showQR, setShowQR] = useState(false);

    if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <JobDetailsSkeleton />
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
        <DotsLoader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <View style={styles.header}>
          <Text style={styles.title}>{job?.event_name}</Text>
          <Text style={styles.title2}>{job?.job_type}</Text>
        </View>

        {job?.start_date ? (
        <View style={styles.card}>
          <StaticWeekCalendar
            date={job.start_date}
            weekStartsOnMonday
            highlightColor={Colors.violet4}
          />
        </View>
        ) : null}

        <View style={styles.section}>
          {/* FILA 1: HORARIO + SUELDO */}
          <View style={styles.row}>
            {/* Burbuja Horario */}
            <View style={[styles.pill, styles.pillTime, { flex: 1 }]}>
              <View style={styles.pillTimeContent}>
                <Text style={styles.timeLabel}>Desde</Text>
                <Text style={styles.timeValue}>{job?.start_time ?? '-'}</Text>
                <Text style={styles.timeLabel}>Hasta</Text>
                <Text style={styles.timeValue}>{job?.end_time ?? '-'}</Text>
              </View>
            </View>

            {/* Burbuja Sueldo */}
            <View style={[styles.pill, styles.pillMoney, { flex: 1 }]}>
              <View style={styles.pillMoneyInner}>
                <Text style={styles.pillMoneyAmount}>{job?.payment ?? '-'}</Text>
                <Text style={styles.pillMoneyCurrency}>ARS</Text>
              </View>
            </View>
          </View>

          {/* FILA 2: UBICACIÓN */}
          <View style={[styles.card2, styles.locationCard]}>
            <Ionicons name="location" color={Colors.violet4} size={44} />
            <View style={styles.subCard}>
              <Text style={styles.cardTitle}>Ubicación</Text>
              <Text style={styles.text} numberOfLines={3}>{job?.event_location ?? '-'}</Text>
            </View>
          </View>
        </View>
        {/* Requisitos */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>¿Qué necesitás?</Text>
          {Array.isArray(job?.requirements) && job.requirements.length > 0 ? (
            <View style={{marginLeft: 10}}>
              <NumberedList items={job.requirements} />
            </View>
          ) : (
            <Text style={styles.text}>Sin requisitos especificados.</Text>
          )}
        </View>
      </ScrollView>

      {/* Botón generar QR */}
      <View style={[styles.buttonSpace, { flexDirection: 'row', alignItems: 'center' }]}>
        <View style={{ flex: 1}}>
        <Button
          texto={generating ? 'Generando...' : 'Generar QR'}
          styles={attendanceEnabled ? buttonStyles6 : buttonStyles6}
          onPress={() => {
            setShowQR(true);   
            generateQR();}}
          disabled={!attendanceEnabled || generating || loading}
          loading={generating || loading}
        />
        </View>

        <View style={{ marginLeft: 12, flexShrink: 0}}>
          <IconButton
            onPress={() => setShowInfo(true)}
            content="information-circle"
            sizeContent={30}
            sizeButton={50}
            backgroundColor= {Colors.violet4}
            contentColor={Colors.white}
            styles={{
                  button: {},
                  text: {},
                }}
          />
        </View>
      </View>

      {/* Modales */}
      <ImageWindow
        visible={showInfo}
        title="Cómo marcar tu asistencia"
        subtitle="El día del evento vas a poder generar un QR para registrar tu presente de manera rápida y sencilla."
        buttonText="Entendido"
        onClose={() => setShowInfo(false)}
        imageSource={require('@/assets/images/jex/Jex-QR.png')}
      />

      <ImageWindow
        visible={showQR}
        title="¡Escaneame!"
        onClose={() => {
          setShowQR(false);
        }}
      >
        {qrValue ? (
          <QRCode value={qrValue} size={260} />
        ) : (
          <Text style={{ textAlign: 'center', padding: 12 }}>Generando código...</Text>
        )}
      </ImageWindow>
    </SafeAreaView>
  );
}
