// src/app/employee/vacancy/apply.tsx (o ruta equivalente)
import { Button } from '@/components/button/Button';
import { SelectableTag } from '@/components/button/SelectableTags';
import ImageOnline from '@/components/image/ImageOnline';
import { DotsLoader } from '@/components/others/DotsLoader';
import { ClickWindow } from '@/components/window/ClickWindow';
import { TempWindow } from '@/components/window/TempWindow';
import { iconos } from '@/constants/iconos';
import { useApplyVacancy } from '@/hooks/employee/vacancy/useApplyVacancy';
import { applyVacancyStyles as styles } from '@/styles/app/employee/vacancy/applyVacancyStyles';
import { buttonStyles1 } from '@/styles/components/button/buttonStyles/buttonStyles1';
import { buttonStyles4 } from '@/styles/components/button/buttonStyles/buttonStyles4';
import { selectableTagStyles1 } from '@/styles/components/button/selectableTagsStyles/selectableTagsStyles1';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';
import { tempWindowStyles1 } from '@/styles/components/window/tempWindowStyles1';
import { Colors } from '@/themes/colors';
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LocationMapCard from '@/components/others/LocationMapCard';
import { Ionicons } from '@expo/vector-icons';
import useBackendConection from '@/services/internal/useBackendConection';
import React, { useState } from 'react';

type EmployerRatingItem = {
  id: string;
  rating: number;
  comments: string;
  date: string;
  eventName: string;
  rater: string;
  raterImage: string | null;
};

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
    closeSuccess,
    allShiftsApplied,
    locationAddress,
    locationCoords,
    goBack,
    employerId,
  } = useApplyVacancy();

  const { requestBackend } = useBackendConection();

  // ⭐ Estado modal calificaciones del organizador
  const [ratingsModalVisible, setRatingsModalVisible] = useState(false);
  const [ratingsLoading, setRatingsLoading] = useState(false);
  const [ratingsError, setRatingsError] = useState<string | null>(null);
  const [ratings, setRatings] = useState<EmployerRatingItem[]>([]);

  const loadOrganizerRatings = async () => {
    if (!employerId) {
      setRatingsError('No se pudo identificar al organizador.');
      setRatingsModalVisible(true);
      return;
    }

    try {
      setRatingsModalVisible(true);
      setRatingsLoading(true);
      setRatingsError(null);

      // Asumo endpoint del estilo /api/rating/employer/ratings/{id}/
      const res = await requestBackend(
        `/api/rating/employer/ratings/${employerId}/`,
        null,
        'GET'
      );

      const mapped: EmployerRatingItem[] = (res?.results ?? []).map((r: any, idx: number) => ({
        id: String(idx),
        rating: r.rating,
        comments: r.comments,
        date: r.date,
        eventName: r.event_name,
        rater: r.rater,
        raterImage: r.rater_image ?? null,
      }));

      setRatings(mapped);
    } catch (e: any) {
      setRatingsError(e?.message || 'Error al cargar las calificaciones del organizador.');
    } finally {
      setRatingsLoading(false);
    }
  };

  if (!job || !organizer) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ marginTop: -140 }}>
          <DotsLoader />
        </View>
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

          {/* Mapa + card */}
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
                <Text style={[styles.containerText2]}>{bloque.dia}</Text>

                <View style={styles.multiple}>
                  {bloque.turnos.map((turno) => {
                    const disabled = !!turno.already_applied;

                    return (
                      <View
                        key={turno.id}
                        style={{ opacity: disabled ? 0.5 : 1 }}
                        pointerEvents={disabled ? 'none' : 'auto'}
                      >
                        <SelectableTag
                          styles={{
                            ...selectableTagStyles1,
                            tag: {
                              ...selectableTagStyles1.tag,
                              borderColor: disabled ? Colors.gray3 : Colors.violet4,
                            },
                            tagText: {
                              ...selectableTagStyles1.tagText,
                              color: disabled ? Colors.gray3 : selectableTagStyles1.tagText.color,
                            },
                            tagSubtitle: {
                              ...selectableTagStyles1.tagSubtitle,
                              color: disabled ? Colors.gray3 : selectableTagStyles1.tagSubtitle.color,
                            },
                          }}
                          title={turno.horario}
                          subtitle={disabled ? 'Ya postulado' : turno.paga}
                          iconName="time"
                          selected={turnosSeleccionados.includes(turno.id)}
                          onPress={() => {
                            if (!disabled) handleToggleTurnos(turno.id);
                          }}
                        />
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>

          <View style={styles.separator} />

          <Text style={styles.containerSubtitle}>Conocé al organizador</Text>

          <TouchableOpacity
            style={styles.organizerContainer}
            activeOpacity={0.85}
            onPress={loadOrganizerRatings}
          >
            <View>
              <Image
                source={require('@/assets/images/jex/Jex-FotoPerfil.webp')}
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
                  {Number(organizer.rating).toFixed(1)}{' '}
                  <Text style={{ color: Colors.violet5 }}>★</Text>
                </Text>
                <Text style={styles.organizerInfoLabel}>Puntaje</Text>
              </View>

              <View style={styles.organizerInfoItem}>
                <Text style={styles.organizerInfoValue}>{organizer.jexTime.split(' ')[0]}</Text>
                <Text style={styles.organizerInfoLabel}>Años en Jex</Text>
              </View>
            </View>
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* Pie de postulación */}
      {allShiftsApplied ? (
        <View style={styles.applyBox}>
          <Text style={styles.containerText3}>
            Ya te postulaste a los turnos de esta vacante
          </Text>
        </View>
      ) : (
        <View style={styles.applyBox}>
          <View style={styles.applyBox2}>
            <Text style={styles.salary}>{salarioAMostrar}</Text>
            <Text style={styles.deadline}>Vence el {job.deadline}</Text>
          </View>

          <Button
            onPress={handleApply}
            disabled={!turnoSeleccionadoValido}
            styles={
              turnoSeleccionadoValido
                ? { texto: buttonStyles1.texto, boton: { ...buttonStyles1.boton, width: 150 } }
                : { texto: buttonStyles4.texto, boton: { ...buttonStyles4.boton, width: 150 } }
            }
            texto="Postularme"
            loading={loading}
          />
        </View>
      )}

      {/* ✅ Modal de calificaciones del organizador */}
      <Modal
        visible={ratingsModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setRatingsModalVisible(false)}
      >
        <View style={styles.ratingsModalOverlay}>
          <View style={styles.ratingsModalCard}>
            <View style={styles.ratingsModalHeader}>
              <Text style={styles.ratingsModalTitle}>Opiniones del organizador</Text>
              <TouchableOpacity onPress={() => setRatingsModalVisible(false)}>
                <Ionicons name="close" size={22} color={Colors.violet4} />
              </TouchableOpacity>
            </View>

            {ratingsLoading ? (
              <View style={styles.ratingsModalLoading}>
                <DotsLoader />
              </View>
            ) : ratingsError ? (
              <Text style={styles.ratingsModalError}>{ratingsError}</Text>
            ) : ratings.length === 0 ? (
              <Text style={styles.ratingsModalEmpty}>
                Este organizador aún no tiene calificaciones.
              </Text>
            ) : (
              <ScrollView
                style={styles.ratingsModalList}
                showsVerticalScrollIndicator={false}
              >
                {ratings.map((r) => (
                  <View key={r.id} style={styles.ratingCard}>
                    <View style={styles.ratingCardHeader}>
                      <View style={styles.ratingCardHeaderLeft}>
                        <ImageOnline
                          imageUrl={r.raterImage ?? undefined}
                          size={40}
                          shape="circle"
                          style={styles.ratingAvatar}
                        />
                        <Text style={styles.ratingRaterName}>{r.rater}</Text>
                      </View>

                      <View style={styles.ratingDatePill}>
                        <Text style={styles.ratingDateText}>{r.date}</Text>
                      </View>
                    </View>

                    <Text style={styles.ratingEventName}>{r.eventName}</Text>

                    <View style={styles.ratingStarsRow}>
                      <View style={styles.ratingStarsInner}>
                        {[...Array(5)].map((_, idx) => {
                          const filled = idx + 1 <= Math.floor(r.rating);
                          const half =
                            r.rating - idx >= 0.5 && r.rating - idx < 1;

                          return (
                            <Ionicons
                              key={idx}
                              name={
                                filled
                                  ? 'star'
                                  : half
                                  ? 'star-half'
                                  : 'star-outline'
                              }
                              size={18}
                              color="#ffd103ff"
                              style={{ marginRight: 2 }}
                            />
                          );
                        })}
                      </View>
                      <Text style={styles.ratingValueText}>
                        {r.rating.toFixed(1)}
                      </Text>
                    </View>

                    <View style={styles.ratingCommentBubble}>
                      <Text style={styles.ratingCommentText}>{r.comments}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      <TempWindow
        visible={showSuccess}
        icono={iconos.exito(40, Colors.white)}
        onClose={closeSuccess}
        styles={tempWindowStyles1}
        duration={2000}
      />

      <ClickWindow
        title="Error"
        visible={showError}
        message={errorMessage}
        onClose={() => setShowError(false)}
        styles={clickWindowStyles1}
        icono={iconos.error_outline(30, Colors.white)}
        buttonText="Entendido"
      />
    </SafeAreaView>
  );
}
