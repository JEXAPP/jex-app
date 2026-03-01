import { Button } from '@/components/button/Button';
import { SelectableTag } from '@/components/button/SelectableTags';
import { ClickWindow } from '@/components/window/ClickWindow';
import { iconos } from '@/constants/iconos';
import ManipulateVacancySkeleton from '@/constants/skeletons/employer/manipulateVacancySkeleton';
import { useApplyVacancy } from '@/hooks/employee/vacancy/useApplyVacancy';
import { useManipulateVacancy } from '@/hooks/employer/panel/vacancy/useManipulateVacancy';
import { manipulateVacancyStyles as styles } from '@/styles/app/employer/panel/vacancy/manipulateVacancyStyles';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles/buttonStyles1';
import { buttonStyles4 } from '@/styles/components/button/buttonStyles/buttonStyles4';
import { selectableTagStyles1 } from '@/styles/components/button/selectableTagsStyles/selectableTagsStyles1';
import { selectableTagStyles2 } from '@/styles/components/button/selectableTagsStyles/selectableTagsStyles2';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';
import { Colors } from '@/themes/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageOnline from '@/components/image/ImageOnline';
import LocationMapCard from '@/components/others/LocationMapCard';
import { selectableTagStyles3 } from '@/styles/components/button/selectableTagsStyles/selectableTagsStyles3';

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
    publicarDisabled,
    goBack
  } = useManipulateVacancy();

  const {
    job,
    turnos,
    turnosSeleccionados,
    handleToggleTurnos,
    locationAddress,
    locationCoords,
  } = useApplyVacancy();

  const isLoading = loadingEstados || !job;

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.gray1 }} edges={['left', 'right']}>
        <ManipulateVacancySkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        
        <View style={styles.header}>

          <View style={styles.backBtnHero} onTouchEnd={goBack}>
            {iconos.flechaIzquierdaVolver(24, Colors.white)}
          </View>
          
          <View style={styles.tagsContainer}>
            <SelectableTag
              title="Ocultar"
              iconName="eye-off"
              selected={true}
              styles={selectableTagStyles3}
              onPress={() => setAlerta('Ocultar')}
              disabled={!canOcultar}
            />

            <SelectableTag
              title="Mostrar"
              iconName="eye"
              selected={true}
              styles={selectableTagStyles3}
              onPress={() => setAlerta('Mostrar')}
              disabled={!canMostrar}
            />

            <SelectableTag
              title="Editar"
              iconName="pencil"
              selected={true}
              styles={selectableTagStyles3}
              onPress={onIrAEditar}
              disabled={!canEditar}
            />

            <SelectableTag
              title="Eliminar"
              iconName="trash"
              selected={true}
              styles={selectableTagStyles3}
              onPress={() => setAlerta('Eliminar')}
              disabled={!canEliminar}
            />
          </View>

          <View style={styles.headerTop}>
            <ImageOnline
              imageUrl={job.event_image_url}
              imageId={job.event_image_public_id}
              size={80}
              shape="square"
              style={styles.image}
            />
            <View style={styles.headerText}>
              <Text style={styles.eventTitle}>{job.title}</Text>
            </View>
          </View>

          <LocationMapCard
            address={locationAddress || undefined}
            coords={locationCoords || undefined}
            style={{ marginTop: 4 }}
          />
        </View>

        <View style={styles.role}>
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

          <View style={styles.multiple}>
            {turnos.map((bloque) => (
              <View key={bloque.id}>
                <Text style={styles.containerText2}>{bloque.dia}</Text>

                <View style={styles.multiple}>
                  {bloque.turnos.map((turno) => (
                    <SelectableTag
                      key={turno.id}
                      styles={selectableTagStyles1}
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
        </View>
      </ScrollView>

      {canPublicar && (
        <View style={styles.applyBox}>
          <Button
            texto="Publicar"
            onPress={() => setAlerta('Publicar')}
            styles={
              publicarDisabled
                ? { texto: buttonStyles4.texto, boton: { ...buttonStyles4.boton, width: 150 } }
                : { texto: buttonStyles1.texto, boton: { ...buttonStyles1.boton, width: 150 } }
            }
            disabled={publicarDisabled}
          />
        </View>
      )}

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
        icono={iconos.cuidado(30, Colors.white)}
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
        icono={<Ionicons name="alert" size={40} color={Colors.white} />}
      />
    </SafeAreaView>
  );
}