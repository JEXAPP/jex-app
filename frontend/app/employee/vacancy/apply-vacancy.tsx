import { Button } from '@/components/button/Button';
import { SelectableTag } from '@/components/button/SelectableTags';
import { TempWindow } from '@/components/window/TempWindow';
import { useApplyVacancy } from '@/hooks/employee/vacancy/useApplyVacancy';
import { applyVacancyStyles as styles } from '@/styles/app/employee/vacancy/applyVacancyStyles';
import { selectableTagStyles1 } from '@/styles/components/button/selectableTagsStyles/selectableTagsStyles1';
import { tempWindowStyles1 } from '@/styles/components/window/tempWindowStyles1';
import { Colors } from '@/themes/colors';
import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { buttonStyles1 } from '../../../styles/components/button/buttonStyles/buttonStyles1';
import { buttonStyles4 } from '@/styles/components/button/buttonStyles/buttonStyles4';
import { iconos } from '@/constants/iconos';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';
import { ClickWindow } from '@/components/window/ClickWindow';


export default function ApplyVacancyScreen() {
  const {
    job,
    organizer,
    handleApply,
    turnos,
    turnosSeleccionados,
    handleToggleTurnos,
    showError,
    setShowError,
    errorMessage,
    showSuccess,
    loading,
    salarioAMostrar,
    turnoSeleccionadoValido,
    closeSuccess
  } = useApplyVacancy();

  const stars = job?.rating ? Math.round(job.rating) : 0;

  if (!job || !organizer) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando datos...</Text>
      </SafeAreaView>
    );
  }

  return (

    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <View style={styles.header}>

          <View style={styles.headerTop}>
            <Image
              source={require('@/assets/images/jex/Jex-FotoPerfil.png')}
              style={styles.logoWrapper}
            />

            <View style={styles.headerText}>
              <Text style={styles.eventTitle}>{job.title}</Text>

              <View style={styles.ratingWrapper}>
                {Array.from({ length: stars }).map((_, index) => (
                  <Ionicons
                    key={index}
                    name="star"
                    size={16}
                    style={styles.starsIcon}
                  />
                ))}
              </View>

            </View>

          </View>

          <Image source={require('@/assets/images/maps.png')} style={styles.map} />
          
        </View>

        <Text style={styles.containerTitle}>{job.role}</Text>
        <Text style={styles.containerText}>{job.description}</Text>

        <Text style={styles.containerSubtitle}>¿Qué necesitás?</Text>

        {job.requirements.map((item: string, index: number) => (
          <View key={index} style={styles.organizerArea}>
            <Text style={styles.bulletNumber}>{index + 1}.</Text>
            <Text style={styles.containerBulletPoints}>{item}</Text>
          </View>
        ))}

        <Text style={styles.containerSubtitle}>Turnos disponibles</Text>
        
        {turnos.map((bloque) => (
          <View key={bloque.id}>
            <Text style={[styles.containerText2]}>
              {bloque.dia}
            </Text>
            {bloque.turnos.map((turno) => (
              <SelectableTag
                styles={selectableTagStyles1}
                key={turno.id}
                title={turno.horario}
                subtitle={turno.paga}
                iconName="time"
                selected={turnosSeleccionados.includes(turno.id)}
                onPress={() => handleToggleTurnos(turno.id)}
              />
            ))}
          </View>
        ))}

        <View style={styles.separator} />

        <Text style={styles.containerSubtitle}>Conocé al organizador</Text>

        <View style={styles.organizerContainer}>
          <View>
            <Image
              source={require('@/assets/images/jex/Jex-FotoPerfil.png')}
              style={styles.logoWrapper}
            />
            <View style={styles.organizerNameTag}>
              <Text style={styles.organizerNameText}>{organizer.name}</Text>
            </View>
          </View>

          <View style={styles.organizerInfo}>
            <View style={styles.organizerInfoItem}>
              <Text style={styles.organizerInfoValue}>{organizer.reviews}</Text>
              <Text style={styles.organizerInfoLabel}>Evaluaciones</Text>
            </View>

            <View style={styles.organizerInfoItem}>
              <Text style={styles.organizerInfoValue}>
                {organizer.rating} <Text style={{ color: Colors.violet5 }}>★</Text>
              </Text>
              <Text style={styles.organizerInfoLabel}>Puntaje</Text>
            </View>

            <View style={styles.organizerInfoItem}>
              <Text style={styles.organizerInfoValue}>
                {organizer.jexTime.split(' ')[0]}
              </Text>
              <Text style={styles.organizerInfoLabel}>Años en Jex</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.applyBox}>
        <View style={styles.applyBox2}>
          <Text style={styles.salary}>{salarioAMostrar}</Text>
          <Text style={styles.deadline}>Vence el {job.deadline}</Text>
        </View>
        <Button
          onPress={handleApply}
          disabled={!turnoSeleccionadoValido}
          styles={turnoSeleccionadoValido ? 
            {texto: buttonStyles1.texto, boton: { ...buttonStyles1.boton, width: 150 }} 
            : {texto: buttonStyles4.texto, boton: { ...buttonStyles4.boton, width: 150 }}} 
          texto="Postularme"
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

      <ClickWindow
        title='Error'
        visible={showError} 
        message={errorMessage} 
        onClose={() => setShowError(false)} 
        styles={clickWindowStyles1} 
        icono={iconos.error_outline(30, Colors.white)}
        buttonText='Entendido'
      />

    </SafeAreaView>
  );
}
