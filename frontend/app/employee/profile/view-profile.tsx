import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/themes/colors";
import ImageOnline from "@/components/image/ImageOnline";
import { useMyPublicProfileView, NormalizedEducation, NormalizedExperience, } from "@/hooks/employee/profile/useViewProfile";
import { employeeDetailStyles as s } from "@/styles/app/employer/candidates/employeeDetailStyles";
import { LinearGradient } from "expo-linear-gradient";
import { iconos } from "@/constants/iconos";
import { IconButton } from "@/components/button/IconButton";
import { iconButtonStyles1 } from "@/styles/components/button/iconButtonStyles1";
import { DotsLoader } from "@/components/others/DotsLoader";
import { router } from "expo-router";

type TimelineItem =
  | { type: "exp"; key: string; item: NormalizedExperience }
  | { type: "edu"; key: string; item: NormalizedEducation };

export default function ViewMyPublicProfileScreen() {
  const { data, loading, error } = useMyPublicProfileView();

  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerImageUrl, setViewerImageUrl] = useState<string | null>(null);

  const openImageViewer = (url: string) => {
    setViewerImageUrl(url);
    setViewerVisible(true);
  };
  const closeViewer = () => {
    setViewerImageUrl(null);
    setViewerVisible(false);
  };

  // ORDENADO POR FECHA DE INICIO (startTimestamp DESC)
  const timelineItems: TimelineItem[] = useMemo(() => {
    if (!data) return [];

    const list: TimelineItem[] = [];

    data.experiences.forEach((exp) =>
      list.push({ type: "exp", key: `exp-${exp.id}`, item: exp })
    );
    data.educations.forEach((edu) =>
      list.push({ type: "edu", key: `edu-${edu.id}`, item: edu })
    );

    list.sort((a, b) => {
      const ta = a.item.startTimestamp ?? 0;
      const tb = b.item.startTimestamp ?? 0;
      return tb - ta; // más reciente primero
    });

    return list;
  }, [data]);

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <DotsLoader />
      </SafeAreaView>
    );
  }

  if (error && !data) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text style={{ color: Colors.violet4 }}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container} edges={["left", "right"]}>
      {/* Header violeta */}
      <View style={{ ...s.topHero, paddingTop: 40 }}>
        {/* Botón volver */}
        <View style={s.backBtnHero} onTouchEnd={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </View>

        {/* Botón editar */}
        <View style={{ ...s.editButtonTop, marginTop: 30 }}>
          <IconButton
            onPress={() => console.log("EDITAR PERFIL")}
            sizeButton={28}
            backgroundColor="transparent"
            icon={iconos.edit(25, Colors.white)}
            styles={iconButtonStyles1}
          />
        </View>

        <View style={s.topHeroCenter}>
          <ImageOnline
            imageUrl={data?.profileImage ?? null}
            size={100}
            shape="circle"
            fallback={require("@/assets/images/jex/Jex-Postulantes-Default.webp")}
          />

          <Text style={s.nameCenter}>{data?.fullName}</Text>
          {data?.age != null && (
            <Text style={s.ageCenter}>{data.age} Años</Text>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Descripción */}
        <View style={s.descCard}>
          <Text style={s.descText}>{data?.description || "Sin descripción."}</Text>
        </View>

        {/* Ubicación */}
        {data?.address && (
          <ImageBackground
            source={require("@/assets/images/maps-blurred.webp")}
            imageStyle={s.locationBgImage}
            style={s.locationCard}
          >
            <View style={s.locationInner}>
              <Ionicons name="location" size={18} color={Colors.darkgreen} />
              <Text style={s.locationText}>{data.address}</Text>
            </View>
          </ImageBackground>
        )}

        {/* Idiomas */}
        {data?.languages?.length ? (
          <>
            <Text style={s.sectionTitle}>Idiomas</Text>
            <View style={s.languagesCard}>
              {data.languages.map((l) => (
                <View key={String(l.id)} style={s.languageItemRow}>
                  <Text style={s.languageName}>{l.name}</Text>
                  {l.level && (
                    <View style={s.languageLevelBadge}>
                      <Text style={s.languageLevelText}>{l.level}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </>
        ) : null}

        {/* Timeline */}
        {timelineItems.length > 0 && (
          <>
            <Text style={s.sectionTitle}>Experiencia y estudios</Text>

            <View style={s.timelineContainer}>
              {timelineItems.map((t, idx) => {
                const isLast = idx === timelineItems.length - 1;
                const isExp = t.type === "exp";
                const d = t.item;

                return (
                  <View key={t.key} style={s.timelineRow}>
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
                          {/* BURBUJA TRABAJO / ESTUDIO */}
                          <View style={s.timelineTypeBadge}>
                            <Text style={s.timelineTypeBadgeText}>
                              {isExp ? "Trabajo" : "Estudio"}
                            </Text>
                          </View>

                          <Text style={s.timelineTitle}>{d.title}</Text>
                          <Text style={s.timelineSub}>{d.place}</Text>
                          <Text style={s.timelineDates}>
                            {d.startDateLabel} — {d.endDateLabel}
                          </Text>

                          {!!d.description && (
                            <Text style={s.timelineDesc}>{d.description}</Text>
                          )}

                          {(d.imageUrls?.length ?? 0) > 0 && (
                            <View style={s.timelineImagesRow}>
                              {d.imageUrls.slice(0, 3).map((url, i) => (
                                <TouchableOpacity
                                  key={i}
                                  onPress={() => openImageViewer(url)}
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

      {/* Viewer de imagen */}
      <Modal
        visible={viewerVisible}
        transparent
        animationType="fade"
        onRequestClose={closeViewer}
      >
        <View style={s.imageViewerOverlay}>
          <TouchableOpacity style={s.imageViewerClose} onPress={closeViewer}>
            <Ionicons name="close" size={30} color={Colors.white} />
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
    </SafeAreaView>
  );
}
