import React from 'react';
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
import { iconos } from '@/constants/iconos';
import ManipulateVacancySkeleton from '@/constants/skeletons/employer/manipulateVacancySkeleton'; 
import { Button } from '@/components/button/Button';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles/buttonStyles1';
import { buttonStyles4 } from '@/styles/components/button/buttonStyles/buttonStyles4';
import { Card } from '@/components/others/Card';

export default function ManipulateVacancyScreen() {
  const {
    alerta, 
    setAlerta,
    onConfirmOcultar,
    onConfirmMostrar,
    onConfirmEliminar,
    onConfirmActivar,
    onIrAEditar,
    canEditar, 
    canEliminar, 
    canOcultar, 
    canMostrar,
    canPublicar,
    loadingEstados,
    handlePublicar,
    publicarDisabled, 
    estadoActual
  } = useManipulateVacancy();

  const { job, turnos, turnosSeleccionados, handleToggleTurnos } = useApplyVacancy();

  const stars = job?.rating ? Math.round(job.rating) : 0;

  const isLoading = loadingEstados || !job

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.gray1 }} edges={['top', 'left', 'right']}>
        <ManipulateVacancySkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.headerTop}>
        <View style={styles.tagsContainer}>
          {/* Ocultar / Mostrar */}
          <SelectableTag
            title="Ocultar"
            iconName="eye-off"
            selected={false}
            styles={selectableTagStyles2}
            onPress={() => setAlerta('Ocultar')}
            disabled={!canOcultar}
          />

          <SelectableTag
            title="Mostrar"
            iconName="eye"
            selected={false}
            styles={selectableTagStyles2}
            onPress={() => setAlerta('Mostrar')}
            disabled={!canMostrar}
          />

          {/* Editar */}
          <SelectableTag
            title="Editar"
            iconName="pencil"
            selected={false}
            styles={selectableTagStyles2}
            onPress={onIrAEditar}
            disabled={!canEditar}
          />

          {/* Eliminar */}
          <SelectableTag
            title="Eliminar"
            iconName="trash"
            selected={false}
            styles={selectableTagStyles2}
            onPress={() => setAlerta('Eliminar')}
            disabled={!canEliminar}
          />
        </View>

        {/* Alertas */}
        <ClickWindow
          visible={alerta === 'Ocultar'}
          title="¡CUIDADO!"
          message="Al ocultar esta publicación nadie podrá postularse"
          buttonText="Aceptar"
          cancelButtonText="Cancelar"
          onCancelPress={() => setAlerta(null)}
          onClose={onConfirmOcultar}
          styles={clickWindowStyles1}
          icono={iconos.cuidado(30, Colors.white)}
        />
        <ClickWindow
          visible={alerta === 'Mostrar'}
          title="¡CUIDADO!"
          message="Esta publicación volverá a estar visible"
          buttonText="Aceptar"
          cancelButtonText="Cancelar"
          onCancelPress={() => setAlerta(null)}
          onClose={onConfirmMostrar}
          styles={clickWindowStyles1}
          icono={iconos.cuidado(30, Colors.white)}
        />
        <ClickWindow
          visible={alerta === 'Eliminar'}
          title="¡Cuidado!"
          message="Esta acción eliminará la vacante de forma permanente"
          buttonText="Aceptar"
          cancelButtonText="Cancelar"
          onCancelPress={() => setAlerta(null)}
          onClose={onConfirmEliminar}
          styles={clickWindowStyles1}
          icono={<Ionicons name="alert" size={40} color={Colors.violet4} />}
        />

        <ClickWindow
          visible={alerta === 'Publicar'}
          title="¡Cuidado!"
          message="Una vez publicada la vacante no podrás editarla"
          buttonText="Aceptar"
          cancelButtonText="Cancelar"
          onCancelPress={() => setAlerta(null)}
          onClose={onConfirmActivar}
          styles={clickWindowStyles1}
          icono={<Ionicons name="alert" size={40} color={Colors.violet4} />}
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
              <Card
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

      {canPublicar && (
        <Button
          texto="Publicar"
          onPress={() => setAlerta('Publicar')}
          styles={publicarDisabled ? buttonStyles4 : buttonStyles1}
          disabled={publicarDisabled}
        />
      )}
    </SafeAreaView>
  );
}
