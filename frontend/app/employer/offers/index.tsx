import StateOffersSkeleton from "@/constants/skeletons/employer/offers/stateOffersSkeleton";
import { FilterStatus, useStateOffers } from "@/hooks/employer/offers/useStateOffers";
import { stateOffersStyles as styles } from "@/styles/app/employer/offers/stateOffersStyles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { DotsLoader } from "@/components/others/DotsLoader";


export default function StateOffersScreen() {
  const {
    currentEvent,
    goNextEvent,
    goPrevEvent,
    canGoNext,
    canGoPrev,
    filter,
    setFilter,
    filteredOffers,
    offers,
    events,
    loading,
    loadingEvents
  } = useStateOffers();

  if (loadingEvents) {
  return <StateOffersSkeleton />;
}

  if (events.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Ofertas</Text>
        <View style={styles.noEventsContainer}>
          <Text style={styles.noEventsTitle}>Aún no has creado ningún evento</Text>
          <Image
            source={require("@/assets/images/jex/Jex-Sin-Eventos.png")}
            style={styles.noEventsImage}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  }

  const hasOffersForEvent = offers.some((o) => o.eventId === currentEvent.id);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ofertas</Text>

      {/* Evento actual con navegación */}
      <View style={styles.eventHeader}>
        {canGoPrev && (
          <TouchableOpacity style={styles.eventNavButton} onPress={goPrevEvent}>
            <Ionicons name="chevron-back" size={20} color= {"#4B0082"} />
          </TouchableOpacity>
        )}

        <View style={styles.eventNameContainer}>
  <Text style={styles.eventName}>{currentEvent.name}</Text>

  {/* Estado del evento */}
  <View style={styles.eventStateBadge}>
    <Text style={styles.eventStateText}>{currentEvent.state?.name}</Text>
  </View>
</View>


        {canGoNext && (
          <TouchableOpacity style={styles.eventNavButton} onPress={goNextEvent}>
            <Ionicons name="chevron-forward" size={20} color={"#4B0082"} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros */}
      <View style={styles.filterContainer}>
        {(["Pendientes", "Aceptadas", "Rechazadas", "Vencidas"] as FilterStatus[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterButton, filter === f && styles.filterButtonActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <DotsLoader />   
      ) : !hasOffersForEvent ? (
        <View style={styles.generalEmptyContainer}>
          <Text style={styles.generalEmptyTitle}>Sin Ofertas</Text>
          <Image
            source={require("@/assets/images/jex/Jex-Sin-Eventos.png")}
            style={styles.generalEmptyImage}
            resizeMode="contain"
          />
        </View>
      ) : filteredOffers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Sin Ofertas de este tipo</Text>
          <Image
            source={require("@/assets/images/jex/Jex-Sin-Eventos.png")}
            style={styles.emptyImage}
            resizeMode="contain"
          />
        </View>
      ) : (
        <FlatList
          data={filteredOffers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.offerCard}>
              <View style={styles.statusBadge}>
                <Text
                  style={[
                    styles.statusText,
                    filter === "Vencidas"
                      ? styles.statusRechazada
                      : item.status === "Pendiente"
                      ? styles.statusPendiente
                      : item.status === "Aceptada"
                      ? styles.statusAceptada
                      : styles.statusRechazada,
                  ]}
                >
                  {filter === "Vencidas" ? "Vencida" : item.status}
                </Text>
              </View>

              <View style={styles.offerHeader}>
                <Image source={item.employeeImage} style={styles.employeeImage} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.employeeName}>{item.employeeName}</Text>

                  <View style={styles.rowPills}>
                    <View style={styles.rolePill}>
                      <Text style={styles.roleText}>{item.role}</Text>
                    </View>
                    <View style={styles.salaryPill}>
                      <Text style={styles.salaryText}>{item.salary} ARS</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.datePill}>
                <Ionicons name="calendar" size={14} color="#6B6B6B" />
                <Text style={styles.date}>
                  {`${item.fechaInicio} ${item.horaInicio} - ${item.horaFin}`}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
