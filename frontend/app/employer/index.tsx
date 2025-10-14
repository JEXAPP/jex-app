import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconButton } from "@/components/button/IconButton";
import { iconButtonStyles1 } from "@/styles/components/button/iconButtonStyles1";
import { Colors } from "@/themes/colors";
import { iconos } from "@/constants/iconos";
import { useAdminPanel } from "@/hooks/employer/useAdminPanel";
import { adminPanelStyles as styles } from "@/styles/app/employer/adminPanelStyles";
import HomeEventsSkeleton from "@/constants/skeletons/employer/homeEventsSkeleton";
import { Card } from "@/components/cards/Card";


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
    goToAttendance
  } = useAdminPanel();

  if (loading) {
  return <HomeEventsSkeleton />;
}

if (events.length === 0) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Eventos</Text>
        <IconButton
          sizeButton={24}
          sizeContent={22}
          styles={iconButtonStyles1}
          onPress={goToCreateEvent}
          content="+"
          backgroundColor={Colors.gray2} 
          contentColor={Colors.white}
        />
      </View>

      {/* Card de no hay eventos */}
      <View style={styles.noEventsCard}>
        <Text style={styles.noEventsTitle}>No tienes ningún evento activo</Text>

        <Image
          source={require('@/assets/images/jex/Jex-Sin-Eventos.png')}
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

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Eventos</Text>
          <IconButton
            sizeButton={24}
            sizeContent={22}
            styles={iconButtonStyles1}
            onPress={goToCreateEvent}
            content="add"
            backgroundColor={Colors.gray2}
            contentColor={Colors.white}
          />
        </View>

        {/* Event navigation */}
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

        {/* Cards */}
        <View style={styles.cardsContainer}>
          <Card
            label="Vacantes"
            leftIcon={iconos.vacantes(22, Colors.violet4)}
            onPress={() => goToVacancies(currentEvent.id)}
          />

          <Card
            label="Editar Evento"
            leftIcon={iconos.editar(22, Colors.violet4)}
            onPress={() => goToEditEvent(currentEvent.id)}
          />

          <Card
              label="Asistencia"
              leftIcon={iconos.asistencia(22, Colors.violet4)}
              onPress={() => goToAttendance(currentEvent.id)}
          />

          <Card
            label="Contratación Tardía"
            leftIcon={iconos.reloj(22, Colors.violet4)}
          />

          <Card
            label="Calificaciones"
            leftIcon={iconos.estrella(22, Colors.violet4)}
          />

          <Card
            label="Reportes"
            leftIcon={iconos.reportes(22, Colors.violet4)}
          />

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
