import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconButton } from "@/components/button/IconButton";
import { iconButtonStyles1 } from "@/styles/components/button/iconButtonStyles1";
import { Colors } from "@/themes/colors";
import { iconos } from "@/constants/iconos";
import { useAdminPanel } from "@/hooks/employer/useAdminPanel";
import { adminPanelStyles as styles } from "@/styles/app/employer/adminPanelStyles";
import HomeEventsSkeleton from "@/constants/skeletons/employer/homeEventsSkeleton";
import { useGlobalEvent } from "./_layout";
import EventSelectorHeader from "@/components/employer/EventSelectorHeader";

export default function AdminPanelScreen() {
  const { currentEvent, loading } = useGlobalEvent();
  const {
    hasNewNotifications,
    getOrderedButtons,
    goToEditEvent,
    goToVacancies,
    goToAttendance,
    goToNotifications,
    goToQualifications,
    goToReports,
  } = useAdminPanel();

  const [modalVisible, setModalVisible] = useState(false);

  if (loading) return <HomeEventsSkeleton />;

  const stateName = currentEvent?.state?.name ?? '';

  if (!currentEvent) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <EventSelectorHeader />
        <View style={styles.headerRow}>
          <Text style={styles.title}>Eventos</Text>
          <View style={{ marginLeft: 100 }}>
            <View style={styles.notificationIconWrapper}>
              <IconButton
                sizeContent={40}
                styles={iconButtonStyles1}
                onPress={goToNotifications}
                icon={iconos.notification(40, Colors.violet4)}
              />
              {hasNewNotifications && <View style={styles.notificationDot} />}
            </View>
          </View>
        </View>
        <View style={styles.noEventsCard}>
          <Text style={styles.noEventsTitle}>No tienes ningún evento activo</Text>
          <Image
            source={require("@/assets/images/jex/Jex-Sin-Eventos.webp")}
            style={styles.noEventsImage}
            resizeMode="contain"
          />
          <Text style={styles.noEventsSubtitle}>
            Creá tu próximo evento desde el selector de arriba
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const baseButtons = [
    {
      label: "Vacantes",
      icon: iconos.vacantes(22, Colors.violet4),
      action: () => goToVacancies(currentEvent.id),
    },
    {
      label: "Editar Evento",
      icon: iconos.editar(22, Colors.violet4),
      action: () => goToEditEvent(currentEvent.id),
    },
    {
      label: "Asistencia",
      icon: iconos.asistencia(22, Colors.violet4),
      action: () => goToAttendance(currentEvent.id),
    },
    {
      label: "Calificaciones",
      icon: iconos.estrella(22, Colors.violet4),
      action: () => goToQualifications(currentEvent.id),
    },
    {
      label: "Reportes",
      icon: iconos.reportes(22, Colors.violet4),
      action: () => goToReports(currentEvent.id),
    },
  ];

  const orderedButtons = getOrderedButtons(baseButtons, stateName);

  const renderButton = (button: any) => {
    const enabledLabels =
      {
        Borrador: ["Vacantes", "Editar Evento"],
        Publicado: ["Vacantes", "Contratación Tardía"],
        "En curso": ["Asistencia"],
        Finalizado: ["Calificaciones", "Reportes"],
      }[stateName] ?? [];

    const disabled = !enabledLabels.includes(button.label);

    return (
      <TouchableOpacity
        key={button.label}
        style={[styles.card, disabled && styles.cardDisabled]}
        onPress={() => {
          if (disabled) setModalVisible(true);
          else button.action?.();
        }}
        activeOpacity={disabled ? 1 : 0.7}
      >
        <View style={styles.cardContent}>
          {button.icon}
          <Text style={styles.cardText}>{button.label}</Text>
        </View>
        {iconos.flechaDerecha(22, Colors.violet4)}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <EventSelectorHeader />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Panel</Text>
          <View style={{ marginLeft: 170 }}>
            <View style={styles.notificationIconWrapper}>
              <IconButton
                styles={iconButtonStyles1}
                sizeContent={40}
                onPress={goToNotifications}
                icon={iconos.notification(40, Colors.violet4)}
              />
              {hasNewNotifications && <View style={styles.notificationDot} />}
            </View>
          </View>
        </View>

        <View style={styles.cardsContainer}>
          {orderedButtons.map(renderButton)}
        </View>
      </ScrollView>

      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>
              Esta opción está deshabilitada ya que el evento está {stateName}.
            </Text>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
