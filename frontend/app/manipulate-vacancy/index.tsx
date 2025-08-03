import { View, Text, ScrollView, Image, SafeAreaView } from 'react-native';
import { useApplyJob } from '@/hooks/apply-job/useApplyJob';
import { Ionicons } from '@expo/vector-icons';
import { SelectableTag } from '@/components/SelectableTags';
import { ClickWindow } from '@/components/ClickWindow';
import { clickWindowStyles1 } from '@/styles/components/clickWindowStyles1';
import { useManipularVacante } from '@/hooks/manipulate-vacancy/useManipularVacante';
import { Colors } from '@/themes/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { manipularStyles as styles } from '@/styles/app/manipulate-vacancy/manipularStyles';
import { applyJobStyles as applyStyles } from '@/styles/app/apply-job/applyJobStyles';

export default function manipularVacante() {
  const {
    vacanteOculta,
    setVacanteOculta,
    mostrarAlertaOcultar,
    setMostrarAlertaOcultar,
    mostrarAlertaMostrar,
    setMostrarAlertaMostrar,
    mostrarAlertaEliminar,
    setMostrarAlertaEliminar,
    cambiarEstadoVacante,
  } = useManipularVacante();

  const {
    job,
    turnos,
    turnosSeleccionados,
    handleToggleTurnos,
  } = useApplyJob();

  const { id } = useLocalSearchParams();
  const vacanteId = Number(id);
  const stars = job?.rating ? Math.round(job.rating) : 0;
  const router = useRouter();

  if (!job) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando datos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerTop}>
        <View style={styles.tagsContainer}>
          <SelectableTag
            title={vacanteOculta ? 'Mostrar' : 'Ocultar'}
            iconName={vacanteOculta ? 'eye' : 'eye-off'}
            selected={vacanteOculta}
            onPress={() => {
              vacanteOculta ? setMostrarAlertaMostrar(true) : setMostrarAlertaOcultar(true);
            }}
          />
          <SelectableTag
            title="Editar"
            iconName="pencil"
            selected={false}
            onPress={() => router.push(`/edit-vacancy`)}
          />
          <SelectableTag
            title="Eliminar"
            iconName="trash"
            selected={false}
            onPress={() => setMostrarAlertaEliminar(true)}
          />
        </View>

        <ClickWindow
          visible={mostrarAlertaOcultar}
          title="¡CUIDADO!"
          message="Al ocultar esta publicación, dejará de estar visible para los trabajadores y no podrán postularse."
          buttonText="Aceptar"
          onClose={() => cambiarEstadoVacante(vacanteId, 'Oculta')}
          styles={clickWindowStyles1}
          icono={<Ionicons name="alert-circle" size={30} color={Colors.violet4} />}
        />

        <ClickWindow
          visible={mostrarAlertaMostrar}
          title="¡CUIDADO!"
          message="Esta publicación volverá a estar visible para los trabajadores en la app."
          buttonText="Aceptar"
          onClose={() => cambiarEstadoVacante(vacanteId, 'Activa')}
          styles={clickWindowStyles1}
          icono={<Ionicons name="alert-circle" size={30} color={Colors.violet4} />}
        />

        <ClickWindow
          visible={mostrarAlertaEliminar}
          title="¡Cuidado!"
          message="Esta acción eliminará la vacante y no podrá ser vista por los trabajadores."
          buttonText="Aceptar"
          cancelButtonText="Cancelar"
          onCancel={() => setMostrarAlertaEliminar(false)}
          onConfirm={() => cambiarEstadoVacante(vacanteId, 'Eliminada')}
          onClose={() => setMostrarAlertaEliminar(false)}
          styles={clickWindowStyles1}
          icono={<Ionicons name="alert-circle" size={40} color={Colors.violet4} />}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <View style={applyStyles.header}>
          <View style={applyStyles.headerTop}>
            <Image
              source={require('@/assets/images/jex/Jex-FotoPerfil.png')}
              style={applyStyles.logoWrapper}
            />

            <View style={applyStyles.headerText}>
              <Text style={applyStyles.eventTitle}>{job.title}</Text>

              <View style={applyStyles.ratingWrapper}>
                {Array.from({ length: stars }).map((_, index) => (
                  <Ionicons
                    key={index}
                    name="star"
                    size={16}
                    style={applyStyles.starsIcon}
                  />
                ))}
              </View>
            </View>
          </View>

          <Image source={require('@/assets/images/maps.png')} style={applyStyles.map} />
        </View>

        {/* Descripción */}
        <View style={applyStyles.section}>
          <Text style={applyStyles.containerTitle}>{job.role}</Text>
          <Text style={applyStyles.containerText}>{job.description}</Text>

          <View style={applyStyles.row}>
            <Ionicons name="calendar-clear" size={20} style={applyStyles.icon} />
            <Text style={applyStyles.containerText}>{job.date}</Text>
          </View>

          <View style={applyStyles.row}>
            <Ionicons name="time" size={20} style={applyStyles.icon} />
            <Text style={applyStyles.containerText}>{job.time}</Text>
          </View>
        </View>

        <View style={applyStyles.separator} />
        <View style={applyStyles.section}>
          <Text style={applyStyles.containerSubtitle}>¿Qué necesitás?</Text>
          {job.requirements.map((item: string, index: number) => (
            <View key={index} style={applyStyles.organizerArea}>
              <Text style={applyStyles.containerBulletPoints}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={applyStyles.separator} />
        <View style={applyStyles.section}>
          <Text style={applyStyles.containerSubtitle}>Turnos disponibles</Text>
          {turnos.map((bloque) => (
            <View key={bloque.id}>
              <Text style={[applyStyles.containerText]}>
                {bloque.dia}
              </Text>
              <View style={applyStyles.tagsContainer}>
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

      </ScrollView>
    </SafeAreaView>
  );
}

