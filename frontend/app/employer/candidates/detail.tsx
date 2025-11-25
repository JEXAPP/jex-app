import { Button } from '@/components/button/Button';
import ImageOnline from '@/components/image/ImageOnline';
import { ClickWindow } from '@/components/window/ClickWindow';
import { iconos } from '@/constants/iconos';
import { useEmployeeDetail } from '@/hooks/employer/candidates/useEmployeeDetail';
import { employeeDetailStyles as s } from '@/styles/app/employer/candidates/employeeDetailStyles';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';
import { Colors } from '@/themes/colors';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  NormalizedExperience,
  NormalizedEducation,
} from '@/hooks/employer/candidates/useEmployeeDetail';
import useBackendConection from '@/services/internal/useBackendConection';
import { DotsLoader } from '@/components/others/DotsLoader';

type RouteParams = { source: 'application' | 'search'; id: string; vacancyId?: string };

type TimelineItem =
  | { kind: 'exp'; key: string; item: NormalizedExperience }
  | { kind: 'edu'; key: string; item: NormalizedEducation };

type RatingAPIItem = {
  rating: number;
  comments: string;
  date: string;
  event_name: string;
  rater: string;
  rater_image?: string | null;
};

type RatingRow = {
  id: string;
  score: number;
  comment: string;
  date: string;
  eventName: string;
  companyName: string;
  reviewerImageUrl: string | null;
};

const RatingItemCard: React.FC<{ item: RatingRow; index: number }> = ({ item, index }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 220,
      delay: index * 70,
      useNativeDriver: true,
    }).start();
    Animated.timing(translateY, {
      toValue: 0,
      duration: 220,
      delay: index * 70,
      useNativeDriver: true,
    }).start();
  }, [index, opacity, translateY]);

  return (
    <Animated.View
      style={[
        s.ratingCard,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {/* Header: avatar + nombre + fecha */}
      <View style={s.ratingCardHeader}>
        <View style={s.ratingCardHeaderLeft}>
          <ImageOnline
            imageUrl={item.reviewerImageUrl ?? undefined}
            size={40}
            shape="square"
            style={s.ratingAvatar}
          />
          <Text style={s.ratingName}>{item.companyName}</Text>
        </View>

        <View style={s.ratingDatePill}>
          <Text style={s.ratingDateText}>{item.date}</Text>
        </View>
      </View>

      {/* Evento */}
      <Text style={s.ratingEventName}>{item.eventName}</Text>

      {/* Rating */}
      <View style={s.ratingRow}>
        <View style={s.ratingStarsSmall}>
          {Array.from({ length: 5 }).map((_, idx) => {
            const filled = idx + 1 <= Math.floor(item.score);
            const half = item.score - idx >= 0.5 && item.score - idx < 1;
            return (
              <Ionicons
                key={idx}
                name={filled ? 'star' : half ? 'star-half' : 'star-outline'}
                size={18}
                color="#ffd103ff"
                style={{ marginRight: 2 }}
              />
            );
          })}
        </View>
        <Text style={s.ratingValue}>{item.score.toFixed(1)}</Text>
      </View>

      {/* Comentario */}
      {item.comment ? (
        <View style={s.ratingCommentBubble}>
          <Text style={s.ratingCommentText}>{item.comment}</Text>
        </View>
      ) : null}
    </Animated.View>
  );
};

export default function EmployeeDetailScreen() {
  const { source, id, vacancyId } = useLocalSearchParams<RouteParams>() as RouteParams;

  const {
    loading,
    error,
    data,
    shiftSummary,
    goBack,
    onGenerateOffer,
    confirmRejectVisible,
    openConfirmReject,
    closeConfirmReject,
    confirmReject,
  } = useEmployeeDetail({ source, id, vacancyId });

  const { requestBackend } = useBackendConection();

  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerImageUrl, setViewerImageUrl] = useState<string | null>(null);

  const [ratingsVisible, setRatingsVisible] = useState(false);
  const [ratingsLoading, setRatingsLoading] = useState(false);
  const [ratingsError, setRatingsError] = useState<string | null>(null);
  const [ratings, setRatings] = useState<RatingRow[]>([]);

  const employeeId = data?.employee_id ?? (source === 'search' ? id : null);

  const headerBadges = useMemo(() => {
    const items: Array<{ icon?: React.ReactNode; text: string; bg: string }> = [];
    if (source === 'search' && data?.approximate_location) {
      items.push({
        icon: <Ionicons name="location-outline" size={18} color={Colors.black} />,
        text: data.approximate_location!,
        bg: Colors.softgreen,
      });
    }
    if (data?.age != null) items.push({ text: `${data.age} Años`, bg: Colors.violet1 });
    return items;
  }, [data, source]);

  const currentCard = data?.shiftCards?.find((c) => c.isCurrent);
  const otherCards = (data?.shiftCards ?? []).filter((c) => !c.isCurrent);

  const languages = data?.languages ?? [];
  const workExperiences = data?.workExperiences ?? [];
  const educations = data?.educations ?? [];

  const timelineItems: TimelineItem[] = useMemo(() => {
    const items: TimelineItem[] = [];

    workExperiences.forEach((e) =>
      items.push({ kind: 'exp', key: `exp-${e.id}`, item: e })
    );
    educations.forEach((e) =>
      items.push({ kind: 'edu', key: `edu-${e.id}`, item: e })
    );

    items.sort((a, b) => b.item.startTimestamp - a.item.startTimestamp); // ya ordenado por inicio
    return items;
  }, [workExperiences, educations]);

  const hasTimeline = timelineItems.length > 0;
  const hasLanguages = languages.length > 0;

  const openImageViewer = (url: string) => {
    setViewerImageUrl(url);
    setViewerVisible(true);
  };

  const closeImageViewer = () => {
    setViewerVisible(false);
    setViewerImageUrl(null);
  };

  const openRatingsModal = async () => {
    if (!employeeId) return;
    setRatingsVisible(true);
    setRatingsLoading(true);
    setRatingsError(null);
    try {
      const res = await requestBackend(
        `/api/rating/employee/ratings/${employeeId}/`,
        null,
        'GET'
      );

      const list: RatingRow[] = (res.results as RatingAPIItem[]).map((r, idx) => ({
        id: `${r.event_name}-${r.date}-${idx}`,
        score: r.rating,
        comment: r.comments ?? '',
        date: r.date,
        eventName: r.event_name,
        companyName: r.rater,
        reviewerImageUrl: r.rater_image ?? null,
      }));

      setRatings(list);
    } catch (e: any) {
      setRatingsError(e?.message || 'Error al cargar calificaciones');
    } finally {
      setRatingsLoading(false);
    }
  };

  const closeRatingsModal = () => {
    setRatingsVisible(false);
  };

  const avg = data?.average_rating ?? 0;
  const count = data?.rating_count ?? 0;
  const ratingsEnabled = !!employeeId && count > 0;

  return (
    <SafeAreaView edges={['left', 'right']} style={s.container}>
      {/* Top violeta */}
      <View style={s.topHero}>
        <View style={s.backBtnHero} onTouchEnd={goBack}>
          {iconos.flechaIzquierdaVolver(24, Colors.white)}
        </View>

        <View style={s.topHeroCenter}>
          <ImageOnline
            imageUrl={data?.profile_image ?? null}
            size={100}
            shape="circle"
            fallback={require('@/assets/images/jex/Jex-Postulantes-Default.webp')}
          />

          <View style={s.linkedRowCenter}>
            {iconos.usuario_validado(16, Colors.white)}
            <Text style={s.linkedTextCenter}>Usuario Vinculado</Text>
          </View>

          <Text style={s.nameCenter}>{data?.name || '—'}</Text>
          {data?.age != null && <Text style={s.ageCenter}>{data.age} Años</Text>}

          {/* Botón unificado de calificaciones */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={ratingsEnabled ? openRatingsModal : undefined}
            disabled={!ratingsEnabled}
            style={[
              s.ratingButton,
              !ratingsEnabled && s.ratingButtonDisabled,
            ]}
          >
            <View style={s.ratingStarsRow}>
              {Array.from({ length: 5 }).map((_, i) =>
                i < Math.round(avg)
                  ? iconos.full_star(20, Colors.white, i)
                  : iconos.empty_star(20, Colors.white, i)
              )}
            </View>
            <Text style={s.ratingButtonText}>
              {avg ? avg.toFixed(1) : '—'} ({count || 0})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido scrolleable */}
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Descripción */}
        {loading ? (
          <View style={[s.descCard, s.skeleton]} />
        ) : error ? (
          <View style={s.descCard}>
            <Text style={s.errorText}>{error}</Text>
          </View>
        ) : (
          <View style={s.descCard}>
            <Text style={s.descText}>{data?.description || 'Sin descripción.'}</Text>
          </View>
        )}

        {/* Ubicación solo en búsqueda */}
        {data?.approximate_location && (
          <ImageBackground
            source={require('@/assets/images/maps-blurred.webp')}
            imageStyle={s.locationBgImage}
            style={s.locationCard}
          >
            <View style={s.locationInner}>
              <Ionicons name="location" size={18} color={Colors.darkgreen} />
              <Text style={s.locationText}>{data.approximate_location}</Text>
            </View>
          </ImageBackground>
        )}

        {/* Turnos postulados (solo source application) */}
        {source === 'application' && (currentCard || otherCards.length > 0) && (
          <>
            {currentCard && <Text style={s.sectionTitle}>Turno Postulado</Text>}
            {currentCard && (
              <View style={s.shiftBlock}>
                <View style={s.shiftRow}>
                  <Text style={s.shiftTime}>{currentCard.time_range_label}</Text>
                  <Text style={s.shiftPay}>{currentCard.payment_label}</Text>
                </View>
                <Text style={s.shiftDateLine}>{currentCard.start_date_label}</Text>
              </View>
            )}

            {otherCards.length > 0 && (
              <Text style={s.sectionTitle}>Otros Turnos Postulados</Text>
            )}
            {otherCards.map((sh, idx) => (
              <View key={sh.id ?? `other-${idx}`} style={s.shiftBlock}>
                <View style={s.shiftRow}>
                  <Text style={s.shiftTime}>{sh.time_range_label}</Text>
                  <Text style={s.shiftPay}>{sh.payment_label}</Text>
                </View>
                <Text style={s.shiftDateLine}>{sh.start_date_label}</Text>
              </View>
            ))}
          </>
        )}

        {/* Idiomas */}
        {hasLanguages && (
          <>
            <Text style={s.sectionTitle}>Idiomas</Text>
            <View style={s.languagesCard}>
              {languages.map((l) => (
                <View key={String(l.id)} style={s.languageItemRow}>
                  <Text style={s.languageName}>{l.name}</Text>
                  {l.level ? (
                    <View style={s.languageLevelBadge}>
                      <Text style={s.languageLevelText}>{l.level}</Text>
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          </>
        )}

        {/* Timeline experiencia + estudios */}
        {hasTimeline && (
          <>
            <Text style={s.sectionTitle}>Experiencia y estudios</Text>
            <View style={s.timelineContainer}>
              {timelineItems.map((tItem, index) => {
                const isLast = index === timelineItems.length - 1;
                const isExp = tItem.kind === 'exp';
                const d = tItem.item;
                const dateLabel = `${d.startDateLabel} — ${d.endDateLabel}`;

                return (
                  <View key={tItem.key} style={s.timelineRow}>
                    <View style={s.timelineCol}>
                      <View style={s.timelineDot} />
                      {!isLast && <View style={s.timelineLine} />}
                    </View>

                    <View style={s.timelineCardWrapper}>
                      <LinearGradient
                        colors={
                          isExp
                            ? [Colors.gray12, Colors.white]
                            : [Colors.violet1, Colors.white]
                        }
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={s.timelineCardInner}
                      >
                        <View style={s.timelineTextCol}>
                          {/* Burbuja Trabajo / Estudio */}
                          <View style={s.timelineTypeBadge}>
                            <Text style={s.timelineTypeBadgeText}>
                              {isExp ? 'Trabajo' : 'Estudio'}
                            </Text>
                          </View>

                          <Text style={s.timelineTitle}>{d.title}</Text>
                          <Text style={s.timelineSub}>{d.place}</Text>
                          <Text style={s.timelineDates}>{dateLabel}</Text>
                          {!!d.description && (
                            <Text style={s.timelineDesc}>{d.description}</Text>
                          )}

                          {d.imageUrls && d.imageUrls.length > 0 && (
                            <View style={s.timelineImagesRow}>
                              {d.imageUrls.slice(0, 3).map((url, idx) => (
                                <TouchableOpacity
                                  key={`${tItem.key}-img-${idx}`}
                                  onPress={() => openImageViewer(url)}
                                  activeOpacity={0.8}
                                >
                                  <ImageOnline
                                    imageUrl={url}
                                    size={70}
                                    shape="square"
                                    style={s.timelineImageThumb}
                                  />
                                </TouchableOpacity>
                              ))}
                            </View>
                          )}
                        </View>
                      </LinearGradient>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>

      {/* Acciones fijas abajo */}
      <View
        style={[
          s.actionsRow,
          source === 'search' && { justifyContent: 'center' },
        ]}
      >
        {source === 'application' && (
          <Button
            texto="Rechazar"
            onPress={openConfirmReject}
            styles={{ boton: s.btnOutline, texto: s.btnOutlineText } as any}
          />
        )}
        <Button
          texto="Ofertar"
          onPress={onGenerateOffer}
          styles={{ boton: s.btnPrimary, texto: s.btnPrimaryText } as any}
        />
      </View>

      {/* Confirmación de rechazo */}
      <ClickWindow
        visible={confirmRejectVisible}
        title="¿Estás seguro?"
        message="Vas a rechazar esta postulación. Esta acción no puede deshacerse."
        buttonText="Rechazar"
        cancelButtonText="Cancelar"
        icono={<Ionicons name="alert-circle" size={28} color={Colors.violet4} />}
        onClose={confirmReject}
        onCancelPress={closeConfirmReject}
        styles={clickWindowStyles1}
      />

      {/* Viewer de imagen a pantalla completa */}
      <Modal
        visible={viewerVisible}
        transparent
        animationType="fade"
        onRequestClose={closeImageViewer}
      >
        <View style={s.imageViewerOverlay}>
          <TouchableOpacity style={s.imageViewerClose} onPress={closeImageViewer}>
            <Ionicons name="close" size={28} color={Colors.white} />
          </TouchableOpacity>
          {viewerImageUrl && (
            <Image
              source={{ uri: viewerImageUrl }}
              style={s.imageViewerImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>

      {/* Modal de calificaciones */}
      <Modal
        visible={ratingsVisible}
        transparent
        animationType="fade"
        onRequestClose={closeRatingsModal}
      >
        <View style={s.ratingModalOverlay}>
          <View style={s.ratingModalCard}>
            <View style={s.ratingModalHeader}>
              <Text style={s.ratingModalTitle}>Calificaciones</Text>
              <TouchableOpacity
                style={s.ratingModalClose}
                onPress={closeRatingsModal}
              >
                <Ionicons name="close" size={24} color={Colors.violet4} />
              </TouchableOpacity>
            </View>

            {ratingsLoading ? (
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <DotsLoader />
              </View>
            ) : ratingsError ? (
              <Text style={s.ratingEmptyText}>{ratingsError}</Text>
            ) : ratings.length === 0 ? (
              <Text style={s.ratingEmptyText}>
                Este trabajador aún no tiene calificaciones.
              </Text>
            ) : (
              <FlatList
                data={ratings}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                  <RatingItemCard item={item} index={index} />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={s.ratingModalList}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
