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

export default function AdminPanelScreen() {
  const {
    loading,
    events,
    currentEvent,
    currentEventIndex,
    handleNextEvent,
    handlePrevEvent,
    goToCreateEvent,
    goToEditEvent,
    goToVacancies,
    goToAttendance,
    goToNotifications,
    goToQualifications,
    goToReports,
    getOrderedButtons,
    hasNewNotifications, // NUEVO
  } = useAdminPanel();

  const [modalVisible, setModalVisible] = useState(false);

  if (loading) return <HomeEventsSkeleton />;

  if (!currentEvent || events.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Eventos</Text>

          <IconButton
            sizeButton={28}
            styles={iconButtonStyles1}
            onPress={goToCreateEvent}
            icon={iconos.plus(20, Colors.white)}
            backgroundColor={Colors.gray2}
          />

          <View style={{ marginLeft: 100 }}>
            <View style={styles.notificationIconWrapper}>
              <IconButton
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
            Apretá el botón + para crear tu próximo evento
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
      label: "Contratación Tardía",
      icon: iconos.reloj(22, Colors.violet4),
      action: null,
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

  const enabledLabelsByState: Record<string, string[]> = {
    Borrador: ["Vacantes", "Editar Evento"],
    Publicado: ["Vacantes", "Contratación Tardía"],
    "En curso": ["Asistencia"],
    Finalizado: ["Calificaciones", "Reportes"],
  };

  const enabledLabels = enabledLabelsByState[currentEvent.estado?.name] ?? [];
  const orderedButtons = getOrderedButtons(baseButtons);

  const renderButton = (button: any) => {
    const enabledLabels =
      {
        Borrador: ["Vacantes", "Editar Evento"],
        Publicado: ["Vacantes", "Contratación Tardía"],
        "En curso": ["Asistencia"],
        Finalizado: ["Calificaciones", "Reportes"],
      }[currentEvent.estado?.name] ?? [];

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
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Eventos</Text>

          <IconButton
            sizeButton={24}
            sizeContent={22}
            styles={iconButtonStyles1}
            onPress={goToCreateEvent}
            icon={iconos.plus(22, Colors.white)}
            backgroundColor={Colors.gray2}
          />

          <View style={{ marginLeft: 100 }}>
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

        <View style={styles.eventRow}>
          <View style={styles.sideSlot}>
            {currentEventIndex > 0 && (
              <TouchableOpacity onPress={handlePrevEvent}>
                {iconos.flechaIzquierda(24, Colors.violet4)}
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.centerSlot}>
            <Text style={styles.eventName}>{currentEvent?.nombre}</Text>
          </View>

          <View style={styles.sideSlot}>
            {currentEventIndex < events.length - 1 && (
              <TouchableOpacity onPress={handleNextEvent}>
                {iconos.flechaDerecha(24, Colors.violet4)}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {currentEvent?.estado?.name && (
          <View style={styles.eventEstadoBadge}>
            <Text style={styles.eventEstadoText}>{currentEvent.estado.name}</Text>
          </View>
        )}

        <View style={styles.cardsContainer}>
          {orderedButtons.map(renderButton)}
        </View>
      </ScrollView>

      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>
              Esta opción está deshabilitada ya que el evento está {currentEvent?.estado?.name}.
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
