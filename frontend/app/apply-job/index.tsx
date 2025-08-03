import { View, Text, ScrollView, Image, Pressable, SafeAreaView } from 'react-native';
import { useApplyJob } from '@/hooks/apply-job/useApplyJob';
import { applyJobStyles as styles } from '@/styles/app/apply-job/applyJobStyles';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/themes/colors';
import { SelectableTag } from '@/components/SelectableTags';
import { TempWindow } from '@/components/TempWindow';
import { tempWindowStyles1 } from '@/styles/components/tempWindowStyles1';

export default function ApplyJobScreen() {
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
    setErrorMessage,
    showSuccess,
    setShowSuccess,
    showErrorTemp,
    setShowErrorTemp,
  } = useApplyJob();

  const stars = job?.rating ? Math.round(job.rating) : 0;

  if (!job || !organizer) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando datos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

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

        <View style={styles.section}>
          <Text style={styles.containerTitle}>{job.role}</Text>
          <Text style={styles.containerText}>{job.description}</Text>

          <View style={styles.row}>
            <Ionicons name="calendar-clear" size={20} style={styles.icon} />
            <Text style={styles.containerText}>{job.date}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="time" size={20} style={styles.icon} />
            <Text style={styles.containerText}>{job.time}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
          <Text style={styles.containerSubtitle}>¿Qué necesitás?</Text>
          {job.requirements.map((item: string, index: number) => (
            <View key={index} style={styles.organizerArea}>
              <Text style={styles.containerBulletPoints}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
          <Text style={styles.containerSubtitle}>Turnos disponibles</Text>
          {turnos.map((bloque) => (
            <View key={bloque.id}>
              <Text style={[styles.containerText]}>
                {bloque.dia}
              </Text>
              <View style={styles.tagsContainer}>
                {bloque.turnos.map((turno) => (
                  <SelectableTag
                    key={turno.id}
                    title={turno.horario}
                    subtitle={turno.paga}
                    iconName="time"
                    selected={turnosSeleccionados.includes(turno.id)}
                    onPress={() => handleToggleTurnos(turno.id)}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
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
        </View>
      </ScrollView>

      <View style={styles.applyBox}>
        <View>
          <Text style={styles.salary}>${job.salary}</Text>
          <Text style={styles.deadline}>Vence el {job.deadline}</Text>
        </View>
        <Pressable onPress={handleApply} style={styles.applyButton}>
          <Text style={styles.applyText}>Postularme</Text>
        </Pressable>
      </View>

      <TempWindow
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
        duration={2500}
        icono={<Ionicons name="checkmark-circle" size={80} color="green" />}
        styles={tempWindowStyles1}
      />

      <TempWindow
        visible={showErrorTemp}
        onClose={() => setShowErrorTemp(false)}
        duration={2500}
        icono={<Ionicons name="close-circle" size={80} color="red" />}
        styles={tempWindowStyles1}
      />
    </SafeAreaView>
  );
}
