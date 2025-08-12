import { SelectableTag } from '@/components/button/SelectableTags';
import { ClickWindow } from '@/components/window/ClickWindow';
import { useApplyVacancy } from '@/hooks/employee/vacancy/useApplyVacancy';
import { useManipulateVacancy } from '@/hooks/employer/vacancy/useManipulateVacancy';
import { manipulateVacancyStyles as styles } from '@/styles/app/employer/vacancy/manipulateVacancyStyles';
import { selectableTagStyles2 } from '@/styles/components/button/selectableTagsStyles/selectableTagsStyles2';
import { selectableTagStyles1 } from '@/styles/components/button/selectableTagsStyles/selectableTagsStyles1';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';
import { Colors } from '@/themes/colors';
import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function ManipulateVacancyScreen() {
  const router = useRouter();

  const {
    vacanteId,
    vacanteOculta,
    setVacanteOculta,
    alerta, setAlerta,
    onConfirmOcultar,
    onConfirmMostrar,
    onConfirmEliminar
  } = useManipulateVacancy();

  const { job, turnos, turnosSeleccionados, handleToggleTurnos } = useApplyVacancy();

  const stars = job?.rating ? Math.round(job.rating) : 0;

  if (!job) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando datos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.headerTop}>
        <View style={styles.tagsContainer}>
          <SelectableTag
            title={vacanteOculta ? 'Mostrar' : 'Ocultar'}
            iconName={vacanteOculta ? 'eye' : 'eye-off'}
            selected={vacanteOculta}
            styles={selectableTagStyles2}
            onPress={() => setAlerta(vacanteOculta ? 'Mostrar' : 'Ocultar')}
          />
          <SelectableTag
            title="Editar"
            iconName="pencil"
            selected={false}
            onPress={() => router.push(`./vacancy/edit-vacancy?id=${vacanteId}`)}
            styles={selectableTagStyles2}
          />
          <SelectableTag
            title="Eliminar"
            iconName="trash"
            selected={false}
            onPress={() => setAlerta('Eliminar')}
            styles={selectableTagStyles2}
          />
        </View>

        {/* Alertas */}
        <ClickWindow
          visible={alerta === 'Ocultar'}
          title="¡CUIDADO!"
          message="Al ocultar esta publicación..."
          buttonText="Aceptar"
          cancelButtonText="Cancelar"
          onCancelPress={() => setAlerta(null)}
          onClose={onConfirmOcultar}
          styles={clickWindowStyles1}
          icono={<Ionicons name="alert-circle" size={30} color={Colors.violet4} />}
        />
        <ClickWindow
          visible={alerta === 'Mostrar'}
          title="¡CUIDADO!"
          message="Esta publicación volverá a estar visible..."
          buttonText="Aceptar"
          cancelButtonText="Cancelar"
          onCancelPress={() => setAlerta(null)}
          onClose={onConfirmMostrar}
          styles={clickWindowStyles1}
          icono={<Ionicons name="alert-circle" size={30} color={Colors.violet4} />}
        />

        <ClickWindow
          visible={alerta === 'Eliminar'}
          title="¡Cuidado!"
          message="Esta acción eliminará la vacante..."
          buttonText="Aceptar"
          cancelButtonText="Cancelar"
          onCancelPress={() => setAlerta(null)}
          onClose={onConfirmEliminar}
          styles={clickWindowStyles1}
          icono={<Ionicons name="alert-circle" size={40} color={Colors.violet4} />}
        />
      </View>

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
                {Array.from({ length: stars }).map((_, i) => (
                  <Ionicons key={i} name="star" size={16} style={styles.starsIcon} />
                ))}
              </View>
            </View>
          </View>

          <Image source={require('@/assets/images/maps.png')} style={styles.map} />
        </View>

        <Text style={styles.containerTitle}>{job.role}</Text>
        <Text style={styles.containerText}>{job.description}</Text>

        <Text style={styles.containerSubtitle}>¿Qué necesitás?</Text>
        {job.requirements.map((item: string, idx: number) => (
          <View key={idx} style={styles.organizerArea}>
            <Text style={styles.bulletNumber}>{idx + 1}.</Text>
            <Text style={styles.containerBulletPoints}>{item}</Text>
          </View>
        ))}

        <Text style={styles.containerSubtitle}>Turnos disponibles</Text>
        {turnos.map((bloque) => (
          <View key={bloque.id}>
            <Text style={styles.containerText2}>{bloque.dia}</Text>
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
      </ScrollView>
    </SafeAreaView>
  );
}
